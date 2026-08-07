'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
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
      borderBottom: '1px solid var(--apple-glass-border)',
      background: 'var(--apple-glass-bg)', backdropFilter: 'blur(20px) saturate(180%)',
      paddingLeft: esMovil ? 12 : esTablet ? 24 : 48,
      paddingRight: esMovil ? 12 : esTablet ? 24 : 48,
      paddingTop: 'env(safe-area-inset-top)',
      height: esMovil ? 48 : esTablet ? 56 : 64,
      display: 'flex', alignItems: 'center', gap: esMovil ? 10 : esTablet ? 14 : 24,
    }}>
      <Link
        href={backHref}
        aria-label={backLabel}
        title={backLabel}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 40, marginLeft: esMovil ? -8 : -10, flexShrink: 0,
          borderRadius: 'var(--radius-lg)', color: '#475569',
        }}
      >
        <ChevronLeft size={22} strokeWidth={2} />
      </Link>

      <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />

      <div style={{ flexGrow: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        {esMovil ? null : (
          <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b', fontWeight: 500 }}>
            {moduleLabel}
          </span>
        )}
        <span style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: esMovil ? 16 : esTablet ? 18 : 22, marginLeft: esMovil ? 8 : esTablet ? 10 : 12, color: '#0f172a' }}>
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
              <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, color: '#94a3b8', display: 'block' }}>Operador</span>
              <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{operador.name}</span>
            </div>
            )}
            <SignOutButton />
          </>
        )}
      </div>
    </header>
  )
}
