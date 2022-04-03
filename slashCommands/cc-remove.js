const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cc-remove')
        .setDescription('Removes a custom command')
        .addStringOption(option => option.setName('name').setDescription('Enter the name of command').setRequired(true)),
    async execute(client, interaction, prisma) {

        let noperm = new MessageEmbed()
            .setDescription(`<:cross:782029257739599873> You do not have permission to use this command!`)
            .setColor("RED")

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return interaction.reply({ embeds: [noperm] });
        }

        const name = interaction.options.getString('name')

        let triggertouse = `!${name}`

        const exists = await prisma.commands.findUnique({
            where: {
                placeholder: `!${name + interaction.guild.id}`,
            },
            select: {
                guild: true
            }
        })

        if (exists) {

            if (exists.guild === interaction.guild.id) {
                await prisma.commands.delete({
                    where: {
                        placeholder: `!${name + interaction.guild.id}`,
                    }
                })

                let embed = new MessageEmbed()
                    .setTitle("Command Removed")
                    .setDescription(`<:check:782029189963710464> Successfully deleted command with trigger **${triggertouse}**`)
                    .setColor("GREEN")

                try {
                    await interaction.reply({ embeds: [embed] })
                } catch (e) {
                    return;
                }
            }
        } else {
            let embed = new MessageEmbed()
                .setTitle("Command Error")
                .setDescription(`Couldn't find that command in the database!`)
                .setColor("RED")

            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    },
};
