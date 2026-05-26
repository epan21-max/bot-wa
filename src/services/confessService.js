const db = require('../database/db');
const Confess = require('../models/confessModel');
const { confessHeader, confessFooter, watermark } = require('../config/botConfig');

class ConfessService {
    static createConfess(from, to, message) {
        const id = db.getNextId();
        const confess = new Confess(id, from, to, message);
        db.saveConfess(id, confess.toJSON());
        return confess;
    }
    
    static getConfessById(id) {
        const data = db.getConfess(id);
        if (!data) return null;
        
        const confess = new Confess(data.id, data.from, data.to, data.message);
        confess.status = data.status;
        confess.timestamp = data.timestamp;
        confess.replies = data.replies || [];
        return confess;
    }
    
    static async sendConfess(sock, confess) {
        const messageText = `${confessHeader}${confess.message}${confessFooter}`;
        
        try {
            await sock.sendMessage(confess.to, { text: messageText });
            confess.markAsSent();
            db.updateConfessStatus(confess.id, 'sent');
            return { success: true, message: 'Confess terkirim' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static async sendReply(sock, confessId, replyMessage, replierJid) {
        const confess = this.getConfessById(confessId);
        if (!confess) return { success: false, error: 'Confess tidak ditemukan' };
        
        const replyText = `╭━━━━━━━━━━━━━━━━━╮
┃ *📬 BALASAN CONFESS ID: ${confessId}*
┃ 
┃ *Pesan kamu:* ${confess.message}
┃ 
┃ *Balasan:* ${replyMessage}
┃ 
┃ ${watermark}
╰━━━━━━━━━━━━━━━━━╯`;
        
        try {
            await sock.sendMessage(confess.from, { text: replyText });
            confess.addReply(replyMessage, replierJid);
            db.saveConfess(confessId, confess.toJSON());
            return { success: true, message: 'Balasan terkirim' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static formatConfessInfo(confess) {
        return `📊 *Status Confess ID ${confess.id}*
┃
┃ 📨 Dari: ${confess.from.split('@')[0]}
┃ 📬 Untuk: ${confess.to.split('@')[0]}
┃ 💬 Pesan: ${confess.message}
┃ 📅 Waktu: ${confess.timestamp}
┃ ✅ Status: ${confess.status === 'sent' ? 'Terkirim' : 'Pending'}
┃ 📝 Balasan: ${confess.replies.length} balasan
┃
┃ 🔁 Balas via: #balas ${confess.id} <pesan>`;
    }
}

module.exports = ConfessService;
