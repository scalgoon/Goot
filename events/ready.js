module.exports = (client) => {
    client.log('Bot', 'Goot is online');

    client.user.setPresence({
        status: 'idle',
        activities: [{
            name: `myself be made 👀`,
            type: "WATCHING",
        }],
}, 120000);

}
