const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const config = require('../../config');
const sessionManager = require('./sessionManager');

const activeClients = new Map();
const pendingLogins = new Map();

async function createClient(sessionString = '') {
    const client = new TelegramClient(
        new StringSession(sessionString),
        parseInt(config.apiId),
        config.apiHash,
        { connectionRetries: 5 }
    );
    return client;
}

async function startLogin(userId, phone) {
    try {
        const client = await createClient();
        await client.connect();

        const result = await client.invoke(
            new Api.auth.SendCode({
                phoneNumber: phone,
                apiId: parseInt(config.apiId),
                apiHash: config.apiHash,
                settings: new Api.CodeSettings({
                    allowFlashcall: false,
                    currentNumber: true,
                    allowAppHash: true,
                }),
            })
        );

        pendingLogins.set(userId, { client, phone, phoneCodeHash: result.phoneCodeHash });
        return { success: true, phoneCodeHash: result.phoneCodeHash };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function verifyOTP(userId, code) {
    const pending = pendingLogins.get(userId);
    if (!pending) return { success: false, error: 'No pending login' };

    try {
        const { client, phone, phoneCodeHash } = pending;

        await client.invoke(
            new Api.auth.SignIn({
                phoneNumber: phone,
                phoneCodeHash,
                phoneCode: code.replace(/\s/g, '')
            })
        );

        const me = await client.getMe();
        const sessionString = client.session.save();

        sessionManager.saveSession(userId, {
            session: sessionString,
            phone,
            myId: me.id.toString(),
            firstName: me.firstName || '',
            lastName: me.lastName || '',
            username: me.username || '',
            createdAt: new Date().toISOString()
        });

        activeClients.set(userId, { client, myId: me.id.toString(), info: me });
        pendingLogins.delete(userId);

        return { success: true, user: me, sessionString };
    } catch (error) {
        // Check for 2FA needed - error message may contain "SESSION_PASSWORD_NEEDED"
        if (error.message && error.message.includes('SESSION_PASSWORD_NEEDED')) {
            return { success: false, need2FA: true };
        }
        return { success: false, error: error.message };
    }
}

async function verify2FA(userId, password) {
    const pending = pendingLogins.get(userId);
    if (!pending) return { success: false, error: 'No pending login' };

    try {
        const { client, phone } = pending;

        // Use signInWithPassword method from client
        await client.signInWithPassword(
            {
                apiId: parseInt(config.apiId),
                apiHash: config.apiHash,
            },
            {
                password: async () => password,
                onError: (err) => { throw err; }
            }
        );

        const me = await client.getMe();
        const sessionString = client.session.save();

        sessionManager.saveSession(userId, {
            session: sessionString,
            phone,
            myId: me.id.toString(),
            firstName: me.firstName || '',
            lastName: me.lastName || '',
            username: me.username || '',
            createdAt: new Date().toISOString()
        });

        activeClients.set(userId, { client, myId: me.id.toString(), info: me });
        pendingLogins.delete(userId);

        return { success: true, user: me };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function cancelLogin(userId) {
    const pending = pendingLogins.get(userId);
    if (pending) {
        try { await pending.client.disconnect(); } catch (e) { }
        pendingLogins.delete(userId);
    }
}

async function connectSession(userId) {
    const data = sessionManager.loadSession(userId);
    if (!data?.session) return { success: false, error: 'No session' };

    try {
        const client = await createClient(data.session);
        await client.connect();
        const me = await client.getMe();

        activeClients.set(userId, { client, myId: me.id.toString(), info: me });
        sessionManager.saveSession(userId, { ...data, lastConnected: new Date().toISOString() });

        return { success: true, user: me, client };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function disconnectClient(userId) {
    const active = activeClients.get(userId);
    if (active) {
        try { await active.client.disconnect(); } catch (e) { }
        activeClients.delete(userId);
    }
}

function getClient(userId) { return activeClients.get(userId); }
function isActive(userId) { return activeClients.has(userId); }
function getAllActiveClients() { return activeClients; }

async function reconnectAllSessions() {
    const sessions = sessionManager.getAllSessions();
    console.log(`🔄 Reconnecting ${sessions.length} sessions...`);

    for (const session of sessions) {
        if (session.session) {
            const result = await connectSession(session.userId);
            console.log(result.success ? `✅ ${session.userId}` : `❌ ${session.userId}`);
        }
    }
}

module.exports = {
    createClient, startLogin, verifyOTP, verify2FA, cancelLogin,
    connectSession, disconnectClient, getClient, isActive,
    getAllActiveClients, reconnectAllSessions, activeClients, pendingLogins
};
