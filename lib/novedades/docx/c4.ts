import { AlignmentType, Paragraph, Table, WidthType } from 'docx'
import { r, p, hRow, dRow, toN } from '@/lib/reportes/docx-helpers'
import type { C4Novedades } from '../types'

// Paso 5 — C-4 (T6a línea 9-1-1, T6b cámaras).

export function c4(datos: C4Novedades): (Paragraph | Table)[] {
  const llamadas: [string, string][] = [
    ['LLAMADAS IMPROCEDENTES', 'improcedentes'],
    ['MÉDICO', 'medico'],
    ['PROTECCIÓN CIVIL', 'proteccion_civil'],
    ['SEGURIDAD', 'seguridad'],
    ['SERVICIOS PÚBLICOS', 'servicios_publicos'],
    ['ASISTENCIA', 'asistencia'],
    ['OTROS SERVICIOS', 'otros_servicios'],
  ]
  const camaras: [string, string][] = [
    ['Personas vistas en cámaras y mandadas a revisar sin novedad', 'personas_sin_novedad'],
    ['…resultando con antecedentes', 'personas_con_antecedentes'],
    ['Vehículos vistos en cámaras y mandados a revisar sin novedad', 'vehiculos_revisar'],
    ['Vehículos vistos en cámaras y checados en REPUVE', 'vehiculos_repuve'],
    ['Persecuciones captadas a través de cámaras', 'persecuciones'],
    ['Aseguramientos captados a través de cámaras', 'asegurados_camara'],
    ['Vehículos recuperados a través de cámaras', 'vehiculos_recuperados'],
    ['Incendios captados a través de cámaras', 'incendios'],
    ['Hechos de tránsito captados a través de cámaras', 'hechos_transito_camara'],
  ]

  const wL = [6900, 2460]
  const wC = [6900, 2460]
  const valor = (key: string): number => (datos as unknown as Record<string, number>)[key] ?? 0

  return [
    p(r('T6a. LLAMADAS RECIBIDAS EN EL C-4 / LÍNEA 9-1-1', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        hRow(['CONCEPTO', 'CANTIDAD'], wL, true),
        ...llamadas.map(([label, key]) => dRow([label, toN(valor(key))], wL)),
        hRow(['TOTAL DE LLAMADAS RECIBIDAS', toN(datos.llamadas_recibidas)], wL, true),
        hRow(['LLAMADAS CANALIZADAS', toN(datos.canalizadas)], wL, true),
      ],
    }),
    p(r(''), { after: 60 }),
    p(r('T6b. NOVEDADES CAPTADAS A TRAVÉS DE CÁMARAS', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      rows: [
        hRow(['CONCEPTO', 'CANTIDAD'], wC, true),
        ...camaras.map(([label, key]) => dRow([label, toN(valor(key))], wC)),
      ],
    }),
  ]
}
