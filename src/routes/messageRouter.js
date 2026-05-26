const ConfessHandler = require('../handlers/confessHandler');
const AIHandler = require('../handlers/aiHandler');
const GameHandler = require('../handlers/gameHandler');
const MakerHandler = require('../handlers/makerHandler');
const MenuHandler = require('../handlers/menuHandler');
const { prefix } = require('../config/botConfig');
const logger = require('../utils/logger');

class MessageRouter {
    static async handleMessage(sock, msg) {
        const from = msg.key.remoteJid;
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
        const sender = msg.key.participant || from;
        
        if (!body.startsWith(prefix)) return;
        
        const [cmd, ...args] = body.slice(prefix.length).trim().split(' ');
        const startTime = Date.now();
        
        logger.info(`[${sender}] Command: ${cmd}`, { args: args.slice(0, 3) });
        
        try {
            switch(cmd.toLowerCase()) {
                // Confess Routes
                case 'confess':
                    await ConfessHandler.handle(sock, from, args, sender);
                    break;
                case 'balas':
                    await ConfessHandler.handleReply(sock, from, args, sender);
                    break;
                case 'cekconfess':
                    await ConfessHandler.handleCheck(sock, from, args);
                    break;
                case 'daftarconfess':
                    await ConfessHandler.handleList(sock, from, sender);
                    break;
                
                // AI Routes
                case 'ai':
                case 'gpt':
                case 'ask':
                    await AIHandler.handle(sock, from, args);
                    break;
                case 'joke':
                    await AIHandler.handleJoke(sock, from);
                    break;
                case 'quote':
                    await AIHandler.handleQuote(sock, from);
                    break;
                case 'advice':
                    await AIHandler.handleAdvice(sock, from);
                    break;
                
                // Game Routes
                case 'asahotak':
                    await GameHandler.handleAsahOtak(sock, from);
                    break;
                case 'tts':
                    await GameHandler.handleTTS(sock, from);
                    break;
                case 'tebakangka':
                    await GameHandler.handleTebakAngka(sock, from);
                    break;
                case 'jawab':
                    await GameHandler.handleJawab(sock, from, args);
                    break;
                case 'skip':
                    await GameHandler.handleSkip(sock, from);
                    break;
                
                // Maker Routes
                case 'sticker':
                case 's':
                    await MakerHandler.handleSticker(sock, from, msg);
                    break;
                case 'toimage':
                    await MakerHandler.handleToImage(sock, from, msg);
                    break;
                case 'tourl':
                    await MakerHandler.handleToUrl(sock, from, msg);
                    break;
                
                // Menu & Utility Routes
                case 'menu':
                    await MenuHandler.showMenu(sock, from);
                    break;
                case 'help':
                    await MenuHandler.showHelp(sock, from);
                    break;
                case 'info':
                    await MenuHandler.showInfo(sock, from);
                    break;
                case 'ping':
                    await MenuHandler.ping(sock, from, startTime);
                    break;
                
                default:
                    await sock.sendMessage(from, { 
                        text: `❌ Perintah tidak dikenal.\nKetik ${prefix}menu untuk melihat daftar perintah.` 
                    });
            }
        } catch (error) {
            logger.error(`Error handling command ${cmd}:`, error);
            await sock.sendMessage(from, { 
                text: `⚠️ Terjadi kesalahan: ${error.message}\n\nCoba lagi nanti atau laporkan ke owner.` 
            });
        }
    }
}

module.exports = MessageRouter;
