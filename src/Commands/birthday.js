const { SlashCommandBuilder } = require('discord.js');
const Birthday = require('../Data/models/birthdayModel.js');
const chalk = require('chalk');

const name = 'birthday';
const desc = 'Dodaje czyjeś urodziny.';

module.exports = {
	name: name,
	desc: desc,
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc)
		.addUserOption(option =>
			option.setName('kto')
				.setDescription('Użytkownik')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('dzień')
				.setDescription('Dzień urodzin')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('miesiąc')
				.setDescription('Miesiąc urodzin')
				.setRequired(true)),
	async execute(interaction) {
		const birthdayUser = interaction.options.getUser('kto');
		const birthdayDay = interaction.options.getInteger('dzień');
		const birthdayMonth = interaction.options.getInteger('miesiąc');

		if (birthdayDay <= 0 || birthdayMonth <= 0) return interaction.reply({ content: `Serio? Zajebista data: "${birthdayDay}.${birthdayMonth}"`, ephemeral: true });
		if (birthdayDay > 31) return interaction.reply({ content: `"${birthdayDay}" to kapke za duzio! (max 31)`, ephemeral: true });
		if (birthdayMonth > 12) return interaction.reply({ content: `"${birthdayMonth}" to kapke za duzio! (max 12)`, ephemeral: true });

		let isCopy = false;
		await Birthday.find({ personID: birthdayUser.id })
			.then(result => {
				if (result.length != 0) isCopy = true;
			})
			.catch(() => {
				return interaction.reply({ content: `Database-BD: NOK/${global.dbConnections}`, ephemeral: true });
			});

		if (isCopy) {
			console.log(`\nDatabase-BD: ${chalk.yellowBright(`Copy detected`)}`);
			return interaction.reply({ content: `Ta osoba jest już zapisana <a:warning:1033698158921928754>`, ephemeral: true });
		} else {
			const birthday = new Birthday({
				person: birthdayUser.username,
				personID: birthdayUser.id,
				day: birthdayDay,
				month: birthdayMonth,
			});

			await birthday.save()
				.then(async () => {
					await interaction.reply(`Urodzinki <@${birthdayUser.id}> zostały dodane!`);
				})
				.catch(error => console.log(chalk.redBright(error)));
		}
	},
};