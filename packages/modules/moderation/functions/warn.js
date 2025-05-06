const { EmbedBuilder } = require('discord.js');

const prisma = require('../../../../utils/prismaClient.js');
const { userHeatLevel } = require('../../../../bot.js');
const VerifyMember = require('../functions/verifyMember.js');

const ShortUniqueId = require('short-unique-id');

class WarnMember {
    constructor(guildID, userID, warnReason, client, staff) {
        this.guildID = guildID;
        this.userID = userID;
        this.staff = staff
        this.warnReason = warnReason;
        this.client = client;
    }

    async warn() {

        let memtoverify = new VerifyMember(this.guildID, this.userID);

        await memtoverify.verify();

        const warnGuild = await this.client.guilds.fetch(this.guildID);

        let warnMem = warnGuild.members.cache.find(member => member.id === this.userID);

        const uid = new ShortUniqueId();

        let lid = uid.rnd();

        await prisma.userModLog.create({
            data: {
                userid: `${this.guildID}_${this.userID}`,
                logid: `${lid}`,
                staff: `${this.staff.user.username}`,
                action: `Warn`,
                reason: `${this.warnReason}`,
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

        if (modlog.log_chnl) {
            let logbed = new EmbedBuilder()
                .setTitle(`Member Warned | Case: ${lid}`)
                .addFields({ name: `Member Affected`, value: `<@${this.userID}>` })
                .addFields({ name: `Given By`, value: `<@${this.staff.user.id}>` })
                .addFields({ name: `Warn Reason`, value: `${this.warnReason}` })
                .setColor("Yellow")
                .setFooter({ text: `Heat: +2 (${newHeat})` })

            await this.client.channels.cache.get(modlog.log_chnl).send({ embeds: [logbed] });
        }

        let warnbed = new EmbedBuilder()
            .setTitle("Warning Received")
            .setDescription(`You have been warned in **${warnMem.guild.name}** for:\n\`\`\`\n${this.warnReason}\n\`\`\``)
            .setColor("Red")
            .setTimestamp(new Date())

        try {
            await warnMem.send({ embeds: [warnbed] });
        } catch (e) {
            if (e.code === "50007") return;
        }

        let obj = {
            title: `User Warned | ${lid}`,
            desc: `<:pass:1355337017357238464> Successfully warned <@${this.userID}>`,
            footer: `Heat: +2`,
            id: lid
        }

        return obj;
    }
}

module.exports = WarnMember;