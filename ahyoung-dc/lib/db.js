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

import Database from "better-sqlite3"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, "..", "data.db"))

db.pragma("journal_mode = WAL")

db.exec(`
  CREATE TABLE IF NOT EXISTS levels (
    userId    TEXT NOT NULL,
    guildId   TEXT NOT NULL,
    xp        INTEGER NOT NULL DEFAULT 0,
    totalXp   INTEGER NOT NULL DEFAULT 0,
    level     INTEGER NOT NULL DEFAULT 0,
    lastXpAt  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (userId, guildId)
  )
`)

// ─── Prepared statements ───────────────────────────────────────
const stmtGet = db.prepare("SELECT * FROM levels WHERE userId = ? AND guildId = ?")
const stmtUpsert = db.prepare(`
  INSERT INTO levels (userId, guildId, xp, totalXp, level, lastXpAt)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT (userId, guildId) DO UPDATE SET
    xp = excluded.xp,
    totalXp = excluded.totalXp,
    level = excluded.level,
    lastXpAt = excluded.lastXpAt
`)
const stmtTop = db.prepare(`
  SELECT * FROM levels WHERE guildId = ?
  ORDER BY level DESC, totalXp DESC
  LIMIT 10
`)
const stmtAllUsersInGuild = db.prepare(`
  SELECT * FROM levels WHERE guildId = ?
  ORDER BY level DESC, totalXp DESC
`)
const stmtDistinctGuilds = db.prepare(`SELECT DISTINCT guildId FROM levels`)
const stmtDistinctUsers = db.prepare(`SELECT DISTINCT userId FROM levels`)
const stmtCountUsers = db.prepare(`SELECT COUNT(*) AS total FROM levels`)

// ─── Helpers ───────────────────────────────────────────────────

export function getRequiredXP(level) {
  return 300 * Math.pow(2, level)
}

export function getUser(userId, guildId) {
  return stmtGet.get(userId, guildId) ?? {
    userId,
    guildId,
    xp: 0,
    totalXp: 0,
    level: 0,
    lastXpAt: 0
  }
}

export function saveUser(data) {
  stmtUpsert.run(data.userId, data.guildId, data.xp, data.totalXp, data.level, data.lastXpAt)
}

export function getLeaderboard(guildId) {
  return stmtTop.all(guildId)
}

/**
 * Semua user yang punya data level di satu guild (buat halaman "List User" dashboard)
 */
export function getAllUsersInGuild(guildId) {
  return stmtAllUsersInGuild.all(guildId)
}

/**
 * Semua guildId yang punya data level tersimpan
 */
export function getAllTrackedGuildIds() {
  return stmtDistinctGuilds.all().map((row) => row.guildId)
}

/**
 * Semua userId unik yang pernah tercatat (lintas server) — dipakai buat broadcast DM
 */
export function getAllTrackedUserIds() {
  return stmtDistinctUsers.all().map((row) => row.userId)
}

/**
 * Total baris user-level di database (buat statistik overview dashboard)
 */
export function getTotalTrackedUsers() {
  return stmtCountUsers.get().total
}

/**
 * Tambahkan XP ke user. Return { leveledUp, oldLevel, newLevel, userData }
 */
export function addXP(userId, guildId, amount) {
  const user = getUser(userId, guildId)
  const now = Math.floor(Date.now() / 1000)
  const cooldown = global.levelConfig?.xpCooldown ?? 45

  if (now - user.lastXpAt < cooldown) {
    return { leveledUp: false, oldLevel: user.level, newLevel: user.level, userData: user }
  }

  user.xp += amount
  user.totalXp += amount
  user.lastXpAt = now

  let leveledUp = false
  let oldLevel = user.level

  while (user.xp >= getRequiredXP(user.level)) {
    user.xp -= getRequiredXP(user.level)
    user.level += 1
    leveledUp = true
  }

  saveUser(user)

  return { leveledUp, oldLevel, newLevel: user.level, userData: user }
}

export default db
