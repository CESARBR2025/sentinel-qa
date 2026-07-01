'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verificarRolLiberaciones, listarLiberaciones } from './service'
import { obtenerDetalleInfraccionVia } from '@/lib/shared/infracciones'
import type { UserInfo, LiberacionesResponse, ViaInfraccionDetalle } from './types'

export async function obtenerDashboardLiberaciones(): Promise<UserInfo> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolLiberaciones(session.user.id)
  if (!esValido) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return {
    name: user.name,
    apellido: user.apellido,
    email: user.email,
  }
}

export async function obtenerLiberaciones(): Promise<LiberacionesResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolLiberaciones(session.user.id)
  if (!esValido) redirect('/dashboard')

  const data = await listarLiberaciones()
  return { data, total: data.length }
}

export async function obtenerDetalleInfraccionLiberaciones(
  id: string,
): Promise<{ data: ViaInfraccionDetalle | null; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { data: null, error: "Sesión no válida" };

    const esValido = await verificarRolLiberaciones(session.user.id);
    if (!esValido) return { data: null, error: "Acceso no autorizado" };

    const data = await obtenerDetalleInfraccionVia(id);
    if (!data) return { data: null, error: "No se encontró la infracción" };

    return { data };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Error inesperado al obtener detalle de infracción";
    console.error("[obtenerDetalleInfraccionLiberaciones]", msg);
    return { data: null, error: msg };
  }
}
