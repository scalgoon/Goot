const { EmbedBuilder } = require('discord.js');

const prisma = require('../utils/prismaClient.js');

module.exports = async (client, guild) => {

    let embed = new EmbedBuilder()
        .setTitle("Hello, I'm Goot!")
        .setDescription("I'm your one stop shop for guild customizability!\nTo get started do <:slash:908546180265422909> to see all my commands.")
        .setColor("#911729")

    let joinBed = new EmbedBuilder()
        .setTitle("<:join:908546106227576862> Guild Joined")
        .setThumbnail(guild.iconURL())
        .setColor('Green')
        .addFields(
            { name: "Name", value: `> ${guild.name}` },
            { name: "ID", value: `> ${guild.id}` },
            { name: "Guild Owner ID", value: `> ${guild.ownerId}` },
            { name: "Current Guild Count", value: client.guilds.cache.size.toString() }
        )

    if (guild.systemChannel) {
        guild.systemChannel.send({ embeds: [embed] }).catch(e => client.log("SEND ERROR", "Was unable to send Hello embed in system channel"))
    }

    try {
        await client.channels.cache.get('756543100918431807').send({ embeds: [joinBed] });
    } catch (e) { }

    // database stuff

    const staffRolesInteger = {
        "0": null,
        "1": null,
        "2": null,
        "3": null,
        "4": null,
        "5": null
    };

    const installedPackages = {
        "modules": []
    };

    const guildExists = await prisma.guild.findUnique({
        where: {
            id: guild.id
        },
    })

    if (guildExists === null) {
        await prisma.guild.create({
            data: {
                id: guild.id,
                staff_roles: staffRolesInteger,
                installed_packages: installedPackages
            }
        })
    }

};