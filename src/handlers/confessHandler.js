const ConfessService = require('../services/confessService');

class ConfessHandler {
    static async handle(sock, from, args, sender) {
        if (args.length < 2) {
            await sock.sendMessage(from, { 
                text: '❌ Format: #confess <nomor_target> <pesan>\nContoh: #confess 6281234567890 Aku suka kamu' 
            });
            return;
        }
        
        const targetNumber = args[0];
        const message = args.slice(1).join(' ');
        const targetJid = targetNumber.includes('@s.whatsapp.net') ? targetNumber : `${targetNumber}@s.whatsapp.net`;
        
        const confess = ConfessService.createConfess(sender, targetJid, message);
        const result = await ConfessService.sendConfess(sock, confess);
        
        if (result.success) {
            await sock.sendMessage(from, { 
                text: `✅ Confess terkirim ke ${targetNumber} dengan ID: ${confess.id}\n\nGunakan #balas ${confess.id} <pesan> untuk membalas jika target membalas.` 
            });
        } else {
            await sock.sendMessage(from, { text: `❌ Gagal mengirim confess: ${result.error}` });
        }
    }
    
    static async handleReply(sock, from, args, sender) {
        if (args.length < 2) {
            await sock.sendMessage(from, { 
                text: '❌ Format: #balas <id_confess> <pesan_balasan>' 
            });
            return;
        }
        
        const confessId = parseInt(args[0]);
        const replyMessage = args.slice(1).join(' ');
        
        const result = await ConfessService.sendReply(sock, confessId, replyMessage, sender);
        
        if (result.success) {
            await sock.sendMessage(from, { text: `✅ ${result.message}` });
        } else {
            await sock.sendMessage(from, { text: `❌ ${result.error}` });
        }
    }
    
    static async handleCheck(sock, from, args) {
        const confessId = parseInt(args[0]);
        if (isNaN(confessId)) {
            await sock.sendMessage(from, { text: '❌ Masukkan ID yang valid!' });
            return;
        }
        
        const confess = ConfessService.getConfessById(confessId);
        if (!confess) {
            await sock.sendMessage(from, { text: '❌ ID Confess tidak ditemukan!' });
            return;
        }
        
        const info = ConfessService.formatConfessInfo(confess);
        await sock.sendMessage(from, { text: info });
    }
    
    static async handleList(sock, from, sender) {
        const allConfess = ConfessService.getAllConfess();
        const userConfess = allConfess.filter(c => c.from === sender || c.to === sender);
        
        if (userConfess.length === 0) {
            await sock.sendMessage(from, { text: '📭 Tidak ada confess yang terkait dengan Anda.' });
            return;
        }
        
        let listMessage = '📋 *DAFTAR CONFESS ANDA*\n\n';
        userConfess.forEach(confess => {
            listMessage += `ID: ${confess.id}\n`;
            listMessage += `Dari: ${confess.from.split('@')[0]}\n`;
            listMessage += `Untuk: ${confess.to.split('@')[0]}\n`;
            listMessage += `Status: ${confess.status}\n`;
            listMessage += `────────────────\n`;
        });
        
        await sock.sendMessage(from, { text: listMessage });
    }
}

module.exports = ConfessHandler;
