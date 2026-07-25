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

export default {
  name: "ping",
  aliases: ["p"],
  category: "General",
  description: "Menampilkan latency bot",

  async run({ client, message }) {
    const sent = await message.reply("Menghitung ping...")
    const latency = sent.createdTimestamp - message.createdTimestamp
    const apiLatency = Math.round(client.ws.ping)

    await sent.edit(`Pong!\nLatency: ${latency}ms\nAPI Latency: ${apiLatency}ms`)
  }
}
