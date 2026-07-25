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

export default {
  name: "kick",
  aliases: ["keluarin"],
  category: "Server",
  description: "Kick member dari server",
  guildOnly: true,

  async run({ message, args }) {
    if (!message.member.permissions.has("KickMembers")) {
      return message.reply("❌ Kamu tidak punya permission **Kick Members**.")
    }

    const target = message.mentions.members.first()
    if (!target) return message.reply("❌ Tag member yang mau di-kick.")

    if (!target.kickable) return message.reply("❌ Member ini tidak bisa di-kick.")

    const reason = args.slice(1).join(" ") || "Tidak ada alasan"

    await target.kick(reason)

    const embed = createEmbed({
      title: "👢 Member Di-Kick",
      description: `**${target.user.username}** telah di-kick dari server.\n\n**Alasan:** ${reason}`,
      footer: `${global.footer} • oleh ${message.author.username}`
    })

    await message.reply({ embeds: [embed] })
  }
}
