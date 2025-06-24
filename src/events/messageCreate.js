


module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        
        // ป้องกันไม่ให้ bot ตอบข้อความของตัวเอง
        if (message.author.bot) return;

        // ตรวจสอบว่ามีข้อความจริงหรือไม่
        if (!message.content) return;

        console.log(`🤖 ${message.author.tag} said: ${message.content}`);
        return message.reply(   `🤖 ${message.author.tag} said: ${message.content}`);
    },
};