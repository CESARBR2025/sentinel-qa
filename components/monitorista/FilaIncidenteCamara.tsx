'use client'

import React from 'react'

export function FilaIncidenteCamara({
  registro,
}: {
  registro: {
    id: string
    fecha: string
    turno: string
    personasSinNovedad: number
    personasConAntecedentes: number
    vehiculosRevisar: number
    vehiculosRepuve: number
    motosRevisadas: number
    persecuciones: number
    aseguradosCamara: number
    vehiculosRecuperados: number
    incendios: number
    hechosTransito: number
    totalPersonasRevisadas: number
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
      <Td>{registro.personasSinNovedad}</Td>
      <Td>{registro.personasConAntecedentes}</Td>
      <Td>{registro.vehiculosRevisar}</Td>
      <Td>{registro.vehiculosRepuve}</Td>
      <Td>{registro.motosRevisadas}</Td>
      <Td>{registro.persecuciones}</Td>
      <Td>{registro.aseguradosCamara}</Td>
      <Td>{registro.vehiculosRecuperados}</Td>
      <Td>{registro.incendios}</Td>
      <Td>{registro.hechosTransito}</Td>
      <Td><strong>{registro.totalPersonasRevisadas}</strong></Td>
    </tr>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ fontFamily: 'Inter', fontSize: 12, color: '#1e293b', padding: '10px 12px' }}>{children}</td>
}
