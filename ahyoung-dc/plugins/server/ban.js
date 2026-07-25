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
  name: "ban",
  aliases: ["blokir"],
  category: "Server",
  description: "Ban member dari server",
  guildOnly: true,

  async run({ message, args }) {
    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("❌ Kamu tidak punya permission **Ban Members**.")
    }

    const target = message.mentions.members.first()
    if (!target) return message.reply("❌ Tag member yang mau di-ban.")

    if (!target.bannable) return message.reply("❌ Member ini tidak bisa di-ban.")

    const reason = args.slice(1).join(" ") || "Tidak ada alasan"

    await target.ban({ reason })

    const embed = createEmbed({
      title: "🔨 Member Di-Ban",
      description: `**${target.user.username}** telah di-ban dari server.\n\n**Alasan:** ${reason}`,
      footer: `${global.footer} • oleh ${message.author.username}`
    })

    await message.reply({ embeds: [embed] })
  }
}
