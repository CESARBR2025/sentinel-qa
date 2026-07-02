"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  verificarRolJuzgado,
  listarSolicitudesRecepcionadas,
  listarSolicitudesEnRevision,
  listarSolicitudesConMonitorista,
  listarSolicitudesCompletadas,
  tomarCaso,
  pedirEvidencias,
  cerrarCaso,
  obtenerDatosAsegurado,
  guardarDetallesAsegurado,
  obtenerLiberacionesJuzgado,
  iniciarProcesoJuzgadoSvc,
  finalizarProcesoJuzgadoSvc,
} from "./service";
import { obtenerDetalleInfraccionVia } from "@/lib/shared/infracciones";
import type {
  UserInfo,
  SolicitudEvidencia,
  DetalleAsegurado,
  DatosAseguradoInput,
  LiberacionRow,
  ViaInfraccionDetalle,
} from "./types";

export async function obtenerDashboardJuzgado(): Promise<UserInfo> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const esValido = await verificarRolJuzgado(session.user.id);
  if (!esValido) redirect("/dashboard");

  const user = session.user as {
    name: string;
    apellido?: string;
    email: string;
  };

  return {
    name: user.name,
    apellido: user.apellido,
    email: user.email,
  };
}

export interface SolicitudesData {
  recepcionadas: SolicitudEvidencia[];
  enRevision: SolicitudEvidencia[];
  conMonitorista: SolicitudEvidencia[];
  completadas: SolicitudEvidencia[];
}

export async function obtenerSolicitudes(): Promise<SolicitudesData> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const esValido = await verificarRolJuzgado(session.user.id);
  if (!esValido) redirect("/dashboard");

  const [recepcionadas, enRevision, conMonitorista, completadas] =
    await Promise.all([
      listarSolicitudesRecepcionadas(),
      listarSolicitudesEnRevision(),
      listarSolicitudesConMonitorista(),
      listarSolicitudesCompletadas(),
    ]);

  return { recepcionadas, enRevision, conMonitorista, completadas };
}

export async function accionTomarCaso(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Sesión no válida" };

    const esValido = await verificarRolJuzgado(session.user.id);
    if (!esValido) return { success: false, error: "Acceso no autorizado" };

    const id = formData.get("id");
    if (typeof id !== "string" || !id.trim())
      return { success: false, error: "ID de solicitud inválido" };

    await tomarCaso(id);

    revalidatePath("/agente_juzgado/solicitudes");
    return { success: true };
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Error inesperado al tomar el caso";
    console.error("[accionTomarCaso]", msg);
    return { success: false, error: msg };
  }
}

export async function accionPedirEvidencias(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Sesión no válida" };

    const esValido = await verificarRolJuzgado(session.user.id);
    if (!esValido) return { success: false, error: "Acceso no autorizado" };

    const id = formData.get("id");
    if (typeof id !== "string" || !id.trim())
      return { success: false, error: "ID de solicitud inválido" };

    const evidencias = formData.get("evidencias");
    if (typeof evidencias !== "string" || !evidencias.trim())
      return { success: false, error: "Debe agregar al menos una ubicación" };

    await pedirEvidencias(id, evidencias);

    revalidatePath("/agente_juzgado/solicitudes");
    return { success: true };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Error inesperado al pedir evidencias";
    console.error("[accionPedirEvidencias]", msg);
    return { success: false, error: msg };
  }
}

export async function accionCerrarCaso(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Sesión no válida" };

    const esValido = await verificarRolJuzgado(session.user.id);
    if (!esValido) return { success: false, error: "Acceso no autorizado" };

    const id = formData.get("id");
    if (typeof id !== "string" || !id.trim())
      return { success: false, error: "ID de solicitud inválido" };

    await cerrarCaso(id);

    revalidatePath("/agente_juzgado/solicitudes");
    return { success: true };
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "Error inesperado al cerrar el caso";
    console.error("[accionCerrarCaso]", msg);
    return { success: false, error: msg };
  }
}

export async function obtenerDatosAseguradoAction(
  solicitudId: string,
): Promise<{ data: DetalleAsegurado | null; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { data: null, error: "Sesión no válida" };

    const esValido = await verificarRolJuzgado(session.user.id);
    if (!esValido) return { data: null, error: "Acceso no autorizado" };

    const data = await obtenerDatosAsegurado(solicitudId);
    return { data };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Error inesperado al obtener datos del asegurado";
    console.error("[obtenerDatosAseguradoAction]", msg);
    return { data: null, error: msg };
  }
}

export async function guardarDetallesAseguradoAction(
  solicitudId: string,
  datos: DatosAseguradoInput,
  evidencias?: {
    colonia: string;
    calle: string;
    numero: string;
    horaInicio: string;
    horaFin: string;
  }[],
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { success: false, error: "Sesión no válida" };

    const esValido = await verificarRolJuzgado(session.user.id);
    if (!esValido) return { success: false, error: "Acceso no autorizado" };

    let evidenciasJson: string | null = null;
    if (evidencias && evidencias.length > 0) {
      const validos = evidencias.filter(
        (it) =>
          it.colonia.trim() &&
          it.calle.trim() &&
          it.numero.trim() &&
          it.horaInicio.trim() &&
          it.horaFin.trim(),
      );
      if (validos.length > 0) {
        const ahora = new Date().toISOString();
        const nuevas = validos.map((it, idx) => ({
          solicitud_id: idx + 1,
          fecha_peticion: ahora,
          colonia: it.colonia.trim(),
          calle: it.calle.trim(),
          numero: it.numero.trim(),
          hora_inicio: it.horaInicio.trim(),
          hora_fin: it.horaFin.trim(),
          atendida: false,
        }));
        evidenciasJson = JSON.stringify(nuevas);
      }
    }

    await guardarDetallesAsegurado(solicitudId, datos, evidenciasJson);

    revalidatePath("/agente_juzgado/solicitudes");
    return { success: true };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Error inesperado al guardar detalles";
    console.error("[guardarDetallesAseguradoAction]", msg);
    return { success: false, error: msg };
  }
}

/* ═══════════════════════════════════════
   LIBERACIONES
   ═══════════════════════════════════════ */

export interface LiberacionesData {
  data: LiberacionRow[];
  total: number;
}

export async function obtenerLiberacionesAction(): Promise<LiberacionesData> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const esValido = await verificarRolJuzgado(session.user.id);
  if (!esValido) redirect("/dashboard");

  const data = await obtenerLiberacionesJuzgado();
  console.log(data);

  return { data, total: data.length };
}



export async function obtenerDetalleInfraccionViaActionJuzgado(
  id: string,
): Promise<{ data: ViaInfraccionDetalle | null; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { data: null, error: "Sesión no válida" };

    const esValido = await verificarRolJuzgado(session.user.id);
    if (!esValido) return { data: null, error: "Acceso no autorizado" };

    const data = await obtenerDetalleInfraccionVia(id);
    if (!data) return { data: null, error: "No se encontró la infracción" };

    return { data };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Error inesperado al obtener detalle de infracción";
    console.error("[obtenerDetalleInfraccionViaActionJuzgado]", msg);
    return { data: null, error: msg };
  }
}

export async function guardarOficioJuzgadoAction(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }

    const esValido = await verificarRolJuzgado(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    const folio = formData.get('folio') as string | null
    const numero_oficio = formData.get('numero_oficio') as string | null
    const no_carpeta_investigacion = formData.get('no_carpeta_investigacion') as string | null
    const archivo_oficio = formData.get('archivoIne') as File | null

    const nombre_titular_liberacion = formData.get('nombre_titular_liberacion') as string | null
    const appaterno_titular_liberacion = formData.get('appaterno_titular_liberacion') as string | null
    const apmaterno_titular_liberacion = formData.get('apmaterno_titular_liberacion') as string | null
    const correo_titular_liberacion = formData.get('correo_titular_liberacion') as string | null
    const curp_titular_liberacion = formData.get('curp_titular_liberacion') as string | null

    const nombre_infractor = formData.get('nombre_infractor') as string | null
    const apellido_paterno_infractor = formData.get('apellido_paterno_infractor') as string | null
    const apellido_materno_infractor = formData.get('apellido_materno_infractor') as string | null
    const correo_infractor = formData.get('correo_infractor') as string | null
    const curp_infractor = formData.get('curp_infractor') as string | null

    if (!folio) return { success: false, error: 'Folio de infracción es requerido' }

    if (!numero_oficio && !archivo_oficio) return { success: false, error: 'No se enviaron documentos' }

    if (archivo_oficio) {
      const esTipoValido = archivo_oficio.type.startsWith('image/') || archivo_oficio.type === 'application/pdf'
      if (!esTipoValido) return { success: false, error: `Tipo de archivo no permitido: ${archivo_oficio.name}` }
    }

    let url_oficio: string | null = null
    if (archivo_oficio) {
      const { subirArchivoFiscalia } = await import('@/lib/fiscalia/expediente')
      url_oficio = await subirArchivoFiscalia(archivo_oficio, folio)
    }

    const { actualizarOficioJuzgado } = await import('./repository')

    await actualizarOficioJuzgado(
      folio,
      numero_oficio ?? '',
      url_oficio,
      no_carpeta_investigacion || null,
      {
        nombre_infractor,
        appaterno_infractor: apellido_paterno_infractor,
        apmaterno_infractor: apellido_materno_infractor,
        correo_infractor,
        curp_infractor,
      },
    )

    revalidatePath('/agente_juzgado/liberaciones')

    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado al guardar documentos'
    console.error('[guardarOficioJuzgadoAction]', msg)
    return { success: false, error: msg }
  }
}
