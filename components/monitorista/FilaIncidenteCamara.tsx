'use client'

import React from 'react'

export function FilaIncidenteCamara({
  registro,
}: {
  registro: {
    id: string
    fecha: string
    turno: string
    personas_sin_novedad: number
    personas_con_antecedentes: number
    vehiculos_revisar: number
    vehiculos_repuve: number
    motos_revisadas: number
    persecuciones: number
    asegurados_camara: number
    vehiculos_recuperados: number
    incendios: number
    hechos_transito: number
    total_personas_revisadas: number
  }
}) {
  const turnoLabel: Record<string, string> = {
    MATUTINO: '07-15 HRS',
    VESPERTINO: '15-22 HRS',
    NOCTURNO: '22-07 HRS',
  }

  function formatFecha(raw: string): string {
    const d = raw.includes('T') ? new Date(raw) : new Date(raw + 'T00:00:00')
    if (isNaN(d.getTime())) return raw
    return d.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  return (
    <tr
      style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}
      onClick={() => window.location.href = `/monitorista/incidentes-camara/${registro.id}`}
      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
      onMouseLeave={e => (e.currentTarget.style.background = '')}
    >
      <Td>{formatFecha(registro.fecha)}</Td>
      <Td><span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, background: '#f1f5f9', padding: '2px 8px', borderRadius: 2, color: '#475569' }}>{turnoLabel[registro.turno] || registro.turno}</span></Td>
      <Td>{registro.personas_sin_novedad}</Td>
      <Td>{registro.personas_con_antecedentes}</Td>
      <Td>{registro.vehiculos_revisar}</Td>
      <Td>{registro.vehiculos_repuve}</Td>
      <Td>{registro.motos_revisadas}</Td>
      <Td>{registro.persecuciones}</Td>
      <Td>{registro.asegurados_camara}</Td>
      <Td>{registro.vehiculos_recuperados}</Td>
      <Td>{registro.incendios}</Td>
      <Td>{registro.hechos_transito}</Td>
      <Td><strong>{registro.total_personas_revisadas}</strong></Td>
    </tr>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ fontFamily: 'Inter', fontSize: 12, color: '#1e293b', padding: '10px 12px' }}>{children}</td>
}
