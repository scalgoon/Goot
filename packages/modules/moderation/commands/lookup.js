const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');

const prisma = require('../../../../utils/prismaClient.js');
const pagination = require('../../../../utils/pagination.js');
const { userHeatLevel } = require('../../../../bot.js');
const VerifyMember = require('../functions/verifyMember.js');

module.exports = {
    permission: 1,
    defaultPerm: PermissionFlagsBits.ManageMessages,
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

        const noMemberFound = new EmbedBuilder()
            .setDescription(`<:fail:1355336960729682021> You cannot fetch members that are not in the guild.`)
            .setColor("Red")

        try {
            member = await interaction.guild.members.fetch(targetUser.id);
        } catch (e) {
            return await interaction.reply({ embeds: [noMemberFound], flags: MessageFlags.Ephemeral });
        }

        let userNickname = member.displayName ?? "No Nickname";

        let memberRoles = member.roles.cache.filter((roles) => roles.id !== interaction.guild.id).map((role) => role.toString());

        let botStatus = targetUser.bot ? "Member is a bot" : "Member is not a bot";

        const embeds = [];

        const pageOneEmbed = new EmbedBuilder()
            .setAuthor({ name: `Information about ${targetUser.username}`, iconURL: interaction.member.displayAvatarURL() })
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

        embeds.push(pageOneEmbed);

        // Look up logs

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

        const paginateLogs = (array, n) => {
            const pageSize = Math.ceil(array.length / n);

            return Array.from({ length: pageSize }, (_, index) => {
                const start = index * n;
                return array.slice(start, start + n);
            });
        };

        if (userInfo.logs.length === 0 || !userInfo) {
            const pageTwoEmbed = new EmbedBuilder()
                .setAuthor({ name: `Logs for ${targetUser.username}`, iconURL: interaction.member.displayAvatarURL() })
                .setThumbnail(userAvatar)
                .setDescription(`-# Heat Level: ${memHeat}`)
                .addFields({ name: `Moderation Logs`, value: `*Member has no logs in the database*` })
                .setColor("#911729")
                .setFooter({ text: `Total of ${userInfo.logs.length} cases` })
                .setTimestamp(new Date())

            embeds.push(pageTwoEmbed);
        } else {
            const paginatedLogs = paginateLogs(userInfo.logs, 5);

            for (let i = 0; i < paginatedLogs.length; i++) {

                const userLogs = paginatedLogs[i].slice(0, 5).map((item) => `\n**Log ID: ${item.logid}**\n${item.action} (+${item.heatlvl}) by ${item.staff} - ${item.timestamp}\n-# Duration: ${item.duration ?? "N/A"}\n-# Reason: ${item.reason}`).join('\n');

                const dynamicEmbed = new EmbedBuilder()
                    .setAuthor({ name: `Logs for ${targetUser.username}`, iconURL: interaction.member.displayAvatarURL() })
                    .setThumbnail(userAvatar)
                    .setDescription(`-# Heat Level: ${memHeat}`)
                    .addFields({ name: `Moderation Logs`, value: userLogs })
                    .setColor("#911729")
                    .setFooter({ text: `Total of ${userInfo.logs.length} cases` })
                    .setTimestamp(new Date())

                embeds.push(dynamicEmbed);
            }
        }

        await pagination(interaction, embeds);

    },
};

module.exports.config = {
    name: "lookup",
    usage: "**/lookup [member]**",
    description: "Lookup info about a specific member.",
    permission: 1
}