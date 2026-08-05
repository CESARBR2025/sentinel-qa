# Etapa 2 — Datos del oficial: resolver desde la sesión, no por query param roto

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

Hoy "Oficial ID", "CRP" (placa de patrulla) y "Sector" en el D1 **siempre llegan vacíos**, en cualquier flujo. Causa: dependen de `searchParams.oficialId`, un query param que **ningún enlace real del proyecto pasa**:

- `app/oficial/despachos/page.tsx:207` → `/denuncia/nuevo?reporteCampoId=${d.reporteCampoId}` (sin `oficialId`)
- `app/oficial/reportes/[id]/page.tsx:74,229` → pasan `oficial=` (el **nombre**, no el id) y tampoco `oficialId=`

Además, los campos "Policía a Cargo", "Policía que Toma la Denuncia", "Policía que Firma el D1" y "Policía que Ingresa el CU" (sección "Personal y Equipamiento" del formulario) se prellenan hoy con el oficial que **registró el reporte de campo** (`reporteData?.oficialNomina`, vía JOIN `ofi_reportes_campo → ofi_oficiales → users` en `obtenerReporteCampoParaD1`), no con el oficial de la **sesión activa** que está llenando el D1 en este momento.

El usuario pidió explícitamente que esos datos salgan del oficial que está llenando el formulario (sesión activa). Esto además coincide con la convención que ya usa el resto del proyecto para el cierre de reporte de campo: *"El oficial se resuelve de `ofi_oficiales` por sesión (`user_id`), nunca a mano"* (`boveda/🧩 Features/Reporte Campo.md`). El D1 hoy viola esa convención al intentar pasar `oficialId` por URL (y encima roto).

## Archivo a modificar

`app/denuncia/nuevo/page.tsx` — único archivo de esta etapa.

## Cambios

Ya existe todo lo necesario, no hay que crear queries nuevas:
- `obtenerMiPerfil(userId)` en `lib/oficial/service.ts:88` (wrapper de `obtenerOficialPorUserId`) — devuelve `OfiOficial | null` con `id`, `noNomina`, `ofiNombre`, `ofiApPaterno`, `patrullaId`, etc.
- `obtenerPlacaPatrulla(oficialId)` y `obtenerSectorOficialSvc(oficialId)` — ya importados en este archivo, solo cambian de qué `id` reciben.

Código actual (líneas ~20-53):
```ts
const user = session.user as { name: string; apellido?: string; email: string }
const sp = await searchParams

// Datos pre-llenados desde el reporte de recorrido
let placaPatrulla = ''
if (sp.oficialId) {
  placaPatrulla = await obtenerPlacaPatrulla(sp.oficialId)
}

// Consultar BD para datos adicionales
const reporteData = sp.reporteCampoId ? await obtenerDatosParaD1(sp.reporteCampoId) : null
const sector = sp.oficialId ? await obtenerSectorOficialSvc(sp.oficialId) : null
const gruposAdscripcion = await listarGruposAdscripcion(sp.destino ?? undefined)

const prefill = {
  incidenteId:      sp.incidenteId ?? null,
  reporteCampoId:   sp.reporteCampoId ?? null,
  lugarHecho:       sp.calle          ?? reporteData?.calle ?? '',
  coloniaHecho:     sp.colonia        ?? reporteData?.colonia ?? '',
  lat:              sp.lat            ? Number(sp.lat) : reporteData?.latitud ?? null,
  lng:              sp.lng            ? Number(sp.lng) : reporteData?.longitud ?? null,
  oficialId:        sp.oficialId      ?? null,
  destino:          sp.destino        ?? reporteData?.autoridadRecibe ?? null,
  crp:              placaPatrulla,
  tipoIncidente:    reporteData?.tipoIncidente ?? null,
  descripcion:      reporteData?.descripcion ?? null,
  folioReporteCampo: reporteData?.folioReporteCampo ?? null,
  sector:           sector,
  nombreOficial:    reporteData?.oficialNombre ?? null,
  nominaOficial:    reporteData?.oficialNomina ?? null,
  fechaHoraInicioIncidente: reporteData?.fechaHoraInicioIncidente ?? null,
  fechaHoraDespacho:         reporteData?.fechaHoraDespacho ?? null,
  fechaReporteCampo:         reporteData?.created_at ?? null,
}
```

Reemplazar por:
```ts
const user = session.user as { name: string; apellido?: string; email: string }
const sp = await searchParams

// El oficial que llena el D1 es siempre el de la sesión activa — nunca por query param
const miPerfil = await obtenerMiPerfil(session.user.id)

const [placaPatrulla, sector] = await Promise.all([
  miPerfil ? obtenerPlacaPatrulla(miPerfil.id) : Promise.resolve(''),
  miPerfil ? obtenerSectorOficialSvc(miPerfil.id) : Promise.resolve(null),
])

// Datos adicionales del reporte de campo (ubicación, delito, etc.) — NO identidad del oficial
const reporteData = sp.reporteCampoId ? await obtenerDatosParaD1(sp.reporteCampoId) : null
const gruposAdscripcion = await listarGruposAdscripcion(sp.destino ?? undefined)

const prefill = {
  incidenteId:      sp.incidenteId ?? null,
  reporteCampoId:   sp.reporteCampoId ?? null,
  lugarHecho:       sp.calle          ?? reporteData?.calle ?? '',
  coloniaHecho:     sp.colonia        ?? reporteData?.colonia ?? '',
  lat:              sp.lat            ? Number(sp.lat) : reporteData?.latitud ?? null,
  lng:              sp.lng            ? Number(sp.lng) : reporteData?.longitud ?? null,
  oficialId:        miPerfil?.id ?? null,
  destino:          sp.destino        ?? reporteData?.autoridadRecibe ?? null,
  crp:              placaPatrulla,
  tipoIncidente:    reporteData?.tipoIncidente ?? null,
  descripcion:      reporteData?.descripcion ?? null,
  folioReporteCampo: reporteData?.folioReporteCampo ?? null,
  sector:           sector,
  nombreOficial:    miPerfil ? `${miPerfil.ofiNombre} ${miPerfil.ofiApPaterno}`.trim() : null,
  nominaOficial:    miPerfil?.noNomina ?? null,
  fechaHoraInicioIncidente: reporteData?.fechaHoraInicioIncidente ?? null,
  fechaHoraDespacho:         reporteData?.fechaHoraDespacho ?? null,
  fechaReporteCampo:         reporteData?.created_at ?? null,
}
```

Cambios de import: agregar `obtenerMiPerfil` al import existente de `@/lib/oficial/service` (línea 8: `verificarRolOficial, obtenerPlacaPatrulla, obtenerDatosParaD1, obtenerSectorOficialSvc`).

Limpieza opcional (no obligatoria, pero consistente): el tipo de `searchParams` (línea 14) declara `oficialId?: string`, que deja de leerse. Si no se usa en ningún otro lado de este archivo, se puede quitar del tipo — verificar antes de borrar.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Con sesión de un oficial con `ofi_oficiales.ofi_estatus = 'activo'`, `patrulla_id` y `departamento_id` asignados: navegar a `/denuncia/nuevo` (sin `reporteCampoId`) y confirmar que "Oficial ID", "CRP" y "Sector" en el paso 4 llegan prellenados — **antes de este fix, estos tres campos estaban siempre vacíos, con o sin `reporteCampoId`**.
3. Confirmar que "Policía a Cargo", "Policía que Toma la Denuncia", "Policía que Firma el D1" y "Policía que Ingresa el CU" (paso 4) llegan prellenados con la nómina del oficial de la sesión activa.
4. Si es posible probar con dos oficiales distintos: confirmar que el prefill cambia según quién tiene la sesión iniciada, no según el reporte de campo vinculado.
5. No modificar `FormularioD1.tsx` en esta etapa — no hace falta, ya lee `prefill?.oficialId`/`prefill?.crp`/`prefill?.sector`/`prefill?.nominaOficial` genéricamente.

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-3.md`.**
