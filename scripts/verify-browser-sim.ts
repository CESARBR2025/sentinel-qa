import { listarUsuariosSesionDev } from '@/lib/auth/actions'
import { query } from '@/lib/db'

;(async () => {
  const [A, B] = await listarUsuariosSesionDev()
  const jar: Record<string, string> = {}

  function aplicar(setCookies: string[]) {
    for (const sc of setCookies) {
      const part = sc.split(';')[0]
      const eq = part.indexOf('=')
      if (eq === -1) continue
      const name = part.slice(0, eq).trim()
      const value = part.slice(eq + 1).trim()
      const low = sc.toLowerCase()
      if (low.includes('max-age=0') || low.includes('expires=thu, 01 jan 1970')) delete jar[name]
      else jar[name] = value
    }
  }
  function header() {
    return Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ')
  }

  // login A
  let r = await fetch('http://localhost:3000/api/dev/cambiar-sesion', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: A.id }), redirect: 'manual',
  })
  aplicar(r.headers.getSetCookie())
  const tokA = decodeURIComponent((jar['better-auth.session_token'] ?? '').split('.')[0])

  // poblar cache de sesión A
  r = await fetch('http://localhost:3000/api/auth/get-session', { headers: { cookie: header() } })
  const sA = await r.json()
  aplicar(r.headers.getSetCookie())
  const cacheAntes = Object.keys(jar).filter(k => k.includes('session_data')).length
  console.log('get-session(A) =', sA.session?.user?.name ?? 'NULL', '| chunks cache antes:', cacheAntes)

  // switch A → B
  r = await fetch('http://localhost:3000/api/dev/cambiar-sesion', {
    method: 'POST', headers: { 'Content-Type': 'application/json', cookie: header() },
    body: JSON.stringify({ userId: B.id }), redirect: 'manual',
  })
  aplicar(r.headers.getSetCookie())
  const cacheDespues = Object.keys(jar).filter(k => k.includes('session_data')).length
  console.log('switch a B:', r.status, '| chunks cache después:', cacheDespues)

  // get-session(B)
  r = await fetch('http://localhost:3000/api/auth/get-session', { headers: { cookie: header() } })
  const sB = await r.json()
  console.log('get-session(B) =', sB.session?.user?.name ?? 'NULL')

  // verificar revocación de A
  const rowA = await query('SELECT user_id FROM sessions WHERE token = $1', [tokA])
  console.log('sesión A revocada:', rowA.rows.length === 0 ? 'SI ✔' : 'NO ✘')
  console.log('===', sB.session?.user?.id === B.id ? 'SWITCH FUNCIONA ✔' : 'SWITCH FALLA ✘', '===')
  process.exit(0)
})().catch((e) => { console.error('ERR', e.message); process.exit(1) })
