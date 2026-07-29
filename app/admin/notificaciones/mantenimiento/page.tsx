import Link from 'next/link'
import { obtenerRetencionDias, contarAntiguas } from '@/lib/notificaciones/repository'
import { guardarRetencionAction, purgarAction } from '@/lib/notificaciones/admin-actions'
import { cardStyle, btnPrimario, btnSecundario, inputStyle, labelStyle } from '../../admin-styles'

export default async function MantenimientoPage({ searchParams }: {
  searchParams: Promise<{ exito?: string; n?: string }>
}) {
  const sp = await searchParams
  const dias = await obtenerRetencionDias()
  const purgables = await contarAntiguas(dias)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>
            Purga y <span style={{ color: '#1f355a' }}>Retención</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '6px 0 0 0' }}>
            Cuánto tiempo se conservan las notificaciones
          </p>
        </div>
        <Link href="/admin/notificaciones" style={btnSecundario}>Volver a auditoría</Link>
      </div>

      {sp.exito === 'retencion' && (
        <div style={avisoOk}>Retención actualizada.</div>
      )}
      {sp.exito === 'purga' && (
        <div style={avisoOk}>{sp.n ?? 0} notificaciones eliminadas.</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, maxWidth: 900 }}>
        <form action={guardarRetencionAction} style={{ ...cardStyle, padding: 24 }}>
          <h3 style={subtitulo}>Retención</h3>
          <p style={parrafo}>
            El cron borra automáticamente las notificaciones con más días de los indicados.
            Sus registros de lectura se eliminan en cascada.
          </p>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle} htmlFor="dias">Días a conservar</label>
            <input id="dias" name="dias" type="number" min={1} max={3650}
              defaultValue={dias} required style={inputStyle} />
          </div>
          <button type="submit" style={btnPrimario}>Guardar</button>
        </form>

        <form action={purgarAction} style={{ ...cardStyle, padding: 24 }}>
          <h3 style={subtitulo}>Purga inmediata</h3>
          <p style={parrafo}>
            Elimina ahora todo lo que exceda la retención vigente ({dias} días).
            Con los datos actuales se borrarían{' '}
            <strong style={{ color: purgables > 0 ? '#dc2626' : '#059669' }}>{purgables}</strong>{' '}
            notificaciones. Esta acción no se puede deshacer.
          </p>
          <button type="submit" disabled={purgables === 0} style={{
            ...btnPrimario,
            background: purgables === 0 ? '#94a3b8' : '#dc2626',
            cursor: purgables === 0 ? 'default' : 'pointer',
          }}>
            {purgables === 0 ? 'Nada que purgar' : `Purgar ${purgables}`}
          </button>
        </form>
      </div>
    </>
  )
}

const subtitulo: React.CSSProperties = {
  fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 20,
  textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px 0', color: '#0f172a',
}
const parrafo: React.CSSProperties = {
  fontFamily: 'Inter,sans-serif', fontSize: 12.5, color: '#64748b',
  lineHeight: 1.6, margin: '0 0 20px 0',
}
const avisoOk: React.CSSProperties = {
  marginBottom: 20, padding: '12px 16px', background: 'rgba(5,150,105,0.1)',
  border: '1px solid #059669', color: '#059669', fontFamily: 'Inter,sans-serif', fontSize: 13,
}
