const { EmbedBuilder, ChannelType } = require('discord.js');
const db = require('quick.db');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = async (client, message) => {
    if (message.channel.type === ChannelType.DM ||
        message.author.bot) return;

    const prefix = "!"

    const prefixRegex = new RegExp(`^(${escapeRegex(prefix)})\\s*`);

    if (!prefixRegex.test(message.content)) return;

    const [matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);

    const cmdExists = db.fetch(`!${args[0]}-${message.guild.id}`);

    if (cmdExists) {

        if (cmdExists.guild === message.guild.id) {

            if (cmdExists.perms === "staff") {
                if (!message.member.permissions.has("MANAGE_MESSAGES")) return;
            }

            if (cmdExists.perms === "admin") {
                if (!message.member.permissions.has("ADMINISTRATOR")) return;
            }


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
            }

            let newtext = cmdExists.text;
            let newembed = cmdExists.description;

            if (cmdExists.text) {
                newtext = cmdExists.text.replace("$text", obj.$text.value).replace("$userID", obj.$userID.value).replace("$serverID", obj.$serverID.value).replace("$user", obj.$user.value).replace("$channel", obj.$channel.value).replace("$nl", obj.$nl.value)
            } else if (cmdExists.description) {
                newembed = cmdExists.description.replace("$text", obj.$text.value).replace("$userID", obj.$userID.value).replace("$serverID", obj.$serverID.value).replace("$user", obj.$user.value).replace("$channel", obj.$channel.value).replace("$nl", obj.$nl.value)
            }

            let toembed = new EmbedBuilder()
                .setDescription(`${newembed}`)
                .setColor("Random")

            if (cmdExists.title) {
                toembed.setTitle(`${cmdExists.title}`)
            }

            // let cusbot = db.fetch(`custombot-${message.guild.id}`);

            // if (cusbot) {

                // const hooks = await message.channel.fetchWebhooks()
                // const hook = hooks.find(webj => webj.name === cusbot.botname)

                // if (!hook) {
                //     let newhook = await message.channel.createWebhook(cusbot.botname, {
                //         avatar: cusbot.botavatar,
                //         reason: "Required for Goot's custom bot feature"
                //     })

                //     if (cmdExists.deltrig === true) {
                //         if (cmdExists.text) {
                //             message.delete();
                //             newhook.send(`${newtext}`);
                //         }

                //         if (cmdExists.description) {
                //             message.delete();
                //             newhook.send({ embeds: [toembed] });
                //         }
                //         return;
                //     } else {
                //         if (cmdExists.text) {
                //             newhook.send(`${newtext}`);
                //         }

                //         if (cmdExists.description) {
                //             newhook.send({ embeds: [toembed] });
                //         }
                //     }

                // } else {
                //     if (cmdExists.deltrig === true) {
                //         if (cmdExists.text) {
                //             message.delete();
                //             hook.send(`${newtext}`);
                //         }

                //         if (cmdExists.description) {
                //             message.delete();
                //             hook.send({ embeds: [toembed] });
                //         }
                //         return;
                //     } else {
                //         if (cmdExists.text) {
                //             hook.send(`${newtext}`);
                //         }

                //         if (cmdExists.description) {
                //             hook.send({ embeds: [toembed] });
                //         }
                //     }
                // }

            // } else {

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

            // }

        }

    }

}
