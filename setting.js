/**
 * Ahyoung Discord Bot Base
 *
 * Created by Kyu
 *
 * Not for sale • Keep this credit
 *
 * GitHub   : github.com/RynnStecu
 *
 * Telegram : t.me/kyuugaperawan
 *
 * WA Channel:
 *
 * whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D
 *
 * whatsapp.com/channel/0029VbCsmdMC1Fu6NbIaaY2T
 */

// ─── Bot Core ──────────────────────────────────────────────────
// Ambil dari Discord Developer Portal (https://discord.com/developers/applications)
global.token = ""        // tab Bot → Reset Token / Add Bot → Copy
global.clientId = ""     // tab General Information → Application ID
global.clientSecret = "" // tab OAuth2 → Client Secret (khusus buat login dashboard)
global.guildId = ""      // ID server utama kamu (klik kanan server → Copy Server ID, Developer Mode harus aktif)
global.owner = []         // ["ID_DISCORD_KAMU"] — WAJIB diisi, cuma ID di sini yang bisa akses command & dashboard owner

// Bisa satu prefix atau banyak prefix sekaligus
global.prefix = ["!", ".", "?"]

global.botName = "Ahyoung"
global.footer = "Created by Kyu"
global.embedColor = "#5865F2"
global.thumbnail = "https://litter.catbox.moe/fsmpif.jpg"
global.version = "1.0.0"

global.devName = "KyuDev"
global.devTelegram = "t.me/kyuugaperawan"
global.devWebsite = "https://api.kyzzz.eu.cc"
global.devWhatsapp = "https://wa.me/6285881530884"

// ─── Channel IDs ───────────────────────────────────────────────
global.welcomeChannelId = ""    // ID channel welcome (klik kanan channel → Copy Channel ID)
global.leaveChannelId = ""      // ID channel leave (kosongkan jika sama dengan welcome)
global.logChannelId = ""        // ID channel server log (level up, dll)

// ─── Level System ──────────────────────────────────────────────
global.levelConfig = {
  xpCooldown: 45,    // detik cooldown per user
  xpMin: 10,         // XP minimum per pesan
  xpMax: 25          // XP maksimum per pesan
}

// ─── Welcome Card ──────────────────────────────────────────────
global.welcomeConfig = {
  background: "",
  overlayColor: "#5865F2",
  circleColor: "#FFFFFF",
  textColor: "#FFFFFF"
}

// ─── Leave Card ────────────────────────────────────────────────
global.leaveConfig = {
  background: "",
  overlayColor: "#2c2f33",
  circleColor: "#FFFFFF",
  textColor: "#FFFFFF"
}

// ─── Dashboard (khusus owner, login via Discord OAuth2) ────────
// Setup lengkap: lihat bagian "🖥️ Web Dashboard" di README.md
global.dashboardConfig = {
  enabled: true,
  port: 3001,
  redirectUri: "",     // contoh: https://dashboard.domainmu.com/auth/discord/callback
                        // harus didaftarkan persis sama di Developer Portal → OAuth2 → Redirects
  sessionSecret: ""    // isi string acak (bebas, panjang, jangan ditebak orang lain)
}
