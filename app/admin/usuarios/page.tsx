import { db }    from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import Link        from 'next/link'

export default async function UsuariosPage() {
  const lista = await db
    .select({
      id:               users.id,
      name:             users.name,
      apellido:         users.apellido,
      email:            users.email,
      activo:           users.activo,
      twoFactorEnabled: users.twoFactorEnabled,
      rolNombre:        roles.nombre,
    })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .orderBy(asc(users.createdAt))

  return (
    <div>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#d8e0f0', margin: '0 0 4px' }}>
            Gestión de <span style={{ color: '#d4a43a' }}>Usuarios</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            {lista.length} usuario{lista.length !== 1 ? 's' : ''} registrado{lista.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/usuarios/nuevo"
          style={{ padding: '10px 20px', background: '#c0223a', color: '#fff', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          + Nuevo Usuario
        </Link>
      </div>

      <div style={{ border: '1px solid #1b2742', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#0b1220', borderBottom: '1px solid #1b2742' }}>
              {['Usuario', 'Correo', 'Rol', 'Estado', '2FA', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 400 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #0f1a2e' }}>
                <td style={{ padding: '12px 16px', color: '#d8e0f0', fontWeight: 600 }}>
                  {u.name} {u.apellido}
                </td>
                <td style={{ padding: '12px 16px', color: '#8a9bc0', fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>
                  {u.email}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {u.rolNombre ? (
                    <span style={{ padding: '3px 10px', background: '#1b2742', color: '#d4a43a', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {u.rolNombre}
                    </span>
                  ) : (
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#2a3a5e' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 10px',
                    background: u.activo ? 'rgba(74,158,106,0.12)' : 'rgba(192,34,58,0.12)',
                    color: u.activo ? '#4a9e6a' : '#c0223a',
                    fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: u.twoFactorEnabled ? '#4a9e6a' : '#4a5878' }}>
                  {u.twoFactorEnabled ? '✓ ON' : '— OFF'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <Link
                    href={`/admin/usuarios/${u.id}`}
                    style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#d4a43a', letterSpacing: '0.14em', textDecoration: 'none', textTransform: 'uppercase' }}
                  >
                    Editar →
                  </Link>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '64px 0', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#2a3a5e', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
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
