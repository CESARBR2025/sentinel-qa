'use client'

import { useState } from 'react'
import { Upload, CheckCircle2 } from 'lucide-react'
import { SubirEvidenciaModal } from './SubirEvidenciaModal'
import React from 'react'

export function BotonSubirDenuncia({
  denunciaId,
  solicitudId,
}: {
  denunciaId: string
  solicitudId: number
}) {
  const [open, setOpen] = useState(false)

  const completar = async () => {
    if (!window.confirm(`¿Estás seguro de completar la Solicitud #${solicitudId}? Será marcada como atendida y se notificará a Fiscalía.`)) return
    await fetch(`/api/monitorista/denuncias/${denunciaId}/completar-solicitud`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solicitudId }),
    })
    window.location.reload()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '8px 16px',
          background: '#d4a43a', color: '#050810', border: 'none', borderRadius: 2,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <Upload size={14} /> SUBIR
      </button>
      <button
        onClick={completar}
        style={{
          fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '8px 16px',
          background: '#4a9e6a', color: '#ffffff', border: 'none', borderRadius: 2,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <CheckCircle2 size={14} /> COMPLETAR
      </button>

      {open && (
        <SubirEvidenciaModal
          solicitudId={`${denunciaId}_${solicitudId}`}
          incidenteId={denunciaId}
          origen="denuncia"
          denunciaSolicitudId={solicitudId}
          onClose={() => { setOpen(false); window.location.reload() }}
        />
      )}
    </>
  )
}
