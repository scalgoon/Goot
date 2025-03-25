const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pkg-list')
		.setDescription('List your guild\'s packages.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setContexts(InteractionContextType.Guild),
	async execute(client, interaction) {

	},
};

module.exports.config = {
	name: "pkg-list",
	usage: "**/pkg-list**",
	description: "List your guild\'s packages."
}