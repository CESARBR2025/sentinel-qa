# Etapa 8 — Reportes: `[id]/page.tsx` + `[id]/fotos/page.tsx`

No depende de otras etapas. Leer `00-contexto.md` primero.

## Objetivo

Migrar la vista de detalle de reporte cerrado (solo lectura) y la página de subida de fotos de detenido.

## Archivos

- `app/oficial/reportes/[id]/page.tsx` — detalle de reporte, usa constantes `LBL/VAL/CARD/SEC` como objetos `React.CSSProperties` (buen punto de apalancamiento: migrar esas constantes migra todo el archivo de una vez). Embebe `MapaPinFijo` (ya migrado en la Etapa 7, aquí solo se usa). Aplicar `DESIGN.md §3` tipografía y `DESIGN.md §4` "Tablas — superficie plana" si el detalle se presenta como pares label/valor densos.
- `app/oficial/reportes/[id]/fotos/page.tsx` — página de subida de fotos. Migrar el chrome visual (header, botones, estados de carga). **No tocar**: `SubirFotoDetenido` (componente importado de monitorista, fuera de alcance de este plan — no migrarlo aquí, solo verificar que encaje visualmente en su contenedor).

No tocar: ninguna lógica de fetch/carga de datos del reporte, la subida de fotos en sí.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: abrir un reporte cerrado y confirmar que todos los datos se siguen mostrando correctamente; subir una foto de prueba sigue funcionando.
3. Responsive en los 3 breakpoints.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 9.
