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

import chalk from "chalk"

const colors = {
  info: chalk.cyan,
  success: chalk.green,
  warn: chalk.yellow,
  error: chalk.red,
  cmd: chalk.magenta,
  dim: chalk.dim,
  bold: chalk.bold
}

function timestamp() {
  return new Date().toLocaleString("id-ID", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })
}

function log(level, color, message) {
  console.log(`${colors[color](`[${timestamp()}] [${level}]`)} ${message}`)
}

function cmd({ botName, username, userId, command }) {
  const line = "─".repeat(40)
  console.log(`\n${colors.cmd(line)}`)
  console.log(colors.cmd(colors.bold("[ CMD USED ]")))
  console.log(`${colors.dim("Bot     :")} ${botName || global.botName || "Bot"}`)
  console.log(`${colors.dim("User    :")} ${username}`)
  console.log(`${colors.dim("ID      :")} ${userId}`)
  console.log(`${colors.dim("CMD     :")} ${colors.bold(command)}`)
  console.log(`${colors.dim("Time    :")} ${timestamp()}`)
  console.log(`${colors.cmd(line)}\n`)
}

function spinner(text) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
  let index = 0

  const interval = setInterval(() => {
    index = (index + 1) % frames.length
    process.stdout.write(`\r${colors.info(frames[index])} ${text}`)
  }, 80)

  return function stop() {
    clearInterval(interval)
    process.stdout.write("\r\x1b[K")
  }
}

const logger = {
  info: (message) => log("INFO", "info", message),
  success: (message) => log("SUCCESS", "success", message),
  warn: (message) => log("WARN", "warn", message),
  error: (message) => log("ERROR", "error", message),
  cmd,
  spinner
}

export default logger
