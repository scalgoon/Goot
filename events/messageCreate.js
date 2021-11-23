const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const  { MessageEmbed } = require('discord.js');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = async (client, message) => {
    if (!message.guild ||
        message.author.bot) return;

        const prefix = "!"

        const prefixRegex = new RegExp(`^(${escapeRegex(prefix)})\\s*`);

        if (!prefixRegex.test(message.content)) return;

        const [ matchedPrefix ] = message.content.match(prefixRegex);

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

        if(textExists) {

            if(textExists.guild === message.guild.id) {

                if(textExists.permission === "staff") {
                    if(!message.member.permissions.has("MANAGE_MESSAGES")) return;
                }

                if(textExists.permission === "admin") {
                    if(!message.member.permissions.has("ADMINISTRATOR")) return;
                }

                if(textExists.deltrig === true) {
                    message.delete();
                    message.channel.send(`${textExists.text}`);
                    return;
                } else {
                    message.reply(`${textExists.text}`);
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

        if(embedExists) {

            if(embedExists.permission === "staff") {
                if(!message.member.permissions.has("MANAGE_MESSAGES")) return;
            }

            if(embedExists.permission === "admin") {
                if(!message.member.permissions.has("ADMINISTRATOR")) return;
            }

            if(embedExists.guild === message.guild.id) {
                let embed = new MessageEmbed()
                .setDescription(`${embedExists.description}`)
                .setColor("RANDOM")

                if(embedExists.title) {
                    embed.setTitle(`${embedExists.title}`)
                }
                
                if(embedExists.deltrig === true) {
                    message.delete();
                    message.channel.send({ embeds: [embed] });
                    return;
                } else {
                    message.reply({ embeds: [embed] });
                }
    
            }

        }

}
