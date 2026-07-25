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

import { EmbedBuilder } from "discord.js"

export function createEmbed(options = {}) {
  const embed = new EmbedBuilder()
    .setColor(options.color || global.embedColor)
    .setFooter({ text: options.footer || global.footer })

  if (options.title) embed.setTitle(options.title)
  if (options.description) embed.setDescription(options.description)
  if (options.thumbnail !== false) embed.setThumbnail(options.thumbnail || global.thumbnail || null)
  if (options.fields) embed.addFields(options.fields)
  if (options.image) embed.setImage(options.image)
  if (options.author) embed.setAuthor(options.author)
  if (options.timestamp) embed.setTimestamp()

  return embed
}

export function isOwner(userId) {
  return global.owner.includes(userId)
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatUptime(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  parts.push(`${seconds}s`)

  return parts.join(" ")
}
