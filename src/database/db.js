const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || './data/confess_db.json';
const confessDB = new Map();
let confessCounter = 1;

function initDatabase() {
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data', { recursive: true });
    }
    
    if (fs.existsSync(DB_PATH)) {
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        confessDB.clear();
        data.forEach(([key, value]) => confessDB.set(key, value));
        const maxId = Math.max(...[...confessDB.keys()].map(Number), 0);
        confessCounter = maxId + 1;
    }
}

function saveConfess(id, data) {
    confessDB.set(id, data);
    fs.writeFileSync(DB_PATH, JSON.stringify([...confessDB], null, 2));
}

function getConfess(id) {
    return confessDB.get(id);
}

function getAllConfess() {
    return [...confessDB.values()];
}

function updateConfessStatus(id, status) {
    const confess = confessDB.get(id);
    if (confess) {
        confess.status = status;
        saveConfess(id, confess);
        return true;
    }
    return false;
}

function getNextId() {
    return confessCounter++;
}

module.exports = {
    initDatabase,
    saveConfess,
    getConfess,
    getAllConfess,
    updateConfessStatus,
    getNextId
};
