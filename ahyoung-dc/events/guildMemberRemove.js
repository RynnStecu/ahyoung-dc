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
  name: "guildMemberRemove",
  once: false,
  async execute(client, member) {
    const channelId = global.leaveChannelId || global.welcomeChannelId
    if (!channelId) return

    const channel = member.guild.channels.cache.get(channelId)
    if (!channel) return

    try {
      const cfg = global.leaveConfig ?? {}
      const avatarURL = member.user.displayAvatarURL({ extension: "png", forceStatic: true, size: 256 })

      const leaver = new canvacard.WelcomeLeave()
        .setAvatar(avatarURL)
        .setBackground(cfg.background ? "IMAGE" : "COLOR", cfg.background || "#2c2f33")
        .setTitulo(`Sampai Jumpa, ${member.user.username}! 👋`, cfg.textColor || "#FFFFFF")
        .setSubtitulo(`Semoga kamu kembali lagi ke ${member.guild.name}`, cfg.textColor || "#FFFFFF")
        .setOpacityOverlay(0.5)
        .setColorCircle(cfg.circleColor || "#FFFFFF")
        .setColorOverlay(cfg.overlayColor || "#2c2f33")
        .setTypeOverlay("ROUNDED")

      const data = await leaver.build("Cascadia Code PL, Noto Color Emoji")

      const attachment = new AttachmentBuilder(data, { name: "LeaveCard.png" })

      await channel.send({
        content: `**${member.user.username}** telah meninggalkan server.`,
        files: [attachment]
      })
    } catch (error) {
      logger.error(`Gagal mengirim leave card: ${error.message}`)
    }
  }
}
