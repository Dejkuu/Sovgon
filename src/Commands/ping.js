const { SlashCommandBuilder } = require('discord.js');
const client = require('../Structure/client');

const name = 'ping';
const desc = 'Wyświetla ping.';

module.exports = {
	name: name,
	desc: desc,
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc),
	async execute(interaction) {
		await interaction.reply(`Ping: ${client.ws.ping}ms`);
	},
};