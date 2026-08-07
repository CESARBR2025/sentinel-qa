import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { listarRegistros, TURNOS } from '@/lib/monitorista/incidentes-camara-service'
import Link from 'next/link'
import React from 'react'
import { Camera, BarChart3, Filter } from 'lucide-react'
import { FilaIncidenteCamara } from '@/components/monitorista/FilaIncidenteCamara'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { ToastAuto } from '@/components/ui/ToastAuto'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

export default async function IncidentesCamaraPage({
  searchParams,
}: {
  searchParams: Promise<{ turno?: string; exito?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'incidentes_camara', 'ver'))) redirect('/monitorista')

  const { turno: turnoFilter, exito } = await searchParams
  const turnoValido = turnoFilter && TURNOS.includes(turnoFilter as typeof TURNOS[number])
    ? turnoFilter as typeof TURNOS[number]
    : undefined

  const registros = await listarRegistros(turnoValido)

  const totalPersonas = registros.reduce((s, r) => s + r.totalPersonasRevisadas, 0)
  const totalVehiculos = registros.reduce((s, r) => s + r.vehiculosRevisar, 0)
  const totalMotos = registros.reduce((s, r) => s + r.motosRevisadas, 0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <ToastAuto show={exito === 'creado'} mensaje="Registro creado exitosamente" />
      <ToastAuto show={exito === 'actualizado'} mensaje="Registro actualizado exitosamente" />
      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        roleLabel="Monitorista"
        backHref="/monitorista"
        backLabel="Panel"
      />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <PageHeader
          title="Incidentes por"
          accent="Cámara"
          subtitle="Cámaras de vigilancia · registro de novedades por turno"
          actions={<PageHeaderLink href="/monitorista/incidentes-camara/nuevo">+ Nuevo Registro</PageHeaderLink>}
        />

        <div className="grid-2">
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 20, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <BarChart3 size={20} color="#1f355a" />
              <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Registros</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{registros.length}</div></div>
            </div>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 20, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Camera size={20} color="#059669" />
              <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Personas Revisadas</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{totalPersonas}</div></div>
            </div>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 20, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Camera size={20} color="#b45309" />
              <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vehículos Revisados</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{totalVehiculos}</div></div>
            </div>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 20, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Camera size={20} color="#7c3aed" />
              <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Motos Revisadas</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>{totalMotos}</div></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={14} color="#64748b" />
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Filtrar por turno:</span>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Link href="/monitorista/incidentes-camara" style={filtroBtn(!turnoFilter)}>TODOS</Link>
            <Link href="/monitorista/incidentes-camara?turno=MATUTINO" style={filtroBtn(turnoFilter === 'MATUTINO')}>07-15 HRS</Link>
            <Link href="/monitorista/incidentes-camara?turno=VESPERTINO" style={filtroBtn(turnoFilter === 'VESPERTINO')}>15-22 HRS</Link>
            <Link href="/monitorista/incidentes-camara?turno=NOCTURNO" style={filtroBtn(turnoFilter === 'NOCTURNO')}>22-07 HRS</Link>
          </div>
        </div>

        <div className="tabla-wrap" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <Th>Fecha</Th>
                <Th>Turno</Th>
                <Th>Sin Novedad</Th>
                <Th>Con Antec.</Th>
                <Th>Veh. Revisar</Th>
                <Th>Veh. REPUVE</Th>
                <Th>Motos</Th>
                <Th>Persec.</Th>
                <Th>Aseg.</Th>
                <Th>Recup.</Th>
                <Th>Incendios</Th>
                <Th>Tránsito</Th>
                <Th>Total Personas</Th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 && (
                <tr><td colSpan={13} style={{ padding: 32, textAlign: 'center', fontFamily: 'Inter', fontSize: 13, color: '#94a3b8' }}>No hay registros</td></tr>
              )}
              {registros.map(r => (
                <FilaIncidenteCamara key={r.id} registro={r} />
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

function filtroBtn(active: boolean): React.CSSProperties {
  return {
    fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 600, textTransform: 'uppercase',
    letterSpacing: '0.1em', padding: '4px 12px', textDecoration: 'none', borderRadius: 2,
    background: active ? '#0f172a' : '#f1f5f9',
    color: active ? '#ffffff' : '#475569',
    border: active ? '1px solid #0f172a' : '1px solid #e2e8f0',
  }
}
