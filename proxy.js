const http = require("http")
const https = require("https")

const server = http.createServer((req, res) => {
  // Разрешаем ВСЕ домены
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  // Для preflight запросов
  if (req.method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  // Получаем URL из запроса
  const url = new URL(req.url, `http://${req.headers.host}`)
  const target = url.searchParams.get("url")

  if (!target) {
    res.writeHead(400)
    res.end("Missing ?url= parameter")
    return
  }

  console.log(`📡 Прокси: ${target}`)

  const proxyReq = (target.startsWith("https") ? https : http).get(target, (proxyRes) => {
    // Копируем заголовки
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
  console.log("🚀 Ваш прокси сервер запущен на http://localhost:8888")
  console.log("📡 Пример использования:")
  console.log("  http://localhost:8888/?url=http://localhost:5501/app.js")
  console.log("  http://localhost:8888/?url=http://localhost:5501/styles.css")
})
