const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hi")
        .setDescription("👋 Say hi to the bot!"),
    async execute(interaction, client) {

        await interaction.deferReply();

        await interaction.editReply("👋 Hello! I'm here to assist you. How can I help you today?");

    }
}