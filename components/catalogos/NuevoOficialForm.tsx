'use client'

import { crearOficial } from '@/lib/catalogos/actions'
import Link from 'next/link'
import PatrullaSelector from '@/components/admin-transito/PatrullaSelector'

import type { PatrullaAsignacion } from '@/lib/flota/types'

interface Departamento {
  id: string
  clave: string
  nombre: string
}

interface Sector {
  id: number
  clave: string
  nombre: string
}

interface Props {
  deptos: Departamento[]
  patrullas: PatrullaAsignacion[]
  sectores: Sector[]
}

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
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
}

// Campos de texto en UPPER (excepto correo/contraseña) para evitar discrepancias
// de mayúsculas/minúsculas en nóminas, empleados, teléfonos, nombres.
const uppercaseStyle: React.CSSProperties = {
  ...inputStyle,
  textTransform: 'uppercase',
}

function onUpper(e: React.ChangeEvent<HTMLInputElement>) {
  e.target.value = e.target.value.toUpperCase()
}

export default function NuevoOficialForm({ deptos, patrullas, sectores }: Props) {
  return (
    <form action={crearOficial} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: 24,
        }}
      >
        <h3
          style={{
            fontFamily: 'Barlow Condensed,sans-serif',
            fontSize: 16,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#0f172a',
            margin: '0 0 20px 0',
            letterSpacing: '0.04em',
          }}
        >
          Datos de Acceso
        </h3>

        <div className="grid-2">
          <div>
            <label style={labelStyle}>Correo electrónico *</label>
            <input
              name="email"
              type="email"
              required
              style={inputStyle}
              placeholder="oficial@sspm-sjr.gob.mx"
            />
          </div>
          <div>
            <label style={labelStyle}>Contraseña *</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              style={inputStyle}
            />
          </div>
        </div>

        <div
          className="grid-2"
          style={{
            marginTop: 16,
          }}
        >
          <div>
            <label style={labelStyle}>Nombre *</label>
            <input
              name="userName"
              required
              style={uppercaseStyle}
              onChange={onUpper}
              placeholder="CARLOS"
            />
          </div>
          <div>
            <label style={labelStyle}>Apellido *</label>
            <input
              name="userApellido"
              required
              style={uppercaseStyle}
              onChange={onUpper}
              placeholder="GARCÍA"
            />
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: 24,
        }}
      >
        <h3
          style={{
            fontFamily: 'Barlow Condensed,sans-serif',
            fontSize: 16,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#0f172a',
            margin: '0 0 20px 0',
            letterSpacing: '0.04em',
          }}
        >
          Datos del Oficial
        </h3>

        <div className="grid-2">
          <div>
            <label style={labelStyle}>No. Nómina</label>
            <input name="noNomina" style={uppercaseStyle} onChange={onUpper} placeholder="123-123" />
          </div>
          <div>
            <label style={labelStyle}>No. Empleado</label>
            <input name="numeroEmpleado" style={uppercaseStyle} onChange={onUpper} placeholder="EMP-123-123" />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={labelStyle}>Teléfono</label>
          <input name="telefono" style={uppercaseStyle} onChange={onUpper} placeholder="427-201-16-25" />
        </div>
      </div>

      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: 24,
        }}
      >
        <h3
          style={{
            fontFamily: 'Barlow Condensed,sans-serif',
            fontSize: 16,
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#0f172a',
            margin: '0 0 20px 0',
            letterSpacing: '0.04em',
          }}
        >
          Asignación
        </h3>

        <div className="grid-2">
          <div>
            <label style={labelStyle}>Departamento</label>
            <select name="departamentoId" style={selectStyle}>
              <option value="">— Seleccionar —</option>
              {deptos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Unidad / Patrulla</label>
            <PatrullaSelector patrullas={patrullas} />
          </div>
          <div>
            <label style={labelStyle}>Sector</label>
            <select name="sectorId" style={selectStyle}>
              <option value="">— Sin asignar —</option>
              {sectores.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 8 }}>
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
          Crear Oficial
        </button>
        <Link
          href="/dashboard/catalogos/oficiales"
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
