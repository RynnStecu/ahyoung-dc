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

import { createEmbed } from "../../lib/utils.js"

const timeUnits = { s: 1000, m: 60000, h: 3600000, d: 86400000 }

function parseDuration(str) {
  const match = str?.match(/^(\d+)([smhd])$/)
  if (!match) return null
  return parseInt(match[1]) * timeUnits[match[2]]
}

export default {
  name: "mute",
  aliases: ["timeout", "diam"],
  category: "Server",
  description: "Timeout member (contoh: !mute @user 10m alasan)",
  guildOnly: true,

  async run({ message, args }) {
    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("❌ Kamu tidak punya permission **Moderate Members**.")
    }

    const target = message.mentions.members.first()
    if (!target) return message.reply("❌ Tag member yang mau di-mute.")

    const duration = parseDuration(args[1])
    if (!duration) return message.reply("❌ Format durasi salah. Contoh: `10m`, `1h`, `2d`, `30s`")

    if (duration > 28 * 24 * 3600000) return message.reply("❌ Maksimal timeout 28 hari.")

    const reason = args.slice(2).join(" ") || "Tidak ada alasan"

    await target.timeout(duration, reason)

    const embed = createEmbed({
      title: "🔇 Member Di-Mute",
      description: `**${target.user.username}** di-timeout selama \`${args[1]}\`.\n\n**Alasan:** ${reason}`,
      footer: `${global.footer} • oleh ${message.author.username}`
    })

    await message.reply({ embeds: [embed] })
  }
}
