// src/utils/storage.js
const fs = require('fs');
const path = require('path');

// 📁 กำหนด path ไปยังโฟลเดอร์ data และไฟล์ playerData
const OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(OUTPUT_DIR, 'playerData.json');

// ✅ ตรวจสอบและสร้างโฟลเดอร์ + ไฟล์เปล่าหากยังไม่มี
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

// ✅ โหลดข้อมูลผู้เล่นทั้งหมดเข้า memory
let players = JSON.parse(fs.readFileSync(DATA_FILE));

/**
 * ดึงข้อมูลผู้เล่น หรือสร้างใหม่หากยังไม่มี
 */
function LoadPlayerData(userId, message) {
  if (!players[userId]) {
    players[userId] = {
      hp: 100,
      hunger: 50,
      water: 50,
      inventory: [],
    };
  }

  const player = players[userId];
  const content = message.content.trim();

  return { player, content };
}

/**
 * เขียนข้อมูล players กลับลงไฟล์
 */
function writeData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2));
}

/**
 * ใช้เมื่ออยากเข้าถึง players ทั้งหมดภายนอก
 */
function getPlayers() {
  return players;
}

module.exports = {
  LoadPlayerData,
  writeData,
  getPlayers,
};
