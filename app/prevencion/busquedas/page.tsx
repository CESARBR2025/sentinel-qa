import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getFichasBusqueda } from '@/lib/prevencion/repository'
import Link from 'next/link'
import { format } from 'date-fns'
import { Suspense } from 'react'
import { tieneAccesoSeccion, tienePermiso } from '@/lib/prevencion/permisos'
import { BusquedasFiltros } from '@/components/prevencion/BusquedasFiltros'
import { Pagination } from '@/components/prevencion/Pagination'
import { paginate } from '@/lib/prevencion/paginate'

const TIPO_CFG: Record<string, { label: string; color: string }> = {
  PROTOCOLO_ALBA:   { label: 'Protocolo Alba',     color: '#991b1b' },
  BUSQUEDA_PERSONA: { label: 'Búsqueda de Persona', color: '#1f355a' },
}

export default async function BusquedasPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; status?: string; q?: string; page?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoSeccion(session.user.id, 'busquedas'))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'busquedas', 'ver'))) redirect('/dashboard')

  const { tipo, status, q, page } = await searchParams

  let fichas = await getFichasBusqueda()

  const activas    = fichas.filter(f => f.status === 'activa').length
  const canceladas = fichas.filter(f => f.status === 'cancelada').length

  if (tipo) fichas = fichas.filter(f => f.tipo === tipo)
  if (status) fichas = fichas.filter(f => f.status === status)
  if (q) {
    const needle = q.trim().toLowerCase()
    fichas = fichas.filter(f => [f.nombre_desaparecida, f.folio, f.carpeta_investigacion, f.rt_atiende, f.enlace]
      .some(v => typeof v === 'string' && v.toLowerCase().includes(needle)))
  }

  const hayFiltro = !!(tipo || status || q)
  const totalFiltrado = fichas.length
  const pageRows = paginate(fichas, page)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 6px' }}>
            Búsquedas / <span style={{ color: '#1f355a' }}>Protocolo Alba</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            {hayFiltro ? (
              <>{totalFiltrado} resultado{totalFiltrado !== 1 ? 's' : ''} · <span style={{ color: '#d4a43a' }}>filtros activos</span></>
            ) : (
              <>{fichas.length} ficha{fichas.length !== 1 ? 's' : ''} registrada{fichas.length !== 1 ? 's' : ''}</>
            )}
          </p>
        </div>
        <Link
          href="/prevencion/busquedas/nueva"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#1f355a', color: '#fff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px' }}
        >
          + Activar protocolo
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 32, maxWidth: 600 }}>
        {[
          { label: 'Total',     value: activas + canceladas, color: '#1e293b' },
          { label: 'Activas',   value: activas,       color: '#991b1b' },
          { label: 'Cerradas',  value: canceladas,    color: '#166534' },
        ].map(s => (
          <div key={s.label} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: `4px solid ${s.color}`, padding: '16px 20px' }}>
            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 38, color: '#0f172a', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <Suspense>
        <BusquedasFiltros />
      </Suspense>

      {/* Tabla */}
      {totalFiltrado === 0 ? (
        <div style={{ padding: '64px 0', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#2a3a5e', letterSpacing: '0.15em' }}>
          {hayFiltro ? '› Sin resultados para los filtros seleccionados.' : '› No hay fichas registradas — activa el primer protocolo.'}
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
              {pageRows.map((f, i) => {
                const cfg = TIPO_CFG[f.tipo] ?? { label: f.tipo, color: '#4a5878' }
                const fechaStr = format(new Date(String(f.fecha_activacion)), 'dd/MM/yy HH:mm')

                return (
                  <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: cfg.color, border: `1px solid ${cfg.color}`, padding: '2px 7px', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#1e293b', whiteSpace: 'nowrap' }}>
                      {f.folio ?? '—'}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#1e293b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.nombre_desaparecida}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#64748b', textAlign: 'center' }}>
                      {f.edad ?? '—'}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', whiteSpace: 'nowrap' }}>
                      {fechaStr}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: f.status === 'activa' ? '#991b1b' : '#166534' }}>
                        {f.status === 'activa' ? '● Activa' : '✓ Cerrada'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Link href={`/prevencion/busquedas/${f.id}`} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1f355a', fontWeight: 600, letterSpacing: '0.12em', textDecoration: 'none', textTransform: 'uppercase' }}>
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

      <Suspense>
        <Pagination total={totalFiltrado} />
      </Suspense>
    </div>
  )
}
