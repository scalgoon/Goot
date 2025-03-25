const { InteractionType, EmbedBuilder } = require('discord.js');

// const prisma = require("../utils/prismaClient");

module.exports = async (client, interaction) => {
 if (interaction.type === InteractionType.ApplicationCommand) {
  const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (error) {

		let errBed = new EmbedBuilder()
		.setTitle("Command Error")
		.setThumbnail(interaction.guild.iconURL())
		.addFields({ name: "Guild", value: `> ${interaction.guild.name}` }, { name: "Command", value: `> ${interaction.commandName}` }, { name: "Error", value: `\`\`\`js\n${error}\n\`\`\`` })
		.setColor("Red")

		await client.users.cache.get('734784924619505774').send({ embeds: [errBed] });

		await interaction.reply({ content: 'An error occurred when executing this command and has been reported to my creator!', ephemeral: true });
	}
 }
}