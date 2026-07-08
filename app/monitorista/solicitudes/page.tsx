import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '@/lib/db'
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react'
import React from 'react'
import { BandejaSolicitudes } from '@/components/monitorista/BandejaSolicitudes'
import { obtenerDenunciasPendientes, obtenerDenunciasAtendidas } from '@/lib/monitorista/denuncia-service'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { SubHeader } from '@/components/partials/SubHeader'

export default async function SolicitudesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'ver'))) redirect('/monitorista')

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)

  const [gralPend, gralComp, histCount, d1Pend, d1Comp] = await Promise.all([
    query<Record<string, unknown>>("SELECT id, incidente_id, folio_incidente, solicitado_nombre, descripcion, status, creado_en, completado_en, (SELECT count(*)::int FROM evidencias e WHERE e.solicitud_id = se.id) as total_evidencias FROM solicitudes_evidencia se WHERE status = 'pendiente' ORDER BY creado_en DESC LIMIT 50"),
    query<Record<string, unknown>>("SELECT id, incidente_id, folio_incidente, solicitado_nombre, descripcion, status, creado_en, completado_en, (SELECT count(*)::int FROM evidencias e WHERE e.solicitud_id = se.id) as total_evidencias FROM solicitudes_evidencia se WHERE status = 'completada' ORDER BY completado_en DESC LIMIT 50"),
    query<{ c: number }>("SELECT count(*)::int as c FROM monitorista_historial WHERE monitorista_id = $1 AND creado_en >= $2", [session.user.id, hoy.toISOString()]),
    obtenerDenunciasPendientes(),
    obtenerDenunciasAtendidas(),
  ])

  const mapGral = (rows: Record<string, unknown>[], origen: 'pendiente' | 'completada') =>
    rows.map(r => ({
      id: String(r.id), origen: 'general' as const, entidadId: String(r.incidente_id), solicitudId: null as number | null,
      folio: String(r.folio_incidente ?? ''), solicitadoNombre: String(r.solicitado_nombre ?? ''),
      descripcion: String(r.descripcion ?? ''), status: origen, creadoEn: String(r.creado_en ?? ''),
      completadoEn: r.completado_en ? String(r.completado_en) : null, totalEvidencias: Number(r.total_evidencias ?? 0),
    }))

  const denunciaItemsPend = d1Pend.flatMap((d) =>
    d.monitoristaFechasRequeridas.map((s) => ({
      id: `${d.id}_${s.solicitud_id}`, origen: 'denuncia' as const, entidadId: d.id, solicitudId: s.solicitud_id,
      folio: d.folioDenuncia, solicitadoNombre: 'Fiscalía',
      descripcion: `${s.calle} ${s.numero}, Col. ${s.colonia} (${s.hora_inicio} - ${s.hora_fin})`,
      status: s.atendida ? 'completada' as const : 'pendiente' as const,
      creadoEn: s.fecha_peticion, completadoEn: null, totalEvidencias: 0,
    })))

  const denunciaItemsAtend = d1Comp.map((d) => {
    const total = d.monitoristaFechasRequeridas.length
    const atendidas = d.monitoristaFechasRequeridas.filter(s => s.atendida).length
    const calles = [...new Set(d.monitoristaFechasRequeridas.map(s => `${s.calle} ${s.numero}, Col. ${s.colonia}`))]
    return { id: d.id, origen: 'denuncia' as const, entidadId: d.id, solicitudId: null, folio: d.folioDenuncia,
      solicitadoNombre: 'Fiscalía', descripcion: `${total} solicitud${total > 1 ? 'es' : ''} · ${atendidas}/${total} atendidas · ${calles.join(' | ')}`,
      status: 'completada' as const, creadoEn: d.createdAt, completadoEn: d.createdAt, totalEvidencias: total }
  })

  const pendientes = [...denunciaItemsPend, ...mapGral(gralPend.rows, 'pendiente')]
  const completadas = [...denunciaItemsAtend, ...mapGral(gralComp.rows, 'completada')]
  const user = session.user as { name: string; apellido?: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <SubHeader backHref="/monitorista" backLabel="Monitorista" title="Solicitudes de" accent="Evidencia" accentColor="#3b82f6" user={user} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>Panel de Solicitudes</span>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Solicitudes de Evidencia</h1>
          <div style={{ width: 64, height: 3, background: '#2563eb', marginTop: 12 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
          <StatCard icon={<Clock size={20} color="#2563eb" />} label="Pendientes" value={pendientes.length} />
          <StatCard icon={<CheckCircle2 size={20} color="#059669" />} label="Completadas" value={completadas.length} />
          <StatCard icon={<ClipboardList size={20} color="#64748b" />} label="Acciones Hoy" value={histCount.rows[0]?.c ?? 0} />
        </div>

        <BandejaSolicitudes pendientes={pendientes as any} completadas={completadas as any} />
      </main>

      <footer style={{ padding: '32px 48px', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
        SSPM · SAN JUAN DEL RÍO · QRO · SENTINEL v0.1
      </footer>
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
