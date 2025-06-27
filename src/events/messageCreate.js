const { LoadPlayerData, writeData } = require('../utils/playerdata');


const { items, recipes, resolveItemKey, hasEnoughItems } = require('../utils/items');

// import commands
const handleExplore = require('../messages/explore');
const handleEat = require('../messages/eat');
const handleCraft = require('../messages/craft');
const handleRecipes = require('../messages/recipes');
const handleInventory = require('../messages/inventory');
const handleStatus = require('../messages/status');









module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot || !message.content) return;

        const { player } = LoadPlayerData(message.author.id, message);
        const content = message.content.trim();

        if (content === '!explore') return await handleExplore(player, message, writeData);
        if (content === '!eat' || content.startsWith('!eat ')) return await handleEat(player, message, writeData, items, resolveItemKey);
        if (content === '!craft' || content.startsWith('!craft ')) return await handleCraft(player, message, writeData, items, recipes, resolveItemKey, hasEnoughItems);
        if (content === '!recipes') return await handleRecipes(message, recipes, items);
        if (content === '!inventory') return await handleInventory(player, message, items);
        if (content === '!status') return await handleStatus(player, message);


    },
};
