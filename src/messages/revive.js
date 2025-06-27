// commands/revive.js
module.exports = async function(player, message, writeData) {
        if (!player.isDead) {
            return message.reply("🧍‍♂️ คุณยังมีชีวิตอยู่ ไม่ต้องฟื้น!");
        }

        player.hp = 50;
        player.hunger = 50;
        player.water = 50;
        player.isDead = false;

        writeData();
        return message.reply("✨ คุณได้ฟื้นคืนชีพแล้ว พร้อมออกผจญภัยต่อ!");
    };
