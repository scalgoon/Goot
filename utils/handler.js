const klaw = require('klaw');
const path = require('path');
const { promisify } = require("util");
const readdir = promisify(require('fs').readdir);
const { glob } = require("glob");
const globPromise = promisify(glob);
const fs = require('fs');

module.exports = async (client) => {
    const evtFiles = await readdir('./events')
    console.log(`Loading a total of ${evtFiles.length} events`)
    klaw('./events').on("data", (item) => {
        const evtFile = path.parse(item.path);
        if (!evtFile.ext || evtFile.ext !== ".js") return;
        const event = require(`../events/${evtFile.name}${evtFile.ext}`);
        client.on(evtFile.name, event.bind(null, client));
        client.log('EVENT BIND', `Event ${evtFile.name.green} was linked to file ${(evtFile.name + evtFile.ext).green}`)
    });

}
