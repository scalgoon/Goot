const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('Gets the bot\'s information'),
	async execute(client, interaction) {

        let days = Math.floor(client.uptime / 86400000 ); let hours = Math.floor(client.uptime / 3600000 ) % 24; let minutes = Math.floor(client.uptime / 60000) % 60; let seconds = Math.floor(client.uptime / 1000) % 60;
		
        let info = new EmbedBuilder()
        .setAuthor({ name: `Information about Goot`, iconURL: client.user.displayAvatarURL() })
        .setDescription("Emojis provided by [Icons](https://discord.gg/9AtkECMX2P)")
        .setColor('Random')
        .addFields(
          { name: "Info", value: `\`\`\`yml\nName: ${client.user.tag}\nID: ${client.user.id}\n\`\`\``, inline: true },
          { name: "Creator", value: `\`\`\`yml\nName: Goose_#2548\nID: 734784924619505774\n\`\`\``, inline: true },
          { name: "Version", value: "```yml\nv2.0.0 [BETA]\n```", inline: true },
          { name: "Guilds", value: `\`\`\`yml\n${client.guilds.cache.size}\n\`\`\``, inline: true },
          { name: "Uptime", value: `\`\`\`yml\n${days}d, ${hours}h, ${minutes}m, ${seconds}s\n\`\`\``},
          { name: "Github", value: "[Click here](https://github.com/scalgoon/Goot)"},
          { name: "Support Server", value: "[Click here](https://discord.gg/4SWmXNYsCS)"}
        )

        try{
           await interaction.reply({ embeds: [info] })
              }catch(e){
                return;
              }

    }
};
