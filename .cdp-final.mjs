import WebSocket from 'ws'
import { spawn } from 'child_process'
const CDP_PORT = 9227
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', `--remote-debugging-port=${CDP_PORT}`,
  '--window-size=1440,900', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  '--disable-extensions', '--user-data-dir=/tmp/chrome-final-' + Date.now(), 'about:blank'
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
  let id = 0; const pending = new Map()
  ws.on('message', raw => { const msg = JSON.parse(raw.toString()); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) } })
  return (method, params = {}) => new Promise((resolve, reject) => { const mid = ++id; pending.set(mid, m => m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result)); ws.send(JSON.stringify({ id: mid, method, params })) })
}
const target = await getTarget()
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise(r => ws.on('open', r))
const send = cdp(ws)
await send('Page.enable'); await send('Runtime.enable')
await send('Page.navigate', { url: process.env.LOGIN_URL })
await sleep(9000)
const r = await send('Runtime.evaluate', { expression: `({
  finalUrl: location.href,
  title: document.title,
  bodySnippet: document.body ? document.body.innerText.replace(/\\s+/g,' ').trim().slice(0,200) : 'NO BODY',
  hasForm: !!document.querySelector('form'),
  inputs: document.querySelectorAll('input').length
})`, returnByValue: true })
console.log(JSON.stringify(r.result.value, null, 2))
ws.close(); chrome.kill(); process.exit(0)
