const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, InteractionContextType, MessageFlags } = require('discord.js');

const ms = require('ms');

const TimeoutMember = require('../functions/timeout');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Manage a member\'s timeout.')
        .addSubcommand(subcommand => subcommand.setName('give').setDescription('Give a timeout to a member').addUserOption(option => option.setName('member').setDescription('The member you want to timeout.').setRequired(true)).addStringOption(option => option.setName('duration').setDescription('The duration for the timeout.').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('The reason for the timeout.').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove a timeout from a member').addUserOption(option => option.setName('member').setDescription('The member who\'s timeout you want to remove.').setRequired(true)).addStringOption(option => option.setName('reason').setDescription('The reason for removing the timeout.').setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {

        if (interaction.options.getSubcommand() === "give") {
            await interaction.deferReply();

            const targetUser = interaction.options.getUser('member');

            const targetReason = interaction.options.getString('reason');

            const targetDuration = interaction.options.getString('duration');

            let correctDur = ms(targetDuration);

            let sameperm = new EmbedBuilder()
                .setTitle("Command Error")
                .setDescription(`<:fail:1355336960729682021> You cannot moderate members with the same permissions`)
                .setColor("Red")

            let notinguild = new EmbedBuilder()
                .setTitle("Command Error")
                .setDescription(`<:fail:1355336960729682021> Could not fetch member`)
                .setColor("Red")

            let undefinedtime = new EmbedBuilder()
                .setTitle("Command Error")
                .setDescription(`<:fail:1355336960729682021> Please specify a correct duration (2s, 4 months, ect.)`)
                .setColor("Red")

            const Guild = await client.guilds.fetch(interaction.guild.id);

            let Mem = Guild.members.cache.find(member => member.id === targetUser.id);

            if (!Mem) {
                return await interaction.reply({ embeds: [notinguild], flags: MessageFlags.Ephemeral });
            }

            // if (Mem.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            //     return await interaction.reply({ embeds: [sameperm], flags: MessageFlags.Ephemeral });
            // }

            if (correctDur === undefined) {
                return await interaction.reply({ embeds: [undefinedtime], flags: MessageFlags.Ephemeral });
            }

            let memtotimeout = new TimeoutMember(interaction.guild.id, targetUser.id, targetReason, correctDur, client, interaction.member);

            let muted = await memtotimeout.mute();

            const muteBed = new EmbedBuilder()
                .setTitle(muted.title)
                .setDescription(muted.desc)
                .setColor("Green")
                .setFooter({ text: muted.footer })
                .setTimestamp(new Date())

            await interaction.editReply({ embeds: [muteBed] });
        }

        if (interaction.options.getSubcommand() === "remove") {
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

            let memtotimeout = new TimeoutMember(interaction.guild.id, targetUser.id, targetReason, null, client, interaction.member);

            let muted = await memtotimeout.unmute();

            const muteBed = new EmbedBuilder()
                .setTitle(muted.title)
                .setDescription(muted.desc)
                .setColor("Green")
                .setTimestamp(new Date())

            await interaction.editReply({ embeds: [muteBed] });
        }

    },
};

module.exports.config = {
    name: "timeout",
    usage: "**/timeout [member] [duration] [reason]**",
    description: "Timeout a member."
}