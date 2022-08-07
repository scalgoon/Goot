const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Removes a custom command')
        // .addSubcommand(subcommand => subcommand.setName('custom-bot').setDescription('Setup the custom bot feature').addStringOption(option => option.setName('name').setDescription('Set the bots name').setRequired(true)).addStringOption(option => option.setName('avatar').setDescription('Provide a link for the avatar').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove a event').addStringOption(option => option.setName('event').setDescription('Select a event').addChoices({ name: 'Custom Bot', value: 'cbot' }).setRequired(true))),
    async execute(client, interaction) {

        let noperm = new EmbedBuilder()
            .setDescription(`<:cross:782029257739599873> You do not have permission to use this command!`)
            .setColor("Red")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Manage_Guild)) {
            return interaction.reply({ embeds: [noperm], ephemeral: true })
        }

        // if (interaction.options.getSubcommand() === "custom-bot") {

        //     let exists = db.fetch(`custombot-${interaction.guild.id}`);

        //     if (exists) {
        //         let embed = new EmbedBuilder()
        //             .setTitle("Command Error")
        //             .setDescription(`The custom bot is already setup!`)
        //             .setColor("Red")

        //         interaction.reply({ embeds: [embed], ephemeral: true })
        //     }

        //     const name = interaction.options.getString('name')
        //     const avatars = interaction.options.getString('avatar')

        //     if (name?.length >= 15 || avatars?.length >= 280) {
        //         let badembed = new EmbedBuilder()
        //             .setTitle("Command Error")
        //             .setDescription(`The text provided is too long!`)
        //             .setColor("Red")

        //         return interaction.reply({ embeds: [badembed], ephemeral: true });
        //     }

        //     await db.set(`custombot-${interaction.guild.id}`, { botname: name, botavatar: avatars });

        //     let embed = new EmbedBuilder()
        //         .setTitle("Event Added")
        //         .setDescription(`<:check:782029189963710464> Successfully added the custom bot **${name}** to this server`)
        //         .setColor("Green")

        //     try {
        //         await interaction.reply({ embeds: [embed] })
        //     } catch (e) {
        //         return;
        //     }
        // }

        if (interaction.options.getSubcommand() === "remove") {

            //     const choice = interaction.options.getString('event')

            //     if(choice === "cbot") {

            //         let exists = db.fetch(`custombot-${interaction.guild.id}`);

            //         if (!exists) {
            //             let embed = new EmbedBuilder()
            //                 .setTitle("Command Error")
            //                 .setDescription(`The custom bot is already removed!`)
            //                 .setColor("Red")

            //             interaction.reply({ embeds: [embed], ephemeral: true })
            //         }

            //         await db.delete(`custombot-${interaction.guild.id}`);

            //         let embed = new EmbedBuilder()
            //             .setTitle("Event Removed")
            //             .setDescription(`<:check:782029189963710464> Successfully deleted the custom bot from this server`)
            //             .setColor("Green")

            //         try {
            //             await interaction.reply({ embeds: [embed] })
            //         } catch (e) {
            //             return;
            //         }

            //     }

            try {
                await interaction.reply({ content: "There are no events to remove at this moment.", ephemeral: true });
            } catch (e) {
                return;
            }

        }

    },
};
