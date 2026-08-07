import WebSocket from 'ws'
import { spawn } from 'child_process'

const CDP_PORT = 9226
const URL = process.env.LOGIN_URL || 'http://localhost:3000/login?from=%2F'

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', `--remote-debugging-port=${CDP_PORT}`,
  '--window-size=1440,900', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  '--disable-extensions', '--user-data-dir=/tmp/chrome-fresh-' + Date.now(), 'about:blank'
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

const exceptions = []
ws.on('message', raw => {
  const msg = JSON.parse(raw.toString())
  if (msg.method === 'Runtime.exceptionThrown') {
    exceptions.push({
      text: msg.params.exceptionDetails?.text,
      description: msg.params.exceptionDetails?.exception?.description?.slice(0, 400)
    })
  }
})

await send('Page.enable')
await send('Runtime.enable')
await send('Log.enable')
const logs = []
ws.on('message', raw => {
  const msg = JSON.parse(raw.toString())
  if (msg.method === 'Log.entryAdded') {
    const e = msg.params.entry
    if (e.level === 'error') logs.push(e.text.slice(0, 300))
  }
})

await send('Page.navigate', { url: URL })
await sleep(10000)

const state = await send('Runtime.evaluate', { expression: `({
  readyState: document.readyState,
  hasAside: !!document.querySelector('.login-panel-left'),
  hasStageBg: !!document.querySelector('.login-stage-bg'),
  sessionText: (document.querySelector('.login-compact-session')?.innerText || document.querySelector('.login-topbar')?.innerText || '').replace(/\\s+/g,' ').trim().slice(-16)
})`, returnByValue: true })

console.log(JSON.stringify({ state: state.result.value, exceptions, logs }, null, 2))
ws.close()
chrome.kill()
process.exit(0)
