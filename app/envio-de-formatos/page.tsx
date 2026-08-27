import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { tienePermiso } from '@/lib/reportes/permisos'
import HubFormatos from '@/components/envio-formatos/HubFormatos'

export default async function EnvioDeFormatosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const [tieneFormatoN, tieneNovedades] = await Promise.all([
    tienePermiso(session.user.id, 'formato_n_coordinacion', 'ver'),
    tienePermiso(session.user.id, 'parte_novedades_c4', 'ver'),
  ])

  // Si el usuario solo tiene permiso de uno, se redirige directo a ese —
  // preserva el comportamiento actual para quien solo usa Formato N.
  if (tieneFormatoN && !tieneNovedades) redirect('/envio-de-formatos/consolidar')
  if (tieneNovedades && !tieneFormatoN) redirect('/envio-de-formatos/novedades')
  if (!tieneFormatoN && !tieneNovedades) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }
  return <HubFormatos user={user} />
}
