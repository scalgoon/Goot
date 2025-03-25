const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Sends the bot\'s ping and latency.')
		.setContexts(InteractionContextType.Guild),
	async execute(client, interaction) {
		
	},
};

module.exports.config = {
    name: "help",
    usage: "**/help**",
    description: "Sends the bot\'s ping and latency."
}