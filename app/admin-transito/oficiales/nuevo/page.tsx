import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarPatrullasParaAsignacion } from '@/lib/flota/service'
import { listarDepartamentosActivos } from '@/lib/admin-transito/repository'
import { ToastAuto } from '@/components/ui/ToastAuto'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import NuevoOficialForm from '@/components/admin-transito/NuevoOficialForm'

export default async function NuevoOficialPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; exito?: string }>
}) {
  const { error, exito } = await searchParams

  const session = await auth.api.getSession({ headers: await headers() })
  const user = session!.user as { name: string; apellido?: string; email: string }

  const deptos = await listarDepartamentosActivos()

  const patrullas = await listarPatrullasParaAsignacion()

  return (
    <>
      <DashboardHeader user={user} variant="apple" roleLabel="Admin Tránsito" backHref="/admin-transito/oficiales" backLabel="Oficiales" />
      <main className="pad-pagina" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ToastAuto show={exito === 'creado'} mensaje="Oficial creado correctamente" />
      <ToastAuto show={error === 'email_en_uso'} mensaje="El correo electrónico ya está registrado" tipo="error" />
      <ToastAuto show={error === 'nombre_requerido'} mensaje="El nombre es obligatorio" tipo="error" />

      <PageHeader
        title="Nuevo"
        accent="Oficial"
      />

      <NuevoOficialForm deptos={deptos} patrullas={patrullas} />
      </main>
    </>
  )
}
