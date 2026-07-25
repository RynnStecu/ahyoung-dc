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

const responses = (name) => [
  `${name} itu begonya udah certified, ada sertifikatnya 📜`,
  `Ngobrol sama ${name} bikin IQ kita ikut turun`,
  `${name} baca buku aja hurufnya kabur duluan 😭`,
  `${name} disuruh isi TTS, malah nanya TTS itu apa`,
  `Kalo kebodohan dilombain, ${name} pasti juara 1`,
  `${name} nanya kenapa 2+2=4, bukan 22 💀`,
  `${name} udah sekolah 12 tahun, tapi tetep bego original`,
  `${name} googling cara googling 😂`,
  `${name} bego tapi pede, itu kombinasi paling berbahaya`,
  `Dokter udah nyerah diagnosa ${name}, kasusnya langka`
]

export default {
  name: "cekbego",
  aliases: ["bego", "bodoh"],
  category: "Fun",
  description: "Cek seberapa bego seseorang",

  async run({ message, args }) {
    const mention = message.mentions.members.first()
    const name = mention
      ? `@${mention.user.username}`
      : args.join(" ") || message.author.username

    const percent = Math.floor(Math.random() * 101)
    const list = responses(name)
    const roast = list[Math.floor(Math.random() * list.length)]
    const bar = "█".repeat(Math.round(percent / 10)) + "░".repeat(10 - Math.round(percent / 10))

    const embed = createEmbed({
      title: "🧠 Cek Bego",
      description: [
        `**Target:** ${name}`,
        `**Tingkat Bego:** \`${percent}%\``,
        `\`[${bar}]\``,
        ``,
        `> ${roast}`
      ].join("\n"),
      footer: `${global.footer} • just for fun`
    })

    await message.reply({ embeds: [embed] })
  }
}
