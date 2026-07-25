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

import logger from "../lib/logger.js"
import { printBanner } from "../lib/banner.js"

export default {
  name: "ready",
  once: true,
  async execute(client) {
    if (typeof client.stopSpinner === "function") client.stopSpinner()

    printBanner(client.plugins.size)
    logger.success(`${client.user.tag} berhasil online`)
    logger.info(`Prefix: ${global.prefix} | Total Plugin: ${client.plugins.size}`)

    client.user.setPresence({
      activities: [{ name: `${global.prefix}menu | ${global.botName}` }],
      status: "online"
    })
  }
}
