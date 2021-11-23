const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cc-remove')
        .setDescription('Creates a custom command')
        .addSubcommand(subcommand => subcommand
            .setName('text')
            .setDescription('Remove a text command')
            .addStringOption(option => option.setName('name').setDescription('Enter the name of command').setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('embed')
            .setDescription('Remove a embed command')
            .addStringOption(option => option.setName('name').setDescription('Enter the name of command').setRequired(true))),
    async execute(client, interaction, prisma) {

        let noperm = new MessageEmbed()
      .setDescription(`<:cross:782029257739599873> You do not have permission to use this command!`)
      .setColor("RED")

      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        return interaction.reply({ embeds: [noperm], ephemeral: true })
      }

        if (interaction.options.getSubcommand() === 'text') {
            const name = interaction.options.getString('name')

            let triggertouse = `!${name}`

            const exists = await prisma.cCommands.findUnique({
                where: {
                    placeholder: `${name + interaction.guild.id}`,
                },
                select: {
                    guild: true
                }
            })

            if (exists) {

                if (exists.guild === interaction.guild.id) {
                    await prisma.cCommands.delete({
                        where: {
                            placeholder: `${name + interaction.guild.id}`,
                        }
                    })

                    let embed = new MessageEmbed()
                        .setTitle("Command Removed")
                        .setDescription(`<:check:782029189963710464> Successfully deleted command with trigger **${triggertouse}**`)
                        .setColor("GREEN")

                    interaction.reply({ embeds: [embed] })
                }
            } else {
                let embed = new MessageEmbed()
                    .setTitle("Command Error")
                    .setDescription(`Couldn't find that command in the database!`)
                    .setColor("RED")

                interaction.reply({ embeds: [embed] })
            }

        }

        if (interaction.options.getSubcommand() === 'embed') {
            const name = interaction.options.getString('name')

            let triggertouse = `!${name}`

            const exists = await prisma.cCEmbeds.findUnique({
                where: {
                    placeholder: `${name + interaction.guild.id}`,
                },
                select: {
                    guild: true
                }
            })

            if (exists) {

                if (exists.guild === interaction.guild.id) {
                    await prisma.cCEmbeds.delete({
                        where: {
                            placeholder: `${name + interaction.guild.id}`,
                        }
                    })


                    let embed = new MessageEmbed()
                        .setTitle("Command Removed")
                        .setDescription(`<:check:782029189963710464> Successfully deleted command with trigger **${triggertouse}**`)
                        .setColor("GREEN")

                    interaction.reply({ embeds: [embed] })
                }
            } else {
                let embed = new MessageEmbed()
                    .setTitle("Command Error")
                    .setDescription(`Couldn't find that command in the database!`)
                    .setColor("RED")
    
                interaction.reply({ embeds: [embed] })
            }
        } 
    },
};
