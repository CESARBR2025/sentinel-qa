'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { crearReporte }   from './service'
import { revalidatePath } from 'next/cache'

export async function crearReporteCampoOficial(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const { reporteId, quiereDenuncia, calle, colonia, latitud, longitud, oficialId } =
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

  redirect('/oficial?exito=1')
}