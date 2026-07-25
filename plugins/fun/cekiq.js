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

function getLabel(iq) {
  if (iq >= 140) return { label: "Jenius", emoji: "🧠✨" }
  if (iq >= 120) return { label: "Di atas rata-rata", emoji: "📈" }
  if (iq >= 100) return { label: "Normal", emoji: "😐" }
  if (iq >= 80) return { label: "Di bawah rata-rata", emoji: "📉" }
  if (iq >= 60) return { label: "Butuh bantuan", emoji: "🆘" }
  return { label: "Batu lebih pintar", emoji: "🪨💀" }
}

const roasts = (name, iq) => {
  if (iq >= 140) return [`${name} ini langka banget, IQ segini jarang ada`, `${name} mending jadi ilmuwan deh`]
  if (iq >= 120) return [`${name} lumayan juga otaknya`, `${name} di atas rata-rata, respect`]
  if (iq >= 100) return [`${name} biasa aja sih, standar manusia normal`, `${name} oke lah, ga bego ga pinter`]
  if (iq >= 80) return [`${name} otaknya kayak sinyal 1 bar, ada tapi ga berguna`, `${name} mikir lambat, tapi tetep mikir sih`]
  if (iq >= 60) return [`${name} IQ-nya udah di bawah suhu ruangan 💀`, `${name} kalah sama kucing nalar-nya`]
  return [`${name} IQ-nya negatif, itu bisa terjadi ternyata 💀`, `${name} batu lebih produktif dari otaknya`]
}

export default {
  name: "cekiq",
  aliases: ["iq"],
  category: "Fun",
  description: "Cek IQ seseorang",

  async run({ message, args }) {
    const mention = message.mentions.members.first()
    const name = mention
      ? `@${mention.user.username}`
      : args.join(" ") || message.author.username

    const iq = Math.floor(Math.random() * 181) + 20
    const { label, emoji } = getLabel(iq)
    const list = roasts(name, iq)
    const roast = list[Math.floor(Math.random() * list.length)]

    const embed = createEmbed({
      title: "🧪 Cek IQ",
      description: [
        `**Target:** ${name}`,
        `**IQ:** \`${iq}\` ${emoji}`,
        `**Status:** ${label}`,
        ``,
        `> ${roast}`
      ].join("\n"),
      footer: `${global.footer} • just for fun`
    })

    await message.reply({ embeds: [embed] })
  }
}
