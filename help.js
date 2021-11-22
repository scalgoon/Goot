const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a list of the bot\'s commands'),
    async execute(client, interaction, prisma) {
        const textExists = await prisma.cCommands.findMany({
            where: {
                guild: interaction.guild.id
            },
            select: {
                id: true
            }
        })

        const embedExists = await prisma.cCEmbeds.findMany({
            where: {
                guild: interaction.guild.id
            },
            select: {
                id: true
            }
        })

        let cmds = embedExists.map((x) => `\`${x.id}\``).join(", ")
        let cmd2 =  textExists.map((v) => `\`${v.id}\``).join(", ")

        let ar;

        if(cmds && cmd2) {
            ar = `${cmds}, ${cmd2}`
        } else if (cmds && !cmd2) {
            ar = `${cmds}`
        } else {
            ar = `${cmd2}`
        }

        let embed = new MessageEmbed()
            .setTitle("Help Embed")
            .setDescription("Here is a list of my available commands you can use in your server.\nEmojis provided by [Icons](https://discord.gg/9AtkECMX2P)")
            .addField("<:slash:908546180265422909> Slash Commands", " `\`ping`\`, `\`invite`\`, `\`cc-add`\`, `\`cc-remove`\`")
            .setColor("RANDOM")

        if (ar) {
            embed.addField("<:legacy:908546232127979570> Custom Commands", `${ar}`)
        }

        interaction.reply({ embeds: [embed] })
    },
};
