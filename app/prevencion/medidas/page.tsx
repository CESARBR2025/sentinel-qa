import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db/index'
import { medidasProteccion, visitasDomiciliarias } from '@/lib/db/schema'
import { desc, eq, and } from 'drizzle-orm'
import Link from 'next/link'
import { calcularSemaforoVigencia } from '@/lib/prevencion/semaforo'
import { SemaforoVigencia } from '@/components/prevencion/SemaforoVigencia'
import { AutoridadBadge } from '@/components/prevencion/AutoridadBadge'
import { MedidasFiltros } from '@/components/prevencion/MedidasFiltros'
import { Suspense } from 'react'
import { tieneAccesoSeccion, tienePermiso } from '@/lib/prevencion/permisos'

const COLOR_MAP: Record<string, string> = {
  vigentes: 'verde',
  por_vencer: 'amarillo',
  vencidas: 'rojo',
  sin_fecha: 'gris',
}

export default async function MedidasPage({
  searchParams,
}: {
  searchParams: Promise<{
    estado?: string
    autoridad?: string
    sinVisita?: string
    prorrogadas?: string
  }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoSeccion(session.user.id, 'medidas'))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'medidas', 'ver'))) redirect('/dashboard')

  const { estado, autoridad, sinVisita, prorrogadas } = await searchParams

  // Build DB conditions
  const conds = []
  if (autoridad) conds.push(eq(medidasProteccion.autoridad, autoridad))
  if (prorrogadas === '1') conds.push(eq(medidasProteccion.prorrogada, true))

  let rows = await db
    .select()
    .from(medidasProteccion)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(medidasProteccion.creadoEn))

  // Semáforo filter (computed from date, not stored)
  const targetColor = estado ? COLOR_MAP[estado] : null
  if (targetColor) {
    rows = rows.filter(r => calcularSemaforoVigencia(r.fechaVencimiento) === targetColor)
  }

  // Sin visita filter
  if (sinVisita === '1') {
    const conVisita = await db
      .selectDistinct({ medidaId: visitasDomiciliarias.medidaId })
      .from(visitasDomiciliarias)
    const idsConVisita = new Set(conVisita.map(v => v.medidaId))
    rows = rows.filter(r => !idsConVisita.has(r.id))
  }

  const semaforos = rows.map(r => calcularSemaforoVigencia(r.fechaVencimiento))

  // Stats siempre del total sin filtros (para contexto)
  const allRows = await db.select({ fv: medidasProteccion.fechaVencimiento, status: medidasProteccion.status }).from(medidasProteccion)
  const allSem = allRows.map(r => calcularSemaforoVigencia(r.fv))
  const STATS = [
    { label: 'Total', value: allRows.length, color: '#1e293b' },
    { label: 'Activas', value: allRows.filter(r => r.status === 'activa').length, color: '#166534' },
    { label: 'Por vencer', value: allSem.filter(s => s === 'amarillo').length, color: '#854d0e' },
    { label: 'Vencidas', value: allSem.filter(s => s === 'rojo').length, color: '#991b1b' },
  ]

  const hayFiltro = !!(estado || autoridad || sinVisita || prorrogadas)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', padding: '40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 6px' }}>
            Libro Digital — <span style={{ color: '#2563eb' }}>Medidas de Protección</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            {hayFiltro ? (
              <>{rows.length} resultado{rows.length !== 1 ? 's' : ''} · <span style={{ color: '#d4a43a' }}>filtros activos</span></>
            ) : (
              <>{allRows.length} expediente{allRows.length !== 1 ? 's' : ''} registrado{allRows.length !== 1 ? 's' : ''}</>
            )}
          </p>
        </div>
        <Link
          href="/prevencion/medidas/nueva"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#2563eb', color: '#ffffff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px' }}
        >
          + Nueva medida
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: `4px solid ${s.color}`, padding: '16px 20px' }}>
            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 38, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <Suspense>
        <MedidasFiltros />
      </Suspense>

      {/* Table */}
      {rows.length === 0 ? (
        <div style={{ padding: '64px 0', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#2a3a5e', letterSpacing: '0.15em' }}>
          {hayFiltro ? '› Sin resultados para los filtros seleccionados.' : '› No hay expedientes registrados — crea el primero.'}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f1f5f9' }}>
                {['Estado', 'Expediente', 'Víctima', 'Autoridad', 'Tipo medida', 'Vencimiento', ''].map(h => (
                  <th key={h} style={{ padding: '12px', textAlign: 'left', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#475569', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <SemaforoVigencia color={semaforos[i]} />
                      {r.prorrogada && (
                        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: '#d4a43a', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                          PRÓRROGA
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#1e293b', whiteSpace: 'nowrap' }}>
                    {r.expediente}
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#1e293b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.victima}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <AutoridadBadge autoridad={r.autoridad} />
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#64748b', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.tipoMedida ?? '—'}
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {r.fechaVencimiento ?? '—'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <Link
                      href={`/prevencion/medidas/${r.id}`}
                      style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#2563eb', fontWeight: 600, letterSpacing: '0.12em', textDecoration: 'none', textTransform: 'uppercase' }}
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
