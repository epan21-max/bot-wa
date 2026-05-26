const AIService = require('../services/aiService');

class AIHandler {
    static async handle(sock, from, args) {
        if (args.length === 0) {
            await sock.sendMessage(from, { 
                text: '❌ Format: #ai <pertanyaan>\nContoh: #ai Siapa presiden Indonesia?' 
            });
            return;
        }
        
        const question = args.join(' ');
        await sock.sendMessage(from, { text: '🤖 AI sedang berpikir...' });
        
        const answer = await AIService.chat(question);
        await sock.sendMessage(from, { text: `🤖 *AI Response:*\n\n${answer}` });
    }
    
    static async handleJoke(sock, from) {
        const joke = await AIService.generateText('', 'joke');
        await sock.sendMessage(from, { text: `😄 *JOKE MOMENT*\n\n${joke}` });
    }
    
    static async handleQuote(sock, from) {
        const quote = await AIService.generateText('', 'quote');
        await sock.sendMessage(from, { text: `💭 *QUOTE OF THE DAY*\n\n${quote}` });
    }
    
    static async handleAdvice(sock, from) {
        const advice = await AIService.generateText('', 'advice');
        await sock.sendMessage(from, { text: `💡 *ADVICE*\n\n${advice}` });
    }
}

module.exports = AIHandler;
