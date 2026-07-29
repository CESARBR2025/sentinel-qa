import { NextRequest, NextResponse } from 'next/server'
import { generarAlertasBusquedas } from '@/lib/notificaciones/checker'
import { obtenerRetencionDias, purgarAntiguas } from '@/lib/notificaciones/repository'

// Mantenimiento del sistema de notificaciones: genera las alertas de plazo y
// purga las vencidas por retención. Va aparte de la ruta de lectura porque es
// trabajo de escritura que no debe correr en cada consulta de la campanita.
//
// Protegido con CRON_SECRET (cabecera Authorization: Bearer <secret>), el
// esquema que usa Vercel Cron. Sin la variable definida sólo se permite en dev.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    if (req.headers.get('authorization') !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 503 })
  }

  const alertas = await generarAlertasBusquedas()
  const dias = await obtenerRetencionDias()
  const purgadas = await purgarAntiguas(dias)

  return NextResponse.json({ alertasGeneradas: alertas, purgadas, retencionDias: dias })
}
