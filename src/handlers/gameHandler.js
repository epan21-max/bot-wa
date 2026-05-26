const gameService = require('../services/gameService');

class GameHandler {
    static async handleAsahOtak(sock, from) {
        const result = gameService.startAsahOtak(from);
        await sock.sendMessage(from, { text: result.message });
    }
    
    static async handleTTS(sock, from) {
        const result = gameService.startTTS(from);
        await sock.sendMessage(from, { text: result.message });
    }
    
    static async handleTebakAngka(sock, from) {
        const result = gameService.startTebakAngka(from);
        await sock.sendMessage(from, { text: result.message });
    }
    
    static async handleJawab(sock, from, args) {
        if (args.length === 0) {
            await sock.sendMessage(from, { 
                text: '❌ Format: #jawab <jawaban>\nContoh: #jawab manusia' 
            });
            return;
        }
        
        const answer = args.join(' ');
        const result = gameService.checkAnswer(from, answer);
        
        await sock.sendMessage(from, { text: result.message });
        
        if (result.success) {
            gameService.endGame(from);
        }
    }
    
    static async handleSkip(sock, from) {
        const game = gameService.getActiveGame(from);
        if (!game) {
            await sock.sendMessage(from, { text: '❌ Tidak ada game aktif!' });
            return;
        }
        
        let hint = '';
        if (game.type === 'asahotak' || game.type === 'tts') {
            hint = `Jawaban: ${game.answer}`;
        } else if (game.type === 'tebakangka') {
            hint = `Angka rahasia: ${game.secretNumber}`;
        }
        
        gameService.endGame(from);
        await sock.sendMessage(from, { 
            text: `⏭️ Game di-skip!\n\n${hint}\n\nKetik #asahotak, #tts, atau #tebakangka untuk bermain lagi.` 
        });
    }
}

module.exports = GameHandler;
