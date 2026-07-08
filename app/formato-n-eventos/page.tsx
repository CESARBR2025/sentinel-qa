import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { listarEventos } from '@/lib/reportes/formato-n-eventos-service'
import { SubHeader } from '@/components/partials/SubHeader'
import Link from 'next/link'
import React from 'react'
import { Plus } from 'lucide-react'
import { pageWrap, fontsImport } from '@/components/reportes/form-styles'
import { tieneAccesoFormatoN, tienePermiso } from '@/lib/reportes/permisos'

export default async function FormatoNEventosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoFormatoN(session.user.id))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'formato_n_coordinacion', 'ver'))) redirect('/dashboard')

  const registros = await listarEventos()
  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={pageWrap}>
      <style>{fontsImport}</style>
      <SubHeader backHref="/envio-de-formatos" backLabel="Envío de Formatos" title="Eventos Informados" user={user} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>Formato N a Coordinación</span>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Eventos Informados</h1>
            <div style={{ width: 64, height: 3, background: '#2563eb', marginTop: 12 }} />
          </div>
          <Link href="/formato-n-eventos/nuevo" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', background: '#0f172a', color: '#ffffff', padding: '12px 24px', textDecoration: 'none', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={14} /> NUEVO EVENTO
          </Link>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <Th>Fecha</Th>
                <Th>Hora</Th>
                <Th>Región</Th>
                <Th>Evento</Th>
                <Th>Ubicación</Th>
                <Th>Atenciones</Th>
                <Th>​</Th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', fontFamily: 'Inter', fontSize: 13, color: '#94a3b8' }}>No hay eventos</td></tr>
              )}
              {registros.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <Td>{r.fecha}</Td>
                  <Td>{r.hora}</Td>
                  <Td>{r.region}</Td>
                  <Td>{r.evento}</Td>
                  <Td>{r.ubicacion ?? '—'}</Td>
                  <Td>{r.atenciones ?? '—'}</Td>
                  <Td><Link href={`/formato-n-eventos/${r.id}`} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', textDecoration: 'none' }}>EDITAR</Link></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', textAlign: 'left', padding: '10px 12px', fontWeight: 600 }}>{children}</th>
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ fontFamily: 'Inter', fontSize: 12, color: '#1e293b', padding: '10px 12px' }}>{children}</td>
}
