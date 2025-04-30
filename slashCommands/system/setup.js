const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionFlagsBits, InteractionContextType, ChannelType } = require('discord.js');

const prisma = require('../../utils/prismaClient');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Update guild settings.')
        .addSubcommand(subcommand => subcommand.setName('log-channel').setDescription('Set where events are logged').addChannelOption(option => option.setName('channel').setDescription('Select a channel').addChannelTypes(ChannelType.GuildText).setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('prefix').setDescription('Set what prefix custom commands use').addStringOption(option => option.setName('prefix').setDescription('Specify a prefix').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove a setting').addStringOption(option => option.setName('setting').setDescription('Select a setting').addChoices({ name: 'Log Channel', value: 'logchannel' }).setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {

        const GuildSettings = await prisma.guild.findUnique({
            where: {
                id: interaction.guild.id
            },
            select: {
                log_chnl: true
            }
        })

        if (interaction.options.getSubcommand() === "log-channel") {

            const channel = interaction.options.getChannel('channel');

            if (GuildSettings.log_chnl !== null) {

                let embed = new EmbedBuilder()
                    .setTitle("Command Error")
                    .setDescription(`<:fail:1355336960729682021> That channel is already set!\n-# Current Channel: <#${GuildSettings.log_chnl}>`)
                    .setColor("Red")

                await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });

            } else {

                await prisma.guild.update({
                    where: {
                        id: interaction.guild.id
                    },
                    data: {
                        log_chnl: channel.id
                    }
                })

                let embed = new EmbedBuilder()
                    .setTitle("Settings Updated")
                    .setDescription(`<:pass:1355337017357238464> Successfully set \`\`log-channel\`\` to ${channel}`)
                    .setColor("Green")

                await interaction.reply({ embeds: [embed] });

            }
        }

        // remove

        if (interaction.options.getSubcommand() === "remove") {

            const choice = interaction.options.getString('setting')

            if (choice === "logchannel") {

                if (GuildSettings.log_chnl === null) {

                    let embed = new EmbedBuilder()
                        .setTitle("Command Error")
                        .setDescription(`<:fail:1355336960729682021> That setting is already removed!`)
                        .setColor("Red")

                    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });

                } else {

                    await prisma.guild.update({
                        where: {
                            id: interaction.guild.id
                        },
                        data: {
                            log_chnl: null
                        }
                    })

                    let embed = new EmbedBuilder()
                        .setTitle("Settings Updated")
                        .setDescription(`<:pass:1355337017357238464> Successfully removed \`\`log-channel\`\``)
                        .setColor("Green")

                    await interaction.reply({ embeds: [embed] });

                }

            }
        }

    },
};

module.exports.config = {
    name: "setup",
    usage: "**/setup [log-channel | prefix | remove]**",
    description: "Update guild settings."
}

// emojis: <:pass:1355337017357238464> <:fail:1355336960729682021>