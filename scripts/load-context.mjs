// scripts/load-context.mjs
// Carga contexto completo de un dominio: docs + source + graph deps
import { readFileSync, existsSync, statSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import yaml from 'js-yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONTEXT_MAP = join(ROOT, '.opencode', 'context-map.yaml')
const GRAPH_JSON = join(ROOT, '.graphify', 'graph.json')

const KEYWORDS = {
  monitorista: ['monitorista', 'evidencia', 'solicitud', 'detenido', 'foto', 'cámara', 'incidente_camara'],
  incidentes: ['911', 'incidente', 'despacho', 'emergencia', 'ciudadano', 'whatsapp', 'rondin', 'bitácora'],
  prevencion: ['prevencion', 'medida', 'busqueda', 'juridico', 'alba', 'ambar', 'solicitud_informacion'],
  admin: ['admin', 'usuario', 'rol', 'permiso', 'administrador'],
  fiscalia: ['fiscalia', 'asegurado', 'puesta_disposicion', 'fge'],
  juzgado: ['juzgado', 'cívico', 'proceso_judicial'],
  infracciones: ['infraccion', 'via', 'corralon', 'garantia', 'pago', 'liberacion_vehiculo'],
  liberaciones: ['liberacion', 'revision_documental', 'orden_pago', 'sa7'],
  flota: ['flota', 'patrulla', 'vehiculo'],
  reportes: ['reporte', 'estadistica', 'formato_n', 'd1', 'sin_novedad', 'camara'],
  oficial: ['oficial', 'reporte_campo', 'recorrido'],
  'rol-servicios': ['rol_servicio', 'estado_fuerza', 'sector'],
  auxiliar: ['auxiliar', 'checklist', 'novedades', 'cuestionario_robo'],
}

function extractDomain(task) {
  if (!task) return null
  const t = task.toLowerCase()
  for (const [domain, keywords] of Object.entries(KEYWORDS)) {
    for (const kw of keywords) {
      if (t.includes(kw)) return domain
    }
  }
  const libMatch = task.match(/lib\/([\w-]+)/)
  if (libMatch) return libMatch[1]
  return null
}

function resolvePath(p, root) {
  const full = join(root, p)
  if (!existsSync(full)) return null

  const stat = statSync(full)
  if (stat.isFile()) return { type: 'file', path: p, full, lines: readFileSync(full, 'utf-8').split('\n').length }
  if (stat.isDirectory()) {
    const files = readdirSync(full).filter(f => f.endsWith('.ts')).sort()
    return {
      type: 'dir', path: p, files: files.map(f => {
        const fp = join(full, f)
        try {
          return { name: f, lines: readFileSync(fp, 'utf-8').split('\n').length }
        } catch { return { name: f, lines: 0 } }
      }),
    }
  }
  return null
}

function queryGraph(domain) {
  if (!existsSync(GRAPH_JSON)) return null
  try {
    const out = execSync(`npx graphify query "what files are in lib/${domain}"`, {
      cwd: ROOT, encoding: 'utf-8', timeout: 15000,
      stdio: ['pipe', 'pipe', 'ignore'],
    })
    const lines = out.trim().split('\n').filter(Boolean)
    const files = lines.filter(l => l.includes('.ts')).filter(l => !l.includes('/node_modules/'))
    return files.length > 0 ? files.slice(0, 10).join('\n') : null
  } catch {
    return null
  }
}

function buildInstructions(domain, entry, graph) {
  let msg = `\n[context-loader] Dominio detectado: "${domain}" → ${entry.label || ''}\n`
  msg += `─${'─'.repeat(55)}\n`

  if (entry.docs?.length) {
    msg += `\n📚 Documentación (${entry.docs.length}):\n`
    for (const p of entry.docs) {
      const r = resolvePath(p, ROOT)
      if (r) msg += `   • ${r.path} (${r.lines} líneas)\n`
    }
  }

  if (entry.lib?.length) {
    msg += `\n📦 Archivos fuente:\n`
    for (const p of entry.lib) {
      const r = resolvePath(p, ROOT)
      if (!r) continue
      if (r.type === 'file') msg += `   • ${r.path} (${r.lines} líneas)\n`
      if (r.type === 'dir') {
        msg += `   • ${r.path}/\n`
        for (const f of r.files) msg += `       └ ${f.name} (${f.lines} líneas)\n`
      }
    }
  }

  if (graph) {
    msg += `\n🔗 Dependencias (Graphify):\n`
    graph.split('\n').slice(0, 8).forEach(l => msg += `   ${l.trim()}\n`)
  }

  if (entry.troubleshoot?.length) {
    msg += `\n⚠️ Errores comunes: ${entry.troubleshoot.join(', ')} → ver boveda/🗺 Roadmap/Troubleshooting.md\n`
  }

  msg += `\n${'─'.repeat(55)}\n💡 Para instrucciones detalladas ejecutar: skill context-loader\n`
  return msg
}

function main() {
  const task = process.argv.slice(2).join(' ')
  if (!task) {
    console.log('[context-loader] No task provided')
    process.exit(1)
  }

  const domain = extractDomain(task)
  if (!domain) {
    console.log('[context-loader] Dominio no detectado. Ejecutar skill context-loader para carga manual.')
    process.exit(0)
  }

  const raw = readFileSync(CONTEXT_MAP, 'utf-8')
  const map = yaml.load(raw)
  const entry = map?.[domain]

  if (!entry) {
    console.log(`[context-loader] Dominio "${domain}" sin entrada en context-map.yaml`)
    process.exit(0)
  }

  const graph = queryGraph(domain)
  const msg = buildInstructions(domain, entry, graph)
  console.log(msg)
}

main()
