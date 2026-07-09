import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { obtenerReportePorId, getDestinos } from '@/lib/monitorista/service'
import { crearSolicitudFotos } from '@/lib/monitorista/repository'
import { ArrowLeft, User, Camera, Clock, Shield } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { CardEnvioFoto } from '@/components/monitorista/CardEnvioFoto'
import { BatchEnvioFotos } from '@/components/monitorista/BatchEnvioFotos'
import { EditarCampoDetenido } from '@/components/monitorista/EditarCampoDetenido'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { listarEvidenciasDetenido } from '@/lib/monitorista/repository'
import { ToastAuto } from '@/components/ui/ToastAuto'

export default async function DetenidoDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ exito?: string }> }) {
  const { id } = await params
  const { exito } = await searchParams
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'detenidos', 'ver'))) redirect('/monitorista')

  const reporte = await obtenerReportePorId(id)
  if (!reporte) notFound()

  const [fotos, destinos] = await Promise.all([
    listarEvidenciasDetenido(id),
    getDestinos(),
  ])

  if (reporte.fotos.length === 0) {
    await crearSolicitudFotos(id)
    return redirect(`/monitorista/detenidos/${id}${exito ? `?exito=${exito}` : ''}`)
  }

  const fotosPorTipo = new Map<string, typeof fotos>()
  for (const f of fotos) {
    const arr = fotosPorTipo.get(String(f.tipoFoto)) ?? []
    arr.push(f)
    fotosPorTipo.set(String(f.tipoFoto), arr)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <ToastAuto show={exito === '1'} mensaje="Reporte creado exitosamente" />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 48px' }}>
        <Link href="/monitorista/detenidos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', fontFamily: 'JetBrains Mono', fontSize: 11, textDecoration: 'none', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}><ArrowLeft size={14} /> Detenidos</Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid #e2e8f0' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Reporte de Detenido</div>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: 0 }}>{reporte.nombreDetenido}</h1>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section style={card}>
              <h2 style={sectionTitle}><User size={18} /> DATOS PRINCIPALES</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <Campo label="Nombre" value={reporte.nombreDetenido} />
                <Campo label="Folio" value={reporte.folioDetenido} />
                <Campo label="Evento o Incidente" value={reporte.tipoIncidente} />
                <EditarCampoDetenido reporteId={id} campo="delito" label="Delito" valor={reporte.delitoDenuncia} />
                <EditarCampoDetenido reporteId={id} campo="falta_administrativa" label="Falta Administrativa" valor={reporte.faltaAdministrativa} />
                <EditarCampoDetenido reporteId={id} campo="marco_legal" label="Marco Legal" valor={reporte.marcoLegal} />
                <EditarCampoDetenido reporteId={id} campo="modus_operandi" label="Modus Operandi" valor={reporte.modusOperandi} />
              </div>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}><Camera size={18} /> SOLICITUD DE FOTOS</h2>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b', marginBottom: 16, lineHeight: 1.5 }}>
                Las fotos (Frontal, Lado Derecho, Lado Izquierdo) se solicitan a Fiscalía o Juzgado. Ellos las suben y cuando estén listas aparecerán aquí.
              </div>
              <BatchEnvioFotos fotos={reporte.fotos} destinos={destinos} solicitudId={reporte.id} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                {reporte.fotos.map((f) => (
                  <CardEnvioFoto
                    key={f.tipoFoto}
                    solicitudId={reporte.id}
                    tipo={f.tipoFoto}
                    foto={f}
                    destinos={destinos}
                    evidencias={(fotosPorTipo.get(f.tipoFoto) ?? []).map(e => ({ id: String(e.id), url: String(e.urlArchivo), nombre: String(e.nombreArchivo ?? ''), subidoPor: e.rolSubio ? String(e.rolSubio) : null }))}
                  />
                ))}
              </div>
            </section>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={card}>
              <h2 style={sectionTitle}><Clock size={18} /> FECHA</h2>
              <Campo label="Reporte" value={new Date(reporte.createdAt).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
            </div>
            <div style={card}>
              <h2 style={sectionTitle}><Shield size={18} /> MARCAS</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {reporte.hayDetencion && <span style={marcaStyle}>✅ Detención</span>}
                {reporte.hayVehiculo && <span style={marcaStyle}>✅ Vehículo Involucrado</span>}
                {reporte.hayCateo && <span style={marcaStyle}>✅ Cateo Realizado</span>}
                {!reporte.hayDetencion && !reporte.hayVehiculo && !reporte.hayCateo && (
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#94a3b8' }}>Sin marcas</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Campo({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#1e293b' }}>{value}</div>
    </div>
  )
}

const card: React.CSSProperties = { background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }
const sectionTitle: React.CSSProperties = { fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em' }
const marcaStyle: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 10, padding: '4px 10px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 2, display: 'inline-block' }
