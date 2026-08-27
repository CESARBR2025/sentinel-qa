'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { query } from '@/lib/db'
import { getUserWithRole } from '@/lib/auth/helpers'
import {
  obtenerRolOficialCampo, actualizarUserInfo, actualizarOficialRecord, eliminarSesion,
} from '@/lib/admin-transito/repository'
import {
  obtenerPatrullaPorId, crearPatrulla, actualizarPatrulla, eliminarPatrulla, contarOficialesPorPatrulla,
} from './repository'

const BASE_OFICIALES = '/dashboard/catalogos/oficiales'
const BASE_PATRULLAS = '/dashboard/catalogos/patrullas'

async function requireEsAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const u = await getUserWithRole(session.user.id)
  if (!u?.esAdmin) redirect('/dashboard')
  return session
}

// Normaliza a MAYÚSCULAS los campos alfanuméricos (evita discrepancias entre
// mayúsculas/minúsculas en nóminas, empleados y teléfonos).
function strUpper(valor: string | null): string | null {
  if (!valor) return null
  return valor.trim().toUpperCase()
}

// ─── Oficiales ─────────────────────────────────────────────────

export async function crearOficial(formData: FormData) {
  await requireEsAdmin()

  const userId = formData.get('userId') as string | null
  const noNomina = strUpper((formData.get('noNomina') as string) ?? '')
  const numeroEmpleado = strUpper((formData.get('numeroEmpleado') as string) ?? '')
  const telefono = strUpper((formData.get('telefono') as string) ?? '')
  const departamentoId = (formData.get('departamentoId') as string) || null
  const patrullaId = (formData.get('patrullaId') as string) || null
  const sectorIdRaw = formData.get('sectorId') as string | null
  const sectorId = sectorIdRaw && sectorIdRaw !== '' ? Number(sectorIdRaw) : null
  const rolOficial = await obtenerRolOficialCampo()

  if (userId) {
    await query(`UPDATE users SET rol_id = $1 WHERE id = $2`, [rolOficial, userId])
    const existing = await query<{ id: string }>(`SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1`, [userId])
    if (existing.rows.length) {
      await query(
        `UPDATE ofi_oficiales SET no_nomina=$1, numero_empleado=$2, telefono=$3, departamento_id=$4, patrulla_id=$5, sector_id=$6, ofi_estatus='activo', updated_at=NOW() WHERE user_id=$7`,
        [noNomina, numeroEmpleado, telefono, departamentoId, patrullaId, sectorId, userId],
      )
    } else {
      await query(
        `INSERT INTO ofi_oficiales (user_id, no_nomina, numero_empleado, telefono, departamento_id, patrulla_id, sector_id, ofi_estatus) VALUES ($1,$2,$3,$4,$5,$6,$7,'activo')`,
        [userId, noNomina, numeroEmpleado, telefono, departamentoId, patrullaId, sectorId],
      )
    }
    revalidatePath(BASE_OFICIALES)
    redirect(`${BASE_OFICIALES}?exito=reincorporado`)
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const userName = ((formData.get('userName') as string) ?? '').toUpperCase()
  const userApellido = ((formData.get('userApellido') as string) ?? '').toUpperCase()

  if (!userName) redirect(`${BASE_OFICIALES}/nuevo?error=nombre_requerido`)

  try {
    const result = await auth.api.signUpEmail({ body: { email, password, name: userName, apellido: userApellido } })
    if (!result?.user?.id) throw new Error('Error al crear usuario')
    await query(`UPDATE users SET rol_id = $1 WHERE id = $2`, [rolOficial, result.user.id])
    await query(
      `INSERT INTO ofi_oficiales (user_id, no_nomina, numero_empleado, telefono, departamento_id, patrulla_id, sector_id, ofi_estatus) VALUES ($1,$2,$3,$4,$5,$6,$7,'activo')`,
      [result.user.id, noNomina, numeroEmpleado, telefono, departamentoId, patrullaId, sectorId],
    )
    if (result?.token) await eliminarSesion(result.token)
  } catch (e) {
    if (e && typeof e === 'object' && 'digest' in e) throw e
    redirect(`${BASE_OFICIALES}/nuevo?error=email_en_uso`)
  }

  revalidatePath(BASE_OFICIALES)
  redirect(`${BASE_OFICIALES}?exito=creado`)
}

export async function actualizarOficial(formData: FormData) {
  await requireEsAdmin()

  const id = formData.get('id') as string
  const userId = formData.get('userId') as string | null
  const userName = ((formData.get('userName') as string) ?? '').toUpperCase() || null
  const userApellido = ((formData.get('userApellido') as string) ?? '').toUpperCase() || null
  const userEmail = (formData.get('userEmail') as string) || null
  const noNomina = strUpper((formData.get('noNomina') as string) ?? '')
  const numeroEmpleado = strUpper((formData.get('numeroEmpleado') as string) ?? '')
  const telefono = strUpper((formData.get('telefono') as string) ?? '')
  const departamentoId = (formData.get('departamentoId') as string) || null
  const patrullaId = (formData.get('patrullaId') as string) || null
  const sectorIdRaw = formData.get('sectorId') as string | null
  const sectorId = sectorIdRaw && sectorIdRaw !== '' ? Number(sectorIdRaw) : null

  if (!id) redirect(`${BASE_OFICIALES}?error=datos_invalidos`)

  if (userId) await actualizarUserInfo(userId, { userName, userApellido, userEmail })
  await actualizarOficialRecord(id, { noNomina, numeroEmpleado, telefono, departamentoId, patrullaId, sectorId })

  revalidatePath(BASE_OFICIALES)
  redirect(`${BASE_OFICIALES}?exito=actualizado`)
}

export async function destituirOficial(formData: FormData) {
  await requireEsAdmin()

  const oficialId = formData.get('oficialId') as string
  const userId = formData.get('userId') as string

  if (!oficialId || !userId) redirect(`${BASE_OFICIALES}?error=datos_invalidos`)

  await query(`UPDATE ofi_oficiales SET ofi_estatus='destituido', updated_at=NOW() WHERE id=$1`, [oficialId])
  await query(`UPDATE users SET rol_id = 39 WHERE id = $1`, [userId])

  revalidatePath(BASE_OFICIALES)
  redirect(`${BASE_OFICIALES}?exito=destituido`)
}

export async function reactivarOficial(formData: FormData) {
  await requireEsAdmin()

  const oficialId = formData.get('oficialId') as string
  const userId = formData.get('userId') as string
  const noNomina = strUpper((formData.get('noNomina') as string) ?? '')
  const telefono = strUpper((formData.get('telefono') as string) ?? '')
  const departamentoId = (formData.get('departamentoId') as string) || null
  const patrullaId = (formData.get('patrullaId') as string) || null
  const sectorIdRaw = formData.get('sectorId') as string | null
  const sectorId = sectorIdRaw && sectorIdRaw !== '' ? Number(sectorIdRaw) : null

  if (!oficialId || !userId) redirect(`${BASE_OFICIALES}?error=datos_invalidos`)

  const rolOficial = await obtenerRolOficialCampo()

  await query(
    `UPDATE ofi_oficiales SET no_nomina=$1, telefono=$2, departamento_id=$3, patrulla_id=$4, sector_id=$5, ofi_estatus='activo', updated_at=NOW() WHERE id=$6`,
    [noNomina, telefono, departamentoId, patrullaId, sectorId, oficialId],
  )
  await query(`UPDATE users SET rol_id = $1 WHERE id = $2`, [rolOficial, userId])

  revalidatePath(BASE_OFICIALES)
  redirect(`${BASE_OFICIALES}?exito=reactivado`)
}

export async function buscarUsuariosReincorporar(queryStr: string) {
  await requireEsAdmin()
  if (!queryStr || queryStr.length < 2) return []

  const like = `%${queryStr}%`
  const result = await query<{ id: string; name: string; apellido: string; email: string }>(
    `SELECT id, name, apellido, email
     FROM users
     WHERE rol_id = 39
       AND (name ILIKE $1 OR apellido ILIKE $1 OR email ILIKE $1)
     ORDER BY name ASC
     LIMIT 10`,
    [like],
  )
  return result.rows.map((r) => ({ id: r.id, name: r.name, apellido: r.apellido, email: r.email }))
}

// ─── Patrullas ────────────────────────────────────────────────

function datosPatrulla(formData: FormData) {
  return {
    placa: (formData.get('placa') as string)?.trim() || null,
    numSerie: ((formData.get('numSerie') as string) ?? '').trim(),
    departamento: (formData.get('departamento') as string)?.trim() || null,
    caracteristicas: (formData.get('caracteristicas') as string)?.trim() || null,
    marca: (formData.get('marca') as string)?.trim() || null,
    modelo: (formData.get('modelo') as string)?.trim() || null,
    gps: (formData.get('gps') as string)?.trim() || null,
    radio: (formData.get('radio') as string)?.trim() || null,
    camaras: (formData.get('camaras') as string)?.trim() || null,
  }
}

export async function crearPatrullaAction(formData: FormData) {
  await requireEsAdmin()

  const data = datosPatrulla(formData)
  if (!data.numSerie) redirect(`${BASE_PATRULLAS}/nuevo?error=serie_requerida`)

  const existe = await query<{ id: string }>(`SELECT id FROM via.v2_patrullas WHERE num_serie = $1 LIMIT 1`, [data.numSerie])
  if (existe.rows.length) redirect(`${BASE_PATRULLAS}/nuevo?error=serie_duplicada`)

  await crearPatrulla(data)

  revalidatePath(BASE_PATRULLAS)
  redirect(`${BASE_PATRULLAS}?exito=creada`)
}

export async function actualizarPatrullaAction(formData: FormData) {
  await requireEsAdmin()

  const id = formData.get('id') as string
  if (!id) redirect(`${BASE_PATRULLAS}?error=datos_invalidos`)

  const data = datosPatrulla(formData)
  if (!data.numSerie) redirect(`${BASE_PATRULLAS}/${id}?error=serie_requerida`)

  const actual = await obtenerPatrullaPorId(id)
  if (!actual) redirect(`${BASE_PATRULLAS}?error=no_encontrada`)

  if (actual.numSerie !== data.numSerie) {
    const duplicado = await query<{ id: string }>(`SELECT id FROM via.v2_patrullas WHERE num_serie = $1 AND id != $2 LIMIT 1`, [data.numSerie, id])
    if (duplicado.rows.length) redirect(`${BASE_PATRULLAS}/${id}?error=serie_duplicada`)
  }

  await actualizarPatrulla(id, data)

  revalidatePath(BASE_PATRULLAS)
  redirect(`${BASE_PATRULLAS}?exito=actualizada`)
}

export async function eliminarPatrullaAction(formData: FormData) {
  await requireEsAdmin()

  const id = formData.get('id') as string
  if (!id) redirect(`${BASE_PATRULLAS}?error=datos_invalidos`)

  const oficiales = await contarOficialesPorPatrulla(id)
  if (oficiales > 0) redirect(`${BASE_PATRULLAS}?error=con_oficiales`)

  await eliminarPatrulla(id)

  revalidatePath(BASE_PATRULLAS)
  redirect(`${BASE_PATRULLAS}?exito=eliminada`)
}
