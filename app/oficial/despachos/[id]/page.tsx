import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { verificarRolOficial, listarDespachosAsignados, obtenerCatalogos } from '@/lib/oficial/service'
import { obtenerHistorialCompleto } from '@/lib/incidentes/service'
import { HistorialIncidente } from '@/components/incidentes/HistorialIncidente'
import { FormularioRecorrido } from '@/components/oficial/FormularioRecorrido'

export default async function AtenderDespachoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  // Solo puede atender incidentes asignados a él y aún en despacho
  const asignados = await listarDespachosAsignados(session.user.id)
  const asignacion = asignados.find(d => d.incidenteId === id)
  if (!asignacion) notFound()

  const [historial, catalogos] = await Promise.all([
    obtenerHistorialCompleto(id),
    obtenerCatalogos(),
  ])
  if (!historial) notFound()

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 48px 0 48px' }}>
        <Link href="/oficial/despachos" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, textDecoration: 'none', marginBottom: 16 }}>
          <ArrowLeft size={14} /> Mis despachos
        </Link>

        <div style={{ marginBottom: 24 }}>
          <HistorialIncidente historial={historial} />
        </div>
      </main>

      <FormularioRecorrido
        user={session.user}
        catalogos={catalogos}
        incidenteId={id}
        prefill={{
          folioCad: asignacion.folio,
          descripcion: asignacion.descripcion ?? undefined,
          calle: asignacion.calle ?? undefined,
          colonia: asignacion.colonia ?? undefined,
          tipoIncidente: asignacion.tipoIncidente ?? undefined,
          prioridad: asignacion.prioridad ?? undefined,
        }}
      />
    </div>
  )
}
