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

import { StringSelectMenuBuilder, ActionRowBuilder } from "discord.js"
import { createEmbed, formatUptime, isOwner } from "../../lib/utils.js"

export const categoryIcons = {
  General: "⚙️",
  Fun: "🎉",
  Server: "🛡️",
  Owner: "👑"
}

export default {
  name: "menu",
  aliases: ["help", "m"],
  category: "General",
  description: "Menampilkan daftar command",

  async run({ client, message, usedPrefix }) {
    const prefix = usedPrefix || (Array.isArray(global.prefix) ? global.prefix[0] : global.prefix)

    const categories = {}
    for (const plugin of client.plugins.values()) {
      if (plugin.category === "Owner" && !isOwner(message.author.id)) continue
      const category = plugin.category || "Lainnya"
      if (!categories[category]) categories[category] = []
      categories[category].push(plugin)
    }

    const totalCommands = [...client.plugins.values()].filter(
      (p) => p.category !== "Owner" || isOwner(message.author.id)
    ).length

    const categoryCount = Object.keys(categories).length
    const ping = Math.round(client.ws.ping)
    const uptime = formatUptime(client.uptime)
    const prefixDisplay = Array.isArray(global.prefix) ? global.prefix.join("  ") : global.prefix

    const description = [
      `> Modern Discord Bot Framework`,
      ``,
      `━━━━━━━━━━━━━━━━━━`,
      ``,
      `📊 **Bot Statistics**`,
      ``,
      `⚡ Prefix   :  \`${prefixDisplay}\``,
      `📦 Commands : \`${totalCommands}\``,
      `📁 Category : \`${categoryCount}\``,
      `🏓 Ping     : \`${ping}ms\``,
      `⏱ Uptime   : \`${uptime}\``,
      `🧩 Version  : \`${global.version}\``,
      ``,
      `━━━━━━━━━━━━━━━━━━`,
      ``,
      `📂 **Categories**`,
      ``,
      Object.entries(categories)
        .map(([name, plugins]) => `${categoryIcons[name] || "📁"} **${name}** — \`${plugins.length} cmd\``)
        .join("\n"),
      ``,
      `Pilih kategori melalui menu di bawah.`
    ].join("\n")

    const embed = createEmbed({
      author: {
        name: `🤖 ${global.botName} Discord`,
        iconURL: client.user.displayAvatarURL()
      },
      description: `👋 Halo, **@${message.author.username}**\n\n${description}`,
      thumbnail: global.thumbnail,
      footer: `${global.footer} • Dev: ${global.devName}`
    })

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("menu_category_select")
      .setPlaceholder("📂 Pilih kategori command")
      .addOptions([
        {
          label: "All Menu",
          value: "All",
          emoji: "📋",
          description: "Tampilkan semua command dalam satu tampilan"
        },
        ...Object.keys(categories).map((category) => ({
          label: category,
          value: category,
          emoji: categoryIcons[category] || "📁",
          description: `${categories[category].length} command tersedia`
        }))
      ])

    const row1 = new ActionRowBuilder().addComponents(selectMenu)

    await message.reply({ embeds: [embed], components: [row1] })
  }
}
