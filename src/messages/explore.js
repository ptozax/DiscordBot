const { items } = require('../utils/items');

const exploreEvents = [
    {
        chance: 0.4,
        action: async (player, message) => {
            const itemKey = 'apple';
            player.inventory.push(itemKey);
            player.hunger += items[itemKey].edible?.hunger || 0;
            player.water += items[itemKey].edible?.water || 0;
            await message.reply(`🌲 คุณเดินสำรวจและเจอ ${items[itemKey].emoji} ${items[itemKey].name}!`);
        }
    },
    {
        chance: 0.3,
        action: async (player, message) => {
            player.hp -= 10;
            player.water -= 10;
            await message.reply("🐍 คุณโดนงูกัด! เสีย HP 10 หน่วย!");
        }
    },
    {
        chance: 0.3,
        action: async (player, message) => {
            await message.reply("🌾 คุณไม่เจออะไรเลย...");
        }
    }
];

module.exports = async function (player, message, writeData) {
    const roll = Math.random();
    let sum = 0;

    for (const event of exploreEvents) {
        sum += event.chance;
        if (roll < sum) {
            await event.action(player, message);
            break;
        }
    }

    player.hunger -= 5;
    player.water -= 5;

    if (player.hunger <= 0 || player.water <= 0) {
        player.hp -= 10;
        await message.channel.send("⚠️ คุณหิวหรือกระหายน้ำมากเกินไป! HP ลดลง!");
    }

    writeData();
};
