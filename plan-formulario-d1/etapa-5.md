# Etapa 5 — Propagar los campos nuevos al `prefill` de la página

Leer primero `00-contexto.md` de esta misma carpeta. Esta etapa da por hecho que la etapa 2 (oficial resuelto por sesión) ya se aplicó sobre este mismo archivo — construir sobre esos cambios, no revertirlos.

## Objetivo

`app/denuncia/nuevo/page.tsx` arma el objeto `prefill` que se pasa a `<FormularioD1>`. Falta agregar los campos nuevos de las etapas 3 y 4 (`delito`, `modusOperandi`, `hayDetencion`, `nombreReportante`, `telefonoReportante`, `detenidos`) — datos que vienen del **reporte de campo**, no del oficial de sesión (eso ya lo resuelve la etapa 2, no se toca aquí).

## Archivo a modificar

`app/denuncia/nuevo/page.tsx` — único archivo de esta etapa.

## Cambios

Objeto `prefill` actual, tal como quedó después de la etapa 2:
```ts
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

No tocar los campos de identidad del oficial (`oficialId`, `crp`, `sector`, `nombreOficial`, `nominaOficial`) — ya están resueltos correctamente por la etapa 2. Esta etapa solo agrega los campos que vienen de `reporteData` (ya viene de `obtenerDatosParaD1`, ampliado por la etapa 3) y una nueva llamada a `obtenerDetenidosParaD1` (etapa 4):

```ts
const detenidos = sp.reporteCampoId ? await obtenerDetenidosParaD1(sp.reporteCampoId) : []
```

Y en `prefill`, agregar:
```ts
  delito:           reporteData?.delito ?? null,
  modusOperandi:    reporteData?.modusOperandi ?? null,
  hayDetencion:     reporteData?.hayDetencion ?? false,
  nombreReportante: reporteData?.nombreReportante ?? null,
  telefonoReportante: reporteData?.telefonoReportante ?? null,
  detenidos,
```

Importar `obtenerDetenidosParaD1` desde `@/lib/oficial/service` en el `import` de servicios que ya trae `obtenerMiPerfil` (agregado en la etapa 2).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores (el tipo `Prefill` en `FormularioD1.tsx` se amplía en la etapa 6 — hasta entonces puede haber un error de tipo esperado al pasar `prefill` con campos de más; si TypeScript se queja porque `Prefill` no declara los campos nuevos, es correcto y se resuelve en la etapa 6, no antes).
2. Navegar a `/denuncia/nuevo?reporteCampoId=<id real con detenido y reportante>` y confirmar (con un `console.log(prefill)` temporal o el debugger) que `delito`, `modusOperandi`, `hayDetencion`, `nombreReportante`, `telefonoReportante` y `detenidos` llegan poblados, y que `oficialId`/`crp`/`sector`/`nominaOficial` siguen viniendo del oficial de sesión (etapa 2), no del reporte de campo.
3. No modificar `FormularioD1.tsx` todavía (eso es etapa 6).

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-6.md`.**
