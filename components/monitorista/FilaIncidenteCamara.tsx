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
    MATUTINO: '07-15 hrs',
    VESPERTINO: '15-22 hrs',
    NOCTURNO: '22-07 hrs',
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
      <Td><span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, background: '#f1f5f9', padding: '2px 10px', borderRadius: 'var(--radius-full)', color: '#475569' }}>{turnoLabel[registro.turno] || registro.turno}</span></Td>
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
  return <td style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#1e293b', padding: '10px 12px' }}>{children}</td>
}
