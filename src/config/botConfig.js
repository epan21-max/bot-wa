module.exports = {
    botName: process.env.BOT_NAME || 'ConfessBot',
    prefix: process.env.PREFIX || '#',
    aiApiUrl: process.env.AI_API_URL || 'https://api.simsimi.vn/v1/simtalk',
    aiApiKey: process.env.AI_API_KEY || '',
    
    // Menu structure
    menuSections: {
        confess: ['#confess', '#balas', '#cekconfess', '#daftarconfess'],
        ai: ['#ai', '#gpt', '#ask'],
        game: ['#asahotak', '#tts', '#tebakangka', '#jawab'],
        maker: ['#sticker', '#toimage', '#tourl'],
        utility: ['#menu', '#help', '#ping', '#info']
    },
    
    // Watermark
    watermark: '~ Bot Confess',
    
    // Header confess
    confessHeader: '╭━━━━━━━━━━━━━━━━━╮\n┃ *💌 CONFESSION UNTUK ANDA*\n┃ \n┃ ',
    confessFooter: '\n┃ \n┃ ━━━━━━━━━━━━━━━━━\n┃ *📨 Balas via ID: #balas <id> <pesan>*\n┃ *🔍 Cek: #cekconfess <id>*\n┃ \n┃ ~ Bot Confess\n╰━━━━━━━━━━━━━━━━━╯'
};
