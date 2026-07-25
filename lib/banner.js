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
import figlet from "figlet"

export function printBanner(totalCommands) {
  console.clear()

  const title = figlet.textSync(global.botName, { font: "Standard" })
  console.log(chalk.cyanBright(title))

  console.log(chalk.whiteBright(" ╭──────────────────────────────────────────────────╮"))
  console.log(chalk.whiteBright(" │ ") + chalk.cyanBright("Developer  : ") + chalk.yellow(global.devName))
  console.log(chalk.whiteBright(" │ ") + chalk.cyanBright("Telegram   : ") + chalk.blueBright(global.devTelegram))
  console.log(chalk.whiteBright(" │ ") + chalk.cyanBright("Website    : ") + chalk.magenta(global.devWebsite))
  console.log(chalk.whiteBright(" │ ") + chalk.cyanBright("WhatsApp   : ") + chalk.greenBright(global.devWhatsapp))
  console.log(chalk.whiteBright(" ╰──────────────────────────────────────────────────╯\n"))

  console.log(chalk.bgGreen.black(" DONE ") + chalk.green(` ${totalCommands} commands loaded successfully.\n`))
}
