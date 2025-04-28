const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');

const { QuickDB } = require("quick.db");
const db = new QuickDB();

const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get a list of the bot\'s commands.')
		.addStringOption(option => option.setName("command").setDescription("Specify a command to get info for"))
		.setContexts(InteractionContextType.Guild),
	async execute(client, interaction) {

		const cmd = interaction.options.getString('command')

		if (cmd) {

			const isSlash = client.commands.get(cmd.toLowerCase());

			if (isSlash) {
				return getCMD(client, interaction, cmd)
			}

			async function getCMD(client, interaction, input) {

				const cmd2 = client.commands.get(input.toLowerCase());

				let slashHelpBed = new EmbedBuilder()
					.setAuthor({ name: `Information about ${cmd2.config.name}`, iconURL: client.user.displayAvatarURL() })
					.addFields(
						{ name: "Command Name", value: cmd2.config.name },
						{ name: "Description", value: cmd2.config.description },
						{ name: "Usage", value: `\n${cmd2.config.usage}` }
					)
					.setColor("Random")

				return interaction.reply({ embeds: [slashHelpBed] });

			}

		}

		let packagedCmds = [];

		let hasPackagesInstalled = await db.get(`InstalledPackages_${interaction.guild.id}`);

		if (hasPackagesInstalled) {
			for (let i = 0; i < hasPackagesInstalled.length; i++) {
				const commandFiles = fs.readdirSync(`packages/modules/${hasPackagesInstalled[i]}/commands`).filter(file => file.endsWith('.js'));
				for (const file of commandFiles) {
					packagedCmds.push(file.split('.').slice(0, -1).join('.'));
				}
			}
		}

		let embed = new EmbedBuilder()
			.setTitle("Hello, I'm Goot!")
			.setDescription("Here is a list of commands you can use in your server.\n-# Do **/help [command]** to learn more about a specific command.")
			.addFields({ name: "<:slash:908546180265422909> Base Commands", value: "`/pkg-add`, `/pkg-list`, `/pkg-remove`, `/botinfo`, `/help`, `/ping`" })
			.setColor("Random")

		if (packagedCmds.length > 0) {
			embed.addFields({ name: "<:packages:1355338718256304159> Package Commands", value: packagedCmds.map(c => '`/' + c + '`').join(', ') })
		}

		try {
			await interaction.reply({ embeds: [embed] })
		} catch (e) {
			return;
		}

	},
};

module.exports.config = {
	name: "help",
	usage: "**/help [command]**",
	description: "Get a list of the bot\'s commands."
}