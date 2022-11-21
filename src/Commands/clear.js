const { SlashCommandBuilder } = require('discord.js');

const name = 'clear';
const desc = 'Usuwa określoną ilość wiadomości.';

module.exports = {
	name: name,
	desc: desc,
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc)
		.addIntegerOption(option =>
			option.setName('ilość')
				.setDescription('Ile usunąć?')
				.setRequired(true)),
	async execute(interaction) {
		let amount = interaction.options.getInteger('ilość');

		if (!amount || isNaN(amount)) return interaction.reply({ content: 'Wprowadź poprawną ilość', ephemeral: true });
		if (amount > 100) return interaction.reply({ content: 'Więcej niż 100 nie uciągnę :)', ephemeral: true });

		// await interaction.reply({ content: `<a:loading:1033687018389131274> Usuwanie...`, ephemeral: true });

		await interaction.channel.bulkDelete(amount, true);

		if (amount == 1) amount = `**${amount}** wiadomość`;
		else if (amount > 1) amount = `**${amount}** wiadomości`;

		await interaction.reply({ content: `Usunięto ${amount}!`, ephemeral: true });
	},
};