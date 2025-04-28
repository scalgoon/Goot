const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');

const { Emojify } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojify')
        .setDescription('Turn text into emojis!')
        .addStringOption(option =>
			option.setName('text')
				.setDescription('Text you want to turn into emojis.')
				.setRequired(true))
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {

        const text = interaction.options.getString('text'); 

        await interaction.reply(await Emojify(text));

    },
};

module.exports.config = {
    name: "emojify",
    usage: "**/emojify [text]**",
    description: "Turn text into emojis!"
}