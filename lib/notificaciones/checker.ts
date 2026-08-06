import { query } from '@/lib/db'
import { calcularFechaEsperada, getLabelSeguimiento } from '@/lib/prevencion/timeline'
import { emitir } from './emisor'
import { enviarPush } from '@/lib/push/service'
import { candidatasEscalacion, marcarEscalada } from './repository'

const HITOS_ALERTAR = ['CONTESTACION_INICIAL', '24H', '48H', '72H'] as const
const UNA_HORA_MS   = 60 * 60 * 1000

// Cuánto tiempo sin ninguna lectura antes de reintentar el push. Ajustar solo
// junto con el schedule real del cron — escalar antes de lo que el cron
// puede detectar no tiene efecto.
const UMBRAL_ESCALACION_MINUTOS = 5

/**
 * Genera las alertas de plazo de las fichas de búsqueda activas.
 *
 * Antes esto corría en CADA GET de /api/notificaciones, con el cliente
 * polleando cada 2 minutos: un escaneo de fichas_busqueda más INSERTs por cada
 * usuario conectado, cada 2 minutos, aunque no hubiera pasado nada. Ahora lo
 * dispara el cron (/api/cron/notificaciones) y la ruta de lectura no escribe.
 *
 * Las alertas van dirigidas al ROL, no a un usuario: antes se generaba una copia
 * por cada persona que abriera la campanita.
 */
export async function generarAlertasBusquedas(): Promise<number> {
  const fichas = await query<{ id: string; fecha_activacion: string; nombre_desaparecida: string }>(
    `SELECT id, fecha_activacion, nombre_desaparecida
       FROM fichas_busqueda WHERE status = 'activa'`,
  )
  if (fichas.rows.length === 0) return 0

  // Una sola consulta para todos los seguimientos, en vez de una por ficha.
  const seguimientos = await query<{ ficha_id: string; tipo: string }>(
    `SELECT ficha_id, tipo FROM seguimientos_busqueda WHERE ficha_id = ANY($1)`,
    [fichas.rows.map(f => f.id)],
  )
  const registrados = new Map<string, Set<string>>()
  for (const s of seguimientos.rows) {
    const set = registrados.get(String(s.ficha_id)) ?? new Set<string>()
    set.add(String(s.tipo))
    registrados.set(String(s.ficha_id), set)
  }

  const ahora = Date.now()
  let emitidas = 0

  for (const ficha of fichas.rows) {
    const fechaActivacion = new Date(String(ficha.fecha_activacion))
    const yaRegistrados = registrados.get(String(ficha.id)) ?? new Set<string>()

    for (const hito of HITOS_ALERTAR) {
      if (yaRegistrados.has(hito)) continue

      const msRestantes = calcularFechaEsperada(fechaActivacion, hito).getTime() - ahora
      if (msRestantes > UNA_HORA_MS) continue

      const vencido = msRestantes < 0
      const label   = getLabelSeguimiento(hito)

      await emitir('busqueda_plazo', {
        titulo: `${vencido ? '⚠ VENCIDO' : '⏰ Próximo'} — ${label}`,
        mensaje: `${ficha.nombre_desaparecida} — reporte de ${label} ${vencido ? 'VENCIDO' : 'vence en menos de 1 hora'}.`,
        entidadTipo: 'ficha_busqueda',
        entidadId: String(ficha.id),
        // Idempotente: el cron puede correr muchas veces sin duplicar la alerta.
        dedup: `busqueda_plazo:${ficha.id}:${hito}`,
      })
      emitidas++
    }
  }

  return emitidas
}

/**
 * Reenvía el push de notificaciones críticas que nadie ha leído después de
 * UMBRAL_ESCALACION_MINUTOS. Un solo reintento por notificación (marcado con
 * push_reescalado_en) — no es un reenvío infinito.
 */
export async function escalarCriticasSinLeer(): Promise<number> {
  const candidatas = await candidatasEscalacion(UMBRAL_ESCALACION_MINUTOS)
  let escaladas = 0
  for (const c of candidatas) {
    try {
      await enviarPush(c.rolId, c.userId, {
        titulo: `⚠ ${c.titulo}`,
        mensaje: c.mensaje,
        href: c.href,
        severidad: 'critico',
      })
      await marcarEscalada(c.id)
      escaladas++
    } catch (e) {
      console.error('[notificaciones] fallo al escalar', c.id, e)
    }
  }
  return escaladas
}
