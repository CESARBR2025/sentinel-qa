import { listarUsuarios } from '@/lib/admin/repository'
import Link        from 'next/link'
import { btnPrimario, cardStyle } from '../admin-styles'
import { ToastAuto } from '@/components/ui/ToastAuto'
import { MODULOS_POR_ROL } from '@/lib/permisos/registro'

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ exito?: string }>
}) {
  const { exito } = await searchParams
  const lista = await listarUsuarios()

  return (
    <div>
      <ToastAuto show={exito === 'creado'} mensaje="Usuario creado exitosamente" />
      <ToastAuto show={exito === 'actualizado'} mensaje="Usuario actualizado exitosamente" />
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 4px' }}>
            Gestión de <span style={{ color: '#2563eb' }}>Usuarios</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            {lista.length} usuario{lista.length !== 1 ? 's' : ''} registrado{lista.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/usuarios/nuevo"
          style={{ ...btnPrimario, textDecoration: 'none', display: 'inline-block' }}
        >
          + Nuevo Usuario
        </Link>
      </div>

      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Usuario', 'Correo', 'Rol', 'Estado', '2FA', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 400 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 600 }}>
                  {u.name} {u.apellido}
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>
                  {u.email}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {u.rolNombre ? (
                    <span style={{ padding: '3px 10px', background: '#eff6ff', color: '#2563eb', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {u.rolNombre}
                    </span>
                  ) : (
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 10px',
                    background: u.activo ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)',
                    color: u.activo ? '#059669' : '#dc2626',
                    fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: u.twoFactorEnabled ? '#059669' : '#94a3b8' }}>
                  {u.twoFactorEnabled ? '✓ ON' : '— OFF'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {u.rolNombre && MODULOS_POR_ROL[u.rolNombre] && (
                    <Link
                      href={`/admin/usuarios/${u.id}#permisos`}
                      style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.14em', textDecoration: 'none', textTransform: 'uppercase', marginRight: 16 }}
                    >
                      Permisos
                    </Link>
                  )}
                  <Link
                    href={`/admin/usuarios/${u.id}`}
                    style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#2563eb', letterSpacing: '0.14em', textDecoration: 'none', textTransform: 'uppercase' }}
                  >
                    Editar →
                  </Link>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '64px 0', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  › Sin usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
