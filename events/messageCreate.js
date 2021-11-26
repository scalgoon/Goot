const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { MessageEmbed } = require('discord.js');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = async (client, message) => {
    if (!message.guild ||
        message.author.bot) return;

    const prefix = "!"

    const prefixRegex = new RegExp(`^(${escapeRegex(prefix)})\\s*`);

    if (!prefixRegex.test(message.content)) return;

    const [matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);

    const textExists = await prisma.cCommands.findUnique({
        where: {
            placeholder: `${args[0] + message.guild.id}`
        },
        select: {
            text: true,
            guild: true,
            deltrig: true,
            permission: true
        }
    })

    if (textExists) {

        if (textExists.guild === message.guild.id) {

            if (textExists.permission === "staff") {
                if (!message.member.permissions.has("MANAGE_MESSAGES")) return;
            }

            if (textExists.permission === "admin") {
                if (!message.member.permissions.has("ADMINISTRATOR")) return;
            }


            let obj = {
                $text: {
                    value: args.splice(1).join(" ")
                },
                $userID: {
                    value: message.author.id
                },
                $serverID: {
                    value: message.guild.id
                },
                $user: {
                    value: message.mentions.users.first() || ""
                },
                $channel: {
                    value: message.mentions.channels.first() || ""
                },
                $nl: {
                    value: "\n"
                }
            }

            let newtext = textExists.text.replace("$text", obj.$text.value).replace("$userID", obj.$userID.value).replace("$serverID", obj.$serverID.value).replace("$user", obj.$user.value).replace("$channel", obj.$channel.value).replace("$nl", obj.$nl.value)


            if (textExists.deltrig === true) {
                message.delete();
                message.channel.send(`${newtext}`);
                return;
            } else {
                message.reply(`${newtext}`);
            }

        }

    }

    const embedExists = await prisma.cCEmbeds.findUnique({
        where: {
            placeholder: `${args[0] + message.guild.id}`
        },
        select: {
            description: true,
            guild: true,
            title: true,
            deltrig: true,
            permission: true
        }
    })

    if (embedExists) {

        if (embedExists.permission === "staff") {
            if (!message.member.permissions.has("MANAGE_MESSAGES")) return;
        }

        if (embedExists.permission === "admin") {
            if (!message.member.permissions.has("ADMINISTRATOR")) return;
        }

        const obj = {
            $text: {
                value: args.splice(1).join(" ")
            },
            $userID: {
                value: message.author.id
            },
            $serverID: {
                value: message.guild.id
            },
            $user: {
                value: message.mentions.users.first() || ""
            },
            $channel: {
                value: message.mentions.channels.first() || ""
            },
            $nl: {
                value: "\n"
            }
        }

        let newtext = embedExists.description.replace("$text", obj.$text.value).replace("$userID", obj.$userID.value).replace("$serverID", obj.$serverID.value).replace("$user", obj.$user.value).replace("$channel", obj.$channel.value).replace("$nl", obj.$nl.value)


        if (embedExists.guild === message.guild.id) {
            let embed = new MessageEmbed()
                .setDescription(`${newtext}`)
                .setColor("RANDOM")

            if (embedExists.title) {
                embed.setTitle(`${embedExists.title}`)
            }

            if (embedExists.deltrig === true) {
                message.delete();
                message.channel.send({ embeds: [embed] });
                return;
            } else {
                message.reply({ embeds: [embed] });
            }

        }

    }

}
