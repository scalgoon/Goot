const { EmbedBuilder } = require('discord.js');

module.exports = async (client, guild) => {

  let embed = new MessageEmbed()
		.setTitle("Hi i'm Goot!")
		.setDescription("I'm a bot centered around custom fearures!\nTo get started do <:slash:908546180265422909> to see all my commands.\n\nCustom commands work with the prefix <:legacy:908546232127979570>")
		.setColor("Random")


    if (guild.systemChannel) {
        guild.systemChannel.send({ embeds: [embed] }).catch(e => client.log("SEND ERROR", "Was unable to send Hello embed in system channel"))
    }

    console.log(`Server joined: ${guild.name}`);
};
