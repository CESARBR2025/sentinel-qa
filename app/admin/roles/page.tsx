import { db }    from '@/lib/db/index'
import { roles }  from '@/lib/db/schema'
import { asc }    from 'drizzle-orm'

export default async function RolesPage() {
  const lista = await db.select().from(roles).orderBy(asc(roles.id))

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#d8e0f0', margin: '0 0 4px' }}>
          Roles del <span style={{ color: '#d4a43a' }}>Sistema</span>
        </h2>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
          Catálogo de roles — solo lectura
        </p>
      </div>

      <div style={{ border: '1px solid #1b2742', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#0b1220', borderBottom: '1px solid #1b2742' }}>
              {['#', 'Rol', 'Descripción', 'Estado'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#4a5878', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 400 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #0f1a2e' }}>
                <td style={{ padding: '12px 16px', color: '#4a5878', fontFamily: 'JetBrains Mono,monospace', fontSize: 10 }}>{r.id}</td>
                <td style={{ padding: '12px 16px', color: '#d8e0f0', fontWeight: 600 }}>{r.nombre}</td>
                <td style={{ padding: '12px 16px', color: '#8a9bc0' }}>{r.descripcion ?? '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 10px',
                    background: r.activo ? 'rgba(74,158,106,0.12)' : 'rgba(192,34,58,0.12)',
                    color: r.activo ? '#4a9e6a' : '#c0223a',
                    fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.1em',
                  }}>
                    {r.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
