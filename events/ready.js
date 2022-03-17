const { table } = require('table');
const { promisify } = require("util");
const readdir = promisify(require('fs').readdir);
const mongoose = require('mongoose');

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
    
    //In your .env file you will replace "DATABASE_URL" with "database" and there place your mongo connection string.

    await mongoose.connect(process.env.database || '', {
        keepAlive: true
    });

    client.log("Mongo", "Database connected successfully");

}
