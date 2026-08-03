'use client'

import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { eliminarPatrullaAction } from '@/lib/catalogos/actions'

import type { PatrullaCatalogo } from '@/lib/catalogos/types'

export default function PatrullasTable({ patrullas, mensajeVacio = '› Sin patrullas en el catálogo' }: {
  patrullas: PatrullaCatalogo[]
  mensajeVacio?: string
}) {
  if (patrullas.length === 0) {
    return (
      <tr>
        <td
          colSpan={10}
          style={{
            padding: '64px 0',
            textAlign: 'center',
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 11,
            color: '#94a3b8',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          {mensajeVacio}
        </td>
      </tr>
    )
  }

  return (
    <>
      {patrullas.map((p) => (
        <tr
          key={p.id}
          style={{
            borderBottom: '1px solid #e2e8f0',
            opacity: p.activo ? 1 : 0.55,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 600, fontFamily: 'JetBrains Mono,monospace', fontSize: 12 }}>
            {p.placa ?? '—'}
          </td>
          <td style={{ padding: '12px 16px', color: '#475569', fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>
            {p.numSerie}
          </td>
          <td style={{ padding: '12px 16px', color: '#475569' }}>{p.departamento ?? '—'}</td>
          <td style={{ padding: '12px 16px', color: '#475569' }}>{p.caracteristicas ?? '—'}</td>
          <td style={{ padding: '12px 16px', color: '#475569' }}>{p.marca ?? '—'}</td>
          <td style={{ padding: '12px 16px', color: '#475569' }}>{p.modelo ?? '—'}</td>
          <td style={{ padding: '12px 16px', color: '#475569' }}>{p.gps ?? '—'}</td>
          <td style={{ padding: '12px 16px', color: '#475569' }}>{p.radio ?? '—'}</td>
          <td style={{ padding: '12px 16px', color: '#475569' }}>{p.camaras ?? '—'}</td>
          <td style={{ padding: '12px 16px' }}>
            <span
              style={{
                padding: '3px 10px',
                background: p.activo ? 'rgba(5,150,105,0.1)' : 'rgba(100,116,139,0.1)',
                color: p.activo ? '#059669' : '#64748b',
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {p.activo ? 'Activa' : 'Inactiva'}
            </span>
          </td>
          <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
            <Link
              href={`/dashboard/catalogos/patrullas/${p.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 10,
                color: '#1f355a',
                letterSpacing: '0.14em',
                textDecoration: 'none',
                textTransform: 'uppercase',
                marginRight: 16,
              }}
            >
              <Pencil size={11} strokeWidth={1.5} />
              Editar
            </Link>
            <form
              action={eliminarPatrullaAction}
              onSubmit={(e) => {
                if (!window.confirm(`¿Eliminar la patrulla ${p.placa ?? p.numSerie}? Esta acción no se puede deshacer.`)) {
                  e.preventDefault()
                }
              }}
              style={{ display: 'inline-flex' }}
            >
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 10,
                  color: '#dc2626',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={11} strokeWidth={1.5} />
                Eliminar
              </button>
            </form>
          </td>
        </tr>
      ))}
    </>
  )
}
