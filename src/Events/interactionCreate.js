const chalk = require('chalk');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {

		// Message Created
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction);
			} catch (error) {
				console.log(chalk.redBright(error));
			}
		}
	},
};