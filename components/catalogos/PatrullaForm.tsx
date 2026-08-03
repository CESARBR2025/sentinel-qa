'use client'

import Link from 'next/link'
import { crearPatrullaAction, actualizarPatrullaAction } from '@/lib/catalogos/actions'

import type { PatrullaCatalogo } from '@/lib/catalogos/types'

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'JetBrains Mono,monospace',
  fontSize: 10,
  color: '#64748b',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  marginBottom: 8,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  color: '#1e293b',
  fontFamily: 'Inter,sans-serif',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
  textTransform: 'uppercase',
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}

export default function PatrullaForm({ patrulla }: { patrulla?: PatrullaCatalogo }) {
  const esEdicion = !!patrulla
  const action = esEdicion ? actualizarPatrullaAction : crearPatrullaAction

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {patrulla && <input type="hidden" name="id" value={patrulla.id} />}

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24 }}>
        <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 20px 0', letterSpacing: '0.04em' }}>
          Identificación del vehículo
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Placa</label>
            <input name="placa" defaultValue={patrulla?.placa ?? ''} style={inputStyle} placeholder="ER-000-A1" />
          </div>
          <div>
            <label style={labelStyle}>Número de serie (VIN) *</label>
            <input name="numSerie" required defaultValue={patrulla?.numSerie ?? ''} style={inputStyle} placeholder="3N1CN7AD..." />
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24 }}>
        <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 20px 0', letterSpacing: '0.04em' }}>
          Características
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Departamento</label>
            <input name="departamento" defaultValue={patrulla?.departamento ?? ''} style={inputStyle} placeholder="SSPM" />
          </div>
          <div>
            <label style={labelStyle}>Características</label>
            <input name="caracteristicas" defaultValue={patrulla?.caracteristicas ?? ''} style={inputStyle} placeholder="SEDAN / PICK UP / MOTOCICLETA" />
          </div>
          <div>
            <label style={labelStyle}>Marca</label>
            <input name="marca" defaultValue={patrulla?.marca ?? ''} style={inputStyle} placeholder="VERSA / HILUX / FORD" />
          </div>
          <div>
            <label style={labelStyle}>Modelo (año)</label>
            <input name="modelo" defaultValue={patrulla?.modelo ?? ''} style={inputStyle} placeholder="2019" />
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24 }}>
        <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 20px 0', letterSpacing: '0.04em' }}>
          Equipamiento
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {(['gps', 'radio', 'camaras'] as const).map((campo) => {
            const etiqueta = campo === 'gps' ? 'GPS' : campo === 'radio' ? 'Radio' : 'Cámaras'
            return (
              <div key={campo}>
                <label style={labelStyle}>{etiqueta}</label>
                <select name={campo} style={selectStyle} defaultValue={patrulla?.[campo] ?? ''}>
                  <option value="">—</option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                </select>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
        <button
          type="submit"
          style={{
            padding: '10px 24px',
            background: '#0f172a',
            color: '#fff',
            fontFamily: 'Barlow Condensed,sans-serif',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {esEdicion ? 'Guardar Cambios' : 'Crear Patrulla'}
        </button>
        <Link
          href="/dashboard/catalogos/patrullas"
          style={{
            padding: '10px 20px',
            background: '#f1f5f9',
            color: '#475569',
            fontFamily: 'Barlow Condensed,sans-serif',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            display: 'inline-block',
          }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}
