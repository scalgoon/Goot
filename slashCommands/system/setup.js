const { SlashCommandBuilder, EmbedBuilder, MessageFlags, PermissionFlagsBits, InteractionContextType, ChannelType } = require('discord.js');

const prisma = require('../../utils/prismaClient');

module.exports = {
    permission: 5,
    defaultPerm: PermissionFlagsBits.ManageGuild,
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Update and view guild settings.')
        .addSubcommand(subcommand => subcommand.setName('log-channel').setDescription('Set where events are logged.').addChannelOption(option => option.setName('channel').setDescription('Select a channel.').addChannelTypes(ChannelType.GuildText).setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('prefix').setDescription('Set what prefix custom commands use.').addStringOption(option => option.setName('prefix').setDescription('Specify a prefix.').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('view').setDescription('View currently set up settings.').addStringOption(option => option.setName('setting').setDescription('Select a setting.').addChoices({ name: 'Log Channel', value: 'logchannel' }, { name: 'Staff Roles', value: 'staffroles' }).setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('staff-roles').setDescription('Configure your guild\'s staff roles.').addStringOption(option => option.setName('permission-lvl').setDescription('Permission Level.').addChoices({ name: '0', value: '0' }, { name: '1', value: '1' }, { name: '2', value: '2' }, { name: '3', value: '3' }, { name: '4', value: '4' }, { name: '5', value: '5' }).setRequired(true)).addRoleOption(option => option.setName('role').setDescription('The role you wish to apply perms to.').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove a setting.').addStringOption(option => option.setName('setting').setDescription('Select a setting.').addChoices({ name: 'Log Channel', value: 'logchannel' }).setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {

        const GuildSettings = await prisma.guild.findUnique({
            where: {
                id: interaction.guild.id
            },
            select: {
                log_chnl: true,
                staff_roles: true,
                prefix: true
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

        // view

        if (interaction.options.getSubcommand() === "view") {

            const choice = interaction.options.getString('setting');

            if (choice === "logchannel") {
                if (GuildSettings.log_chnl === null) {

                    let embed = new EmbedBuilder()
                        .setTitle("Settings: Log Channel")
                        .setDescription(`<:gear:1355338181477924894> That setting has not been set up.`)
                        .setColor("Orange")

                    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });

                } else {

                    let embed = new EmbedBuilder()
                        .setTitle("Settings: Log Channel")
                        .setDescription(`<:pass:1355337017357238464> The log channel is <#${GuildSettings.log_chnl}>`)
                        .setColor("Green")

                    await interaction.reply({ embeds: [embed] });

                }
            }

            if (choice === "staffroles") {

                let role5;

                if (GuildSettings.staff_roles["5"] === null) {
                    role5 = "No role set"
                } else {
                    role5 = `<@&${GuildSettings.staff_roles["5"]}>`
                }
                
                let role4;

                if (GuildSettings.staff_roles["4"] === null) {
                    role4 = "No role set"
                } else {
                    role4 = `<@&${GuildSettings.staff_roles["4"]}>`
                }

                let role3;

                if (GuildSettings.staff_roles["3"] === null) {
                    role3 = "No role set"
                } else {
                    role3 = `<@&${GuildSettings.staff_roles["3"]}>`
                }

                let role2;

                if (GuildSettings.staff_roles["2"] === null) {
                    role2 = "No role set"
                } else {
                    role2 = `<@&${GuildSettings.staff_roles["2"]}>`
                }

                let role1;

                if (GuildSettings.staff_roles["1"] === null) {
                    role1 = "No role set"
                } else {
                    role1 = `<@&${GuildSettings.staff_roles["1"]}>`
                }

                let role0;

                if (GuildSettings.staff_roles["0"] === null) {
                    role0 = "No role set"
                } else {
                    role0 = `<@&${GuildSettings.staff_roles["0"]}>`
                }

                let roleEmbed = new EmbedBuilder()
                    .setTitle("Settings: Staff Roles")
                    .addFields(
                        { name: "Permission Level: 5", value: `${role5}\n-# Default: MANAGE_GUILD`, inline: true },
                        { name: "Permission Level: 4", value: `${role4}\n-# Default: BAN_MEMBERS`, inline: true },
                        { name: "Permission Level: 3", value: `${role3}\n-# Default: KICK_MEMBERS`, inline: true },
                        { name: "Permission Level: 2", value: `${role2}\n-# Default: MUTE_MEMBERS`, inline: true },
                        { name: "Permission Level: 1", value: `${role1}\n-# Default: MANAGE_MESSAGES`, inline: true },
                        { name: "Permission Level: 0", value: `${role0}\n-# Default: @everyone`, inline: true }
                    )
                    .setColor("Green")

                await interaction.reply({ embeds: [roleEmbed] });
            }

        }

        // staff-roles

        if (interaction.options.getSubcommand() === "staff-roles") {

            const permInt = interaction.options.getString('permission-lvl');

            const staffRole = interaction.options.getRole('role');

            let currentRoles = await prisma.guild.findUnique({
                where: {
                    id: interaction.guild.id
                },
                select: {
                    staff_roles: true
                }
            })

            let pushRoles = currentRoles.staff_roles

            pushRoles[`${permInt}`] = staffRole.id;

            await prisma.guild.update({
                where: {
                    id: interaction.guild.id
                },
                data: {
                    staff_roles: pushRoles
                }
            })

            let embed = new EmbedBuilder()
                .setTitle("Settings: Staff Roles")
                .setDescription(`<:pass:1355337017357238464> Successfully updated perm level ${permInt} to <@&${staffRole.id}>`)
                .setColor("Green")

            await interaction.reply({ embeds: [embed] });

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
    usage: "**/setup [log-channel | prefix | staff-roles | view | remove]**",
    description: "Update and view guild settings.",
    permission: 5
}

// emojis: <:pass:1355337017357238464> <:fail:1355336960729682021>