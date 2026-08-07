'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export function SignOutButton() {
  const router  = useRouter()
  const [hover, setHover] = useState(false)
  const esMovil = useMediaQuery('(max-width: 720px)')

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push('/login') },
    })
  }

  return (
    <button
      onClick={handleSignOut}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Cerrar sesión"
      style={{
        fontFamily:      'var(--apple-font-display)',
        fontSize:        13,
        fontWeight:      500,
        display:         esMovil ? 'flex' : 'block',
        alignItems:      esMovil ? 'center' : undefined,
        justifyContent:  esMovil ? 'center' : undefined,
        width:           esMovil ? 40 : undefined,
        height:          esMovil ? 40 : undefined,
        padding:         esMovil ? 0 : '8px 14px',
        borderRadius:    'var(--radius-lg)',
        border:          `1px solid ${hover ? '#cbd5e1' : '#e2e8f0'}`,
        background:      hover ? '#f1f5f9' : 'transparent',
        color:           hover ? '#0f172a' : '#64748b',
        cursor:          'pointer',
        whiteSpace:      'nowrap',
        transition:      'all .15s ease',
      }}
    >
      {esMovil ? <LogOut size={16} /> : 'Cerrar sesión →'}
    </button>
  )
}
