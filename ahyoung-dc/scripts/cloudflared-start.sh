#!/usr/bin/env bash
#
# Ahyoung Discord Bot Base
# Auto-install cloudflared (kalau belum ada) lalu jalankan tunnel pakai token.
# Dipanggil otomatis oleh PM2 lewat ecosystem.config.js — jangan dijalankan manual
# kecuali buat debug.

set -e

if [ -z "$TUNNEL_TOKEN" ] || [ "$TUNNEL_TOKEN" = "GANTI_DENGAN_TUNNEL_TOKEN_KAMU" ]; then
  echo "[cloudflared] TUNNEL_TOKEN belum diisi di ecosystem.config.js — isi dulu sebelum start."
  exit 1
fi

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "[cloudflared] belum terpasang, install dulu..."

  if command -v pkg >/dev/null 2>&1; then
    # Termux
    pkg update -y
    pkg install -y cloudflared

  elif command -v apt >/dev/null 2>&1; then
    # Debian/Ubuntu
    ARCH="$(uname -m)"
    case "$ARCH" in
      x86_64)  DEB_ARCH="amd64" ;;
      aarch64) DEB_ARCH="arm64" ;;
      armv7l)  DEB_ARCH="arm" ;;
      *)
        echo "[cloudflared] arsitektur '$ARCH' belum didukung script ini."
        echo "[cloudflared] install manual dari https://github.com/cloudflare/cloudflared/releases"
        exit 1
        ;;
    esac

    TMP_DEB="/tmp/cloudflared-${DEB_ARCH}.deb"
    curl -fsSL --output "$TMP_DEB" \
      "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${DEB_ARCH}.deb"

    if [ "$(id -u)" -eq 0 ]; then
      dpkg -i "$TMP_DEB" || apt-get install -f -y
    else
      sudo dpkg -i "$TMP_DEB" || sudo apt-get install -f -y
    fi

  else
    echo "[cloudflared] package manager tidak dikenali di sistem ini."
    echo "[cloudflared] install manual dari https://github.com/cloudflare/cloudflared/releases lalu jalankan ulang."
    exit 1
  fi

  echo "[cloudflared] berhasil terpasang: $(cloudflared --version)"
fi

echo "[cloudflared] menjalankan tunnel..."
exec cloudflared tunnel run --token "$TUNNEL_TOKEN"
