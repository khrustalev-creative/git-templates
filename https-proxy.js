const https = require("https")
const http = require("http")
const fs = require("fs")

const SSL_OPTIONS = {
  key: fs.readFileSync("ssl/key.pem"),
  cert: fs.readFileSync("ssl/cert.pem"),
}

const server = https.createServer(SSL_OPTIONS, (req, res) => {
  // Разрешаем все домены
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  // Для preflight запросов
  if (req.method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  // Получаем URL из параметра
  const url = new URL(req.url, `https://${req.headers.host}`)
  const targetUrl = url.searchParams.get("url")

  if (!targetUrl) {
    res.writeHead(400)
    res.end("Missing ?url= parameter")
    return
  }

  console.log(`📡 HTTPS Прокси: ${targetUrl}`)

  const proxyReq = (targetUrl.startsWith("https") ? https : http).get(targetUrl, (proxyRes) => {
    // Копируем заголовки и добавляем CORS
    const headers = { ...proxyRes.headers }
    headers["access-control-allow-origin"] = "*"

    res.writeHead(proxyRes.statusCode, headers)
    proxyRes.pipe(res)
  })

  proxyReq.on("error", (err) => {
    console.error("Proxy error:", err.message)
    res.writeHead(500)
    res.end("Proxy error")
  })
})

server.listen(8888, () => {
  console.log("🚀 HTTPS Прокси сервер запущен на https://localhost:8888")
  console.log("⚠️ В браузере нужно принять самоподписанный сертификат")
  console.log("📡 Пример: https://localhost:8888/?url=http://localhost:5501/app.js")
})
