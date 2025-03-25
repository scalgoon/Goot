const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = async (interaction, pages, time = 30 * 1000) => {

    try {

        await interaction.deferReply();

        if (pages.length === 1) {
            return await interaction.editReply({ embeds: pages, components: [], fetchReply: true });
        }

        let index = 0;

        const first = new ButtonBuilder()
            .setCustomId('pageFirst')
            .setEmoji('⏪')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)

        const prev = new ButtonBuilder()
            .setCustomId('pagePrev')
            .setEmoji('⬅️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)

        const pageCount = new ButtonBuilder()
            .setCustomId('pageCount')
            .setLabel(`${index + 1}/${pages.length}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)

        const next = new ButtonBuilder()
            .setCustomId('pageNext')
            .setEmoji('➡️')
            .setStyle(ButtonStyle.Primary)

        const last = new ButtonBuilder()
            .setCustomId('pageLast')
            .setEmoji('⏩')
            .setStyle(ButtonStyle.Primary)

        const buttons = new ActionRowBuilder().addComponents([first, prev, pageCount, next, last]);

        const msg = await interaction.editReply({ embeds: [pages[index]], components: [buttons], fetchReply: true });

        const collector = await msg.createMessageComponentCollector({
            ComponentType: ComponentType.Button,
            time
        })

        collector.on('collect', async i => {

            if (i.user.id !== interaction.user.id) return;

            await i.deferUpdate();

            if (i.customId === 'pageFirst') {
                index = 0;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }

            if (i.customId === 'pagePrev') {
                if (index > 0) index--;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            } else if (i.customId === 'pageNext') {
                if (index < pages.length - 1) {
                    index++;
                    pageCount.setLabel(`${index + 1}/${pages.length}`);
                }
            } else if (i.customId === 'pageLast') {
                index = pages.length - 1;
                pageCount.setLabel(`${index + 1}/${pages.length}`);
            }

            if (index === 0) {
                first.setDisabled(true);
                prev.setDisabled(true);
            } else {
                first.setDisabled(false);
                prev.setDisabled(false);
            }

            if (index === pages.length - 1) {
                next.setDisabled(true);
                last.setDisabled(true);
            } else {
                next.setDisabled(false);
                last.setDisabled(false);
            }

            await msg.edit({ embeds: [pages[index]], components: [buttons] }).catch(err => { console.log(err) })

            collector.resetTimer();

        });

        collector.on('end', async () => {

            await msg.edit({ embeds: [pages[index]], components: [] }).catch(err => { });

        });

        return msg;

    } catch (e) {
        console.error(e);
    }

}