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
import { fileURLToPath, pathToFileURL } from "url"
import logger from "./logger.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function loadEvents(client) {
  const eventsPath = join(__dirname, "..", "events")
  const files = readdirSync(eventsPath).filter((file) => file.endsWith(".js"))

  for (const file of files) {
    const filePath = join(eventsPath, file)
    const { default: event } = await import(pathToFileURL(filePath).href)

    if (!event || !event.name || typeof event.execute !== "function") {
      logger.warn(`Event tidak valid: ${file}`)
      continue
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args))
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args))
    }

    logger.success(`Event dimuat: ${event.name}`)
  }
}
