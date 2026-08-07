# Etapa 15 — `DespachoForm.tsx` + `UnidadCards.tsx`

No depende de otras etapas. Leer `00-contexto.md` primero.

## Objetivo

Migrar el formulario de asignar unidades/refuerzos a un incidente y las cards de unidad/tripulación reutilizables que usa.

## Archivos

- `components/911/despacho/DespachoForm.tsx` — constantes `BTN/ERR/LBL` con Barlow Condensed/JetBrains Mono → migrar a `DESIGN.md §4` FormKit (superficie plana, no glass — es un formulario). **No tocar**: el fetch a `/api/despacho/unidades-cercanas`, los `startTransition` + server actions (`createDespacho`, `enviarRefuerzos`), la lógica de deduplicar oficial prioritario.
- `components/911/despacho/UnidadCards.tsx` — mayoría inline, pero `UnidadCardsStyles` ya usa **clases CSS** (`.dq-unidad-card`, `.dq-selected`, animación `dqPulse`) — buen punto de apalancamiento, migrar esas clases a `DESIGN.md §4`/§6 (radio `var(--radius-lg)`, selección con borde/fondo del acento). Revisar `dqPulse`: si es una animación de "seleccionado pulsando" continua, evaluar si tiene propósito real (feedback de selección) o es decorativa — si es puramente decorativa, quitarla por `DESIGN.md §1` ("prohibido parpadeos sin propósito"); si comunica estado real (ej. "esta unidad está siendo asignada ahora"), puede quedarse pero con una transición más sutil.

No tocar: el skeleton de carga (mantener su estructura, solo migrar sus estilos), ninguna prop de las cards.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: abrir el formulario de despacho, seleccionar unidades desde `UnidadCards`, enviar la asignación — debe crear el despacho igual que antes.
3. Responsive en los 3 breakpoints.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 16.
