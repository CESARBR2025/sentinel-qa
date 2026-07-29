# Etapa 3 — Integrar el mapa en el modal (split-view, sin estilos diferenciados aún)

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript). Parte 3 de 5 del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` en esta misma carpeta para trasfondo completo. **Requiere que las etapas 1 y 2 ya estén hechas y validadas** (necesitas `AsignacionMapa.tsx` existente y el endpoint sin truncado a top-10).

## Objetivo

Insertar `AsignacionMapa` (de la Etapa 1) dentro de `SeleccionarUnidadesModal.tsx` en un layout de **dos columnas** (split-view: mapa a la izquierda, lista+buscador actual a la derecha), conectado a datos reales del modal. **Todavía sin** la diferenciación visual de marcadores por cercanía/selección/antigüedad (eso es la Etapa 4) — el objetivo aquí es solo validar que la integración con el modal real no rompe nada de lo que ya funciona.

## Archivos

- **Modificar (único archivo a tocar):** `components/911/despacho/SeleccionarUnidadesModal.tsx`

Puede que también necesites que `DespachoForm.tsx` pase `incidenteLat`/`incidenteLng` al modal si hoy no se los pasa — **verifica primero si ya se los pasa antes de asumir que hay que tocar `DespachoForm.tsx`**. Si hace falta agregar esas dos props al `<SeleccionarUnidadesModal ... />` que se instancia en `DespachoForm.tsx`, es el único cambio permitido ahí (una línea de props, no reestructurar el archivo).

No modificar `AsignacionMapa.tsx` en esta etapa (eso es la Etapa 4) más allá de ajustes triviales de altura/contenedor si el layout lo requiere.

## Contexto técnico necesario

- `SeleccionarUnidadesModal.tsx` recibe hoy: `unidades: UnidadParaDespacho[]`, `seleccionadas: UnidadParaDespacho[]`, `prioritarioNomina?`, `onConfirmar`, `onClose`. Mantiene estado local `seleccionLocal` (inicializado desde `seleccionadas`) y una función `toggle(u: UnidadParaDespacho)` que agrega/quita de `seleccionLocal` por `id`.
- El modal se monta vía `createPortal(..., document.body)`, con un overlay `position: fixed` y un contenedor `background: '#fff', width: '100%', maxWidth: 640, maxHeight: '88vh'`.
- `DespachoForm.tsx` ya tiene disponibles `incidenteLat: number | null` e `incidenteLng: number | null` como sus propias props (recibidas del componente padre `TablonDespacho`) — solo hace falta pasarlas hacia abajo si no se están pasando ya.
- Componente de mapa de la Etapa 1: `AsignacionMapa.tsx`, props `{ unidades, incidenteLat, incidenteLng, seleccionadas: string[], onToggleUnidad: (id: string) => void }`.

## Instrucciones

1. Agrega a las props de `SeleccionarUnidadesModal` (interfaz de props del componente): `incidenteLat?: number | null` e `incidenteLng?: number | null`.
2. En `DespachoForm.tsx`, en el punto donde se instancia `<SeleccionarUnidadesModal ... />`, pasa `incidenteLat={incidenteLat}` e `incidenteLng={incidenteLng}` (esas variables ya existen ahí como props del propio `DespachoForm`).
3. Dentro de `SeleccionarUnidadesModal`, calcula un booleano tipo `mostrarMapa = incidenteLat != null && incidenteLng != null`.
4. Si `mostrarMapa` es `true`:
   - Cambia el `maxWidth` del contenedor del modal de `640` a algo como `Math.min(1040, window.innerWidth * 0.94)` o, más simple en CSS, usa `maxWidth: 'min(1040px, 94vw)'`.
   - Envuelve el cuerpo del modal (la sección de búsqueda + lista existente) y el nuevo `<AsignacionMapa />` en un contenedor con `display: 'grid'`, `gridTemplateColumns` aproximadamente `'55% 45%'` (o `'1.2fr 1fr'`), de forma que el mapa quede a la izquierda y la columna derecha contenga exactamente lo que hoy es el cuerpo completo del modal (buscador + lista con su propio scroll, sin cambios de comportamiento).
   - Cada columna debe tener su propio scroll/overflow independiente si hace falta — la columna del mapa no debe scrollear (el mapa ocupa su alto fijo), la columna de la lista mantiene el mismo `overflowY: 'auto'` que ya tiene hoy.
5. Si `mostrarMapa` es `false`: el modal se renderiza exactamente igual que antes de este cambio (640px, sin columna de mapa, sin overhead).
6. Pasa a `AsignacionMapa`:
   - `unidades={unidades}` (la prop que el modal ya recibe).
   - `incidenteLat={incidenteLat}` / `incidenteLng={incidenteLng}`.
   - `seleccionadas={seleccionLocal.map(u => u.id)}`.
   - `onToggleUnidad={(id) => { const u = unidades.find(x => x.id === id); if (u) toggle(u); }}` — reutilizando la función `toggle` que el modal ya tiene, no dupliques lógica de selección.
7. No agregues polling ni estilos diferenciados de marcador en esta etapa.

## Qué NO hacer en esta etapa

- No tocar `AsignacionMapa.tsx` salvo ajustes triviales de contenedor/altura.
- No tocar `UnidadCards.tsx`.
- No implementar polling (Etapa 5).
- No implementar diferenciación visual de marcadores (Etapa 4) — todos los marcadores de unidad se ven iguales todavía, solo cambia si están o no seleccionados si ya lo soporta `AsignacionMapa` de la Etapa 1 (si no lo soporta aún, está bien que en esta etapa la selección solo se refleje en la lista, no en el marcador — eso se termina de pulir en Etapa 4).
- No reestructurar el resto del modal (header, buscador, footer con botones "Cancelar"/"Confirmar selección") — deben seguir funcionando exactamente igual, solo cambia el layout para acomodar la columna del mapa.

## Criterios de aceptación (verificar antes de pasar a Etapa 4)

1. `npx tsc --noEmit` corre sin errores nuevos.
2. Al expandir un incidente **con coordenadas** en el tablón real y abrir "Elegir unidades cercanas", el modal se ve más ancho, con el mapa a la izquierda y la lista+buscador a la derecha, ambos visibles simultáneamente.
3. Click en un marcador del mapa selecciona la unidad correspondiente — la card de esa unidad en la lista de la derecha debe reflejar el estado seleccionado (borde/check, como ya lo hace hoy `UnidadCard` con `seleccionada`).
4. Click en una card de la lista sigue funcionando como antes (selecciona/deselecciona) y no rompe nada del mapa.
5. Al expandir un incidente **sin coordenadas** (`latitud`/`longitud` nulos en el incidente), el modal se ve exactamente igual que antes de este cambio: 640px, solo lista, sin mapa, sin errores en la consola del navegador.
6. El buscador por número de unidad/placa y el botón "Confirmar selección" siguen funcionando igual que antes en ambos casos (con y sin mapa).
7. No se tocó ningún archivo fuera de `SeleccionarUnidadesModal.tsx` y, como mucho, la línea de props en `DespachoForm.tsx` mencionada en el paso 2.

Cuando estos criterios pasen, detente y espera confirmación antes de continuar con `etapa-4.md`.
