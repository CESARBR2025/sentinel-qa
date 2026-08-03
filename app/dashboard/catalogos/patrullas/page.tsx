import { listarPatrullas } from '@/lib/catalogos/repository'
import { ToastAuto } from '@/components/ui/ToastAuto'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import PatrullasTablaConFiltros from '@/components/catalogos/PatrullasTablaConFiltros'

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

      <PageHeader
        title="Parque"
        accent="Vehicular"
        accentColor="#c0223a"
        subtitle={`${patrullas.length} vehículo${patrullas.length !== 1 ? 's' : ''} en catálogo`}
        actions={<>
          <PageHeaderLink href="/dashboard/catalogos" variant="secondary">← Catálogos</PageHeaderLink>
          <PageHeaderLink href="/dashboard/catalogos/patrullas/nuevo">+ Nueva Patrulla</PageHeaderLink>
        </>}
      />

      <PatrullasTablaConFiltros patrullas={patrullas} />
    </div>
  )
}
