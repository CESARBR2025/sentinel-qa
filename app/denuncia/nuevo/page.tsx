import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'

import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import FormularioD1        from '@/components/denuncias/FormularioD1'
import { FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { verificarRolOficial, obtenerPlacaPatrulla, obtenerDatosParaD1, obtenerSectorOficialSvc } from '@/lib/oficial/service'
import { listarGruposAdscripcion } from '@/lib/d1/service'

export default async function NuevaDenunciaD1Page({
  searchParams,
}: {
  searchParams: Promise<{ incidenteId?: string;reporteCampoId?: string; calle?: string; colonia?: string; lat?: string; lng?: string; oficialId?: string; destino?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await verificarRolOficial(session.user.id))) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }
  const sp = await searchParams

  // Datos pre-llenados desde el reporte de recorrido
  let placaPatrulla = ''
  if (sp.oficialId) {
    placaPatrulla = await obtenerPlacaPatrulla(sp.oficialId)
  }

  // Consultar BD para datos adicionales
  const reporteData = sp.reporteCampoId ? await obtenerDatosParaD1(sp.reporteCampoId) : null
  const sector = sp.oficialId ? await obtenerSectorOficialSvc(sp.oficialId) : null
  const gruposAdscripcion = await listarGruposAdscripcion(sp.destino ?? undefined)

  const prefill = {
    incidenteId:      sp.incidenteId ?? null,
    reporteCampoId:   sp.reporteCampoId ?? null,
    lugarHecho:       sp.calle          ?? reporteData?.calle ?? '',
    coloniaHecho:     sp.colonia        ?? reporteData?.colonia ?? '',
    lat:              sp.lat            ? Number(sp.lat) : reporteData?.latitud ?? null,
    lng:              sp.lng            ? Number(sp.lng) : reporteData?.longitud ?? null,
    oficialId:        sp.oficialId      ?? null,
    destino:          sp.destino        ?? reporteData?.autoridadRecibe ?? null,
    crp:              placaPatrulla,
    tipoIncidente:    reporteData?.tipoIncidente ?? null,
    descripcion:      reporteData?.descripcion ?? null,
    folioReporteCampo: reporteData?.folioReporteCampo ?? null,
    sector:           sector,
    nombreOficial:    reporteData?.oficialNombre ?? null,
    nominaOficial:    reporteData?.oficialNomina ?? null,
    fechaHoraInicioIncidente: reporteData?.fechaHoraInicioIncidente ?? null,
    fechaHoraDespacho:         reporteData?.fechaHoraDespacho ?? null,
    fechaReporteCampo:         reporteData?.created_at ?? null,
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');` }} />

      <DashboardHeader user={user} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <Link href={prefill.reporteCampoId ? `/oficial` : '/dashboard'}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 600 }}>
          <ArrowLeft size={14} />
          {prefill.reporteCampoId ? 'VOLVER AL PANEL OFICIAL' : 'VOLVER AL PANEL PRINCIPAL'}
        </Link>

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

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '6px solid #0f172a', borderRadius: '4px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <FileText size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', color: '#f1f5f9', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ color: '#d4a43a', fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '12px', height: '2px', background: '#d4a43a' }} />
              Módulo de Auditoría y Control Legal
            </div>
            <h1 style={{ margin: '12px 0', fontFamily: 'Barlow Condensed', fontSize: '48px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', lineHeight: 1 }}>
              Registro de <span style={{ color: '#1f355a' }}>Reporte D1</span>
            </h1>
            <p style={{ margin: '16px 0 0 0', fontFamily: 'Inter', color: '#64748b', fontSize: '15px', maxWidth: '600px', lineHeight: '1.6' }}>
              Capture la cronometría exacta del evento, folios de denuncia y datos de victimología para el seguimiento del IPH y CU.
            </p>
          </div>
        </div>

        <FormularioD1 user={user} prefill={prefill} gruposAdscripcion={gruposAdscripcion} />

      </div>
    </main>
  )
}