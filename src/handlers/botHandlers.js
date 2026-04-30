const { Markup } = require('telegraf');
const clientManager = require('../lib/clientManager');
const sessionManager = require('../lib/sessionManager');
const { formatDuration, features, prefix, groupedFeatures, categoryIcons } = require('../lib/commands');
const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

// ── Shared data store (sinkron dengan userbotHandlers) ──────────────────────
const ds = require('../lib/dataStore');

const admin      = config.adminUser;
const OWNER_ID   = config.ownerId;
const usernameBot = config.botUsername;

// Alias supaya kode lama di bawah tidak perlu diubah satu per satu
const premiumUsers      = ds.premiumUsers;
const sellerUsers       = ds.sellerUsers;
const adminUsers        = ds.adminUsers;
const ultraPremiumUsers = ds.ultraPremiumUsers;

let activePurchases = new Map();

function isUserPremium(userId)  { return ds.isUserPremium(userId); }
function isUserUltra(userId)    { return ds.isUserUltra(userId); }
function isUserSeller(userId)   { return ds.isUserSeller(userId); }
function isUserAdmin(userId)    { return ds.isUserAdmin(userId, OWNER_ID); }
function isUserOwner(userId)    { return ds.isUserOwner(userId, OWNER_ID); }
function getPremiumInfo(userId) { return ds.getPremiumInfo(userId); }
function savePremiumData()      { ds.saveAllData(); return Promise.resolve(); }
function loadPremiumData()      { ds.loadAllData(); return Promise.resolve(); }

async function findUser(ctx, target) {
    try {
        if (target.startsWith('@')) {
            const username = target.slice(1);
            try {
                const chat = await ctx.telegram.getChat(`@${username}`);
                return chat.id.toString();
            } catch (error) {
                return null;
            }
        } else if (!isNaN(target)) {
            return target.toString();
        }
        return null;
    } catch (error) {
        return null;
    }
}

function markAsActivePurchase(userId, bulan) {
    activePurchases.set(userId, {
        bulan: bulan,
        timestamp: Date.now(),
        status: 'waiting_payment'
    });
    
    setTimeout(() => {
        if (activePurchases.has(userId)) {
            activePurchases.delete(userId);
        }
    }, 60 * 60 * 1000);
}

function isActivePurchase(userId) {
    return activePurchases.has(userId);
}

function completePurchase(userId) {
    activePurchases.delete(userId);
}

async function addPremiumUser(userId, months, addedBy = "system") {
    try {
        const existing = ds.getPremiumInfo(userId.toString());
        if (existing && existing.daysLeft > 0) {
            const newExpired = new Date(existing.expired);
            newExpired.setMonth(newExpired.getMonth() + months);
            ds.premiumUsers.set(userId.toString(), {
                expired:  newExpired,
                added_by: addedBy.toString(),
                added_at: new Date(),
                months:   (existing.months || 0) + months
            });
            ds.saveAllData();
            console.log(`✅ Premium diperpanjang: ${userId} tambah ${months} bulan`);
        } else {
            ds.addPremiumUser(userId.toString(), months, addedBy.toString());
            console.log(`✅ Premium baru ditambahkan: ${userId} untuk ${months} bulan`);
        }
        return true;
    } catch (error) {
        console.error("Error adding premium user:", error);
        return false;
    }
}

function validateUserData(user) {
    if (!user) return { id: 0, first_name: "User", is_bot: false };
    
    let firstName = user.first_name || "User";
    if (typeof firstName === 'string') {
        firstName = firstName.replace(/[<>]/g, '')
                            .replace(/script/gi, '')
                            .replace(/require\(/gi, '')
                            .trim();
        if (firstName.length === 0) firstName = "User";
    } else {
        firstName = "User";
    }
    
    return {
        id: user.id || 0,
        first_name: firstName,
        is_bot: user.is_bot || false,
        username: user.username || null,
        language_code: user.language_code || 'id'
    };
}

// === BOT HANDLER REGISTRATION ===
function registerBotHandlers(bot, startTime, setupEventHandlers) {

    loadPremiumData().catch(console.error);

    bot.command("prem", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            if (!isUserSeller(userId) && !isUserOwner(userId)) {
                return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀ sᴇʟʟᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                    reply_to_message_id: ctx.message.message_id, 
                    parse_mode: "HTML"
                });
            }
            
            const args = ctx.message.text.split(' ').filter(arg => arg.trim());
            if (args.length < 2) {
                return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /prem @username bulan\nᴄᴏɴᴛᴏʜ: /prem @user123 2</blockquote>", {
                    reply_to_message_id: ctx.message.message_id,
                    parse_mode: "HTML"
                });
            }
            
            let targetUser = args[1];
            let months = 1;
            
            if (args.length >= 3) {
                months = parseInt(args[2]) || 1;
            }
            
            let targetUserId;
            
            if (ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
                targetUserId = ctx.message.reply_to_message.from.id.toString();
            } else {
                targetUserId = await findUser(ctx, targetUser);
                if (!targetUserId) {
                    return await ctx.reply("<blockquote>❌ ᴜsᴇʀ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</blockquote>", {
                        reply_to_message_id: ctx.message.message_id,
                        parse_mode: "HTML"
                    });
                }
            }
            
            const now = new Date();
            const expiredDate = new Date(now);
            expiredDate.setMonth(now.getMonth() + months);
            
            premiumUsers.set(targetUserId, {
                expired: expiredDate,
                added_by: userId,
                added_at: now,
                months: months
            });
            
            await savePremiumData();
            
            await ctx.reply(`<blockquote>
✅ ʙᴇʀʜᴀsɪʟ ᴍᴇɴᴀᴍʙᴀʜᴋᴀɴ ᴘʀᴇᴍɪᴜᴍ!

• ᴜsᴇʀ: <code>${targetUserId}</code>
• ᴅᴜʀᴀsɪ: ${months} bulan
• ᴇxᴘɪʀᴇᴅ: ${expiredDate.toLocaleDateString('id-ID')}
• sᴇʟʟᴇʀ: <code>${userId}</code>

sɪʟᴀʜᴋᴀɴ ʙᴜᴋᴀ @${ctx.botInfo.username} ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ!</blockquote>`.trim(), {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
            if (isUserOwner(ctx.from.id.toString())) {
                await ctx.telegram.sendMessage(
                    OWNER_ID,
                    `<blockquote>ᴛʀᴀɴsᴀᴋsɪ ᴘʀᴇᴍɪᴜᴍ\n\n• sᴇʟʟᴇʀ: ${userId}\n• ᴄᴜsᴛᴏᴍᴇʀ: ${targetUserId}\n• ᴅᴜʀᴀsɪ: ${months} bulan</blockquote>`,
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "👤 Seller", callback_data: `profil_${userId}` },
                                    { text: "👥 Customer", callback_data: `profil_${targetUserId}` }
                                ]
                            ]
                        }
                    }
                );
            }
            
        } catch (error) {
            console.error("Error in /prem command:", error);
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</blockquote>", {
                reply_to_message_id: ctx.message.message_id,
                parse_mode: "HTML"
            });
        }
    });

    bot.command("unprem", async (ctx) => {
    const originalMessageId = ctx.message?.message_id;
    
    try {
        const userId = ctx.from?.id?.toString();
        if (!isUserSeller(userId) && !isUserOwner(userId)) {
            return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀ sᴇʟʟᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                parse_mode: "HTML", 
                reply_to_message_id: originalMessageId
            }).catch(() => {});
        }
        
        const args = ctx.message?.text?.split(' ').filter(arg => arg.trim()) || [];
        let targetUserId;
        
        if (ctx.message?.reply_to_message?.from) {
            targetUserId = ctx.message.reply_to_message.from.id.toString();
        } 
        else if (args.length >= 2) {
            try {
                targetUserId = await findUser(ctx, args[1]);
            } catch (findUserError) {
                console.error("Error finding user:", findUserError);
                return await ctx.reply("<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴᴄᴀʀɪ ᴜsᴇʀ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: originalMessageId
                }).catch(() => {});
            }
            
            if (!targetUserId) {
                return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /unprem [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                    parse_mode: "HTML",
                    reply_to_message_id: originalMessageId
                }).catch(() => {});
            }
        } 
        else {
            return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /unprem [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                parse_mode: "HTML", 
                reply_to_message_id: originalMessageId
            }).catch(() => {});
        }
        
        if (!targetUserId || typeof targetUserId !== 'string') {
            return await ctx.reply("<blockquote>❌ ɪᴅ ᴜsᴇʀ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ!</blockquote>", {
                parse_mode: "HTML",
                reply_to_message_id: originalMessageId
            }).catch(() => {});
        }
        
        if (!premiumUsers.has(targetUserId)) {
            return await ctx.reply("<blockquote>❌ ᴜsᴇʀ ᴛɪᴅᴀᴋ ᴍᴇᴍɪʟɪᴋɪ ᴘʀᴇᴍɪᴜᴍ!</blockquote>", {
                parse_mode: "HTML",
                reply_to_message_id: originalMessageId
            }).catch(() => {});
        }
        
        try {
            premiumUsers.delete(targetUserId);
        } catch (deleteError) {
            console.error("Error deleting from premiumUsers:", deleteError);
            return await ctx.reply("<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴɢʜᴀᴘᴜs ᴅᴀᴛᴀ ᴘʀᴇᴍɪᴜᴍ!</blockquote>", {
                parse_mode: "HTML",
                reply_to_message_id: originalMessageId
            }).catch(() => {});
        }
        
        let saveSuccessful = false;
        try {
            await savePremiumData();
            saveSuccessful = true;
        } catch (saveError) {
            console.error("Error saving premium data:", saveError);
            premiumUsers.add(targetUserId);
        }
        
        if (!saveSuccessful) {
            return await ctx.reply("<blockquote>❌ ɢᴀɢᴀʟ ᴍᴇɴʏɪᴍᴘᴀɴ ᴘᴇʀᴜʙᴀʜᴀɴ!</blockquote>", {
                parse_mode: "HTML",
                reply_to_message_id: originalMessageId
            }).catch(() => {});
        }
        
        const successMessage = `<blockquote>✅ ʙᴇʀʜᴀsɪʟ ᴍᴇɴɢʜᴀᴘᴜs ᴘʀᴇᴍɪᴜᴍ!

• ᴜsᴇʀ: <code>${targetUserId}</code>
• sᴛᴀᴛᴜs: ɴᴏ ᴘʀᴇᴍɪᴜᴍ
</blockquote>`.trim();
        
        await ctx.reply(successMessage, {
            parse_mode: "HTML",
            reply_to_message_id: originalMessageId
        }).catch(async (replyError) => {
            console.error("Error sending success message:", replyError);
            await ctx.reply(`✅ BERHASIL MENGHAPUS PREMIUM!\n\nUser ID: ${targetUserId}\nRemoved by: ${userId}`, {
                reply_to_message_id: originalMessageId
            }).catch(() => {});
        });
        
    } catch (error) {
        console.error("Unexpected error in /unprem command:", error);
        
        if (error instanceof Error) {
            console.error(`Error name: ${error.name}`);
            console.error(`Error message: ${error.message}`);
            console.error(`Error stack: ${error.stack}`);
        }
        
        try {
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ! sɪʟᴀʜᴋᴀɴ ᴄᴏʙᴀ ʟᴀɢɪ.</blockquote>", {
                parse_mode: "HTML",
                reply_to_message_id: originalMessageId
            });
        } catch (finalError) {
            console.error("Failed to send error message:", finalError);
        }
    }
});

    bot.command("getprem", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            if (!isUserSeller(userId) && !isUserOwner(userId)) {
                return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀ sᴇʟʟᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            if (premiumUsers.size === 0) {
                return await ctx.reply("<blockquote>ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴜsᴇʀ ᴘʀᴇᴍɪᴜᴍ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            let text = "<blockquote>📋 ᴅᴀғᴛᴀʀ ᴜsᴇʀ ᴘʀᴇᴍɪᴜᴍ\n\n";
            let count = 1;
            const now = new Date();
            
            for (const [userId, data] of premiumUsers.entries()) {
                const expiredStr = data.expired.toLocaleDateString('id-ID');
                const daysLeft = Math.ceil((data.expired - now) / (1000 * 60 * 60 * 24));
                
                text += `${count}. • ɪᴅ: <code>${userId}</code>\n`;
                text += `   • ᴇxᴘɪʀᴇᴅ: ${expiredStr} (${daysLeft > 0 ? daysLeft + ' hari lagi' : 'EXPIRED'})\n`;
                text += `   • sᴇʟʟᴇʀ: <code>${data.added_by}</code>\n\n`;
                count++;
            }
            
            text += `ᴛᴏᴛᴀʟ: ${premiumUsers.size} user</blockquote>`;
            
            await ctx.reply(text, {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
        } catch (error) {
            console.error("Error in /getprem command:", error);
            await ctx.reply("❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!", {
                parse_mode: "HTML", 
                reply_to_message_id: ctx.message.message_id
            });
        }
    });

    bot.command("addseller", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            if (!isUserAdmin(userId) && !isUserOwner(userId)) {
                return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            const args = ctx.message.text.split(' ').filter(arg => arg.trim());
            let targetUserId;
            
            if (ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
                targetUserId = ctx.message.reply_to_message.from.id.toString();
            } else if (args.length >= 2) {
                targetUserId = await findUser(ctx, args[1]);
                if (!targetUserId) {
                    return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /addseller [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                        parse_mode: "HTML", 
                        reply_to_message_id: ctx.message.message_id
                    });
                }
            } else {
                return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /addseller [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            if (sellerUsers.has(targetUserId)) {
                return await ctx.reply("❌ ᴜsᴇʀ sᴜᴅᴀʜ ᴍᴇɴᴊᴀᴅɪ sᴇʟʟᴇʀ!", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            sellerUsers.add(targetUserId);
            await savePremiumData();
            
            await ctx.reply(`<blockquote>✅ ʙᴇʀʜᴀsɪʟ ᴍᴇɴᴀᴍʙᴀʜᴋᴀɴ sᴇʟʟᴇʀ!

• ᴜsᴇʀ: <code>${targetUserId}</code>
• ʀᴏʟᴇ: ʀᴇsᴇʟʟᴇʀ
</blockquote>`.trim(), {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
        } catch (error) {
            console.error("Error in /addseller command:", error);
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</blockquote>", {
                parse_mode: "HTML", 
                reply_to_message_id: ctx.message.message_id
            });
        }
    });

    bot.command("unseller", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            if (!isUserAdmin(userId) && !isUserOwner(userId)) {
                return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            const args = ctx.message.text.split(' ').filter(arg => arg.trim());
            let targetUserId;
            
            if (ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
                targetUserId = ctx.message.reply_to_message.from.id.toString();
            } else if (args.length >= 2) {
                targetUserId = await findUser(ctx, args[1]);
                if (!targetUserId) {
                    return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /unseller [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                        reply_to_message_id: ctx.message.message_id
                    });
                }
            } else {
                return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /unseller [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            if (!sellerUsers.has(targetUserId)) {
                return await ctx.reply("<blockquote>❌ ᴜsᴇʀ ʙᴜᴋᴀɴ sᴇʟʟᴇʀ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            sellerUsers.delete(targetUserId);
            await savePremiumData();
            
            await ctx.reply(`<blockquote>✅ ʙᴇʀʜᴀsɪʟ ᴍᴇɴɢʜᴀᴘᴜs sᴇʟʟᴇʀ!

• ᴜsᴇʀ: <code>${targetUserId}</code>
• sᴛᴀᴛᴜs: ɴᴏ sᴇʟʟᴇʀ
</blockquote>`.trim(), {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
        } catch (error) {
            console.error("Error in /unseller command:", error);
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</blockquote>", {
                parse_mode: "HTML", 
                reply_to_message_id: ctx.message.message_id
            });
        }
    });

    bot.command("getseller", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            if (!isUserAdmin(userId) && isUserOwner(userId)) {
                return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            if (sellerUsers.size === 0) {
                return await ctx.reply("<blockquote>ᴛɪᴅᴀᴋ ᴀᴅᴀ sᴇʟʟᴇʀ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            let text = "<blockquote>📋 ᴅᴀғᴛᴀʀ ᴜsᴇʀ sᴇʟʟᴇʀ\n\n";
            let count = 1;
            
            for (const sellerId of sellerUsers) {
                text += `${count}. ID: <code>${sellerId}</code>\n`;
                count++;
            }
            
            text += `\nᴛᴏᴛᴀʟ: ${sellerUsers.size} sᴇʟʟᴇʀ</blockquote>`;
            
            await ctx.reply(text, {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
        } catch (error) {
            console.error("Error in /getseller command:", error);
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</blockquote>", {
                parse_mode: "HTML", 
                reply_to_message_id: ctx.message.message_id
            });
        }
    });

    bot.command("cek", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            const isAuthorized = isUserOwner(userId) || isUserSeller(userId) || isUserAdmin(userId);
            
            if (!isAuthorized) {
                return await ctx.reply("<blockquote>❌ ᴀᴋsᴇs ᴅɪᴛᴏʟᴀᴋ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            const args = ctx.message.text.split(' ').filter(arg => arg.trim());
            let targetUserId;
            
            if (args.length >= 2) {
                targetUserId = await findUser(ctx, args[1]);
                if (!targetUserId) {
                    return await ctx.reply("<blockquote>❌ ᴜsᴇʀ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</blockquote>", {
                        parse_mode: "HTML", 
                        reply_to_message_id: ctx.message.message_id
                    });
                }
            } else {
                targetUserId = userId;
            }
            
            const isPremium = isUserPremium(targetUserId);
            const isSeller = isUserSeller(targetUserId);
            const isAdmin = isUserAdmin(targetUserId);
            const isUltra = isUserUltra(targetUserId);
            
            let statusText = "";
            let expiredText = "ᴛɪᴅᴀᴋ ᴀᴅᴀ";
            
            if (isPremium) {
                const premiumData = premiumUsers.get(targetUserId);
                const expiredDate = premiumData.expired;
                const daysLeft = Math.ceil((expiredDate - new Date()) / (1000 * 60 * 60 * 24));
                
                statusText = "✅ ᴘʀᴇᴍɪᴜᴍ";
                expiredText = `${expiredDate.toLocaleDateString('id-ID')} (${daysLeft} ʜᴀʀɪ ʟᴀɢɪ)`;
            } else {
                statusText = "ɴᴏ ᴘʀᴇᴍɪᴜᴍ";
            }
            
            if (isUltra) {
                statusText = "sᴜᴘᴇʀ ᴜʟᴛʀᴀ";
            }
            
            if (isSeller) {
                statusText += " + sᴇʟʟᴇʀ";
            }
            
            if (isAdmin) {
                statusText += " + ᴀᴅᴍɪɴ";
            }
            
            await ctx.reply(`<blockquote>📋 ɪɴғᴏʀᴍᴀsɪ ᴜsᴇʀ

• ᴜsᴇʀ ɪᴅ: <code>${targetUserId}</code>
• sᴛᴀᴛᴜs: ${statusText}
• ᴇxᴘɪʀᴇᴅ: ${expiredText}
</blockquote>`.trim(), {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
        } catch (error) {
            console.error("Error in /cek command:", error);
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</blockquote>", {
                parse_mode: "HTML", 
                reply_to_message_id: ctx.message.message_id
            });
        }
    });

    bot.command("addadmin", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            if (!isUserUltra(userId) && !isUserOwner(userId)) {
                return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            const args = ctx.message.text.split(' ').filter(arg => arg.trim());
            let targetUserId;
            
            if (ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
                targetUserId = ctx.message.reply_to_message.from.id.toString();
            } else if (args.length >= 2) {
                targetUserId = await findUser(ctx, args[1]);
                if (!targetUserId) {
                    return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /addadmin [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                        parse_mode: "HTML", 
                        reply_to_message_id: ctx.message.message_id
                    });
                }
            } else {
                return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /addadmin [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            if (adminUsers.has(targetUserId)) {
                return await ctx.reply("<blockquote>❌ ᴜsᴇʀ sᴜᴅᴀʜ ᴍᴇɴᴊᴀᴅɪ ᴀᴅᴍɪɴ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            adminUsers.add(targetUserId);
            await savePremiumData();
            
            await ctx.reply(`<blockquote>✅ ʙᴇʀʜᴀsɪʟ ᴍᴇɴᴀᴍʙᴀʜᴋᴀɴ ᴀᴅᴍɪɴ!

• ᴜsᴇʀ: <code>${targetUserId}</code>
• ʀᴏʟᴇ: ᴀᴅᴍɪɴ
</blockquote>`.trim(), {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
        } catch (error) {
            console.error("Error in /addadmin command:", error);
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</blockquote>", {
                parse_mode: "HTML", 
                reply_to_message_id: ctx.message.message_id
            });
        }
    });

    bot.command("unadmin", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            if (!isUserUltra(userId) && !isUserOwner(userId)) {
                return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                    parse_mode: "HTML",
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            const args = ctx.message.text.split(' ').filter(arg => arg.trim());
            let targetUserId;
            
            if (ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
                targetUserId = ctx.message.reply_to_message.from.id.toString();
            } else if (args.length >= 2) {
                targetUserId = await findUser(ctx, args[1]);
                if (!targetUserId) {
                    return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /unadmin [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                        parse_mode: "HTML", 
                        reply_to_message_id: ctx.message.message_id
                    });
                }
            } else {
                return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /unadmin [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            if (!adminUsers.has(targetUserId)) {
                return await ctx.reply("<blockquote>❌ ᴜsᴇʀ ʙᴜᴋᴀɴ ᴀᴅᴍɪɴ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            adminUsers.delete(targetUserId);
            await savePremiumData();
            
            await ctx.reply(`<blockquote>✅ ʙᴇʀʜᴀsɪʟ ᴍᴇɴɢʜᴀᴘᴜs ᴀᴅᴍɪɴ!

• ᴜsᴇʀ: <code>${targetUserId}</code>
• sᴛᴀᴛᴜs: ɴᴏ ᴀᴅᴍɪɴ
</blockquote>`.trim(), {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
        } catch (error) {
            console.error("Error in /unadmin command:", error);
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</blockquote>", {
                parse_mode: "HTML", 
                reply_to_message_id: ctx.message.message_id
            });
        }
    });

    bot.command("getadmin", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            if (!isUserUltra(userId) && !isUserOwner(userId)) {
                return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            if (adminUsers.size === 0) {
                return await ctx.reply("<blockquote>ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴀᴅᴍɪɴ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            let text = "<blockquote>📋 ᴅᴀғᴛᴀʀ ᴜsᴇʀ ᴀᴅᴍɪɴ\n\n";
            let count = 1;
            
            for (const adminId of adminUsers) {
                text += `${count}. • ɪᴅ: <code>${adminId}</code>\n`;
                count++;
            }
            
            text += `\nᴛᴏᴛᴀʟ: ${adminUsers.size} ᴀᴅᴍɪɴ`;
            
            await ctx.reply(text, {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
        } catch (error) {
            console.error("Error in /getadmin command:", error);
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</blockquote>", {
                parse_mode: "HTML", 
                reply_to_message_id: ctx.message.message_id
            });
        }
    });

    bot.command("addultra", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            if (!isUserOwner(userId)) {
                return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                    parse_mode: "HTML",
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            const args = ctx.message.text.split(' ').filter(arg => arg.trim());
            let targetUserId;
            
            if (ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
                targetUserId = ctx.message.reply_to_message.from.id.toString();
            } else if (args.length >= 2) {
                targetUserId = await findUser(ctx, args[1]);
                if (!targetUserId) {
                    return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /addultra [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                        parse_mode: "HTML", 
                        reply_to_message_id: ctx.message.message_id
                    });
                }
            } else {
                return await ctx.reply("❌ ғᴏʀᴍᴀᴛ: /addultra [ɪᴅ_ᴜsᴇʀ]", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            if (ultraPremiumUsers.has(targetUserId)) {
                return await ctx.reply("<blockquote>❌ ᴜsᴇʀ sᴜᴅᴀʜ ᴍᴇɴᴊᴀᴅɪ sᴜᴘᴇʀ ᴜʟᴛʀᴀ!</blockquote>", {
                    parse_mode: "HTML", 
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            ultraPremiumUsers.add(targetUserId);
            await savePremiumData();
            
            await ctx.reply(`<blockquote>ʙᴇʀʜᴀsɪʟ ᴍᴇɴᴀᴍʙᴀʜᴋᴀɴ sᴜᴘᴇʀ ᴜʟᴛʀᴀ!

• ᴜsᴇʀ: <code>${targetUserId}</code>
• sᴛᴀᴛᴜs: sᴜᴘᴇʀ ᴜʟᴛʀᴀ ᴘʀᴇᴍɪᴜᴍ
</blockquote>`.trim(), {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
        } catch (error) {
            console.error("Error in /addultra command:", error);
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</blockquote>", {
                parse_mode: "HTML", 
                reply_to_message_id: ctx.message.message_id
            });
        }
    });

    bot.command("rmultra", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            if (!isUserOwner(userId)) {
                return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                    parse_mode: "HTML",
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            const args = ctx.message.text.split(' ').filter(arg => arg.trim());
            let targetUserId;
            
            if (ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
                targetUserId = ctx.message.reply_to_message.from.id.toString();
            } else if (args.length >= 2) {
                targetUserId = await findUser(ctx, args[1]);
                if (!targetUserId) {
                    return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /rmultra [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                        parse_mode: "HTML",
                        reply_to_message_id: ctx.message.message_id
                    });
                }
            } else {
                return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /rmultra [ɪᴅ_ᴜsᴇʀ]</blockquote>", {
                    parse_mode: "HTML",
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            if (!ultraPremiumUsers.has(targetUserId)) {
                return await ctx.reply("<blockquote>❌ ᴜsᴇʀ ʙᴜᴋᴀɴ sᴜᴘᴇʀ ᴜʟᴛʀᴀ!</blockquote>", {
                    parse_mode: "HTML",
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            ultraPremiumUsers.delete(targetUserId);
            await savePremiumData();
            
            await ctx.reply(`<blockquote>✅ ʙᴇʀʜᴀsɪʟ ᴍᴇɴɢʜᴀᴘᴜs sᴜᴘᴇʀ ᴜʟᴛʀᴀ!

• ᴜsᴇʀ: <code>${targetUserId}</code>
• sᴛᴀᴛᴜs: ᴘʀᴇᴍɪᴜᴍ
</blockquote>`.trim(), {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
        } catch (error) {
            console.error("Error in /rmultra command:", error);
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</blockquote>", {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
        }
    });

    bot.command("time", async (ctx) => {
        try {
            const userId = ctx.from.id.toString();
            
            if (!isUserUltra(userId) && !isUserOwner(userId)) {
                return await ctx.reply("<blockquote>❌ ʜᴀɴʏᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇɴɢɢᴜɴᴀᴋᴀɴ ᴄᴏᴍᴍᴀɴᴅ ɪɴɪ!</blockquote>", {
                    parse_mode: "HTML",
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            const args = ctx.message.text.split(' ').filter(arg => arg.trim());
            if (args.length < 3) {
                return await ctx.reply("<blockquote>❌ ғᴏʀᴍᴀᴛ: /time [ɪᴅ_ᴜsᴇʀ] [ᴅᴜʀᴀsɪ]</blockquote>", {
                    parse_mode: "HTML",
                    reply_to_message_id: ctx.message.message_id
                });
            }
            
            let targetUser = args[1];
            let days = parseInt(args[2]) || 30;
            let targetUserId;
            
            if (ctx.message.reply_to_message && ctx.message.reply_to_message.from) {
                targetUserId = ctx.message.reply_to_message.from.id.toString();
            } else {
                targetUserId = await findUser(ctx, targetUser);
                if (!targetUserId) {
                    return await ctx.reply("<blockquote>❌ ᴜsᴇʀ ᴛɪᴅᴀᴋ ᴅɪᴛᴇᴍᴜᴋᴀɴ!</blockquote>", {
                        parse_mode: "HTML",
                        reply_to_message_id: ctx.message.message_id
                    });
                }
            }
            
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
            
            await ctx.reply(`<blockquote>⏰ ᴡᴀᴋᴛᴜ ᴅɪᴘᴇʀʙᴀʀᴜɪ!

• ᴜsᴇʀ: <code>${targetUserId}</code>
• ᴅᴜʀᴀsɪ: ${days} hari
• ᴇxᴘɪʀᴇᴅ: ${expiredDate.toLocaleDateString('id-ID')}
</blockquote>`.trim(), {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
            
        } catch (error) {
            console.error("Error in /time command:", error);
            await ctx.reply("<blockquote>❌ ᴛᴇʀᴊᴀᴅɪ ᴋᴇsᴀʟᴀʜᴀɴ sɪsᴛᴇᴍ!</blockquote>", {
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            });
        }
    });

bot.start(async (ctx) => {
    try {
        const safeUser = validateUserData(ctx.from);
        const userId = safeUser.id.toString();
        const photo = "https://gangalink.vercel.app/i/s2nsly0x.jpg";
        
        if (ctx.session) ctx.session = {};
        
        const isActive = clientManager.isActive(userId);
        const hasSession = sessionManager.hasSession(userId);

        let status = 'ᴛɪᴅᴀᴋ ᴛᴇʀʜᴜʙᴜɴɢ';
        if (isActive) status = 'ᴛᴇʀʜᴜʙᴜɴɢ';
        else if (hasSession) status = 'ᴏғғʟɪɴᴇ';

        const caption = `<blockquote><b>👋🏻 ʜᴀʟᴏ <code>${userId}</code> <b>${status}</b>!

<b> 📚💎@${usernameBot} ᴀᴅᴀʟᴀʜ ʙᴏᴛ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇᴍʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ ᴅᴇɴɢᴀɴ ᴍᴜᴅᴀʜ</b>

🚀ʙᴏᴛ ɪɴɪ ᴅɪᴋᴇᴍʙᴀɴɢᴋᴀɴ ᴏʟᴇʜ @mogimek ᴊɪᴋᴀ ᴀᴅᴀ ᴋᴇsᴀʟᴀʜᴀɴ ᴀᴛᴀᴜᴘᴜɴ ᴍᴀsᴀʟᴀʜ ᴅᴍ ᴏᴡɴᴇʀ ʙᴏᴛ 𝙳𝙸 𝙰𝚃𝙰𝚂 

𝙲𝙰𝚁𝙰 𝚂𝙴𝚆𝙰 𝚄𝚂𝙴𝚁𝙱𝙾𝚃:
(ᴜꜱᴇʀʙᴏᴛ ɪɴɪ ᴀᴋᴀɴ ʙᴇʀᴋᴇᴍʙᴀɴɢ!! ᴊɪᴋᴀ ɪɴɢɪɴ ᴍᴇᴍʙᴇʟɪ ᴜꜱᴇʀʙᴏᴛ ᴀᴛᴀᴜ ʀᴇꜱᴇʟʟᴇʀ ʙɪꜱᴀ ᴄʜᴀᴛ ᴏᴡɴᴇʀ ᴜᴛᴀᴍᴀ ᴋᴀʀɴᴀ ᴜꜱᴇʀʙᴏᴛ ɪɴɪ ʙᴇʟᴜᴍ ꜱᴜᴘᴘᴏʀᴛ ᴛʀᴀɴꜱᴀᴋꜱɪ ᴏᴛᴏᴍᴀᴛɪꜱ!!!, ᴊɪᴋᴀ ᴀᴅᴀ ᴋᴇɴᴅᴀʟᴀ ꜰɪᴛᴜʀ ᴇʀᴏʀ ʙɪꜱᴀ ᴄʜᴀᴛ ᴏᴡɴᴇʀ ᴜᴛᴀᴍᴀ ᴀɢᴀʀ ᴅɪ ᴘᴇʀʙᴀɪᴋɪ)

ᴋʟɪᴋ ᴛᴏᴍʙᴏʟ ᴅɪʙᴀᴡᴀʜ ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ</b></blockquote>`;

        const buttons = [];
        
        if (isActive) {
            buttons.push([Markup.button.callback("⦪ sᴛᴀᴛᴜs ⦫", "status")]);
            buttons.push([Markup.button.callback("⦪ ʀᴇsᴛᴀʀᴛ ⦫", "restart"), Markup.button.callback("⦪ ᴅɪsᴄᴏɴɴᴇᴄᴛ ⦫", "disconnect")]);
        } else if (hasSession) {
            buttons.push([Markup.button.callback("⦪ ʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ ⳼", "connect_saved")]);
            buttons.push([Markup.button.callback("⦪ ʟᴏɢɪɴ ɴᴇᴡ ⦫", "connect_new")]);
        } else {
            buttons.push([Markup.button.callback("⦪ ʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ ⳼", "connect_new")]);
        }
        
        buttons.push([Markup.button.callback("⦪ ʙᴇʟɪ ᴘʀᴇᴍɪᴜᴍ ⦫", "beli_premium")]);
        buttons.push([Markup.button.callback("⦪ ᴄᴏᴍᴍᴀɴᴅ ⦫", "adduser"), Markup.button.url("⦪ ᴏᴡɴᴇʀ ⦫", "https://t.me/Suikatk")]);
        buttons.push([Markup.button.callback("⦪ ʜᴇʟᴘ ᴍᴇɴᴜ ⦫", "help_menu")]);
        buttons.push([Markup.button.callback("⦪ ʙᴀɴᴛᴜᴀɴ ⦫", "help")]);

        await ctx.replyWithPhoto(photo, { 
            caption, 
            parse_mode: "HTML", 
            reply_markup: Markup.inlineKeyboard(buttons).reply_markup 
        });
    } catch (error) {
        console.error("Error in /start command:", error);
        try {
            await ctx.reply("❌ Terjadi kesalahan internal. Silakan coba lagi.");
        } catch (e) {
            console.error("Failed to send error message:", e);
        }
    }
});

bot.action("beli_premium", async (ctx) => {
    try {
        const safeUser = validateUserData(ctx.from);
        const userId = safeUser.id.toString();
        let bulan = 1;
        const hargaPerBulan = 10;
        const total = bulan * hargaPerBulan;
        const noDana = config.dana;
        
        const OWNER_ID = config.ownerId;
        
        const caption = `<blockquote><b>💬 sɪʟᴀʜᴋᴀɴ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ</b>

<b>🎟️ ʜᴀʀɢᴀ ᴘᴇʀʙᴜʟᴀɴ: Rp ${hargaPerBulan}.000</b>

<b>💳 ᴍᴇᴛᴏᴅᴇ ᴘᴇᴍʙᴀʏᴀʀᴀɴ:</b>
<b>├ Qʀɪꜱ ᴀʟʟ ᴘᴀʏᴍᴇɴᴛ</b>
<b>🔖 ᴛᴏᴛᴀʟ ʜᴀʀɢᴀ: Rp ${total}.000</b>
<b>🗓️ ᴛᴏᴛᴀʟ ʙᴜʟᴀɴ: ${bulan}</b>

• DANA: <tg-spoiler>${noDana}</tg-spoiler>

ᴏᴡɴᴇʀ ʙᴏᴛ : <a href="tg://user?id=${OWNER_ID}">@${admin}</a>

<b>🛍 ᴋʟɪᴋ ᴛᴏᴍʙᴏʟ ᴋᴏɴꜰɪʀᴍᴀsɪ ᴜɴᴛᴜᴋ ᴋɪʀɪᴍ ʙᴜᴋᴛɪ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴀɴᴅᴀ</b></blockquote>`;

        const buttons = [
            [
                Markup.button.callback("-1", `kurang_${bulan}_${userId}`),
                Markup.button.callback(`ʙᴜʟᴀɴ: ${bulan}`, `bulan_display_${userId}`),
                Markup.button.callback("+1", `tambah_${bulan}_${userId}`)
            ],
            [Markup.button.callback("⦪ ᴋᴏɴꜰɪʀᴍᴀsɪ ⦫", `confirm_${bulan}_${userId}`)],
            [Markup.button.callback("⦪ ʙᴀᴛᴀʟᴋᴀɴ ⦫", `home`)]
        ];
        
        await ctx.editMessageCaption(caption, {
            parse_mode: "HTML",
            reply_markup: Markup.inlineKeyboard(buttons).reply_markup
        });
        
        await ctx.answerCbQuery("Silakan pilih jumlah bulan...");
    } catch (error) {
        console.error("Error in beli_premium action:", error);
        await ctx.answerCbQuery("❌ Terjadi kesalahan. Silakan coba lagi.");
    }
});

bot.action(/^tambah_(\d+)_(\d+)$/, async (ctx) => {
    try {
        let bulan = parseInt(ctx.match[1]) + 1;
        const userId = ctx.match[2];
        
        if (bulan > 12) {
            await ctx.answerCbQuery("Maksimal 12 bulan!");
            return;
        }
        
        const hargaPerBulan = 10;
        const total = bulan * hargaPerBulan;
        const noDana = config.dana;
        
        const OWNER_ID = config.ownerId || config.OWNER_ID || "7429086469";
        
        const caption = `<blockquote><b>💬 sɪʟᴀʜᴋᴀɴ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ</b>

<b>🎟️ ʜᴀʀɢᴀ ᴘᴇʀʙᴜʟᴀɴ: Rp ${hargaPerBulan}.000</b>

<b>💳 ᴍᴇᴛᴏᴅᴇ ᴘᴇᴍʙᴀʏᴀʀᴀɴ:</b>
<b>├ Qʀɪꜱ ᴀʟʟ ᴘᴀʏᴍᴇɴᴛ</b>
<b>🔖 ᴛᴏᴛᴀʟ ʜᴀʀɢᴀ: Rp ${total}.000</b>
<b>🗓️ ᴛᴏᴛᴀʟ ʙᴜʟᴀɴ: ${bulan}</b>

• DANA: <tg-spoiler>${noDana}</tg-spoiler>

ᴏᴡɴᴇʀ ʙᴏᴛ : <a href="tg://user?id=${OWNER_ID}">@${admin}</a>

<b>🛍 ᴋʟɪᴋ ᴛᴏᴍʙᴏʟ ᴋᴏɴꜰɪʀᴍᴀsɪ ᴜɴᴛᴜᴋ ᴋɪʀɪᴍ ʙᴜᴋᴛɪ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴀɴᴅᴀ</b></blockquote>`;
        
        const buttons = [
            [
                Markup.button.callback("-1", `kurang_${bulan}_${userId}`),
                Markup.button.callback(`ʙᴜʟᴀɴ: ${bulan}`, `bulan_display_${userId}`),
                Markup.button.callback("+1", `tambah_${bulan}_${userId}`)
            ],
            [Markup.button.callback("⦪ ᴋᴏɴꜰɪʀᴍᴀsɪ ⦫", `confirm_${bulan}_${userId}`)],
            [Markup.button.callback("⦪ ʙᴀᴛᴀʟᴋᴀɴ ⦫", `home`)]
        ];
        
        await ctx.editMessageCaption(caption, {
            parse_mode: "HTML",
            reply_markup: Markup.inlineKeyboard(buttons).reply_markup
        });
        
        await ctx.answerCbQuery(`Ditambah menjadi ${bulan} bulan (Total: Rp ${total}.000)`);
    } catch (error) {
        console.error("Error in tambah action:", error);
        await ctx.answerCbQuery("❌ Terjadi kesalahan. Silakan coba lagi.");
    }
});

bot.action(/^kurang_(\d+)_(\d+)$/, async (ctx) => {
    try {
        let bulan = parseInt(ctx.match[1]) - 1;
        const userId = ctx.match[2];
        
        if (bulan < 1) bulan = 1;
        
        const hargaPerBulan = 10;
        const total = bulan * hargaPerBulan;
        const noDana = config.dana;
        
        const OWNER_ID = config.ownerId || config.OWNER_ID || "7429086469";
        
        const caption = `<blockquote><b>💬 sɪʟᴀʜᴋᴀɴ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ</b>

<b>🎟️ ʜᴀʀɢᴀ ᴘᴇʀʙᴜʟᴀɴ: Rp ${hargaPerBulan}.000</b>

<b>💳 ᴍᴇᴛᴏᴅᴇ ᴘᴇᴍʙᴀʏᴀʀᴀɴ:</b>
<b>├ Qʀɪꜱ ᴀʟʟ ᴘᴀʏᴍᴇɴᴛ</b>
<b>🔖 ᴛᴏᴛᴀʟ ʜᴀʀɢᴀ: Rp ${total}.000</b>
<b>🗓️ ᴛᴏᴛᴀʟ ʙᴜʟᴀɴ: ${bulan}</b>

• DANA: <tg-spoiler>${noDana}</tg-spoiler>

ᴏᴡɴᴇʀ ʙᴏᴛ : <a href="tg://user?id=${OWNER_ID}">@${admin}</a>

<b>🛍 ᴋʟɪᴋ ᴛᴏᴍʙᴏʟ ᴋᴏɴꜰɪʀᴍᴀsɪ ᴜɴᴛᴜᴋ ᴋɪʀɪᴍ ʙᴜᴋᴛɪ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴀɴᴅᴀ</b></blockquote>`;
        
        const buttons = [
            [
                Markup.button.callback("-1", `kurang_${bulan}_${userId}`),
                Markup.button.callback(`ʙᴜʟᴀɴ: ${bulan}`, `bulan_display_${userId}`),
                Markup.button.callback("+1", `tambah_${bulan}_${userId}`)
            ],
            [Markup.button.callback("⦪ ᴋᴏɴꜰɪʀᴍᴀsɪ ⦫", `confirm_${bulan}_${userId}`)],
            [Markup.button.callback("⦪ ʙᴀᴛᴀʟᴋᴀɴ ⦫", `home`)]
        ];
        
        await ctx.editMessageCaption(caption, {
            parse_mode: "HTML",
            reply_markup: Markup.inlineKeyboard(buttons).reply_markup
        });
        
        await ctx.answerCbQuery(`Dikurangi menjadi ${bulan} bulan (Total: Rp ${total}.000)`);
    } catch (error) {
        console.error("Error in kurang action:", error);
        await ctx.answerCbQuery("❌ Terjadi kesalahan. Silakan coba lagi.");
    }
});

bot.action(/^confirm_(\d+)_(\d+)$/, async (ctx) => {
    try {
        const bulan = parseInt(ctx.match[1]);
        const userId = ctx.match[2];
        const hargaPerBulan = 10;
        const total = bulan * hargaPerBulan;
        
        markAsActivePurchase(userId, bulan);
        
        const caption = `<blockquote><b>✅ ᴘᴇʀᴍɪɴᴛᴀᴀɴ ᴅɪᴛᴇʀɪᴍᴀ!</b>

<b>ᴅᴇᴛᴀɪʟ ᴘᴇᴍʙᴇʟɪᴀɴ:</b>
➤ ᴘᴇᴍʙᴇʟɪ: <code>${userId}</code>
➤ ᴅᴜʀᴀsɪ: ${bulan} ʙᴜʟᴀɴ
➤ ʜᴀʀɢᴀ: Rp ${total}.000
➤ sᴛᴀᴛᴜs: ᴍᴇɴᴜɴɢɢᴜ ᴘᴇᴍʙᴀʏᴀʀᴀɴ

<b>📸 sɪʟᴀʜᴋᴀɴ ᴋɪʀɪᴍ ʙᴜᴋᴛɪ ᴘᴇᴍʙᴀʏᴀʀᴀɴ:</b>
1. ᴋɪʀɪᴍ ʙᴜᴋᴛɪ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴋᴇ ᴏᴡɴᴇʀ
2. ᴛᴜɴɢɢᴜ ᴋᴏɴғɪʀᴍᴀsɪ ᴅᴀʀɪ ᴏᴡɴᴇʀ
3. ᴏᴡɴᴇʀ ᴀᴋᴀɴ ᴍᴇᴍᴘʀᴏsᴇs ᴘᴇᴍʙᴇʀɪᴀɴ ᴀᴋsᴇs ᴘʀᴇᴍɪᴜᴍ

<b>⏰ ᴘʀᴏsᴇs: 1-5 ᴍᴇɴɪᴛ sᴇᴛᴇʟᴀʜ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴛᴇʀᴠᴇʀɪғɪᴋᴀsɪ</b></blockquote>`;

        const buttons = [
            [Markup.button.callback("⦪ ᴋᴇᴍʙᴀʟɪ ⦫", `home`)]
        ];
        
        await ctx.editMessageCaption(caption, {
            parse_mode: "HTML",
            reply_markup: Markup.inlineKeyboard(buttons).reply_markup
        });
        
        await ctx.answerCbQuery("Silakan kirim bukti pembayaran ke owner!");
        
    } catch (error) {
        console.error("Error in confirm action:", error);
        await ctx.answerCbQuery("❌ Terjadi kesalahan. Silakan coba lagi.");
    }
});

bot.action(/^owner_confirm_(\d+)_(\d+)$/, async (ctx) => {
    try {
        const userId = ctx.match[1];
        const bulan = parseInt(ctx.match[2]);
        const hargaPerBulan = 10;
        const total = bulan * hargaPerBulan;
        
        const OWNER_ID = config.ownerId || config.OWNER_ID || "7429086469";
        
        if (ctx.from.id.toString() !== OWNER_ID) {
            await ctx.answerCbQuery("❌ ʜᴀɴʏa ᴏᴡɴᴇʀ ʏᴀɴɢ ʙɪsᴀ ᴘᴀᴋᴀɪ ғɪᴛᴜʀ ɪɴɪ!");
            return;
        }
        
        const premiumAdded = await addPremiumUser(userId, bulan, OWNER_ID);
        
        if (!premiumAdded) {
            await ctx.answerCbQuery("❌ Gagal menambahkan premium!");
            
            try {
                await ctx.telegram.sendMessage(
                    OWNER_ID,
                    `<blockquote><b>⚠️ ɢᴀɢᴀʟ ᴍᴇɴᴀᴍʙᴀʜᴋᴀɴ ᴘʀᴇᴍɪᴜᴍ</b

• ᴜsᴇʀ: <code>${userId}</code>
• ʙᴜʟᴀɴ: ${bulan}
• ᴇʀʀᴏʀ: sɪsᴛᴇᴍ ᴘʀᴇᴍɪᴜᴍ ᴛɪᴅᴀᴋ ᴛᴇʀsᴇᴅɪᴀ

sɪʟᴀʜᴋᴀɴ ᴛᴀᴍʙᴀʜᴋᴀɴ sᴇᴄᴀʀᴀ ᴍᴀɴᴜᴀʟ ᴅᴇɴɢᴀɴ: <code>/prem ${userId} ${bulan}</code></blockquote>`,
                    { parse_mode: "HTML" }
                );
            } catch (err) {
                console.error("Gagal mengirim error notifikasi:", err);
            }
            
            return;
        }
        
        const now = new Date();
        const expiredDate = new Date(now);
        expiredDate.setMonth(now.getMonth() + bulan);
        
        await ctx.editMessageText(
            `<blockquote><b>ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴅɪᴋᴏɴғɪʀᴍᴀsɪ ᴏᴡɴᴇʀ</b>

• <b>ᴜsᴇʀ ɪᴅ:</b> <code>${userId}</code>
• <b>ᴅᴜʀᴀsɪ:</b> ${bulan} bulan
• <b>ᴛᴏᴛᴀʟ ʜᴀʀɢᴀ:</b> Rp ${total}.000
• <b>ᴇxᴘɪʀᴇᴅ:</b> ${expiredDate.toLocaleDateString('id-ID')}
• <b>sᴛᴀᴛᴜs:</b> ʙᴇʀʜᴀsɪʟ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴘᴇᴍʙᴀʏᴀʀᴀɴ
• <b>ᴡᴀᴋᴛᴜ:</b> ${now.toLocaleString('id-ID')}

<i>✅ ᴘʀᴇᴍɪᴜᴍ ᴛᴇʟᴀʜ ᴅɪᴀᴋᴛɪғᴋᴀɴ ᴜɴᴛᴜᴋ ᴜsᴇʀ ᴛᴇʀsᴇʙᴜᴛ.</i></blockquote>`,
            { parse_mode: "HTML" }
        );
        
        completePurchase(userId);
        
        try {
            await ctx.telegram.sendMessage(
                userId,
                `<blockquote><b>ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴀɴᴅᴀ ᴛᴇʟᴀʜ ᴅɪᴋᴏɴғɪʀᴍᴀsɪ ᴏʟᴇʜ ᴏᴡɴᴇʀ!</b>

<b>sᴛᴀᴛᴜs:</b> ʙᴇʀʜᴀsɪʟ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴘᴇᴍʙᴀʏᴀʀᴀɴ
<b>ᴅᴜʀᴀsɪ:</b> ${bulan} bulan
<b>ᴛᴏᴛᴀʟ:</b> Rp ${total}.000
<b>ᴀᴋᴛɪғ sᴀᴍᴘᴀɪ:</b> ${expiredDate.toLocaleDateString('id-ID')}

<i>✅ ᴘʀᴇᴍɪᴜᴍ ᴀɴᴅᴀ ᴛᴇʟᴀʜ ᴀᴋᴛɪғ. ᴛᴇʀɪᴍᴀ ᴋᴀsɪʜ!</i></blockquote>`,
                { parse_mode: "HTML" }
            );
        } catch (userError) {
        }
        
        await ctx.answerCbQuery("✅ Pembayaran dikonfirmasi dan premium ditambahkan!");
        
    } catch (error) {
        console.error("Error in owner_confirm action:", error);
        await ctx.answerCbQuery("❌ Gagal mengkonfirmasi!");
    }
});

bot.action(/^owner_reject_(\d+)$/, async (ctx) => {
    try {
        const userId = ctx.match[1];
        
        const OWNER_ID = config.ownerId || config.OWNER_ID || "7429086469";
        
        if (ctx.from.id.toString() !== OWNER_ID) {
            await ctx.answerCbQuery("❌ ʜᴀɴʏᴀ ᴏᴡɴᴇʀ ʏᴀɴɢ ʙɪsᴀ ᴘᴀᴋᴀɪ ғɪᴛᴜʀ ɪɴɪ!");
            return;
        }
        
        await ctx.editMessageText(
            `<blockquote><b>❌ ᴘᴇʀᴍɪɴᴛᴀᴀɴ ᴅɪᴛᴏʟᴀᴋ ᴏʟᴇʜ ᴏᴡɴᴇʀ</b>
• <b>ᴜsᴇʀ ɪᴅ:</b> <code>${userId}</code>
• <b>sᴛᴀᴛᴜs:</b> ᴅɪᴛᴏʟᴀᴋ
• <b>ᴡᴀᴋᴛᴜ:</b> ${new Date().toLocaleString('id-ID')}

<i>ᴘᴇʀᴍɪɴᴛᴀᴀɴ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀ ɪɴɪ ᴛᴇʟᴀʜ ᴅɪᴛᴏʟᴀᴋ.</i></blockquote>`,
            { parse_mode: "HTML" }
        );
        
        completePurchase(userId);
        
        try {
            await ctx.telegram.sendMessage(
                userId,
                `<b>❌ ᴘᴇʀᴍɪɴᴛᴀᴀɴ ᴘʀᴇᴍɪᴜᴍ ᴀɴᴅᴀ ᴅɪᴛᴏʟᴀᴋ</b>

<b>ᴀʟᴀsᴀɴ:</b> ʙᴜᴋᴛɪ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴛɪᴅᴀᴋ ᴠᴀʟɪᴅ/ᴛɪᴅᴀᴋ ᴅɪᴛᴇʀɪᴍᴀ.

sɪʟᴀʜᴋᴀɴ ʜᴜʙᴜɴɢɪ ᴏᴡɴᴇʀ ᴊɪᴋᴀ ᴀᴅᴀ ᴋᴇsᴀʟᴀʜᴀɴ: @${config.ownerUsername || "Suikatk"}`,
                { parse_mode: "HTML" }
            );
        } catch (userError) {
            console.error("Gagal mengirim ke user:", userError);
        }
        
        await ctx.answerCbQuery("❌ Permintaan ditolak!");
        
    } catch (error) {
        console.error("Error in owner_reject action:", error);
        await ctx.answerCbQuery("❌ Gagal menolak permintaan!");
    }
});

    bot.action("connect_saved", async (ctx) => {
        const userId = ctx.from.id.toString();
        await ctx.answerCbQuery("Menghubungkan...").catch(() => { });
        await ctx.editMessageCaption("<blockquote>⏳ <b>Menghubungkan...</b></blockquote>", { parse_mode: "HTML" }).catch(() => { });

        const result = await clientManager.connectSession(userId);
        if (result.success) {
            setupEventHandlers(userId, result.client);
            await ctx.editMessageCaption(`<blockquote>✅ <b>Terhubung!</b>\n\n👤 ${result.user.firstName || ''}\n📱 @${result.user.username || 'N/A'}</blockquote>`, {
                parse_mode: "HTML",
                reply_markup: Markup.inlineKeyboard([[Markup.button.callback("⦪ ᴋᴇᴍʙᴀʟɪ ⦫", "home")]]).reply_markup
            });
        } else {
            await ctx.editMessageCaption(`<blockquote>❌ <b>Gagal:</b> ${result.error}</blockquote>`, {
                parse_mode: "HTML",
                reply_markup: Markup.inlineKeyboard([[Markup.button.callback("🔄 LOGIN BARU", "connect_new")], [Markup.button.callback("⦪ ᴋᴇᴍʙᴀʟɪ ⦫", "home")]]).reply_markup
            });
        }
    });

    bot.action("connect_new", async (ctx) => {
    try {
        const userId = ctx.from.id.toString();
        await ctx.answerCbQuery().catch(() => { });

        if (!isUserPremium(userId) && !isUserSeller(userId) && !isUserOwner(userId)) {
            const premiumInfo = getPremiumInfo(userId);
            let message = "";
            
            if (premiumInfo) {
                message = `<blockquote>❌ <b>ᴘʀᴇᴍɪᴜᴍ sᴜᴅᴀʜ ʜᴀʙɪꜱ!</b>

• <b>ᴜsᴇʀ ɪᴅ:</b> <code>${userId}</code>
• <b>ᴇxᴘɪʀᴇᴅ:</b> ${premiumInfo.expired.toLocaleDateString('id-ID')}
• <b>ᴅᴜʀᴀsɪ:</b> ${premiumInfo.daysLeft || 0} ʜᴀʀɪ ʟᴀʟᴜ

<b>sɪʟᴀʜᴋᴀɴ ʙᴇʟɪ ᴘʀᴇᴍɪᴜᴍ ʟᴀɢɪ ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ</b></blockquote>`;
            } else {
                message = `<blockquote><b>❌ ᴍᴀᴀꜰ ᴀɴᴅᴀ ʙᴇʟᴜᴍ ᴍᴇᴍʙᴇʟɪ ᴜꜱᴇʀʙᴏᴛ, ꜱɪʟᴀᴋᴀɴ ᴍᴇᴍʙᴇʟɪ ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ</b></blockquote>`;
            }
            
            const buttons = [
                [Markup.button.callback("⦪ ʙᴇʟɪ ᴘʀᴇᴍɪᴜᴍ ⦫", `beli_premium`)],
                [Markup.button.callback("⦪ ᴋᴇᴍʙᴀʟɪ ⦫", `home`)]
            ];
            
            return await ctx.editMessageCaption(message, {
                parse_mode: "HTML",
                reply_markup: Markup.inlineKeyboard(buttons).reply_markup
            });
        }

        if (!ctx.session) ctx.session = {};
        ctx.session.step = "WAIT_PHONE";
        
        await ctx.editMessageCaption(`<blockquote><b>✅ ᴀɴᴅᴀ sᴜᴅᴀʜ ᴘʀᴇᴍɪᴜᴍ!</b>

<b>sɪʟᴀʜᴋᴀɴ ᴍᴀsᴜᴋᴋᴀɴ ɴᴏᴍᴏʀ ᴛᴇʟᴇᴘᴏɴ ᴛᴇʟᴇɢʀᴀᴍ ᴀɴᴅᴀ ᴅᴇɴɢᴀɴ ꜰᴏʀᴍᴀᴛ ᴋᴏᴅᴇ ɴᴇɢᴀʀᴀ:</b>

ᴄᴏɴᴛᴏʜ: ﹢𝟼𝟸𝟾𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿𝟶

<b>ɢᴜɴᴀᴋᴀɴ /cancel ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴀᴛᴀʟᴋᴀɴ ᴘʀᴏsᴇs</b></blockquote>`, { 
            parse_mode: "HTML" 
        });
        
    } catch (error) {
        console.error("Error in connect_new action:", error);
        await ctx.answerCbQuery("❌ Terjadi kesalahan. Silakan coba lagi.");
    }
});

    bot.action("status", async (ctx) => {
        const userId = ctx.from.id.toString();
        await ctx.answerCbQuery().catch(() => { });

        const data = sessionManager.loadSession(userId);
        const isActive = clientManager.isActive(userId);
        const prem = getPremiumInfo(userId);
        const uptime = formatDuration(Date.now() - startTime);

        let text = `<blockquote><b>sᴛᴀᴛᴜs</b>\n\n🔌 ${isActive ? 'ᴏɴʟɪɴᴇ' : 'ᴏғғʟɪɴᴇ'}\n`;
        if (data) text += `${data.phone || 'N/A'}\n👤 ${data.firstName || ''}\n`;
        text += `ᴜᴘᴛɪᴍᴇ: ${uptime}\n\n`;
        
        if (isUserOwner(userId)) {
            text += `<b>ᴏᴡɴᴇʀ</b>\n`;
        } else if (isUserSeller(userId)) {
            text += `<b>sᴇʟʟᴇʀ</b>\n`;
        } else if (isUserAdmin(userId)) {
            text += `<b>ᴀᴅᴍɪɴ</b>\n`;
        }
        
        if (prem) {
            text += `ᴘʀᴇᴍɪᴜᴍ: ${prem.daysLeft} ʜᴀʀɪ ᴛᴇʀsɪsᴀ\n`;
            text += `ᴇxᴘɪʀᴇᴅ: ${prem.expired.toLocaleDateString('id-ID')}`;
        } else {
            text += `ɴᴏ ᴘʀᴇᴍɪᴜᴍ`;
        }
        
        if (isUserUltra(userId)) {
            text += `\nsᴜᴘᴇʀ ᴜʟᴛʀᴀ`;
        }
        
        text += `</blockquote>`;

        await ctx.editMessageCaption(text, { parse_mode: "HTML", reply_markup: Markup.inlineKeyboard([[Markup.button.callback("⦪ ᴋᴇᴍʙᴀʟɪ ⦫", "home")]]).reply_markup });
    });

    bot.action("restart", async (ctx) => {
        const userId = ctx.from.id.toString();
        await ctx.answerCbQuery("Restarting...").catch(() => { });
        await ctx.editMessageCaption("<blockquote>🔄 <b>Restarting...</b></blockquote>", { parse_mode: "HTML" });

        await clientManager.disconnectClient(userId);
        const result = await clientManager.connectSession(userId);

        if (result.success) {
            setupEventHandlers(userId, result.client);
            await ctx.editMessageCaption("<blockquote>✅ <b>Restart berhasil!</b></blockquote>", { parse_mode: "HTML", reply_markup: Markup.inlineKeyboard([[Markup.button.callback("⦪ ᴋᴇᴍʙᴀʟɪ ⦫", "home")]]).reply_markup });
        } else {
            await ctx.editMessageCaption(`<blockquote>❌ <b>Gagal:</b> ${result.error}</blockquote>`, { parse_mode: "HTML", reply_markup: Markup.inlineKeyboard([[Markup.button.callback("⦪ ᴋᴇᴍʙᴀʟɪ ⦫", "home")]]).reply_markup });
        }
    });

    bot.action("disconnect", async (ctx) => {
        await ctx.answerCbQuery().catch(() => { });
        await ctx.editMessageCaption("<blockquote>⚠️ <b>Yakin disconnect?</b>\n\nSession akan dihapus.</blockquote>", {
            parse_mode: "HTML",
            reply_markup: Markup.inlineKeyboard([[Markup.button.callback("✅ YA", "confirm_disconnect")], [Markup.button.callback("❌ BATAL", "home")]]).reply_markup
        });
    });

    bot.action("confirm_disconnect", async (ctx) => {
        const userId = ctx.from.id.toString();
        await ctx.answerCbQuery("Disconnecting...").catch(() => { });
        await clientManager.disconnectClient(userId);
        sessionManager.deleteSession(userId);
        await ctx.editMessageCaption("<blockquote>✅ <b>Disconnected!</b></blockquote>", { parse_mode: "HTML", reply_markup: Markup.inlineKeyboard([[Markup.button.callback("⦪ ᴋᴇᴍʙᴀʟɪ ⦫", "home")]]).reply_markup });
    });

    bot.action("home", async (ctx) => {
        const userId = ctx.from.id.toString();
        await ctx.answerCbQuery().catch(() => { });

        const isActive = clientManager.isActive(userId);
        const hasSession = sessionManager.hasSession(userId);

        let status = 'ᴛɪᴅᴀᴋ ᴛᴇʀʜᴜʙᴜɴɢ';
        if (isActive) status = 'ᴛᴇʀʜᴜʙᴜɴɢ';
        else if (hasSession) status = 'ᴏғғʟɪɴᴇ';

        const caption = `<blockquote><b>👋🏻 ʜᴀʟᴏ <code>${userId}</code> <b>${status}</b>!

<b> 📚💎@${usernameBot} ᴀᴅᴀʟᴀʜ ʙᴏᴛ ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇᴍʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ ᴅᴇɴɢᴀɴ ᴍᴜᴅᴀʜ</b>

🚀ʙᴏᴛ ɪɴɪ ᴅɪᴋᴇᴍʙᴀɴɢᴋᴀɴ ᴏʟᴇʜ @mogimek ᴊɪᴋᴀ ᴀᴅᴀ ᴋᴇsᴀʟᴀʜᴀɴ ᴀᴛᴀᴜᴘᴜɴ ᴍᴀsᴀʟᴀʜ ᴅᴍ ᴏᴡɴᴇʀ ʙᴏᴛ 𝙳𝙸 𝙰𝚃𝙰𝚂 


𝙲𝙰𝚁𝙰 𝚂𝙴𝚆𝙰 𝚄𝚂𝙴𝚁𝙱𝙾𝚃:
(ᴜꜱᴇʀʙᴏᴛ ɪɴɪ ᴀᴋᴀɴ ʙᴇʀᴋᴇᴍʙᴀɴɢ!! ᴊɪᴋᴀ ɪɴɢɪɴ ᴍᴇᴍʙᴇʟɪ ᴜꜱᴇʀʙᴏᴛ ᴀᴛᴀᴜ ʀᴇꜱᴇʟʟᴇʀ ʙɪꜱᴀ ᴄʜᴀᴛ ᴏᴡɴᴇʀ ᴜᴛᴀᴍᴀ ᴋᴀʀɴᴀ ᴜꜱᴇʀʙᴏᴛ ɪɴɪ ʙᴇʟᴜᴍ ꜱᴜᴘᴘᴏʀᴛ ᴛʀᴀɴꜱᴀᴋꜱɪ ᴏᴛᴏᴍᴀᴛɪꜱ!!!, ᴊɪᴋᴀ ᴀᴅᴀ ᴋᴇɴᴅᴀʟᴀ ꜰɪᴛᴜʀ ᴇʀᴏʀ ʙɪꜱᴀ ᴄʜᴀᴛ ᴏᴡɴᴇʀ ᴜᴛᴀᴍᴀ ᴀɢᴀʀ ᴅɪ ᴘᴇʀʙᴀɪᴋɪ)

ᴋʟɪᴋ ᴛᴏᴍʙᴏʟ ᴅɪʙᴀᴡᴀʜ ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ</b></blockquote>`;

        const buttons = [];
        if (isActive) {
            buttons.push([Markup.button.callback("⦪ sᴛᴀᴛᴜs ⦫", "status")]);
            buttons.push([Markup.button.callback("⦪ ʀᴇsᴛᴀʀᴛ ⦫", "restart"), Markup.button.callback("⦪ ᴅɪsᴄᴏɴɴᴇᴄᴛ ⦫", "disconnect")]);
        } else if (hasSession) {
            buttons.push([Markup.button.callback("⦪ ʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ ⳼", "connect_saved")]);
            buttons.push([Markup.button.callback("⦪ ʟᴏɢɪɴ ɴᴇᴡ ⦫", "connect_new")]);
        } else {
            buttons.push([Markup.button.callback("⦪ ʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ ⳼", "connect_new")]);
        }
        
        buttons.push([Markup.button.callback("⦪ ʙᴇʟɪ ᴘʀᴇᴍɪᴜᴍ ⦫", "beli_premium")]);
        buttons.push([Markup.button.callback("⦪ ᴄᴏᴍᴍᴀɴᴅ ⦫", "adduser"), Markup.button.url("⦪ ᴏᴡɴᴇʀ ⦫", "https://t.me/Suikatk")]);
        buttons.push([Markup.button.callback("⦪ ʜᴇʟᴘ ᴍᴇɴᴜ ⦫", "help_menu")]);
        buttons.push([Markup.button.callback("⦪ ʙᴀɴᴛᴜᴀɴ ⦫", "help")]);

        await ctx.editMessageCaption(caption, { parse_mode: "HTML", reply_markup: Markup.inlineKeyboard(buttons).reply_markup });
    });

    bot.action("help", async (ctx) => {
        await ctx.answerCbQuery().catch(() => { });
        const text = `<blockquote><b>📋 BANTUAN</b>\n\n1. Klik Connect Userbot\n2. Masukkan nomor HP\n3. Masukkan OTP\n4. Jika ada 2FA, masukkan password\n5. Selesai!\n\n<b>Prefix:</b> <code>${prefix}</code>\n<b>Commands:</b> ${features.length}</blockquote>`;
        await ctx.editMessageCaption(text, { parse_mode: "HTML", reply_markup: Markup.inlineKeyboard([[Markup.button.callback("⦪ ᴋᴇᴍʙᴀʟɪ ⦫", "home")]]).reply_markup });
    });
    
    bot.action("adduser", async (ctx) => {
        await ctx.answerCbQuery().catch(() => { });
        const text = `<blockquote>• /prem [id_user] [durasi] -> Menambahkan User Premium\n• /unprem [id_user] -> Menghapus User Dari Premium\n• /getprem -> List Data User Premium\n• /addseller [id_user] -> Menambahkan Reseller\n• /unseller [id_user] -> Menghapus Reseller\n•/getseller -> List Data Reseller\n• /addadmin [id_user] -> Menambahkan User Admin\n• /unadmin [id_user] -> Menghapus User Dari Admin\n• /getadmin -> List Data User Admin\n• /addultra\n• /rmultra\n• /time [id_user] -> Menambahkan Durasi</blockquote>`;
        await ctx.editMessageCaption(text, { parse_mode: "HTML", reply_markup: Markup.inlineKeyboard([[Markup.button.callback("⦪ ᴋᴇᴍʙᴀʟɪ ⦫", "home")]]).reply_markup });
    });

    bot.command("cancel", async (ctx) => {
        const userId = ctx.from.id.toString();
        if (ctx.session) ctx.session.step = null;
        await clientManager.cancelLogin(userId);
        await ctx.reply("<blockquote>❌ <b>Dibatalkan</b></blockquote>", { parse_mode: "HTML" });
    });
    
    bot.on('photo', async (ctx) => {
    try {
        const userId = ctx.from.id.toString();
        const OWNER_ID = config.ownerId || config.OWNER_ID || "7429086469";
        
        if (!isActivePurchase(userId)) {
            return;
        }
        
        const purchaseData = activePurchases.get(userId);
        const bulan = purchaseData?.bulan || 1;
        const hargaPerBulan = 10;
        const total = bulan * hargaPerBulan;
        
        await ctx.forwardMessage(OWNER_ID);
        
        const buyerName = ctx.from.first_name || "User";
        const buyerUsername = ctx.from.username ? `@${ctx.from.username}` : "Tidak ada username";
        
        const ownerMessage = `<blockquote><b>📸 ʙᴜᴋᴛɪ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴅɪᴛᴇʀɪᴍᴀ</b>

• <b>ᴅᴀʀɪ:</b> ${buyerName}
• <b>ᴜsᴇʀɴᴀᴍᴇ:</b> ${buyerUsername}
• <b>ɪᴅ:</b> <code>${userId}</code>
• <b>ᴅᴜʀᴀsɪ:</b> ${bulan} bulan
• <b>ᴛᴏᴛᴀʟ ʜᴀʀɢᴀ:</b> Rp ${total}.000
• <b>ᴡᴀᴋᴛᴜ:</b> ${new Date().toLocaleString('id-ID')}

<i>ғᴏᴛᴏ ᴅɪᴀᴛᴀs ᴀᴅᴀʟᴀʜ ʙᴜᴋᴛɪ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴅᴀʀɪ ᴜsᴇʀ.</i></blockquote>`;
        
        await ctx.telegram.sendMessage(
            OWNER_ID,
            ownerMessage,
            {
                parse_mode: "HTML",
                reply_markup: Markup.inlineKeyboard([
                    [Markup.button.callback("ᴋᴏɴғɪʀᴍᴀsɪ", `owner_confirm_${userId}_${bulan}`)],
                    [Markup.button.callback("ᴛᴏʟᴀᴋ", `owner_reject_${userId}`)]
                ]).reply_markup
            }
        );
        
        await ctx.reply(
            `<blockquote><b>✅ ʙᴜᴋᴛɪ ᴘᴇᴍʙᴀʏᴀʀᴀɴ ᴛᴇʟᴀʜ ᴅɪᴛᴇʀɪᴍᴀ!</b>

ᴏᴡɴᴇʀ ᴀᴋᴀɴ ᴍᴇɴɢᴋᴏɴғɪʀᴍᴀsɪ ᴘᴇᴍʙᴀʏᴀʀᴀʙ ᴀɴᴅᴀ ᴅᴀʟᴀᴍ 1-5 ᴍᴇɴɪᴛ

ᴀɴᴅᴀ ᴀᴋᴀɴ ᴍᴇɴᴅᴀᴘᴀᴛ ɴᴏᴛɪғɪᴋᴀsɪ sᴇᴛᴇʟᴀʜ ᴅɪᴋᴏɴғɪʀᴍᴀsɪ.</blockquote>`,
            { parse_mode: "HTML" }
        );
        
    } catch (error) {
        console.error("Error in photo handler:", error);
    }
});

    bot.on("message", async (ctx) => {
        if (!ctx.message.text || !ctx.session?.step) return;

        const userId = ctx.from.id.toString();
        const text = ctx.message.text.trim();

        if (ctx.session.step === "WAIT_PHONE") {
            if (!text.startsWith('+')) return await ctx.reply("<blockquote>❌ Format: <code>+628xxx</code></blockquote>", { parse_mode: "HTML" });

            const msg = await ctx.reply("<blockquote>⏳ <b>Mengirim OTP...</b></blockquote>", { parse_mode: "HTML" });
            const result = await clientManager.startLogin(userId, text);

            if (result.success) {
                ctx.session.step = "WAIT_OTP";
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, "<blockquote><b>sɪʟᴀᴋᴀɴ ᴘᴇʀɪᴋsᴀ ᴋᴏᴅᴇ ᴏᴛᴘ ᴅᴀʀɪ ᴀᴋᴜɴ ʀᴇꜱᴍɪ ᴛᴇʟᴇɢʀᴀᴍ. ᴋɪʀɪᴍ ᴋᴏᴅᴇ ᴏᴛᴘ ᴋᴇ sɪɴɪ sᴇᴛᴇʟᴀʜ ᴍᴇᴍʙᴀᴄᴀ ꜰᴏʀᴍᴀᴛ ᴅɪ ʙᴀᴡᴀʜ ɪɴɪ.</b>\n\nᴊɪᴋᴀ ᴋᴏᴅᴇ ᴏᴛᴘ ᴀᴅᴀʟᴀʜ 12345 ᴛᴏʟᴏɴɢ <b>[ ᴛᴀᴍʙᴀʜᴋᴀɴ sᴘᴀsɪ ]</b> ᴋɪʀɪᴍᴋᴀɴ sᴇᴘᴇʀᴛɪ ɪɴɪ 1 2 3 4 5\n<b>ɢᴜɴᴀᴋᴀɴ /cancel ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴀᴛᴀʟᴋᴀɴ ᴘʀᴏsᴇs ᴍᴇᴍʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ</b></blockquote>", { parse_mode: "HTML" });
            } else {
                ctx.session.step = null;
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `<blockquote>❌ <b>Gagal:</b> ${result.error}</blockquote>`, { parse_mode: "HTML" });
            }
            return;
        }

        if (ctx.session.step === "WAIT_OTP") {
            const msg = await ctx.reply("<blockquote>⏳ <b>Verifikasi...</b></blockquote>", { parse_mode: "HTML" });
            const result = await clientManager.verifyOTP(userId, text.replace(/\s/g, ''));

            if (result.success) {
                ctx.session.step = null;
                const client = clientManager.getClient(userId);
                if (client) setupEventHandlers(userId, client.client);
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `<blockquote>✅ <b>Berhasil!</b>\n\n👤 ${result.user.firstName || ''}\n📱 @${result.user.username || 'N/A'}</blockquote>`, { parse_mode: "HTML" });
            } else if (result.need2FA) {
                ctx.session.step = "WAIT_2FA";
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, "<blockquote>ᴀᴋᴜɴ ᴀɴᴅᴀ ᴛᴇʟᴀʜ ᴍᴇɴɢᴀᴋᴛɪꜰᴋᴀɴ ᴠᴇʀɪꜰɪᴋᴀsɪ ᴅᴜᴀ ʟᴀɴɢᴋᴀʜ. sɪʟᴀʜᴋᴀɴ ᴋɪʀɪᴍᴋᴀɴ ᴘᴀssᴡᴏʀᴅɴʏᴀ.\n\n<b>ɢᴜɴᴀᴋᴀɴ /cancel ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴀᴛᴀʟᴋᴀɴ ᴘʀᴏsᴇs ᴍᴇᴍʙᴜᴀᴛ ᴜsᴇʀʙᴏᴛ</b></blockquote>", { parse_mode: "HTML" });
            } else {
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `<blockquote>❌ <b>OTP salah:</b> ${result.error}</blockquote>`, { parse_mode: "HTML" });
            }
            return;
        }

        if (ctx.session.step === "WAIT_2FA") {
            const msg = await ctx.reply("<blockquote>⏳ <b>Verifikasi 2FA...</b></blockquote>", { parse_mode: "HTML" });
            const result = await clientManager.verify2FA(userId, text);

            if (result.success) {
                ctx.session.step = null;
                const client = clientManager.getClient(userId);
                if (client) setupEventHandlers(userId, client.client);
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `<blockquote>✅ <b>Berhasil!</b>\n\n👤 ${result.user.firstName || ''}</blockquote>`, { parse_mode: "HTML" });
            } else {
                await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, `<blockquote>❌ <b>Password salah:</b> ${result.error}</blockquote>`, { parse_mode: "HTML" });
            }
            return;
        }
    });
    
    bot.action("help_menu", async (ctx) => {
    try {
        const categories = Object.keys(groupedFeatures);
        const helpText = `<blockquote><b>✮ ᴍᴇɴᴜ ɪɴʟɪɴᴇ</b>\n` +
            ` • ᴘʀᴇғɪx: ${prefix}\n` +
            ` • ᴘʟᴜɢɪɴs: ${features.length}\n` +
            ` • ᴄᴀᴛᴇɢᴏʀʏ: ${categories.length}\n` +
            ` • ᴏᴡɴᴇʀ: @${admin}\n` +
            ` • ᴍʏ ᴜʙᴏᴛ: @${usernameBot}</blockquote>`;

        if (ctx.callbackQuery.message && ctx.callbackQuery.message.photo) {
            await ctx.editMessageCaption(helpText, {
                parse_mode: 'HTML',
                reply_markup: createCategoryButtons(0).reply_markup
            });
        } else {
            await ctx.replyWithPhoto(
                'https://raw.githubusercontent.com/ObyMoods/killtoken/main/photo_1762949114296.jpg',
                {
                    caption: helpText,
                    parse_mode: 'HTML',
                    reply_markup: createCategoryButtons(0).reply_markup
                }
            );
        }
        
        await ctx.answerCbQuery("Menu ditampilkan ✅");
        
    } catch (error) {
        console.error("Error showing menu:", error);
        await ctx.answerCbQuery("Error: " + error.message);
    }
});

    bot.on('inline_query', async (ctx) => {
    try {
        const query = ctx.inlineQuery.query;
        console.log(`[INLINE BOT] Query received: "${query}"`);

        if (query === 'help_menu' || query === '') {
            const categories = Object.keys(groupedFeatures);
            const helpText = `<blockquote><b>✮ ᴍᴇɴᴜ ɪɴʟɪɴᴇ</b>\n` +
            ` • ᴘʀᴇғɪx: ${prefix}\n` +
            ` • ᴘʟᴜɢɪɴs: ${features.length}\n` +
            ` • ᴄᴀᴛᴇɢᴏʀʏ: ${categories.length}\n` +
            ` • ᴏᴡɴᴇʀ: @${admin}\n` +
            ` • ᴍʏ ᴜʙᴏᴛ: @${usernameBot}</blockquote>`;

            await ctx.answerInlineQuery([
                {
                    type: 'photo',
                    id: '1',
                    photo_url: 'https://gangalink.vercel.app/i/s2nsly0x.jpg',
                    thumb_url: 'https://gangalink.vercel.app/i/s2nsly0x.jpg',
                    caption: helpText,
                    parse_mode: 'HTML',
                    reply_markup: createCategoryButtons(0).reply_markup
                },
                {
                    type: 'article',
                    id: '2',
                    title: '✮ UBOT DOYANG Menu (Tanpa Foto)',
                    description: `${features.length} plugins tersedia`,
                    input_message_content: { message_text: helpText, parse_mode: 'HTML' },
                    reply_markup: createCategoryButtons(0).reply_markup
                }
            ], { cache_time: 0, is_personal: true });
            
        } else if (query.startsWith('button_')) {
            const buttonId = query;
            
            if (global.buttonData && global.buttonData[buttonId]) {
                const buttonData = global.buttonData[buttonId];
                
                await ctx.answerInlineQuery([
                    {
                        type: 'article',
                        id: buttonId,
                        title: 'Button Message',
                        description: `Message with ${buttonData.buttons.flat().length} buttons`,
                        input_message_content: {
                            message_text: buttonData.text,
                            parse_mode: 'HTML'
                        },
                        reply_markup: {
                            inline_keyboard: buttonData.buttons
                        }
                    }
                ], { 
                    cache_time: 1,
                    is_personal: true 
                });
                
                setTimeout(() => {
                    if (global.buttonData[buttonId]) {
                        delete global.buttonData[buttonId];
                    }
                }, 30000);
            } else {
                await ctx.answerInlineQuery([
                    {
                        type: 'article',
                        id: 'default_button',
                        title: 'Button Creator',
                        description: 'Create custom buttons with URLs',
                        input_message_content: {
                            message_text: '⚠️ Button data not found or expired. Please try again.',
                            parse_mode: 'HTML'
                        }
                    }
                ], { cache_time: 1 });
            }
        } else if (query.startsWith('catur_')) {
            const parts = query.split('_');
            
            if (parts.length >= 2) {
                const opponentUsername = parts[1];
                
                const messageText = `<blockquote><b>♟️ ɪɴᴠɪᴛᴀsɪ ɢᴀᴍᴇ ᴄᴀᴛᴜʀ</b>

• ᴘᴇᴍᴀɪɴ 𝟷: <a href="tg://user?id=${ctx.inlineQuery.from.id}">${ctx.inlineQuery.from.first_name || 'Anda'}</a>
• ᴘᴇᴍᴀɪɴ 𝟸: @${opponentUsername}

ᴋʟɪᴋ ᴛᴏᴍʙᴏʟ ᴅɪ ʙᴀᴡᴀʜ ᴜɴᴛᴜᴋ ʙᴇʀᴍᴀɪɴ:</blockquote>`;
                
                const inlineKeyboard = [
                    [
                        {
                            text: "Call GameFactoryBot",
                            url: "tg://resolve?domain=GameFactoryBot&start=chess"
                        }
                    ]
                ];
                
                await ctx.answerInlineQuery([
                    {
                        type: 'article',
                        id: query,
                        title: '♟️ Invite Game Catur',
                        description: `Ajak @${opponentUsername} bermain catur`,
                        input_message_content: {
                            message_text: messageText,
                            parse_mode: 'HTML'
                        },
                        reply_markup: {
                            inline_keyboard: inlineKeyboard
                        }
                    }
                ], { 
                    cache_time: 1,
                    is_personal: true 
                });
            } else {
                await ctx.answerInlineQuery([
                    {
                        type: 'article',
                        id: 'catur_help',
                        title: '♟️ Bantuan Game Catur',
                        description: 'Format: .catur @username',
                        input_message_content: {
                            message_text: `<blockquote><b>🎮 ɢᴀᴍᴇ ᴄᴀᴛᴜʀ</b>

➤ <b>ᴘᴇɴɢɢᴜɴᴀᴀɴ:</b>
<code>${prefix}catur @username</code>

➤ <b>ᴜɴᴛᴜᴋ ʙᴇʀᴍᴀɪɴ:</b>
ᴋʟɪᴋ ᴛᴏᴍʙᴏʟ ᴅɪ ʙᴀᴡᴀʜ</blockquote>`,
                            parse_mode: 'HTML'
                        }
                    }
                ], { cache_time: 300 });
            }
            
        } else if (query === 'catur_help') {
            await ctx.answerInlineQuery([
                {
                    type: 'article',
                    id: 'catur_help',
                    title: '🎮 Bantuan Game Catur',
                    description: 'Cara menggunakan perintah .catur',
                    input_message_content: {
                        message_text: `<blockquote><b>🎮 ɢᴀᴍᴇ ᴄᴀᴛᴜʀ</b>

➤ <b>ᴘᴇɴɢɢᴜɴᴀᴀɴ:</b>
<code>${prefix}catur @username</code>

➤ <b>ᴜɴᴛᴜᴋ ʙᴇʀᴍᴀɪɴ:</b>
ᴋʟɪᴋ ᴛᴏᴍʙᴏʟ ᴅɪ ʙᴀᴡᴀʜ</blockquote>`,
                        parse_mode: 'HTML'
                    }
                }
            ], { cache_time: 300, is_personal: true });
            
        } else if (query.startsWith('ttsearch_')) {
    const searchId = query.replace('ttsearch_', '');
    
    if (global.ttsearchResults && global.ttsearchResults[searchId]) {
        const searchData = global.ttsearchResults[searchId];
        const videos = searchData.videos;
        const queryKeyword = searchData.query;
        
        // Buat tombol untuk 5 video
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
            `<b>Kata Kunci:</b> ${queryKeyword}\n` +
            `<b>Total:</b> ${videos.length} video ditemukan\n\n` +
            `<b>Pilih video yang ingin diambil:</b></blockquote>`;
        
        await ctx.answerInlineQuery([
            {
                type: 'article',
                id: searchId,
                title: `🔍 Hasil pencarian: ${queryKeyword}`,
                description: `${videos.length} video ditemukan`,
                input_message_content: {
                    message_text: resultText,
                    parse_mode: 'HTML'
                },
                reply_markup: {
                    inline_keyboard: [
                        ...buttons,
                        [{ text: "❌ Batal", callback_data: `ttselect_cancel_${searchId}` }]
                    ]
                }
            }
        ], { 
            cache_time: 0,
            is_personal: true 
        });
    } else {
        await ctx.answerInlineQuery([
            {
                type: 'article',
                id: 'expired',
                title: '⚠️ Pencarian Kadaluarsa',
                description: 'Silakan cari ulang dengan perintah .ttsearch',
                input_message_content: {
                    message_text: `<blockquote>⚠️ Data pencarian sudah kadaluarsa. Silakan gunakan perintah <code>${prefix}ttsearch</code> lagi.</blockquote>`,
                    parse_mode: 'HTML'
                }
            }
        ], { cache_time: 0 });
    }
}
        else {

        }
        
    } catch (e) {

    }
});

    // Create category buttons
    function createCategoryButtons(page = 0) {
        const categories = Object.keys(groupedFeatures);
        const itemsPerPage = 8;
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const pageCategories = categories.slice(start, end);
        const maxPages = Math.ceil(categories.length / itemsPerPage);

        const buttons = [];
        for (let i = 0; i < pageCategories.length; i += 2) {
            const row = pageCategories.slice(i, i + 2).map(cat => {
                const icon = categoryIcons[cat] || "";
                return Markup.button.callback(`${icon} ${cat}`, `cat_${cat}_0`);
            });
            buttons.push(row);
        }

        if (maxPages > 1) {
            const prevPage = (page - 1 + maxPages) % maxPages;
            const nextPage = (page + 1) % maxPages;
            buttons.push([
                Markup.button.callback("⳹", `page_${prevPage}`),
                Markup.button.callback(`${page + 1}/${maxPages}`, "noop"),
                Markup.button.callback("⳼", `page_${nextPage}`)
            ]);
        }

        return Markup.inlineKeyboard(buttons);
    }

    // Callback handlers for inline menu

    // No-op handler for status buttons
    bot.action("noop", async (ctx) => {
        await ctx.answerCbQuery().catch(() => { });
    });

    bot.action(/^page_(\d+)$/, async (ctx) => {
        const page = parseInt(ctx.match[1]);
        const categories = Object.keys(groupedFeatures);
        const helpText = `<blockquote><b>✮ ᴍᴇɴᴜ ɪɴʟɪɴᴇ</b>\n` +
            ` • ᴘʀᴇғɪx: ${prefix}\n` +
            ` • ᴘʟᴜɢɪɴs: ${features.length}\n` +
            ` • ᴄᴀᴛᴇɢᴏʀʏ: ${categories.length}\n` +
            ` • ᴏᴡɴᴇʀ: @${admin}\n` +
            ` • ᴍʏ ᴜʙᴏᴛ: @${usernameBot}</blockquote>`;

        try {
            await ctx.editMessageCaption(helpText, {
                parse_mode: 'HTML',
                reply_markup: createCategoryButtons(page).reply_markup
            });
        } catch (e) { }
        await ctx.answerCbQuery().catch(() => { });
    });

    bot.action(/^cat_(.+)_(\d+)$/, async (ctx) => {
        const categoryName = ctx.match[1];
        const page = parseInt(ctx.match[2]);
        const cmds = groupedFeatures[categoryName] || [];
        const icon = categoryIcons[categoryName] || "";

        const itemsPerPage = 10;
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const pageCmds = cmds.slice(start, end);
        const maxPages = Math.ceil(cmds.length / itemsPerPage);

        let catText = `<blockquote>${icon} <b>${categoryName}</b>\n» Total: ${cmds.length} commands`;
        if (maxPages > 1) catText += ` (${page + 1}/${maxPages})`;
        catText += `</blockquote>\n\n`;

        pageCmds.forEach(c => {
            catText += `<blockquote>⌭ ᴘᴇʀɪɴᴛᴀʜ: <code>${escapeHtml(c.cmd)}</code>\n  → ${escapeHtml(c.desc)}\n</blockquote>`;
        });
        catText += `\n<blockquote><b>✮ UBOT DOYANG</b></blockquote>`;

        const navButtons = [];
        if (page > 0) navButtons.push(Markup.button.callback("⳹", `cat_${categoryName}_${page - 1}`));
        navButtons.push(Markup.button.callback("⊲ ʙᴀᴄᴋ", "inline_home"));
        if (end < cmds.length) navButtons.push(Markup.button.callback("⳼", `cat_${categoryName}_${page + 1}`));

        try {
            await ctx.editMessageCaption(catText, {
                parse_mode: 'HTML',
                reply_markup: Markup.inlineKeyboard([navButtons]).reply_markup
            });
        } catch (e) { }
        await ctx.answerCbQuery().catch(() => { });
    });

    bot.action("inline_home", async (ctx) => {
        const categories = Object.keys(groupedFeatures);
        const helpText = `<blockquote><b>✮ ᴍᴇɴᴜ ɪɴʟɪɴᴇ</b>\n` +
            ` • ᴘʀᴇғɪx: ${prefix}\n` +
            ` • ᴘʟᴜɢɪɴs: ${features.length}\n` +
            ` • ᴄᴀᴛᴇɢᴏʀʏ: ${categories.length}\n` +
            ` • ᴏᴡɴᴇʀ: @${admin}\n` +
            ` • ᴍʏ ᴜʙᴏᴛ: @${usernameBot}</blockquote>`;

        try {
            await ctx.editMessageCaption(helpText, {
                parse_mode: 'HTML',
                reply_markup: createCategoryButtons(0).reply_markup
            });
        } catch (e) { }
        await ctx.answerCbQuery().catch(() => { });
    });

    bot.action("close_menu", async (ctx) => {
        try {
            await ctx.editMessageCaption("<blockquote><b>Menu ditutup</b></blockquote>", {
                parse_mode: "HTML",
                reply_markup: { inline_keyboard: [] }
            });
        } catch (e) { }
        await ctx.answerCbQuery().catch(() => { });
    });
}

function escapeHtml(text) {
    return (text || '').toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

module.exports = { 
    registerBotHandlers,
    isUserPremium,
    isUserSeller,
    isUserAdmin,
    isUserOwner,
    isUserUltra,
    getPremiumInfo,
    premiumUsers,
    sellerUsers,
    adminUsers,
    ultraPremiumUsers,
    savePremiumData
};