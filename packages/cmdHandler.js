// const prisma = require('../utils/prismaClient.js');
const { REST, Routes, Collection } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv').config();

const { QuickDB } = require("quick.db");
const db = new QuickDB();

const { clientCmds } = require('../bot');

class GuildCommands {
    constructor(guild, cmd, interaction) {
        this.guild = guild;
        this.cmd = cmd;
        this.interaction = interaction;
    }

    async load() {

        const commands = [];

        let toInstall = await db.get(`InstalledPackages_${this.guild}`);

        if (toInstall) {
            for (let i = 0; i < toInstall.length; i++) {
                const commandFiles = fs.readdirSync(`./packages/modules/${toInstall[i]}/commands`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`./modules/${toInstall[i]}/commands/${file}`);

                    if ('data' in command && 'execute' in command) {
                        clientCmds.set(command.data.name, command);
                        commands.push(command.data.toJSON());
                    } else {
                        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                    }

                }
            }
        }

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
                    desc: `<:fail:1355336960729682021> ${error}`,
                    color: "Red"
                }

                return details;
            }
        })();

        let details = {
            title: "Package Manager",
            desc: `<:pass:1355337017357238464> Successfully loaded the **${this.cmd}** package`,
            color: "Green"
        }

        return details;

    }

    async unload() {

        const commands = [];

        let toInstall = await db.get(`InstalledPackages_${this.guild}`);

        let beforeFilter = Array.from(toInstall);

        let afterFilter = beforeFilter.filter(pkg => pkg !== this.cmd);

        for (let i = 0; i < afterFilter.length; i++) {
            const commandFiles = fs.readdirSync(`./packages/modules/${afterFilter[i]}/commands`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./modules/${afterFilter[i]}/commands/${file}`);

                if ('data' in command && 'execute' in command) {
                    clientCmds.set(command.data.name, command);
                    commands.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }

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

                console.log(`Successfully removed ${data.length} (${this.cmd}) package guild (/) commands from ${guildId}.`);
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                // console.error(error);

                let details = {
                    title: "Error Removing Package",
                    desc: `<:fail:1355336960729682021> ${error}`,
                    color: "Red"
                }

                return details;
            }
        })();

        let details = {
            title: "Package Manager",
            desc: `<:pass:1355337017357238464> Successfully removed the **${this.cmd}** package`,
            color: "Green"
        }

        return details;

    }

    async reload() {

        const commands = [];

        let toInstall = await db.get(`InstalledPackages_${this.guild}`);

        if (toInstall) {
            for (let i = 0; i < toInstall.length; i++) {
                const commandFiles = fs.readdirSync(`./packages/modules/${toInstall[i]}/commands`).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`./modules/${toInstall[i]}/commands/${file}`);

                    if ('data' in command && 'execute' in command) {
                        clientCmds.set(command.data.name, command);
                        commands.push(command.data.toJSON());
                    } else {
                        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                    }

                }
            }
        } else {
            let details = {
                title: "Error Loading Package",
                desc: `<:fail:1355336960729682021> There are no packages to reload, contact dev`,
                color: "Red"
            }
    
            return details;
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
                    desc: `<:fail:1355336960729682021> ${error}`,
                    color: "Red"
                }

                return details;
            }
        })();

        let details = {
            title: "Package Manager",
            desc: `<:pass:1355337017357238464> Successfully reloaded the **${this.cmd}** package`,
            color: "Green"
        }

        return details;

    }
}

module.exports = GuildCommands;