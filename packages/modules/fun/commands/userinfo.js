const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    permission: 0,
    defaultPerm: PermissionFlagsBits.ViewChannel,
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Lookup info about a specific member.')
        .addUserOption(option => option.setName('member').setDescription('The member you want to lookup.').setRequired(true))
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {
        const targetUser = interaction.options.getUser('member');

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

        const userinfoEmbed = new EmbedBuilder()
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

        await interaction.reply({ embeds: [userinfoEmbed] });

    },
};

module.exports.config = {
    name: "userinfo",
    usage: "**/userinfo [member]**",
    description: "Lookup info about a specific member.",
    permission: 0
}