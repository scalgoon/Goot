const { Client } = require("discord.js");

const moment = require("moment");
require('colors')
/**
 * Big boi collection of all commands used within the client globally, Usage: client.loadCommands(...)
 * @param {Client} client
 */
module.exports = (client) => {

    /**
     * A fancy log function stolen from the man himself... 3vil.
     * @param {string} type
     * @param {string} msg
     * @param {string} title
     */
    client.log = (type, msg, title) => {
        if (!title) title = "Log";
        else title = title.magenta.bold
        if (!type) type = 'Null'
        if (['err', 'error'].includes(type.toLowerCase())) type = type.bgRed.white.bold

        console.log(`[${moment().format('D/M/Y HH:mm:ss.SSS').bold.blue}] [${type.green}] [${title.yellow}] ${msg}`);
    };
}
