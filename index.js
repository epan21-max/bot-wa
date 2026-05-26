const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@whiskeysockets/baileys');
const Pino = require('pino');
const QRCode = require('qrcode-terminal');
require('dotenv').config();

const messageRouter = require('./src/routes/messageRouter');
const { initDatabase } = require('./src/database/db');
const logger = require('./src/utils/logger');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: Pino({ level: 'silent' })
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('📱 Scan QR Code berikut dengan WhatsApp:');
            QRCode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                logger.info('Reconnecting...');
                startBot();
            }
        } else if (connection === 'open') {
            logger.info('✅ Bot WhatsApp aktif!');
            initDatabase();
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Router untuk semua pesan
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        await messageRouter.handleMessage(sock, msg);
    });
    
    return sock;
}

startBot().catch(console.error);
