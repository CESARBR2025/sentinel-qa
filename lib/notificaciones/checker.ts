import { query } from '@/lib/db'
import { calcularFechaEsperada, getLabelSeguimiento } from '@/lib/prevencion/timeline'

const HITOS_ALERTAR = ['CONTESTACION_INICIAL', '24H', '48H', '72H'] as const
const UNA_HORA_MS   = 60 * 60 * 1000

export async function generarAlertasBusquedas(userId: string, debug = false) {
  const fichas = await query<{ id: string; fecha_activacion: string; nombre_desaparecida: string; status: string }>(
    `SELECT id, fecha_activacion, nombre_desaparecida, status
     FROM fichas_busqueda WHERE status = 'activa'`,
  )

  for (const ficha of fichas.rows) {
    const fechaActivacion = new Date(String(ficha.fecha_activacion))

    let registrados = new Set<string>()
    if (!debug) {
      const segs = await query<{ tipo: string }>(
        `SELECT tipo FROM seguimientos_busqueda WHERE ficha_id = $1`,
        [ficha.id],
      )
      registrados = new Set(segs.rows.map(s => s.tipo))
    }

    for (const hito of HITOS_ALERTAR) {
      if (!debug && registrados.has(hito)) continue

      const fechaEsperada = calcularFechaEsperada(fechaActivacion, hito)
      const ahora         = new Date()
      const msRestantes   = fechaEsperada.getTime() - ahora.getTime()

      if (!debug && msRestantes > UNA_HORA_MS) continue

      const vencido = msRestantes < 0
      const label   = getLabelSeguimiento(hito)

      await query(
        `INSERT INTO notificaciones
         (user_id, tipo, titulo, mensaje, href, ficha_id, hito)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [
          userId,
          'busqueda_plazo',
          `${vencido ? '⚠ VENCIDO' : '⏰ Próximo'} — ${label}`,
          `${ficha.nombre_desaparecida} — reporte de ${label} ${vencido ? 'VENCIDO' : 'vence en menos de 1 hora'}.`,
          `/prevencion/busquedas/${ficha.id}`,
          ficha.id,
          hito,
        ],
      )
    }
  }
}
