// src/deploy-commands.js
require("dotenv").config();
const { REST, Routes } = require("discord.js");
const path = require("path");
const fs = require("fs");

const TOKEN = process.env.BotToken;
const CLIENT_ID = process.env.AppID;
const GUILD_ID = process.env.ServerID;
const Production = process.env.Production;

if (!TOKEN || !CLIENT_ID || !GUILD_ID || !Production) {
    console.error("❌ Missing environment variables. Check your .env file.");
    process.exit(1);
}

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, "src", "commands")).filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(path.join(__dirname, "src", "commands", file));
    commands.push(command.data.toJSON());
}

(async () => {
    try {
        console.log("🚀 Registering slash commands …");
        const rest = new REST({ version: "10" }).setToken(TOKEN);

        if (Production === "true") {
            await rest.put(Routes.applicationCommands(CLIENT_ID), //  for global commands 1 Hour to update
                {
                    body: commands,
                });
        } else {
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                {
                    body: commands,
                });
        }


        console.log("✅ Slash commands registered");
    } catch (err) {
        console.error("❌ Failed to register commands", err);
    }
})();


