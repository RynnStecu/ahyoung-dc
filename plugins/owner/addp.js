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

import { existsSync, mkdirSync, writeFileSync, readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { isOwner, createEmbed } from "../../lib/utils.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginsPath = join(__dirname, "..")
const safeName = /^[a-zA-Z0-9_-]+$/

const pendingAddp = new Map()

function getExistingCategories() {
  if (!existsSync(pluginsPath)) return []
  return readdirSync(pluginsPath, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
}

function getPluginsInCategory(category) {
  const dir = join(pluginsPath, category)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith(".js"))
    .map((f) => f.replace(".js", ""))
}

async function writePlugin({ client, message, category, pluginName, code, overwrite = false }) {
  const prefix = Array.isArray(global.prefix) ? global.prefix[0] : global.prefix
  const categoryPath = join(pluginsPath, category)
  if (!existsSync(categoryPath)) mkdirSync(categoryPath, { recursive: true })

  const filePath = join(categoryPath, `${pluginName}.js`)

  if (existsSync(filePath) && !overwrite) {
    const confirmBtn = new ButtonBuilder()
      .setCustomId(`addp_overwrite_confirm:${category}:${pluginName}`)
      .setLabel("Timpa Plugin")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("⚠️")

    const cancelBtn = new ButtonBuilder()
      .setCustomId("addp_overwrite_cancel")
      .setLabel("Batal")
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn)

    const embed = createEmbed({
      title: "⚠️ Plugin Sudah Ada",
      description: [
        `Plugin \`${pluginName}\` sudah ada di kategori \`${category}\`.`,
        "",
        "Apakah kamu ingin **menimpa** plugin yang ada dengan code baru?",
        "",
        `> Gunakan \`${prefix}delp ${pluginName}\` jika hanya ingin menghapus.`
      ].join("\n"),
      footer: `${global.footer} • Dev: ${global.devName}`
    })

    pendingAddp.set(message.author.id, { step: "awaitOverwrite", category, pluginName, code })
    await message.reply({ embeds: [embed], components: [row] })
    return
  }

  writeFileSync(filePath, code)
  pendingAddp.delete(message.author.id)

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const loaded = client.plugins.get(pluginName)
  const action = overwrite ? "ditimpa" : "ditambahkan"

  if (loaded) {
    await message.reply(`✅ Plugin \`${pluginName}\` berhasil ${action} dan dimuat di kategori \`${category}\`.`)
  } else {
    await message.reply(`⚠️ Plugin \`${pluginName}\` ditulis ke \`plugins/${category}/${pluginName}.js\` tapi gagal dimuat. Cek console.`)
  }
}

export default {
  name: "addp",
  aliases: ["addplugin"],
  category: "Owner",
  description: "Menambahkan plugin baru via menu interaktif (khusus owner)",
  pendingAddp,
  writePlugin,

  async run({ client, message, args, usedPrefix }) {
    if (!isOwner(message.author.id)) {
      await message.reply("Command ini khusus untuk owner bot.")
      return
    }

    const prefix = usedPrefix || (Array.isArray(global.prefix) ? global.prefix[0] : global.prefix)
    const state = pendingAddp.get(message.author.id)

    if (state && state.step === "code") {
      const { category, pluginName } = state

      let code = null
      const attachment = message.attachments.find((file) => file.name.endsWith(".js"))

      if (attachment) {
        const response = await fetch(attachment.url)
        code = await response.text()
      } else {
        const match = message.content.match(/```(?:js|javascript)?\n([\s\S]*?)```/)
        if (match) code = match[1]
      }

      if (!code) {
        await message.reply("Sertakan code plugin dalam code block ` ```js ... ``` ` atau lampirkan file .js")
        return
      }

      await writePlugin({ client, message, category, pluginName, code, overwrite: false })
      return
    }

    if (state && state.step === "name") {
      const rawName = message.content.trim()
      if (!safeName.test(rawName)) {
        await message.reply("Nama plugin hanya boleh huruf, angka, `-`, dan `_`.")
        return
      }

      pendingAddp.set(message.author.id, { ...state, step: "code", pluginName: rawName })
      await message.reply(`✅ Plugin: \`${state.category}/${rawName}\`\n\nSekarang kirim code plugin dalam code block \`\`\`js ... \`\`\` atau lampirkan file .js`)
      return
    }

    const categories = getExistingCategories()

    const embed = createEmbed({
      title: "➕ Tambah Plugin Baru",
      description: [
        "Pilih **kategori** plugin menggunakan menu di bawah.",
        "",
        "Kategori yang tersedia:",
        categories.map((c) => `📁 \`${c}\` — ${getPluginsInCategory(c).length} plugin`).join("\n"),
        "",
        `Atau ketik \`${prefix}addp <kategori>/<nama>\` untuk shortcut langsung ke step code.`
      ].join("\n"),
      footer: `${global.footer} • Dev: ${global.devName}`
    })

    const categorySelect = new StringSelectMenuBuilder()
      .setCustomId("addp_category_select")
      .setPlaceholder("📁 Pilih kategori plugin")
      .addOptions(
        categories.map((cat) => ({
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          value: cat,
          emoji: "📁",
          description: `${getPluginsInCategory(cat).length} plugin di kategori ini`
        }))
      )

    const row = new ActionRowBuilder().addComponents(categorySelect)

    await message.reply({ embeds: [embed], components: [row] })
    pendingAddp.set(message.author.id, { step: "awaitCategory" })
  }
}
