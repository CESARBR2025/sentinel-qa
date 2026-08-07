# Plan: Migración UI Oficial + Despacho a Apple-style

Continuación directa de `plan-apple-pilot/` (Login + Hub, ya construido y aprobado). El usuario decidió que Apple-style (`DESIGN.md`) es ahora el lenguaje único del sistema y pidió empezar la migración por el módulo **Oficial** (app de campo) y **Despacho/911** (asignación de unidades a incidentes).

Diseñado por Claude (arquitecto), verificado contra el código real de 41 archivos (2 agentes de exploración en paralelo leyeron el contenido completo de cada uno — ver `00-contexto.md` para el inventario y los hallazgos). A construir por DeepSeek (worker).

## Cómo llegó a esta forma

Ver `00-contexto.md` — resume el hallazgo transversal (casi todo el código sigue en estilo táctico inline), el componente duplicado detectado (`SegmentControl` vs `SegmentPage`), y la lista completa de lógica de negocio (mapas, GPS, polling, stores) que ninguna etapa debe tocar.

## Orden de trabajo

**Módulo Oficial (etapas 1-11):**
1. [etapa-01.md](etapa-01.md) — `SegmentControl.tsx` (tabs de despachos, componente compartido de esta migración).
2. [etapa-02.md](etapa-02.md) — `app/oficial/page.tsx` (hub, 4 cards).
3. [etapa-03.md](etapa-03.md) — `app/oficial/despachos/page.tsx` (lista + tabs, usa Etapa 1).
4. [etapa-04.md](etapa-04.md) — `despachos/[id]/page.tsx` + `DespachoContent.tsx` + `AsignacionCard.tsx` + `NavegacionModal.tsx`.
5. [etapa-05.md](etapa-05.md) — `navegacion/NavegacionDespacho.tsx` (HUD de navegación GPS — alto riesgo, etapa aislada).
6. [etapa-06.md](etapa-06.md) — `FormularioRecorrido.tsx` + `SelectorDestinoLegal.tsx` (formulario de 7 pasos).
7. [etapa-07.md](etapa-07.md) — `MapaUbicacion.tsx` + `MapaPinFijo.tsx` + `ModalSeleccionarUnidad.tsx`.
8. [etapa-08.md](etapa-08.md) — `reportes/[id]/page.tsx` + `reportes/[id]/fotos/page.tsx`.
9. [etapa-09.md](etapa-09.md) — `rondin/page.tsx` + `RondinPageClient.tsx` + `RondinTabla.tsx`.
10. [etapa-10.md](etapa-10.md) — `configuracion/page.tsx` + `EditarTelefono.tsx` + `MiUbicacionSection.tsx` + `UnidadAsignadaSection.tsx`.
11. [etapa-11.md](etapa-11.md) — `ContadorAsignaciones.tsx`, `ProfileDropdown.tsx`, `ToastExito.tsx` (piezas pequeñas sueltas).

**Módulo Despacho/911 (etapas 12-18):**
12. [etapa-12.md](etapa-12.md) — `app/agente_911/page.tsx` + `app/agente_despacho/page.tsx` (hubs, mismo patrón).
13. [etapa-13.md](etapa-13.md) — `agente_911/despacho/page.tsx` + `agente_despacho/kpi-incidencias/page.tsx` (wrappers livianos).
14. [etapa-14.md](etapa-14.md) — `components/911/despacho/TablonDespacho.tsx` (núcleo, 503 líneas — etapa aislada).
15. [etapa-15.md](etapa-15.md) — `DespachoForm.tsx` + `UnidadCards.tsx`.
16. [etapa-16.md](etapa-16.md) — `AsignacionMapa.tsx` + `MapaSeguimientoOficial.tsx` + `SeleccionarUnidadesModal.tsx` (mapas + modal — alto riesgo).
17. [etapa-17.md](etapa-17.md) — `Bitacora911.tsx` + `FiltrosIncidentes.tsx` + `Pagination.tsx`.
18. [etapa-18.md](etapa-18.md) — `components/911/ModuleCard.tsx`.

## Decisiones ya tomadas (no volver a preguntar)

1. Alcance = módulo Oficial completo + módulo Despacho/911 completo (los 41 archivos listados en `00-contexto.md`). No incluye KPI Incidencias (mapa de calor, fuera de esta migración salvo su wrapper liviano en Etapa 13), ni ningún otro módulo del sistema (Fiscalía, Juzgado, Flota, admin, etc. — esos son migraciones futuras separadas).
2. `SegmentControl` se restylea en el lugar, **no se consolida** con `SegmentPage` en este plan — es un cambio funcional aparte.
3. Ninguna lógica de negocio se toca: mapas, GPS, polling, stores Zustand, server actions, fetch a APIs — ver la lista completa en `00-contexto.md`.
4. El estilo a aplicar es exactamente `DESIGN.md` (raíz del repo) — no se inventan valores nuevos de color/tipografía/radios/sombras. Si `DESIGN.md` no cubre un caso puntual, usar el criterio más cercano ya documentado (ej. una tabla sigue el patrón de §4 "Tablas — superficie plana") y anotarlo al reportar la etapa.
5. Sin modo oscuro (sigue sin estar en alcance de ninguna migración hasta que el usuario lo pida).

## Reglas para quien construye (DeepSeek)

- **Leer `DESIGN.md` completo antes de tocar cualquier archivo** — es la especificación de estilo, esta carpeta no repite sus valores.
- No combinar etapas ni adelantar trabajo de una etapa posterior.
- No tocar ningún archivo fuera de los listados en cada etapa.
- No tocar la lógica de negocio listada en `00-contexto.md` ("Lógica de negocio que NO se toca") — mapas, GPS, polling, stores, server actions. Si el restyle requiere tocar una línea de lógica (ej. una clase condicional para un estado visual), debe ser el mínimo indispensable y reportarlo explícitamente.
- Al terminar cada etapa, correr `npx tsc --noEmit` y los criterios de aceptación específicos de esa etapa. **Detenerse y esperar confirmación del usuario antes de seguir con la siguiente.**
- Las etapas 5 (`NavegacionDespacho`), 14 (`TablonDespacho`) y 16 (mapas de despacho) son de mayor riesgo — leer su sección "Cuidado especial" antes de empezar.
- Si el código real no coincide exactamente con lo descrito en una etapa, priorizar el código real, mantener el mismo objetivo, y avisarlo explícitamente al reportar la etapa — no resolverlo en silencio.
- Cada página top-level tiene su propio `<style>@import url(...JetBrains+Mono...Barlow+Condensed...)</style>` embebido — al migrar una página a `var(--apple-font-display)`, ese import queda muerto (igual que se limpió en `plan-apple-pilot/etapa-4.md`) y debe quitarse como parte de la misma etapa.

## Fuera de alcance (no implementar salvo pedido explícito)

- Cualquier módulo que no sea Oficial o Despacho/911 (Fiscalía, Juzgado, Flota, formularios UDAI/Formato N, catálogos, admin, KPI Incidencias completo).
- Consolidar `SegmentControl` en `SegmentPage`.
- Modo oscuro.
- Cambiar `PageTransition.tsx` (la transición táctica global) o el default de `variant` en `DashboardHeader` — ambas son decisiones pendientes señaladas en `DESIGN.md §10`, no parte de este plan.
- Cualquier cambio a mapas/GPS/polling/stores/server actions más allá del mínimo indispensable para el restyle.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` limpio.
2. `npm run build` sin errores.
3. Verificación manual de los flujos críticos en los 3 breakpoints (`DESIGN.md §8`): un oficial completando una asignación de principio a fin (aceptar → navegar → llenar `FormularioRecorrido` de 7 pasos → confirmar), un rondín completo, y un despachador asignando una unidad desde `TablonDespacho`.
4. Confirmar que ningún polling/tracking GPS se rompió (revisar consola del navegador por errores durante una sesión de prueba).
5. Actualizar `boveda/🏗 Arquitectura/Decisiones.md` con un ADR breve ("Migración UI Oficial + Despacho a Apple-style").
6. Actualizar `DESIGN.md §10` moviendo estos archivos de "Pendiente de migrar" a "Ya migrado".

---

## Prompt para DeepSeek

Ver [PROMPT-DEEPSEEK.md](PROMPT-DEEPSEEK.md) — pégalo tal cual como primer mensaje.
