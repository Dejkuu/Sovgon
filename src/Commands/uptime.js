const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client = require('../Structure/client');

const name = 'uptime';
const desc = 'Wyświetla czas pracy bota.';
let uptimeDays, uptimeHours, uptimeMinutes, uptimeSeconds;

module.exports = {
	name: name,
	desc: desc,
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc),
	async execute(interaction) {
		uptimeDays = Math.floor(client.uptime / 86400000);
		uptimeHours = Math.floor(client.uptime / 3600000) % 24;
		uptimeMinutes = Math.floor(client.uptime / 60000) % 60;
		uptimeSeconds = Math.floor(client.uptime / 1000) % 60;

		if (uptimeDays == 0) uptimeDays = '';
			else if (uptimeDays == 1) uptimeDays += ' dzień';
				else uptimeDays += ' dni';

		if (uptimeHours == 0) uptimeHours = '';
			else if (uptimeHours == 1) uptimeHours += ' godzina';
				else if (uptimeHours <= 4) uptimeHours += ' godziny';
					else if (uptimeHours <= 21) uptimeHours += ' godzin';
						else uptimeHours += ' godziny';

		if (uptimeMinutes == 0) uptimeMinutes = '';
			else uptimeMinutes += ' min';

		const embed = new EmbedBuilder()
			.setColor('Random')
			.setTitle(`Uptime: ${uptimeDays} ${uptimeHours} ${uptimeMinutes} ${uptimeSeconds} sek`);

		await interaction.reply({ embeds: [embed] });
	},
};