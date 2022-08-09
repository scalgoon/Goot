const { table } = require('table');
const { promisify } = require("util");
const readdir = promisify(require('fs').readdir);

require('colors');
require('dotenv').config();

module.exports = async (client) => {
    
    let on = "Idle"

    const evtFiles = await readdir('./events')
    
    console.log(`${table([[`${client.user.username} is ready!`,`Status: ${on.yellow} | Servers: ${client.guilds.cache.size.toString().yellow} | Events: ${evtFiles.length.toString().yellow} | Commands: ${client.commands.size.toString().yellow}`]])}`);


}
