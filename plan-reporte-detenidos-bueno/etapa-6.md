# Etapa 6 — Ensamblar la ficha completa (todos los datos de un detenido)

Leer primero `00-contexto.md`. Requiere Etapas 2, 3 y 5 confirmadas.

## Objetivo

Una función que, dado un `reporteCampoId`, devuelva **todos** los datos que pide el formato oficial UDAI para un detenido: datos generales, evento delictivo (incluyendo lugar de detención y zona de operación, que ya existen en otras tablas), y antecedentes combinados (locales automáticos + externos manuales). La va a usar el rediseño del PPT en la Etapa 7.

## Archivo a tocar

- `lib/reporte-detenidos/types.ts`
- `lib/reporte-detenidos/repository.ts`

## Cambios

### `types.ts` — nuevos tipos

```ts
export interface AntecedenteFicha {
  fecha: string | null
  descripcion: string
  lugar: string | null
  fuente: 'LOCAL' | 'EXTERNO'
}

export interface FichaDetenidoCompleta {
  // Encabezado
  nombreCompleto: string
  apodo: string | null
  folioFicha: string
  rubro: string
  // Datos generales
  fechaNacimiento: string | null
  edad: number | null
  genero: string | null
  originario: string | null
  estadoCivil: string | null
  escolaridad: string | null
  ocupacion: string | null
  domicilio: string
  rasgosParticulares: string | null
  // Evento delictivo
  fechaHoraEvento: string
  rnd: string | null
  expediente: string | null
  lugarEvento: string | null
  lugarDetencion: string | null
  iph: string | null
  nexosDelictivos: null
  zonaOperacion: string | null
  puestaDisposicion: string | null
  modusOperandi: string
  informacionAdicional: string | null
  // Antecedentes
  antecedentesDelitos: AntecedenteFicha[]
  antecedentesFaltas: AntecedenteFicha[]
}
```

`nexosDelictivos` es literalmente el tipo `null` (no `string | null`) — es intencional, ver la nota de la Etapa 3 de `00-contexto.md` (queda siempre en blanco, sin captura). No lo cambies a `string | null` "por si acaso".

### `repository.ts` — nueva función `obtenerFichaCompleta`

```ts
import { obtenerAntecedentesLocales } from './repository' // ya está en este archivo, es la de la Etapa 5
import { listarAntecedentesExternos } from '@/lib/fiscalia/repository'

export async function obtenerFichaCompleta(reporteCampoId: string): Promise<FichaDetenidoCompleta | null> {
  const res = await query<Record<string, unknown>>(
    `SELECT
       rc.id, rc.delito, rc.falta_administrativa, rc.modus_operandi, rc.ofi_observaciones,
       rc.ofi_calle AS lugar_deteccion_calle, rc.ofi_colonia AS lugar_deteccion_colonia,
       rc.ofi_folio_cad, rc.expediente_ci, rc.created_at,
       d.folio_denuncia, d.iph, d.sector, d.num_carpeta_investigacion,
       d.lugar_hecho, d.colonia_hecho, d.fecha_reporte, d.hora_reporte,
       pd.gestion_interna, pd.dependencia_externa,
       da.nombre_detenido, da.ap_paterno_detenido, da.ap_materno_detenido,
       da.calle AS domicilio_calle, da.numero AS domicilio_numero, da.colonia AS domicilio_colonia,
       da.apodo, da.curp, da.fecha_nacimiento, da.genero, da.originario,
       da.estado_civil, da.escolaridad, da.ocupacion, da.rasgos_particulares
     FROM ofi_reportes_campo rc
     INNER JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = rc.id
     LEFT JOIN ofi_puesta_disposicion pd ON pd.reporte_campo_id = rc.id
     LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
     WHERE rc.id = $1
     ORDER BY da.created_at ASC
     LIMIT 1`,
    [reporteCampoId],
  )
  if (!res.rows.length) return null
  const row = res.rows[0]

  const nombreCompleto = [row.nombre_detenido, row.ap_paterno_detenido, row.ap_materno_detenido]
    .filter(Boolean).join(' ').trim() || 'Sin nombre'

  const fechaNacimiento = row.fecha_nacimiento ? String(row.fecha_nacimiento).slice(0, 10) : null
  const edad = fechaNacimiento ? calcularEdad(fechaNacimiento) : null

  const domicilio = [row.domicilio_calle, row.domicilio_numero, row.domicilio_colonia]
    .filter(Boolean).join(' ') || '—'

  const lugarDetencion = [row.lugar_deteccion_calle, row.lugar_deteccion_colonia]
    .filter(Boolean).join(', ') || null
  const lugarEvento = [row.lugar_hecho, row.colonia_hecho].filter(Boolean).join(', ') || null

  const puestaDisposicion = row.gestion_interna === true
    ? 'Gestión Interna'
    : (row.dependencia_externa ? String(row.dependencia_externa) : null)

  const [locales, externos] = await Promise.all([
    obtenerAntecedentesLocales(reporteCampoId, row.curp ? String(row.curp) : null, nombreCompleto),
    listarAntecedentesExternos(reporteCampoId),
  ])

  const antecedentesDelitos: AntecedenteFicha[] = [
    ...locales.delitos.map(a => ({ ...a, fuente: 'LOCAL' as const })),
    ...externos.filter(e => e.tipo === 'DELITO').map(e => ({
      fecha: e.fecha ? String(e.fecha).slice(0, 10) : null,
      descripcion: String(e.descripcion),
      lugar: e.lugar ? String(e.lugar) : null,
      fuente: 'EXTERNO' as const,
    })),
  ]
  const antecedentesFaltas: AntecedenteFicha[] = [
    ...locales.faltas.map(a => ({ ...a, fuente: 'LOCAL' as const })),
    ...externos.filter(e => e.tipo === 'FALTA_ADMINISTRATIVA').map(e => ({
      fecha: e.fecha ? String(e.fecha).slice(0, 10) : null,
      descripcion: String(e.descripcion),
      lugar: e.lugar ? String(e.lugar) : null,
      fuente: 'EXTERNO' as const,
    })),
  ]

  return {
    nombreCompleto,
    apodo: row.apodo ? String(row.apodo) : null,
    folioFicha: String(row.folio_denuncia || ''),
    rubro: String(row.delito || row.falta_administrativa || '—'),
    fechaNacimiento,
    edad,
    genero: row.genero ? String(row.genero) : null,
    originario: row.originario ? String(row.originario) : null,
    estadoCivil: row.estado_civil ? String(row.estado_civil) : null,
    escolaridad: row.escolaridad ? String(row.escolaridad) : null,
    ocupacion: row.ocupacion ? String(row.ocupacion) : null,
    domicilio,
    rasgosParticulares: row.rasgos_particulares ? String(row.rasgos_particulares) : null,
    fechaHoraEvento: `${row.fecha_reporte ?? ''} ${row.hora_reporte ?? ''}`.trim(),
    rnd: row.ofi_folio_cad ? String(row.ofi_folio_cad) : null,
    expediente: row.expediente_ci ? String(row.expediente_ci) : (row.num_carpeta_investigacion ? String(row.num_carpeta_investigacion) : null),
    lugarEvento,
    lugarDetencion,
    iph: row.iph ? String(row.iph) : null,
    nexosDelictivos: null,
    zonaOperacion: row.sector ? String(row.sector) : null,
    puestaDisposicion,
    modusOperandi: String(row.modus_operandi || '—'),
    informacionAdicional: row.ofi_observaciones ? String(row.ofi_observaciones) : null,
    antecedentesDelitos,
    antecedentesFaltas,
  }
}

function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nac.getFullYear()
  const m = hoy.getMonth() - nac.getMonth()
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}
```

Notas, no te las saltes:

- **No importes `obtenerAntecedentesLocales` con ruta de módulo si ya está en el mismo archivo** — el `import` de ejemplo de arriba es ilustrativo; si `obtenerAntecedentesLocales` vive en este mismo `repository.ts` (Etapa 5), simplemente llámala directo, sin import.
- `INNER JOIN ofi_reporte_denuncia`: si por alguna razón este `reporte_campo_id` no tiene D1, la función devuelve `null` — coherente con la Etapa 1 de `plan-reporte-ppt` (la tabla solo lista detenidos con D1).
- `rubro` es una aproximación (usa el delito o la falta administrativa principal) porque el formato oficial no tiene un catálogo formal de "rubro" en nuestro sistema — anótalo en un comentario de una línea si el nombre de la variable no lo deja claro.
- No dupliques la query de fotos (`evidencias_detenido`) aquí — eso lo sigue haciendo `ppt-service.ts` (ya corregido en la Etapa 2 de `plan-reporte-ppt`), esta función es solo texto.

## Verificación

1. `npx tsc --noEmit`.
2. Ejecutar `obtenerFichaCompleta()` contra un `reporteCampoId` real de prueba y verificar que el objeto devuelto trae todos los campos esperados (algunos en `null` si no se capturaron, eso es correcto).

## Criterios de aceptación

- `obtenerFichaCompleta()` devuelve todos los campos del formato oficial, combinando `ofi_reportes_campo`, `ofi_reporte_denuncia`, `ofi_puesta_disposicion`, `ofi_detalles_asegurados`, antecedentes locales y externos.
- `npx tsc --noEmit` limpio.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 7.**
