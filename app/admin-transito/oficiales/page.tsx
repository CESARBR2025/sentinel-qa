import Link from 'next/link'
import { FlotaService } from '@/lib/flota/service'
import { listarDepartamentosActivos } from '@/lib/admin-transito/repository'
import { obtenerOficialesLista } from '@/lib/admin-transito/actions'
import { ToastAuto } from '@/components/ui/ToastAuto'
import OficialesTable from '@/components/admin-transito/OficialesTable'

export default async function OficialesPage({
  searchParams,
}: {
  searchParams: Promise<{ exito?: string; error?: string }>
}) {
  const { exito, error } = await searchParams
  const oficiales = await obtenerOficialesLista()

  const deptos = await listarDepartamentosActivos()

  const patrullas = await FlotaService.listarPatrullasParaAsignacion()

  return (
    <div>
      <ToastAuto show={exito === 'destituido'} mensaje="Oficial destituido correctamente" />
      <ToastAuto show={exito === 'reactivado'} mensaje="Oficial reactivado correctamente" />
      <ToastAuto show={exito === 'reincorporado'} mensaje="Oficial reincorporado correctamente" />
      <ToastAuto show={exito === 'actualizado'} mensaje="Oficial actualizado correctamente" />
      <ToastAuto show={error === 'datos_invalidos'} mensaje="Error: datos inválidos para la operación" tipo="error" />
      <ToastAuto show={error === 'no_encontrado'} mensaje="Oficial no encontrado" tipo="error" />

      <div
        style={{
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'Barlow Condensed,sans-serif',
              fontWeight: 800,
              fontSize: 32,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#0f172a',
              margin: '0 0 4px',
            }}
          >
            Gestión de{' '}
            <span style={{ color: '#2563eb' }}>Oficiales</span>
          </h2>
          <p
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              color: '#64748b',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {oficiales.length} oficial{oficiales.length !== 1 ? 'es' : ''} registrado{oficiales.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href="/admin-transito"
            style={{
              padding: '10px 20px',
              background: '#f1f5f9',
              color: '#475569',
              fontFamily: 'Barlow Condensed,sans-serif',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            ← Panel
          </Link>
          <Link
            href="/admin-transito/oficiales/nuevo"
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
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            + Registrar Oficial
          </Link>
        </div>
      </div>

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
