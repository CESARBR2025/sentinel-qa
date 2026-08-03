import Link from 'next/link'
import { listarPatrullas } from '@/lib/catalogos/repository'
import { ToastAuto } from '@/components/ui/ToastAuto'
import PatrullasTable from '@/components/catalogos/PatrullasTable'
import { ImportarParqueButton } from '@/components/catalogos/ImportarParqueButton'

export default async function CatalogosPatrullasPage({
  searchParams,
}: {
  searchParams: Promise<{ exito?: string; error?: string }>
}) {
  const { exito, error } = await searchParams
  const patrullas = await listarPatrullas()

  return (
    <div>
      <ToastAuto show={exito === 'creada'} mensaje="Patrulla creada correctamente" />
      <ToastAuto show={exito === 'actualizada'} mensaje="Patrulla actualizada correctamente" />
      <ToastAuto show={exito === 'eliminada'} mensaje="Patrulla eliminada correctamente" />
      <ToastAuto show={error === 'con_oficiales'} mensaje="No se puede eliminar: la patrulla tiene oficiales asignados" tipo="error" />
      <ToastAuto show={error === 'no_encontrada'} mensaje="Patrulla no encontrada" tipo="error" />
      <ToastAuto show={error === 'serie_duplicada'} mensaje="El número de serie ya está en uso" tipo="error" />
      <ToastAuto show={error === 'serie_requerida'} mensaje="El número de serie (VIN) es obligatorio" tipo="error" />

      <div
        style={{
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
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
            Parque{' '}
            <span style={{ color: '#c0223a' }}>Vehicular</span>
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
            {patrullas.length} vehículo{patrullas.length !== 1 ? 's' : ''} en catálogo
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <ImportarParqueButton />
          <Link
            href="/dashboard/catalogos"
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
            ← Catálogos
          </Link>
          <Link
            href="/dashboard/catalogos/patrullas/nuevo"
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
            + Nueva Patrulla
          </Link>
        </div>
      </div>

      <div style={{ border: '1px solid #e2e8f0', background: '#ffffff', overflow: 'auto', borderRadius: 2 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif', fontSize: 13, minWidth: 1080 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['Placa', 'Serie', 'Departamento', 'Características', 'Marca', 'Modelo', 'GPS', 'Radio', 'Cámaras', 'Estatus', ''].map((h) => (
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
            <PatrullasTable patrullas={patrullas} />
          </tbody>
        </table>
      </div>
    </div>
  )
}
