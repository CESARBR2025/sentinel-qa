import Link from 'next/link'
import { ToastAuto } from '@/components/ui/ToastAuto'
import PatrullaForm from '@/components/catalogos/PatrullaForm'

export default async function CatalogosNuevaPatrullaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div>
      <ToastAuto show={error === 'serie_duplicada'} mensaje="El número de serie ya está en uso" tipo="error" />
      <ToastAuto show={error === 'serie_requerida'} mensaje="El número de serie (VIN) es obligatorio" tipo="error" />

      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: 0 }}>
          Nueva{' '}
          <span style={{ color: '#c0223a' }}>Patrulla</span>
        </h2>
        <Link
          href="/dashboard/catalogos/patrullas"
          style={{
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 10,
            color: '#64748b',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          ← Volver
        </Link>
      </div>

      <PatrullaForm />
    </div>
  )
}
