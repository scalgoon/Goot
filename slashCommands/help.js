const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a list of the bot\'s commands')
        .addStringOption(option => option.setName("command").setDescription("Specify a command to get info for")),
    async execute(client, interaction, prisma) {


        const textExists = await prisma.commands.findMany({
            where: {
                guild: interaction.guild.id
            },
            select: {
                placeholder: true,
                permission: true,
                text: true,
                description: true,
                title: true,
                trigger: true,
            }
        })

        const cmd = interaction.options.getString('command')

        if (cmd) {

            const thecmd = await prisma.commands.findUnique({
                where: {
                    placeholder: `!${cmd + interaction.guild.id}`
                },
                select: {
                    text: true,
                    guild: true,
                    deltrig: true,
                    permission: true,
                    title: true,
                    description: true,
                }
            })


            if (thecmd) {
                let helpbed = new MessageEmbed()
                    .setAuthor(`Information about ${cmd}`, client.user.displayAvatarURL())
                    .addField("Permission", `${thecmd.permission}`, true)
                    .addField("Delete trigger", `${thecmd.deltrig}`, true)
                    .addField("Sends", `${thecmd.description || thecmd.text}`, true)
                    .setColor("RANDOM")

                if (thecmd.title) {
                    helpbed.addField("Title", `${thecmd.title}`)
                }

                interaction.reply({ embeds: [helpbed] });
            } else {
                let nobed = new MessageEmbed()
                    .setDescription(`<:cross:782029257739599873> That command doesn't exist in this guild!`)
                    .setColor("RED")

                interaction.reply({ embeds: [nobed], ephemeral: true })
            }
        }

        let cmds = textExists.map((x) => `\`${x.trigger}\``).join(", ")

        let embed = new MessageEmbed()
            .setTitle("Help Embed")
            .setDescription("Here is a list of commands you can use in your server. Do **/help <command>** to learn more about a specific command.")
            .addField("<:slash:908546180265422909> Slash Commands", client.commands.map(c => '`' + c.data.name + '`').join(', '))
            .setColor("RANDOM")

        if (cmds) {
            embed.addField("<:legacy:908546232127979570> Custom Commands", `${cmds}`)
        }

        try {
            await interaction.reply({ embeds: [embed] })
        } catch (e) {
            return;
        }

    },
};
