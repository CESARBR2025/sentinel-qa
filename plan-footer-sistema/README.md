# Plan: `DashboardFooter` a Apple-style + fix del pin-to-bottom en todo el sistema

El footer de `/agente_despacho` (`.desp-footer`, aprobado por el usuario) se replica en el componente compartido `components/partials/Footer.tsx` (`DashboardFooter`), usado en 34 páginas. De paso se corrige el bug real por el que en varias de esas páginas el footer nunca queda pegado al fondo: `margin-top:auto` no funciona sin la cadena flex completa (root + wrapper de contenido) — ver `DESIGN.md §8`.

Diseñado por Claude (arquitecto), verificado contra el código real de las 34 páginas con grep dirigido (ver `00-contexto.md` para la clasificación completa: Grupo A "auditar", Grupo B "hack a remover", Grupo C "roto sin fix", y el caso especial de `admin/roles/agregar`). A construir por DeepSeek (worker).

## Cómo llegó a esta forma

Ver `00-contexto.md` — inventario de las 34 páginas, el bug de la cadena flex, y el caso especial de `admin/roles/agregar/page.tsx` (página huérfana del lenguaje anterior, fuera de alcance arreglarla completa).

## Orden de trabajo

1. [etapa-01.md](etapa-01.md) — `components/partials/Footer.tsx`: restyle del componente a Apple-style (fuente de la verdad: `.desp-footer` en `app/agente_despacho/page.tsx`).
2. [etapa-02.md](etapa-02.md) — Auditoría + fix si hace falta: módulo Fiscalía completo (11 archivos).
3. [etapa-03.md](etapa-03.md) — Auditoría + fix si hace falta: Monitorista (3) + Formatos UDAI (3) + `agente_911/ciudadano/*` (3).
4. [etapa-04.md](etapa-04.md) — Auditoría + fix si hace falta: `agente_reportes`, `envio-de-formatos`, `reporte-detenidos`, `analisis/page.tsx`, `analisis/formulario-ingreso`.
5. [etapa-05.md](etapa-05.md) — Fix real: el grupo de 5 wrappers hack (`agente_911/despacho`, `agente_despacho/kpi-incidencias`, `notificaciones`, `analisis/iph`, `analisis/pendiente-analisis`).
6. [etapa-06.md](etapa-06.md) — Fix real y aislado: `analisis/generar-ppt/page.tsx` (único sin ningún tipo de mitigación previa).
7. [etapa-07.md](etapa-07.md) — Admin: `admin-transito/page.tsx` + `admin-transito/oficiales/page.tsx` (auditar) + `admin/roles/agregar/page.tsx` (fix mínimo, caso especial).

## Decisiones ya tomadas (no volver a preguntar)

1. Alcance = las 34 páginas que importan `DashboardFooter` desde `components/partials/Footer.tsx`, listadas en `00-contexto.md`. Ningún otro footer del sistema (si aparece uno inline distinto durante el trabajo, no tocarlo, anotarlo como candidato a un plan futuro).
2. `app/agente_despacho/page.tsx` **no se toca** — su `.desp-footer` inline ya está aprobado y no usa el componente compartido. Queda anotada la duplicación (dos implementaciones visualmente iguales, una inline y una en componente) como limpieza futura, no en este plan.
3. Solo estilo + el fix mecánico de la cadena flex (root `display:flex/flexDirection:column` + wrapper de contenido `flex:1`) — cero cambios de props/API de `DashboardFooter`, cero cambios de lógica de negocio en ninguna página.
4. `admin/roles/agregar/page.tsx`: solo el fix mínimo de posicionamiento del footer. El resto de su deuda (fuentes de Google Fonts muertas, sin `DashboardHeader`, `maxWidth` fijo que viola `DESIGN.md §5`) se anota en el reporte de la Etapa 7, no se resuelve aquí.
5. El Grupo A ("auditar") no se da por corregido solo por el grep de `00-contexto.md` — cada etapa que lo toca debe confirmar contra el archivo real antes de cerrarlo.

## Reglas para quien construye (DeepSeek)

- **Leer `DESIGN.md §8` ("Footer de página pegado al fondo") antes de tocar cualquier archivo** — ya documenta el patrón exacto de la cadena flex, esta carpeta no lo repite.
- El estilo objetivo del componente es el de `.desp-footer` en `app/agente_despacho/page.tsx` (Etapa 1 lo señala con precisión) — no inventar valores nuevos.
- No combinar etapas ni adelantar trabajo de una etapa posterior.
- No tocar ningún archivo fuera de los listados en cada etapa.
- Al terminar cada etapa, correr `npx tsc --noEmit` y los criterios de aceptación específicos. **Detenerse y esperar confirmación del usuario antes de seguir con la siguiente.**
- Si el código real de un archivo del Grupo A no coincide con lo que sugiere `00-contexto.md` (por ejemplo, el `flex:1` está en un elemento que no es el padre directo del footer), corregirlo igual y anotarlo explícitamente al reportar la etapa — no darlo por bueno en silencio.
- La Etapa 7 tiene un caso especial (`admin/roles/agregar/page.tsx`) — leer su sección "Cuidado especial" antes de tocarlo, el fix debe ser mínimo.

## Fuera de alcance (no implementar salvo pedido explícito)

- Cualquier footer que no sea `DashboardFooter` (incluido `.desp-footer` de `agente_despacho`).
- Rediseñar `admin/roles/agregar/page.tsx` más allá del fix mínimo de posicionamiento del footer.
- Agregar props/variantes nuevas a `DashboardFooter` (ej. sufijo de módulo tipo "· Despacho" que usa `agente_despacho` en su footer inline) — no se pidió, no se agrega.
- Consolidar `.desp-footer` de `agente_despacho` con el componente compartido.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` limpio.
2. `npm run build` sin errores.
3. `npm run check:responsive` sin violaciones nuevas.
4. Verificación manual en los 3 breakpoints (`DESIGN.md §8`) de al menos una página por grupo: una de Fiscalía (Grupo A), `notificaciones/page.tsx` (Grupo B), `analisis/generar-ppt` (Grupo C) y `admin/roles/agregar` (caso especial) — confirmar que el footer queda pegado al fondo con contenido corto, y sigue el flujo normal (footer al final, página scrollea) con contenido largo.
5. Actualizar `boveda/🏗 Arquitectura/Decisiones.md` con un ADR breve ("DashboardFooter a Apple-style + fix de pin-to-bottom sistema-wide").
6. Actualizar `DESIGN.md §4` agregando `DashboardFooter` como componente REGLA (mismo tratamiento que `PageHeader`/`SegmentPage`/`StepIndicator`/`Header general`) y `§10` moviendo estas páginas de implícitamente-tácticas a Apple-style donde aplique.

---

## Prompt para DeepSeek

Ver [PROMPT-DEEPSEEK.md](PROMPT-DEEPSEEK.md) — pégalo tal cual como primer mensaje.
