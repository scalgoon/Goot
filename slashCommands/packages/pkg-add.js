const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');

const GuildCommands = require("../../packages/cmdHandler");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pkg-add')
		.setDescription('Add a command package to your guild.')
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

		const module = await package.load();

		const finished = new EmbedBuilder()
			.setTitle(module.title)
			.setDescription(module.desc)
			.setColor(module.color)
			.setFooter({ text: "Can't see the commands? Restart Discord" })

		await interaction.reply({ embeds: [finished] });

	},
};

module.exports.config = {
	name: "pkg-add",
	usage: "**/pkg-add [package]**",
	description: "Add a command package to your guild."
}