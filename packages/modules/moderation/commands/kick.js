const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, InteractionContextType, MessageFlags } = require('discord.js');

const KickMember = require('../functions/kick');

module.exports = {
    permission: 3,
    defaultPerm: PermissionFlagsBits.KickMembers,
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server.')
        .addUserOption(option => option.setName('member').setDescription('The member you want to kick.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the kicking.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {
        await interaction.deferReply();

        const targetUser = interaction.options.getUser('member');

        const targetReason = interaction.options.getString('reason');

        let sameperm = new EmbedBuilder()
            .setTitle("Command Error")
            .setDescription(`<:fail:1355336960729682021> You cannot moderate members with the same permissions`)
            .setColor("Red")

        let notinguild = new EmbedBuilder()
            .setTitle("Command Error")
            .setDescription(`<:fail:1355336960729682021> Could not fetch member`)
            .setColor("Red")

        const Guild = await client.guilds.fetch(interaction.guild.id);

        let Mem = Guild.members.cache.find(member => member.id === targetUser.id);

        if (!Mem) {
            return await interaction.editReply({ embeds: [notinguild], flags: MessageFlags.Ephemeral });
        }

        if (Mem.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return await interaction.editReply({ embeds: [sameperm], flags: MessageFlags.Ephemeral });
        }

        let memtokick = new KickMember(interaction.guild.id, targetUser.id, targetReason, client, interaction.member);

        let kicked = await memtokick.kick();

        const warnBed = new EmbedBuilder()
            .setTitle(kicked.title)
            .setDescription(kicked.desc)
            .setColor("Green")
            .setTimestamp(new Date())

        await interaction.editReply({ embeds: [warnBed] });

    },
};

module.exports.config = {
    name: "kick",
    usage: "**/kick [member] [reason]**",
    description: "Kick a member from the server.",
    permission: 3
}