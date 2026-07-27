import { loadEnvConfig } from '@next/env'
import { Pool } from 'pg'

loadEnvConfig(process.cwd())

const V1_HOST = process.env.EXPEDIENTE_DIGITAL_URL ?? 'https://sanjuandelrio.sytes.net:3044'
const V2_HOST = process.env.EXPEDIENTE_URL!
const V2_API_KEY = (process.env.EXPEDIENTE_API_KEY ?? '').includes(':')
  ? process.env.EXPEDIENTE_API_KEY!.split(':')[1]
  : process.env.EXPEDIENTE_API_KEY
const V2_GUEST_CODE = process.env.EXPEDIENTE_GUEST_CODE!
const ROOT = process.env.EXPEDIENTE_FOLDER ?? 'Centinela'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

let v1Token: string | null = null
let v2Token: string | null = null

async function getV1Token() {
  if (v1Token) return v1Token
  const res = await fetch(`${V1_HOST}/api/auth/guest-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo_invitacion: process.env.EXPEDIENTE_CODIGO_INVITACION ?? 'INV-2026-001', nombre_invitado: 'Migracion' }),
  })
  if (!res.ok) throw new Error(`V1 token error: ${res.status}`)
  const data = await res.json() as { token: string }
  v1Token = data.token
  return v1Token
}

async function getV2Token() {
  if (v2Token) return v2Token
  const res = await fetch(`${V2_HOST}/api/auth/guest-token`, {
    method: 'POST',
    headers: { 'X-API-Key': V2_API_KEY!, 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo_invitacion: V2_GUEST_CODE, nombre_invitado: 'Migracion' }),
  })
  if (!res.ok) throw new Error(`V2 token error: ${res.status}`)
  const data = await res.json() as { token: string }
  v2Token = data.token
  return v2Token
}

function parseUrl(raw: string): { url: string; v1Path?: string } | null {
  if (!raw || raw === 'NO_DATA') return null
  if (raw.startsWith('exp2://')) return null
  if (raw.startsWith('http')) {
    const u = new URL(raw)
    u.pathname = u.pathname.replace(/\/{2,}/g, '/')
    return { url: u.toString().replace(/\/+$/, ''), v1Path: raw }
  }
  if (raw.startsWith('/')) {
    return { url: `${V1_HOST}${raw.replace(/\/{2,}/g, '/')}`, v1Path: raw }
  }
  return { url: `${V1_HOST}/${raw.replace(/\/{2,}/g, '/')}`, v1Path: raw }
}

async function downloadV1(url: string): Promise<Buffer | null> {
  try {
    const token = await getV1Token()
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      console.log(`  ⚠️  V1 ${res.status} para: ${url.slice(0, 80)}`)
      return null
    }
    return Buffer.from(await res.arrayBuffer())
  } catch (err) {
    console.log(`  ⚠️  Error descargando: ${(err as Error).message.slice(0, 60)}`)
    return null
  }
}

async function uploadV2(buffer: Buffer, fileName: string, folderPath: string): Promise<string | null> {
  try {
    const token = await getV2Token()
    const form = new FormData()
    const blob = new Blob([buffer as BlobPart])
    form.append('folderPath', folderPath)
    form.append('file', blob, fileName)
    const res = await fetch(`${V2_HOST}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) {
      console.log(`  ⚠️  V2 ${res.status} subiendo: ${fileName}`)
      return null
    }
    const data = await res.json() as { success: boolean; file: { uuid: string } }
    const uuid = data.file.uuid
    return `exp2://${folderPath}#${uuid}`
  } catch (err) {
    console.log(`  ⚠️  Error subiendo: ${(err as Error).message.slice(0, 60)}`)
    return null
  }
}

function carpeta(modulo: string, id: string): string {
  const now = new Date()
  const YYYY = now.getFullYear().toString()
  const MM = String(now.getMonth() + 1).padStart(2, '0')
  return `${ROOT}/${modulo}/${YYYY}/${MM}/${id}`
}

async function migrarTabla(desc: string, rows: { id: string; url: string }[], updateSql: string, modulo: string) {
  console.log(`\n📁 ${desc}: ${rows.length} archivo(s)`)
  let ok = 0, fail = 0, skip = 0
  for (const row of rows) {
    const parsed = parseUrl(row.url)
    if (!parsed) { skip++; continue }
    const buffer = await downloadV1(parsed.url)
    if (!buffer) { fail++; continue }
    const fileName = row.url.split('/').pop() || `file_${row.id.slice(0, 8)}`
    const folderPath = carpeta(modulo, row.id)
    const ref = await uploadV2(buffer, fileName, folderPath)
    if (!ref) { fail++; continue }
    await pool.query(updateSql, [ref, row.id])
    ok++
    if (ok % 5 === 0) console.log(`  Progreso: ${ok}/${rows.length}`)
  }
  console.log(`  ✅ ${ok} migrados, ❌ ${fail} fallaron, ⏭️ ${skip} saltados`)
}

async function main() {
  console.log('🚚 Migración archivos legacy v1 → v2')
  console.log(`V1: ${V1_HOST}`)
  console.log(`V2: ${V2_HOST}`)
  console.log('')

  // ── evidencias_detenido ──────────────────────────────────────
  const eds = (await pool.query(
    `SELECT id, url_archivo as url FROM evidencias_detenido WHERE url_archivo IS NOT NULL AND url_archivo != '' AND url_archivo NOT LIKE 'exp2://%'`
  )).rows
  await migrarTabla(
    'evidencias_detenido',
    eds,
    'UPDATE evidencias_detenido SET url_archivo = $1 WHERE id = $2',
    'detenidos',
  )

  // ── moni_evidencias_denuncia ─────────────────────────────────
  const meds = (await pool.query(
    `SELECT id, url_archivo as url FROM moni_evidencias_denuncia WHERE url_archivo IS NOT NULL AND url_archivo != '' AND url_archivo NOT LIKE 'exp2://%'`
  )).rows
  await migrarTabla(
    'moni_evidencias_denuncia',
    meds,
    'UPDATE moni_evidencias_denuncia SET url_archivo = $1 WHERE id = $2',
    'evidencias',
  )

  // ── via.v2_documentos_liberacion ────────────────────────────
  const docs = (await pool.query(
    `SELECT id, url_documento as url FROM via.v2_documentos_liberacion WHERE url_documento IS NOT NULL AND url_documento != '' AND url_documento NOT LIKE 'exp2://%'`
  )).rows
  await migrarTabla(
    'via.v2_documentos_liberacion',
    docs,
    'UPDATE via.v2_documentos_liberacion SET url_documento = $1 WHERE id = $2',
    'liberaciones',
  )

  // ── via.v2_infracciones - url_oficio_fiscalia ───────────────
  const fisc = (await pool.query(
    `SELECT id, url_oficio_fiscalia as url FROM via.v2_infracciones WHERE url_oficio_fiscalia IS NOT NULL AND url_oficio_fiscalia != '' AND url_oficio_fiscalia NOT LIKE 'exp2://%'`
  )).rows
  await migrarTabla(
    'via.v2_infracciones.url_oficio_fiscalia',
    fisc,
    'UPDATE via.v2_infracciones SET url_oficio_fiscalia = $1 WHERE id = $2',
    'oficios',
  )

  // ── via.v2_infracciones - url_orden_salida_liberaciones ─────
  const ords = (await pool.query(
    `SELECT id, url_orden_salida_liberaciones as url FROM via.v2_infracciones WHERE url_orden_salida_liberaciones IS NOT NULL AND url_orden_salida_liberaciones != '' AND url_orden_salida_liberaciones NOT LIKE 'exp2://%'`
  )).rows
  await migrarTabla(
    'via.v2_infracciones.url_orden_salida_liberaciones',
    ords,
    'UPDATE via.v2_infracciones SET url_orden_salida_liberaciones = $1 WHERE id = $2',
    'orden-salida',
  )

  // ── via.v2_infracciones - url_oficio_pago_corralon ──────────
  const cors = (await pool.query(
    `SELECT id, url_oficio_pago_corralon as url FROM via.v2_infracciones WHERE url_oficio_pago_corralon IS NOT NULL AND url_oficio_pago_corralon != '' AND url_oficio_pago_corralon NOT LIKE 'exp2://%'`
  )).rows
  await migrarTabla(
    'via.v2_infracciones.url_oficio_pago_corralon',
    cors,
    'UPDATE via.v2_infracciones SET url_oficio_pago_corralon = $1 WHERE id = $2',
    'corralon',
  )

  // ── medidas_proteccion - archivo_prorroga_url ───────────────
  const medsProt = (await pool.query(
    `SELECT id, archivo_prorroga_url as url FROM medidas_proteccion WHERE archivo_prorroga_url IS NOT NULL AND archivo_prorroga_url != '' AND archivo_prorroga_url NOT LIKE 'exp2://%'`
  )).rows
  await migrarTabla(
    'medidas_proteccion.archivo_prorroga_url',
    medsProt,
    'UPDATE medidas_proteccion SET archivo_prorroga_url = $1 WHERE id = $2',
    'medidas',
  )

  // ── seguimientos_busqueda - archivo_url ─────────────────────
  const segs = (await pool.query(
    `SELECT id, archivo_url as url FROM seguimientos_busqueda WHERE archivo_url IS NOT NULL AND archivo_url != '' AND archivo_url NOT LIKE 'exp2://%'`
  )).rows
  await migrarTabla(
    'seguimientos_busqueda.archivo_url',
    segs,
    'UPDATE seguimientos_busqueda SET archivo_url = $1 WHERE id = $2',
    'busquedas',
  )

  // ── contestaciones - archivo_pdf_url ────────────────────────
  const conts = (await pool.query(
    `SELECT id, archivo_pdf_url as url FROM contestaciones WHERE archivo_pdf_url IS NOT NULL AND archivo_pdf_url != '' AND archivo_pdf_url NOT LIKE 'exp2://%'`
  )).rows
  await migrarTabla(
    'contestaciones.archivo_pdf_url',
    conts,
    'UPDATE contestaciones SET archivo_pdf_url = $1 WHERE id = $2',
    'contestaciones',
  )

  // ── via.v2_infracciones - evidencias (JSON array) ───────────
  const evids = (await pool.query(
    `SELECT id, evidencias FROM via.v2_infracciones WHERE evidencias IS NOT NULL AND evidencias::text != '[]' AND evidencias::text NOT LIKE '%exp2://%'`
  )).rows
  console.log(`\n📁 via.v2_infracciones.evidencias (JSON): ${evids.length} registro(s)`)
  let evOk = 0, evFail = 0
  for (const row of evids) {
    try {
      const arr = JSON.parse(row.evidencias)
      if (!Array.isArray(arr) || !arr.length) continue
      const arr2: string[] = []
      for (const ruta of arr) {
        if (typeof ruta !== 'string') { arr2.push(ruta); continue }
        if (ruta.startsWith('exp2://')) { arr2.push(ruta); continue }
        const parsed = parseUrl(ruta)
        if (!parsed) { arr2.push(ruta); continue }
        const buffer = await downloadV1(parsed.url)
        if (!buffer) { arr2.push(ruta); continue }
        const fileName = ruta.split('/').pop() || `evidencia_${row.id.slice(0, 8)}`
        const folderPath = carpeta('via-evidencias', row.id)
        const ref = await uploadV2(buffer, fileName, folderPath)
        arr2.push(ref || ruta)
        if (ref) evOk++
      }
      await pool.query('UPDATE via.v2_infracciones SET evidencias = $1::jsonb WHERE id = $2', [JSON.stringify(arr2), row.id])
    } catch {
      evFail++
    }
  }
  console.log(`  ✅ ${evOk} evidencias migradas, ❌ ${evFail} fallaron`)

  await pool.end()
  console.log('\n🏁 Migración completada')
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
