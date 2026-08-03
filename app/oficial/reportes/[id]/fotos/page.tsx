import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { obtenerReporteCampoSimple } from '@/lib/oficial/repository'
import { verificarRolOficial } from '@/lib/oficial/service'
import { SubirFotoDetenido } from '@/components/monitorista/SubirFotoDetenido'
import Link from 'next/link'
import { Camera } from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

export default async function FotosDetenidoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const { id } = await params

  const rc = await obtenerReporteCampoSimple(id)
  if (!rc) redirect('/oficial')

  const detenidos = rc.ofi_detenidos
  let nombre = 'Sin nombre'
  if (Array.isArray(detenidos) && detenidos.length > 0) {
    const d = detenidos[0]
    nombre = [d?.nombre, d?.apellidoPaterno, d?.apellidoMaterno].filter(Boolean).join(' ') || 'Sin nombre'
  }

  const folio = String(rc.folio_reporte_campo || '')

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
      />

      <div className="pad-pagina" style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32, minHeight: '100vh' }}>

        <PageHeader
          title="Fotos del"
          accent="Detenido"
          subtitle={nombre}
          actions={<PageHeaderLink href="/oficial" variant="secondary">← Panel</PageHeaderLink>}
        />

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
          <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em' }}>
            <Camera size={18} /> {nombre}
          </div>
          {folio && <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#64748b', marginBottom: 16 }}>Folio: {folio}</div>}
          <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#64748b', marginBottom: 20, lineHeight: 1.5 }}>
            Puedes subir las fotografías del detenido ahora o hacerlo después. Si no las subes ahora, el Monitorista podrá solicitarlas a Fiscalía/Juzgado más tarde.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['frontal', 'derecho', 'izquierdo'].map(tipo => (
              <SubirFotoDetenido key={tipo} reporteCampoId={id} tipoFoto={tipo} label={{ frontal: 'Frontal', derecho: 'Lado Derecho', izquierdo: 'Lado Izquierdo' }[tipo] || tipo} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Link href="/oficial?exito=1" style={{
            fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            padding: '10px 24px', background: '#0f172a', color: '#ffffff',
            border: 'none', borderRadius: 2, cursor: 'pointer', textDecoration: 'none',
          }}>
            CONTINUAR SIN FOTOS
          </Link>
        </div>
      </div>
    </div>
  )
}
