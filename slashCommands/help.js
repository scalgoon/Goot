const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get a list of the bot\'s commands')
        .addStringOption(option => option.setName("command").setDescription("Specify a command to get info for")),
    async execute(client, interaction) {

        const cmd = interaction.options.getString('command')

        if (cmd) {

            const thecmd = db.fetch(`!${cmd}-${interaction.guild.id}`);


            if (thecmd) {
                let helpbed = new EmbedBuilder()
                    .setAuthor({ name: `Information about ${cmd}`, iconURL: client.user.displayAvatarURL() })
                    .addFields(
                        { name: "Permission", value: thecmd.perms, inline: true },
                        { name: "Delete trigger", value: `${thecmd.deltrig}`, inline: true },
                        { name: "Sends", value: thecmd.description || thecmd.text, inline: true }
                    )
                    .setColor("Random")

                if (thecmd.title) {
                    helpbed.addFields({ name: "Title", value: `${thecmd.title}` })
                }

                interaction.reply({ embeds: [helpbed] });
            } else {
                let nobed = new EmbedBuilder()
                    .setDescription(`<:cross:782029257739599873> That command doesn't exist in this guild!`)
                    .setColor("Red")

                interaction.reply({ embeds: [nobed], ephemeral: true })
            }
        }

        let cmds = await db.get(`helpcmd-${interaction.guild.id}`);

        let embed = new EmbedBuilder()
            .setTitle("Help Embed")
            .setDescription("Here is a list of commands you can use in your server. Do **/help <command>** to learn more about a specific command.")
            .addFields({ name: "<:slash:908546180265422909> Slash Commands", value: client.commands.map(c => '`' + c.data.name + '`').join(', ') })
            .setColor("Random")

        if (cmds) {
            embed.addFields({ name: "<:legacy:908546232127979570> Custom Commands", value: `${cmds}` })
        }

        try {
            await interaction.reply({ embeds: [embed] })
        } catch (e) {
            return;
        }

    },
};
