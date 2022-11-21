require('./Structure/events');
require('./Structure/commands');
require('./Data/database.js');
require('./CustomEvents/birthday.js');

const client = require('./Structure/client');

const dotenv = require('dotenv');
dotenv.config();

client.login(process.env.TOKEN);