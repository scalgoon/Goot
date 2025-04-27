const { SlashCommandBuilder, EmbedBuilder, InteractionContextType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Fetch a user\'s avatar.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The avatar you want to see.')
                .setRequired(true))
        .setContexts(InteractionContextType.Guild),
    async execute(client, interaction) {

        console.log("sus3")

        const user = interaction.options.getUser('user');

        let userAvatar = user.displayAvatarURL({ size: 512 });

        const avatarbed = new EmbedBuilder()
            .setTitle(`${user.username}\'s Avatar`)
            .setImage(userAvatar)
            .setTimestamp()
            .setColor("Random")

        await interaction.reply({ embeds: [avatarbed] });

    },
};

module.exports.config = {
    name: "avatar",
    usage: "**/avatar [user]**",
    description: "Fetch a user\'s avatar."
}

// emojis: <:pass:1355337017357238464> <:fail:1355336960729682021>