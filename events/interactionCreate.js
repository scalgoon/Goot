const { InteractionType, EmbedBuilder, MessageFlags, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

const prisma = require('../utils/prismaClient.js');

module.exports = async (client, interaction) => {
	if (interaction.type === InteractionType.ApplicationCommand) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {

			const convertDefaultPerm = new PermissionsBitField(command.defaultPerm);

			let convertedDefaultPerm = convertDefaultPerm.toArray();

			const noBotPermsEmbed = new EmbedBuilder()
				.setDescription(`<:fail:1355336960729682021> I do not have permission to use this command!`)
				.setColor("Red")
				.setFooter({ text: `This command requires the **${convertedDefaultPerm}** permission` })

			if (!interaction.guild.members.me.permissions.has(command.defaultPerm)) {
				return interaction.reply({ embeds: [noBotPermsEmbed], flags: MessageFlags.Ephemeral });
			}

			if (!interaction.guild) {
				return await command.execute(client, interaction);
			}

			const PermissionSettings = await prisma.guild.findUnique({
				where: {
					id: interaction.guild.id
				},
				select: {
					staff_roles: true,
				}
			})

			let userPermLvl;

			for (let i = 0; i < 6; i++) {
				if (PermissionSettings.staff_roles[`${i}`] !== null) {
					if (interaction.member.roles.cache.some(role => role.id === PermissionSettings.staff_roles[`${i}`])) {
						userPermLvl = i;
					}
				}
			}

			const noPermsEmbed = new EmbedBuilder()
				.setDescription(`<:fail:1355336960729682021> You do not have permission to use this command!`)
				.setColor("Red")
				.setFooter({ text: `This command requires a perm level of ${command.permission} or ${convertedDefaultPerm}` })

			if (userPermLvl === undefined) {
				if (interaction.member.permissions.has(command.defaultPerm)) {
					return await command.execute(client, interaction);
				} else {
					return interaction.reply({ embeds: [noPermsEmbed], flags: MessageFlags.Ephemeral });
				}
			}

			if (userPermLvl >= command.permission || interaction.member.permissions.has(command.defaultPerm)) {
				return await command.execute(client, interaction);
			} else {
				console.log(`user has perm level ${userPermLvl}`)
				return interaction.reply({ embeds: [noPermsEmbed], flags: MessageFlags.Ephemeral });
			}

			// await command.execute(client, interaction);
		} catch (error) {

			let errBed = new EmbedBuilder()
				.setTitle("Command Error")
				.setThumbnail(interaction.guild.iconURL())
				.addFields({ name: "Guild", value: `> ${interaction.guild.name}` }, { name: "Command", value: `> ${interaction.commandName}` }, { name: "Error", value: `\`\`\`js\n${error}\n\`\`\`` })
				.setColor("Red")

			await client.users.cache.get('734784924619505774').send({ embeds: [errBed] });

			console.error(error)

			await interaction.reply({ content: 'An error occurred when executing this command and has been reported to my creator!', flags: MessageFlags.Ephemeral });
		}
	}
}