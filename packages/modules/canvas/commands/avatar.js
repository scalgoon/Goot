const { SlashCommandBuilder, EmbedBuilder, InteractionContextType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    permission: 0,
    defaultPerm: PermissionFlagsBits.ViewChannel,
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
    description: "Fetch a user\'s avatar.",
    permission: 0
}

// emojis: <:pass:1355337017357238464> <:fail:1355336960729682021>