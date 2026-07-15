'use server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { upsertFge, upsertFgr, upsertMasc, upsertVictimas, upsertObservaciones } from './repository'

function num(fd: FormData, k: string) { return Number(fd.get(k) ?? 0) }
function str(fd: FormData, k: string) { return String(fd.get(k) ?? '') }

export async function guardarDatosCoordinacion(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const fecha   = str(formData, 'fecha')
  const userId  = session.user.id

  await Promise.all([
    upsertFge(fecha, userId, {
      carpetas:     num(formData, 'fge_carpetas'),
      cateos:       num(formData, 'fge_cateos'),
      vehiculos:    num(formData, 'fge_vehiculos'),
      domicilios:   num(formData, 'fge_domicilios'),
      personas:     num(formData, 'fge_personas'),
      aprehensiones: num(formData, 'fge_aprehensiones'),
      audiencias:   num(formData, 'fge_audiencias'),
      abreviados:   num(formData, 'fge_abreviados'),
      intermedias:  num(formData, 'fge_intermedias'),
    }),
    upsertFgr(fecha, userId, {
      carpetas:     num(formData, 'fgr_carpetas'),
      cateos:       num(formData, 'fgr_cateos'),
      vehiculos:    num(formData, 'fgr_vehiculos'),
      domicilios:   num(formData, 'fgr_domicilios'),
      personas:     num(formData, 'fgr_personas'),
      aprehensiones: num(formData, 'fgr_aprehensiones'),
      audiencias:   num(formData, 'fgr_audiencias'),
      abreviados:   num(formData, 'fgr_abreviados'),
      intermedias:  num(formData, 'fgr_intermedias'),
    }),
    upsertMasc(fecha, userId, {
      asuntos:  num(formData, 'masc_asuntos'),
      acuerdos: num(formData, 'masc_acuerdos'),
      monto:    num(formData, 'masc_monto'),
    }),
    upsertVictimas(fecha, userId, {
      atenciones:   num(formData, 'vic_atenciones'),
      medicas:      num(formData, 'vic_medicas'),
      psicologicas: num(formData, 'vic_psicologicas'),
      juridicas:    num(formData, 'vic_juridicas'),
    }),
    upsertObservaciones(fecha, userId, str(formData, 'observaciones')),
  ])

  redirect(`/nCoordinacion?fecha=${fecha}&guardado=1`)
}