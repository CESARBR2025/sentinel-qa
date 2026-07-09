/* eslint-disable react-hooks/purity */
import { obtenerUsuario, listarRolesActivos } from '@/lib/admin/repository'
import { notFound }  from 'next/navigation'
import Link          from 'next/link'
import { format }    from 'date-fns'
import { updateUser } from '@/lib/admin/actions'
import { obtenerPermisosUsuario } from '@/lib/permisos/core'
import { guardarPermisosSeccionesAction } from '@/lib/permisos/core'
import { MODULOS_POR_ROL } from '@/lib/permisos/registro'
import { labelStyle as L, inputStyle as I, selectStyle as S, btnPrimario as BTN, btnSecundario, cardStyle } from '../../admin-styles'
import { ToastAuto } from '@/components/ui/ToastAuto'

export default async function EditarUsuarioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ exito?: string }>
}) {
  const { id } = await params
  const { exito } = await searchParams

  const user = await obtenerUsuario(id)
  if (!user) notFound()

  const rolesList = await listarRolesActivos()
  const rolNombre = rolesList.find(r => r.id === user.rolId)?.nombre
  const modulo = rolNombre ? MODULOS_POR_ROL[rolNombre] : undefined
  const permisos = modulo ? await obtenerPermisosUsuario(user.id, modulo.secciones) : null

  const createdAt = new Date(user.createdAt)

  return (
    <div style={{ maxWidth: 600 }}>
      <ToastAuto show={exito === '1'} mensaje="Permisos guardados exitosamente" />
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 4px' }}>
            Editar <span style={{ color: '#2563eb' }}>Usuario</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            Creado el {format(createdAt, 'dd/MM/yyyy')}
          </p>
        </div>
        <Link href="/admin/usuarios" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>
          ← Volver
        </Link>
      </div>

      <form action={updateUser} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <input type="hidden" name="userId" value={user.id} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={L}>Nombre *</label>
            <input name="nombre" required defaultValue={user.name} style={I} />
          </div>
          <div>
            <label style={L}>Apellido</label>
            <input name="apellido" defaultValue={user.apellido ?? ''} style={I} />
          </div>
        </div>

        <div>
          <label style={L}>Correo electrónico</label>
          <input value={user.email} disabled style={{ ...I, opacity: 0.6, cursor: 'not-allowed', background: '#f8fafc' }} readOnly />
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.12em', margin: '6px 0 0' }}>
            El correo no puede modificarse
          </p>
        </div>

        <div>
          <label style={L}>Rol</label>
          <select name="rolId" defaultValue={user.rolId?.toString() ?? ''} style={S}>
            <option value="">— Sin rol asignado —</option>
            {rolesList.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={L}>Estado</label>
          <select name="activo" defaultValue={user.activo ? 'true' : 'false'} style={S}>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        <div style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
            Autenticación de dos factores
          </div>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: user.twoFactorEnabled ? '#059669' : '#64748b' }}>
            {user.twoFactorEnabled ? '✓ Habilitado' : '— No configurado'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
          <button type="submit" style={BTN}>Guardar cambios</button>
          <Link href="/admin/usuarios" style={btnSecundario}>
            Cancelar
          </Link>
        </div>
      </form>

      {modulo && permisos && (
        <div id="permisos" style={{ marginTop: 40 }}>
          <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 4px' }}>
            Permisos de <span style={{ color: '#2563eb' }}>{modulo.labelModulo}</span>
          </h3>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 16px' }}>
            Sin marcas = acceso completo por default
          </p>
          <form action={guardarPermisosSeccionesAction}>
            <input type="hidden" name="usuarioId" value={user.id} />
            <input type="hidden" name="secciones" value={modulo.secciones.join(',')} />
            <div style={cardStyle}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Sección', 'Ver', 'Crear', 'Editar', 'Eliminar'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 400 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modulo.secciones.map(seccion => {
                    const p = permisos[seccion]
                    const label = modulo.seccionLabels[seccion]
                    return (
                      <tr key={seccion} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px 16px', color: '#0f172a' }}>{label}</td>
                        <td style={{ padding: '10px 16px' }}><input type="checkbox" name={`${seccion}_ver`} defaultChecked={p.puede_ver} /></td>
                        <td style={{ padding: '10px 16px' }}><input type="checkbox" name={`${seccion}_crear`} defaultChecked={p.puede_crear} /></td>
                        <td style={{ padding: '10px 16px' }}><input type="checkbox" name={`${seccion}_editar`} defaultChecked={p.puede_editar} /></td>
                        <td style={{ padding: '10px 16px' }}><input type="checkbox" name={`${seccion}_eliminar`} defaultChecked={p.puede_eliminar} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <button type="submit" style={{ ...BTN, marginTop: 16 }}>Guardar permisos</button>
          </form>
        </div>
      )}
    </div>
  )
}
