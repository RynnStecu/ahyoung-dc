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

import { readdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { isOwner, createEmbed } from "../../lib/utils.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginsPath = join(__dirname, "..")

export default {
  name: "listp",
  aliases: ["listplugin", "plugins"],
  category: "Owner",
  description: "Menampilkan daftar plugin lengkap dengan status (khusus owner)",

  async run({ client, message }) {
    if (!isOwner(message.author.id)) {
      await message.reply("Command ini khusus untuk owner bot.")
      return
    }

    const categories = readdirSync(pluginsPath, { withFileTypes: true }).filter((entry) => entry.isDirectory())

    const fields = categories.map((category) => {
      const files = readdirSync(join(pluginsPath, category.name)).filter((file) => file.endsWith(".js"))

      const value = files.length
        ? files
            .map((file) => {
              const name = file.replace(".js", "")
              const plugin = client.plugins.get(name)
              const status = plugin ? "✅" : "⚠️"
              const aliasText = plugin?.aliases?.length ? ` (${plugin.aliases.join(", ")})` : ""
              return `${status} \`${name}\`${aliasText}`
            })
            .join("\n")
        : "Kosong"

      return {
        name: `📁 plugins/${category.name}/ (${files.length})`,
        value,
        inline: false
      }
    })

    const embed = createEmbed({
      title: "🗂️ Daftar Plugin Terpasang",
      description: `Total plugin aktif: **${client.plugins.size}**\n✅ = aktif  ⚠️ = gagal dimuat`,
      fields
    })

    await message.reply({ embeds: [embed] })
  }
}
