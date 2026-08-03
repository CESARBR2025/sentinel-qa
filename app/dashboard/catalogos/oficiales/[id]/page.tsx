import { redirect } from 'next/navigation'
import Link from 'next/link'
import { listarPatrullasParaAsignacion } from '@/lib/flota/service'
import { listarDepartamentosActivos, obtenerOficialPorId } from '@/lib/admin-transito/repository'
import { actualizarOficial } from '@/lib/catalogos/actions'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import PatrullaSelector from '@/components/admin-transito/PatrullaSelector'

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

const btnPrimario: React.CSSProperties = {
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
}

const btnSecundario: React.CSSProperties = {
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
}

export default async function CatalogosEditarOficialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams

  const oficial = await obtenerOficialPorId(id)
  if (!oficial) {
    redirect('/dashboard/catalogos/oficiales?error=no_encontrado')
  }

  const deptos = await listarDepartamentosActivos()
  const patrullas = await listarPatrullasParaAsignacion()

  return (
    <div>
      <PageHeader
        title="Editar"
        accent="Oficial"
        actions={<PageHeaderLink href="/dashboard/catalogos/oficiales" variant="secondary">← Volver</PageHeaderLink>}
      />

      {error === 'datos_invalidos' && (
        <div
          style={{
            padding: '12px 16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            marginBottom: 24,
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 11,
            color: '#dc2626',
            letterSpacing: '0.1em',
          }}
        >
          ✕ Error al actualizar el oficial
        </div>
      )}

      <form action={actualizarOficial} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <input type="hidden" name="id" value={oficial.id} />
        <input type="hidden" name="userId" value={oficial.userId ?? ''} />

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 20px 0', letterSpacing: '0.04em' }}>
            Datos del Usuario
          </h3>
          <div className="grid-2">
            <div>
              <label style={labelStyle}>Nombre *</label>
              <input name="userName" required defaultValue={oficial.userName} style={{ ...inputStyle, textTransform: 'uppercase' }} />
            </div>
            <div>
              <label style={labelStyle}>Apellido *</label>
              <input name="userApellido" required defaultValue={oficial.userApellido} style={{ ...inputStyle, textTransform: 'uppercase' }} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Correo electrónico</label>
            <input name="userEmail" type="email" defaultValue={oficial.userEmail} style={inputStyle} />
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 20px 0', letterSpacing: '0.04em' }}>
            Datos del Oficial
          </h3>
          <div className="grid-2">
            <div>
              <label style={labelStyle}>No. Nómina</label>
              <input name="noNomina" defaultValue={oficial.noNomina ?? ''} style={{ ...inputStyle, textTransform: 'uppercase' }} />
            </div>
            <div>
              <label style={labelStyle}>No. Empleado</label>
              <input name="numeroEmpleado" defaultValue={oficial.numeroEmpleado ?? ''} style={{ ...inputStyle, textTransform: 'uppercase' }} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Teléfono</label>
            <input name="telefono" defaultValue={oficial.telefono ?? ''} style={{ ...inputStyle, textTransform: 'uppercase' }} />
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', margin: '0 0 20px 0', letterSpacing: '0.04em' }}>
            Asignación
          </h3>
          <div className="grid-2">
            <div>
              <label style={labelStyle}>Departamento</label>
              <select name="departamentoId" style={selectStyle} defaultValue={oficial.departamentoId ?? ''}>
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
              <PatrullaSelector patrullas={patrullas} defaultValue={oficial.patrullaId ?? undefined} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 8 }}>
          <button type="submit" style={btnPrimario}>Guardar Cambios</button>
          <Link href="/dashboard/catalogos/oficiales" style={btnSecundario}>Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
