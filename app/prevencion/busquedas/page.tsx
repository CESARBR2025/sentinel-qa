import { db } from '@/lib/db/index'
import { fichasBusqueda } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import { format } from 'date-fns'

const TIPO_CFG: Record<string, { label: string; color: string }> = {
  PROTOCOLO_ALBA:   { label: 'Protocolo Alba',     color: '#c0223a' },
  BUSQUEDA_PERSONA: { label: 'Búsqueda de Persona', color: '#5a8fd4' },
}

export default async function BusquedasPage() {
  const fichas = await db
    .select()
    .from(fichasBusqueda)
    .orderBy(desc(fichasBusqueda.fechaActivacion))

  const activas    = fichas.filter(f => f.status === 'activa').length
  const canceladas = fichas.filter(f => f.status === 'cancelada').length

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#d8e0f0', margin: '0 0 6px' }}>
            Búsquedas / <span style={{ color: '#d4a43a' }}>Protocolo Alba</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            {fichas.length} ficha{fichas.length !== 1 ? 's' : ''} registrada{fichas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/prevencion/busquedas/nueva"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#c0223a', color: '#fff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          + Activar protocolo
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 32, maxWidth: 600 }}>
        {[
          { label: 'Total',     value: fichas.length, color: '#4a5878' },
          { label: 'Activas',   value: activas,       color: '#c0223a' },
          { label: 'Cerradas',  value: canceladas,    color: '#4a9e6a' },
        ].map(s => (
          <div key={s.label} style={{ background: '#0b1220', border: `1px solid ${s.color}40`, padding: '16px 20px' }}>
            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 38, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      {fichas.length === 0 ? (
        <div style={{ padding: '64px 0', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#2a3a5e', letterSpacing: '0.15em' }}>
          › No hay fichas registradas — activa el primer protocolo.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1b2742' }}>
                {['Tipo', 'Folio', 'Nombre', 'Edad', 'Activación', 'Estado', ''].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 400, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fichas.map((f, i) => {
                const cfg = TIPO_CFG[f.tipo] ?? { label: f.tipo, color: '#4a5878' }
                const fechaStr = f.fechaActivacion instanceof Date
                  ? format(f.fechaActivacion, 'dd/MM/yy HH:mm')
                  : format(new Date(String(f.fechaActivacion)), 'dd/MM/yy HH:mm')

                return (
                  <tr key={f.id} style={{ borderBottom: '1px solid #0f1826', background: i % 2 === 0 ? 'transparent' : 'rgba(27,39,66,0.2)' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: cfg.color, border: `1px solid ${cfg.color}`, padding: '2px 7px', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#d8e0f0', whiteSpace: 'nowrap' }}>
                      {f.folio ?? '—'}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#d8e0f0', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.nombreDesaparecida}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#8a9bc0', textAlign: 'center' }}>
                      {f.edad ?? '—'}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#8a9bc0', whiteSpace: 'nowrap' }}>
                      {fechaStr}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: f.status === 'activa' ? '#c0223a' : '#4a9e6a' }}>
                        {f.status === 'activa' ? '● Activa' : '✓ Cerrada'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Link href={`/prevencion/busquedas/${f.id}`} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#d4a43a', letterSpacing: '0.12em', textDecoration: 'none', textTransform: 'uppercase' }}>
                        Ver →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
