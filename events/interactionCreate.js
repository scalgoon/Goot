const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { MessageEmbed } = require('discord.js');

module.exports = async (client, interaction) => {
 if (interaction.isCommand()) {
  const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction, prisma);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
 }
}