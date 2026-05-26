const { brainTeasers, ttsQuestions } = require('../config/gameData');

class GameService {
    constructor() {
        this.activeGames = new Map(); // chatId -> game session
    }
    
    startAsahOtak(chatId) {
        const randomIndex = Math.floor(Math.random() * brainTeasers.length);
        const game = brainTeasers[randomIndex];
        
        this.activeGames.set(chatId, {
            type: 'asahotak',
            question: game.question,
            answer: game.answer.toLowerCase(),
            startTime: Date.now(),
            attempts: 0
        });
        
        return {
            message: `🧠 *ASAH OTAK*\n\n${game.question}\n\nKetik #jawab <jawaban>`,
            game: this.activeGames.get(chatId)
        };
    }
    
    startTTS(chatId) {
        const randomIndex = Math.floor(Math.random() * ttsQuestions.length);
        const game = ttsQuestions[randomIndex];
        
        this.activeGames.set(chatId, {
            type: 'tts',
            question: game.question,
            answer: game.answer.toLowerCase(),
            startTime: Date.now(),
            attempts: 0
        });
        
        return {
            message: `❓ *TEBAK-TEBAKAN*\n\n${game.question}\n\nKetik #jawab <jawaban>`,
            game: this.activeGames.get(chatId)
        };
    }
    
    startTebakAngka(chatId) {
        const secretNumber = Math.floor(Math.random() * 100) + 1;
        
        this.activeGames.set(chatId, {
            type: 'tebakangka',
            secretNumber: secretNumber,
            min: 1,
            max: 100,
            attempts: 0,
            startTime: Date.now()
        });
        
        return {
            message: `🔢 *TEBAK ANGKA*\n\nAku memikirkan angka antara 1-100.\nTebak angka berapa?\n\nKetik #jawab <angka>`,
            game: this.activeGames.get(chatId)
        };
    }
    
    checkAnswer(chatId, answer) {
        const game = this.activeGames.get(chatId);
        if (!game) {
            return { success: false, message: '❌ Tidak ada game aktif. Mulai game dengan #asahotak, #tts, atau #tebakangka' };
        }
        
        game.attempts++;
        
        if (game.type === 'tebakangka') {
            const guess = parseInt(answer);
            if (isNaN(guess)) {
                return { success: false, message: '❌ Masukkan angka yang valid!' };
            }
            
            if (guess === game.secretNumber) {
                const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
                this.activeGames.delete(chatId);
                return { 
                    success: true, 
                    message: `✅ BENAR! Angkanya adalah *${game.secretNumber}*.\n\n🎉 Selamat! Anda berhasil dalam ${game.attempts} percobaan dan ${timeTaken} detik.` 
                };
            } else if (guess < game.secretNumber) {
                return { success: false, message: `📈 Terlalu rendah! Coba lagi. (Percobaan: ${game.attempts})` };
            } else {
                return { success: false, message: `📉 Terlalu tinggi! Coba lagi. (Percobaan: ${game.attempts})` };
            }
        }
        
        // Untuk asahotak dan tts
        if (answer.toLowerCase() === game.answer) {
            const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
            this.activeGames.delete(chatId);
            return { 
                success: true, 
                message: `✅ BENAR! Jawabannya adalah *${game.answer}*.\n\n🎉 Selamat! Waktu: ${timeTaken} detik, Percobaan: ${game.attempts}` 
            };
        } else {
            return { 
                success: false, 
                message: `❌ Salah! Coba lagi.\nPetunjuk: ${game.question}\nPercobaan: ${game.attempts}` 
            };
        }
    }
    
    getActiveGame(chatId) {
        return this.activeGames.get(chatId);
    }
    
    endGame(chatId) {
        return this.activeGames.delete(chatId);
    }
}

module.exports = new GameService();
