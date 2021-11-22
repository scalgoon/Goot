const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const  { MessageEmbed } = require('discord.js');

module.exports = async (client, message) => {
    if (!message.guild ||
        message.author.bot) return;

        const textExists = await prisma.cCommands.findUnique({
            where: {
                id: message.content
            },
            select: {
                text: true,
                guild: true,
                deltrig: true
            }
        })

        if(textExists) {

            if(textExists.guild === message.guild.id) {

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
                id: message.content
            },
            select: {
                description: true,
                guild: true,
                title: true,
                deltrig: true
            }
        })

        if(embedExists) {

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