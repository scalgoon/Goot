const { EmbedBuilder,  SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Sends my uptime.'),
    async slashRun(client, interaction) {

        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        let embed = new EmbedBuilder()
            .setTitle('Current uptime')
            .setDescription(`\`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes and \`${seconds}\` seconds. `)
            .setColor('Random')

        interaction.reply({embeds: [embed]});

    }
};
