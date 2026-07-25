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

import { existsSync, readdirSync, unlinkSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { isOwner } from "../../lib/utils.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginsPath = join(__dirname, "..")
const safeName = /^[a-zA-Z0-9_-]+$/

function findPluginFile(name) {
  const categories = readdirSync(pluginsPath, { withFileTypes: true }).filter((entry) => entry.isDirectory())

  for (const category of categories) {
    const filePath = join(pluginsPath, category.name, `${name}.js`)
    if (existsSync(filePath)) return filePath
  }

  return null
}

export default {
  name: "delp",
  aliases: ["delplugin"],
  category: "Owner",
  description: "Menghapus plugin (khusus owner)",

  async run({ client, message, args }) {
    if (!isOwner(message.author.id)) {
      await message.reply("Command ini khusus untuk owner bot.")
      return
    }

    const name = args[0]

    if (!name || !safeName.test(name)) {
      await message.reply(`Gunakan format: \`${global.prefix}delp <nama>\``)
      return
    }

    const filePath = findPluginFile(name)

    if (!filePath) {
      await message.reply(`Plugin \`${name}\` tidak ditemukan.`)
      return
    }

    unlinkSync(filePath)

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!client.plugins.get(name)) {
      await message.reply(`🗑️ Plugin \`${name}\` berhasil dihapus.`)
    } else {
      await message.reply(`⚠️ File plugin \`${name}\` sudah dihapus tapi masih terdaftar di memory. Mungkin perlu restart bot.`)
    }
  }
}
