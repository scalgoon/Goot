const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');

const { Wordle } = require('discord-gamecord');

module.exports = {
    permission: 0,
    defaultPerm: PermissionFlagsBits.ViewChannel,
    data: new SlashCommandBuilder()
        .setName('wordle')
        .setDescription('Guess the word of the day.')
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {

        const Game = new Wordle({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Wordle',
                color: 'Random',
            },
            customWord: null,
            timeoutTime: 60000,
            winMessage: 'You won! The word was **{word}**.',
            loseMessage: 'You lost! The word was **{word}**.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        })

        Game.startGame();
        
        Game.on('gameOver', result => {
            return;
        })

    },
};

module.exports.config = {
    name: "wordle",
    usage: "**/wordle**",
    description: "Guess the word of the day.",
    permission: 0
}