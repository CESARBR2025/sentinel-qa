import { listarPatrullasParaAsignacion } from '@/lib/flota/service'
import { listarDepartamentosActivos, listarOficiales } from '@/lib/admin-transito/repository'
import { ToastAuto } from '@/components/ui/ToastAuto'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
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

      <PageHeader
        title="Gestión de"
        accent="Oficiales"
        subtitle={`${oficiales.length} oficial${oficiales.length !== 1 ? 'es' : ''} registrado${oficiales.length !== 1 ? 's' : ''}`}
        actions={<>
          <PageHeaderLink href="/dashboard/catalogos" variant="secondary">← Catálogos</PageHeaderLink>
          <PageHeaderLink href="/dashboard/catalogos/oficiales/nuevo">+ Registrar Oficial</PageHeaderLink>
        </>}
      />

      <OficialesTablaConFiltros oficiales={oficiales} deptos={deptos} patrullas={patrullas} />
    </div>
  )
}
