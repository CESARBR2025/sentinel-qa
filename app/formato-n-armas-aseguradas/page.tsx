import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { listarArmasAseguradas } from '@/lib/reportes/formato-n-armas-aseguradas-service'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import Link from 'next/link'
import React from 'react'
import { Plus } from 'lucide-react'
import { pageWrap, fontsImport } from '@/components/reportes/form-styles'
import { tieneAccesoFormatoN, tienePermiso } from '@/lib/reportes/permisos'

export default async function FormatoNArmasAseguradasPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoFormatoN(session.user.id))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'formato_n_coordinacion', 'ver'))) redirect('/dashboard')

  const registros = await listarArmasAseguradas()
  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ ...pageWrap, display: 'flex', flexDirection: 'column' }}>
      <style>{fontsImport}</style>
      <DashboardHeader user={user} roleLabel="Armas Aseguradas" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Armas de Fuego"
          accent="Aseguradas"
          subtitle="Formato N a Coordinación"
          actions={<>
            <PageHeaderLink href="/envio-de-formatos" variant="secondary">← Envío de Formatos</PageHeaderLink>
            <PageHeaderLink href="/formato-n-armas-aseguradas/nuevo">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Plus size={14} /> NUEVA ARMA
              </span>
            </PageHeaderLink>
          </>}
        />

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <Th>Fecha</Th>
                <Th>Carpeta</Th>
                <Th>Tipo de Arma</Th>
                <Th>Matrícula</Th>
                <Th>Calibre</Th>
                <Th>​</Th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', fontFamily: 'Inter', fontSize: 13, color: '#94a3b8' }}>No hay armas registradas</td></tr>
              )}
              {registros.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <Td>{r.fecha}</Td>
                  <Td>{r.carpeta_investigacion ?? '—'}</Td>
                  <Td>{r.tipo_arma}</Td>
                  <Td>{r.matricula ?? '—'}</Td>
                  <Td>{r.calibre ?? '—'}</Td>
                  <Td><Link href={`/formato-n-armas-aseguradas/${r.id}`} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#1f355a', textDecoration: 'none' }}>EDITAR</Link></Td>
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
