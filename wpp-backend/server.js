require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const wppconnect = require('@wppconnect-team/wppconnect')

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))
app.use(cors({ origin: [process.env.FRONTEND_ORIGIN, 'http://localhost:5173'].filter(Boolean) }))

const tokensDir = process.env.TOKENS_DIR || path.join(__dirname, 'tokens')
if (!fs.existsSync(tokensDir)) fs.mkdirSync(tokensDir, { recursive: true })

let client = null, status = 'DISCONNECTED', lastQr = null

async function startClient () {
  if (client) return client
  status = 'STARTING'
  client = await wppconnect.create({
    session: process.env.SESSION_NAME || 'default',
    catchQR: (qrCode) => { status = 'QRCODE'; lastQr = `data:image/png;base64,${qrCode}` },
    statusFind: s => console.log('[STATUS]', s),
    headless: true,
    useChrome: true,
    disableWelcome: true,
    tokenStore: 'file',
    folderNameToken: tokensDir,
    puppeteerOptions: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  })
  status = 'CONNECTED'; lastQr = null
  console.log('[WPP] Conectado.')
  return client
}

app.get('/health', (_req, res) => res.json({ ok: true, status, hasClient: !!client }))

app.get('/session/start', async (_req, res) => {
  try {
    if (!client) await startClient()
    if (status === 'CONNECTED') return res.json({ status: 'CONNECTED' })
    if (status === 'QRCODE' && lastQr) return res.json({ status: 'QRCODE', qrcode: lastQr })
    return res.json({ status })
  } catch (e) { res.status(500).json({ error: 'Falha ao iniciar', details: String(e) }) }
})

app.get('/session/status', (_req, res) => res.json({ status, connected: status === 'CONNECTED' }))

app.post('/session/close', async (_req, res) => {
  try { if (client) { await client.close(); client = null; status = 'DISCONNECTED' } res.json({ ok: true, status }) }
  catch (e) { res.status(500).json({ error: 'Falha ao encerrar', details: String(e) }) }
})

app.post('/send-message', async (req, res) => {
  try {
    const { to, message } = req.body
    if (!to || !message) return res.status(400).json({ ok: false, error: 'to e message são obrigatórios' })
    if (!client) await startClient()
    const jid = to.includes('@c.us') ? to : `${to}@c.us`
    const r = await client.sendText(jid, message)
    res.json({ ok: true, result: r })
  } catch (e) { res.status(500).json({ ok: false, error: 'Falha ao enviar', details: String(e) }) }
})

const upload = multer({ dest: 'uploads/' })
app.post('/send-media', upload.single('file'), async (req, res) => {
  try {
    const { to, caption } = req.body
    if (!req.file) return res.status(400).json({ error: 'Arquivo ausente' })
    if (!client) await startClient()
    const filePath = path.resolve(req.file.path)
    const jid = to.includes('@c.us') ? to : `${to}@c.us`
    const r = await client.sendFile(jid, filePath, req.file.originalname, caption || '')
    fs.unlink(filePath, () => {})
    res.json({ ok: true, result: r })
  } catch (e) { res.status(500).json({ ok: false, error: 'Falha ao enviar mídia', details: String(e) }) }
})

const port = process.env.PORT || 3333
app.listen(port, () => console.log(`API rodando em http://localhost:${port}`))