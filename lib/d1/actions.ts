'use server'

import { db } from '@/lib/db'
import { reportesD1 } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Helpers de conversión (siguiendo tu estilo)
const str = (fd: FormData, k: string) => (fd.get(k) as string | null)?.trim() || null
const num = (fd: FormData, k: string) => { const v = fd.get(k); return v ? Number(v) : null }
const bool = (fd: FormData, k: string) => fd.get(k) === 'true' || fd.get(k) === 'on'

export async function createReporteD1(formData: FormData) {
  // 1. Verificar sesión
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  try {
    // 2. Insertar en la base de datos
    await db.insert(reportesD1).values({
      // Identificación
      folioDenuncia: str(formData, 'folioDenuncia')!,
      iph: str(formData, 'iph'),
      folioCu: str(formData, 'folioCu'),
      corporacion: str(formData, 'corporacion') || 'SSPM',
      sector: str(formData, 'sector'),
      grupoAdscripcion: str(formData, 'grupoAdscripcion'),

      // Cronometría
      fechaReporte: str(formData, 'fechaReporte')!,
      horaReporte: str(formData, 'horaReporte')!,
      fechaAvistamiento: str(formData, 'fechaAvistamiento'),
      horaAvistamiento: str(formData, 'horaAvistamiento'),
      fechaDespacho: str(formData, 'fechaDespacho'),
      horaDespacho: str(formData, 'horaDespacho'),
      fechaConfirmacion: str(formData, 'fechaConfirmacion'),
      horaConfirmacion: str(formData, 'horaConfirmacion'),
      fechaLlegada: str(formData, 'fechaLlegada'),
      horaLlegada: str(formData, 'horaLlegada'),
      horaInicioDenuncia: str(formData, 'horaInicioDenuncia'),
      horaFinDenuncia: str(formData, 'horaFinDenuncia'),
      horaTerminoAtencion: str(formData, 'horaTerminoAtencion'),
      horaCuestionario: str(formData, 'horaCuestionario'),

      // Ubicación
      lugarHecho: str(formData, 'lugarHecho'),
      lugarApoyo: str(formData, 'lugarApoyo'),
      municipio: str(formData, 'municipio') || 'San Juan del Río',
      colonia: str(formData, 'colonia'),
      referencias: str(formData, 'referencias'),
      latitud: str(formData, 'latitud'), // Se guarda como string numeric
      longitud: str(formData, 'longitud'),

        nominaMando: str(formData, 'nominaMando'),
        policiaCargo: str(formData, 'policiaCargo'),

      // Detalles
      tipoEvento: str(formData, 'tipoEvento')!,
      delito: str(formData, 'delito')!,
      violencia: bool(formData, 'violencia'),

      // Personal
      crp: str(formData, 'crp'),
      policiaDenuncia: str(formData, 'policiaDenuncia'),
      policiaFirmaD1: str(formData, 'policiaFirmaD1'),
      policiaIngresaCu: str(formData, 'policiaIngresaCu'),
      requirioTablet: bool(formData, 'requirioTablet'),
      funcionabaTablet: bool(formData, 'funcionabaTablet'),

      // Victimología
      ofendidoHombre: num(formData, 'ofendidoHombre') || 0,
      ofendidoMujer: num(formData, 'ofendidoMujer') || 0,
      numCuestionarios: num(formData, 'numCuestionarios') || 0,
      intervinoGs: bool(formData, 'intervinoGs'),

      // Estatus
      seGeneroD1: bool(formData, 'seGeneroD1'),
      seVaAGenerarD1: bool(formData, 'seVaAGenerarD1'),
      observaciones: str(formData, 'observaciones'),

      // Control
      capturadoPor: session.user.id,
    })
  } catch (error) {
    console.error("Error al insertar D1:", error)
    throw new Error("No se pudo registrar el reporte D1")
  }

  // 3. Limpiar caché y redirigir
  revalidatePath('/d1')
  redirect('/d1/exito') // O a la bitácora de D1
}