import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { obtenerReporteCampoSimple } from '@/lib/oficial/repository'
import { verificarRolOficial } from '@/lib/oficial/service'
import { SubirFotoDetenido } from '@/components/monitorista/SubirFotoDetenido'
import Link from 'next/link'
import { Camera } from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'

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
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>
      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        variant="apple"
        backHref="/oficial"
        backLabel="Panel"
      />

      <div className="pad-pagina" style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32, minHeight: '100vh' }}>

        <PageHeader
          title="Fotos del"
          accent="Detenido"
          subtitle={nombre}
        />

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 16, fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Camera size={18} /> {nombre}
          </div>
          {folio && <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 500, color: '#64748b', marginBottom: 16 }}>Folio: {folio}</div>}
          <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.5 }}>
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
            fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600,
            textTransform: 'none', letterSpacing: 'normal',
            padding: '10px 24px', background: '#0f172a', color: '#ffffff',
            border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textDecoration: 'none',
          }}>
            Continuar sin fotos
          </Link>
        </div>
      </div>
    </div>
  )
}
