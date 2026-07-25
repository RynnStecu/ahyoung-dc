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

import logger from "../lib/logger.js"
import { addXP, getRequiredXP } from "../lib/db.js"
import { createEmbed } from "../lib/utils.js"

async function sendLevelUpLog(client, member, oldLevel, newLevel) {
  const channelId = global.logChannelId
  if (!channelId) return

  const channel = client.channels.cache.get(channelId)
  if (!channel) return

  const embed = createEmbed({
    title: "🎉 Level Up!",
    description: `${member} naik level!`,
    fields: [
      { name: "Level", value: `**${oldLevel}** → **${newLevel}**`, inline: true }
    ],
    thumbnail: member.user.displayAvatarURL({ dynamic: true }),
    color: "#FFD700",
    timestamp: true,
    footer: global.footer
  })

  await channel.send({ embeds: [embed] }).catch(() => {})
}

export default {
  name: "messageCreate",
  once: false,
  async execute(client, message) {
    if (message.author.bot) return

    const prefixes = Array.isArray(global.prefix) ? global.prefix : [global.prefix]

    let usedPrefix = null
    for (const p of prefixes) {
      if (message.content.startsWith(p)) {
        usedPrefix = p
        break
      }
    }

    // ─── EXP dari chat (guild only) ───────────────────────────
    if (message.guild) {
      const cfg = global.levelConfig ?? { xpMin: 10, xpMax: 25 }
      const amount = Math.floor(Math.random() * (cfg.xpMax - cfg.xpMin + 1)) + cfg.xpMin
      const result = addXP(message.author.id, message.guild.id, amount)

      if (result.leveledUp) {
        const member = message.member ?? await message.guild.members.fetch(message.author.id).catch(() => null)
        if (member) {
          await sendLevelUpLog(client, member, result.oldLevel, result.newLevel)
        }
      }
    }
    // ──────────────────────────────────────────────────────────

    const addpPlugin = client.plugins.get("addp")
    if (addpPlugin?.pendingAddp) {
      const state = addpPlugin.pendingAddp.get(message.author.id)
      if (state && (state.step === "name" || state.step === "code") && !usedPrefix) {
        try {
          await addpPlugin.run({ client, message, args: [], usedPrefix: prefixes[0] })
        } catch (error) {
          logger.error(`Gagal menjalankan addp pending: ${error.message}`)
        }
        return
      }
    }

    if (!usedPrefix) return

    const args = message.content.slice(usedPrefix.length).trim().split(/\s+/)
    const commandName = args.shift().toLowerCase()

    if (!commandName) return

    const plugin = client.plugins.get(commandName) || client.plugins.get(client.aliases.get(commandName))

    if (!plugin) return

    if (plugin.guildOnly && !message.guild) {
      message.reply("❌ Command ini hanya bisa dipakai di dalam server, tidak bisa lewat DM.").catch(() => {})
      return
    }

    logger.cmd({
      botName: global.botName,
      username: `${message.author.username}#${message.author.discriminator}`,
      userId: message.author.id,
      command: `${usedPrefix}${commandName}${args.length ? " " + args.join(" ") : ""}`
    })

    try {
      await plugin.run({ client, message, args, usedPrefix })
    } catch (error) {
      logger.error(`Gagal menjalankan plugin ${plugin.name}: ${error.message}`)
      message.reply("Terjadi kesalahan saat menjalankan command ini.").catch(() => {})
    }
  }
}
