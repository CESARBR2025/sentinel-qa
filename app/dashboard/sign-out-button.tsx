'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
  const router  = useRouter()
  const [hover, setHover] = useState(false)

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
        padding:         '8px 14px',
        border:          `1px solid ${hover ? '#c0223a' : '#2a3a5e'}`,
        background:      hover ? 'rgba(192,34,58,0.12)' : 'transparent',
        color:           hover ? '#e03349' : '#7f8faf',
        cursor:          'pointer',
        boxShadow:       hover ? '0 0 0 3px rgba(192,34,58,0.15)' : 'none',
        transition:      'all .15s ease',
      }}
    >
      Cerrar sesión →
    </button>
  )
}
