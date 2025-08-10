const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    permission: 0,
    defaultPerm: PermissionFlagsBits.ViewChannel,
    data: new SlashCommandBuilder()
        .setName('phrase')
        .setDescription('Generate a random phrase to use in a sentence.')
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {

        let phrase;

        import("random-words").then(async (word) => {
            phrase = word.generate({
                exactly: 1,
                wordsPerString: 2,
                formatter: (word, index) => {
                    return index === 0
                        ? word.slice(0, 1).toUpperCase().concat(word.slice(1))
                        : word;
                }
            })

            const embed = new EmbedBuilder()
                .setDescription(`<:pass:1355337017357238464> Try to make a sentence using the phrase **${phrase}**!`)
                .setColor("#911729")
                .setTimestamp()

            return await interaction.reply({ embeds: [embed] });
        })

    },
};

module.exports.config = {
    name: "phrase",
    usage: "**/phrase**",
    description: "Generate a random phrase to use in a sentence.",
    permission: 0
}