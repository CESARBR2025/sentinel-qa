import { AlignmentType, Paragraph, Table, WidthType } from 'docx'
import { r, p, hRow, dRow, toN, tablaSinNovedad } from '@/lib/reportes/docx-helpers'
import type { DelictivosNovedades, FilaNovedad } from '../types'

// Paso 8 — Hechos delictivos (T25 a T28).

const FAMILIAS: [string, string][] = [
  ['DELITOS PATRIMONIALES CU', 'DELITOS PATRIMONIALES CU'],
  ['CONTRA LA SOCIEDAD', 'CONTRA LA SOCIEDAD'],
  ['CONTRA LAS PERSONAS', 'CONTRA LAS PERSONAS'],
  ['OTROS', 'OTROS'],
]

export function delictivos(datos: DelictivosNovedades, filas: Record<string, FilaNovedad[]> = {}): (Paragraph | Table)[] {
  const delitos = datos.delitos ?? []
  const denuncias = datos.denuncias_digitales ?? []
  const robados = filas['delictivos.veh_robados'] ?? []
  const recuperados = filas['delictivos.veh_recuperados'] ?? []

  const wDelito = [600, 4200, 2280, 2280]
  const wDd = [500, 2200, 2200, 1800, 1300, 1360]
  const wVeh = [900, 900, 800, 800, 800, 800, 900, 1200, 1200, 960]

  const out: (Paragraph | Table)[] = []

  for (const [familia, titulo] of FAMILIAS) {
    const filasFamilia = delitos.filter(d => d.familia === familia)
    out.push(p(r(`T25. ${titulo}`, { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }))
    out.push(
      filasFamilia.length > 0
        ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [
            hRow(['TIPO', 'DELITO', 'DELITOS', 'DETENIDOS'], wDelito, true),
            ...filasFamilia.map(d => dRow([d.delito, '', toN(d.delitos), toN(d.detenidos)], wDelito)),
          ] })
        : tablaSinNovedad(['TIPO', 'DELITO', 'DELITOS', 'DETENIDOS'], wDelito),
    )
    out.push(p(r(''), { after: 60 }))
  }

  out.push(p(r('T26. DENUNCIAS DIGITALES', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }))
  out.push(
    denuncias.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [
          hRow(['N°', 'TIPO DE DELITO', 'UBICACIÓN', 'DENUNCIANTE', 'C.R.P.', 'CUESTIONARIO ÚNICO'], wDd, true),
          ...denuncias.map((f, i) => dRow([String(i + 1), String(f.tipo_delito ?? '—'), String(f.ubicacion ?? '—'), String(f.nombre_denunciante ?? '—'), String(f.crp ?? '—'), String(f.cuestionario_unico ?? '—')], wDd)),
        ] })
      : tablaSinNovedad(['N°', 'TIPO DE DELITO', 'UBICACIÓN', 'DENUNCIANTE', 'C.R.P.', 'CUESTIONARIO ÚNICO'], wDd),
  )

  // T27 — Vehículos recuperados.
  out.push(p(r(''), { after: 60 }))
  out.push(p(r('T27. VEHÍCULOS RECUPERADOS', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }))
  out.push(
    recuperados.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [
          hRow(['MARCA', 'TIPO', 'MODELO', 'COLOR', 'PLACAS', 'ENTIDAD', 'SERIE', 'UBICACIÓN', 'CARPETA', 'CUEST. ÚNICO'], wVeh, true),
          ...recuperados.map(f => dRow([String(f.datos.marca ?? '—'), String(f.datos.tipo ?? '—'), String(f.datos.modelo ?? '—'), String(f.datos.color ?? '—'), String(f.datos.placas ?? '—'), String(f.datos.entidad ?? '—'), String(f.datos.serie ?? '—'), String(f.datos.ubicacion ?? '—'), String(f.datos.carpeta ?? '—'), String(f.datos.cuestionario_unico ?? '—')], wVeh)),
        ] })
      : tablaSinNovedad(['MARCA', 'TIPO', 'MODELO', 'COLOR', 'PLACAS', 'ENTIDAD', 'SERIE', 'UBICACIÓN', 'CARPETA', 'CUEST. ÚNICO'], wVeh),
  )

  // T28 — Vehículos robados.
  out.push(p(r(''), { after: 60 }))
  out.push(p(r('T28. VEHÍCULOS ROBADOS', { bold: true, size: 18 }), { align: AlignmentType.LEFT, after: 40 }))
  out.push(
    robados.length > 0
      ? new Table({ width: { size: 9360, type: WidthType.DXA }, rows: [
          hRow(['MARCA', 'TIPO', 'MODELO', 'COLOR', 'PLACAS', 'ENTIDAD', 'SERIE', 'UBICACIÓN', 'CARPETA', 'CUEST. ÚNICO'], wVeh, true),
          ...robados.map(f => dRow([String(f.datos.marca ?? '—'), String(f.datos.tipo ?? '—'), String(f.datos.modelo ?? '—'), String(f.datos.color ?? '—'), String(f.datos.placas ?? '—'), String(f.datos.entidad ?? '—'), String(f.datos.serie ?? '—'), String(f.datos.ubicacion ?? '—'), String(f.datos.carpeta ?? '—'), String(f.datos.cuestionario_unico ?? '—')], wVeh)),
        ] })
      : tablaSinNovedad(['MARCA', 'TIPO', 'MODELO', 'COLOR', 'PLACAS', 'ENTIDAD', 'SERIE', 'UBICACIÓN', 'CARPETA', 'CUEST. ÚNICO'], wVeh),
  )

  return out
}
