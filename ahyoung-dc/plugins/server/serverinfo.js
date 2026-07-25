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
  name: "serverinfo",
  aliases: ["sinfo", "server"],
  category: "Server",
  description: "Menampilkan info server",
  guildOnly: true,

  async run({ message }) {
    const guild = message.guild
    await guild.members.fetch()

    const owner = await guild.fetchOwner()
    const totalMembers = guild.memberCount
    const bots = guild.members.cache.filter((m) => m.user.bot).size
    const humans = totalMembers - bots
    const channels = guild.channels.cache
    const textCh = channels.filter((c) => c.type === 0).size
    const voiceCh = channels.filter((c) => c.type === 2).size
    const roles = guild.roles.cache.size - 1
    const created = `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`
    const boost = guild.premiumSubscriptionCount || 0
    const boostTier = guild.premiumTier || 0

    const embed = createEmbed({
      title: `🏠 ${guild.name}`,
      thumbnail: guild.iconURL({ dynamic: true }) || false,
      fields: [
        { name: "👑 Owner", value: `${owner.user.username}`, inline: true },
        { name: "🆔 Server ID", value: `\`${guild.id}\``, inline: true },
        { name: "📅 Dibuat", value: created, inline: true },
        { name: "👥 Member", value: `${humans} user · ${bots} bot`, inline: true },
        { name: "📢 Channel", value: `${textCh} text · ${voiceCh} voice`, inline: true },
        { name: "🎭 Roles", value: `${roles} role`, inline: true },
        { name: "💎 Boost", value: `Level ${boostTier} · ${boost} boost`, inline: true }
      ],
      footer: `${global.footer} • Dev: ${global.devName}`
    })

    await message.reply({ embeds: [embed] })
  }
}
