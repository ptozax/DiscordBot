module.exports = async function (player, message, writeData, items, recipes, resolveItemKey, hasEnoughItems) {
    const content = message.content.trim();
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

    for (const req of recipe.requires) {
        const i = player.inventory.indexOf(req);
        if (i !== -1) player.inventory.splice(i, 1);
    }

    player.inventory.push(recipe.result);
    writeData();

    return message.reply(`✅ คุณคราฟ ${items[recipe.result].emoji} ${items[recipe.result].name} สำเร็จ! ใช้ของ: ${recipe.requires.map(r => items[r].emoji).join(', ')}`);
};
