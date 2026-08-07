# Etapa 10 — Configuración: `configuracion/page.tsx` + `EditarTelefono.tsx` + `MiUbicacionSection.tsx` + `UnidadAsignadaSection.tsx`

No depende de otras etapas. Leer `00-contexto.md` primero.

## Objetivo

Migrar la página de perfil del oficial (datos personales, unidad asignada, estado de ubicación GPS).

## Archivos

- `app/oficial/configuracion/page.tsx` — ya usa clases CSS propias (`.pf-*`, `.up-*`, `.te-*`) definidas en un `<style>` embebido en este mismo archivo, no puro inline — es el mejor punto de apalancamiento de todo el módulo Oficial: migrar esas clases migra automáticamente varios componentes hijos que las reutilizan (ver siguiente punto).
- `components/oficial/configuracion/EditarTelefono.tsx` — usa las clases `.te-*` definidas en el page padre, **no es autocontenido**. Verificar que siga funcionando tras migrar las clases en `configuracion/page.tsx` (probablemente no necesite cambios propios).
- `components/oficial/MiUbicacionSection.tsx` — panel de estado de tracking GPS en vivo. Reutiliza `.pf-label`/`.pf-value`/`.up-placa-*` del page padre — mismo caso, verificar tras migrar el padre. **No tocar**: `useUbicacionOficial`, el countdown de heartbeat.
- `components/oficial/UnidadAsignadaSection.tsx` — panel de unidad asignada, mezcla inline + clases `.up-*` compartidas con el page de configuración — migrar la parte inline propia, las clases ya vienen del padre.

No tocar: ninguna lógica de guardado de teléfono, tracking GPS, o asignación de unidad (solo abre `ModalSeleccionarUnidad`, ya migrado en la Etapa 7).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: editar el teléfono, ver el estado de ubicación en vivo actualizarse, abrir el modal de cambio de unidad — todo debe seguir funcionando igual.
3. Responsive en los 3 breakpoints.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 11.
