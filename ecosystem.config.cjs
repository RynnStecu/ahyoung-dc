/**
 * Ahyoung Discord Bot Base
 *
 * Created by Kyu
 *
 * Not for sale • Keep this credit
 *
 * PM2 Ecosystem — menjalankan bot + Cloudflare Tunnel sekaligus.
 * Jalankan: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [
    {
      name: "ahyoung-bot",
      script: "index.js",
      interpreter: "node",
      cwd: __dirname,
      autorestart: true,
      watch: false,
      max_restarts: 15,
      restart_delay: 3000,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "ahyoung-tunnel",
      script: "./scripts/cloudflared-start.sh",
      interpreter: "bash",
      cwd: __dirname,
      autorestart: true,
      watch: false,
      max_restarts: 15,
      restart_delay: 3000,
      env: {
        // Token tunnel dari Cloudflare Zero Trust → Networks → Tunnels → (tunnel kamu) → Configure
        TUNNEL_TOKEN: "GANTI_DENGAN_TUNNEL_TOKEN_KAMU"
      }
    }
  ]
}
