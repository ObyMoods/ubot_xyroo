# UBOT YAKUZA

Telegram UserBot Multi-Connection dengan arsitektur modular.

## 📁 Struktur Folder

```
ubot-yakuza/
├── index.js              # Entry point utama
├── package.json          # Dependencies
├── config/
│   ├── index.js          # Konfigurasi utama
│   └── pterodactyl.js    # Pengaturan panel
├── src/
│   ├── lib/
│   │   ├── sessionManager.js   # Manajemen session
│   │   ├── clientManager.js    # Manajemen Telegram client
│   │   ├── commands.js         # Daftar command
│   │   └── premium.js          # Sistem premium
│   └── handlers/
│       ├── botHandlers.js      # Handler menu bot
│       └── userbotHandlers.js  # Handler userbot
└── data/
    └── sessions/         # Session per-user
```

## 🚀 Cara Menjalankan

```bash
# Install dependencies
npm install

# Jalankan
npm start
```

## 📱 Cara Pakai

1. Start bot di Telegram: `/start`
2. Klik **🔌 CONNECT USERBOT**
3. Masukkan nomor HP
4. Masukkan kode OTP
5. Jika ada 2FA, masukkan password
6. Selesai!

## ⚙️ Konfigurasi

Edit file `config/index.js`:

```javascript
module.exports = {
    apiId: "YOUR_API_ID",
    apiHash: "YOUR_API_HASH",
    botToken: "YOUR_BOT_TOKEN",
    botUsername: "YOUR_BOT_USERNAME",
    prefix: ".",
    ownerId: "YOUR_TELEGRAM_ID"
};
```

## 📋 Commands

| Command | Deskripsi |
|---------|-----------|
| `.help` | Menu bantuan |
| `.ping` | Cek latency |
| `.id` | Lihat ID |
| `.public` | Mode publik |
| `.self` | Mode self |
| `.afk` | Mode AFK |

## 📄 License

MIT License
