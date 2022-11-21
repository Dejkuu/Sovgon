const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Lottery = require('../Data/models/lotteryModel.js');
const client = require('../Structure/client');
const chalk = require('chalk');

const name = 'loteria';
const desc = 'Komendy dotyczące loterii mikołajkowej.';

module.exports = {
    name: name,
    desc: desc,
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(desc)
        .addSubcommand(subcommand =>
            subcommand
                .setName('wynik')
                .setDescription('Wylosuj osoby.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('lista')
                .setDescription('Lista użytkowników aktualnie zapisanych w loterii.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('usuń')
                .setDescription('Usuń kogoś lub całą listę.')
                .addUserOption(option =>
                    option.setName('kto')
                        .setDescription('Użytkownik (zostaw puste dla całej listy)')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('dodaj')
                .setDescription('Dodaj użytkownika do loterii.')
                .addUserOption(option =>
                    option.setName('kto')
                        .setDescription('Użytkownik')
                        .setRequired(true))),
    async execute(interaction) {
        let loopCount, embedDescription, embedLotteryUsers, embedContent, userID;

        if (interaction.options.getSubcommand() === 'wynik') {
            await Lottery.find()
                .then(async senders => {
                    const minPerson = 4;

                    if (senders.length === 0) {
                        embedContent = 'Brak członków w loterii. Aby kogoś dodać użyj "/loteria dodaj".';
                    } else if (senders.length < minPerson) {
                        console.log(`Database-Lottery: ${chalk.redBright(`Only ${senders.length} person(s) found!`)}`);
                        embedContent = `Zbyt mało uczestników <a:warning:1033698158921928754> Aktualnie: ${senders.length} | Min: ${minPerson}`;
                    } else if (senders.length >= minPerson) {
                        console.log(`\nDatabase-Lottery: ${chalk.yellowBright(`${senders.length} persons found.`)}\n`);

                        embedContent = 'Wyniki zostały wysłane  :tada:  Have Fun';
                        embedDescription = `O to super-pro-elo tegoroczna loteria mikołajkowa  :christmas_tree:\nPary zostaną wylosowane oraz wysłane do odpowiednich osób.`;

                        setTimeout(() => {
                            if (loopCount !== senders.length) {
                                embedDescription = `Nie udało się wysłać wyników, ponieważ czas odpowiedzi został przekroczony!`;
                                embedContent = 'Czas odpowiedzi przekroczony! <a:warning:1033698158921928754>';
                                loopCount = senders.length + 1;
                            }
                        }, 2000);

                        try {
                            for (loopCount = 0; loopCount < senders.length;) {
                                const min = 1;
                                const max = Math.floor(senders.length);
                                const randomID = Math.floor(Math.random() * (max - min + 1) + min);

                                await Lottery.findOne({ "id": randomID, "isUsed": false })
                                    .then(async recipient => {
                                        if (recipient === null) return console.log(`\nDatabase-Lottery: ${chalk.redBright(`Match not found.`)}`);

                                        const sendersPersonID = JSON.stringify(senders[loopCount].personID);
                                        const recipientPersonID = JSON.stringify(recipient.personID);

                                        if (sendersPersonID === recipientPersonID) return console.log(`\nDatabase-Lottery: ${chalk.redBright(`Copy detected.`)}`);

                                        console.log(`${chalk.yellowBright(`${senders[loopCount].person} (${senders[loopCount].personID})`)} do ${chalk.yellowBright(`${recipient.person} (${recipient.personID}`)}`);

                                        await Lottery.updateOne({ "id": randomID }, { $set: { "isUsed": true } });

                                        const generatedDate = new Date();
                                        let generatedHour = generatedDate.getHours();
                                        if (generatedHour < 10) generatedHour = `0${generatedHour}`;
                                        let generatedMinute = generatedDate.getMinutes();
                                        if (generatedMinute < 10) generatedMinute = `0${generatedMinute}`;

                                        const embed = new EmbedBuilder()
                                            .setTitle(':mx_claus:  Czas Na Mi-Mi-Mikołajki  :mx_claus:')
                                            .setDescription(` W tegorocznych mikołajkach prezent podarujesz: ||${recipient.person}|| :partying_face: Miłej zabawy!`)
                                            .setColor(0xe8f6f2)
                                            .setFooter({ text: `Wyniki wygenerowane: ${generatedHour}:${generatedMinute}` });

                                        await client.users.send(`${senders[loopCount].personID}`, { embeds: [embed] });

                                        loopCount++;
                                        if (loopCount >= senders.length) console.log(`\nDatabase-Lottery: ${chalk.greenBright(`All good. Sending DMs to ${senders.length} persons...`)}`);
                                    });
                            }
                        } catch (error) {
                            embedDescription = `Nie udało się wysłać wyników, szczegóły znajdziesz poniżej.`;
                            embedContent = `Coś poszło nie tak! <a:warning:1033698158921928754> ${error}`;
                        }
                    }
                });
        } else if (interaction.options.getSubcommand() === 'lista') {
            await Lottery.find()
                .then(results => {
                    if (results.length == 0) {
                        embedContent = 'Brak członków w loterii. Aby kogoś dodać użyj "/loteria dodaj".';
                    } else {
                        embedContent = '';
                        results.forEach(element => {
                            embedContent = `${embedContent}\n> <@${element.personID}>`;
                        });
                    }
                    embedDescription = `O to super-pro-elo lista osób biorących udział w tegorocznych mikołajkach :christmas_tree:\nPary zostaną wylosowane po użyciu komendy "/loteria wynik".`;
                });
        } else if (interaction.options.getSubcommand() === 'usuń') {
            if (interaction.options.getUser('kto') != null) {
                const lotteryUser = interaction.options.getUser('kto');

                await Lottery.deleteOne({ personID: lotteryUser.id })
                    .then(result => {
                        if (result.deletedCount === 0) {
                            embedDescription = `Nie udało się usunąć osoby, szczegóły znajdziesz niżej.`;
                            embedContent = `Ta osoba nie była zapisana w loterii.`;
                        } else {
                            embedDescription = `Usunięta została jedna osoba z loterii,\naby dodać nową użyj "/loteria dodaj".`;
                            embedContent = `Usunięto <@${lotteryUser.id}> z loterii.`;
                        }
                    }).catch(error => {
                        console.error(chalk.yellowBright(`Something went wrong: ${error}`));

                        embedDescription = error;
                        embedContent = `Coś poszło nie tak! <a:warning:1033698158921928754>`;
                    });
            } else {
                let recordCount = 0;
                await Lottery.find().then(result => recordCount = result.length);

                if (recordCount === 0) {
                    embedDescription = `Przecież tu nikogo nie ma...`;
                    embedContent = `Lista jest już pusta! <a:warning:1033698158921928754>`;
                } else {
                    await Lottery.deleteMany()
                        .then(() => {
                            embedDescription = `Zostali usunięci wszyscy uczestnicy loterii,\naby dodać nowych użyj "/loteria dodaj".`;
                            embedContent = `Usunięto wszystkich uczestników loterii <a:warning:1033698158921928754>`;
                        }).catch(error => {
                            console.error(chalk.yellowBright(`Something went wrong: ${error}`));

                            embedDescription = error;
                            embedContent = `Coś poszło nie tak! <a:warning:1033698158921928754>`;
                        });
                }
            }
        } else if (interaction.options.getSubcommand() === 'dodaj') {
            const lotteryUser = interaction.options.getUser('kto');

            let isCopy = false;
            await Lottery.find({ personID: lotteryUser.id })
                .then(result => {
                    if (result.length != 0) isCopy = true;
                })
                .catch(() => {
                    return interaction.reply({ content: `Database-Lottery: NOK/${global.dbConnections}`, ephemeral: true });
                });

            if (isCopy) {
                console.log(`\nDatabase-Lottery: ${chalk.yellowBright(`Copy detected`)}`);
                return interaction.reply({ content: `Ta osoba jest już zapisana do loterii <a:warning:1033698158921928754>`, ephemeral: true });
            } else {
                await Lottery.find().then(results => {
                    userID = results.length + 1;
                });

                const lottery = new Lottery({
                    id: userID,
                    person: lotteryUser.username,
                    personID: lotteryUser.id,
                });

                await lottery.save()
                    .then(() => {
                        embedDescription = `Nowa osoba została dodana do loterii.`;
                        embedContent = `Użytkownik <@${lotteryUser.id}> został dodany do loterii!`;
                    })
                    .catch(error => console.log(chalk.redBright(error)));
            }
        }

        await Lottery.find().then(results => embedLotteryUsers = results.length);

        const embed = new EmbedBuilder()
            .setTitle(':mx_claus:  Loteria Mikołajkowa  :mx_claus:')
            .setDescription(embedDescription)
            .setColor(0xe8f6f2)
            .setFields(
                { name: `Osoby biorące udział: ${embedLotteryUsers}`, value: `> ${embedContent}` },
            );

        await interaction.reply({ embeds: [embed] });
    },
};