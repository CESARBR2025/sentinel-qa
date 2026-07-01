import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileDropdown } from '@/components/agente_juzgado/ProfileDropdown'
import { listarDetenidosParaRol } from '@/lib/detenidos-compartido'
import Link from 'next/link'
import { Camera } from 'lucide-react'
import { FilaDetenidoRol } from '@/components/FilaDetenidoRol'

export default async function DetenidosJuzgadoPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = session.user as { name: string; apellido?: string; email?: string }

  const { detenidos, total } = await listarDetenidosParaRol('JUZGADO_CIVICO')

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .det-row td { font-family: 'Inter',sans-serif; font-size: 12px; color: #334155; padding: 14px 16px; border-bottom: 1px solid #f1f5f9; }
        .det-row:hover td { background: #f8fafc; cursor: pointer; }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 32, minHeight: '100vh' }}>
        <Link href="/agente_juzgado" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', width: 'fit-content' }}>
          ← Juzgado
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 20, borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#059669' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img src="/logo_sentinel.png" alt="S" style={{ height: 48, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#059669', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#059669', display: 'inline-block' }} />
                Fotos de Detenidos
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 36, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                JUZGADO · DETENIDOS
              </h1>
            </div>
          </div>
          <ProfileDropdown name={user.name} apellido={user.apellido} email={user.email || ''} />
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px 20px', flex: 1, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Camera size={20} color="#059669" />
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Detenidos con fotos pendientes</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{detenidos.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'auto' }}>
          {detenidos.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#94a3b8' }}>No hay detenidos con fotos pendientes</div>
          )}
          {detenidos.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Detenido</th>
                  <th style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Folio</th>
                  <th style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Fotos</th>
                  <th style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {detenidos.map(d => (
                  <FilaDetenidoRol key={d.id} detenido={d} basePath="/agente_juzgado/detenidos" />
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1 · JUZGADO · DETENIDOS</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#059669' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
