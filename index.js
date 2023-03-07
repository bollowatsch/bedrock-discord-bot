// load .env confoguration
require('dotenv').config()

// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const token = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

//add commands and eventHandlers from corresponding folder to the collection
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);

//for testing purpose
const logfilePath = `/var/lib/docker/containers/${process.env.DOCKER_ID}/${process.env.DOCKER_ID}-json.log`
fs.watch(logfilePath,(curr, prev) => {
    fs.readFile(logfilePath,{encoding: 'utf-8'}, (err, data) => {
        let lastLine = data.trim().split('\n')[data.trim().split('\n').length - 1];
		// log last line of logfile to console
		console.log("The log file has been updated: " + lastLine);
        if(lastLine.includes('disconnected')) client.channels.cache.get(process.env.CHANNEL_ID).send(cleanUpLine(lastLine) + ' ist offline!');   
		else if(lastLine.includes('connected')) client.channels.cache.get(process.env.CHANNEL_ID).send(cleanUpLine(lastLine) + ' ist online!');
     })
  });

function cleanUpLine(lastLine){
    return lastLine.slice(lastLine.indexOf('connected:') + 11,lastLine.indexOf("xuid")-2);
}