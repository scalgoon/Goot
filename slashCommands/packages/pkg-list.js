const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, EmbedBuilder } = require('discord.js');

const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pkg-list')
		.setDescription('List your guild\'s packages.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.setContexts(InteractionContextType.Guild),
	async execute(client, interaction) {

		let hasPackageInstalled = await db.get(`InstalledPackages_${interaction.guild.id}`);

		const listbed = new EmbedBuilder()
			.setTitle("Package Information")
			.setDescription("Packages are collections of commands you can install to make Goot reflect your needs!")
			.addFields({ name: "Available Packages", value: "<:canvas:1355337061175136457> Canvas\n<:custom:1355422655972511762> Custom Commands\n<:games:1355337059564257418> Games\n<:leveling:1355337102069334200> Leveling\n<:moderation:1355337099041177781> Moderation" })
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
	description: "List your guild\'s packages."
}