# Etapa 6 — `FormularioRecorrido.tsx` + `SelectorDestinoLegal.tsx`

No depende de otras etapas. Leer `00-contexto.md` primero. Es el archivo más grande del módulo Oficial (formulario de 7 pasos) — dedicar tiempo extra a la verificación.

## Objetivo

Migrar el formulario multi-paso más crítico del sistema (registro de reporte de campo). Ya usa `StepIndicator` (componente compartido, no se toca su REGLA) y tiene un helper `SentinelField` que genera estilos inline por campo — ese helper es el punto de apalancamiento: migrarlo una vez migra todos los campos del formulario.

## Archivos

- `components/oficial/FormularioRecorrido.tsx` — aplicar `DESIGN.md §4` "Formularios — FormKit" al helper `SentinelField` y a las clases `.of-card`, `.of-section-title`, `.of-btn-toggle` (definidas en CSS global, buscar su definición y migrar ahí si es un único punto de origen, o localmente si están embebidas en este archivo). Recordar: `DESIGN.md §6` — formularios son superficie **plana** (sin `backdrop-filter`), no glass.
- `components/oficial/SelectorDestinoLegal.tsx` — selector de destino legal (Fiscalía/FGR/Juzgado): los colores hardcoded por tipo deben seguir siendo distinguibles pero pasar a la paleta de `DESIGN.md §2` (si corresponden a un acento de módulo real, ej. Fiscalía `#7c3aed`, usarlo; si no, usar variaciones neutras del acento default).

No tocar: `useOficialFormStore` (Zustand), la lógica de catálogos jerárquicos, el envío de `FormData` con los ~40 campos, ningún `name`/`type` de input (rompe el mapeo al store).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: completar el formulario completo de los 7 pasos de principio a fin, incluyendo el envío final — el reporte debe guardarse igual que antes.
3. `StepIndicator` sigue mostrando el paso correcto en cada uno de los 7 pasos.
4. Responsive en los 3 breakpoints — este formulario se usa principalmente en móvil, verificar con cuidado.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 7.
