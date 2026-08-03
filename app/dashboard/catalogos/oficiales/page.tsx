import Link from 'next/link'
import { listarPatrullasParaAsignacion } from '@/lib/flota/service'
import { listarDepartamentosActivos, listarOficiales } from '@/lib/admin-transito/repository'
import { ToastAuto } from '@/components/ui/ToastAuto'
import OficialesTablaConFiltros from '@/components/catalogos/OficialesTablaConFiltros'

export default async function CatalogosOficialesPage({
  searchParams,
}: {
  searchParams: Promise<{ exito?: string; error?: string }>
}) {
  const { exito, error } = await searchParams
  const oficiales = await listarOficiales()
  const deptos = await listarDepartamentosActivos()
  const patrullas = await listarPatrullasParaAsignacion()

  return (
    <div>
      <ToastAuto show={exito === 'creado'} mensaje="Oficial creado correctamente" />
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
            <span style={{ color: '#1f355a' }}>Oficiales</span>
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
            href="/dashboard/catalogos/oficiales/nuevo"
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

      <OficialesTablaConFiltros oficiales={oficiales} deptos={deptos} patrullas={patrullas} />
    </div>
  )
}
