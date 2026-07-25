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

import { createEmbed, isOwner } from "../lib/utils.js"
import logger from "../lib/logger.js"

const categoryIcons = {
  General: "⚙️",
  Fun: "🎉",
  Server: "🛡️",
  Owner: "👑"
}

function formatPluginLine(plugin, prefix) {
  const aliases = plugin.aliases?.length ? plugin.aliases.map((a) => `\`${prefix}${a}\``).join(" ") : ""
  return `\`${prefix}${plugin.name}\`` + (aliases ? ` ${aliases}` : "")
}

function formatPrimaryLine(plugin, prefix) {
  return `\`${prefix}${plugin.name}\``
}

export default {
  name: "interactionCreate",
  once: false,
  async execute(client, interaction) {
    const prefix = Array.isArray(global.prefix) ? global.prefix[0] : global.prefix

    if (interaction.isStringSelectMenu() && interaction.customId === "menu_category_select") {
      const category = interaction.values[0]

      if (category === "All") {
        const isOwnerUser = isOwner(interaction.user.id)

        const grouped = {}
        for (const plugin of client.plugins.values()) {
          if (plugin.category === "Owner" && !isOwnerUser) continue
          const cat = plugin.category || "Lainnya"
          if (!grouped[cat]) grouped[cat] = []
          grouped[cat].push(plugin)
        }

        const sections = Object.entries(grouped).map(([cat, plugins]) => {
          const icon = categoryIcons[cat] || "📁"
          const lines = plugins.map((p) => formatPrimaryLine(p, prefix)).join("\n")
          return `${icon} **${cat}**\n${lines}`
        })

        const embed = createEmbed({
          title: "📋 Semua Command",
          description: sections.join("\n\n"),
          thumbnail: global.thumbnail || client.user.displayAvatarURL(),
          author: { name: global.botName, iconURL: client.user.displayAvatarURL() },
          footer: `${global.footer} • Dev: ${global.devName}`
        })

        await interaction.update({ embeds: [embed] }).catch((error) => {
          logger.error(`Gagal update interaction all: ${error.message}`)
        })
        return
      }

      if (category === "Owner" && !isOwner(interaction.user.id)) {
        await interaction.reply({ content: "Kategori ini khusus untuk owner bot.", ephemeral: true }).catch(() => {})
        return
      }

      const plugins = [...client.plugins.values()].filter((p) => p.category === category)

      const lines = plugins.map((p) => formatPluginLine(p, prefix)).join("\n")

      const embed = createEmbed({
        title: `${categoryIcons[category] || "📁"} Kategori: ${category}`,
        description: lines || "Tidak ada command pada kategori ini.",
        thumbnail: global.thumbnail || client.user.displayAvatarURL(),
        author: { name: global.botName, iconURL: client.user.displayAvatarURL() },
        footer: `${global.footer} • Dev: ${global.devName}`
      })

      await interaction.update({ embeds: [embed] }).catch((error) => {
        logger.error(`Gagal update interaction: ${error.message}`)
      })
      return
    }

    if (interaction.isStringSelectMenu() && interaction.customId === "addp_category_select") {
      if (!isOwner(interaction.user.id)) {
        await interaction.reply({ content: "Khusus owner.", ephemeral: true }).catch(() => {})
        return
      }

      const selectedCategory = interaction.values[0]
      const addpPlugin = client.plugins.get("addp")
      if (addpPlugin?.pendingAddp) {
        addpPlugin.pendingAddp.set(interaction.user.id, { step: "name", category: selectedCategory })
      }

      await interaction.update({
        content: `📁 Kategori dipilih: \`${selectedCategory}\`\n\nSekarang kirim **nama plugin** (tanpa spasi, huruf/angka/-/_):`,
        components: [],
        embeds: []
      }).catch(() => {})
      return
    }

    if (interaction.isButton()) {
      const { customId, user } = interaction

      if (customId === "addp_overwrite_cancel") {
        if (!isOwner(user.id)) {
          await interaction.reply({ content: "Khusus owner.", ephemeral: true }).catch(() => {})
          return
        }

        const addpPlugin = client.plugins.get("addp")
        if (addpPlugin?.pendingAddp) addpPlugin.pendingAddp.delete(user.id)

        await interaction.update({ content: "❌ Dibatalkan.", embeds: [], components: [] }).catch(() => {})
        return
      }

      if (customId.startsWith("addp_overwrite_confirm:")) {
        if (!isOwner(user.id)) {
          await interaction.reply({ content: "Khusus owner.", ephemeral: true }).catch(() => {})
          return
        }

        const [, category, pluginName] = customId.split(":")
        const addpPlugin = client.plugins.get("addp")
        const state = addpPlugin?.pendingAddp?.get(user.id)

        if (!state || state.step !== "awaitOverwrite") {
          await interaction.update({ content: "⚠️ Session expired. Ulangi command addp.", embeds: [], components: [] }).catch(() => {})
          return
        }

        await interaction.update({ content: `⏳ Menimpa plugin \`${pluginName}\`...`, embeds: [], components: [] }).catch(() => {})

        const fakeMessage = {
          author: { id: user.id, username: user.username, discriminator: user.discriminator || "0" },
          reply: (content) => interaction.followUp(content).catch(() => {}),
          attachments: new Map()
        }

        await addpPlugin.writePlugin({
          client,
          message: fakeMessage,
          category,
          pluginName,
          code: state.code,
          overwrite: true
        })
        return
      }
    }
  }
}
