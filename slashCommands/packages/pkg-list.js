const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, EmbedBuilder } = require('discord.js');

const prisma = require('../../utils/prismaClient');

module.exports = {
	permission: 5,
	defaultPerm: PermissionFlagsBits.ManageGuild,
	data: new SlashCommandBuilder()
		.setName('pkg-list')
		.setDescription('List your guild\'s packages.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setContexts(InteractionContextType.Guild),
	async execute(client, interaction) {
		const GuildSettings = await prisma.guild.findUnique({
			where: {
				id: interaction.guild.id
			},
			select: {
				installed_packages: true
			}
		})

		const hasPackageInstalled = GuildSettings.installed_packages["modules"];

		const listbed = new EmbedBuilder()
			.setTitle("Package Information")
			.setDescription("Packages are collections of commands you can install to make Goot reflect your needs!")
			.addFields({ name: "Available Packages", value: "<:canvas:1355337061175136457> Canvas\n<:custom:1355422655972511762> Custom Commands\n<:fun:1404597081712099479> Fun\n<:games:1355337059564257418> Games\n<:leveling:1355337102069334200> Leveling\n<:moderation:1355337099041177781> Moderation" })
			.setColor("#911729")

		if (hasPackageInstalled.length > 0) {
			listbed.addFields({ name: "Installed Packages", value: `${hasPackageInstalled.map((x) => `\`${x}\``).join(", ")}` })
		}

		await interaction.reply({ embeds: [listbed] });
	},
};

module.exports.config = {
	name: "pkg-list",
	usage: "**/pkg-list**",
	description: "List your guild\'s packages.",
	permission: 5
}