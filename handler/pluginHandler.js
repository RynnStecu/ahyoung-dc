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

import { readdirSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath, pathToFileURL } from "url"
import chokidar from "chokidar"
import logger from "../lib/logger.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const pluginsPath = join(__dirname, "..", "plugins")
const fileToPluginName = new Map()

function validatePlugin(plugin) {
  return plugin && typeof plugin.name === "string" && typeof plugin.run === "function"
}

function walkPluginFiles(dir) {
  const results = []

  if (!existsSync(dir)) return results

  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      results.push(...walkPluginFiles(fullPath))
    } else if (entry.name.endsWith(".js")) {
      results.push(fullPath)
    }
  }

  return results
}

function registerPlugin(client, plugin) {
  client.plugins.set(plugin.name, plugin)

  if (Array.isArray(plugin.aliases)) {
    for (const alias of plugin.aliases) {
      client.aliases.set(alias, plugin.name)
    }
  }
}

function unregisterPluginByName(client, name) {
  const plugin = client.plugins.get(name)

  if (!plugin) return

  if (Array.isArray(plugin.aliases)) {
    for (const alias of plugin.aliases) {
      client.aliases.delete(alias)
    }
  }

  client.plugins.delete(name)
}

export async function loadPlugin(client, filePath, silent = false) {
  try {
    const url = `${pathToFileURL(filePath).href}?update=${Date.now()}`
    const { default: plugin } = await import(url)

    if (!validatePlugin(plugin)) {
      logger.warn(`Plugin tidak valid: ${filePath}`)
      return
    }

    const previousName = fileToPluginName.get(filePath)
    if (previousName && previousName !== plugin.name) {
      unregisterPluginByName(client, previousName)
    }

    registerPlugin(client, plugin)
    fileToPluginName.set(filePath, plugin.name)

    if (!silent) logger.success(`Plugin dimuat: ${plugin.name}`)
  } catch (error) {
    logger.error(`Gagal memuat plugin ${filePath}: ${error.message}`)
  }
}

export async function loadPlugins(client) {
  const files = walkPluginFiles(pluginsPath)

  for (const file of files) {
    await loadPlugin(client, file, true)
  }

  logger.success(`${client.plugins.size} plugin berhasil dimuat`)
}

export function watchPlugins(client) {
  const watcher = chokidar.watch(pluginsPath, { ignoreInitial: true })

  watcher.on("add", async (filePath) => {
    if (!filePath.endsWith(".js")) return
    await loadPlugin(client, filePath)
  })

  watcher.on("change", async (filePath) => {
    if (!filePath.endsWith(".js")) return
    await loadPlugin(client, filePath)
    logger.info(`Plugin di-reload: ${fileToPluginName.get(filePath)}`)
  })

  watcher.on("unlink", (filePath) => {
    if (!filePath.endsWith(".js")) return

    const name = fileToPluginName.get(filePath)
    if (!name) return

    unregisterPluginByName(client, name)
    fileToPluginName.delete(filePath)
    logger.warn(`Plugin dihapus: ${name}`)
  })

  logger.info("Plugin watcher aktif")
}
