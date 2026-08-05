import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { tienePermiso } from '@/lib/formatos-udai/permisos'
import { listarFaltasAdministrativas } from '@/lib/formatos-udai/repository'
import { BotonExportarExcel } from '@/components/formatos-udai/BotonExportarExcel'
import { DetalleFaltaAdministrativaModal } from '@/components/formatos-udai/DetalleFaltaAdministrativaModal'
import type { FaltaAdministrativaRow } from '@/lib/formatos-udai/types'

const COLUMNAS: { header: string; key: keyof FaltaAdministrativaRow }[] = [
  { header: 'Fecha', key: 'fecha' },
  { header: 'IPH', key: 'iph' },
  { header: 'Nombre', key: 'nombre' },
  { header: 'Tipo de Falta', key: 'tipoFalta' },
  { header: 'Lugar de Arresto', key: 'lugarArresto' },
  { header: 'Sector', key: 'sector' },
]

function nombreCompleto(r: FaltaAdministrativaRow): string {
  return [r.nombre, r.apellidoPaterno, r.apellidoMaterno].filter(Boolean).join(' ')
}

function celda(valor: unknown): string {
  if (valor === null || valor === undefined || valor === '') return '—'
  return String(valor)
}

export default async function FaltasAdministrativasPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'formatos_udai', 'ver'))) redirect('/formatos-udai')

  const user = session.user as { name: string; apellido?: string; email: string }
  const registros = await listarFaltasAdministrativas()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <DashboardHeader user={user} roleLabel="Formatos UDAI" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Formato"
          accent="Faltas Administrativas"
          subtitle="Bitácora de detenidos por falta administrativa — formato oficial UDAI"
          actions={<>
            <PageHeaderLink href="/formatos-udai" variant="secondary">← Formatos UDAI</PageHeaderLink>
            <BotonExportarExcel />
          </>}
        />

        <div className="tabla-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter', fontSize: 12, whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                {COLUMNAS.map(c => (
                  <th key={c.key} style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>{c.header}</th>
                ))}
                <th style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono', fontSize: 9, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 && (
                <tr><td colSpan={COLUMNAS.length + 1} style={{ padding: 32, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#94a3b8' }}>No hay registros IPH capturados</td></tr>
              )}
              {registros.map(r => (
                <tr key={r.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  {COLUMNAS.map(c => (
                    <td key={c.key} style={{ padding: '10px 14px', fontFamily: c.key === 'iph' ? 'JetBrains Mono' : 'Inter', fontSize: c.key === 'iph' ? 11 : 12 }}>
                      {c.key === 'nombre' ? celda(nombreCompleto(r)) : celda(r[c.key])}
                    </td>
                  ))}
                  <td style={{ padding: '10px 14px' }}>
                    <DetalleFaltaAdministrativaModal row={r} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DashboardFooter />
      </main>
    </div>
  )
}
