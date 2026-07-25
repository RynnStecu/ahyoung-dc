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
  name: "clear",
  aliases: ["purge", "hapuspesan"],
  category: "Server",
  description: "Hapus pesan massal di channel (maks 100)",
  guildOnly: true,

  async run({ message, args }) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("❌ Kamu tidak punya permission **Manage Messages**.")
    }

    const amount = parseInt(args[0])
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply("❌ Masukkan jumlah pesan antara 1–100.")
    }

    await message.delete().catch(() => {})
    const deleted = await message.channel.bulkDelete(amount, true).catch(() => null)

    if (!deleted) return message.channel.send("❌ Gagal hapus pesan. Pesan mungkin lebih dari 14 hari.")

    const embed = createEmbed({
      title: "🗑️ Pesan Dihapus",
      description: `Berhasil menghapus **${deleted.size}** pesan di channel ini.`,
      footer: `${global.footer} • oleh ${message.author.username}`
    })

    const sent = await message.channel.send({ embeds: [embed] })
    setTimeout(() => sent.delete().catch(() => {}), 4000)
  }
}
