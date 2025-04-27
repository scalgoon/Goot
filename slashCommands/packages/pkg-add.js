const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const GuildCommands = require("../../packages/cmdHandler");

const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pkg-add')
		.setDescription('Add a command package to your guild.')
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

		if (hasPackageInstalled) {
			checkForRefresh();
		} else {
			installPackage();
			await db.set(`InstalledPackages_${interaction.guild.id}`, [`${choicePackage}`]);
		}

		async function checkForRefresh() {
			if (hasPackageInstalled.includes(choicePackage)) {
				hasPackage();
			} else {
				installPackage();
				await db.push(`InstalledPackages_${interaction.guild.id}`, `${choicePackage}`);
			}
		}

		async function hasPackage() {
			const package = new GuildCommands(`${interaction.guild.id}`, `${choicePackage}`, interaction);

			const module = await package.reload();

			const reloaded = new EmbedBuilder()
				.setTitle(module.title)
				.setDescription(module.desc)
				.setColor(module.color)
				.setFooter({ text: "Can't see the commands? Restart Discord" })

			await interaction.reply({ embeds: [reloaded] });
		}

		async function installPackage() {

			const package = new GuildCommands(`${interaction.guild.id}`, `${choicePackage}`, interaction);
			const module = await package.load();

			const finished = new EmbedBuilder()
				.setTitle(module.title)
				.setDescription(module.desc)
				.setColor(module.color)
				.setFooter({ text: "Can't see the commands? Restart Discord" })

			await interaction.reply({ embeds: [finished] });

		}

	},
};

module.exports.config = {
	name: "pkg-add",
	usage: "**/pkg-add [package]**",
	description: "Add a command package to your guild."
}