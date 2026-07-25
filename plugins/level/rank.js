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

import { AttachmentBuilder } from "discord.js"
import canvacard from "canvacard"
import { getUser, getRequiredXP, getLeaderboard } from "../../lib/db.js"

export default {
  name: "rank",
  aliases: ["profile", "level"],
  category: "Level",
  description: "Menampilkan rank card kamu atau user yang di-mention",
  guildOnly: true,

  async run({ client, message, args }) {
    const target = message.mentions.users.first() ?? message.author

    const member = await message.guild.members.fetch(target.id).catch(() => null)
    if (!member) return message.reply("❌ User tidak ditemukan.").catch(() => {})

    const userData = getUser(target.id, message.guild.id)

    // Rank position
    const lb = getLeaderboard(message.guild.id)
    const rankPos = lb.findIndex(u => u.userId === target.id) + 1

    const requiredXP = getRequiredXP(userData.level)
    const avatarURL = target.displayAvatarURL({ extension: "png", forceStatic: true, size: 256 })

    let bannerURL = null
    try {
      const fetched = await target.fetch(true)
      if (fetched.banner) {
        bannerURL = fetched.bannerURL({ extension: "png", size: 512 })
      }
    } catch {}

    try {
      const rank = new canvacard.Rank()
        .setAvatar(avatarURL)
        .setBorder(["#22274a", "#5865F2"], "vertical")
        .setCurrentXP(userData.xp)
        .setRequiredXP(requiredXP)
        .setRank(rankPos || 1, "RANK", !!rankPos)
        .setLevel(userData.level, "LEVEL")
        .setStatus(member.presence?.status ?? "offline")
        .setProgressBar(["#5865F2", "#EB459E"], "GRADIENT", true)
        .setUsername(target.username, target.discriminator !== "0" ? target.discriminator : null, "#FFFFFF")
        .setCreatedTimestamp(target.createdTimestamp)

      if (bannerURL) rank.setBanner(bannerURL, true)

      const data = await rank.build("Cascadia Code PL")
      const attachment = new AttachmentBuilder(data, { name: "RankCard.png" })

      await message.reply({ files: [attachment] })
    } catch (error) {
      await message.reply(`❌ Gagal membuat rank card: ${error.message}`).catch(() => {})
    }
  }
}
