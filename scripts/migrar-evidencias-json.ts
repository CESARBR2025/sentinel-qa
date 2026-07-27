import { loadEnvConfig } from '@next/env'
import { Pool } from 'pg'

loadEnvConfig(process.cwd())

const V1_HOST = 'https://sanjuandelrio.sytes.net:3044'
const V2_HOST = 'https://sanjuandelrio.sytes.net:3066'
const ROOT = 'Centinela'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function getV1Token() {
  const res = await fetch(`${V1_HOST}/api/auth/guest-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo_invitacion: 'INV-2026-001', nombre_invitado: 'Migracion' }),
  })
  const data = await res.json() as { token: string }
  return data.token
}

async function getV2Token() {
  const key = (process.env.EXPEDIENTE_API_KEY ?? '').includes(':')
    ? process.env.EXPEDIENTE_API_KEY!.split(':')[1]
    : process.env.EXPEDIENTE_API_KEY
  const res = await fetch(`${V2_HOST}/api/auth/guest-token`, {
    method: 'POST',
    headers: { 'X-API-Key': key!, 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo_invitacion: process.env.EXPEDIENTE_GUEST_CODE!, nombre_invitado: 'Migracion' }),
  })
  const data = await res.json() as { token: string }
  return data.token
}

async function main() {
  const v1Token = await getV1Token()
  const v2Token = await getV2Token()

  const rows = (await pool.query(
    `SELECT id, evidencias FROM via.v2_infracciones
     WHERE evidencias IS NOT NULL AND evidencias::text != '[]' AND evidencias::text NOT LIKE '%exp2://%'`
  )).rows

  console.log(`📁 ${rows.length} registros con evidencias JSON legacy`)

  for (const row of rows) {
    const raw = typeof row.evidencias === 'string' ? row.evidencias : JSON.stringify(row.evidencias)
    const arr: string[] = JSON.parse(raw)
    if (!Array.isArray(arr)) continue

    const arr2: string[] = []
    for (const ruta of arr) {
      if (typeof ruta !== 'string' || ruta.startsWith('exp2://')) {
        arr2.push(ruta)
        continue
      }
      const fullUrl = `${V1_HOST}${ruta}`
      const v1res = await fetch(fullUrl, { headers: { Authorization: `Bearer ${v1Token}` }, signal: AbortSignal.timeout(15000) })
      if (!v1res.ok) {
        console.log(`  ⚠️  V1 ${v1res.status} para: ${ruta.slice(-40)}`)
        arr2.push(ruta)
        continue
      }
      const buffer = Buffer.from(await v1res.arrayBuffer())
      const fileName = fullUrl.split('/').pop() || `evidencia_${row.id.slice(0, 8)}`
      const folderPath = `${ROOT}/via/${row.id.slice(0, 8)}`

      const formData = new FormData()
      formData.append('folderPath', folderPath)
      formData.append('file', new Blob([buffer as BlobPart]), fileName)
      const v2res = await fetch(`${V2_HOST}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${v2Token}` },
        body: formData,
        signal: AbortSignal.timeout(30000),
      })
      if (!v2res.ok) {
        console.log(`  ⚠️  V2 ${v2res.status} subiendo: ${fileName.slice(0, 40)}`)
        arr2.push(ruta)
        continue
      }
      const data = await v2res.json() as { success: boolean; file: { uuid: string } }
      arr2.push(`exp2://${folderPath}#${data.file.uuid}`)
      console.log(`  ✅ ${fileName.slice(0, 40)} → ${data.file.uuid.slice(0, 8)}`)
    }

    await pool.query('UPDATE via.v2_infracciones SET evidencias = $1::jsonb WHERE id = $2', [JSON.stringify(arr2), row.id])
  }

  await pool.end()
  console.log('🏁 Completado')
}

main().catch(e => { console.error(e); process.exit(1) })
