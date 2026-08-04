#!/usr/bin/env node
// Auditoría de cobertura de permisos: recorre app/**/page.tsx y app/api/**/route.ts
// buscando llamadas a tienePermiso(...) para detectar rutas que solo dependen
// del gate de sesión del proxy, sin check de sección/acción.
import { readdirSync, statSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const APP_DIR = join(ROOT, 'app')
const OUT_DIR = join(ROOT, 'scripts', 'reportes')
const OUT_FILE = join(OUT_DIR, 'auditoria-permisos.csv')

function walk(dir, matchName, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue
      walk(full, matchName, acc)
    } else if (entry === matchName) {
      acc.push(full)
    }
  }
  return acc
}

// Wrappers conocidos que delegan en core.tienePermiso y con los que algunas
// páginas/route.ts hacen su check de sección en vez de llamar a tienePermiso
// directamente (evita falsos negativos del CSV):
//   - tieneAccesoSeccion(usuarioId, 'seccion')
//   - verificarAcceso<Modulo>Api(usuarioId, 'seccion', 'accion')  (o 'accion')
//   - tieneAccesoAnalisis / tieneAccesoFormatoN  (sección fija implícita)
//   - verificarRol<Modulo>(usuarioId)  (check de rol; sección no literal)
const WRAPPERS_SECCION = [
  // patrón, captura sección?, captura acción?
  [/tieneAccesoSeccion\s*\(\s*[^,]+,\s*['"]([a-zA-Z0-9_]+)['"]/g, true, 'ver'],
  [/verificarAccesoPrevencionApi\s*\(\s*[^,]+,\s*['"]([a-zA-Z0-9_]+)['"]\s*,\s*['"]([a-zA-Z]+)['"]/g, true, true],
  [/verificarAccesoIncidentesApi\s*\(\s*[^,]+,\s*['"]([a-zA-Z]+)['"]/g, 'incidentes', true],
  [/verificarAccesoAnalisisApi\s*\(\s*[^,]+,\s*['"]([a-zA-Z]+)['"]/g, 'analisis', true],
  [/verificarAccesoFormatoNApi\s*\(\s*[^,]+,\s*['"]([a-zA-Z]+)['"]/g, 'formato_n_coordinacion', true],
  [/tieneAccesoAnalisis\s*\(/g, 'analisis', 'ver'],
  [/tieneAccesoFormatoN\s*\(/g, 'formato_n_coordinacion', 'ver'],
]
// Wrappers de rol: marcan cobertura (hay check de autorización por rol), pero
// no exponen una sección literal en el string — se reportan como rol, sin sección.
const WRAPPERS_ROL = [
  /verificarRol[A-Za-z0-9_]+\s*\(/g,
]

function detectarPermiso(contenido) {
  // Busca tienePermiso(<algo>, 'seccion', 'accion') o tienePermiso(<algo>, "seccion", "accion")
  const regex = /tienePermiso\s*\([^,]+,\s*['"]([a-zA-Z0-9_]+)['"]\s*,\s*['"]([a-zA-Z]+)['"]/g
  const matches = [...contenido.matchAll(regex)]
  const secciones = new Set(matches.map(m => m[1]))
  const acciones = new Set(matches.map(m => m[2]))

  let tieneRolCheck = false
  for (const re of WRAPPERS_ROL) {
    if (contenido.match(re)) { tieneRolCheck = true; break }
  }

  for (const [re, seccionCaptura, accionCaptura] of WRAPPERS_SECCION) {
    for (const m of contenido.matchAll(re)) {
      if (seccionCaptura === true) secciones.add(m[1])
      else if (typeof seccionCaptura === 'string') secciones.add(seccionCaptura)
      if (accionCaptura === true) acciones.add(m[2])
      else if (typeof accionCaptura === 'string') acciones.add(accionCaptura)
    }
  }

  const tiene = secciones.size > 0 || tieneRolCheck
  return {
    tiene,
    secciones: [...secciones],
    acciones: [...acciones],
  }
}

function main() {
  const pages = walk(APP_DIR, 'page.tsx')
  const routes = walk(APP_DIR, 'route.ts')

  const filas = [['ruta', 'tipo', 'tienePermisoCheck', 'seccionDetectada', 'accionDetectada']]

  for (const [archivos, tipo] of [[pages, 'page'], [routes, 'route']]) {
    for (const archivo of archivos) {
      const contenido = readFileSync(archivo, 'utf8')
      const { tiene, secciones, acciones } = detectarPermiso(contenido)
      const rutaRelativa = relative(APP_DIR, archivo).replace(/\\/g, '/')
      filas.push([
        rutaRelativa,
        tipo,
        tiene ? 'si' : 'NO',
        secciones.join('|'),
        acciones.join('|'),
      ])
    }
  }

  mkdirSync(OUT_DIR, { recursive: true })
  const csv = filas.map(f => f.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  writeFileSync(OUT_FILE, csv, 'utf8')

  const sinCheck = filas.slice(1).filter(f => f[2] === 'NO')
  console.log(`Total archivos auditados: ${filas.length - 1}`)
  console.log(`Sin check de permiso: ${sinCheck.length}`)
  console.log(`CSV escrito en: ${relative(ROOT, OUT_FILE)}`)
  if (sinCheck.length > 0) {
    console.log('\nRutas sin tienePermiso:')
    for (const f of sinCheck) console.log(`  - ${f[0]} (${f[1]})`)
  }
}

main()
