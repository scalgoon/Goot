const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { EmbedBuilder, Permissions } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cc-edit')
        .setDescription('Edits a custom command')
        .addStringOption(option => option.setName('name').setDescription('Enter the name of command').setRequired(true))
        .addStringOption(option => option.setName('text').setDescription('Enter new text for the command'))
        .addStringOption(option => option.setName('title').setDescription('Enter a new title for the command'))
        .addStringOption(option => option.setName('description').setDescription('Enter a new description for the command')),
    async execute(client, interaction) {

        let noperm = new EmbedBuilder()
            .setDescription(`<:cross:782029257739599873> You do not have permission to use this command!`)
            .setColor("Red")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Manage_Guild)) {
            return interaction.reply({ embeds: [noperm] });
        }

        const name = interaction.options.getString('name')
        const text = interaction.options.getString('text')
        const title = interaction.options.getString('title')
        const description = interaction.options.getString('description')

        let exists = db.fetch(`!${name}-${interaction.guild.id}`);

        if (exists) {

            if (exists.guild === interaction.guild.id) {

                if (text) {
                    let doesText = await db.fetch(`!${name}-${interaction.guild.id}.text`)

                    let notext = new EmbedBuilder()
                        .setDescription(`<:cross:782029257739599873> This command does not have any message text!`)
                        .setColor("Red")

                    if (!doesText) {
                        return interaction.reply({ embeds: [notext] });
                    }

                    await db.set(`!${name}-${interaction.guild.id}.text`, text);

                    let embed = new EmbedBuilder()
                    .setTitle("Command Edited")
                    .setDescription(`<:check:782029189963710464> Successfully edited command with trigger **!${name}**`)
                    .setColor("Green")

                    try {
                        await interaction.reply({ embeds: [embed] })
                    } catch (e) {
                        return;
                    }

                } else if (!title && !description && !text) {

                    let notexts = new EmbedBuilder()
                    .setDescription(`<:cross:782029257739599873> Please select a option to edit`)
                    .setColor("Red")

                    return interaction.reply({ embeds: [notexts] });
                

                } else if (title || description) {
                    let doesTitle = await db.fetch(`!${name}-${interaction.guild.id}.title`)

                    let doesDesc = await db.fetch(`!${name}-${interaction.guild.id}.description`)

                    let notext = new EmbedBuilder()
                        .setDescription(`<:cross:782029257739599873> This command does not have any titles nor descriptions!`)
                        .setColor("Red")

                    if (!doesTitle && !doesDesc) {
                        return interaction.reply({ embeds: [notext] });
                    }

                    if(title) {
                        if(!doesTitle) {

                            let notext = new EmbedBuilder()
                        .setDescription(`<:cross:782029257739599873> This command does not have a title!`)
                        .setColor("Red")

                        return interaction.reply({ embeds: [notext] });
                        }
                    }

                    if(description) {
                        if(!doesDesc) {

                            let notext = new EmbedBuilder()
                        .setDescription(`<:cross:782029257739599873> This command does not have a description!`)
                        .setColor("Red")

                        return interaction.reply({ embeds: [notext] });
                        }
                    }

                    if(doesTitle) {
                        await db.set(`!${name}-${interaction.guild.id}.title`, title);
                    }

                    if(doesDesc) {
                        await db.set(`!${name}-${interaction.guild.id}.description`, description);
                    }


                    let embed = new EmbedBuilder()
                    .setTitle("Command Edited")
                    .setDescription(`<:check:782029189963710464> Successfully edited command with trigger **!${name}**`)
                    .setColor("Green")

                    try {
                        await interaction.reply({ embeds: [embed] })
                    } catch (e) {
                        return;
                    }
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
