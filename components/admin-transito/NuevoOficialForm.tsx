'use client'

import { crearOficial } from '@/lib/admin-transito/actions'
import PatrullaSelector from './PatrullaSelector'

import type { PatrullaAsignacion } from '@/lib/flota/types'

interface Departamento {
  id: string
  clave: string
  nombre: string
}

interface Props {
  deptos: Departamento[]
  patrullas: PatrullaAsignacion[]
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

export default function NuevoOficialForm({ deptos, patrullas }: Props) {
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
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
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginTop: 16,
          }}
        >
          <div>
            <label style={labelStyle}>Nombre *</label>
            <input
              name="userName"
              required
              style={{ ...inputStyle, textTransform: 'uppercase' }}
              placeholder="CARLOS"
            />
          </div>
          <div>
            <label style={labelStyle}>Apellido *</label>
            <input
              name="userApellido"
              required
              style={{ ...inputStyle, textTransform: 'uppercase' }}
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          <div>
            <label style={labelStyle}>No. Nómina</label>
            <input name="noNomina" style={inputStyle} placeholder="123-123" />
          </div>
          <div>
            <label style={labelStyle}>No. Empleado</label>
            <input name="numeroEmpleado" style={inputStyle} placeholder="EMP-123-123" />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={labelStyle}>Teléfono</label>
          <input name="telefono" style={inputStyle} placeholder="427-201-16-25" />
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
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
          Crear Oficial
        </button>
        <a
          href="/admin-transito/oficiales"
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
        </a>
      </div>
    </form>
  )
}
