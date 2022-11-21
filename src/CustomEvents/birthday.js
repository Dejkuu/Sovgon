const { EmbedBuilder } = require('discord.js');
const Birthday = require('../Data/models/birthdayModel.js');
const client = require('../Structure/client');

const chalk = require("chalk");
const cron = require('node-cron');
const express = require('express');

const app = express();

let channel;

cron.schedule('00 11 * * *', async () => {
    let finallyContent = "";
    channel = client.channels.cache.get('476021055178145793');

    try {
        console.log(`\nCron: ${chalk.blueBright(`Running a task...`)}`);

        const Today = new Date();
        const Day = Today.getUTCDate();
        let Month = Today.getUTCMonth();
        Month++;

        await Birthday.find({
            day: Day,
            month: Month,
        }).then(async results => {
            if (results.length < 1) {
                return console.log(`Cron: ${chalk.yellowBright(`0 person found.`)}`);
            } else {
                console.log(`Cron: ${chalk.yellowBright(`${results.length} person(s) found. Sending...`)}`);

                results.forEach(element => {
                    finallyContent = `${finallyContent}\n> <@${element.personID}>`;
                });

                const embed = new EmbedBuilder()
                    .setTitle(':birthday:  Dzisiejszego dnia urodziny obchodzi:  :birthday:')
                    .setDescription(`**${finallyContent}**`)
                    .setColor(0x779ba5)
                    .setFooter({ text: 'Wszystkiego Najlepszego 🥳' });

                await channel.send({ embeds: [embed] });
            }
        });
    } catch (err) {
        console.log(`Cron: ${chalk.redBright(`NOK | ${err}`)}\n`);
    }
});
app.listen(3030);