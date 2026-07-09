import { listarRoles } from '@/lib/admin/repository'
import { ShieldPlus } from 'lucide-react'
import Link from 'next/link'
import { btnPrimario, cardStyle } from '../admin-styles'

export default async function RolesPage() {
  const lista = await listarRoles()

  return (
    <div>
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 4px' }}>
            Roles del <span style={{ color: '#2563eb' }}>Sistema</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            <span style={{ color: '#2563eb' }}>›</span> {lista.length} configuraciones de acceso detectadas
          </p>
        </div>

        <Link
          href="/admin/roles/agregar"
          style={{ display: 'flex', alignItems: 'center', gap: 10, ...btnPrimario, textDecoration: 'none' }}
        >
          <ShieldPlus size={16} strokeWidth={2.5} />
          <span>Registrar Nuevo Rol</span>
        </Link>
      </div>

      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['#', 'Rol', 'Descripción', 'Estado', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 400 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lista.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'JetBrains Mono,monospace', fontSize: 10 }}>{r.id}</td>
                <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 600 }}>{r.nombre}</td>
                <td style={{ padding: '12px 16px', color: '#64748b' }}>{r.descripcion ?? '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 10px',
                    background: r.activo ? 'rgba(5,150,105,0.1)' : 'rgba(220,38,38,0.1)',
                    color: r.activo ? '#059669' : '#dc2626',
                    fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.1em',
                  }}>
                    {r.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {r.nombre === 'Monitorista' && (
                    <Link
                      href={`/admin/roles/${r.id}/plantilla-permisos`}
                      style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#2563eb', letterSpacing: '0.14em', textDecoration: 'none', textTransform: 'uppercase' }}
                    >
                      Plantilla →
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
