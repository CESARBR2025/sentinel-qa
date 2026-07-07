'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { crearReporte }   from './service'
import { revalidatePath } from 'next/cache'
import { actualizarPatrullaOficial } from './repository'

export async function crearReporteCampoOficial(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const { reporteId, quiereDenuncia, calle, colonia, latitud, longitud, oficialId, hayDetenidos } =
    await crearReporte(session.user.id, formData)

  revalidatePath('/oficial')

  if (quiereDenuncia) {
    const params = new URLSearchParams({
      reporteCampoId: reporteId,
      calle:    calle    ?? '',
      colonia:  colonia  ?? '',
      lat:      latitud  ?? '',
      lng:      longitud ?? '',
      oficialId: oficialId,
    })
    redirect(`/denuncia/nuevo?${params}`)
  }

  if (hayDetenidos) {
    redirect(`/oficial/reportes/${reporteId}/fotos`)
  }

  redirect('/oficial?exito=1')
}

export async function asignarPatrulla(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const patrullaId = formData.get('patrullaId') as string | null

  await actualizarPatrullaOficial(session.user.id, patrullaId || null)

  revalidatePath('/oficial/configuracion')
  revalidatePath('/oficial')
}
