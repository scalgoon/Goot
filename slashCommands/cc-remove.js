const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cc-remove')
        .setDescription('Removes a custom command')
        .addStringOption(option => option.setName('name').setDescription('Enter the name of command').setRequired(true)),
    async execute(client, interaction) {

        let noperm = new EmbedBuilder()
            .setDescription(`<:cross:782029257739599873> You do not have permission to use this command!`)
            .setColor("Red")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Manage_Guild)) {
            return interaction.reply({ embeds: [noperm] });
        }

        const name = interaction.options.getString('name')

        let exists = db.fetch(`!${name}-${interaction.guild.id}`);

        if (exists) {

            if (exists.guild === interaction.guild.id) {

                await db.delete(`!${name}-${interaction.guild.id}`);

                const array = await db.get(`helpcmd-${interaction.guild.id}`);

                const index = array.indexOf(name);
                if (index !== -1) {
                    array.splice(index, 1);
                    await db.set(`helpcmd-${interaction.guild.id}`, array);
                }

                let embed = new EmbedBuilder()
                    .setTitle("Command Removed")
                    .setDescription(`<:check:782029189963710464> Successfully deleted command with trigger **!${name}**`)
                    .setColor("Green")

                try {
                    await interaction.reply({ embeds: [embed] })
                } catch (e) {
                    return;
                }
            }
        } else {
            let embed = new EmbedBuilder()
                .setTitle("Command Error")
                .setDescription(`Couldn't find that command in the database!`)
                .setColor("Red")

            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    },
};
