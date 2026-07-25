// ─── Add Plugin ────────────────────────────────────────────────
const addPluginForm = document.getElementById("addPluginForm")

if (addPluginForm) {
  addPluginForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const msgEl = document.getElementById("addPluginMsg")
    const formData = new FormData(addPluginForm)
    const body = Object.fromEntries(formData.entries())

    msgEl.textContent = "Menyimpan..."
    msgEl.className = "form-msg"

    const result = await submitPlugin(body)

    if (result.status === 409) {
      const confirmOverwrite = confirm(`${result.data.message}\n\nTimpa plugin yang ada?`)
      if (confirmOverwrite) {
        const forced = await submitPlugin({ ...body, force: true })
        showPluginMsg(msgEl, forced)
      } else {
        msgEl.textContent = "Dibatalkan."
        msgEl.className = "form-msg"
      }
      return
    }

    showPluginMsg(msgEl, result)
  })
}

async function submitPlugin(body) {
  const res = await fetch("/api/plugins", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
  const data = await res.json()
  return { status: res.status, data }
}

function showPluginMsg(msgEl, result) {
  msgEl.textContent = result.data.message
  msgEl.className = `form-msg ${result.data.ok ? "success" : "error"}`
  if (result.data.ok) {
    setTimeout(() => window.location.reload(), 1200)
  }
}

// ─── Delete Plugin ─────────────────────────────────────────────
async function deletePlugin(name) {
  if (!confirm(`Hapus plugin "${name}"? Aksi ini tidak bisa dibatalkan.`)) return

  const res = await fetch(`/api/plugins/${encodeURIComponent(name)}`, { method: "DELETE" })
  const data = await res.json()

  alert(data.message)
  if (data.ok) window.location.reload()
}

// ─── View Plugin Source ────────────────────────────────────────
async function viewPluginSource(name) {
  const res = await fetch(`/api/plugins/${encodeURIComponent(name)}/source`)
  const data = await res.json()

  if (!data.ok) {
    alert(data.message)
    return
  }

  document.getElementById("sourceModalTitle").textContent = name
  document.getElementById("sourceModalCode").textContent = data.code
  document.getElementById("sourceModal").classList.remove("hidden")
}

function closeModal() {
  document.getElementById("sourceModal")?.classList.add("hidden")
}

// ─── Broadcast ──────────────────────────────────────────────────
const broadcastForm = document.getElementById("broadcastForm")

if (broadcastForm) {
  broadcastForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const msgEl = document.getElementById("broadcastMsg")
    const resultEl = document.getElementById("broadcastResult")
    const submitBtn = document.getElementById("broadcastSubmit")
    const formData = new FormData(broadcastForm)
    const body = Object.fromEntries(formData.entries())

    if (!confirm("Kirim broadcast ini sekarang? Pesan akan langsung terkirim.")) return

    submitBtn.disabled = true
    submitBtn.textContent = "Mengirim..."
    msgEl.textContent = ""
    resultEl.classList.add("hidden")

    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      const data = await res.json()

      if (!data.ok) {
        msgEl.textContent = data.message
        msgEl.className = "form-msg error"
        return
      }

      const r = data.result
      let html = ""
      if (body.target === "servers" || body.target === "both") {
        html += `🌐 Server — ✅ ${r.servers.success} berhasil, ❌ ${r.servers.failed} gagal<br/>`
      }
      if (body.target === "users" || body.target === "both") {
        html += `👤 User (DM) — ✅ ${r.users.success} berhasil, ❌ ${r.users.failed} gagal`
      }

      resultEl.innerHTML = html
      resultEl.classList.remove("hidden")
      broadcastForm.reset()
    } catch (error) {
      msgEl.textContent = "Terjadi error saat mengirim broadcast."
      msgEl.className = "form-msg error"
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = "📢 Kirim Broadcast"
    }
  })
}
