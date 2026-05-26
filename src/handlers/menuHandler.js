const { prefix, botName, watermark } = require('../config/botConfig');

class MenuHandler {
    static async showMenu(sock, from) {
        const menu = `╭━━━━━━━━━━━━━━━━━━━━━╮
┃ *${botName} - BOT MENU*
┃ 
┃ ✨ *CONFESS FEATURE*
┃ ${prefix}confess 628xxx pesan
┃ ${prefix}balas <id> <pesan>
┃ ${prefix}cekconfess <id>
┃ ${prefix}daftarconfess
┃ 
┃ 🤖 *AI & UTILITY*
┃ ${prefix}ai <pertanyaan>
┃ ${prefix}joke
┃ ${prefix}quote
┃ ${prefix}advice
┃ ${prefix}ping
┃ ${prefix}info
┃ 
┃ 🎮 *GAMES*
┃ ${prefix}asahotak
┃ ${prefix}tts
┃ ${prefix}tebakangka
┃ ${prefix}jawab <jawaban>
┃ ${prefix}skip
┃ 
┃ 🛠️ *MAKER TOOLS*
┃ ${prefix}sticker (reply gambar)
┃ ${prefix}toimage (reply stiker)
┃ ${prefix}tourl (reply media)
┃ 
┃ 📌 *OTHER*
┃ ${prefix}menu
┃ ${prefix}help
┃ 
┃ ${watermark}
╰━━━━━━━━━━━━━━━━━━━━━╯`;

        await sock.sendMessage(from, { text: menu });
    }
    
    static async showHelp(sock, from) {
        const help = `📖 *PANDUAN PENGGUNAAN BOT*

*1. CONFESS (Pengakuan)*
Kirim pesan rahasia ke orang lain tanpa diketahui identitas Anda.

Contoh:
${prefix}confess 6281234567890 Hai, aku suka kamu!

*2. BALAS CONFESS*
Membalas confess yang masuk ke Anda.

Contoh:
${prefix}balas 123 Maaf, aku sudah punya pacar

*3. CEK CONFESS*
Melihat status confess berdasarkan ID.

Contoh:
${prefix}cekconfess 123

*4. AI CHAT*
Tanya apa saja ke AI.

Contoh:
${prefix}ai Apa kabar?

*5. GAME*
- ${prefix}asahotak : Teka-teki logika
- ${prefix}tts : Tebak-tebakan
- ${prefix}tebakangka : Tebak angka 1-100
- ${prefix}jawab : Jawab pertanyaan game

*6. STICKER MAKER*
Balas gambar/video dengan caption ${prefix}sticker

*🔗 Tips:*
- Gunakan ${prefix}menu untuk lihat semua fitur
- ID confess akan diberikan setelah kirim confess
- Simpan ID confess untuk balas/cek nanti`;

        await sock.sendMessage(from, { text: help });
    }
    
    static async showInfo(sock, from) {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const info = `ℹ️ *INFO BOT*

🤖 Nama: ${botName}
📌 Prefix: ${prefix}
⏰ Uptime: ${hours}h ${minutes}m ${seconds}s
💻 Platform: Node.js
📚 Library: Baileys

*Fitur:*
✅ Confess Anonymous
✅ AI Chat
✅ Games (Asah Otak, TTS, Tebak Angka)
✅ Sticker Maker
✅ Media Converter

*Source Code:* GitHub
*Report Bug:* Hubungi Owner

${watermark}`;

        await sock.sendMessage(from, { text: info });
    }
    
    static async ping(sock, from, startTime) {
        const pingTime = Date.now() - startTime;
        await sock.sendMessage(from, { 
            text: `🏓 Pong!\n⏱️ Response time: ${pingTime}ms` 
        });
    }
}

module.exports = MenuHandler;
