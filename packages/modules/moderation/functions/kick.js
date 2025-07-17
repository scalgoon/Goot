const { EmbedBuilder } = require('discord.js');

const prisma = require('../../../../utils/prismaClient.js');
const { userHeatLevel } = require('../../../../bot.js');
const VerifyMember = require('../functions/verifyMember.js');

const ShortUniqueId = require('short-unique-id');

class KickMember {
    constructor(guild, userID, kickReason, client, staff) {
        this.guild = guild;
        this.userID = userID;
        this.kickReason = kickReason;
        this.client = client;
        this.staff = staff;
    }

    async kick() {

        let memtoverify = new VerifyMember(this.guildID, this.userID);

        await memtoverify.verify();

        const kickGuild = await this.client.guilds.fetch(this.guild);

        let kickMem = kickGuild.members.cache.find(member => member.id === this.userID);

        const uid = new ShortUniqueId();

        let lid = uid.rnd();

        await prisma.userModLog.create({
            data: {
                userid: `${this.guild}_${this.userID}`,
                logid: `${lid}`,
                staff: `${this.staff.user.username}`,
                action: `Kick`,
                reason: `${this.kickReason}`,
                heatlvl: `0`,
                timestamp: `<t:${Math.floor(new Date() / 1000)}:R>`
            }
        })

        let modlog = await prisma.guild.findUnique({
            where: {
                id: this.guild
            },
            select: {
                log_chnl: true
            }
        })

        let kickbed = new EmbedBuilder()
            .setTitle("Kick Received")
            .setDescription(`> **Guild**: ${kickMem.guild.name}\n> **Reason**: ${this.kickReason}`)
            .setColor("Red")
            .setTimestamp(new Date())

        try {
            await kickMem.send({ embeds: [kickbed] });
        } catch (e) {
            if (e.code === "50007") return;
        }

        await kickMem.kick({ reason: this.kickReason });

        if (modlog.log_chnl) {
            let logbed = new EmbedBuilder()
                .setTitle(`Member Kicked | LID: ${lid}`)
                .addFields({ name: `Member Affected`, value: `<@${this.userID}>` })
                .addFields({ name: `Given By`, value: `<@${this.staff.user.id}>` })
                .addFields({ name: `Kick Reason`, value: `${this.kickReason}` })
                .setColor("Red")

            await this.client.channels.cache.get(modlog.log_chnl).send({ embeds: [logbed] });
        }

        let obj = {
            title: `User Kicked | ${lid}`,
            desc: `<:pass:1355337017357238464> Successfully kicked <@${this.userID}>`,
            id: lid
        }

        return obj;
    }
}

module.exports = KickMember;
