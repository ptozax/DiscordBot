const { items } = require('../utils/items');
const { battle } = require('./pve');
const itemKeys = Object.keys(items);

const getRandomItemKey = () => {
    const edibleItems = itemKeys.filter(key => items[key].edible);
    return edibleItems[Math.floor(Math.random() * edibleItems.length)];
};

const exploreEvents = [
    {
        chance: 0.15,
        action: async (player, message, writeData) => {
            const itemKey = getRandomItemKey();
            player.inventory.push(itemKey);
            player.hunger += items[itemKey].edible?.hunger || 0;
            player.water += items[itemKey].edible?.water || 0;

            const messages = [
                `🌳 คุณเจอ ${items[itemKey].emoji} ${items[itemKey].name} บนพื้น!`,
                `🍀 คุณโชคดี! ได้รับ ${items[itemKey].emoji} ${items[itemKey].name}`,
                `🧺 คุณเก็บ ${items[itemKey].emoji} ${items[itemKey].name} มาได้จากพุ่มไม้`,
                `🌿 คุณเห็นอะไรบางอย่างในพุ่มไม้... เป็น ${items[itemKey].emoji} ${items[itemKey].name}!`,
            ];
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            await message.reply(randomMsg);
        }
    },
    {
        chance: 0.15,
        action: async (player, message, writeData) => {
            const damage = Math.floor(Math.random() * 10) + 5;
            player.hp -= damage;
            player.water -= 5;
            const msg = [
                `🐍 คุณโดนงูกัด! เสีย HP ${damage} หน่วย!`,
                `🦂 แมงป่องกัด! เจ็บสุดๆ HP ลด ${damage}`,
                `☠️ คุณเหยียบกับดักเก่า เสีย HP ${damage} หน่วย!`,
            ];
            await message.reply(msg[Math.floor(Math.random() * msg.length)]);
        }
    },
    {
        chance: 0.1,
        action: async (player, message, writeData) => {
            const nothingMsgs = [
                "🌾 คุณไม่เจออะไรเลย... แต่ก็ได้พักผ่อนเล็กน้อย",
                "💤 บรรยากาศเงียบสงบเกินไป...",
                "🪹 คุณสำรวจไปเรื่อยๆ แต่ไม่มีอะไรน่าสนใจ",
            ];
            await message.reply(nothingMsgs[Math.floor(Math.random() * nothingMsgs.length)]);
        }
    },
    {
        chance: 0.15,
        action: async (player, message, writeData) => {
            const bonus = Math.floor(Math.random() * 10) + 5;
            player.hp += bonus;
            const healing = [
                `🧘‍♂️ คุณเจอแหล่งน้ำเย็นสดชื่น ได้พักผ่อน +${bonus} HP`,
                `🌊 คุณล้างแผลในลำธาร HP ฟื้น ${bonus}`,
                `🏕️ คุณได้นั่งพักใต้ต้นไม้ใหญ่ HP +${bonus}`,
            ];
            await message.reply(healing[Math.floor(Math.random() * healing.length)]);
        }
    },
    {
        chance: 0.15,
        action: async (player, message, writeData) => {
            const foundItem = 'knife';
            player.inventory.push(foundItem);
            const messages = [
                `🔪 คุณเจอของมีค่า! ได้รับ ${items[foundItem].emoji} ${items[foundItem].name}`,
                `🗿 มีซากเก่าๆ อยู่... มี ${items[foundItem].emoji} ${items[foundItem].name} ซ่อนอยู่!`,
                `🪓 คุณเปิดหีบเก่าๆ แล้วพบ ${items[foundItem].emoji} ${items[foundItem].name}`,
            ];
            await message.reply(messages[Math.floor(Math.random() * messages.length)]);
        }
    },
    {
        chance: 0.1,
        action: async (player, message, writeData) => {
            await battle(player, message, writeData);
        }
    },
    {
        chance: 0.1,
        action: async (player, message, writeData) => {
            const rareItem = 'potion';
            player.inventory.push(rareItem);
            await message.reply(`🌟 คุณเจอหีบลึกลับ! ได้รับของหายาก ${items[rareItem].emoji} ${items[rareItem].name}`);
        }
    }
];


module.exports = async function (player, message, writeData) {
    const roll = Math.random();
    let sum = 0;

    for (const event of exploreEvents) {
        sum += event.chance;
        if (roll < sum) {
            await event.action(player, message, writeData);
            break;
        }
    }

    // ลดความหิวและน้ำ
    player.hunger -= 5;
    player.water -= 5;

    // ตรวจสอบผลกระทบถ้าค่าต่ำเกินไป
    if (player.hunger <= 0 || player.water <= 0) {
        player.hp -= 10;
        await message.channel.send("⚠️ คุณหิวหรือกระหายน้ำมากเกินไป! HP ลดลง!");
    }

if (player.hp <= 0) {
    player.hp = 0;
    player.isDead = true;
    await message.channel.send("☠️ คุณหมดแรงและเสียชีวิต...");
    writeData();
    return;
}

    writeData();
};
