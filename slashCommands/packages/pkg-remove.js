const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');

const GuildCommands = require("../../packages/cmdHandler");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pkg-remove')
		.setDescription('Remove a command package from your guild.')
		.addStringOption(option =>
			option.setName('package')
				.setDescription('Specific genre of commands!')
				.setRequired(true)
				.addChoices(
					{ name: 'Games', value: 'games' },
					{ name: 'Moderation', value: 'moderation' },
				))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setContexts(InteractionContextType.Guild),
	async execute(client, interaction) {

		const choicePackage = interaction.options.getString('package');

		const package = new GuildCommands(`${interaction.guild.id}`, `${choicePackage}`);

		const module = await package.unload();

		const finished = new EmbedBuilder()
			.setTitle(module.title)
			.setDescription(module.desc)
			.setColor(module.color)

		await interaction.reply({ embeds: [finished] });

	},
};

module.exports.config = {
	name: "pkg-remove",
	usage: "**/pkg-remove [package]**",
	description: "Remove a command package from your guild."
}