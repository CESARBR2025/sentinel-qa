import WebSocket from 'ws'
import { spawn } from 'child_process'

const CDP_PORT = 9225
const URL = process.env.LOGIN_URL || 'http://localhost:3000/login'
const WIDTH = parseInt(process.env.W || '1440', 10)
const HEIGHT = parseInt(process.env.H || '900', 10)

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', `--remote-debugging-port=${CDP_PORT}`,
  `--window-size=${WIDTH},${HEIGHT}`, '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  '--disable-extensions', 'about:blank'
], { stdio: 'ignore' })

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function getTarget() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://localhost:${CDP_PORT}/json`)
      const list = await res.json()
      const page = list.find(t => t.type === 'page' && !t.url.startsWith('devtools://'))
      if (page) return page
    } catch {}
    await sleep(300)
  }
  throw new Error('no page target')
}

function cdp(ws) {
  let id = 0
  const pending = new Map()
  ws.on('message', raw => {
    const msg = JSON.parse(raw.toString())
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
  })
  return (method, params = {}) => new Promise((resolve, reject) => {
    const mid = ++id
    pending.set(mid, m => m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result))
    ws.send(JSON.stringify({ id: mid, method, params }))
  })
}

const target = await getTarget()
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(r => ws.on('open', r))
const send = cdp(ws)

const errors = []
ws.on('message', raw => {
  const msg = JSON.parse(raw.toString())
  if (msg.method === 'Runtime.exceptionThrown' && !msg.params.exceptionDetails.exception) {
    errors.push(msg.params.exceptionDetails.text)
  }
})

await send('Page.enable')
await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false })
await send('Page.navigate', { url: URL })
await sleep(9000)

const evalJS = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true })
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails))
  return r.result.value
}

const geo = await evalJS(`(() => {
  const q = s => document.querySelector(s)
  const g = el => { if (!el) return null; const r = el.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)} }
  return {
    sessionIdText: (q('.login-compact-session')?.innerText || q('.login-topbar')?.innerText || '').replace(/\\s+/g,' ').trim().slice(-16),
    stage: g(q('.login-stage')),
    panelLeft: g(q('.login-panel-left')),
    panelRight: g(q('.login-panel-right')),
    form: g(q('.login-form')),
    formHead: g(q('.login-form-head')),
    stepper: g(q('.login-stepper')),
    main: g(q('.login-main')),
    htmlH: document.documentElement.scrollHeight,
    winH: window.innerHeight,
    bodyOverflowY: getComputedStyle(document.body).overflowY,
    stageOverflow: getComputedStyle(q('.login-stage')).overflow
  }
})()`)

console.log(JSON.stringify({ width: WIDTH, height: HEIGHT, ...geo }, null, 1))
ws.close()
chrome.kill()
process.exit(0)
