import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link          from 'next/link'
import { format }    from 'date-fns'
import { Suspense }  from 'react'
import { AutoridadBadge } from '@/components/prevencion/AutoridadBadge'
import { tienePermiso } from '@/lib/prevencion/permisos'
import { listarSolicitudesJuridico } from '@/lib/prevencion/repository'
import { JuridicoFiltros } from '@/components/prevencion/JuridicoFiltros'
import { Pagination } from '@/components/prevencion/Pagination'
import { paginate } from '@/lib/prevencion/paginate'

export default async function JuridicoPage({
  searchParams,
}: {
  searchParams: Promise<{ autoridad?: string; q?: string; page?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tienePermiso(session.user.id, 'solicitudes', 'ver'))) redirect('/prevencion/medidas')

  const { autoridad, q, page } = await searchParams

  let solicitudes = await listarSolicitudesJuridico()
  const totalSinFiltro = solicitudes.length

  if (autoridad) solicitudes = solicitudes.filter(s => s.autoridad === autoridad)
  if (q) {
    const needle = q.trim().toLowerCase()
    solicitudes = solicitudes.filter(s => [s.oficio, s.delito, s.carpeta_investigacion, s.fiscal_solicita]
      .some(v => typeof v === 'string' && v.toLowerCase().includes(needle)))
  }

  const hayFiltro = !!(autoridad || q)
  const totalFiltrado = solicitudes.length
  const pageRows = paginate(solicitudes, page)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 4px' }}>
            Bandeja <span style={{ color: '#1f355a' }}>Jurídica</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            {hayFiltro ? (
              <>{totalFiltrado} resultado{totalFiltrado !== 1 ? 's' : ''} · <span style={{ color: '#d4a43a' }}>filtros activos</span></>
            ) : (
              <>{totalSinFiltro} solicitud{totalSinFiltro !== 1 ? 'es' : ''} activa{totalSinFiltro !== 1 ? 's' : ''}</>
            )}
          </p>
        </div>
        <Link
          href="/prevencion/juridico/solicitudes/nueva"
          style={{ padding: '10px 20px', background: '#1f355a', color: '#fff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px' }}
        >
          + Nueva Solicitud
        </Link>
      </div>

      {/* Filtros */}
      <Suspense>
        <JuridicoFiltros />
      </Suspense>

      {/* Table */}
      {totalFiltrado === 0 ? (
        <div style={{ padding: '64px 0', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {hayFiltro ? '› Sin resultados para los filtros seleccionados.' : '› No hay solicitudes activas en la bandeja'}
        </div>
      ) : (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                {['Oficio', 'Autoridad', 'Delito', 'Carpeta', 'Fecha Activación', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#475569', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map(s => {
                const fechaAct = new Date(String(s.fecha_activacion))
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 600 }}>{s.oficio}</td>
                    <td style={{ padding: '12px 16px' }}><AutoridadBadge autoridad={s.autoridad} /></td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{s.delito ?? '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 10 }}>
                      {s.carpeta_investigacion ?? '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 10 }}>
                      {format(fechaAct, 'dd/MM/yy HH:mm')}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <Link
                        href={`/prevencion/juridico/solicitudes/${s.id}`}
                        style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#1f355a', fontWeight: 600, letterSpacing: '0.14em', textDecoration: 'none', textTransform: 'uppercase' }}
                      >
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
