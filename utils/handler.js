const klaw = require('klaw');
const path = require('path');
const { promisify } = require("util");
const readdir = promisify(require('fs').readdir);
const { glob } = require("glob");
const globPromise = promisify(glob);

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

    const commands = [];
    const slashCommandFiles = fs.readdirSync('../slashCommands').filter(file => file.endsWith('.js'));

    const clientId = '784903173767823370';

    // const guildid = '804846257729175623'

    for (const file of slashCommandFiles) {
        const command = require(`./slashCommands/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(process.env.token);

    (async () => {
        try {
            console.log(`> Started refreshing application (/) commands.`)

            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            console.log(`> Successfully reloaded application (/) commands.`)
        } catch (error) {
            console.error(error);
        }
    })();

}