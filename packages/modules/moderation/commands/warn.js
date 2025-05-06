const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, InteractionContextType, MessageFlags } = require('discord.js');

const WarnMember = require('../functions/warn');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Give a member a warning.')
        .addUserOption(option => option.setName('member').setDescription('The member you want to warn.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the warning.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
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
            return await interaction.reply({ embeds: [notinguild], flags: MessageFlags.Ephemeral });
        }

        if (Mem.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return await interaction.reply({ embeds: [sameperm], flags: MessageFlags.Ephemeral });
        }

        let memtowarn = new WarnMember(interaction.guild.id, targetUser.id, targetReason, client, interaction.member);

        let warned = await memtowarn.warn();

        const warnBed = new EmbedBuilder()
            .setTitle(warned.title)
            .setDescription(warned.desc)
            .setColor("Green")
            .setFooter({ text: warned.footer })
            .setTimestamp(new Date())

        await interaction.editReply({ embeds: [warnBed] });

    },
};

module.exports.config = {
    name: "warn",
    usage: "**/warn [member] [reason]**",
    description: "Give a member a warning."
}