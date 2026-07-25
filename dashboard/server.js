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

import express from "express"
import session from "express-session"
import crypto from "crypto"
import { existsSync, mkdirSync, writeFileSync, unlinkSync, readdirSync, readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import logger from "../lib/logger.js"
import {
  getAllUsersInGuild,
  getAllTrackedGuildIds,
  getAllTrackedUserIds,
  getTotalTrackedUsers,
  getLeaderboard
} from "../lib/db.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginsPath = join(__dirname, "..", "plugins")
const safeName = /^[a-zA-Z0-9_-]+$/

function requireAuth(req, res, next) {
  const user = req.session?.discordUser
  if (user && global.owner.includes(user.id)) return next()
  return res.redirect("/login")
}

function randomState() {
  return crypto.randomBytes(16).toString("hex")
}

function buildAuthorizeUrl(state) {
  const config = global.dashboardConfig
  const params = new URLSearchParams({
    client_id: global.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "identify",
    state,
    prompt: "consent"
  })
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`
}

async function exchangeCodeForToken(code) {
  const config = global.dashboardConfig
  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: global.clientId,
      client_secret: global.clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: config.redirectUri
    })
  })

  if (!res.ok) throw new Error(`Token exchange gagal (${res.status})`)
  return res.json()
}

async function fetchDiscordUser(accessToken) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  if (!res.ok) throw new Error(`Gagal mengambil data user (${res.status})`)
  return res.json()
}

function getExistingCategories() {
  if (!existsSync(pluginsPath)) return []
  return readdirSync(pluginsPath, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
}

function listAllPlugins(client) {
  const categories = getExistingCategories()
  const result = []

  for (const category of categories) {
    const dir = join(pluginsPath, category)
    const files = readdirSync(dir).filter((f) => f.endsWith(".js"))

    for (const file of files) {
      const name = file.replace(".js", "")
      const plugin = client.plugins.get(name)

      result.push({
        name,
        category,
        aliases: plugin?.aliases || [],
        description: plugin?.description || "",
        guildOnly: !!plugin?.guildOnly,
        loaded: !!plugin
      })
    }
  }

  return result
}

function findPluginFile(name) {
  const categories = getExistingCategories()

  for (const category of categories) {
    const filePath = join(pluginsPath, category, `${name}.js`)
    if (existsSync(filePath)) return { filePath, category }
  }

  return null
}

async function findBroadcastChannel(guild) {
  if (guild.systemChannel) {
    const perms = guild.systemChannel.permissionsFor(guild.members.me)
    if (perms?.has("SendMessages")) return guild.systemChannel
  }

  const channels = await guild.channels.fetch()
  for (const channel of channels.values()) {
    if (channel?.isTextBased?.() && !channel.isThread?.()) {
      const perms = channel.permissionsFor(guild.members.me)
      if (perms?.has("SendMessages") && perms?.has("ViewChannel")) return channel
    }
  }

  return null
}

export function createDashboard(client) {
  const config = global.dashboardConfig || {}
  if (!config.enabled) {
    logger.info("Dashboard dinonaktifkan (dashboardConfig.enabled = false)")
    return
  }

  if (!global.clientSecret || !config.redirectUri) {
    logger.warn("Dashboard: clientSecret / dashboardConfig.redirectUri belum diisi di setting.js — login akan gagal.")
  }

  const app = express()

  app.set("view engine", "ejs")
  app.set("views", join(__dirname, "views"))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static(join(__dirname, "public")))
  app.use(
    session({
      secret: config.sessionSecret || "ahyoung-dashboard-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 12 } // 12 jam
    })
  )
  app.use((req, res, next) => {
    res.locals.currentUser = req.session?.discordUser || null
    next()
  })

  // ─── Auth (Discord OAuth2, hanya untuk ID di global.owner) ────
  app.get("/login", (req, res) => {
    if (req.session?.discordUser && global.owner.includes(req.session.discordUser.id)) {
      return res.redirect("/dashboard")
    }

    const state = randomState()
    req.session.oauthState = state
    res.render("login", { error: req.query.error || null, botName: global.botName, authorizeUrl: buildAuthorizeUrl(state) })
  })

  app.get("/auth/discord/callback", async (req, res) => {
    const { code, state } = req.query

    if (!code || !state || state !== req.session?.oauthState) {
      return res.redirect("/login?error=" + encodeURIComponent("Sesi login tidak valid, coba lagi."))
    }

    try {
      const token = await exchangeCodeForToken(code)
      const discordUser = await fetchDiscordUser(token.access_token)

      if (!global.owner.includes(discordUser.id)) {
        return res.redirect("/login?error=" + encodeURIComponent("Akun ini bukan owner bot. Akses ditolak."))
      }

      req.session.discordUser = {
        id: discordUser.id,
        username: discordUser.username,
        avatar: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${Number(discordUser.discriminator || 0) % 5}.png`
      }

      res.redirect("/dashboard")
    } catch (error) {
      logger.error(`Dashboard OAuth error: ${error.message}`)
      res.redirect("/login?error=" + encodeURIComponent("Login gagal, coba lagi."))
    }
  })

  app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/login"))
  })

  app.get("/", (req, res) => res.redirect("/dashboard"))

  // ─── Pages ───────────────────────────────────────────────────
  app.get("/dashboard", requireAuth, (req, res) => {
    const trackedGuildIds = getAllTrackedGuildIds()
    const guilds = client.guilds.cache.map((g) => ({ id: g.id, name: g.name }))
    const selectedGuild = req.query.guild || trackedGuildIds[0] || global.guildId
    const users = selectedGuild ? getAllUsersInGuild(selectedGuild) : []

    res.render("dashboard", {
      page: "dashboard",
      botName: global.botName,
      stats: {
        servers: client.guilds.cache.size,
        trackedUsers: getTotalTrackedUsers(),
        plugins: client.plugins.size,
        ping: client.ws.ping
      },
      guilds,
      selectedGuild,
      users
    })
  })

  app.get("/leaderboard", requireAuth, (req, res) => {
    const trackedGuildIds = getAllTrackedGuildIds()
    const guilds = client.guilds.cache.map((g) => ({ id: g.id, name: g.name }))
    const selectedGuild = req.query.guild || trackedGuildIds[0] || global.guildId
    const leaderboard = selectedGuild ? getLeaderboard(selectedGuild) : []

    res.render("leaderboard", {
      page: "leaderboard",
      botName: global.botName,
      guilds,
      selectedGuild,
      leaderboard
    })
  })

  app.get("/plugins", requireAuth, (req, res) => {
    res.render("plugins", {
      page: "plugins",
      botName: global.botName,
      plugins: listAllPlugins(client),
      categories: getExistingCategories()
    })
  })

  app.get("/servers", requireAuth, (req, res) => {
    const guilds = client.guilds.cache.map((g) => ({
      id: g.id,
      name: g.name,
      icon: g.iconURL({ size: 128 }) || null,
      memberCount: g.memberCount,
      ownerId: g.ownerId,
      joinedAt: g.joinedAt
    }))

    res.render("servers", { page: "servers", botName: global.botName, guilds })
  })

  app.get("/broadcast", requireAuth, (req, res) => {
    res.render("broadcast", {
      page: "broadcast",
      botName: global.botName,
      totalServers: client.guilds.cache.size,
      totalUsers: getAllTrackedUserIds().length
    })
  })

  // ─── API: Plugins ────────────────────────────────────────────
  app.post("/api/plugins", requireAuth, (req, res) => {
    const { category, name, code, force } = req.body

    if (!category || !safeName.test(category)) {
      return res.status(400).json({ ok: false, message: "Kategori tidak valid." })
    }
    if (!name || !safeName.test(name)) {
      return res.status(400).json({ ok: false, message: "Nama plugin hanya boleh huruf, angka, - dan _." })
    }
    if (!code || !code.trim()) {
      return res.status(400).json({ ok: false, message: "Code plugin tidak boleh kosong." })
    }

    const categoryPath = join(pluginsPath, category)
    if (!existsSync(categoryPath)) mkdirSync(categoryPath, { recursive: true })

    const filePath = join(categoryPath, `${name}.js`)

    if (existsSync(filePath) && !force) {
      return res.status(409).json({ ok: false, message: `Plugin "${name}" sudah ada di kategori "${category}".`, exists: true })
    }

    writeFileSync(filePath, code)
    res.json({ ok: true, message: `Plugin "${name}" berhasil disimpan. Hot-reload otomatis memuatnya dalam beberapa saat.` })
  })

  app.delete("/api/plugins/:name", requireAuth, (req, res) => {
    const { name } = req.params

    if (!safeName.test(name)) {
      return res.status(400).json({ ok: false, message: "Nama plugin tidak valid." })
    }

    const found = findPluginFile(name)
    if (!found) {
      return res.status(404).json({ ok: false, message: `Plugin "${name}" tidak ditemukan.` })
    }

    unlinkSync(found.filePath)
    res.json({ ok: true, message: `Plugin "${name}" berhasil dihapus.` })
  })

  app.get("/api/plugins/:name/source", requireAuth, (req, res) => {
    const { name } = req.params
    const found = findPluginFile(name)

    if (!found) {
      return res.status(404).json({ ok: false, message: `Plugin "${name}" tidak ditemukan.` })
    }

    const code = readFileSourceSafe(found.filePath)
    res.json({ ok: true, code })
  })

  // ─── API: Broadcast ──────────────────────────────────────────
  app.post("/api/broadcast", requireAuth, async (req, res) => {
    const { target, message } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ ok: false, message: "Pesan broadcast tidak boleh kosong." })
    }
    if (!["servers", "users", "both"].includes(target)) {
      return res.status(400).json({ ok: false, message: "Target broadcast tidak valid." })
    }

    const result = { servers: { success: 0, failed: 0 }, users: { success: 0, failed: 0 } }

    if (target === "servers" || target === "both") {
      for (const guild of client.guilds.cache.values()) {
        try {
          const channel = await findBroadcastChannel(guild)
          if (!channel) throw new Error("Tidak ada channel yang bisa dikirimi pesan")
          await channel.send({ content: message })
          result.servers.success++
        } catch (error) {
          result.servers.failed++
        }
        await new Promise((r) => setTimeout(r, 400))
      }
    }

    if (target === "users" || target === "both") {
      const userIds = getAllTrackedUserIds()
      for (const userId of userIds) {
        try {
          const user = await client.users.fetch(userId)
          await user.send({ content: message })
          result.users.success++
        } catch (error) {
          result.users.failed++
        }
        await new Promise((r) => setTimeout(r, 400))
      }
    }

    res.json({ ok: true, result })
  })

  app.use((req, res) => res.status(404).render("404", { botName: global.botName }))

  const port = config.port || 3001
  app.listen(port, () => {
    logger.success(`Dashboard berjalan di http://localhost:${port}`)
  })

  return app
}

function readFileSourceSafe(filePath) {
  return readFileSync(filePath, "utf-8")
}
