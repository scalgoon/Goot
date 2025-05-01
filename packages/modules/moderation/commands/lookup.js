const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');

const prisma = require('../../../../utils/prismaClient.js');
const pagination = require('../../../../utils/pagination.js');
const { userHeatLevel } = require('../../../../bot.js');
const VerifyMember = require('../functions/verifyMember.js');

const { log } = require('util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lookup')
        .setDescription('Lookup info about a specific member.')
        .addUserOption(option => option.setName('member').setDescription('The member you want to lookup.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {

        const targetUser = interaction.options.getUser('member');

        let memtoverify = new VerifyMember(interaction.guild.id, targetUser.id);

        await memtoverify.verify();

        let userAvatar = targetUser.displayAvatarURL();

        let member;

        try {
           member = await interaction.guild.members.fetch(targetUser.id);
        } catch (e) {
            return await interaction.reply({ content: "Cannot fetch members that are not in the guild.", flags: MessageFlags.Ephemeral });
        }

        let userNickname = member.displayName || "No Nickname";

        let memberRoles = member.roles.cache.filter((roles) => roles.id !== interaction.guild.id).map((role) => role.toString());

        let botStatus = targetUser.bot ? "Member is a bot" : "Member is not a bot";

        const pageOneEmbed = new EmbedBuilder()
            .setTitle(`${targetUser.username.toUpperCase()}'s Information`)
            .setThumbnail(userAvatar)
            .setDescription(`**Bot Check**:\n-# ${botStatus}`)
            .addFields({
                name: `Joined Discord`,
                value: `<t:${Math.floor(targetUser.createdAt.getTime() / 1000)}:R>`,
                inline: true
            })
            .addFields({
                name: `Joined Server`,
                value: `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>`,
                inline: true
            })
            .addFields({ name: `Member Nickname`, value: `${userNickname}` })
            .addFields({ name: "⠀", value: "⠀" })
            .addFields({ name: `Boosted Status`, value: member.premiumSince ? "Member has boosted server" : "Member has not boosted server" })
            .addFields({ name: `Member's Roles [${memberRoles.length}]`, value: `${memberRoles}` })
            .setColor("#911729")
            .setFooter({ text: `User ID: ${targetUser.id}` })
            .setTimestamp(new Date())

        const userInfo = await prisma.user.findUnique({
            where: {
                id: `${interaction.guild.id}_${targetUser.id}`
            },
            select: {
                logs: true
            }
        })

        let memHeat;

        let heatDBCheck = userHeatLevel.get(`${targetUser.id}_${interaction.guild.id}`);

        if (!heatDBCheck) {
            memHeat = "0";
        } else if (userInfo === null) {
            memHeat = "N/A (Member not in database)";
        } else {
            memHeat = heatDBCheck;
        }

        const pageTwoEmbed = new EmbedBuilder()
        .setTitle(`${targetUser.username.toUpperCase()}'s Logs`)
        .setThumbnail(userAvatar)
        .setDescription(`-# Heat Level: ${memHeat}`)
        .setColor("#911729")
        .setFooter({ text: `Total of ${userInfo.logs.length} cases` })
        .setTimestamp(new Date())

        if (userInfo.logs.length === 0 || !userInfo) {
            pageTwoEmbed.addFields({ name: `Moderation Logs`, value: `*Member has no logs in the database*` });
        } else {
            const userLogs = userInfo.logs.slice(0, 5).map((item) => `\n**Log ID: ${item.logid}**\n${item.action} (+${item.heatlvl}) by ${item.staff} - ${item.timestamp}\n-# Reason: ${item.reason}`).join('\n');

            pageTwoEmbed.addFields({ name: `Moderation Logs`, value: userLogs });
        }

        const embeds = [];
        for (var i = 0; i < 2; i++) {
            if (i + 1 == 1) embeds.push(pageOneEmbed);
            if (i + 1 == 2) embeds.push(pageTwoEmbed);
        }

        await pagination(interaction, embeds);

    },
};

module.exports.config = {
    name: "lookup",
    usage: "**/lookup [member]**",
    description: "Lookup info about a specific member."
}