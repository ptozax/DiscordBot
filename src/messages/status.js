module.exports = async function (player, message) {
    return message.reply(`🧍 HP: ${player.hp}, Hunger: ${player.hunger}, Water: ${player.water}`);
};
