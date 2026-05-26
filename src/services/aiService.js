const axios = require('axios');
const { aiApiUrl, aiApiKey } = require('../config/botConfig');

class AIService {
    static async chat(prompt, model = 'simsimi') {
        try {
            if (model === 'simsimi') {
                const response = await axios.get(`${aiApiUrl}/simtalk`, {
                    params: {
                        text: prompt,
                        lc: 'id'
                    }
                });
                return response.data.message || "Maaf, saya tidak mengerti.";
            }
            
            // Tambahkan model lain (Gemini, OpenAI, dll)
            // if (model === 'gemini') { ... }
            
            return "Fitur AI sedang dalam pengembangan.";
        } catch (error) {
            console.error('AI Error:', error);
            return "Maaf, AI sedang sibuk. Coba lagi nanti.";
        }
    }
    
    static async generateText(prompt, type = 'general') {
        // Untuk generate teks berdasarkan tipe
        const responses = {
            joke: "Kenapa programer suka kopi? Karena kopi itu Java! 😄",
            quote: "Kegagalan adalah bumbu kehidupan yang membuat kesuksesan terasa lebih manis.",
            advice: "Jangan menyerah, karena kamu tidak tahu seberapa dekat kamu dengan kesuksesan."
        };
        
        return responses[type] || await this.chat(prompt);
    }
}

module.exports = AIService;
