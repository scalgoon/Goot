const { PrismaClient } = require('@prisma/client');
const moment = require("moment");

const prisma = new PrismaClient();

require('colors');

let type = "PRISMA";
let title = "Log";

console.log(`[${moment().format('D/M/Y HH:mm:ss.SSS').bold.blue}] [${type.magenta}] [${title.yellow}] Connecting to database`);

module.exports = prisma;