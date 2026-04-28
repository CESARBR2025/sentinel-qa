import { db }   from '@/lib/db/index'
import { medidasProteccion } from '@/lib/db/schema'
import { desc }  from 'drizzle-orm'
import Link      from 'next/link'
import { calcularSemaforoVigencia } from '@/lib/prevencion/semaforo'
import { SemaforoVigencia }         from '@/components/prevencion/SemaforoVigencia'
import { AutoridadBadge }           from '@/components/prevencion/AutoridadBadge'

export default async function MedidasPage() {
  const rows = await db
    .select()
    .from(medidasProteccion)
    .orderBy(desc(medidasProteccion.creadoEn))

  const semaforos = rows.map(r => calcularSemaforoVigencia(r.fechaVencimiento))
  const total     = rows.length
  const activas   = rows.filter(r => r.status === 'activa').length
  const porVencer = semaforos.filter(s => s === 'amarillo').length
  const vencidas  = semaforos.filter(s => s === 'rojo').length

  const STATS = [
    { label: 'Total',      value: total,     color: '#4a5878' },
    { label: 'Activas',    value: activas,   color: '#4a9e6a' },
    { label: 'Por vencer', value: porVencer, color: '#d4a43a' },
    { label: 'Vencidas',   value: vencidas,  color: '#c0223a' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#d8e0f0', margin: '0 0 6px' }}>
            Libro Digital — <span style={{ color: '#d4a43a' }}>Medidas de Protección</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            {total} expediente{total !== 1 ? 's' : ''} registrado{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/prevencion/medidas/nueva"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#c0223a', color: '#fff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          + Nueva medida
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#0b1220', border: `1px solid ${s.color}40`, padding: '16px 20px' }}>
            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 38, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <div style={{ padding: '64px 0', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#2a3a5e', letterSpacing: '0.15em' }}>
          › No hay expedientes registrados — crea el primero.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1b2742' }}>
                {['Estado', 'Expediente', 'Víctima', 'Autoridad', 'Tipo medida', 'Vencimiento', ''].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 400, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #0f1826', background: i % 2 === 0 ? 'transparent' : 'rgba(27,39,66,0.2)' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <SemaforoVigencia color={semaforos[i]} />
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#d8e0f0', whiteSpace: 'nowrap' }}>
                    {r.expediente}
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#d8e0f0', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.victima}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <AutoridadBadge autoridad={r.autoridad} />
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#8a9bc0', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.tipoMedida ?? '—'}
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#8a9bc0', whiteSpace: 'nowrap' }}>
                    {r.fechaVencimiento ?? '—'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <Link
                      href={`/prevencion/medidas/${r.id}`}
                      style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#d4a43a', letterSpacing: '0.12em', textDecoration: 'none', textTransform: 'uppercase' }}
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
