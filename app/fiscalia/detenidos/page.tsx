import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileDropdown } from '@/components/fiscalia/ProfileDropdown'
import { listarDetenidosParaRol } from '@/lib/detenidos-compartido'
import Link from 'next/link'
import { FilaDetenidoRol } from '@/components/FilaDetenidoRol'

export default async function DetenidosFiscaliaPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const params = await searchParams
  const pagina = Math.max(1, parseInt(params.p ?? '1', 10) || 1)

  const user = session.user as { name: string; apellido?: string; email?: string }

  const { detenidos, total } = await listarDetenidosParaRol('FISCALIA', pagina)
  const totalPaginas = Math.ceil(total / 10)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .det-row td { font-family: 'Inter',sans-serif; font-size: 13px; color: #334155; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
        .det-row:hover td { background: #f8fafc; cursor: pointer; }
        .det-row:last-child td { border-bottom: none; }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 64px', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh' }}>

        {/* Back link */}
        <Link href="/fiscalia" style={{
          fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#7c3aed',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: -32,
        }}>
          ← REGRESAR A FISCALÍA
        </Link>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: 24, borderBottom: '1px solid #e2e8f0',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#7c3aed' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <img src="/logo_sentinel.png" alt="S" style={{ height: 56, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#7c3aed', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#7c3aed', display: 'inline-block' }}></span>
                Agente Fiscalía
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 42, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                FOTOS DE DETENIDOS
              </h1>
            </div>
          </div>

          <ProfileDropdown name={user.name} apellido={user.apellido} email={user.email || ''} />
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '24px 32px', flex: 1, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: '#f5f3ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 24, fontWeight: 800, color: '#7c3aed' }}>{total}</span>
              </div>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Detenidos con fotos pendientes</div>
                <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#1e293b' }}>Solicitudes de Monitorista</div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1 }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            {detenidos.length === 0 && (
              <div style={{ padding: 64, textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#94a3b8' }}>
                No hay detenidos con fotos pendientes
              </div>
            )}
            {detenidos.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 20px', textAlign: 'left', fontWeight: 600 }}>Detenido</th>
                    <th style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 20px', textAlign: 'left', fontWeight: 600 }}>Folio</th>
                    <th style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 20px', textAlign: 'left', fontWeight: 600 }}>Fotos</th>
                    <th style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 20px', textAlign: 'left', fontWeight: 600 }}>Avance</th>
                  </tr>
                </thead>
                <tbody>
                  {detenidos.map(d => (
                    <FilaDetenidoRol key={d.id} detenido={d} basePath="/fiscalia/detenidos" />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              {pagina > 1 && (
                <Link href={`/fiscalia/detenidos?p=${pagina - 1}`} style={pagBtn}>
                  ← ANTERIOR
                </Link>
              )}
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                <Link
                  key={p}
                  href={`/fiscalia/detenidos?p=${p}`}
                  style={{
                    ...pagBtn,
                    background: p === pagina ? '#7c3aed' : '#ffffff',
                    color: p === pagina ? '#ffffff' : '#475569',
                    border: p === pagina ? '1px solid #7c3aed' : '1px solid #e2e8f0',
                  }}
                >
                  {p}
                </Link>
              ))}
              {pagina < totalPaginas && (
                <Link href={`/fiscalia/detenidos?p=${pagina + 1}`} style={pagBtn}>
                  SIGUIENTE →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'auto', paddingTop: 24,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1 · FISCALÍA · DETENIDOS</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed' }}></span>
          </div>
        </div>

      </div>
    </div>
  )
}

const pagBtn: React.CSSProperties = {
  fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.1em',
  padding: '8px 14px', borderRadius: 2, textDecoration: 'none',
  background: '#ffffff', color: '#475569',
  border: '1px solid #e2e8f0',
}
