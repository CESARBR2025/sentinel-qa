'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SignOutButton } from '@/app/dashboard/sign-out-button'
import { authClient } from '@/lib/auth-client'

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
  accentColor = '#2563eb',
  user,
}: SubHeaderProps) {
  const { data: session } = authClient.useSession()
  const operador = user ?? (session?.user as { name: string; apellido?: string } | undefined)

  return (
    <header style={{ borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', gap: 24, background: '#ffffff' }}>
      <Link href={backHref} style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <ArrowLeft size={14} /> {backLabel}
      </Link>

      <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />

      <div style={{ flexGrow: 1 }}>
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 600 }}>
          {moduleLabel}
        </span>
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, letterSpacing: '0.05em', textTransform: 'uppercase', marginLeft: 12, color: '#0f172a' }}>
          {title}
          {accent && <span style={{ color: accentColor }}> {accent}</span>}
        </span>
      </div>

      {operador && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#94a3b8', display: 'block', letterSpacing: '0.1em' }}>OPERADOR</span>
            <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#1e40af' }}>{operador.name}</span>
          </div>
          <SignOutButton />
        </div>
      )}
    </header>
  )
}
