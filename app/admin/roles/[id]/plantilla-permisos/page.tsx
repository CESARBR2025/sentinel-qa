import { obtenerRol } from '@/lib/admin/repository'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { obtenerPlantillaRol, guardarPlantillaSeccionesAction } from '@/lib/permisos/core'
import { MODULOS_POR_ROL } from '@/lib/permisos/registro'
import { btnPrimario as BTN, cardStyle } from '../../../admin-styles'
import { ToastAuto } from '@/components/ui/ToastAuto'

export default async function PlantillaPermisosRolPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ exito?: string }>
}) {
  const { id } = await params
  const { exito } = await searchParams
  const rolId = Number(id)

  const rol = await obtenerRol(rolId)
  if (!rol) notFound()

  const modulo = MODULOS_POR_ROL[rol.nombre]
  const plantilla = modulo ? await obtenerPlantillaRol(rolId, modulo.secciones) : null

  return (
    <div style={{ maxWidth: 600 }}>
      <ToastAuto show={exito === '1'} mensaje="Plantilla guardada exitosamente" />
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 32, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', margin: '0 0 4px' }}>
            Plantilla de <span style={{ color: '#1f355a' }}>{rol.nombre}</span>
          </h2>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            Se aplica automáticamente al asignar este rol a un usuario
          </p>
        </div>
        <Link href="/admin/roles" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>
          ← Volver
        </Link>
      </div>

      {modulo && plantilla ? (
        <form action={guardarPlantillaSeccionesAction}>
          <input type="hidden" name="rolId" value={rolId} />
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
                  const p = plantilla[seccion]
                  return (
                    <tr key={seccion} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 16px', color: '#0f172a' }}>{modulo.seccionLabels[seccion]}</td>
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
          <button type="submit" style={{ ...BTN, marginTop: 16 }}>Guardar plantilla</button>
        </form>
      ) : (
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#64748b' }}>
          Este rol no tiene un módulo de permisos finos configurado todavía.
        </p>
      )}
    </div>
  )
}
