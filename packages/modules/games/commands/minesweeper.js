const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');

const { Minesweeper } = require('discord-gamecord');

module.exports = {
    permission: 0,
    defaultPerm: PermissionFlagsBits.ViewChannel,
    data: new SlashCommandBuilder()
        .setName('minesweeper')
        .setDescription('The classic game with bombs.')
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {

        let rndInt = Math.floor(Math.random() * 6) + 1

        const Game = new Minesweeper({
                    message: interaction,
                    isSlashGame: false,
                    embed: {
                        title: 'Minesweeper',
                        color: 'Random',
                        description: 'Click on the buttons to reveal the blocks except mines.'
                      },
                      emojis: { flag: '🚩', mine: '💣' },
                      mines: rndInt,
                      timeoutTime: 60000,
                      winMessage: 'You won the Game! You successfully avoided all the mines.',
                      loseMessage: 'You lost the Game! Beaware of the mines next time.',
                      playerOnlyMessage: 'Only {player} can use these buttons.'
                })
        
                Game.startGame();
                
                Game.on('gameOver', result => {
                    return;
                })

    },
};

module.exports.config = {
    name: "minesweeper",
    usage: "**/minesweeper**",
    description: "The classic game with bombs.",
    permission: 0
}