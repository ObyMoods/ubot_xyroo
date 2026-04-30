const { Telegraf, session } = require('telegraf');
const chalk = require('chalk');

// Config
const config = require('./config');

// Lib
const clientManager = require('./src/lib/clientManager');
const { registerBotHandlers } = require('./src/handlers/botHandlers');
const { setupEventHandlers } = require('./src/handlers/userbotHandlers');

// Start time
const startTime = Date.now();

console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
console.log(chalk.cyan('  RAJA UBOT - Multi Connection'));
console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));

// Initialize bot
const bot = new Telegraf(config.botToken);

// Session middleware
const sessionStore = new Map();
bot.use(session({
    getSessionKey: (ctx) => ctx.from ? `${ctx.from.id}` : null,
    store: {
        get: (key) => Promise.resolve(sessionStore.get(key)),
        set: (key, value) => { sessionStore.set(key, value); return Promise.resolve(); },
        delete: (key) => { sessionStore.delete(key); return Promise.resolve(); }
    }
}));

// Register handlers
registerBotHandlers(bot, startTime, (userId, client) => {
    setupEventHandlers(userId, client, startTime);
});

// Start
async function main() {
    console.log(chalk.yellow('🔄 Starting...'));

    // Reconnect saved sessions
    await clientManager.reconnectAllSessions();

    // Setup handlers for reconnected clients
    for (const [userId, data] of clientManager.getAllActiveClients()) {
        setupEventHandlers(userId, data.client, startTime);
    }

    // Launch bot
    await bot.launch();
    console.log(chalk.green(`✅ Bot @${config.botUsername} started!`));
    console.log(chalk.green(`✅ Active: ${clientManager.getAllActiveClients().size} sessions`));
}

main().catch(err => {
    console.error(chalk.red('❌ Fatal:'), err);
    process.exit(1);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
