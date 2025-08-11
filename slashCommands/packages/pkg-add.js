const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const GuildCommands = require("../../packages/cmdHandler");
const prisma = require('../../utils/prismaClient');

module.exports = {
	permission: 5,
	defaultPerm: PermissionFlagsBits.ManageGuild,
	data: new SlashCommandBuilder()
		.setName('pkg-add')
		.setDescription('Add a command package to your guild.')
		.addStringOption(option =>
			option.setName('package')
				.setDescription('Specific genre of commands!')
				.setRequired(true)
				.addChoices(
					{ name: 'Canvas', value: 'canvas' },
					{ name: 'Fun', value: 'fun' },
					{ name: 'Games', value: 'games' },
					{ name: 'Moderation', value: 'moderation' },
				))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setContexts(InteractionContextType.Guild),
	async execute(client, interaction) {

		const choicePackage = interaction.options.getString('package');

		const GuildSettings = await prisma.guild.findUnique({
			where: {
				id: interaction.guild.id
			},
			select: {
				installed_packages: true
			}
		})

		const hasPackageInstalled = GuildSettings.installed_packages["modules"];

		if (hasPackageInstalled.length !== 0) {
			checkForRefresh();
		} else {
			installPackage();
			await hasPackageInstalled.push(choicePackage);

			await prisma.guild.update({
				where: {
					id: interaction.guild.id
				},
				data: {
					installed_packages: GuildSettings.installed_packages
				}
			})
		}

		async function checkForRefresh() {
			if (hasPackageInstalled.includes(choicePackage)) {
				hasPackage();
			} else {
				installPackage();
				await hasPackageInstalled.push(choicePackage);

				await prisma.guild.update({
					where: {
						id: interaction.guild.id
					},
					data: {
						installed_packages: GuildSettings.installed_packages
					}
				})
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
	description: "Add a command package to your guild.",
	permission: 5
}