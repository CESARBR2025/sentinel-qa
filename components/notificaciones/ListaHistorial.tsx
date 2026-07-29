'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

interface NotificacionHistorial {
  id: string
  evento: string
  titulo: string
  mensaje: string
  href: string | null
  severidad: 'info' | 'aviso' | 'critico'
  leida: boolean
  creadoEn: string
  modulo: string
}

const COLOR_SEVERIDAD: Record<string, string> = {
  info: '#0284c7',
  aviso: '#ea580c',
  critico: '#dc2626',
}

function formatoFecha(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('es-MX', {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

export function ListaHistorial({ notificaciones, noLeidas, total, pagina, totalPaginas, soloNoLeidas }: {
  notificaciones: NotificacionHistorial[]
  noLeidas: number
  total: number
  pagina: number
  totalPaginas: number
  soloNoLeidas: boolean
}) {
  const router = useRouter()
  const [items, setItems] = useState(notificaciones)
  const [pendientes, setPendientes] = useState(noLeidas)

  async function abrir(n: NotificacionHistorial) {
    if (!n.leida) {
      setItems(prev => prev.map(x => x.id === n.id ? { ...x, leida: true } : x))
      setPendientes(c => Math.max(0, c - 1))
      await fetch('/api/notificaciones/leer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: n.id }),
      })
    }
    if (n.href) router.push(n.href)
    else router.refresh()
  }

  async function marcarTodas() {
    setItems(prev => prev.map(x => ({ ...x, leida: true })))
    setPendientes(0)
    await fetch('/api/notificaciones/leer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todas: true }),
    })
    router.refresh()
  }

  const filtroHref = (v: boolean) => `/notificaciones?soloNoLeidas=${v}`

  return (
    <section style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        flexWrap: 'wrap', padding: '14px 18px', borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#64748b',
          }}>
            {total} en total · {pendientes} sin leer
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href={filtroHref(false)} style={chip(!soloNoLeidas)}>Todas</Link>
          <Link href={filtroHref(true)} style={chip(soloNoLeidas)}>Sin leer</Link>
          {pendientes > 0 && (
            <button type="button" onClick={() => void marcarTodas()} style={{
              padding: '6px 12px', border: 'none', background: '#1f355a', color: '#fff', cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Marcar todas
            </button>
          )}
        </div>
      </div>

      {items.length === 0 && (
        <p style={{ margin: 0, padding: '40px 18px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
          › Sin notificaciones
        </p>
      )}

      {items.map(n => (
        <button
          key={n.id}
          type="button"
          onClick={() => void abrir(n)}
          style={{
            display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
            padding: '14px 18px', border: 'none', borderBottom: '1px solid #f1f5f9',
            background: n.leida ? '#fff' : '#f8fafc',
            borderLeft: `3px solid ${n.leida ? 'transparent' : COLOR_SEVERIDAD[n.severidad] ?? '#0284c7'}`,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
            <span style={{
              fontFamily: 'Inter, sans-serif', fontSize: 13.5,
              fontWeight: n.leida ? 500 : 700, color: '#0f172a',
              // Sin esto, el hijo flex no envuelve y el título se corta
              // contra el borde en vez de pasar a una segunda línea.
              minWidth: 0, overflowWrap: 'break-word',
            }}>
              {n.titulo}
            </span>
            <span style={{
              flexShrink: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: '#94a3b8',
            }}>
              {formatoFecha(n.creadoEn)}
            </span>
          </span>
          <span style={{
            display: 'block', marginTop: 4, fontFamily: 'Inter, sans-serif',
            fontSize: 12, color: '#64748b', lineHeight: 1.5,
          }}>
            {n.mensaje}
          </span>
          <span style={{
            display: 'inline-block', marginTop: 6, padding: '2px 7px',
            border: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono, monospace',
            fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8',
          }}>
            {n.modulo}
          </span>
        </button>
      ))}

      {totalPaginas > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
          padding: '14px 18px', borderTop: '1px solid #e2e8f0',
        }}>
          {pagina > 1 && (
            <Link href={`/notificaciones?pagina=${pagina - 1}&soloNoLeidas=${soloNoLeidas}`} style={enlacePagina}>
              ‹ Anterior
            </Link>
          )}
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#64748b' }}>
            {pagina} / {totalPaginas}
          </span>
          {pagina < totalPaginas && (
            <Link href={`/notificaciones?pagina=${pagina + 1}&soloNoLeidas=${soloNoLeidas}`} style={enlacePagina}>
              Siguiente ›
            </Link>
          )}
        </div>
      )}
    </section>
  )
}

function chip(activo: boolean): React.CSSProperties {
  return {
    padding: '6px 12px', textDecoration: 'none',
    border: `1px solid ${activo ? '#1f355a' : '#cbd5e1'}`,
    background: activo ? '#1f355a' : '#fff',
    color: activo ? '#fff' : '#475569',
    fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
    letterSpacing: '0.1em', textTransform: 'uppercase',
  }
}

const enlacePagina: React.CSSProperties = {
  padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff',
  color: '#475569', textDecoration: 'none',
  fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
  letterSpacing: '0.1em', textTransform: 'uppercase',
}
