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
  `${name} itu sialan banget, sumpah dah 😭`,
  `Tingkat sial ${name}: ⭐⭐⭐⭐⭐ (max banget)`,
  `${name} kayaknya lahir di hari Jumat ke-13 deh 💀`,
  `Nasib ${name} udah ketulis dari sono-nya: SIAL`,
  `${name} jalan aja bisa ketimpa tiang listrik 😂`,
  `Kalo ${name} beli payung, pasti langsung kemarau`,
  `${name} itu sialnya udah level dewa, ga bisa diobatin`,
  `${name} nemu duit 100rb, eh taunya palsu 😭`,
  `Sialnya ${name} udah masuk buku rekor dunia`,
  `${name} doain orang sukses, eh malah dia yang kena musibah 💀`
]

export default {
  name: "ceksial",
  aliases: ["sial"],
  category: "Fun",
  description: "Cek seberapa sial seseorang",

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
      title: "🍀 Cek Sial",
      description: [
        `**Target:** ${name}`,
        `**Tingkat Sial:** \`${percent}%\``,
        `\`[${bar}]\``,
        ``,
        `> ${roast}`
      ].join("\n"),
      footer: `${global.footer} • just for fun`
    })

    await message.reply({ embeds: [embed] })
  }
}
