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

import "./setting.js"
import { Client, GatewayIntentBits, Partials } from "discord.js"
import { loadEvents } from "./lib/loader.js"
import { loadPlugins, watchPlugins } from "./handler/pluginHandler.js"
import { createDashboard } from "./dashboard/server.js"
import logger from "./lib/logger.js"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel]
})

client.plugins = new Map()
client.aliases = new Map()

async function start() {
  await loadPlugins(client)
  watchPlugins(client)
  await loadEvents(client)

  client.stopSpinner = logger.spinner("Menghubungkan ke Discord...")
  await client.login(global.token)

  createDashboard(client)
}

start().catch((error) => {
  logger.error(`Gagal menjalankan bot: ${error.message}`)
  process.exit(1)
})
