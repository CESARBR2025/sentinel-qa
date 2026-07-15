import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { obtenerReporteCampoSimple } from '@/lib/oficial/repository'
import { verificarRolOficial } from '@/lib/oficial/service'
import { SubirFotoDetenido } from '@/components/monitorista/SubirFotoDetenido'
import Link from 'next/link'
import { Camera } from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'

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
        backHref="/oficial"
        backLabel="Regresar"
      />

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 48px', display: 'flex', flexDirection: 'column', gap: 32, minHeight: '100vh' }}>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: 20, borderBottom: '1px solid #e2e8f0', position: 'relative'
        }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#1f355a' }}></div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>
              Oficial de Campo
            </div>
            <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
              Fotos del Detenido
            </h1>
          </div>
        </div>

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
