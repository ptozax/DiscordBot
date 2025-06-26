const { LoadPlayerData, writeData } = require('../utils/playerdata.js');

// ข้อมูลไอเทมทั้งหมด
const items = {
    apple: { emoji: '🍎', name: 'Apple', edible: { hunger: 15, water: 0 } },
    knife: { emoji: '🔪', name: 'Knife' },
    potion: { emoji: '🧪', name: 'Potion' },
    bread: { emoji: '🥖', name: 'Bread', edible: { hunger: 25, water: -5 } },
};

// สูตรคราฟ (ใช้ key ของ items)
const recipes = {
    knife: {
        requires: ['apple', 'apple'],
        result: 'knife',
    },
    potion: {
        requires: ['apple', 'knife'],
        result: 'potion',
    },
};

// ฟังก์ชันค้นหา key ของ item จากชื่อหรือ emoji
function resolveItemKey(input) {
    if (!input) return null;
    const lowerInput = input.trim().toLowerCase();
    return Object.keys(items).find(key => {
        const { emoji, name } = items[key];
        return (
            key === lowerInput ||
            name.toLowerCase() === lowerInput ||
            emoji === input.trim()
        );
    }) || null;
}

// ตรวจสอบว่ามีไอเทมพอใน inventory หรือไม่ (ใช้ key)
function hasEnoughItems(inventory, requires) {
    const temp = [...inventory];
    for (const req of requires) {
        const index = temp.indexOf(req);
        if (index === -1) return false;
        temp.splice(index, 1);
    }
    return true;
}

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot || !message.content) return;

        const { player } = LoadPlayerData(message.author.id, message);
        const content = message.content.trim();

        // === HELP ===
        if (content === '!help') {
            return message.reply(`📜 คำสั่งที่ใช้ได้:
- \`!status\` — แสดง HP, ความหิว, กระหายน้ำ
- \`!inventory\` — แสดงสิ่งของในกระเป๋า
- \`!explore\` — ออกสำรวจ
- \`!eat [item]\` — กินของ
- \`!craft [item]\` — คราฟของ
- \`!recipes\` — แสดงสูตรคราฟ`);
        }

        // === STATUS ===
        if (content === '!status') {
            return message.reply(`🧍 HP: ${player.hp}, Hunger: ${player.hunger}, Water: ${player.water}`);
        }

        // === INVENTORY ===
        if (content === '!inventory') {
            if (player.inventory.length === 0) {
                return message.reply("🎒 สิ่งของในกระเป๋า: ไม่มีอะไรเลย");
            }
            const invStr = player.inventory
                .map(key => {
                    const item = items[key];
                    return item ? `${item.emoji} ${item.name}` : key;
                })
                .join(', ');
            return message.reply(`🎒 สิ่งของในกระเป๋า: ${invStr}`);
        }

        // === EXPLORE ===
        if (content === '!explore') {
            const found = Math.random();

            if (found < 0.4) {
                player.inventory.push('apple');
                player.hunger += 10;
                player.water -= 5;
                await message.reply("🌲 คุณเดินสำรวจและเจอ 🍎 Apple!");
            } else if (found < 0.7) {
                player.hp -= 10;
                player.water -= 10;
                await message.reply("🐍 คุณโดนงูกัด! เสีย HP 10 หน่วย!");
            } else {
                await message.reply("🌾 คุณไม่เจออะไรเลย...");
            }

            player.hunger -= 5;
            player.water -= 5;

            if (player.hunger <= 0 || player.water <= 0) {
                player.hp -= 10;
                await message.channel.send("⚠️ คุณหิวหรือกระหายน้ำมากเกินไป! HP ลดลง!");
            }

            writeData();
            return;
        }

        // === EAT ===
        if (content.startsWith('!eat')) {
            const raw = content.split(' ')[1]?.trim();

            if (!raw) {
                const foodList = Object.values(items)
                    .filter(i => i.edible)
                    .map(i => `${i.emoji} ${i.name} (Hunger +${i.edible.hunger}${i.edible.water !== 0 ? `, Water ${i.edible.water > 0 ? '+' : ''}${i.edible.water}` : ''})`)
                    .join('\n');
                return message.reply(`🍽️ กรุณาระบุสิ่งที่ต้องการกิน เช่น \`!eat apple\` หรือ \`!eat 🍎\`\nของที่คุณสามารถกินได้:\n${foodList}`);
            }

            const key = resolveItemKey(raw);
            if (!key) return message.reply(`❌ ไม่พบไอเทม '${raw}'`);

            const itemData = items[key];
            if (!itemData.edible) return message.reply("🤔 สิ่งนี้ไม่สามารถกินได้...");

            const index = player.inventory.indexOf(key);
            if (index === -1) return message.reply(`❌ คุณไม่มี ${itemData.emoji} ${itemData.name} ในกระเป๋า!`);

            player.inventory.splice(index, 1);
            player.hunger += itemData.edible.hunger;
            if (player.hunger > 100) player.hunger = 100;

            player.water += itemData.edible.water;
            if (player.water > 100) player.water = 100;
            if (player.water < 0) player.water = 0;

            await message.reply(`😋 คุณกิน ${itemData.emoji} ${itemData.name} แล้วฟื้น Hunger +${itemData.edible.hunger}${itemData.edible.water !== 0 ? `, Water ${itemData.edible.water > 0 ? '+' : ''}${itemData.edible.water}` : ''}!`);

            writeData();
            return;
        }

        // === CRAFT ===
        if (content.startsWith('!craft')) {
            const raw = content.split(' ')[1]?.trim();

            if (!raw) {
                const availableItems = Object.keys(recipes).map(r => `\`${r}\``).join(', ');
                return message.reply(`🛠️ ใช้แบบ: \`!craft knife\` หรือ \`!craft 🔪\`\nสิ่งที่สามารถคราฟได้: ${availableItems}`);
            }

            const key = resolveItemKey(raw);
            if (!key) return message.reply("❌ ไม่มีสูตรคราฟนี้!");

            const recipe = recipes[key];
            if (!recipe) return message.reply("❌ ไม่มีสูตรคราฟนี้!");

            if (!hasEnoughItems(player.inventory, recipe.requires)) {
                const missingItems = recipe.requires.map(r => items[r].emoji).join(', ');
                return message.reply(`❌ คุณขาดของ: ${missingItems}\n💡 ใช้ \`!inventory\` เพื่อตรวจสอบของที่มี`);
            }

            // ลบของที่ใช้คราฟ
            for (const req of recipe.requires) {
                const i = player.inventory.indexOf(req);
                if (i !== -1) player.inventory.splice(i, 1);
            }

            // เพิ่มของที่คราฟได้
            player.inventory.push(recipe.result);
            writeData();

            return message.reply(`✅ คุณคราฟ ${items[recipe.result].emoji} ${items[recipe.result].name} สำเร็จ! ใช้ของ: ${recipe.requires.map(r => items[r].emoji).join(', ')}`);
        }

        // === RECIPES ===
        if (content === '!recipes') {
            let recipeList = '📘 สูตรคราฟทั้งหมด:\n';
            for (const [key, recipe] of Object.entries(recipes)) {
                const requiresStr = recipe.requires.map(r => `${items[r].emoji} ${items[r].name}`).join(' + ');
                const resultStr = `${items[recipe.result].emoji} ${items[recipe.result].name}`;
                recipeList += `• \`${key}\`: ${requiresStr} ➜ ${resultStr}\n`;
            }
            return message.reply(recipeList);
        }
    },
};
