/**
 * Shared Data Store
 * Dipakai bersama oleh botHandlers.js dan userbotHandlers.js
 * supaya data premium/seller/admin/ultra selalu sinkron.
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR    = path.join(__dirname, '../../data');
const PREMIUM_FILE = path.join(DATA_DIR, 'premium.json');
const SELLERS_FILE = path.join(DATA_DIR, 'sellers.json');
const ADMINS_FILE  = path.join(DATA_DIR, 'admins.json');
const ULTRA_FILE   = path.join(DATA_DIR, 'ultra.json');

// ── In-memory store ─────────────────────────────────────────────────────────
let premiumUsers      = new Map();   // userId -> { expired, added_by, added_at, months }
let sellerUsers       = new Set();   // userId
let adminUsers        = new Set();   // userId
let ultraPremiumUsers = new Set();   // userId

// ── Helpers ──────────────────────────────────────────────────────────────────
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ── Load ─────────────────────────────────────────────────────────────────────
function loadAllData() {
    ensureDataDir();

    // Premium
    try {
        if (fs.existsSync(PREMIUM_FILE)) {
            const raw = JSON.parse(fs.readFileSync(PREMIUM_FILE, 'utf8'));
            premiumUsers = new Map();
            if (Array.isArray(raw)) {
                for (const item of raw) {
                    if (!item.userId) continue;
                    premiumUsers.set(item.userId.toString(), {
                        expired:  new Date(item.expired),
                        added_by: item.added_by || item.addedBy || 'system',
                        added_at: new Date(item.added_at || item.addedAt || Date.now()),
                        months:   item.months || 1
                    });
                }
            }
            console.log(`✅ [dataStore] Loaded ${premiumUsers.size} premium users`);
        }
    } catch (e) {
        console.error('[dataStore] Error loading premium:', e.message);
        premiumUsers = new Map();
    }

    // Sellers
    try {
        if (fs.existsSync(SELLERS_FILE)) {
            const raw = JSON.parse(fs.readFileSync(SELLERS_FILE, 'utf8'));
            sellerUsers = new Set(Array.isArray(raw) ? raw.map(String) : []);
            console.log(`✅ [dataStore] Loaded ${sellerUsers.size} sellers`);
        }
    } catch (e) {
        console.error('[dataStore] Error loading sellers:', e.message);
        sellerUsers = new Set();
    }

    // Admins
    try {
        if (fs.existsSync(ADMINS_FILE)) {
            const raw = JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf8'));
            adminUsers = new Set(Array.isArray(raw) ? raw.map(String) : []);
            console.log(`✅ [dataStore] Loaded ${adminUsers.size} admins`);
        }
    } catch (e) {
        console.error('[dataStore] Error loading admins:', e.message);
        adminUsers = new Set();
    }

    // Ultra
    try {
        if (fs.existsSync(ULTRA_FILE)) {
            const raw = JSON.parse(fs.readFileSync(ULTRA_FILE, 'utf8'));
            ultraPremiumUsers = new Set(Array.isArray(raw) ? raw.map(String) : []);
            console.log(`✅ [dataStore] Loaded ${ultraPremiumUsers.size} ultra users`);
        }
    } catch (e) {
        console.error('[dataStore] Error loading ultra:', e.message);
        ultraPremiumUsers = new Set();
    }
}

// ── Save ─────────────────────────────────────────────────────────────────────
function saveAllData() {
    ensureDataDir();

    try {
        const premiumArr = Array.from(premiumUsers.entries()).map(([userId, d]) => ({
            userId,
            expired:  d.expired instanceof Date ? d.expired.toISOString() : d.expired,
            added_by: d.added_by,
            added_at: d.added_at instanceof Date ? d.added_at.toISOString() : d.added_at,
            months:   d.months
        }));
        fs.writeFileSync(PREMIUM_FILE, JSON.stringify(premiumArr, null, 2));
    } catch (e) { console.error('[dataStore] Error saving premium:', e.message); }

    try {
        fs.writeFileSync(SELLERS_FILE, JSON.stringify(Array.from(sellerUsers), null, 2));
    } catch (e) { console.error('[dataStore] Error saving sellers:', e.message); }

    try {
        fs.writeFileSync(ADMINS_FILE, JSON.stringify(Array.from(adminUsers), null, 2));
    } catch (e) { console.error('[dataStore] Error saving admins:', e.message); }

    try {
        fs.writeFileSync(ULTRA_FILE, JSON.stringify(Array.from(ultraPremiumUsers), null, 2));
    } catch (e) { console.error('[dataStore] Error saving ultra:', e.message); }
}

// ── Business logic ────────────────────────────────────────────────────────────
function isUserPremium(userId) {
    const d = premiumUsers.get(userId.toString());
    if (!d) return false;
    if (new Date() > new Date(d.expired)) {
        premiumUsers.delete(userId.toString());
        saveAllData();
        return false;
    }
    return true;
}

function isUserSeller(userId) {
    return sellerUsers.has(userId.toString());
}

function isUserAdmin(userId, ownerId) {
    return adminUsers.has(userId.toString()) || userId.toString() === String(ownerId);
}

function isUserOwner(userId, ownerId) {
    return userId.toString() === String(ownerId);
}

function isUserUltra(userId) {
    return ultraPremiumUsers.has(userId.toString());
}

function getPremiumInfo(userId) {
    const d = premiumUsers.get(userId.toString());
    if (!d) return null;
    const daysLeft = Math.ceil((new Date(d.expired) - new Date()) / (1000 * 60 * 60 * 24));
    return {
        expired:  new Date(d.expired),
        daysLeft: Math.max(0, daysLeft),
        addedBy:  d.added_by,
        addedAt:  d.added_at,
        months:   d.months
    };
}

function addPremiumUser(userId, months = 1, addedBy = 'system') {
    const now        = new Date();
    const expiredDate = new Date(now);
    expiredDate.setMonth(now.getMonth() + months);
    premiumUsers.set(userId.toString(), {
        expired:  expiredDate,
        added_by: addedBy.toString(),
        added_at: now,
        months
    });
    saveAllData();
    return expiredDate;
}

function removePremiumUser(userId) {
    const removed = premiumUsers.delete(userId.toString());
    if (removed) saveAllData();
    return removed;
}

function addSeller(userId) {
    sellerUsers.add(userId.toString());
    saveAllData();
    return true;
}

function removeSeller(userId) {
    const removed = sellerUsers.delete(userId.toString());
    if (removed) saveAllData();
    return removed;
}

function addAdmin(userId) {
    adminUsers.add(userId.toString());
    saveAllData();
    return true;
}

function removeAdmin(userId) {
    const removed = adminUsers.delete(userId.toString());
    if (removed) saveAllData();
    return removed;
}

function addUltra(userId) {
    ultraPremiumUsers.add(userId.toString());
    saveAllData();
    return true;
}

function removeUltra(userId) {
    const removed = ultraPremiumUsers.delete(userId.toString());
    if (removed) saveAllData();
    return removed;
}

// Bersihkan premium expired
function cleanExpired() {
    let cleaned = 0;
    const now = new Date();
    for (const [uid, d] of premiumUsers.entries()) {
        if (now > new Date(d.expired)) {
            premiumUsers.delete(uid);
            cleaned++;
        }
    }
    if (cleaned > 0) {
        console.log(`🧹 [dataStore] Cleaned ${cleaned} expired premium`);
        saveAllData();
    }
    return cleaned;
}

// Auto-load saat module pertama kali di-require
loadAllData();

// Bersihkan expired setiap 1 jam
setInterval(cleanExpired, 60 * 60 * 1000);

module.exports = {
    // Refs langsung (bisa dipakai untuk iterasi)
    premiumUsers,
    sellerUsers,
    adminUsers,
    ultraPremiumUsers,

    // IO
    loadAllData,
    saveAllData,

    // Checks
    isUserPremium,
    isUserSeller,
    isUserAdmin,
    isUserOwner,
    isUserUltra,

    // Premium
    getPremiumInfo,
    addPremiumUser,
    removePremiumUser,

    // Seller
    addSeller,
    removeSeller,

    // Admin
    addAdmin,
    removeAdmin,

    // Ultra
    addUltra,
    removeUltra,

    cleanExpired
};
