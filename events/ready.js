const { REST, Routes, ActivityType } = require('discord.js');

const { table } = require('table');
const { promisify } = require("util");
const readdir = promisify(require('fs').readdir);

const { clientCmds } = require('../bot');
const prisma = require('../utils/prismaClient');

require('colors');
require('dotenv').config();

const fs = require('node:fs');

module.exports = async (client) => {

    // set guild commands

    (async () => {
        const Guilds = client.guilds.cache.map(guild => guild.id);

        const commands = [];

        for (let i = 0; i < Guilds.length; i++) {

            const GuildSettings = await prisma.guild.findUnique({
                where: {
                    id: Guilds[i]
                },
                select: {
                    installed_packages: true
                }
            })

            const hasPackagesInstalled = GuildSettings.installed_packages["modules"];

            if (hasPackagesInstalled) {
                for (let i = 0; i < hasPackagesInstalled.length; i++) {
                    const commandFiles = fs.readdirSync(`packages/modules/${hasPackagesInstalled[i]}/commands`).filter(file => file.endsWith('.js'));
                    for (const file of commandFiles) {
                        const command = require(`../packages/modules/${hasPackagesInstalled[i]}/commands/${file}`);

                        if ('data' in command && 'execute' in command) {
                            clientCmds.set(command.data.name, command);
                            commands.push(command.data.toJSON());
                        } else {
                            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                        }

                    }
                }
            }
        }
    })();

    // presence

    client.user.setPresence({
        activities: [{
            name: `🦎 ${client.guilds.cache.size} servers configure me!`,
            type: ActivityType.Watching
        }],
        status: 'idle',
    });

    // fancy logs

    let on = "Idle";

    const evtFiles = await readdir('./events');

    console.log(`${table([[`${client.user.username} is ready!`, `Status: ${on.yellow} | Servers: ${client.guilds.cache.size.toString().yellow} | Events: ${evtFiles.length.toString().yellow} | Commands: ${client.commands.size.toString().yellow || "0"}`]])}`);

}
