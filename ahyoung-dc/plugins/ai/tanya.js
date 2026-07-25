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

const responses = [
  "Menurutku itu ide yang bagus!",
  "Hmm, aku kurang yakin soal itu.",
  "Coba pikirkan lagi dari sudut pandang lain.",
  "Ya, itu benar.",
  "Tidak, itu kurang tepat.",
  "Bisa jadi, tapi perlu dipertimbangkan lebih lanjut.",
  "Aku rasa jawabannya jelas: iya.",
  "Sepertinya tidak semudah itu.",
  "Kemungkinan besar iya.",
  "Aku tidak punya cukup informasi untuk menjawab itu."
]

export default {
  name: "tanya",
  aliases: ["ask", "ai"],
  category: "AI",
  description: "Bertanya pada AI Assistant",

  async run({ message, args }) {
    if (!args.length) {
      await message.reply(`Gunakan format: \`${global.prefix}tanya <pertanyaan>\``)
      return
    }

    const question = args.join(" ")
    const answer = responses[Math.floor(Math.random() * responses.length)]

    const embed = createEmbed({
      title: "🤖 AI Assistant",
      fields: [
        { name: "Pertanyaan", value: question },
        { name: "Jawaban", value: answer }
      ]
    })

    await message.reply({ embeds: [embed] })
  }
}
