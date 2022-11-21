const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const name = 'help';
const desc = 'Wyświetla okno pomocy.';

module.exports = {
	name: name,
	desc: desc,
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription(desc),
	async execute(interaction) {
		const embedContent = [];
		const commandsPath = path.join(__dirname);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			embedContent.push({ 'name': `/${command.name}`, 'desc': command.desc });
		}

		const embed = new EmbedBuilder()
			.setColor(0xE51D1D)
			.setTitle(`Centrum Pomocy | ${interaction.user.username}`);

		embedContent.forEach(element => {
			embed.addFields({ name: element.name, value: element.desc });
		});

		await interaction.reply({ embeds: [embed] });
	},
};