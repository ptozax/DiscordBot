const { items } = require('../utils/items');

async function battle(player, message, writeData) {
    const monsters = [
        { name: 'Slime', emoji: '🟢', hp: 20, atk: 4, def: 1, xp: 15, drop: 'apple' },
        { name: 'Wolf', emoji: '🐺', hp: 35, atk: 7, def: 3, xp: 25, drop: 'knife' },
        { name: 'Goblin', emoji: '👺', hp: 30, atk: 6, def: 2, xp: 20, drop: 'potion' }
    ];

    const monster = monsters[Math.floor(Math.random() * monsters.length)];
    let log = [`⚔️ พบศัตรู ${monster.emoji} **${monster.name}**! เริ่มต่อสู้...`];

    let playerHP = player.hp;
    let monsterHP = monster.hp;

    while (playerHP > 0 && monsterHP > 0) {
        // Player attack
        const playerDmg = Math.max(0, player.atk + Math.floor(Math.random() * 5) - monster.def);
        monsterHP -= playerDmg;
        log.push(`🗡️ คุณโจมตี ${monster.name} ได้ ${playerDmg} ดาเมจ`);

        if (monsterHP <= 0) break;

        // Monster attack
        const monsterDmg = Math.max(0, monster.atk + Math.floor(Math.random() * 3) - player.def);
        playerHP -= monsterDmg;
        log.push(`💢 ${monster.name} โจมตีคุณได้ ${monsterDmg} ดาเมจ`);
    }

    if (playerHP <= 0) {
        player.hp = 0;
        player.isDead = true;
        log.push(`💀 คุณแพ้ให้กับ ${monster.name}...`);
    } else {
        player.hp = playerHP;
        player.inventory.push(monster.drop);
        const xpMessage = gainXP(player, monster.xp);
        log.push(`🏆 คุณชนะ! ได้รับ ${items[monster.drop].emoji} ${items[monster.drop].name}`);
        log.push(xpMessage);
    }

    writeData();
    await message.reply(log.join('\n'));
}


function gainXP(player, amount) {
    player.xp += amount;
    const neededXP = 50 + (player.level - 1) * 25;

    if (player.xp >= neededXP) {
        player.xp -= neededXP;
        player.level += 1;

        // เพิ่มสเตตัสแบบสุ่มหรือกำหนด
        player.atk += 1 + Math.floor(Math.random() * 2);
        player.def += 1 + Math.floor(Math.random() * 2);
        player.hp += 10;

        return `🆙 เลเวลอัพเป็น Lv.${player.level}!\n🔺 ATK/DEF เพิ่มขึ้นเล็กน้อย`;
    }

    return `✨ ได้รับ ${amount} XP (Lv.${player.level})`;
}
module.exports = { battle };
