require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
fs = require("fs");
path = require("path");

const TOKEN = process.env.BotToken;
const CLIENT_ID = process.env.AppID;
const GUILD_ID = process.env.ServerID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
    console.error("❌ Missing environment variables. Check your .env file.");
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});


client.voiceLinks = new Map(); // Using client object to store this

const eventFiles = fs.readdirSync(path.join(__dirname,"src", "events")).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(path.join(__dirname ,"src","events", file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Load commands (optional, you can load them during interactionCreate as well)
client.commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname,"src", "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(path.join(__dirname, "src","commands", file));
    client.commands.set(command.data.name, command);
}


client.login(TOKEN);