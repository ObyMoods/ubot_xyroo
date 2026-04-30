/**
 * Premium System
 */

const premiumUsers = new Map();
const sellerUsers = new Set();
const config = require('../../config');

function isUserPremium(userId) {
    const data = premiumUsers.get(userId.toString());
    if (!data) return false;
    return new Date() < new Date(data.expired);
}

function addPremium(userId, months, addedBy) {
    const now = new Date();
    const expired = new Date(now);
    expired.setMonth(now.getMonth() + months);

    premiumUsers.set(userId.toString(), {
        expired,
        addedBy,
        addedAt: now,
        months
    });
    return expired;
}

function removePremium(userId) {
    return premiumUsers.delete(userId.toString());
}

function getPremiumInfo(userId) {
    const data = premiumUsers.get(userId.toString());
    if (!data) return null;
    const daysLeft = Math.ceil((new Date(data.expired) - new Date()) / (1000 * 60 * 60 * 24));
    return { ...data, daysLeft };
}

function addSeller(userId) { sellerUsers.add(userId.toString()); }
function removeSeller(userId) { return sellerUsers.delete(userId.toString()); }
function isSeller(userId) { return sellerUsers.has(userId.toString()) || userId.toString() === config.ownerId; }
function isOwner(userId) { return userId.toString() === config.ownerId; }

module.exports = {
    premiumUsers, sellerUsers,
    isUserPremium, addPremium, removePremium, getPremiumInfo,
    addSeller, removeSeller, isSeller, isOwner
};
