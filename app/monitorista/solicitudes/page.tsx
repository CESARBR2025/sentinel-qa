import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react'
import React from 'react'
import { BandejaSolicitudes } from '@/components/monitorista/BandejaSolicitudes'
import type { SolicitudRow } from '@/components/monitorista/BandejaSolicitudes'
import { obtenerDenunciasPendientes, obtenerDenunciasAtendidas } from '@/lib/monitorista/denuncia-service'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { listarSolicitudesEvidencia, getHistorialCount } from '@/lib/monitorista/repository'
import { obtenerOCrearToken } from '@/lib/recursos/token-recurso'
import type { SolicitudEvidencia } from '@/lib/monitorista/types'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

export default async function SolicitudesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'ver'))) redirect('/monitorista')

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)

  const [gralPend, gralComp, histCount, d1Pend, d1Comp] = await Promise.all([
    listarSolicitudesEvidencia('pendiente'),
    listarSolicitudesEvidencia('completada'),
    getHistorialCount(session.user.id, hoy.toISOString()),
    obtenerDenunciasPendientes(),
    obtenerDenunciasAtendidas(),
  ])

  const mapGral = async (rows: SolicitudEvidencia[], origen: 'pendiente' | 'completada'): Promise<SolicitudRow[]> =>
    Promise.all(rows.map(async r => ({
      id: String(r.id),
      token: await obtenerOCrearToken('solicitud', String(r.id)),
      origen: 'general' as const, entidadId: String(r.incidenteId), solicitudId: null as number | null,
      folio: String(r.folioIncidente ?? ''), solicitadoNombre: String(r.solicitadoNombre ?? ''),
      descripcion: String(r.descripcion ?? ''), status: origen, creadoEn: String(r.creadoEn ?? ''),
      completadoEn: r.completadoEn ? String(r.completadoEn) : null, totalEvidencias: Number(r.totalEvidencias ?? 0),
    })))

  const denunciaItemsPend: SolicitudRow[] = []
  for (const d of d1Pend) {
    const denunciaToken = await obtenerOCrearToken('denuncia', d.id)
    for (const s of d.monitoristaFechasRequeridas) {
      denunciaItemsPend.push({
        id: `${d.id}_${s.solicitudId}`, origen: 'denuncia' as const, entidadId: d.id, denunciaToken,
        solicitudId: s.solicitudId,
        folio: d.folioDenuncia, solicitadoNombre: 'Fiscalía',
        descripcion: `${s.calle} ${s.numero}, Col. ${s.colonia} (${s.horaInicio} - ${s.horaFin})`,
        status: s.atendida ? 'completada' as const : 'pendiente' as const,
        creadoEn: s.fechaPeticion, completadoEn: null, totalEvidencias: 0,
      })
    }
  }

  const denunciaItemsAtend: SolicitudRow[] = []
  for (const d of d1Comp) {
    const denunciaToken = await obtenerOCrearToken('denuncia', d.id)
    const total = d.monitoristaFechasRequeridas.length
    const atendidas = d.monitoristaFechasRequeridas.filter(s => s.atendida).length
    const calles = [...new Set(d.monitoristaFechasRequeridas.map(s => `${s.calle} ${s.numero}, Col. ${s.colonia}`))]
    denunciaItemsAtend.push({ id: d.id, origen: 'denuncia' as const, entidadId: d.id, denunciaToken, solicitudId: null, folio: d.folioDenuncia,
      solicitadoNombre: 'Fiscalía', descripcion: `${total} solicitud${total > 1 ? 'es' : ''} · ${atendidas}/${total} atendidas · ${calles.join(' | ')}`,
      status: 'completada' as const, creadoEn: d.createdAt, completadoEn: d.createdAt, totalEvidencias: total })
  }

  const pendientes = [...denunciaItemsPend, ...(await mapGral(gralPend, 'pendiente'))]
  const completadas = [...denunciaItemsAtend, ...(await mapGral(gralComp, 'completada'))]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <DashboardHeader user={session.user as { name: string; apellido?: string; email: string }} roleLabel="Monitorista" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <PageHeader
          title="Solicitudes de"
          accent="Evidencia"
          subtitle="Panel de solicitudes · denuncias D1 y solicitudes generales"
          actions={<PageHeaderLink href="/monitorista" variant="secondary">← Panel</PageHeaderLink>}
        />

        <div className="grid-3">
          <StatCard icon={<Clock size={20} color="#1f355a" />} label="Pendientes" value={pendientes.length} />
          <StatCard icon={<CheckCircle2 size={20} color="#059669" />} label="Completadas" value={completadas.length} />
          <StatCard icon={<ClipboardList size={20} color="#64748b" />} label="Acciones Hoy" value={histCount} />
        </div>

        <BandejaSolicitudes pendientes={pendientes} completadas={completadas} />

        <DashboardFooter />
      </main>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon}
        <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 700, color: '#0f172a' }}>{value}</div></div>
      </div>
    </div>
  )
}
