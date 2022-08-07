const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('quick.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cc-add')
    .setDescription('Creates a custom command')
    .addSubcommand(subcommand => subcommand
      .setName('text')
      .setDescription('Text for the custom command')
      .addStringOption(option => option.setName('name').setDescription('Enter a name for the command').setRequired(true))
      .addStringOption(option => option.setName('text').setDescription('Enter text for the bot to say').setRequired(true))
      .addStringOption(option => option.setName('permissions').setDescription('Set the perms required to run the command').addChoices({ name: 'User', value: 'user' }, { name: 'Staff', value: 'staff' }, { name: 'Admin', value: 'admin' }).setRequired(true))
      .addBooleanOption(option => option.setName('del-trigger').setDescription('Delets the trigger message')))
    .addSubcommand(subcommand => subcommand
      .setName('embed')
      .setDescription('Embed for the custom command')
      .addStringOption(option => option.setName('name').setDescription('Enter a name for the command').setRequired(true))
      .addStringOption(option => option.setName('description').setDescription('Enter description for the embed').setRequired(true))
      .addStringOption(option => option.setName('permissions').setDescription('Set the perms required to run the command').addChoices({ name: 'User', value: 'user' }, { name: 'Staff', value: 'staff' }, { name: 'Admin', value: 'admin' }).setRequired(true))
      .addStringOption(option => option.setName('title').setDescription('Enter a title for the embed'))
      .addBooleanOption(option => option.setName('del-trigger').setDescription('Delets the trigger message'))),
  async execute(client, interaction) {

    let noperm = new EmbedBuilder()
      .setDescription(`<:cross:782029257739599873> You do not have permission to use this command!`)
      .setColor("Red")

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Manage_Guild)) { return interaction.reply({ embeds: [noperm], ephemeral: true }) }

    if (interaction.options.getSubcommand() === 'text') {
      const name = interaction.options.getString('name')
      const text = interaction.options.getString('text')
      const deltrig = interaction.options.getBoolean('del-trigger')
      const perms = interaction.options.getString('permissions')

      let exists = db.fetch(`!${name}-${interaction.guild.id}`);

      if (exists) {

        if (exists.guild === interaction.guild.id) {
          let embed = new EmbedBuilder()
            .setTitle("Command Error")
            .setDescription(`That command already exists!`)
            .setColor("Red")

          interaction.reply({ embeds: [embed], ephemeral: true })
        }

      } else {

        if (text?.length >= 280 || name?.length >= 9) {
          let badembed = new EmbedBuilder()
            .setTitle("Command Error")
            .setDescription(`The text provided is too long!`)
            .setFooter({ text: "Limit is 280 characters" })
            .setColor("Red")

          return interaction.reply({ embeds: [badembed], ephemeral: true });
        }

        await db.set(`!${name}-${interaction.guild.id}`, { name: name, text: text, deltrig: deltrig, perms: perms, guild: interaction.guild.id });

        await db.push(`helpcmd-${interaction.guild.id}`, name);

        let embed = new EmbedBuilder()
          .setTitle("Command Made")
          .setDescription(`<:check:782029189963710464> Successfully made command with trigger **!${name}**`)
          .setColor("Green")

        try {
          await interaction.reply({ embeds: [embed] })
        } catch (e) {
          return;
        }
      }
    }

    if (interaction.options.getSubcommand() === 'embed') {
      const name = interaction.options.getString('name')
      const description = interaction.options.getString('description')
      let title = interaction.options.getString('title')
      const deltrig = interaction.options.getBoolean('del-trigger')
      const perms = interaction.options.getString('permissions')

      if (!title) {
        title = null
      }

      let exists = db.fetch(`!${name}-${interaction.guild.id}`);

      if (exists) {

        if (exists.guild === interaction.guild.id) {
          let embed = new EmbedBuilder()
            .setTitle("Command Error")
            .setDescription(`That command already exists!`)
            .setColor("Red")

          interaction.reply({ embeds: [embed], ephemeral: true })
        }

      } else {

        if (description?.length >= 280 || name?.length >= 9 || title?.length >= 30) {
          let badembed = new EmbedBuilder()
            .setTitle("Command Error")
            .setDescription(`The text provided is too long!`)
            .setFooter({ text: "Limit is 280 characters" })
            .setColor("Red")

          return interaction.reply({ embeds: [badembed], ephemeral: true });
        }

        await db.set(`!${name}-${interaction.guild.id}`, { name: name, title: title, description: description, deltrig: deltrig, perms: perms, guild: interaction.guild.id });

        await db.push(`helpcmd-${interaction.guild.id}`, name);

        let embed = new EmbedBuilder()
          .setTitle("Command Made")
          .setDescription(`<:check:782029189963710464> Successfully made command with trigger **!${name}**`)
          .setColor("Green")

        try {
          await interaction.reply({ embeds: [embed] })
        } catch (e) {
          return;
        }
      }
    }
  },
};
