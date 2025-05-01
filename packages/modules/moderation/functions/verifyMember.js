const prisma = require('../../../../utils/prismaClient.js');

class VerifyMember {
    constructor(guildID, memberID) {
        this.guildID = guildID;
        this.memberID = memberID;
    }

    async verify() {

        const userInDatabase = await prisma.user.findUnique({
            where: {
                id: `${this.guildID}_${this.memberID}`
            },
        })

        if (userInDatabase === null) {
            await prisma.user.create({
                data: {
                    id: `${this.guildID}_${this.memberID}`
                }
            })

            return true;
        }

        return true;
        
    }
}

module.exports = VerifyMember;