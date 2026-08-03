import { redirect } from 'next/navigation'
import { obtenerPatrullaPorId } from '@/lib/catalogos/repository'
import { ToastAuto } from '@/components/ui/ToastAuto'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import PatrullaForm from '@/components/catalogos/PatrullaForm'

export default async function CatalogosEditarPatrullaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const { error } = await searchParams

  const patrulla = await obtenerPatrullaPorId(id)
  if (!patrulla) redirect('/dashboard/catalogos/patrullas?error=no_encontrada')

  return (
    <div>
      <ToastAuto show={error === 'serie_duplicada'} mensaje="El número de serie ya está en uso" tipo="error" />
      <ToastAuto show={error === 'serie_requerida'} mensaje="El número de serie (VIN) es obligatorio" tipo="error" />

      <PageHeader
        title="Editar"
        accent="Patrulla"
        accentColor="#c0223a"
        actions={<PageHeaderLink href="/dashboard/catalogos/patrullas" variant="secondary">← Volver</PageHeaderLink>}
      />

      <PatrullaForm patrulla={patrulla} />
    </div>
  )
}
