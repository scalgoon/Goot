const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');

const { Slots } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Let\'s go gambling!')
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {

        const Game = new Slots({
                    message: interaction,
                    isSlashGame: false,
                    embed: {
                        title: 'Slot Machine',
                        color: 'Random'
                      },
                      slots: ['🍇', '🍊', '🍋', '🍌']
                })
        
                Game.startGame();
                
                Game.on('gameOver', result => {
                    return;
                })

    },
};

module.exports.config = {
    name: "slots",
    usage: "**/slots**",
    description: "Let\'s go gambling!"
}