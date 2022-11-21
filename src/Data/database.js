const mongoose = require('mongoose');
const chalk = require('chalk');

const dotenv = require('dotenv');
dotenv.config();

let connections = 0;
const maxConnections = 3;

const connectToDatabase = () => {
    connections++;

    if (connections > maxConnections) return console.error(chalk.redBright(`\nThe maximum number of connections (${maxConnections}) has been reached. Further attempts cancelled.`));

    mongoose.connect(process.env.database)
        .then(() => {
            global.dbStatus = 'OK';
            console.log("\nDatabase: ", chalk.greenBright('OK'));
        })
        .catch(error => {
            global.dbStatus = 'NOK';
            console.log(
                `\n- - - -`, chalk.yellowBright(`Connection attempt ${connections}/${maxConnections}`), `- - - -\n\n`,
                "Database: ",
                chalk.redBright(`NOK\n`),
                "Details: ",
                chalk.redBright(`${error}\n\n`),
                chalk.yellowBright(`Retrying in 5 sec...`),
            );
            setTimeout(connectToDatabase, 5000);
        });
};
connectToDatabase();

global.dbConnections = connections;