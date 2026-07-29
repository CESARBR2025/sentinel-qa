import Link from 'next/link'
import { eventosPorModulo } from '@/lib/notificaciones/catalogo'
import { listarSuscripciones } from '@/lib/notificaciones/repository'
import { listarRolesActivos } from '@/lib/admin/repository'
import { guardarMatrizAction } from '@/lib/notificaciones/admin-actions'
import { cardStyle, btnPrimario, btnSecundario } from '../../admin-styles'

export default async function MatrizNotificacionesPage({ searchParams }: {
  searchParams: Promise<{ exito?: string }>
}) {
  const sp = await searchParams
  const [grupos, roles, suscripciones] = await Promise.all([
    Promise.resolve(eventosPorModulo()),
    listarRolesActivos(),
    listarSuscripciones(),
  ])

  // Sólo cuenta como override lo que ya está en BD. Si un evento no tiene
  // NINGUNA fila, mandan los rolesPorDefecto del catálogo: se reflejan aquí
  // marcados para que lo que se ve sea lo que realmente ocurre.
  const eventosConOverride = new Set(suscripciones.map(s => s.evento))
  const activos = new Set(suscripciones.filter(s => s.activo).map(s => `${s.evento}__${s.rolId}`))
  const idPorNombre = new Map(roles.map(r => [r.nombre, r.id]))

  const estaMarcado = (evento: string, rolId: number, rolesPorDefecto: string[]) => {
    if (eventosConOverride.has(evento)) return activos.has(`${evento}__${rolId}`)
    return rolesPorDefecto.some(n => idPorNombre.get(n) === rolId)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, textTransform: 'uppercase', margin: 0, letterSpacing: '0.04em' }}>
            Matriz <span style={{ color: '#1f355a' }}>Evento × Rol</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '6px 0 0 0' }}>
            Qué evento avisa a qué rol · {roles.length} roles activos
          </p>
        </div>
        <Link href="/admin/notificaciones" style={btnSecundario}>Volver a auditoría</Link>
      </div>

      {sp.exito && (
        <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(5,150,105,0.1)', border: '1px solid #059669', color: '#059669', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
          Matriz guardada.
        </div>
      )}

      <form action={guardarMatrizAction}>
        <input type="hidden" name="roles" value={roles.map(r => r.id).join(',')} />

        <div style={{ ...cardStyle, overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ ...encabezado, position: 'sticky', left: 0, background: '#f8fafc', minWidth: 260, textAlign: 'left' }}>
                  Evento
                </th>
                {roles.map(r => (
                  <th key={r.id} style={{ ...encabezado, minWidth: 44 }}>
                    {/* Vertical: con 30+ roles, en horizontal la tabla sería ilegible. */}
                    <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap' }}>
                      {r.nombre}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grupos.map(g => (
                <>
                  <tr key={`m-${g.modulo}`}>
                    <td colSpan={roles.length + 1} style={{
                      padding: '8px 16px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0',
                      fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.18em',
                      textTransform: 'uppercase', color: '#1f355a', fontWeight: 600,
                    }}>
                      {g.modulo}
                    </td>
                  </tr>
                  {g.eventos.map(({ clave, def }) => (
                    <tr key={clave} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{
                        padding: '10px 16px', position: 'sticky', left: 0, background: '#fff',
                        fontFamily: 'Inter,sans-serif', fontSize: 12.5, color: '#334155',
                        borderRight: '1px solid #e2e8f0',
                      }}>
                        {def.label}
                      </td>
                      {roles.map(r => (
                        <td key={r.id} style={{ textAlign: 'center', padding: '10px 4px' }}>
                          <input
                            type="checkbox"
                            name={`sub__${clave}__${r.id}`}
                            defaultChecked={estaMarcado(clave, r.id, def.rolesPorDefecto)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 20 }}>
          <button type="submit" style={btnPrimario}>Guardar matriz</button>
        </div>
      </form>
    </>
  )
}

const encabezado: React.CSSProperties = {
  padding: '10px 6px', fontFamily: 'JetBrains Mono,monospace', fontSize: 9,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b',
  borderBottom: '1px solid #e2e8f0', verticalAlign: 'bottom', height: 130,
}
