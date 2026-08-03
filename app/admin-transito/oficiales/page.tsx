import { listarPatrullasParaAsignacion } from '@/lib/flota/service'
import { listarDepartamentosActivos } from '@/lib/admin-transito/repository'
import { obtenerOficialesLista } from '@/lib/admin-transito/actions'
import { ToastAuto } from '@/components/ui/ToastAuto'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import OficialesTable from '@/components/admin-transito/OficialesTable'

export default async function OficialesPage({
  searchParams,
}: {
  searchParams: Promise<{ exito?: string; error?: string }>
}) {
  const { exito, error } = await searchParams
  const oficiales = await obtenerOficialesLista()

  const deptos = await listarDepartamentosActivos()

  const patrullas = await listarPatrullasParaAsignacion()

  return (
    <div>
      <ToastAuto show={exito === 'destituido'} mensaje="Oficial destituido correctamente" />
      <ToastAuto show={exito === 'reactivado'} mensaje="Oficial reactivado correctamente" />
      <ToastAuto show={exito === 'reincorporado'} mensaje="Oficial reincorporado correctamente" />
      <ToastAuto show={exito === 'actualizado'} mensaje="Oficial actualizado correctamente" />
      <ToastAuto show={error === 'datos_invalidos'} mensaje="Error: datos inválidos para la operación" tipo="error" />
      <ToastAuto show={error === 'no_encontrado'} mensaje="Oficial no encontrado" tipo="error" />

      <PageHeader
        title="Gestión de"
        accent="Oficiales"
        subtitle={`${oficiales.length} oficial${oficiales.length !== 1 ? 'es' : ''} registrado${oficiales.length !== 1 ? 's' : ''}`}
        actions={<>
          <PageHeaderLink href="/admin-transito" variant="secondary">← Panel</PageHeaderLink>
          <PageHeaderLink href="/admin-transito/oficiales/nuevo">+ Registrar Oficial</PageHeaderLink>
        </>}
      />

      <div
        style={{
          border: '1px solid #e2e8f0',
          background: '#ffffff',
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'Inter,sans-serif',
            fontSize: 13,
          }}
        >
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Nombre', 'Nómina / Empleado', 'Departamento', 'Patrulla', 'Estatus', ''].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontFamily: 'JetBrains Mono,monospace',
                    fontSize: 9,
                    color: '#64748b',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <OficialesTable oficiales={oficiales} deptos={deptos} patrullas={patrullas} />
          </tbody>
        </table>
      </div>
    </div>
  )
}
