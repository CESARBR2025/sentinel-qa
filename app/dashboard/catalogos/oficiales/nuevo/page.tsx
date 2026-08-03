import { listarPatrullasParaAsignacion } from '@/lib/flota/service'
import { listarDepartamentosActivos } from '@/lib/admin-transito/repository'
import { ToastAuto } from '@/components/ui/ToastAuto'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import NuevoOficialForm from '@/components/catalogos/NuevoOficialForm'

export default async function CatalogosNuevoOficialPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; exito?: string }>
}) {
  const { error, exito } = await searchParams

  const deptos = await listarDepartamentosActivos()
  const patrullas = await listarPatrullasParaAsignacion()

  return (
    <div>
      <ToastAuto show={exito === 'creado'} mensaje="Oficial creado correctamente" />
      <ToastAuto show={error === 'email_en_uso'} mensaje="El correo electrónico ya está registrado" tipo="error" />
      <ToastAuto show={error === 'nombre_requerido'} mensaje="El nombre es obligatorio" tipo="error" />

      <PageHeader
        title="Nuevo"
        accent="Oficial"
        actions={<PageHeaderLink href="/dashboard/catalogos/oficiales" variant="secondary">← Volver</PageHeaderLink>}
      />

      <NuevoOficialForm deptos={deptos} patrullas={patrullas} />
    </div>
  )
}
