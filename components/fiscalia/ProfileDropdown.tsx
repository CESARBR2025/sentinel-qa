'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { ChevronDown, LogOut, User } from 'lucide-react'

interface Props {
  name: string
  apellido?: string
  email: string
}

export function ProfileDropdown({ name, apellido, email }: Props) {
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    setSigningOut(true)
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push('/login') },
    })
  }

  const fullName = `${name} ${apellido ?? ''}`.trim()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 12px',
          border: `1px solid ${open ? '#7c3aed' : '#e2e8f0'}`,
          background: open ? '#f5f3ff' : '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          fontFamily: 'Inter,sans-serif',
        }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.borderColor = '#c4b5fd'; e.currentTarget.style.background = '#f8fafc'; }}}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}}
      >
        <div style={{
          width: 30, height: 30,
          background: '#7c3aed', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Barlow Condensed,sans-serif',
          fontSize: 14, fontWeight: 700,
          borderRadius: '50%',
          flexShrink: 0,
        }}>
          {name.charAt(0).toUpperCase()}
        </div>

        <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#0f172a', fontWeight: 600 }}>
            {fullName}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b' }}>
            Agente Fiscalía
          </div>
        </div>

        <ChevronDown
          size={14}
          style={{
            color: '#94a3b8',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            width: 240,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)',
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          {/* Header info */}
          <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#0f172a', fontWeight: 600 }}>
              {fullName}
            </div>
            <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#64748b', marginTop: 2 }}>
              {email}
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              cursor: signingOut ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter,sans-serif',
              fontSize: 12,
              color: '#dc2626',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={14} />
            {signingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </button>
        </div>
      )}
    </div>
  )
}
