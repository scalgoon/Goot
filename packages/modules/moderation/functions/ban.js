const prisma = require('../utils/prismaClient.js');

const { EmbedBuilder } = require('discord.js');

const ShortUniqueId = require('short-unique-id');

class BanMember {
    constructor(guild, userID, banReason, client, staff, interaction) {
        this.guild = guild;
        this.userID = userID;
        this.banReason = banReason;
        this.client = client;
        this.staff = staff;
        this.interaction = interaction;
    }

    async ban() {

        const uid = new ShortUniqueId();

        let lid = uid.rnd();

        await prisma.userModLog.create({
            data: {
                userid: `${this.guild}_${this.userID}`,
                logid: `${lid}`,
                staff: `${this.staff.user.username}`,
                action: `Ban`,
                reason: `${this.banReason}`,
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

        const banGuild = await this.client.guilds.fetch(this.guild);

        let banMem = banGuild.members.cache.find(member => member.id === this.userID) || null;

        if (banMem) {
            let banbed = new EmbedBuilder()
                .setTitle("Ban Received")
                .setDescription(`> **Guild**: ${banMem.guild.name}\n> **Reason**: ${this.banReason}`)
                .setColor("Red")
                .setTimestamp(new Date())

            try {
                await banMem.send({ embeds: [banbed] });
            } catch (e) {
                if (e.code === "50007") return;
            }
        }

        await this.interaction.guild.members.ban(this.userID, { reason: this.banReason });

        let logbed = new EmbedBuilder()
            .setTitle(`Member Banned | LID: ${lid}`)
            .addFields({ name: `Member Affected`, value: `<@${this.userID}>` })
            .addFields({ name: `Given By`, value: `<@${this.staff.user.id}>` })
            .addFields({ name: `Ban Reason`, value: `${this.banReason}` })
            .setColor("Red")

        await this.client.channels.cache.get(modlog.log_chnl).send({ embeds: [logbed] });

        let obj = {
            title: `User Banned | ${lid}`,
            desc: `<:pass:1355337017357238464> Successfully banned <@${this.userID}>`,
            id: lid
        }

        return obj;
    }

    async unban() {

        let modlog = await prisma.guild.findUnique({
            where: {
                id: this.guild
            },
            select: {
                log_chnl: true
            }
        })

        const banGuild = await this.client.guilds.fetch(this.guild);

        let bans = await banGuild.bans.fetch(this.userID);

        let bannedUser = await bans.user.fetch();

        await banGuild.members.unban(bannedUser, this.banReason);

        let logbed = new EmbedBuilder()
            .setTitle(`Member Unbanned`)
            .addFields({ name: `Member Affected`, value: `<@${this.userID}>` })
            .addFields({ name: `Given By`, value: `<@${this.staff.user.id}>` })
            .addFields({ name: `Unban Reason`, value: `${this.banReason}` })
            .setColor("Green")

        await this.client.channels.cache.get(modlog.log_chnl).send({ embeds: [logbed] });

        let obj = {
            title: `User Unbanned`,
            desc: `<:pass:1355337017357238464> Successfully unbanned <@${this.userID}>`,
        }

        return obj;
    }
}

module.exports = BanMember;
