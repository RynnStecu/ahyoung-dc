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
import { getLeaderboard, getRequiredXP } from "../../lib/db.js"

const medals = ["🥇", "🥈", "🥉"]

export default {
  name: "leaderboard",
  aliases: ["lb", "top"],
  category: "Level",
  description: "Menampilkan top 10 level server",
  guildOnly: true,

  async run({ client, message }) {
    const rows = getLeaderboard(message.guild.id)

    if (!rows.length) {
      return message.reply("❌ Belum ada data level di server ini.").catch(() => {})
    }

    const lines = await Promise.all(
      rows.map(async (row, i) => {
        const medal = medals[i] ?? `**${i + 1}.**`
        let username = `<@${row.userId}>`
        try {
          const user = await client.users.fetch(row.userId)
          username = user.username
        } catch {}

        const req = getRequiredXP(row.level)
        return `${medal} **${username}** — Level **${row.level}** · ${row.xp}/${req} XP`
      })
    )

    const embed = createEmbed({
      title: `🏆 Leaderboard Level — ${message.guild.name}`,
      description: lines.join("\n"),
      thumbnail: message.guild.iconURL({ dynamic: true }) || global.thumbnail,
      timestamp: true,
      footer: `${global.footer} • Dev: ${global.devName}`
    })

    await message.reply({ embeds: [embed] })
  }
}
