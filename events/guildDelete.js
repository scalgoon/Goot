const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async (client, guild) => {
    console.log(`Server left: ${guild.name}`);

        await prisma.guild.delete({   
          where: {
              id: guild.id
          }     
        })

        client.log("Prisma", `Guild deleted with id: ${guild.id}`)
};