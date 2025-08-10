const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionContextType } = require('discord.js');

const GuildCommands = require("../../packages/cmdHandler");

const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
	permission: 5,
	defaultPerm: PermissionFlagsBits.ManageGuild,
	data: new SlashCommandBuilder()
		.setName('pkg-remove')
		.setDescription('Remove a command package from your guild.')
		.addStringOption(option =>
			option.setName('package')
				.setDescription('Specific genre of commands!')
				.setRequired(true)
				.addChoices(
					{ name: 'Canvas', value: 'canvas' },
					{ name: 'Games', value: 'games' },
					{ name: 'Moderation', value: 'moderation' },
				))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setContexts(InteractionContextType.Guild),
	async execute(client, interaction) {

		const choicePackage = interaction.options.getString('package');

		let hasPackageInstalled = await db.get(`InstalledPackages_${interaction.guild.id}`);

		if (hasPackageInstalled.length > 0) {
			checkForChoice();
		} else {
			const noPackagesInstalled = new EmbedBuilder()
				.setTitle("Package Manager")
				.setDescription("<:fail:1355336960729682021> You have no packages installed to your guild")
				.setColor("Red")

			return await interaction.reply({ embeds: [noPackagesInstalled] });
		}

		async function checkForChoice() {
			if (hasPackageInstalled.includes(choicePackage)) {
				hasPackage();
			} else {
				const choiceNotInstalled = new EmbedBuilder()
					.setTitle("Package Manager")
					.setDescription(`<:fail:1355336960729682021> The **${choicePackage}** package is not installed to your guild`)
					.setColor("Red")

				return await interaction.reply({ embeds: [choiceNotInstalled] });
			}
		}

		async function hasPackage() {

			const package = new GuildCommands(`${interaction.guild.id}`, `${choicePackage}`);

			const module = await package.unload();

			await db.pull(`InstalledPackages_${interaction.guild.id}`, `${choicePackage}`);

			const finished = new EmbedBuilder()
				.setTitle(module.title)
				.setDescription(module.desc)
				.setColor(module.color)

			await interaction.reply({ embeds: [finished] });

		}

	},
};

module.exports.config = {
	name: "pkg-remove",
	usage: "**/pkg-remove [package]**",
	description: "Remove a command package from your guild.",
	permission: 5
}