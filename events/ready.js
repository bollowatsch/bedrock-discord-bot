// When the client is ready, run this code (only once)
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        client.channels.cache.get('1075700868852240404').send('Your bot is ready for action!');
	},
};