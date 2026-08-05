'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Users, ChevronDown, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useResponsive } from '@/hooks/useResponsive'
import { listarUsuariosSesionDev, type UsuarioSesionDev } from '@/lib/auth/actions'

// ─── Componente TEMPORAL de desarrollo ───────────────────────────────────────
// Dropdown para cambiar de usuario sin login (ver lib/auth/actions.ts).
// Eliminar junto con ese archivo y la integración en components/partials/Header.tsx.

interface Props {
  currentUser?: { name: string; apellido?: string; email: string }
  roleLabel?: string
}

export function CambiarSesionDev({ currentUser, roleLabel = 'Operador Identificado' }: Props) {
  const { esMovil, esTablet } = useResponsive()
  const [abierto, setAbierto] = useState(false)
  const [usuarios, setUsuarios] = useState<UsuarioSesionDev[]>([])
  const [cargando, setCargando] = useState(false)
  const [posicion, setPosicion] = useState<{ top: number; right: number } | null>(null)
  const botonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const cargarUsuarios = useCallback(async () => {
    setCargando(true)
    try {
      setUsuarios(await listarUsuariosSesionDev())
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    if (!abierto) return
    const handler = (e: MouseEvent) => {
      const objetivo = e.target as Node
      if (botonRef.current?.contains(objetivo)) return
      if (dropdownRef.current?.contains(objetivo)) return
      setAbierto(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [abierto])

  async function alternar() {
    const nuevo = !abierto
    if (nuevo && botonRef.current) {
      const r = botonRef.current.getBoundingClientRect()
      setPosicion({ top: r.bottom + 8, right: window.innerWidth - r.right })
    }
    setAbierto(nuevo)
    if (nuevo) await cargarUsuarios()
  }

  async function cambiarA(userId: string) {
    setAbierto(false)
    try {
      // El endpoint responde 200 con los Set-Cookie de la nueva sesión (token +
      // limpieza de la cookie cache vieja). Se navega con window.location (no
      // router.push) para que la cookie viaje en la petición de /dashboard y el
      // middleware la valide.
      const res = await fetch('/api/dev/cambiar-sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (!res.ok) {
        toast.error('No se pudo cambiar de sesión')
        return
      }
      window.location.href = '/dashboard'
    } catch {
      toast.error('Error de red al cambiar de sesión')
    }
  }

  const emailActual = currentUser?.email.toLowerCase()

  return (
    <>
      {esMovil || esTablet ? (
        <button
          ref={botonRef}
          type="button"
          onClick={() => void alternar()}
          aria-label="Cambiar de sesión"
          title="Cambiar de sesión (dev)"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38, border: '1px solid #e2e8f0', background: '#fff',
            cursor: 'pointer', color: '#64748b',
          }}
        >
          <Users size={17} />
        </button>
      ) : (
        <button
          ref={botonRef}
          type="button"
          onClick={() => void alternar()}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
            background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'right',
            padding: 0,
          }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >
            {roleLabel} · dev
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: '#1f355a',
                letterSpacing: '0.12em', fontWeight: 600,
              }}
            >
              {currentUser?.name ?? ''} {currentUser?.apellido ?? ''}
            </span>
            <ChevronDown size={14} color="#64748b" style={{ transition: 'transform .15s ease', transform: abierto ? 'rotate(180deg)' : 'none' }} />
          </div>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.08em' }}>
            {currentUser?.email?.toLowerCase() ?? ''}
          </div>
        </button>
      )}

      {abierto && posicion && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed', top: posicion.top,
            left: esMovil ? 12 : undefined, right: esMovil ? 12 : posicion.right,
            width: esMovil ? 'auto' : 360, zIndex: 999999,
            maxWidth: 'calc(100vw - 24px)', maxHeight: 'calc(100vh - 24px)',
            display: 'flex', flexDirection: 'column',
            background: '#fff', border: '1px solid #e2e8f0',
            boxShadow: '0 16px 40px -12px rgba(15,23,42,0.35)',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderBottom: '1px solid #e2e8f0', flexShrink: 0,
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#1f355a',
            }}>
              Cambiar de sesión
            </span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#c0223a', border: '1px solid #c0223a',
              padding: '1px 6px',
            }}>
              dev
            </span>
          </div>

          <div style={{ maxHeight: 380, overflowY: 'auto', flex: 1 }}>
            {cargando && usuarios.length === 0 && (
              <div style={{ padding: '26px 14px', textAlign: 'center', color: '#94a3b8' }}>
                <RefreshCw size={18} style={{ marginBottom: 6, animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ margin: 0, fontSize: 12 }}>Cargando usuarios…</p>
              </div>
            )}
            {!cargando && usuarios.length === 0 && (
              <div style={{ padding: '28px 14px', textAlign: 'center', color: '#94a3b8' }}>
                <Users size={22} style={{ marginBottom: 6, opacity: 0.6 }} />
                <p style={{ margin: 0, fontSize: 12 }}>Sin usuarios activos</p>
              </div>
            )}
            {(() => {
              const items: React.ReactNode[] = []
              let rolActual: string | null = null
              for (const u of usuarios) {
                if (u.rolNombre !== rolActual) {
                  rolActual = u.rolNombre
                  items.push(
                    <div key={`rol-${rolActual ?? 'sin'}`} style={{
                      padding: '8px 14px 4px', fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: '#94a3b8', borderTop: items.length > 0 ? '1px solid #f1f5f9' : 'none',
                    }}>
                      {rolActual ?? 'Sin rol'}
                    </div>,
                  )
                }
                const esActual = emailActual !== undefined && u.email.toLowerCase() === emailActual
                items.push(
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => void cambiarA(u.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      textAlign: 'left', cursor: 'pointer', padding: '9px 14px',
                      border: 'none', borderBottom: '1px solid #f1f5f9',
                      background: esActual ? '#f8fafc' : '#fff',
                    }}
                  >
                    <span style={{
                      flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: esActual ? 'rgba(31,53,90,0.12)' : '#f1f5f9',
                      color: esActual ? '#1f355a' : '#64748b',
                    }}>
                      <Users size={14} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 12.5, fontWeight: esActual ? 700 : 500, color: '#0f172a' }}>
                        {u.name} {u.apellido}
                      </span>
                      <span style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: '#94a3b8' }}>
                        {u.email.toLowerCase()}
                      </span>
                    </span>
                    {esActual && (
                      <span style={{
                        flexShrink: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                        letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1f355a',
                      }}>
                        actual
                      </span>
                    )}
                  </button>,
                )
              }
              return items
            })()}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
