#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Auditoría de la REGLA Responsive (ver bóveda → Convenciones → "Responsive").
//
// Escanea app/ + components/ buscando patrones que incumplen la regla y los
// compara contra el allowlist scripts/responsive/exceptions.json:
//   - Archivos FUERA del allowlist → violación NUEVA → exit 1 (gate de CI).
//   - Archivos en el allowlist → deuda permitida (se va limpiando).
//
// Uso:
//   npm run check:responsive          # reporte + gate (exit 1 si hay NUEVAS)
//   npm run check:responsive -- --init  # regenera el baseline (allowlist)
//   npm run check:responsive -- --json  # salida JSON para tooling
// ─────────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const DIRS = ['app', 'components']
const EXCEPTIONS_PATH = join(ROOT, 'scripts', 'responsive', 'exceptions.json')

// Patrones: cada detector recibe el contenido y devuelve true si el archivo
// incumple el patrón. Heurísticos (regex), el ESLint rule es el gate preciso.
const PATTERNS = {
  // gridTemplateColumns inline multi-columna → usar .grid-2/.grid-3
  gridMulticol: {
    label: 'Grid inline multi-columna (usar .grid-2/.grid-3)',
    detect(content) {
      const re = /gridTemplateColumns\s*:\s*['"]([^'"]+)['"]/g
      let m
      while ((m = re.exec(content))) {
        if (esMulticolumna(m[1])) return true
      }
      return false
    },
  },
  // overflow:'hidden' en archivos con tablas (recorta columnas en móvil)
  overflowHidden: {
    label: "overflow:'hidden' en archivo con tabla (usar overflow-x:auto)",
    detect(content) {
      if (!/(<table|>tabla|Tabla)/i.test(content)) return false
      return /overflow\s*:\s*'hidden'|overflowHidden/.test(content)
    },
  },
  // minWidth >= 800 inline SIN contenedor con scroll (.tabla-wrap)
  minWidthGrande: {
    label: 'minWidth grande inline (>= 800px) sin .tabla-wrap',
    detect(content) {
      // Si ya usa el patrón correcto (contenedor con scroll), no es deuda.
      if (/tabla-wrap|overflow-x-auto|overflowX\s*:\s*'auto'/.test(content)) return false
      const re = /minWidth\s*:\s*(\d{3,})/g
      let m
      while ((m = re.exec(content))) {
        if (Number(m[1]) >= 800) return true
      }
      return false
    },
  },
  // padding de página inline '40px 48px'-estilo → usar .pad-pagina/.pad-dashboard
  paddingPagina: {
    label: "padding de página inline (usar .pad-pagina/.pad-dashboard)",
    detect(content) {
      const re = /padding\s*:\s*'(\d+)px\s+(\d+)px'/g
      let m
      while ((m = re.exec(content))) {
        const v = Number(m[1])
        const h = Number(m[2])
        if (v >= 24 && h >= 32) return true
      }
      return false
    },
  },
  // header inline '0 48px'-estilo → usar DashboardHeader/SubHeader
  headerPad: {
    label: "padding de header inline '0 Npx' (usar DashboardHeader/SubHeader)",
    detect(content) {
      const re = /padding\s*:\s*'0\s+(\d+)px'/g
      let m
      while ((m = re.exec(content))) {
        if (Number(m[1]) >= 48) return true
      }
      return false
    },
  },
  // sticky con offset grande hardcodeado (>= 100px) → usar .panel-lateral
  // (top: 0 de headers sticky no aplica)
  stickyOffset: {
    label: 'position:sticky con offset hardcodeado >= 100px (usar .panel-lateral)',
    detect(content) {
      if (!/position\s*:\s*'sticky'/.test(content)) return false
      const re = /top\s*:\s*(\d{2,})/g
      let m
      while ((m = re.exec(content))) {
        if (Number(m[1]) >= 100) return true
      }
      return false
    },
  },
}

function esMulticolumna(valor) {
  if (!valor || typeof valor !== 'string') return false
  if (valor.includes('repeat(')) {
    const m = valor.match(/repeat\(\s*(\d+)/)
    if (m && Number(m[1]) > 1) return true
    if (/repeat\(\s*(auto-fill|auto-fit)/.test(valor)) return true
    return false
  }
  const sinFn = valor
    .replace(/minmax\([^)]*\)/g, 'x')
    .replace(/calc\([^)]*\)/g, 'x')
    .replace(/var\([^)]*\)/g, 'x')
    .replace(/fit-content\([^)]*\)/g, 'x')
  return sinFn.trim().split(/\s+/).filter(Boolean).length > 1
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (entry.endsWith('.tsx')) out.push(p)
  }
  return out
}

function loadExceptions() {
  if (!existsSync(EXCEPTIONS_PATH)) return {}
  try {
    return JSON.parse(readFileSync(EXCEPTIONS_PATH, 'utf8'))
  } catch {
    return {}
  }
}

const files = DIRS.flatMap((d) => {
  const dir = join(ROOT, d)
  return existsSync(dir) ? walk(dir).map((p) => relative(ROOT, p)) : []
})

const findings = {}
for (const [key, pat] of Object.entries(PATTERNS)) {
  findings[key] = files.filter((f) => {
    const content = readFileSync(join(ROOT, f), 'utf8')
    return pat.detect(content)
  })
}

const exceptions = loadExceptions()
const init = process.argv.includes('--init')
const asJson = process.argv.includes('--json')

if (init) {
  const baseline = {}
  for (const [key, list] of Object.entries(findings)) baseline[key] = [...list].sort()
  writeFileSync(EXCEPTIONS_PATH, JSON.stringify(baseline, null, 2) + '\n')
  console.log(`[responsive-audit] Baseline generado: ${EXCEPTIONS_PATH}`)
  process.exit(0)
}

// Clasifica: nueva (fuera del allowlist) vs permitida (deuda)
const result = { nueva: {}, permitida: {} }
let totalNuevas = 0
let totalPermitidas = 0
for (const [key, list] of Object.entries(findings)) {
  const allow = new Set(exceptions[key] ?? [])
  const nueva = list.filter((f) => !allow.has(f))
  const permitida = list.filter((f) => allow.has(f))
  result.nueva[key] = nueva
  result.permitida[key] = permitida
  totalNuevas += nueva.length
  totalPermitidas += permitida.length
}

if (asJson) {
  console.log(JSON.stringify(result, null, 2))
  process.exit(totalNuevas > 0 ? 1 : 0)
}

const line = '='.repeat(60)
console.log(`\n${line}\nAUDITORÍA RESPONSIVE (REGLA)\n${line}`)
for (const [key, pat] of Object.entries(PATTERNS)) {
  const n = result.nueva[key].length
  const p = result.permitida[key].length
  console.log(`\n■ ${pat.label}`)
  console.log(`  Nuevas: ${n} · Deuda permitida: ${p}`)
  if (n > 0) console.log('  NUEVAS → ' + result.nueva[key].join(', '))
  if (p > 0) console.log('  (permitida) ' + result.permitida[key].join(', '))
}
console.log(`\n${line}\nTOTAL: ${totalNuevas} NUEVA(S) violación(es) · ${totalPermitidas} deuda permitida\n${line}`)
if (totalNuevas > 0) {
  console.log('❌ Se incumple la REGLA Responsive. Corrige o actualiza ' + EXCEPTIONS_PATH)
  process.exit(1)
} else {
  console.log('✅ Sin violaciones nuevas a la REGLA Responsive.')
  process.exit(0)
}
