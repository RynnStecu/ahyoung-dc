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

const noOtak = (name) => [
  `${name} ga punya otak, udah dicek MRI hasilnya kosong`,
  `Dokter bilang otak ${name} lagi dalam perjalanan, tapi kayaknya nyasar`,
  `${name} minjem otak orang lain aja ga ada yang mau minjemin`,
  `${name} otaknya ketinggalan di rumah, setiap hari`,
  `Scan otak ${name}: not found 404 🪨`,
  `${name} hidupnya baik-baik aja tanpa otak, itu yang bikin takut`,
  `${name} udah 20 tahun tanpa otak, masih survive, itu talent`,
  `Otak ${name} resign duluan sebelum dia kerja`
]

const adaOtak = (name) => [
  `${name} punya otak, tapi kayaknya jarang dipake`,
  `${name} otaknya ada, tapi mode-nya selalu standby`,
  `${name} punya otak, cuma baterainya sering low`,
  `${name} otaknya oke, cuma sinyalnya lemah`,
  `${name} punya otak, achievement unlocked: basic human`
]

export default {
  name: "cekotak",
  aliases: ["otak", "cekpikiran"],
  category: "Fun",
  description: "Cek apakah seseorang punya otak",

  async run({ message, args }) {
    const mention = message.mentions.members.first()
    const name = mention
      ? `@${mention.user.username}`
      : args.join(" ") || message.author.username

    const punya = Math.random() > 0.5
    const percent = punya
      ? Math.floor(Math.random() * 51) + 50
      : Math.floor(Math.random() * 30)

    const list = punya ? adaOtak(name) : noOtak(name)
    const roast = list[Math.floor(Math.random() * list.length)]
    const bar = "█".repeat(Math.round(percent / 10)) + "░".repeat(10 - Math.round(percent / 10))

    const embed = createEmbed({
      title: "🧠 Cek Otak",
      description: [
        `**Target:** ${name}`,
        `**Status Otak:** ${punya ? "✅ Ada (sedikit)" : "❌ Tidak ditemukan"}`,
        `**Kapasitas:** \`${percent}%\``,
        `\`[${bar}]\``,
        ``,
        `> ${roast}`
      ].join("\n"),
      footer: `${global.footer} • just for fun`
    })

    await message.reply({ embeds: [embed] })
  }
}
