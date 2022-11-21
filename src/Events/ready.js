const chalk = require('chalk');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		if (global.dbStatus === 'OK') {
			client.user.setPresence({ status: 'idle', activities: [{ name: 'Praca praca' }] });
			console.log("\nStatus: ", chalk.greenBright('READY'));
		} else if (global.dbStatus === 'NOK') {
			client.user.setPresence({ status: 'dnd', activities: [{ name: '-_-' }] });
			console.log("\nStatus: ", chalk.redBright('ERROR'));
		} else {
			client.user.setPresence({ status: 'idle', activities: [{ name: '-_-' }] });
			console.log("\nStatus: ", chalk.yellowBright('UNKNOWN'));
		}
	},
};