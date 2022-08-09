const { Collection, Discord, Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');

require('dotenv').config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences

    ],
    partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],
    presence: {
        activities: [{
            name: `My commands be made <3`,
            type: ActivityType.Watching
        }]
    }
});

const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');


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
