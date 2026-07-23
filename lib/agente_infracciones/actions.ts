'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verificarRolInfracciones, listarLiberaciones, procesarCapturaInfractor, procesarLiberarGarantia, buscarFolioGlobal } from './service'
import { obtenerDetalleInfraccionVia } from '@/lib/shared/infracciones'
import type { UserInfo, LiberacionesResponse, ViaInfraccionDetalle, CapturaInfractorInput, CapturaInfractorResult } from './types'

export async function obtenerDashboardInfracciones(): Promise<UserInfo> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolInfracciones(session.user.id)
  if (!esValido) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return {
    name: user.name,
    apellido: user.apellido,
    email: user.email,
  }
}

export async function obtenerInfracciones(): Promise<LiberacionesResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolInfracciones(session.user.id)
  if (!esValido) redirect('/dashboard')

  const data = await listarLiberaciones()
  return { data, total: data.length }
}

export async function obtenerDetalleInfraccionInfracciones(
  id: string,
): Promise<{ data: ViaInfraccionDetalle | null; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { data: null, error: "Sesión no válida" };

    const esValido = await verificarRolInfracciones(session.user.id);
    if (!esValido) return { data: null, error: "Acceso no autorizado" };

    const data = await obtenerDetalleInfraccionVia(id);
    if (!data) return { data: null, error: "No se encontró la infracción" };

    return { data };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Error inesperado al obtener detalle de infracción";
    console.error("[obtenerDetalleInfraccionInfracciones]", msg);
    return { data: null, error: msg };
  }
}

export async function capturarInfractorInfraccionesAction(
  input: CapturaInfractorInput,
): Promise<CapturaInfractorResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }

    const esValido = await verificarRolInfracciones(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    return await procesarCapturaInfractor(input)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al capturar datos del infractor'
    console.error('[capturarInfractorInfraccionesAction]', msg)
    return { success: false, error: msg }
  }
}

export async function buscarInfraccionPorFolioAction(
  folio: string,
): Promise<{ success: boolean; id?: string; folio?: string; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }

    const esValido = await verificarRolInfracciones(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    if (!folio.trim()) return { success: false, error: 'Ingresa un folio' }

    const encontrada = await buscarFolioGlobal(folio)
    if (!encontrada) return { success: false, error: `No se encontró ninguna infracción con el folio "${folio.trim()}"` }

    return { success: true, id: encontrada.id, folio: encontrada.folio }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al buscar el folio'
    console.error('[buscarInfraccionPorFolioAction]', msg)
    return { success: false, error: msg }
  }
}

export async function liberarGarantiaInfraccionesAction(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }

    const esValido = await verificarRolInfracciones(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    return await procesarLiberarGarantia(id)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al liberar garantía'
    console.error('[liberarGarantiaInfraccionesAction]', msg)
    return { success: false, error: msg }
  }
}
