'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SignOutButton } from '@/app/dashboard/sign-out-button'
import { authClient } from '@/lib/auth-client'
import { CampanillaNotificaciones } from '@/components/notificaciones/CampanillaNotificaciones'
import { useResponsive } from '@/hooks/useResponsive'

interface SubHeaderProps {
  backHref: string
  backLabel: string
  moduleLabel?: string
  title: string
  accent?: string
  accentColor?: string
  user?: { name: string; apellido?: string }
}

export function SubHeader({
  backHref,
  backLabel,
  moduleLabel = 'Seguridad Pública Municipal',
  title,
  accent,
  accentColor = '#1f355a',
  user,
}: SubHeaderProps) {
  const { data: session } = authClient.useSession()
  const operador = user ?? (session?.user as { name: string; apellido?: string } | undefined)
  const { esMovil, esTablet } = useResponsive()

  return (
    <header style={{
      borderBottom: '1px solid #e2e8f0',
      paddingLeft: esMovil ? 12 : esTablet ? 24 : 48,
      paddingRight: esMovil ? 12 : esTablet ? 24 : 48,
      paddingTop: 'env(safe-area-inset-top)',
      height: esMovil ? 48 : esTablet ? 56 : 64,
      display: 'flex', alignItems: 'center', gap: esMovil ? 10 : esTablet ? 14 : 24, background: '#ffffff',
    }}>
      <Link href={backHref} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
        <ArrowLeft size={14} /> {esMovil ? null : backLabel}
      </Link>

      <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />

      <div style={{ flexGrow: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        {esMovil ? null : (
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase', fontWeight: 600 }}>
            {moduleLabel}
          </span>
        )}
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: esMovil ? 16 : esTablet ? 18 : 22, letterSpacing: '0.05em', textTransform: 'uppercase', marginLeft: esMovil ? 8 : esTablet ? 10 : 12, color: '#0f172a' }}>
          {title}
          {accent && <span style={{ color: accentColor }}> {accent}</span>}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Fuera del bloque de `operador`: la sesión del cliente tarda un
            instante en resolverse y la campanita no debe parpadear. */}
        <CampanillaNotificaciones />
        {operador && (
          <>
            {esMovil ? null : (
            <div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#94a3b8', display: 'block', letterSpacing: '0.1em' }}>OPERADOR</span>
              <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#172844' }}>{operador.name}</span>
            </div>
            )}
            <SignOutButton />
          </>
        )}
      </div>
    </header>
  )
}
