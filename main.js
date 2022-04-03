const { Collection, Discord, Client } = require('discord.js');

require('dotenv').config()

const client = new Client({
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING',
        'GUILD_BANS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_INTEGRATIONS',
        'GUILD_INVITES',
        'GUILD_VOICE_STATES',
        'GUILD_PRESENCES',
    ],
    allowedMentions: ["roles", "users"],
    partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION']
});

const fs = require('fs');
// const config = require('./config.json');
// const klaw = require('klaw');
const path = require('path');
//const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageEmbed } = require('discord.js');


client.commands = new Collection();

const commandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./slashCommands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

require("./utils/utilsMain")(client);
require("colors");
require('./utils/handler')(client);

const commands = [];
const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

const clientId = '784903173767823370';

const guildid = '804846257729175623'

for (const file of slashCommandFiles) {
    const command = require(`./slashCommands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.token);

(async () => {
    try {
        console.log(`> Started refreshing application (/) commands.`)

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log(`> Successfully reloaded application (/) commands.`)
    } catch (error) {
        console.error(error);
    }
})();

client.login(process.env.token)
