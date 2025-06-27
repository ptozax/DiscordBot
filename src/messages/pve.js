const { items } = require('../utils/items');

const monsters = [
    { name: 'Slime', emoji: '🟢', hp: 20, attack: 5, drop: 'apple' },
    { name: 'Wolf', emoji: '🐺', hp: 35, attack: 10, drop: 'knife' },
    { name: 'Goblin', emoji: '👺', hp: 30, attack: 7, drop: 'potion' }
];

async function battle(player, message, writeData) {
    const monster = monsters[Math.floor(Math.random() * monsters.length)];

    let log = [`⚔️ พบศัตรู ${monster.emoji} **${monster.name}**! เริ่มต่อสู้...`];
    let playerHP = player.hp;
    let monsterHP = monster.hp;

    while (playerHP > 0 && monsterHP > 0) {
        const playerDmg = Math.floor(Math.random() * 10) + 5;
        monsterHP -= playerDmg;
        log.push(`🗡️ คุณโจมตี ${monster.name} ได้ ${playerDmg} ดาเมจ!`);

        if (monsterHP <= 0) break;

        const monsterDmg = Math.floor(Math.random() * monster.attack);
        playerHP -= monsterDmg;
        log.push(`💢 ${monster.name} โจมตีคุณกลับ ได้ ${monsterDmg} ดาเมจ!`);
    }

    if (playerHP <= 0) {
        player.hp = 0;
        log.push(`💀 คุณแพ้ให้กับ ${monster.name}...`);
    } else {
        player.hp = playerHP;
        player.inventory.push(monster.drop);
        log.push(`🏆 คุณชนะ! ได้รับ ${items[monster.drop].emoji} ${items[monster.drop].name}`);
    }

    writeData();
    await message.reply(log.join('\n'));
}

module.exports = { battle };
