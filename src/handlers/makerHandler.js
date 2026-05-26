const StickerService = require('../services/stickerService');

class MakerHandler {
    static async handleSticker(sock, from, msg) {
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || (!quoted.imageMessage && !quoted.videoMessage)) {
            await sock.sendMessage(from, { 
                text: '❌ Balas gambar/video dengan caption #sticker\n\n*Catatan:* Video maksimal 5 detik.' 
            });
            return;
        }
        
        const media = await sock.downloadMediaMessage(quoted);
        
        // Kirim loading message
        const loadingMsg = await sock.sendMessage(from, { text: '🖼️ Membuat stiker...' });
        
        try {
            // Kirim sebagai stiker
            await sock.sendMessage(from, { 
                sticker: media,
                mimetype: 'image/webp'
            });
            
            // Hapus loading message
            await sock.sendMessage(from, { delete: loadingMsg.key });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `❌ Gagal membuat stiker: ${error.message}` 
            });
        }
    }
    
    static async handleToImage(sock, from, msg) {
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || !quoted.stickerMessage) {
            await sock.sendMessage(from, { 
                text: '❌ Balas stiker dengan caption #toimage' 
            });
            return;
        }
        
        const media = await sock.downloadMediaMessage(quoted);
        
        await sock.sendMessage(from, { 
            image: media,
            caption: '🖼️ *Konversi Stiker ke Gambar*\n\nRequest dari Anda.'
        });
    }
    
    static async handleToUrl(sock, from, msg) {
        const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || (!quoted.imageMessage && !quoted.videoMessage)) {
            await sock.sendMessage(from, { 
                text: '❌ Balas gambar/video dengan caption #tourl' 
            });
            return;
        }
        
        const media = await sock.downloadMediaMessage(quoted);
        const result = await StickerService.toUrl(media);
        
        if (result.success) {
            await sock.sendMessage(from, { 
                text: `✅ *Upload Berhasil*\n\nURL: ${result.url}\n\nExpired: 24 jam` 
            });
        } else {
            await sock.sendMessage(from, { 
                text: `❌ Gagal upload: ${result.error}` 
            });
        }
    }
}

module.exports = MakerHandler;
