module.exports = async function (player, message, items) {
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
};
