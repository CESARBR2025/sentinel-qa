import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'

import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import FormularioD1        from '@/components/denuncias/FormularioD1'
import { verificarRolOficial, obtenerPlacaPatrulla, obtenerDatosParaD1, obtenerSectorOficialSvc, obtenerDetenidosParaD1, obtenerMiPerfil } from '@/lib/oficial/service'
import { listarGruposAdscripcion } from '@/lib/d1/service'

export default async function NuevaDenunciaD1Page({
  searchParams,
}: {
  searchParams: Promise<{ incidenteId?: string;reporteCampoId?: string; calle?: string; colonia?: string; lat?: string; lng?: string; destino?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await verificarRolOficial(session.user.id))) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }
  const sp = await searchParams

  // El oficial que llena el D1 es siempre el de la sesión activa — nunca por query param
  const miPerfil = await obtenerMiPerfil(session.user.id)

  const [placaPatrulla, sector] = await Promise.all([
    miPerfil ? obtenerPlacaPatrulla(miPerfil.id) : Promise.resolve(''),
    miPerfil ? obtenerSectorOficialSvc(miPerfil.id) : Promise.resolve(null),
  ])

  // Datos adicionales del reporte de campo (ubicación, delito, etc.) — NO identidad del oficial
  const reporteData = sp.reporteCampoId ? await obtenerDatosParaD1(sp.reporteCampoId) : null
  const gruposAdscripcion = await listarGruposAdscripcion(sp.destino ?? undefined)
  const detenidos = sp.reporteCampoId ? await obtenerDetenidosParaD1(sp.reporteCampoId) : []

  const prefill = {
    incidenteId:      sp.incidenteId ?? null,
    reporteCampoId:   sp.reporteCampoId ?? null,
    lugarHecho:       sp.calle          ?? reporteData?.calle ?? '',
    coloniaHecho:     sp.colonia        ?? reporteData?.colonia ?? '',
    lat:              sp.lat            ? Number(sp.lat) : reporteData?.latitud ?? null,
    lng:              sp.lng            ? Number(sp.lng) : reporteData?.longitud ?? null,
    oficialId:        miPerfil?.id      ?? null,
    destino:          sp.destino        ?? reporteData?.autoridadRecibe ?? null,
    crp:              placaPatrulla,
    tipoIncidente:    reporteData?.tipoIncidente ?? null,
    descripcion:      reporteData?.descripcion ?? null,
    folioReporteCampo: reporteData?.folioReporteCampo ?? null,
    sector:           sector,
    nombreOficial:    miPerfil ? `${miPerfil.ofiNombre} ${miPerfil.ofiApPaterno}`.trim() : null,
    nominaOficial:    miPerfil?.noNomina ?? null,
    fechaHoraInicioIncidente: reporteData?.fechaHoraInicioIncidente ?? null,
    fechaHoraDespacho:         reporteData?.fechaHoraDespacho ?? null,
    fechaReporteCampo:         reporteData?.created_at ?? null,
    delito:           reporteData?.delito ?? null,
    modusOperandi:    reporteData?.modusOperandi ?? null,
    hayDetencion:     reporteData?.hayDetencion ?? false,
    nombreReportante: reporteData?.nombreReportante ?? null,
    telefonoReportante: reporteData?.telefonoReportante ?? null,
    detenidos,
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');` }} />

      <DashboardHeader user={user} />

      <div className="pad-pagina" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <PageHeader
          title="Registro de"
          accent="Reporte D1"
          subtitle="Módulo de Auditoría y Control Legal"
          actions={
            <PageHeaderLink href={prefill.reporteCampoId ? `/oficial` : '/dashboard'} variant="secondary">
              {prefill.reporteCampoId ? '← Volver al Panel Oficial' : '← Volver al Panel Principal'}
            </PageHeaderLink>
          }
        />

        {/* Banner si viene de un reporte de recorrido */}
        {prefill.reporteCampoId && (
          <div style={{ padding: '12px 20px', background: '#eff1f3', border: '1px solid #c3c8d2', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#1c3051', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700 }}>REPORTE DE RECORRIDO VINCULADO</span>
            <span style={{ color: '#64748b' }}>— Los datos de ubicación, oficial y reporte han sido pre-llenados automáticamente.</span>
            {prefill.destino && (
              <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, padding: '3px 8px', background: '#ffffff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 2 }}>
                DESTINO: {prefill.destino}
              </span>
            )}
          </div>
        )}

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid #d4a43a', borderRadius: '4px', padding: '20px 28px' }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#64748b', lineHeight: '1.6' }}>
            Capture la cronometría exacta del evento, folios de denuncia y datos de victimología para el seguimiento del IPH y CU.
          </div>
        </div>

        <FormularioD1 user={user} prefill={prefill} gruposAdscripcion={gruposAdscripcion} />

      </div>
    </main>
  )
}