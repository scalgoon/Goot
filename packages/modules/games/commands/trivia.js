const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');

const { Trivia } = require('discord-gamecord');

module.exports = {
    permission: 0,
    defaultPerm: PermissionFlagsBits.ViewChannel,
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Guess the correct answer.')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Set the game mode.')
                .setRequired(true)
                .addChoices(
                    { name: 'Multiple', value: 'multiple' },
                    { name: 'Single', value: 'single' },
                ))
        .addStringOption(option =>
            option.setName('difficulty')
                .setDescription('Set the game difficulty.')
                .setRequired(true)
                .addChoices(
                    { name: 'Easy', value: 'easy' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'Hard', value: 'hard' },
                ))
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {

        const mode = interaction.options.getString('mode');

        const difficulty = interaction.options.getString('difficulty');

        const Game = new Trivia({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: 'Trivia',
                color: 'Random',
                description: 'You have 60 seconds to guess the answer.'
            },
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            trueButtonStyle: 'SUCCESS',
            falseButtonStyle: 'DANGER',
            mode: `${mode}`,
            difficulty: `${difficulty}`,
            winMessage: 'You won! The correct answer is {answer}.',
            loseMessage: 'You lost! The correct answer is {answer}.',
            errMessage: 'Unable to fetch question data! Please try again.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
        })

        Game.startGame();
        
        Game.on('gameOver', result => {
            return;
        })

    },
};

module.exports.config = {
    name: "trivia",
    usage: "**/trivia**",
    description: "Guess the correct answer.",
    permission: 0
}