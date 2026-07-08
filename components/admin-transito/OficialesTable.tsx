'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, RotateCcw } from 'lucide-react'
import ModalDestituirOficial from './ModalDestituirOficial'
import ModalReactivarOficial from './ModalReactivarOficial'

import type { PatrullaAsignacion } from '@/lib/flota/types'

interface Departamento {
  id: string
  clave: string
  nombre: string
}

interface Oficial {
  id: string
  userName: string
  userApellido: string
  noNomina: string | null
  numeroEmpleado: string | null
  telefono: string | null
  departamentoId: string | null
  departamentoNombre: string | null
  patrullaId: string | null
  patrullaUnidad: string | null
  userId: string | null
  ofiEstatus: string
}

interface Props {
  oficiales: Oficial[]
  deptos: Departamento[]
  patrullas: PatrullaAsignacion[]
}

type AccionModal =
  | { type: 'destituir'; id: string; userId: string; nombre: string }
  | {
      type: 'reactivar'
      id: string
      userId: string
      nombre: string
      noNomina: string | null
      telefono: string | null
      departamentoId: string | null
      patrullaId: string | null
    }
  | null

export default function OficialesTable({ oficiales, deptos, patrullas }: Props) {
  const [modal, setModal] = useState<AccionModal>(null)

  if (oficiales.length === 0) {
    return (
      <tr>
        <td
          colSpan={6}
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
          › Sin oficiales registrados
        </td>
      </tr>
    )
  }

  return (
    <>
      {oficiales.map((o) => {
        const nombreCompleto = `${o.userName} ${o.userApellido}`.trim()
        const estatusActivo = o.ofiEstatus === 'activo'
        const estatusDestituido = o.ofiEstatus === 'destituido'
        const userId = o.userId

        return (
          <tr
            key={o.id}
            style={{
              borderBottom: '1px solid #e2e8f0',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fafafa' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 600 }}>
              {nombreCompleto}
            </td>
            <td
              style={{
                padding: '12px 16px',
                color: '#64748b',
                fontFamily: 'JetBrains Mono,monospace',
                fontSize: 11,
              }}
            >
              <div>{o.noNomina ?? '—'}</div>
              <div style={{ color: '#94a3b8', fontSize: 10 }}>{o.numeroEmpleado ?? ''}</div>
            </td>
            <td style={{ padding: '12px 16px', color: '#475569' }}>
              {o.departamentoNombre ?? (
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8' }}>—</span>
              )}
            </td>
            <td style={{ padding: '12px 16px', color: '#475569' }}>
              {o.patrullaUnidad ?? (
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8' }}>—</span>
              )}
            </td>
            <td style={{ padding: '12px 16px' }}>
              <span
                style={{
                  padding: '3px 10px',
                  background: estatusActivo ? 'rgba(5,150,105,0.1)' : estatusDestituido ? 'rgba(234,179,8,0.1)' : 'rgba(220,38,38,0.1)',
                  color: estatusActivo ? '#059669' : estatusDestituido ? '#a16207' : '#dc2626',
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {estatusActivo ? 'Activo' : estatusDestituido ? 'Destituido' : 'Inactivo'}
              </span>
            </td>
            <td
              style={{
                padding: '12px 16px',
                textAlign: 'right',
                whiteSpace: 'nowrap',
              }}
            >
              {userId && estatusDestituido ? (
                <button
                  onClick={() =>
                    setModal({
                      type: 'reactivar',
                      id: o.id,
                      userId,
                      nombre: nombreCompleto,
                      noNomina: o.noNomina,
                      telefono: o.telefono,
                      departamentoId: o.departamentoId,
                      patrullaId: o.patrullaId,
                    })
                  }
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 10,
                    color: '#16a34a',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={11} strokeWidth={1.5} />
                  Revisar y Reactivar
                </button>
              ) : (
                <Link
                  href={`/admin-transito/oficiales/${o.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 10,
                    color: '#2563eb',
                    letterSpacing: '0.14em',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    marginRight: 16,
                  }}
                >
                  <Pencil size={11} strokeWidth={1.5} />
                  Editar
                </Link>
              )}
              {userId && estatusActivo && (
                <button
                  onClick={() =>
                    setModal({ type: 'destituir', id: o.id, userId, nombre: nombreCompleto })
                  }
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
                  Destituir
                </button>
              )}
            </td>
          </tr>
        )
      })}

      {modal?.type === 'destituir' && (
        <ModalDestituirOficial
          oficialId={modal.id}
          userId={modal.userId}
          oficialNombre={modal.nombre}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'reactivar' && (
        <ModalReactivarOficial
          oficialId={modal.id}
          userId={modal.userId}
          oficialNombre={modal.nombre}
          noNomina={modal.noNomina}
          telefono={modal.telefono}
          departamentoId={modal.departamentoId}
          patrullaId={modal.patrullaId}
          deptos={deptos}
          patrullas={patrullas}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
