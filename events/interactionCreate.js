const { InteractionType } = require('discord.js');

module.exports = async (client, interaction) => {
 if (interaction.type === InteractionType.ApplicationCommand) {
  const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
 }
}
