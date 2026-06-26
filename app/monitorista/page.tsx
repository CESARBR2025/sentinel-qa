import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db/index'
import {
  solicitudesEvidencia,
  evidencias,
  monitoristaHistorial,
  users,
  roles,
} from '@/lib/db/schema'
import { eq, desc, sql, and, gte } from 'drizzle-orm'
import { Camera, ClipboardList, CheckCircle2, Clock, Shield } from 'lucide-react'
import { SignOutButton } from '@/app/dashboard/sign-out-button'
import Link from 'next/link'
import React from 'react'
import { BandejaSolicitudes } from '@/components/monitorista/BandejaSolicitudes'
import { obtenerDenunciasPendientes, obtenerDenunciasAtendidas } from '@/lib/monitorista/denuncia-service'

export default async function MonitoristaPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const [userData] = await db
    .select({ rolNombre: roles.nombre })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .where(eq(users.id, session.user.id))
    .limit(1)

  const esAdmin = userData?.rolNombre === 'Administrador'

  const [gralPendientes, gralCompletadas, historialHoy, denunciasPendientes, denunciasAtendidas] = await Promise.all([
    db
      .select({
        id: solicitudesEvidencia.id,
        incidenteId: solicitudesEvidencia.incidenteId,
        folio: solicitudesEvidencia.folioIncidente,
        solicitadoNombre: solicitudesEvidencia.solicitadoNombre,
        descripcion: solicitudesEvidencia.descripcion,
        status: solicitudesEvidencia.status,
        creadoEn: solicitudesEvidencia.creadoEn,
        completadoEn: solicitudesEvidencia.completadoEn,
        totalEvidencias: sql<number>`(SELECT count(*)::int FROM evidencias WHERE evidencias.solicitud_id = solicitudes_evidencia.id)`,
      })
      .from(solicitudesEvidencia)
      .where(eq(solicitudesEvidencia.status, 'pendiente'))
      .orderBy(desc(solicitudesEvidencia.creadoEn))
      .limit(50),
    db
      .select({
        id: solicitudesEvidencia.id,
        incidenteId: solicitudesEvidencia.incidenteId,
        folio: solicitudesEvidencia.folioIncidente,
        solicitadoNombre: solicitudesEvidencia.solicitadoNombre,
        descripcion: solicitudesEvidencia.descripcion,
        status: solicitudesEvidencia.status,
        creadoEn: solicitudesEvidencia.creadoEn,
        completadoEn: solicitudesEvidencia.completadoEn,
        totalEvidencias: sql<number>`(SELECT count(*)::int FROM evidencias WHERE evidencias.solicitud_id = solicitudes_evidencia.id)`,
      })
      .from(solicitudesEvidencia)
      .where(eq(solicitudesEvidencia.status, 'completada'))
      .orderBy(desc(solicitudesEvidencia.completadoEn))
      .limit(50),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(monitoristaHistorial)
      .where(
        and(
          eq(monitoristaHistorial.monitoristaId, session.user.id),
          gte(monitoristaHistorial.creadoEn, hoy.toISOString()),
        ),
      ),
    obtenerDenunciasPendientes(),
    obtenerDenunciasAtendidas(),
  ])

  const denunciaItemsPendientes = denunciasPendientes.flatMap((d) =>
    d.monitoristaFechasRequeridas.map((s) => ({
      id: `${d.id}_${s.solicitud_id}`,
      origen: 'denuncia' as const,
      entidadId: d.id,
      solicitudId: s.solicitud_id,
      folio: d.folioDenuncia,
      solicitadoNombre: 'Fiscalía',
      descripcion: `${s.calle} ${s.numero}, Col. ${s.colonia} (${s.hora_inicio} - ${s.hora_fin})`,
      status: s.atendida ? 'completada' as const : 'pendiente' as const,
      creadoEn: s.fecha_peticion,
      completadoEn: null as string | null,
      totalEvidencias: 0,
    })),
  )

  const denunciaItemsAtendidas = denunciasAtendidas.map((d) => {
    const total = d.monitoristaFechasRequeridas.length
    const atendidas = d.monitoristaFechasRequeridas.filter(s => s.atendida).length
    const calles = [...new Set(d.monitoristaFechasRequeridas.map(s => `${s.calle} ${s.numero}, Col. ${s.colonia}`))]
    return {
      id: d.id,
      origen: 'denuncia' as const,
      entidadId: d.id,
      solicitudId: null as number | null,
      folio: d.folioDenuncia,
      solicitadoNombre: 'Fiscalía',
      descripcion: `${total} solicitud${total > 1 ? 'es' : ''} · ${atendidas}/${total} atendidas · ${calles.join(' | ')}`,
      status: 'completada' as const,
      creadoEn: d.createdAt,
      completadoEn: d.createdAt,
      totalEvidencias: total,
    }
  })

  const itemsPendientesGral = gralPendientes.map((r) => ({
    id: r.id, origen: 'general' as const,
    entidadId: r.incidenteId, solicitudId: null as number | null,
    folio: r.folio ?? '', solicitadoNombre: r.solicitadoNombre ?? '',
    descripcion: r.descripcion, status: r.status,
    creadoEn: r.creadoEn, completadoEn: r.completadoEn,
    totalEvidencias: r.totalEvidencias,
  }))
  const itemsCompletadasGral = gralCompletadas.map((r) => ({
    id: r.id, origen: 'general' as const,
    entidadId: r.incidenteId, solicitudId: null as number | null,
    folio: r.folio ?? '', solicitadoNombre: r.solicitadoNombre ?? '',
    descripcion: r.descripcion, status: r.status,
    creadoEn: r.creadoEn, completadoEn: r.completadoEn,
    totalEvidencias: r.totalEvidencias,
  }))

  const pendientes = [...denunciaItemsPendientes, ...itemsPendientesGral]
  const completadas = [...denunciaItemsAtendidas, ...itemsCompletadasGral]

  const user = session.user as { name: string; apellido?: string }

  return (
    <div style={{ minHeight: '100vh', background: '#050810', color: '#d8e0f0', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 64px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: 24, borderBottom: '1px solid rgba(212,164,58,0.15)', marginBottom: 40,
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 2, background: '#d4a43a' }}></div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#c0223a', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, background: '#c0223a', display: 'inline-block' }}></span>
              Centro de Monitoreo
            </div>
            <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 48, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#ffffff', lineHeight: 1 }}>
              MONITORISTA
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4a5878', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
              Operador Identificado
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#d4a43a', letterSpacing: '0.12em', fontWeight: 600 }}>
              {user.name} {user.apellido ?? ''}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {esAdmin && (
              <Link href="/dashboard" style={{
                fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.15em',
                color: '#5c74a1', textDecoration: 'none', textTransform: 'uppercase',
                padding: '8px 16px', border: '1px solid rgba(27,39,66,0.8)', borderRadius: 2
              }}>← Dashboard</Link>
            )}
            <SignOutButton />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
          <div style={statCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Clock size={20} color="#d4a43a" />
              <div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5878', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pendientes</div>
                <div style={{ fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 700, color: '#ffffff' }}>{pendientes.length}</div>
              </div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircle2 size={20} color="#4a9e6a" />
              <div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5878', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Completadas</div>
                <div style={{ fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 700, color: '#ffffff' }}>{completadas.length}</div>
              </div>
            </div>
          </div>
          <div style={statCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ClipboardList size={20} color="#5c74a1" />
              <div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5878', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Acciones Hoy</div>
                <div style={{ fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 700, color: '#ffffff' }}>{historialHoy[0]?.count ?? 0}</div>
              </div>
            </div>
          </div>
        </div>

        <BandejaSolicitudes pendientes={pendientes as any} completadas={completadas as any} />
      </main>
    </div>
  )
}

const statCardStyle: React.CSSProperties = {
  background: 'rgba(11,18,32,0.6)', backdropFilter: 'blur(10px)',
  border: '1px solid rgba(27,39,66,0.8)', padding: 24, borderRadius: 2,
}
