const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a list of the bot\'s commands')
        .addStringOption(option => option.setName("command").setDescription("Specify a command to get info for")),
    async execute(client, interaction, prisma) {
        const textExists = await prisma.cCommands.findMany({
            where: {
                guild: interaction.guild.id
            },
            select: {
                id: true,
                placeholder: true,
                permission: true,
                text: true
            }
        })

        const embedExists = await prisma.cCEmbeds.findMany({
            where: {
                guild: interaction.guild.id
            },
            select: {
                id: true,
                placeholder: true,
                permission: true,
                description: true
            }
        })

        const cmd = interaction.options.getString('command')

        if(cmd) {

            const textcmd = await prisma.cCommands.findUnique({
                where: {
                    placeholder: `${cmd + interaction.guild.id}`
                },
                select: {
                    text: true,
                    guild: true,
                    deltrig: true,
                    permission: true,
                }
            })

            const newembed = await prisma.cCEmbeds.findUnique({
                where: {
                    placeholder: `${cmd + interaction.guild.id}`
                },
                select: {
                    description: true,
                    guild: true,
                    title: true,
                    deltrig: true,
                    permission: true,
                }
            })


            if(newembed) {
                let helpbed = new MessageEmbed()
                .setTitle(`Help for ${cmd}`)
                .addField("Permission", `${newembed.permission}`)
                .addField("Sends", `${newembed.description}`)
                .setColor("RANDOM")

                interaction.reply({ embeds: [helpbed] });
            } else if(textcmd) {
                let shelpbed = new MessageEmbed()
                .setTitle(`Help for ${cmd}`)
                .addField("Permission", `${textcmd.permission}`)
                .addField("Sends", `${textcmd.text}`)
                .setColor("RANDOM")

                interaction.reply({ embeds: [shelpbed] });
            } else {
                let nobed = new MessageEmbed()
                .setDescription(`<:cross:782029257739599873> That command doesn't exist in this guild!`)
                .setColor("RED")

                interaction.reply({ embeds: [nobed], ephemeral: true })
            }
        }

        let cmds = embedExists.map((x) => `\`${x.id}\``).join(", ")
        let cmd2 = textExists.map((v) => `\`${v.id}\``).join(", ")

        let ar;

        if (cmds && cmd2) {
            ar = `${cmds}, ${cmd2}`
        } else if (cmds && !cmd2) {
            ar = `${cmds}`
        } else {
            ar = `${cmd2}`
        }

        let embed = new MessageEmbed()
            .setTitle("Help Embed")
            .addField("<:slash:908546180265422909> Slash Commands", client.commands.map(c => '`' + c.data.name + '`').join(', '))
            .setColor("RANDOM")

        if (ar) {
            embed.addField("<:legacy:908546232127979570> Custom Commands", `${ar}`)
        }

         try{
           await interaction.reply({ embeds: [embed] })
              }catch(e){
                return;
              }

    },
};
