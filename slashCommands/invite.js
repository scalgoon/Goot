const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Used to invite the bot to your server'),
	async execute(client, interaction, prisma) {
		
        let invbed = new EmbedBuilder()
        .setTitle("Thanks for choosing me!")
        .setDescription("You can invite me [here](https://discord.com/api/oauth2/authorize?client_id=784903173767823370&permissions=8&scope=applications.commands%20bot)")
        .setColor("Green")

        interaction.reply({ embeds: [invbed] })

    }
};
