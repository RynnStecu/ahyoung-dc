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

import { existsSync, readdirSync, readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { AttachmentBuilder } from "discord.js"
import { isOwner, createEmbed } from "../../lib/utils.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginsPath = join(__dirname, "..")
const safeName = /^[a-zA-Z0-9_-]+$/

function findPluginFile(name) {
  const categories = readdirSync(pluginsPath, { withFileTypes: true }).filter((entry) => entry.isDirectory())

  for (const category of categories) {
    const filePath = join(pluginsPath, category.name, `${name}.js`)
    if (existsSync(filePath)) return { filePath, category: category.name }
  }

  return null
}

export default {
  name: "getp",
  aliases: ["getplugin", "srcp"],
  category: "Owner",
  description: "Melihat source code plugin (khusus owner)",

  async run({ message, args }) {
    if (!isOwner(message.author.id)) {
      await message.reply("Command ini khusus untuk owner bot.")
      return
    }

    const name = args[0]

    if (!name || !safeName.test(name)) {
      await message.reply(`Gunakan format: \`${global.prefix}getp <nama>\``)
      return
    }

    const found = findPluginFile(name)

    if (!found) {
      await message.reply(`Plugin \`${name}\` tidak ditemukan.`)
      return
    }

    const code = readFileSync(found.filePath, "utf-8")
    const attachment = new AttachmentBuilder(Buffer.from(code), { name: `${name}.js` })

    const embed = createEmbed({
      title: `📄 Source: ${name}`,
      description: `Kategori: \`${found.category}\`\nPath: \`plugins/${found.category}/${name}.js\``
    })

    await message.reply({ embeds: [embed], files: [attachment] })
  }
}
