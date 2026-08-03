import { ToastAuto } from '@/components/ui/ToastAuto'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import PatrullaForm from '@/components/catalogos/PatrullaForm'

export default async function CatalogosNuevaPatrullaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div>
      <ToastAuto show={error === 'serie_duplicada'} mensaje="El número de serie ya está en uso" tipo="error" />
      <ToastAuto show={error === 'serie_requerida'} mensaje="El número de serie (VIN) es obligatorio" tipo="error" />

      <PageHeader
        title="Nueva"
        accent="Patrulla"
        accentColor="#c0223a"
        actions={<PageHeaderLink href="/dashboard/catalogos/patrullas" variant="secondary">← Volver</PageHeaderLink>}
      />

      <PatrullaForm />
    </div>
  )
}
