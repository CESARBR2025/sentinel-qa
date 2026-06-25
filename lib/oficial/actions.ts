'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { crearReporte } from './service'
import { revalidatePath } from 'next/cache'

export async function crearReporteCampoOficial(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  await crearReporte(session.user.id, formData)

  revalidatePath('/oficial')
  redirect('/oficial?exito=1')
}
