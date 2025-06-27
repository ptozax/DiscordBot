module.exports = async function (player, message, writeData, items, resolveItemKey) {
    const content = message.content.trim();
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
};
