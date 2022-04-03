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

    const cmdExists = await prisma.commands.findUnique({
        where: {
            placeholder: `!${args[0] + message.guild.id}`
        },
        select: {
            text: true,
            guild: true,
            deltrig: true,
            permission: true,
            title: true,
            description: true,
        }
    })

    if (cmdExists) {

        if (cmdExists.guild === message.guild.id) {

            if (cmdExists.permission === "staff") {
                if (!message.member.permissions.has("MANAGE_MESSAGES")) return;
            }

            if (cmdExists.permission === "admin") {
                if (!message.member.permissions.has("ADMINISTRATOR")) return;
            }

            const answers = [
                'Maybe.',
                'Certainly not.',
                'I hope so.',
                'Not in your wildest dreams.',
                'There is a good chance.',
                'Quite likely.',
                'I think so.',
                'I hope not.',
                'I hope so.',
                'Never!',
                'Fuhgeddaboudit.',
                'Ahaha! Really?!?',
                'Pfft.',
                'Sorry, bucko.',
                'Hell, yes.',
                'Hell to the no.',
                'The future is bleak.',
                'The future is uncertain.',
                'I would rather not say.',
                'Who cares?',
                'Possibly.',
                'Never, ever, ever.',
                'There is a small chance.',
                'Yes!'
            ];


            let obj = {
                $text: {
                    value: args.splice(1).join(" ") || "Nothing inserted"
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
                },
                $8ball: {
                    value: answers[Math.floor(Math.random() * answers.length)]
                }
            }

            let newtext;
            let newembed;

            if (cmdExists.text) {
                newtext = cmdExists.text.replace("$text", obj.$text.value).replace("$userID", obj.$userID.value).replace("$serverID", obj.$serverID.value).replace("$user", obj.$user.value).replace("$channel", obj.$channel.value).replace("$nl", obj.$nl.value).replace("$8ball", obj.$8ball.value)
            } else if (cmdExists.description) {
                newembed = cmdExists.description.replace("$text", obj.$text.value).replace("$userID", obj.$userID.value).replace("$serverID", obj.$serverID.value).replace("$user", obj.$user.value).replace("$channel", obj.$channel.value).replace("$nl", obj.$nl.value).replace("$8ball", obj.$8ball.value)
            }

            let toembed = new MessageEmbed()
                .setDescription(`${newembed}`)
                .setColor("RANDOM")

            if (cmdExists.title) {
                toembed.setTitle(`${cmdExists.title}`)
            }

            const cusbot = await prisma.custombot.findUnique({
                where: {
                    id: message.guild.id,
                },
                select: {
                    botname: true,
                    botavatar: true,
                }
            })

            if (cusbot) {

                const hooks = await message.channel.fetchWebhooks()
                const hook = hooks.find(webj => webj.name === cusbot.botname)

                if (!hook) {
                    let newhook = await message.channel.createWebhook(cusbot.botname, {
                        avatar: cusbot.botavatar,
                        reason: "Required for Goot's custom bot feature"
                    })

                    if (cmdExists.deltrig === true) {
                        if (cmdExists.text) {
                            message.delete();
                            newhook.send(`${newtext}`);
                        }

                        if (cmdExists.description) {
                            message.delete();
                            newhook.send({ embeds: [toembed] });
                        }
                        return;
                    } else {
                        if (cmdExists.text) {
                            newhook.send(`${newtext}`);
                        }

                        if (cmdExists.description) {
                            newhook.send({ embeds: [toembed] });
                        }
                    }

                } else {
                    if (cmdExists.deltrig === true) {
                        if (cmdExists.text) {
                            message.delete();
                            hook.send(`${newtext}`);
                        }

                        if (cmdExists.description) {
                            message.delete();
                            hook.send({ embeds: [toembed] });
                        }
                        return;
                    } else {
                        if (cmdExists.text) {
                            hook.send(`${newtext}`);
                        }

                        if (cmdExists.description) {
                            hook.send({ embeds: [toembed] });
                        }
                    }
                }

            } else {

                if (cmdExists.deltrig === true) {
                    if (cmdExists.text) {
                        message.delete();
                        message.channel.send(`${newtext}`);
                    }

                    if (cmdExists.description) {
                        message.delete();
                        message.channel.send({ embeds: [toembed] });
                    }
                    return;
                } else {
                    if (cmdExists.text) {
                        message.channel.send(`${newtext}`);
                    }

                    if (cmdExists.description) {
                        message.channel.send({ embeds: [toembed] });
                    }
                }

            }

        }

    }

}
