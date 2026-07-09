// scripts/extract-domain.mjs
// Extrae el dominio de una tarea del usuario basado en .opencode/context-map.yaml
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const KEYWORDS = {
  monitorista: ['monitorista', 'evidencia', 'solicitud', 'detenido', 'foto', 'cámara', 'incidente_camara'],
  incidentes: ['911', 'incidente', 'despacho', 'emergencia', 'atencion', 'ciudadano', 'whatsapp', 'rondin', 'bitácora'],
  prevencion: ['prevencion', 'medida', 'busqueda', 'juridico', 'alba', 'ambar', 'solicitud_informacion'],
  admin: ['admin', 'usuario', 'rol', 'permiso', 'administrador'],
  fiscalia: ['fiscalia', 'asegurado', 'puesta_disposicion', 'fge'],
  juzgado: ['juzgado', 'cívico', 'proceso_judicial'],
  infracciones: ['infraccion', 'via', 'corralon', 'garantia', 'pago', 'liberacion_vehiculo'],
  liberaciones: ['liberacion', 'revision_documental', 'orden_pago', 'sa7'],
  flota: ['flota', 'patrulla', 'vehiculo', 'unidad'],
  reportes: ['reporte', 'estadistica', 'formato_n', 'd1', 'sin_novedad', 'camara'],
  oficial: ['oficial', 'reporte_campo', 'recorrido'],
  'rol-servicios': ['rol_servicio', 'estado_fuerza', 'sector', 'radio', 'bodycam'],
  auxiliar: ['auxiliar', 'checklist', 'novedades', 'cuestionario_robo'],
}

export function extractDomain(task) {
  if (!task) return null
  const t = task.toLowerCase()

  // 1. Búsqueda exacta por nombre de módulo
  for (const [domain, keywords] of Object.entries(KEYWORDS)) {
    for (const kw of keywords) {
      if (t.includes(kw)) return domain
    }
  }

  // 2. Búsqueda por nombre de archivo/lib
  const libMatch = t.match(/lib\/([\w-]+)/)
  if (libMatch) return libMatch[1]

  return null
}

// CLI mode
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const task = process.argv.slice(2).join(' ')
  const domain = extractDomain(task)
  console.log(domain || 'unknown')
}
