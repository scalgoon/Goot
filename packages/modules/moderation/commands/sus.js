const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sus')
		.setDescription('guild testing'),
	async execute(client, interaction) {
		
		await interaction.reply("SUS JS WORKED");

	},
};