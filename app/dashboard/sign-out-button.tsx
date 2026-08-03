'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
      style={{
        fontFamily:      'JetBrains Mono,monospace',
        fontSize:        10,
        letterSpacing:   '0.18em',
        textTransform:   'uppercase',
        padding:         esMovil ? '8px 10px' : '8px 14px',
        border:          `1px solid ${hover ? '#c0223a' : '#2a3a5e'}`,
        background:      hover ? 'rgba(192,34,58,0.12)' : 'transparent',
        color:           hover ? '#e03349' : '#7f8faf',
        cursor:          'pointer',
        whiteSpace:      'nowrap',
        boxShadow:       hover ? '0 0 0 3px rgba(192,34,58,0.15)' : 'none',
        transition:      'all .15s ease',
      }}
    >
      {esMovil ? 'Salir →' : 'Cerrar sesión →'}
    </button>
  )
}
