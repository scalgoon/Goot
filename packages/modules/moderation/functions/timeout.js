const { EmbedBuilder } = require('discord.js');

const prisma = require('../../../../utils/prismaClient.js');
const { userHeatLevel } = require('../../../../bot.js');
const VerifyMember = require('../functions/verifyMember.js');

const ShortUniqueId = require('short-unique-id');
const ms = require('ms');

class TimeoutMember {
    constructor(guildID, userID, timeoutReason, timeoutDur, client, staff) {
        this.guildID = guildID;
        this.userID = userID;
        this.timeoutReason = timeoutReason;
        this.timeoutDur = timeoutDur;
        this.client = client;
        this.staff = staff;
    }

    async mute() {

        let memtoverify = new VerifyMember(this.guildID, this.userID);

        await memtoverify.verify();

        const muteGuild = await this.client.guilds.fetch(this.guildID);

        let muteMem = muteGuild.members.cache.find(member => member.id === this.userID);

        const uid = new ShortUniqueId();

        let lid = uid.rnd();

        let timestampDur = ms(this.timeoutDur, { long: true });

        await prisma.userModLog.create({
            data: {
                userid: `${this.guildID}_${this.userID}`,
                logid: `${lid}`,
                staff: `${this.staff.user.username}`,
                action: `Timeout`,
                reason: `${this.timeoutReason}`,
                duration: `${timestampDur}`,
                heatlvl: `2`,
                timestamp: `<t:${Math.floor(new Date() / 1000)}:R>`
            }
        })

        let userHeat = userHeatLevel.get(`${this.userID}_${this.guildID}`);

        let newHeat;

        if (!userHeat) {
            newHeat = parseInt(0) + parseInt(2);
        } else {
            newHeat = parseInt(userHeat) + parseInt(2);
        }

        userHeatLevel.set(`${this.userID}_${this.guildID}`, newHeat);

        let modlog = await prisma.guild.findUnique({
            where: {
                id: this.guildID
            },
            select: {
                log_chnl: true
            }
        })

        await muteMem.timeout(this.timeoutDur, this.timeoutReason);

        let workingTimestamp = (this.timeoutDur/1000) + Math.round(+new Date()/1000);

        if (modlog.log_chnl) {
            let logbed = new EmbedBuilder()
                .setTitle(`Member Muted | LID: ${lid}`)
                .addFields({ name: `Member Affected`, value: `<@${this.userID}>` })
                .addFields({ name: `Given By`, value: `<@${this.staff.user.id}>` })
                .addFields({ name: `Timeout Reason`, value: `${this.timeoutReason}` })
                .addFields({ name: `Timeout Duration`, value: `Ends <t:${workingTimestamp}:R>` })
                .setColor("Blue")
                .setFooter({ text: `Heat: +2 (${newHeat})` })

            await this.client.channels.cache.get(modlog.log_chnl).send({ embeds: [logbed] });
        }

        let mutebed = new EmbedBuilder()
            .setTitle("Timeout Received")
            .setDescription(`> **Guild**: ${muteMem.guild.name}\n> **Reason**: ${this.timeoutReason}`)
            .setColor("Red")
            .setTimestamp(new Date())

        try {
            await muteMem.send({ content: `Your timeout will end <t:${workingTimestamp}:R>`, embeds: [mutebed] });
        } catch (e) {
            if (e.code === "50007") return;
        }

        let obj = {
            title: `User Muted | ${lid}`,
            desc: `<:pass:1355337017357238464> Successfully timed out <@${this.userID}> for **${timestampDur}**`,
            footer: `Heat: +2`,
            id: lid
        }

        return obj;

    }

    async unmute() {
        const muteGuild = await this.client.guilds.fetch(this.guildID);

        let unmuteMem = muteGuild.members.cache.find(member => member.id === this.userID)

        let modlog = await prisma.guild.findUnique({
            where: {
                id: this.guildID
            },
            select: {
                log_chnl: true
            }
        })

        await unmuteMem.timeout(null, this.timeoutReason);

        if (modlog.log_chnl) {
            let logbed = new EmbedBuilder()
                .setTitle(`Member Unmuted`)
                .addFields({ name: `Member Affected`, value: `<@${this.userID}>` })
                .addFields({ name: `Given By`, value: `<@${this.staff.user.id}>` })
                .addFields({ name: `Unmute Reason`, value: `${this.timeoutReason}` })
                .setColor("Blue")

            await this.client.channels.cache.get(modlog.log_chnl).send({ embeds: [logbed] });
        }

        let mutebed = new EmbedBuilder()
            .setTitle("Timeout Removed")
            .setDescription(`Your timeout has been removed in **${unmuteMem.guild.name}**`)
            .setColor("Red")
            .setTimestamp(new Date())

        try {
            await unmuteMem.send({ embeds: [mutebed] });
        } catch (e) {
            if (e.code === "50007") return;
        }

        let obj = {
            title: `User Unmuted`,
            desc: `<:pass:1355337017357238464> Successfully remove the timeout for <@${this.userID}>`,
        }

        return obj;
    }
}

module.exports = TimeoutMember;
