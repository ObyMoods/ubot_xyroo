/**
 * Session Manager
 * Mengelola session per-user
 */

const fs = require('fs');
const path = require('path');
const config = require('../../config');

const SESSIONS_DIR = path.join(__dirname, '../../', config.sessionsDir);

// Pastikan folder ada
if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

function loadSession(userId) {
    const file = path.join(SESSIONS_DIR, `${userId}.json`);
    if (fs.existsSync(file)) {
        try {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (e) {
            console.log(`❌ Session ${userId} corrupt`);
            return null;
        }
    }
    return null;
}

function saveSession(userId, data) {
    const file = path.join(SESSIONS_DIR, `${userId}.json`);
    try {
        fs.writeFileSync(file, JSON.stringify({
            ...data,
            userId,
            updatedAt: new Date().toISOString()
        }, null, 2));
        return true;
    } catch (e) {
        console.log(`❌ Failed to save session ${userId}`);
        return false;
    }
}

function deleteSession(userId) {
    const file = path.join(SESSIONS_DIR, `${userId}.json`);
    if (fs.existsSync(file)) {
        try {
            fs.unlinkSync(file);
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}

function getAllSessions() {
    try {
        return fs.readdirSync(SESSIONS_DIR)
            .filter(f => f.endsWith('.json'))
            .map(f => loadSession(f.replace('.json', '')))
            .filter(s => s !== null);
    } catch (e) {
        return [];
    }
}

function hasSession(userId) {
    return fs.existsSync(path.join(SESSIONS_DIR, `${userId}.json`));
}

module.exports = {
    loadSession,
    saveSession,
    deleteSession,
    getAllSessions,
    hasSession,
    SESSIONS_DIR
};
