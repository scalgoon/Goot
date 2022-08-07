const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tutorial')
    .setDescription('A guide on how to use Goot'),
  async execute(client, interaction) {

    let newbed = new EmbedBuilder()
      .setTitle("Hi! Here is a quick explanation on how to use me")
      .setDescription("I'am a bot based around custom commands and features made by you!")
      .addFields(
        { name: "How do i make a command?", value: "To make a command use the slash command **/cc-add**!\nYou will be promted with either embed or text, this will choose what type of command it will be." },
        { name: "How do i use these commands?", value: "To use them simply do !<command name>. However if you lack the permissions assigned to the command then you will get no response!" },
        { name: "What are tags?", value: "Tags are a new in development feature! You can set these in the command text.\n$userID - Will return the authors ID\n$serverID - Will return the servers ID\n$text - Will put any text done after the trigger in the message (ex. !say hi)\n$user - Will return the first user mentioned\n$channel  - Will return the first channel mentioned\n$nl - Will insert a new line where ever it's put" }
      )
      .setColor("Random")


    try {
      await interaction.reply({ embeds: [newbed], ephemeral: true })
    } catch (e) {
      return;
    }

  }
};
