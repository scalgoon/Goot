const { ShardingManager } = require('discord.js');

const dotenv = require('dotenv').config();
const moment = require("moment");

require('colors');

const manager = new ShardingManager('./bot.js', {
    token: process.env.TOKEN,
    totalShards: "auto"
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

let type = "SYSTEM";
let title = "Log";

console.log(`[${moment().format('D/M/Y HH:mm:ss.SSS').bold.blue}] [${type.green}] [${title.yellow}] Starting up client and shard timeout`);

setTimeout(() => {
    manager.spawn();
}, 30000);