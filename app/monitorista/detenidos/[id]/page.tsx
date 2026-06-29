import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { obtenerDetenidoPorId, getDestinos } from '@/lib/monitorista/detenido-service'
import { query } from '@/lib/db'
import { ArrowLeft, User, FileText, Camera, ExternalLink, Clock, Send } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { CardEnvioFoto } from '@/components/monitorista/CardEnvioFoto'
import { BatchEnvioFotos } from '@/components/monitorista/BatchEnvioFotos'

export default async function DetenidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const detenido = await obtenerDetenidoPorId(id)
  if (!detenido) notFound()

  const [fotos, destinos] = await Promise.all([
    query<Record<string, unknown>>(
      `SELECT ed.id, ed.tipo_foto, ed.url_archivo, ed.nombre_archivo, sf.estado
       FROM evidencias_detenido ed
       LEFT JOIN solicitud_fotos sf ON sf.solicitud_id = ed.solicitud_id AND sf.tipo_foto = ed.tipo_foto
       WHERE ed.solicitud_id = $1 ORDER BY ed.tipo_foto, ed.creado_en`,
      [id],
    ),
    getDestinos(),
  ])

  const fotosPorTipo = new Map<string, typeof fotos.rows>()
  for (const f of fotos.rows) {
    const arr = fotosPorTipo.get(String(f.tipo_foto)) ?? []
    arr.push(f)
    fotosPorTipo.set(String(f.tipo_foto), arr)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 48px' }}>
        <Link href="/monitorista/detenidos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', fontFamily: 'JetBrains Mono', fontSize: 11, textDecoration: 'none', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}><ArrowLeft size={14} /> Detenidos</Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid #e2e8f0' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#2563eb', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>Reporte de Detenido</div>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: 0 }}>{detenido.nombre_detenido}</h1>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section style={card}>
              <h2 style={sectionTitle}><User size={18} /> DATOS DEL DETENIDO</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Campo label="Nombre" value={detenido.nombre_detenido} />
                <Campo label="Folio" value={detenido.folio} />
                <Campo label="Tipo de Evento" value={detenido.tipo_evento} />
                <Campo label="Delitos" value={detenido.delitos} />
                <Campo label="Falta Administrativa" value={detenido.falta_admin} />
                <Campo label="Modus Operandi" value={detenido.modus_operandi} />
              </div>
            </section>

            <section style={card}>
              <h2 style={sectionTitle}><Camera size={18} /> SOLICITUD DE FOTOS</h2>
              <BatchEnvioFotos fotos={detenido.fotos} destinos={destinos} solicitudId={detenido.id} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {['frontal', 'derecho', 'izquierdo'].map((tipo) => {
                  const fotoDef = detenido.fotos.find(f => f.tipo_foto === tipo)
                  const evs = fotosPorTipo.get(tipo) ?? []
                  return (
                    <CardEnvioFoto
                      key={tipo}
                      solicitudId={detenido.id}
                      tipo={tipo}
                      foto={fotoDef!}
                      destinos={destinos}
                      evidencias={evs.map(e => ({ id: String(e.id), url: String(e.url_archivo), nombre: String(e.nombre_archivo ?? '') }))}
                    />
                  )
                })}
              </div>
            </section>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={card}>
              <h2 style={sectionTitle}><Clock size={18} /> FECHAS</h2>
              <Campo label="Creada" value={new Date(detenido.creado_en).toLocaleString('es-MX')} />
              {detenido.completado_en && <Campo label="Completada" value={new Date(detenido.completado_en).toLocaleString('es-MX')} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Campo({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 600 }}>{label}</div><div style={{ fontFamily: 'Inter', fontSize: 13, color: '#1e293b' }}>{value}</div></div>
}

const card: React.CSSProperties = { background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }
const sectionTitle: React.CSSProperties = { fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em' }
