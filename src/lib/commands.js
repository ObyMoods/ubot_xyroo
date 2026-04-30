const config = require('../../config');
const prefix = config.prefix || '.';

// Helper functions
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function formatDuration(ms) {
    if (ms < 0) ms = -ms;
    const time = {
        hari: Math.floor(ms / 86400000),
        jam: Math.floor(ms / 3600000) % 24,
        menit: Math.floor(ms / 60000) % 60,
        detik: Math.floor(ms / 1000) % 60,
    };
    return Object.entries(time)
        .filter(([, val]) => val !== 0)
        .map(([key, val]) => `${val} ${key}`)
        .join(", ") || "0 detik";
}

function escapeHtml(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Category icons from userbot.js
const categoryIcons = {
    Utility: "⚚", Mode: "⚚", AFK: "⚚", Broadcast: "⚚",
    Fun: "⚚", Admin: "⚚", Downloader: "⚚", Blacklist: "⚚",
    Tools: "⚚", Obfuscate: "⚚", Tourl: "⚚", VPS: "⚚",
    Youtube: "⚚", Pterodactyl: "⚚", Bug: "⚚", Add: "⚚"
};

// Complete features list from userbot.js
const features = [
    // ADD
    { cmd: `${prefix}addultra @username/id_user`, desc: "Menambahkan User Super Ultra", cat: "ᴀᴅᴅ" },
    { cmd: `${prefix}getprem`, desc: "List Data Premium", cat: "ᴀᴅᴅ" },
    { cmd: `${prefix}getseller`, desc: "List Data Seller", cat: "ᴀᴅᴅ" },
    { cmd: `${prefix}prem @username/id_user`, desc: "Menambahkan User Premium", cat: "ᴀᴅᴅ" },
    { cmd: `${prefix}rmultra @username/id_user`, desc: "Menghapus User Super Ultra", cat: "ᴀᴅᴅ" },
    { cmd: `${prefix}selles @username/id_user`, desc: "Menambahkan User Seller", cat: "ᴀᴅᴅ" },
    { cmd: `${prefix}unselles @username/id_user`, desc: "Menghapus User Seller", cat: "ᴀᴅᴅ" },
    { cmd: `${prefix}unprem @username/id_user`, desc: "Menghapus User Premium", cat: "ᴀᴅᴅ" },

    // Admin
    { cmd: `${prefix}shutdown`, desc: "Mematikan Bot", cat: "ᴀᴅᴍɪɴ" },
    { cmd: `${prefix}restart`, desc: "Restart bot", cat: "ᴀᴅᴍɪɴ" },
    { cmd: `${prefix}setbio [bio]`, desc: "Ganti bio bot", cat: "ᴀᴅᴍɪɴ" },
    { cmd: `${prefix}setnamebot [nama]`, desc: "Ganti nama bot", cat: "ᴀᴅᴍɪɴ" },
    { cmd: `${prefix}setpp`, desc: "Ganti foto profil bot (reply)", cat: "ᴀᴅᴍɪɴ" },

    // AFK
    { cmd: `${prefix}afk [alasan]`, desc: "Aktifkan mode AFK", cat: "ᴀғᴋ" },
    { cmd: `${prefix}unafk`, desc: "Nonaktifkan mode AFK", cat: "ᴀғᴋ" },

    // Blacklist
    { cmd: `${prefix}addbl`, desc: "Tambah Group Ke Blacklist", cat: "ʙʟᴀᴄᴋʟɪsᴛ" },
    { cmd: `${prefix}deladdbl`, desc: "Hapus Group Dari Blacklist", cat: "ʙʟᴀᴄᴋʟɪsᴛ" },
    { cmd: `${prefix}listbl`, desc: "Daftar Group Dari Blacklist", cat: "ʙʟᴀᴄᴋʟɪsᴛ" },

    // Broadcast
    { cmd: ".autofw off", desc: "Matikan otomatis forward", cat: "ʙʀᴏᴀᴅᴄᴀsᴛ" },
    { cmd: ".autofw on [menit]", desc: "Otomatis forward pesan (reply)", cat: "ʙʀᴏᴀᴅᴄᴀsᴛ" },
    { cmd: `${prefix}cfd group`, desc: "Forward pesan ke semua grup", cat: "ʙʀᴏᴀᴅᴄᴀsᴛ" },
    { cmd: `${prefix}cfd users`, desc: "Forward pesan ke semua users", cat: "ʙʀᴏᴀᴅᴄᴀsᴛ" },
    { cmd: `${prefix}cfd all`, desc: "Forward pesan ke semua grup & users", cat: "ʙʀᴏᴀᴅᴄᴀsᴛ" },

    // BUG
    { cmd: `${prefix}crash 62xxx`, desc: "Blank Not All Device", cat: "ʙᴜɢ" },
    { cmd: `${prefix}delpair 62xxx`, desc: "Menghapus Session WhatsApp", cat: "ʙᴜɢ" },
    { cmd: `${prefix}fc 62xxx`, desc: "Forclose 1 Message Bebas Spam", cat: "ʙᴜɢ" },
    { cmd: `${prefix}ios 62xxx`, desc: "Blank Click Ios", cat: "ʙᴜɢ" },
    { cmd: `${prefix}group ( Link Group )`, desc: "Forclose Click Group", cat: "ʙᴜɢ" },
    { cmd: `${prefix}listpair`, desc: "Forclose Click Group", cat: "ʙᴜɢ" },
    { cmd: `${prefix}reqpair 62xxx`, desc: "Menambahkan Session WhatsApp", cat: "ʙᴜɢ" },

    // BUTTON
    { cmd: `${prefix}button`, desc: "Membuat Guide Maker Button", cat: "ʙᴜᴛᴛᴏɴ" },
    
    // BRAT
    { cmd: `${prefix}brat`, desc: "Membuat Brat", cat: "ʙʀᴀᴛ" },
    
    // CATUR
    { cmd: `${prefix}catur`, desc: "Bermain Game Catur", cat: "ᴄᴀᴛᴜʀ" },
    
    // CALCULATOR
    { cmd: `${prefix}calc`, desc: "Menghitung Jumlah Angka", cat: "ᴄᴀʟᴄᴜʟᴀᴛᴏʀ" },
    
    // COPY
    { cmd: `${prefix}copy`, desc: "Mengcopy Caption Dari Link Telegram", cat: "ᴄᴏᴘʏ" },
    
    // COLONG
    { cmd: `${prefix}colong`, desc: "Mengambil Media 1x Lihat", cat: "𝙲𝙾𝙻𝙾𝙽𝙶" },

    // DOXXING
    { cmd: `${prefix}dox [NIK]`, desc: "Doxxing NIK", cat: "ᴅᴏxxɪɴɢ" },
    
    // DONE
    { cmd: `${prefix}done`, desc: "Membuat Bukti Transaksi", cat: "ᴅᴏɴᴇ" },

    // Downloader
    { cmd: ".ig [url]", desc: "Download Instagram", cat: "ᴅᴏᴡɴʟᴏᴀᴅᴇʀ" },
    { cmd: ".tiktok [url]", desc: "Download TikTok (No WM)", cat: "ᴅᴏᴡɴʟᴏᴀᴅᴇʀ" },
    { cmd: ".ytmp3 [url]", desc: "Download YouTube Audio", cat: "ᴅᴏᴡɴʟᴏᴀᴅᴇʀ" },
    { cmd: ".ytmp4 [url]", desc: "Download YouTube Video", cat: "ᴅᴏᴡɴʟᴏᴀᴅᴇʀ" },

    // Encrypt Hard
    { cmd: `${prefix}encinvis [reply file]`, desc: "Mengobfuscate Kode Menjadi Invisible", cat: "ᴇɴᴄʀʏᴘᴛ ʜᴀʀᴅ" },
    { cmd: `${prefix}encinvishtml [reply file]`, desc: "Mengobfuscate Kode Html Menjadi Invisible", cat: "ᴇɴᴄʀʏᴘᴛ ʜᴀʀᴅ" },
    { cmd: `${prefix}enchtml [reply file]`, desc: "Mengobfuscate Kode Html Menjadi Angka", cat: "ᴇɴᴄʀʏᴘᴛ ʜᴀʀᴅ" },
    { cmd: `${prefix}encvar [reply file]`, desc: "Mengobfuscate Kode Menjadi Angka", cat: "ᴇɴᴄʀʏᴘᴛ ʜᴀʀᴅ" },
    { cmd: `${prefix}invishtml [reply file]`, desc: "Obfuscate Kode Html Invisible Ringan", cat: "ᴇɴᴄʀʏᴘᴛ ʜᴀʀᴅ" },
   { cmd: `${prefix}encarab [reply file]`, desc: "Obfuscate Kode Js Arabic", cat: "ᴇɴᴄʀʏᴘᴛ ʜᴀʀᴅ" },
   { cmd: `${prefix}encchina [reply file]`, desc: "Obfuscate Kode js china", cat: "ᴇɴᴄʀʏᴘᴛ ʜᴀʀᴅ" },
  { cmd: `${prefix}enccustom [reply file]`, desc: "Obfuscate Kode js custom", cat: "ᴇɴᴄʀʏᴘᴛ ʜᴀʀᴅ" },
  { cmd: `${prefix}encsiu [reply file]`, desc: "Obfuscate Kode Js Siu", cat: "ᴇɴᴄʀʏᴘᴛ ʜᴀʀᴅ" },
  { cmd: `${prefix}encstrong [reply file]`, desc: "Obfuscate Kode js strong", cat: "ᴇɴᴄʀʏᴘᴛ ʜᴀʀᴅ" },
 { cmd: `${prefix}encultra [reply file]`, desc: "Obfuscate Kode js ultra", cat: "ᴇɴᴄʀʏᴘᴛ ʜᴀʀᴅ" },


 





    // GROUP
    { cmd: ".ban", desc: "Ban user (reply)", cat: "ɢʀᴏᴜᴘ" },
    { cmd: ".demote", desc: "Demote admin (reply)", cat: "ɢʀᴏᴜᴘ" },
    { cmd: ".kick", desc: "Kick user (reply)", cat: "ɢʀᴏᴜᴘ" },
    { cmd: ".linkgroup", desc: "Ambil link grup", cat: "ɢʀᴏᴜᴘ" },
    { cmd: ".mute", desc: "Mute user (reply)", cat: "ɢʀᴏᴜᴘ" },
    { cmd: ".promote", desc: "Promote admin (reply)", cat: "ɢʀᴏᴜᴘ" },
    { cmd: ".revoke", desc: "Reset link grup", cat: "ɢʀᴏᴜᴘ" },
    { cmd: ".unban", desc: "Unban user (reply)", cat: "ɢʀᴏᴜᴘ" },
    { cmd: ".unmute", desc: "Unmute user (reply)", cat: "ɢʀᴏᴜᴘ" },
    
    // GROUP
    { cmd: `${prefix}getpp`, desc: "Untuk mendapatakan foto profil user", cat: "ɢᴇᴛ ᴘᴘ" },
    
    // INSTALLPROTECT
    { cmd: `${prefix}installprotect1`, desc: "Anti Delete Server", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotect2`, desc: "Anti Delete User", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotect3`, desc: "Anti Akses Location", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotect4`, desc: "Anti Akses Nodes", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotect5`, desc: "Anti Akses Nest", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotect6`, desc: "Anti Akses Settings", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotect7`, desc: "Anti Akses File Server", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotect8`, desc: "Anti Akses Server", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotect9`, desc: "Anti Modif Server", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotect10`, desc: "Anti Akses PLTA", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotect11`, desc: "", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotect12`, desc: "", cat: "ɪɴsᴛᴀʟʟ" },
    { cmd: `${prefix}installprotectall`, desc: "Menginstall Protect 1 -10", cat: "ɪɴsᴛᴀʟʟ" },
    
    // INSTALLPANEL
    { cmd: `${prefix}installpanel`, desc: "Menginstall Pterodactyl", cat: "ɪɴsᴛᴀʟʟ ᴘᴀɴᴇʟ" },
    { cmd: `${prefix}startwings`, desc: "Create Wings", cat: "ɪɴsᴛᴀʟʟ ᴘᴀɴᴇʟ" },
    { cmd: `${prefix}uninstallwings`, desc: "Menghapus Wings", cat: "ɪɴsᴛᴀʟʟ ᴘᴀɴᴇʟ" },
    { cmd: `${prefix}subdo`, desc: "Membuat Domain", cat: "ɪɴsᴛᴀʟʟ ᴘᴀɴᴇʟ" },

    // Mode
    { cmd: ".addsudo", desc: "Tambah user Sudo (reply, admin only)", cat: "ᴍᴏᴅᴇ" },
    { cmd: ".del", desc: "Hapus pesan & reply", cat: "ᴍᴏᴅᴇ" },
    { cmd: ".delsudo", desc: "Hapus user Sudo (reply, admin only)", cat: "ᴍᴏᴅᴇ" },
    { cmd: ".public", desc: "Izinkan publik pakai command", cat: "ᴍᴏᴅᴇ" },
    { cmd: ".self", desc: "Hanya admin yang bisa pakai command", cat: "ᴍᴏᴅᴇ" },
    { cmd: ".setdesc <desc>", desc: "Ganti deskripsi grup", cat: "ᴍᴏᴅᴇ" },
    { cmd: ".setname <nama>", desc: "Ganti nama grup", cat: "ᴍᴏᴅᴇ" },
    { cmd: ".setphoto", desc: "Ganti foto grup (reply)", cat: "ᴍᴏᴅᴇ" },
    
    // ADDNOTE
    { cmd: `${prefix}cnote`, desc: "Hapus semua catatan", cat: "ɴᴏᴛᴇ" },
    { cmd: `${prefix}addnote <teks/reply>`, desc: "Simpan catatan", cat: "ɴᴏᴛᴇ" },
    { cmd: `${prefix}listnote`, desc: "Lihat semua catatan", cat: "ɴᴏᴛᴇ" },

    // PREFIX
    { cmd: `${prefix}prefix`, desc: "Untuk Mengubah Simbol", cat: "ᴘʀᴇғɪx" },
    
    // PROSES
    { cmd: `${prefix}proses`, desc: "Membuat Teks Proses Pesanan", cat: "ᴘʀᴏsᴇs" },

    // PTERODACTYL
    { cmd: `${prefix}1gb - 10gb <nama>,<username>`, desc: "Membuat Server Pterodactyl", cat: "ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ" },
    { cmd: `${prefix}adp <nama>,<username>`, desc: "Membuat Admin Panel", cat: "ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ" },
    { cmd: `${prefix}ambilfile`, desc: "Mengambil Semua File Di Setiap Server", cat: "ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ" },
    { cmd: `${prefix}deladp <nama>,<username>`, desc: "Menghapus Admin Panel", cat: "ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ" },
    { cmd: `${prefix}delsrv <ID_server>`, desc: "Untuk Menghapus Server", cat: "ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ" },
    { cmd: `${prefix}listadp`, desc: "Mengambil Daftar Admin Panel", cat: "ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ" },
    { cmd: `${prefix}listsrv`, desc: "Melihat Daftar Server", cat: "ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ" },
    { cmd: `${prefix}uninstallpanel <ip_vps> <pass>`, desc: "Menguninstall Panel", cat: "ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ" },
    { cmd: `${prefix}unli <nama>,<username>`, desc: "Membuat Serverl Unlimited", cat: "ᴘᴛᴇʀᴏᴅᴀᴄᴛʏʟ" },

    // SSWEB
    { cmd: `${prefix}ssweb <url>`, desc: "Screenshot Website", cat: "ssᴡᴇʙ" },
    
    // SPOTIFY
    { cmd: `${prefix}spotify [kata kunci]`, desc: "Mencari lagu spotify", cat: "sᴘᴏᴛɪғʏ" },
    
    // SPAM
    { cmd: `${prefix}spam <jumlah>`, desc: "Spam pesan reply", cat: "sᴘᴀᴍ" },
    
    // STICKER
    { cmd: `${prefix}q <reply>`, desc: "merubah text menjadi sticker", cat: "sᴛɪᴄᴋᴇʀ" },
    
    // SALAM
    { cmd: `${prefix}p`, desc: "Assalamualaikum.", cat: "sᴀʟᴀᴍ" },
    { cmd: `${prefix}pe`, desc: "Assalamualaikum Warahmatullahi Wabarakatuh.", cat: "sᴀʟᴀᴍ" },
    { cmd: `${prefix}l`, desc: "Wa'alaikumsalam.", cat: "sᴀʟᴀᴍ" },
    { cmd: `${prefix}wl`, desc: "Wa'alaikumsalam Warahmatullahi Wabarakatuh.", cat: "sᴀʟᴀᴍ" },
    { cmd: `${prefix}as`, desc: "coba aja.", cat: "sᴀʟᴀᴍ" },

    // TAGALL
    { cmd: `${prefix}batal`, desc: "Membatalkan Tag Semua Member", cat: "ᴛᴀɢᴀʟʟ" },
    { cmd: `${prefix}hidetag <teks>`, desc: "Tag semua member (tersembunyi)", cat: "ᴛᴀɢᴀʟʟ" },
    { cmd: `${prefix}tagall`, desc: "Tag semua member", cat: "ᴛᴀɢᴀʟʟ" },
    { cmd: `${prefix}totag`, desc: "Jadikan pesan sebagai tagall", cat: "ᴛᴀɢᴀʟʟ" },

    // Tools
    { cmd: `${prefix}getcode <URL>`, desc: "Mengambil File Website", cat: "ᴛᴏᴏʟs" },

    // Tourl
    { cmd: `${prefix}tourl`, desc: "Mengupload Media Menjadi Link", cat: "ᴛᴏᴜʀʟ" },
    
    // Tiktok
    { cmd: `${prefix}ttsearch`, desc: "Mencari Video Dan Diunduh", cat: "ᴛɪᴋᴛᴏᴋ" },
    { cmd: `${prefix}ttmp4`, desc: "Mengunduh Video TikTok", cat: "ᴛɪᴋᴛᴏᴋ" },
    { cmd: `${prefix}ttmp3`, desc: "Mengunduh Audio TikTok", cat: "ᴛɪᴋᴛᴏᴋ" },
    
   // TOXIC
    { cmd: `${prefix}jamet`, desc: "gatau gabut doang.", cat: "ᴛᴏxɪᴄ" },
    { cmd: `${prefix}vir`, desc: "gatau gabut doang.", cat: "ᴛᴏxɪᴄ" },
    { cmd: `${prefix}ppx`, desc: "gatau gabut doang.", cat: "ᴛᴏxɪᴄ" },
    { cmd: `${prefix}kiss`, desc: "gatau gabut doang.", cat: "ᴛᴏxɪᴄ" },
    { cmd: `${prefix}pc`, desc: "gatau gabut doang.", cat: "ᴛᴏxɪᴄ" },
    { cmd: `${prefix}hah`, desc: "gatau gabut doang.", cat: "ᴛᴏxɪᴄ" },
    { cmd: `${prefix}gembel`, desc: "gatau gabut doang.", cat: "ᴛᴏxɪᴄ" },

    // Utility
    { cmd: ".id", desc: "Tampilkan ID chat & user", cat: "ᴜᴛɪʟɪᴛʏ" },
    { cmd: ".info", desc: "Info lengkap user (reply)", cat: "ᴜᴛɪʟɪᴛʏ" },
    { cmd: ".iqc jam,batre,carrier,pesan", desc: "Buat iPhone quoted image", cat: "ᴜᴛɪʟɪᴛʏ" },
    { cmd: ".ping", desc: "Cek kecepatan respon bot", cat: "ᴜᴛɪʟɪᴛʏ" },
    { cmd: ".pinterest <query>", desc: "Cari gambar di Pinterest", cat: "ᴜᴛɪʟɪᴛʏ" },
    { cmd: ".tulis <teks>", desc: "Buat gambar tulisan tangan", cat: "ᴜᴛɪʟɪᴛʏ" },
    { cmd: ".setpay <reply gambar>", desc: "Setting Payment", cat: "ᴜᴛɪʟɪᴛʏ" },
    { cmd: ".pay", desc: "Kirim Foto Qris Buat Transaksi", cat: "ᴜᴛɪʟɪᴛʏ" },

    // VPS
    { cmd: `${prefix}cekvps <ip_vps> <pass>`, desc: "Mengecek VPS", cat: "ᴠᴘs" },
    { cmd: `${prefix}pass <ip_vps> <pass_old> <pass_new>`, desc: "Mengubah Password VPS", cat: "ᴠᴘs" },

    // YTSEARCH
    { cmd: `${prefix}yt`, desc: "Mencari video Youtube dan download", cat: "ʏᴛsᴇᴀʀᴄʜ" },
    { cmd: `${prefix}yts`, desc: "Mencari video Youtube", cat: "ʏᴛsᴇᴀʀᴄʜ" },
    
    // ZOMBIES
    { cmd: `${prefix}zombies`, desc: "Mengeluarkan Akun Terhapus Dari Group", cat: "ᴢᴏᴍʙɪᴇs" },
    
    // ZODIAK
    { cmd: `${prefix}zodiak`, desc: "Mencari Ramalan Zodiak", cat: "ᴢᴏᴅɪᴀᴋ" },
    
    // FUN MENU
    { cmd: `${prefix}tembak`, desc: "Kata Kata Buat Nembak Cewek", cat: "ғᴜɴɴ ᴍᴇɴᴜ" },
    { cmd: `${prefix}terima`, desc: "Nerima Cinta Seseorang", cat: "ғᴜɴɴ ᴍᴇɴᴜ" },
    { cmd: `${prefix}tolam`, desc: "Tolak Cinta Seseorang", cat: "ғᴜɴɴ ᴍᴇɴᴜ" },
    { cmd: `${prefix}top`, desc: "Leaderboad", cat: "ғᴜɴɴ ᴍᴇɴᴜ" },
    { cmd: `${prefix}cekhobi`, desc: "cek hobi seseorang", cat: "ғᴜɴɴ ᴍᴇɴᴜ" },
    { cmd: `${prefix}cekganteng`, desc: "cek ke gantengan seseorang", cat: "ғᴜɴɴ ᴍᴇɴᴜ" },
    { cmd: `${prefix}cekgay`, desc: "cek seberapa gay seseorang", cat: "ғᴜɴɴ ᴍᴇɴᴜ" },
    { cmd: `${prefix}ceklesbi`, desc: "cek seberapa lesbi seseorang", cat: "ғᴜɴɴ ᴍᴇɴᴜ" },
    { cmd: `${prefix}cekapakah`, desc: "kemungkinan", cat: "ғᴜɴɴ ᴍᴇɴᴜ" },
    { cmd: `${prefix}cekapankah`, desc: "cek kapan", cat: "ғᴜɴɴ ᴍᴇɴᴜ" },
    { cmd: `${prefix}cekbisakah`, desc: "cek bisakah", cat: "ғᴜɴɴ ᴍᴇɴᴜ" },
    
    // ANIME MENU
{ cmd: `${prefix}akiyama`, desc: "Kirim gambar Akiyama", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}ana`, desc: "Kirim gambar Ana", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}art`, desc: "Kirim gambar Art", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}asuna`, desc: "Kirim gambar Asuna", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}ayuzawa`, desc: "Kirim gambar Ayuzawa", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}boruto`, desc: "Kirim gambar Boruto", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}bts`, desc: "Kirim gambar BTS", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}cartoon`, desc: "Kirim gambar Cartoon", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}chiho`, desc: "Kirim gambar Chiho", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}chitoge`, desc: "Kirim gambar Chitoge", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}cosplay`, desc: "Kirim gambar Cosplay", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}cosplayloli`, desc: "Kirim gambar Cosplay Loli", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}cosplaysagiri`, desc: "Kirim gambar Cosplay Sagiri", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}cyber`, desc: "Kirim gambar Cyber", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}deidara`, desc: "Kirim gambar Deidara", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}doraemon`, desc: "Kirim gambar Doraemon", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}elaina`, desc: "Kirim gambar Elaina", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}emilia`, desc: "Kirim gambar Emilia", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}erza`, desc: "Kirim gambar Erza", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}exo`, desc: "Kirim gambar EXO", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}gamewallpaper`, desc: "Kirim gambar Game Wallpaper", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}gremory`, desc: "Kirim gambar Gremory", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}hacker`, desc: "Kirim gambar Hacker", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}hestia`, desc: "Kirim gambar Hestia", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}hinata`, desc: "Kirim gambar Hinata", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}husbu`, desc: "Kirim gambar Husbu", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}inori`, desc: "Kirim gambar Inori", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}islamic`, desc: "Kirim gambar Islamic", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}isuzu`, desc: "Kirim gambar Isuzu", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}itachi`, desc: "Kirim gambar Itachi", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}itori`, desc: "Kirim gambar Itori", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}jennie`, desc: "Kirim gambar Jennie", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}jiso`, desc: "Kirim gambar Jiso", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}justina`, desc: "Kirim gambar Justina", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}kaga`, desc: "Kirim gambar Kaga", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}kagura`, desc: "Kirim gambar Kagura", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}kakasih`, desc: "Kirim gambar Kakasih", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}kaori`, desc: "Kirim gambar Kaori", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}keneki`, desc: "Kirim gambar Keneki", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}kotori`, desc: "Kirim gambar Kotori", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}kurumi`, desc: "Kirim gambar Kurumi", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}lisa`, desc: "Kirim gambar Lisa", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}madara`, desc: "Kirim gambar Madara", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}megumin`, desc: "Kirim gambar Megumin", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}mikasa`, desc: "Kirim gambar Mikasa", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}mikey`, desc: "Kirim gambar Mikey", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}miku`, desc: "Kirim gambar Miku", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}minato`, desc: "Kirim gambar Minato", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}mountain`, desc: "Kirim gambar Mountain", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}naruto`, desc: "Kirim gambar Naruto", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}neko2`, desc: "Kirim gambar Neko", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}nekonime`, desc: "Kirim gambar Neko Nime", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}nezuko`, desc: "Kirim gambar Nezuko", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}onepiece`, desc: "Kirim gambar One Piece", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}pentol`, desc: "Kirim gambar Pentol", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}pokemon`, desc: "Kirim gambar Pokemon", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}programming`, desc: "Kirim gambar Programming", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}randomnime`, desc: "Kirim gambar Random Anime", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}randomnime2`, desc: "Kirim gambar Random Anime 2", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}rize`, desc: "Kirim gambar Rize", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}rose`, desc: "Kirim gambar Rose", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}sagiri`, desc: "Kirim gambar Sagiri", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}sakura`, desc: "Kirim gambar Sakura", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}sasuke`, desc: "Kirim gambar Sasuke", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}satanic`, desc: "Kirim gambar Satanic", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}shina`, desc: "Kirim gambar Shina", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}shinka`, desc: "Kirim gambar Shinka", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}shinomiya`, desc: "Kirim gambar Shinomiya", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}shizuka`, desc: "Kirim gambar Shizuka", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}shota`, desc: "Kirim gambar Shota", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}shortquote`, desc: "Kirim gambar Short Quote", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}space`, desc: "Kirim gambar Space", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}technology`, desc: "Kirim gambar Technology", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}tejina`, desc: "Kirim gambar Tejina", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}toukachan`, desc: "Kirim gambar Toukachan", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}tsunade`, desc: "Kirim gambar Tsunade", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}yotsuba`, desc: "Kirim gambar Yotsuba", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}yuki`, desc: "Kirim gambar Yuki", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}yulibocil`, desc: "Kirim gambar Yulibocil", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },
{ cmd: `${prefix}yumeko`, desc: "Kirim gambar Yumeko", cat: "ᴀɴɪᴍᴇ ᴍᴇɴᴜ" },


      // GAMES MENU
{ cmd: `${prefix}tebakkata`, desc: "Tebak Kata", cat: "ɢᴀᴍᴇs ᴍᴇɴᴜ" },
{ cmd: `${prefix}asahotak`, desc: "Asah Otak", cat: "ɢᴀᴍᴇs ᴍᴇɴᴜ" },
{ cmd: `${prefix}susunkata`, desc: "Susun Kata", cat: "ɢᴀᴍᴇs ᴍᴇɴᴜ" },
{ cmd: `${prefix}tebakgambar`, desc: "Tebak Gambar", cat: "ɢᴀᴍᴇs ᴍᴇɴᴜ" },
{ cmd: `${prefix}tebakbendera`, desc: "Tebak Bendera", cat: "ɢᴀᴍᴇs ᴍᴇɴᴜ" },
{ cmd: `${prefix}tebakkimia`, desc: "Tebak Kimia", cat: "ɢᴀᴍᴇs ᴍᴇɴᴜ" },
{ cmd: `${prefix}family100`, desc: "Family 100", cat: "ɢᴀᴍᴇs ᴍᴇɴᴜ" },
{ cmd: `${prefix}f100`, desc: "Family 100 (alias)", cat: "ɢᴀᴍᴇs ᴍᴇɴᴜ" },
        
              // RPG MENU
{ cmd: `${prefix}joinrpg`, desc: "Masuk Dunia Rpg", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}exitrpg`, desc: "Keluar Dari Dunia Rpg", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}inventory`, desc: "Cek Inventory Kamu", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}inv`, desc: "Cek Inventory Kamu", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}profile`, desc: "Cek Profile Kamu", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}heal`, desc: "Memulihkan Darah & Stamina", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}makan`, desc: "Makan Untuk Memulihkan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}tidur`, desc: "Tidur Untuk Memulihkan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}mining`, desc: "Menambang Resource", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}nebang`, desc: "Menebang Pohon", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}berburu`, desc: "Berburu Hewan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}memancing`, desc: "Memancing Ikan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}mancing`, desc: "Memancing Ikan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}adventure`, desc: "Bertualang Cari Harta", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}ngojek`, desc: "Menjadi Driver Ojek", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}polisi`, desc: "Menjadi Polisi", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}ngeroket`, desc: "Pergi Ke Bulan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}roket`, desc: "Pergi Ke Bulan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}nyampah`, desc: "Ngumpulin Sampah", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}kerja`, desc: "Bekerja Mencari Uang", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}bekerja`, desc: "Bekerja Mencari Uang", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}rampok`, desc: "Merampok Player Lain", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}merampok`, desc: "Merampok Player Lain", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}ewe-paksa`, desc: "Ewe Paksa Seseorang", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}ewepaksa`, desc: "Ewe Paksa Seseorang", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}openbo`, desc: "Open Booking Online", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}open-bo`, desc: "Open Booking Online", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}ngaji`, desc: "Mengaji Dapat Pahala", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}mengaji`, desc: "Mengaji Dapat Pahala", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}dailymisi`, desc: "Misi Harian", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}daily-misi`, desc: "Misi Harian", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}weekly`, desc: "Klaim Hadiah Mingguan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}mingguan`, desc: "Klaim Hadiah Mingguan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}monthly`, desc: "Klaim Hadiah Bulanan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}bulanan`, desc: "Klaim Hadiah Bulanan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}yearly`, desc: "Klaim Hadiah Tahunan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}tahunan`, desc: "Klaim Hadiah Tahunan", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}craft`, desc: "Membuat Item/Equipment", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}crafting`, desc: "Membuat Item/Equipment", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}rawat`, desc: "Memperbaiki Equipment", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}repair`, desc: "Memperbaiki Equipment", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}sell`, desc: "Menjual Item", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}jual`, desc: "Menjual Item", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}buy`, desc: "Membeli Item", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}beli`, desc: "Membeli Item", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}shop`, desc: "Toko Market", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}transfer`, desc: "Transfer Saldo/Limit", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}tf`, desc: "Transfer Saldo/Limit", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}skillselect`, desc: "Memilih Skill", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}selectskill`, desc: "Memilih Skill", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}cekskill`, desc: "Cek Skill Kamu", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}skillcek`, desc: "Cek Skill Kamu", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}redeem`, desc: "Tukar Kode Redeem", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}redem`, desc: "Tukar Kode Redeem", cat: "ʀᴘɢ ᴍᴇɴᴜ" },
{ cmd: `${prefix}wikwik`, desc: "Battle Wikwik", cat: "ʀᴘɢ ᴍᴇɴᴜ" },

// WEREWOLF MENU
{ cmd: `${prefix}ww`, desc: "Main Werewolf", cat: "ᴡᴇʀᴇᴡᴏʟꜰ ᴍᴇɴᴜ" },
{ cmd: `${prefix}werewolf`, desc: "Main Werewolf", cat: "ᴡᴇʀᴇᴡᴏʟꜰ ᴍᴇɴᴜ" },
 
    
];

// Group by category
const groupedFeatures = {};
features.forEach((f) => {
    if (!groupedFeatures[f.cat]) groupedFeatures[f.cat] = [];
    groupedFeatures[f.cat].push(f);
});

function generateCategoryHelp(cat) {
    const cmds = groupedFeatures[cat];
    if (!cmds) return "❌ Kategori tidak ditemukan.";
    const icon = categoryIcons[cat] || "";
    let text = `━━━━━━━━━━━━━━━━━━\n${icon} <b>${cat}</b>\n━━━━━━━━━━━━━━━━━━\n`;
    cmds.forEach((c) => { text += `• <code>${c.cmd}</code> → ${c.desc}\n`; });
    return text;
}

module.exports = {
    prefix, features, groupedFeatures, categoryIcons,
    generateCategoryHelp, sleep, formatDuration, escapeHtml
};
