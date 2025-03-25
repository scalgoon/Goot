const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const botInfo = require('../../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('Sends the bot\'s current stats.'),
	async execute(client, interaction) {
		let days = Math.floor(client.uptime / 86400000); let hours = Math.floor(client.uptime / 3600000) % 24; let minutes = Math.floor(client.uptime / 60000) % 60; let seconds = Math.floor(client.uptime / 1000) % 60;

        let info = new EmbedBuilder()
            .setAuthor({ name: `Information about ExoBot`, iconURL: client.user.displayAvatarURL() })
            .setDescription("Emojis provided by [Icons](https://discord.gg/9AtkECMX2P)")
            .setColor('Random')
            .addFields(
                { name: "Info", value: `\`\`\`yml\nName: ${client.user.tag}\nID: ${client.user.id}\n\`\`\``, inline: true },
                { name: "Creator", value: `\`\`\`yml\nName: @dozdezdaz\nID: 734784924619505774\n\`\`\``, inline: true },
                { name: "Version", value: `\`\`\`yml\nv${botInfo.version}\n\`\`\``, inline: true },
                { name: "Guilds", value: `\`\`\`yml\n${client.guilds.cache.size}\n\`\`\``, inline: true },
                { name: "Uptime", value: `\`\`\`yml\n${days}d, ${hours}h, ${minutes}m, ${seconds}s\n\`\`\`` }
            )

        interaction.reply({ embeds: [info] });

	},
};

module.exports.config = {
    name: "botinfo",
    usage: "**/botinfo**",
    description: "Sends the bot\'s current stats."
}