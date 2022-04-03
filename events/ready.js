const { table } = require('table');
const { promisify } = require("util");
const readdir = promisify(require('fs').readdir);

require('colors');
require('dotenv').config();

module.exports = async (client) => {
    
    let on = "Online"

    const evtFiles = await readdir('./events')
    
    console.log(`${table([[`${client.user.username} is ready!`,`Status: ${on.green} | Servers: ${client.guilds.cache.size.toString().yellow} | Events: ${evtFiles.length.toString().yellow} | Commands: ${client.commands.size.toString().yellow}`]])}`);

    client.user.setPresence({
        status: 'idle',
        activities: [{
            name: `myself be made 👀`,
            type: "WATCHING",
        }],
    });

}
