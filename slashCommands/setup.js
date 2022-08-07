const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Removes a custom command')
        .addSubcommand(subcommand => subcommand.setName('custom-bot').setDescription('Setup the custom bot feature').addStringOption(option => option.setName('name').setDescription('Set the bots name').setRequired(true)).addStringOption(option => option.setName('avatar').setDescription('Provide a link for the avatar').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove a event').addStringOption(option => option.setName('event').setDescription('Select a event').addChoice({ name: 'Custom Bot', value: 'cbot' }).setRequired(true))),
    async execute(client, interaction, prisma) {

        let noperm = new MessageEmbed()
            .setDescription(`<:cross:782029257739599873> You do not have permission to use this command!`)
            .setColor("RED")

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return interaction.reply({ embeds: [noperm], ephemeral: true })
        }

        if (interaction.options.getSubcommand() === "custom-bot") {
            const exists = await prisma.custombot.findUnique({
                where: {
                    id: interaction.guild.id,
                },
            })

            if (exists) {
                let embed = new MessageEmbed()
                    .setTitle("Command Error")
                    .setDescription(`The custom bot is already setup!`)
                    .setColor("RED")

                interaction.reply({ embeds: [embed], ephemeral: true })
            }

            const name = interaction.options.getString('name')
            const avatars = interaction.options.getString('avatar')

            if (name?.length >= 15 || avatars?.length >= 280) {
                let badembed = new MessageEmbed()
                    .setTitle("Command Error")
                    .setDescription(`The text provided is too long!`)
                    .setColor("RED")

                return interaction.reply({ embeds: [badembed], ephemeral: true });
            }

            await prisma.custombot.create({
                data: {
                    id: interaction.guild.id,
                    botname: name,
                    botavatar: avatars,
                },
            })

            let embed = new MessageEmbed()
                .setTitle("Event Added")
                .setDescription(`<:check:782029189963710464> Successfully added the custom bot **${name}** to this server`)
                .setColor("GREEN")

            try {
                await interaction.reply({ embeds: [embed] })
            } catch (e) {
                return;
            }
        }

        if (interaction.options.getSubcommand() === "remove") {

            const choice = interaction.options.getString('event')

            if(choice === "cbot") {
                const exists = await prisma.custombot.findUnique({
                    where: {
                        id: interaction.guild.id,
                    },
                })
    
                if (!exists) {
                    let embed = new MessageEmbed()
                        .setTitle("Command Error")
                        .setDescription(`The custom bot is already removed!`)
                        .setColor("RED")
    
                    interaction.reply({ embeds: [embed], ephemeral: true })
                }
    
                await prisma.custombot.delete({
                    where: {
                        id: interaction.guild.id
                    },
                })
    
                let embed = new MessageEmbed()
                    .setTitle("Event Removed")
                    .setDescription(`<:check:782029189963710464> Successfully deleted the custom bot from this server`)
                    .setColor("GREEN")
    
                try {
                    await interaction.reply({ embeds: [embed] })
                } catch (e) {
                    return;
                }
            
            }

        }

    },
};
