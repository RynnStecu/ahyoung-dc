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
import logger from "../lib/logger.js"

export default {
  name: "guildMemberAdd",
  once: false,
  async execute(client, member) {
    const channelId = global.welcomeChannelId
    if (!channelId) return

    const channel = member.guild.channels.cache.get(channelId)
    if (!channel) return

    try {
      const cfg = global.welcomeConfig ?? {}
      const totalMembers = member.guild.memberCount
      const avatarURL = member.user.displayAvatarURL({ extension: "png", forceStatic: true, size: 256 })

      const welcomer = new canvacard.WelcomeLeave()
        .setAvatar(avatarURL)
        .setBackground(cfg.background ? "IMAGE" : "COLOR", cfg.background || "#2c2f33")
        .setTitulo(`Selamat Datang, ${member.user.username}! 👋`, cfg.textColor || "#FFFFFF")
        .setSubtitulo(`Kamu adalah member ke-${totalMembers} di ${member.guild.name}`, cfg.textColor || "#FFFFFF")
        .setOpacityOverlay(0.4)
        .setColorCircle(cfg.circleColor || "#FFFFFF")
        .setColorOverlay(cfg.overlayColor || "#5865F2")
        .setTypeOverlay("ROUNDED")

      const data = await welcomer.build("Cascadia Code PL, Noto Color Emoji")

      const attachment = new AttachmentBuilder(data, { name: "WelcomeCard.png" })

      await channel.send({
        content: `${member} bergabung ke server!`,
        files: [attachment]
      })
    } catch (error) {
      logger.error(`Gagal mengirim welcome card: ${error.message}`)
    }
  }
}
