# Deuda Responsive

**Propósito**: Inventario de la deuda técnica responsiva del proyecto. Es la fuente del allowlist `scripts/responsive/exceptions.json`, que permite `npm run check:responsive` salir ✅ mientras se paga la deuda.

**Regla**: cada vista nueva debe cumplir la "Responsive (REGLA)" (ver `boveda/🛠 Stack/Convenciones.md`). Breakpoints: **móvil ≤720px · tablet 721–1200px · desktop >1200px**.

## Cómo se generó

`node scripts/audit-responsive.mjs --init` escanea `app/` + `components/` y escribe el baseline. Los detectores:

| Detector | Patrón deuda | Reemplazo |
|---|---|---|
| `gridMulticol` | `style={{ gridTemplateColumns: '1fr 1fr' }}` (multi-columna inline) | clases `.grid-2` / `.grid-3` |
| `overflowHidden` | `overflow: 'hidden'` en archivo con tabla | `.tabla-wrap` (`overflow-x: auto`) |
| `minWidthGrande` | `minWidth >= 800px` inline sin `.tabla-wrap` | `min-width` vía media queries |
| `paddingPagina` | padding de página inline (vertical ≥24px y horizontal ≥32px) | `.pad-pagina` / `.pad-dashboard` |
| `headerPad` | padding de header `'0 Npx'` ≥48px | `DashboardHeader` / `SubHeader` |
| `stickyOffset` | `position: sticky` con offset ≥100px | `.panel-lateral` |

## Baseline (2026-08-04)

Total: **100 violaciones permitidas** · 0 nuevas.

*(actualizado tras alinear el módulo Fiscalía a Centinela/PageHeader/responsive: las 11 páginas de `app/fiscalia` (hub + solicitudes + asegurados + liberaciones + detenidos + expedientes + sus 5 detalles) reemplazan el `backHref`/`backLabel` del `DashboardHeader` por `PageHeader` con botón de regreso secondary en `actions`, el header inline/título `<h1>` por `PageHeader`, `main` por `.pad-pagina`/`.pad-dashboard`, grids inline por `.grid-2`/`.grid-3`/`.cat-cards-grid`, tabla de detenidos por `.tabla-wrap`, footer inline por `DashboardFooter` y se retira el título inline de `FiscaliaDashboard`. Se eliminaron las 14 violaciones del módulo — ver Changelog)*

| Módulo | Grid inline | overflow tablas | padding página | Total |
|--------|----:|----:|----:|----:|
| app/admin | 4 | 0 | 1 | 5 |
| app/admin-transito | 1 | 1 | 1 | 3 |
| app/agente_911 | 3 | 0 | 5 | 8 |
| app/agente_bitacorista | 0 | 0 | 1 | 1 |
| app/agente_infracciones | 0 | 0 | 2 | 2 |
| app/agente_juzgado | 2 | 0 | 10 | 12 |
| app/agente_liberaciones | 0 | 0 | 3 | 3 |
| app/analisis | 1 | 0 | 5 | 6 |
| app/auxiliar | 1 | 0 | 4 | 5 |
| app/corralon | 0 | 0 | 2 | 2 |
| app/dashboard | 2 | 1 | 1 | 4 |
| app/envio-de-formatos | 2 | 0 | 0 | 2 |
| app/fiscalia | 0 | 0 | 0 | 0 |
| app/incidentes | 0 | 1 | 1 | 2 |
| app/monitorista | 0 | 0 | 0 | 0 |
| app/notificaciones | 0 | 0 | 1 | 1 |
| app/prevencion | 5 | 3 | 1 | 9 |
| app/rol_servicios | 1 | 0 | 1 | 2 |
| components/911 | 4 | 1 | 3 | 8 |
| components/admin | 1 | 0 | 0 | 1 |
| components/admin-transito | 2 | 0 | 0 | 2 |
| components/agente_juzgado | 3 | 1 | 0 | 4 |
| components/analisis | 2 | 2 | 0 | 4 |
| components/denuncias | 1 | 0 | 0 | 1 |
| components/fiscalia | 0 | 0 | 0 | 0 |
| components/oficial | 0 | 0 | 0 | 0 |
| components/prevencion | 5 | 0 | 0 | 5 |
| components/reportes | 5 | 0 | 0 | 5 |
| components/rol_servicios | 1 | 1 | 0 | 2 |
| components/shared | 1 | 0 | 0 | 1 |
| **TOTAL** | **47** | **11** | **42** | **100** |

## Cómo pagar la deuda

1. Tomar un módulo de la tabla (empezar por los más grandes: `app/agente_juzgado` 12, `app/agente_911` 8, `app/agente_infracciones` 2).
2. Migrar cada archivo a las utilidades de `globals.css` (`.grid-2`/`.grid-3`/`.tabla-wrap`/`.pad-pagina`) o a media queries de la convención.
3. Re-generar el baseline SOLO después: `npm run check:responsive -- --init` y revisar el diff de `exceptions.json` (debe reducirse).
4. Actualizar esta tabla con los nuevos totales.
