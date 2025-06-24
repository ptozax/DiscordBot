// src/events/voiceStateUpdate.js
module.exports = {
    name: "voiceStateUpdate",
    execute(oldState, newState, client) { 
        // Pass client to access voiceLinks
        // สนใจเฉพาะเหตุการณ์ที่ “จำนวนคนในห้องเก่า” เปลี่ยน
        if (!oldState.channelId || oldState.channelId === newState.channelId) return;

        const link = client.voiceLinks.get(oldState.guild.id); // Use client.voiceLinks
        if (!link || link.channelId !== oldState.channelId) return; // ไม่ใช่ห้องที่บอทอยู่

        const channel = oldState.guild.channels.cache.get(link.channelId);
        if (!channel) return;

        // เหลือแต่บอทหรือไม่มีคนแล้ว?
        const humans = channel.members.filter(m => !m.user.bot);
        if (humans.size === 0) {
            link.connection.destroy();
            client.voiceLinks.delete(oldState.guild.id); // Use client.voiceLinks
            console.log(`👋 Left voice channel in ${oldState.guild.name}`);
        }
    },
};