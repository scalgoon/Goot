// const prisma = require('../utils/prismaClient.js');
const { REST, Routes } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv').config();

const { clientCmds } = require('../bot');

class GuildCommands {
    constructor(guild, cmd) {
        this.guild = guild;
        this.cmd = cmd;
    }

    async load() {

        const commands = [];

        const commandFiles = fs.readdirSync(`./packages/modules/${this.cmd}/commands`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./modules/${this.cmd}/commands/${file}`);

            if ('data' in command && 'execute' in command) {
                clientCmds.set(command.data.name, command);
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }

        }

        const rest = new REST().setToken(process.env.TOKEN);

        let clientId = process.env.CLIENTID;

        let guildId = this.guild;

        // and deploy your commands!
        (async () => {
            try {
                console.log(`Started refreshing ${commands.length} (${this.cmd}) package guild (/) commands for ${guildId}.`);

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands },
                );

                console.log(`Successfully added ${data.length} (${this.cmd}) package guild (/) commands for ${guildId}.`);
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                // console.error(error);

                let details = {
                    title: "Error Loading Package",
                    desc: `<:cross:782029257739599873> ${error}`,
                    color: "Red"
                }
        
                return details;
            }
        })();

        let details = {
            title: "Package Manager",
            desc: `<:check:782029189963710464> Successfully loaded the **${this.cmd}** package`,
            color: "Green"
        }

        return details;

    }

    async unload() {

        const commands = [];

        const commandFiles = fs.readdirSync(`./packages/modules/${this.cmd}/commands`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./modules/${this.cmd}/commands/${file}`);

            if ('data' in command && 'execute' in command) {
                clientCmds.set(command.data.name, null);
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }

        }

        const rest = new REST().setToken(process.env.TOKEN);

        let clientId = process.env.CLIENTID;

        let guildId = this.guild;

        // and deploy your commands!
        (async () => {
            try {
                console.log(`Started refreshing ${commands.length} (${this.cmd}) package guild (/) commands for ${guildId}.`);

                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.delete(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands },
                );

                console.log(`Successfully removed ${data.length} (${this.cmd}) package guild (/) commands from ${guildId}.`);
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                // console.error(error);

                let details = {
                    title: "Error Removing Package",
                    desc: `<:cross:782029257739599873> ${error}`,
                    color: "Red"
                }
        
                return details;
            }
        })();

        let details = {
            title: "Package Manager",
            desc: `<:check:782029189963710464> Successfully removed the **${this.cmd}** package`,
            color: "Green"
        }

        return details;

    }
}

module.exports = GuildCommands;