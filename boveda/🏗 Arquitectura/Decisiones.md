# Decisiones de Arquitectura

## ADR-001: Referencia en BD por string sentinel

**Contexto**: El formato de respuesta del v2 (`viewUrl` + `uuid`) no es compatible con el v1 (ruta relativa). Se necesita almacenar una referencia que permita regenerar view tokens cuando expiran.

**Decisión**: Guardar `exp2://{folderPath}#{uuid}` en las mismas columnas `text` existentes. El prefijo distingue v2 de legado sin migración SQL. Cero cambios de esquema sobre 9 tablas.

**Consecuencias**: No se puede hacer JOIN por referencia, pero no se necesita (el lookup es por ID de registro, no por referencia de archivo).

## ADR-002: Dual-read (v1 lee, v2 escribe)

**Contexto**: Archivos históricos están en v1. Migrar datos es riesgoso y no aporta beneficio inmediato.

**Decisión**: Todo upload nuevo va al v2. Referencias viejas en BD se siguen leyendo del v1 mientras el servidor esté vivo. Sin migración de datos, reversible.

**Consecuencias**: El proxy debe manejar ambos formatos. Complejidad acotada a un solo archivo. 

## ADR-003: Gate grueso de sección en el proxy vía endpoint HTTP (plan auditoría-URL, 2026-08-04)

**Contexto**: El pedido del cliente de "ocultar/encriptar las URLs" era seguridad por oscuridad; el riesgo real era Broken Access Control / IDOR (solo 42 de 148 `page.tsx` verificaban permiso de sección). Se consideraron dos formas de cerrar el hueco en el gate global (`proxy.ts`, que hoy solo exige sesión activa): (a) migrar el proxy a runtime Node para poder llamar a `obtenerPermisosUsuario` (driver `pg`) directo, o (b) dejar el proxy edge-compatible y resolver permisos en un endpoint Node al que el proxy llama por HTTP.

**Decisión**: (b) — el proxy sigue siendo edge y resuelve todo vía `betterFetch` HTTP, igual que ya hace con `get-session`. Se creó el endpoint Node `/api/auth/secciones-permitidas` (usa `obtenerPermisosUsuario`, incompatible con Edge), el mapa `lib/permisos/mapa-secciones.ts` (prefijo de ruta → secciones, generado con el CSV de `scripts/auditoria-permisos.mjs`) y el check grueso en `proxy.ts` entre el check de `activo` y el `next()` final.

**Consecuencias**: Dos llamadas HTTP en cadena por request de página (get-session + secciones-permitidas) agregan latencia. Si se vuelve medible, la optimización natural es fusionar ambos endpoints — no migrar el proxy a Node, que rompería el patrón edge actual. El check es grueso a propósito (solo `puede_ver` por sección); no reemplaza los `tienePermiso` finos por acción que cada página ya hace. Ver `Proxy y Auth.md`.

## ADR-004: Tokens opacos persistentes para URLs de recursos (plan auditoría-URL, 2026-08-04)

**Contexto**: Las URLs de recursos sensibles exponían el id interno (`/fiscalia/expedientes/${id}`, `/monitorista/detenidos/${id}`, `/monitorista/denuncias/${id}`). Se evaluó reusar `consumeViewToken` (`expediente/vista/[token]`), pero es de un solo uso (vista efímera) — no sirve para URLs que se visitan repetidamente.

**Decisión**: Tabla nueva `tokens_recurso` (token uuid + `tipo` + `recurso_id`, `UNIQUE(tipo, recurso_id)`) y helper `lib/recursos/token-recurso.ts` (`obtenerOCrearToken`/`resolverToken`). El mismo recurso siempre resuelve al mismo token (se genera perezosamente la primera vez, sin backfill). Las PKs internas y FKs no cambian; el token vive solo en la capa URL/routing. Es distinto de `consumeViewToken`: persistente, por lookup, no consumible.

**Consecuencias**: `id+1` deja de funcionar sobre las URLs de recursos; un token inventado da 404 (no revela si el recurso existe). Los controles de sección de la Etapa 1 aplican igual sobre el recurso ya resuelto (dos controles independientes, ambos deben pasar).

## ADR-005: Separar generación de reporte de detenidos de la revisión de fotos (plan reporte-detenidos, 2026-08-04)

**Contexto**: Monitorista gestionaba tanto la revisión/aprobación de fotos de detenidos como la generación del reporte PPT consolidado.

**Decisión**: La generación del reporte se traslada a `/agente_reportes` (rol `Reportante`) como módulo de solo lectura, porque no requiere verificar evidencia — solo consolidar datos ya validados (3 fotos completadas) en un documento periódico. Monitorista conserva la revisión/aprobación, que sí requiere su rol de verificación de evidencia audiovisual.

**Consecuencias**: Nuevo módulo `lib/reporte-detenidos/` (types/repository/ppt-service/permisos) + página top-level `/reporte-detenidos` + API `POST /api/reporte-detenidos/generar-ppt`. Se eliminan el botón, la API y el `ppt-service` de Monitorista; su bandeja de revisión/aprobación se mantiene intacta. El PPT ahora es un solo archivo con 3 secciones (diario/semanal/mensual) sin filtros. El agrupamiento usa `created_at` de `ofi_reportes_campo` como proxy (no existe columna de fecha de evento).

## ADR-006: Saneamiento de arquitectura de BD — reporte de campo / D1 / detenidos (plan saneamiento-bd-d1, 2026-08-05)

**Contexto**: El flujo reporte de campo → D1 → detenidos acumuló deuda de esquema: dos tablas para el mismo concepto (`incidente_reporte_campo` muerta con lectores activos vs `ofi_reportes_campo` viva), dos fuentes de "detenido" (JSONB `ofi_detenidos` vs tabla `ofi_detalles_asegurados`), FK circular IPH↔Fichas, join por folio en vez de FK, `oficial_id` de D1 sin FK y en `text`, FKs duplicadas y `COALESCE` redundante. Diagnóstico y plan verificados por un arquitecto conectándose a la BD real antes de ejecutar.

**Decisiones**:
1. **Fuente única de reporte de campo**: `ofi_reportes_campo` es la única tabla viva; `incidente_reporte_campo` se eliminó (`DROP TABLE`, 0 filas, 9 archivos migrados). Dos tablas con el mismo propósito eran fuente de bugs de sincronización.
2. **Fuente única de detenidos de reporte de campo**: `ofi_detalles_asegurados` (relacional) es la fuente de lectura de `lib/detenidos-compartido.ts`; la columna JSONB `ofi_reportes_campo.ofi_detenidos` sigue existiendo para la captura del formulario pero ya no se lee ahí.
3. **Resolución de `oficial_id` en el D1**: `ofi_reporte_denuncia.oficial_id` referencia `ofi_oficiales(id)`, **no** `users(id)` — verificado contra BD real (el único valor coincide con `ofi_oficiales.id`). Se convirtió la columna a `uuid` y se agregó la FK. Se documenta la diferencia con `capturado_por`, que sí referencia `users(id)` y representa al usuario de sesión que capturó el reporte — no confundir en el futuro.
4. **FK circular IPH↔Fichas de Inteligencia resuelta**: se dejó unidireccional (`ofi_fichas_inteligencia.iph_id → iph_detenidos`); se eliminó el lado inverso (`fk_iph_vinculo_inteligencia`). La columna `ficha_inteligencia_id` se conserva sin FK (sin lectores en el código).
5. **FKs duplicadas eliminadas** en `ofi_reporte_denuncia.incidente_id`: de 3 (`fk_d1_incidente`, `fk_denuncia_incidente`, `ord_incidente_fk`) a 1 (`fk_d1_incidente`).
6. El join del D1 desde IPH en `lib/monitorista/repository.ts` dejó de ser por `folio_denuncia = folio_911` (texto) y ahora usa la FK real `reporte_denuncia_id`.
7. Migraciones manuales idempotentes `0031`–`0036` en `lib/db/manual-migrations/`, y el exportador de esquema (`npm run db:schema`) ahora incluye Índices y Foreign Keys.

**Consecuencias**: Este saneamiento es prerrequisito de `plan-formulario-d1` (carpeta hermana), que corre después sobre este modelo. Los dashboards disponen de los índices que antes faltaban. No se cambiaron contratos de `app/api/**` ni nombres de columnas expuestas.

## ADR-007: Ficha de Detenidos alineada al formato oficial UDAI (2026-08-05)

**Contexto**: se comparó el PPT generado por el sistema contra el formato oficial real usado por UDAI (`FORMATO FICHA DE DETENIDOS.pptx`) y se encontraron 10 campos faltantes (biográficos del detenido, lugar de detención, zona de operación, antecedentes).

**Decisión**:
- Los campos biográficos (apodo, CURP, fecha nacimiento, género, originario, estado civil, escolaridad, ocupación, rasgos particulares) se agregan a `ofi_detalles_asegurados`, capturados por Fiscalía (mismo paso donde ya captura domicilio).
- Lugar de detención y zona de operación **no requirieron campos nuevos** — ya existían (`ofi_reportes_campo.ofi_calle/ofi_colonia` y `ofi_reporte_denuncia.sector` respectivamente), solo se expusieron en la ficha.
- Nexos delictivos queda sin implementar, se muestra vacío (igual que en el ejemplo real del formato oficial).
- Antecedentes: dos fuentes combinadas — búsqueda automática local (CURP con fallback a nombre completo, contra `ofi_reporte_denuncia`/`ofi_reportes_campo` propios, excluyendo el reporte actual) y captura manual en Fiscalía para antecedentes de otras entidades (tabla `antecedentes_externos_detenido`), ya que el sistema no tiene integración con fuentes estatales/nacionales externas.
- El PPT pasa de una página horizontal con tabla simple a una página vertical (7.5×10in) que replica la estructura de secciones del formato oficial.

**Consecuencia**: el módulo deja de ser un simple "listado + tabla" y pasa a depender de datos capturados en un paso adicional de Fiscalía (datos biográficos + antecedentes externos) — un detenido sin esos datos biográficos capturados igual aparece en `/reporte-detenidos` (el criterio de completitud sigue siendo las 3 fotos en `evidencias_detenido`), pero su ficha en el PPT mostrará esos campos vacíos.

## ADR-008: Piloto de lenguaje visual Apple-style, alcance limitado a Login + Hub (plan-apple-pilot, 2026-08-06)

**Contexto**: El usuario pidió un lenguaje "premium, estilo Apple" porque Centinela "se siente gubernamental/viejo". Se le advirtió que la skill de diseño propuesta excluye dashboards/tablas/formularios multi-paso (la mayoría del sistema, que hoy sigue el "tablón de despacho" de `DESIGN.md` §1-9 y funciona bajo presión operativa). Decidió acotar a un piloto de **1-2 pantallas** y **sin modo oscuro**: Login (`app/(auth)/login/`) y Hub (`app/dashboard/page.tsx` + `module-cards.tsx`).

**Decisión**:
- Tipografía de sistema (`var(--apple-font-display)`, pila `-apple-system...`) en vez de Barlow Condensed 800/JetBrains Mono uppercase; sentence-case.
- Un solo acento de color (`primary`/`#1f355a`); tokens "glass" nuevos (`--apple-glass-*`, sombras tintadas de `primary`) en `@theme inline` de `app/globals.css` — variantes alfa, sin colores nuevos. Documentado en `DESIGN.md` §10.
- Materialidad glass (`backdrop-filter`), radios `--radius-xl`/`--radius-lg`, motion `framer-motion` sutil (fade + translateY), iconos `lucide-react`. Sin dependencias ni fuentes nuevas.
- `DashboardHeader` **no** se reescribe: se le agrega `variant?: 'tactico' | 'apple'` (default `'tactico'`) — las ~100 páginas que lo usan quedan pixel-idénticas.
- La lógica de auth/2FA, redirect por rol (`obtenerHubRol`) y el gate `esAdmin` de `SspmGeneral` no se tocan; en login solo cambia CSS + literales de texto.

**Consecuencias**: Solo 2 superficies cambian de lenguaje visual; el resto del sistema queda intacto y a la espera de validar el piloto antes de decidir si se extiende. El código real divergió del plan en puntos menores documentados en el reporte de ejecución (p. ej. `.login-form` pasó a card glass para que los tokens tuvieran efecto; el "▚▚▚" parpadeante se eliminó para cumplir "sin parpadeos infinitos"). Revertir el piloto = quitar `variant="apple"` y los estilos de las 2 vistas.

## ADR-009: Migración UI Oficial + Despacho/911 a Apple-style (plan-refact-ui, 2026-08-06)

**Contexto**: Tras aprobar el piloto Apple-style (Login + Hub, ADR-008), el usuario confirmó que Apple-style es el **único lenguaje visual del sistema, sin excepción** (vía AskUserQuestion) y pidió migrar dos módulos completos: **Oficial** (app de campo, `app/oficial/` + `components/oficial/`) y **Despacho/911** (asignación de unidades, `app/agente_911/` + `app/agente_despacho/` + `components/911/`). `DESIGN.md` ya es la especificación visual completa (tipografía §3, componentes §4, materialidad §6, do's/don'ts §7), así que la migración es un restyle de JSX inline (41 archivos en 18 etapas), no un rediseño.

**Decisión**:
- Restyle de **solo el chrome visual** de los 41 archivos: tipografía `var(--apple-font-display)` sentence-case, radios de `DESIGN.md §6` (nunca sharp ≤4px), badges con pareja semántica `bg`+color fuerte, superficies glass en cards/paneles flotantes y planas en tablas/formularios/listas densas, `DashboardHeader` con `variant="apple"`.
- **No se tocó ninguna lógica de negocio**: mapas (`@react-google-maps/api`), GPS/geolocalización, polling (ContadorAsignaciones 30s, TablonDespacho/Bitacora911 20s, SeleccionarUnidadesModal 18s), stores Zustand (`useOficialFormStore`, `useRondinFormStore`), server actions/fetch. Se conservaron los `useEffect` de rumbo/geofence/recalculo en `NavegacionDespacho`, `fitBounds` y builders SVG de marcadores, y el cálculo de SLA/frescura.
- `SegmentControl` se restyleó en el lugar a pill (igual look que `SegmentPage` §4) pero **no se consolidó** con `SegmentPage` — refactor funcional fuera de alcance, queda anotado como pendiente.
- Sin dependencias ni fuentes nuevas (`@import` de Google Fonts que quedaba muerto en cada página migrada se eliminó en la misma etapa).
- El `@keyframes spin` del wrapper `agente_911/despacho/page.tsx` se conserva porque `DespachoForm` (spinner de carga) lo usa — se reemplazará por `animate-spin` de Tailwind en una limpieza futura.

**Consecuencias**: Oficial y Despacho/911 quedan visualmente alineados con Login + Hub. `DESIGN.md §10` movió estos archivos de "Pendiente de migrar" a "Ya migrado". Pendientes futuros: consolidar `SegmentControl` en `SegmentPage`, revisar `@keyframes spin`/`dqPulse` (shimmer de skeleton se conservó por ser feedback de carga), y migrar el resto de módulos (Fiscalía, Juzgado, Flota, catálogos, admin, KPI Incidencias completo).

## ADR-010: Fix de `PageHeader` compartido + patrón de card compacta "app nativa" para móvil (2026-08-06)

**Contexto**: Al pedir un rediseño de `/agente_despacho` optimizado para móvil (viewport de referencia: iPhone XR, 414×896, la app pasará a PWA), se detectó que `components/partials/PageHeader.tsx` — usado por ~100 vistas, incluidas las ya marcadas "Ya migrado" en ADR-009 — seguía renderizando tipografía táctica (`Barlow Condensed` 800 mayúsculas / `JetBrains Mono`) en vez del spec Apple-style que `DESIGN.md §4` ya documentaba. El componente quedó fuera de las 41 archivos restyleados en ADR-009 por ser compartido, no propio de un módulo. Se confirmó con el usuario (AskUserQuestion) corregirlo de forma global antes de continuar.

**Decisión**:
1. `PageHeader.tsx`: título/subtítulo/botones pasan a `var(--apple-font-display)`, sentence-case, pesos 600/500/600, radios `var(--radius-lg)` — igual que la tabla de `DESIGN.md §4`. El `marginBottom` del contenedor pasa de `32` fijo a `clamp(20px, 5vw, 32px)`, mismo patrón sin-hooks que ya usa `StepIndicator` para auto-reducirse en pantallas chicas sin media queries (el componente es server-safe, sin hooks). Cambio de solo tipografía/espaciado, sin tocar props ni comportamiento — se refleja en las ~100 vistas que lo usan.
2. `/agente_despacho`: además de heredar el fix de `PageHeader`, se le agregó tratamiento específico ≤720px vía CSS (clases locales en el `<style>` de la página, sin tocar `useResponsive` porque la página es server component): gap entre secciones 48px→20px, KPI "Resumen del día" con 3 columnas iguales sin wrap, y las cards `.card-911` pasan de tarjeta "hero" vertical (min-height 280, padding 32) a **fila compacta tipo lista nativa** (icono en chip 44×44 con fondo tintado del acento, título de una línea, línea de meta condensada reemplazando la descripción larga y el footer de stats, chevron a la derecha) — mismo patrón de icon-list-row de iOS/Android. Tablet/desktop no cambian: siguen usando la card hero original vía las mismas clases, solo redefinidas dentro del media query.
3. El objetivo de "quepa en la misma pantalla" en un viewport de 414×896 se resolvió con densidad (paddings/gaps/tipografía reducidos y layout de fila en vez de bloque), no con `overflow: hidden` ni recortando contenido funcional — todo el contenido y los links siguen presentes, solo más compactos o condensados en una meta-línea.

**Consecuencias**: Cualquier vista que use `<PageHeader>` ve su título pasar de mayúsculas tácticas a sentence-case Apple-style — es una corrección hacia el spec ya vigente en `DESIGN.md`, no una decisión visual nueva, pero es visible en ~100 páginas. El patrón de card compacta de `/agente_despacho` (icon-list-row en ≤720px con `.card-911`/`.card-911-meta`/`.card-911-chevron`) queda como referencia para compactar otras vistas hub cuando se pida lo mismo — no se generalizó a un componente reusable (`.card-o`) porque solo se pidió para esta vista.

## ADR-011: Bottom sheet nativo para `CampanillaNotificaciones` en móvil + fix de tipografía en `AlertaCriticaBanner`/`TogglePush` (2026-08-06)

**Contexto**: Siguiendo el pulido "app nativa" de ADR-010, se pidió aplicar el mismo criterio a la campana de notificaciones (`components/notificaciones/CampanillaNotificaciones.tsx`), montada en el header en ~100 vistas. En móvil el dropdown existente ya reposicionaba `left/right:12px` bajo el botón, pero seguía siendo un dropdown flotante — no el patrón que un usuario de iOS/Android espera para un listado de notificaciones. Se encontró además que dos piezas vecinas del mismo flujo — `AlertaCriticaBanner.tsx` (banner rojo fijo arriba) y `TogglePush.tsx` (ítem "activar notificaciones" dentro del dropdown) — seguían en tipografía táctica (JetBrains Mono/Inter mezcladas, radios sharp) igual que `PageHeader` en ADR-010, y que el banner no sumaba `env(safe-area-inset-top)` pese a ser `position:fixed; top:0` (quedaría bajo el notch en modo `standalone`). No hay en el repo un patrón de bottom sheet previo — el único modal existente (`SeleccionarUnidadesModal`) es un diálogo centrado con backdrop, igual en mobile y desktop.

**Decisión**:
1. `CampanillaNotificaciones.tsx`: en `esMovil` (`useResponsive()`, componente ya era cliente) el panel deja de ser dropdown top-anchored y pasa a **bottom sheet**: `position:fixed` a los 3 bordes inferiores, radios solo arriba, `maxHeight:82vh` con la lista interna en `flex:1;overflowY:auto` (header y footer del sheet quedan fijos), `paddingBottom:env(safe-area-inset-bottom)`, drag-handle decorativo, botón `X` explícito de cierre, backdrop semitransparente con blur ligero, animación `translateY(100%)→0` que respeta `prefers-reduced-motion`. Tablet/desktop conservan el dropdown flotante sin cambios — mismo bloque de JSX (header + lista + `TogglePush` + link "Ver todas"), solo se ramifica el `style` inline por `esMovil`, sin duplicar markup.
2. El botón de la campana pasa de `background:'#fff'` fijo a `transparent` con hover `#f1f5f9`/borde `#cbd5e1` — alinea con el resto de botones-ícono del header (`SignOutButton`), que ya seguían ese patrón.
3. `AlertaCriticaBanner.tsx` y `TogglePush.tsx`: mismo fix de ADR-010, tipografía a `var(--apple-font-display)` sentence-case y radios de `DESIGN.md §6`; el banner suma `paddingTop: calc(12px + env(safe-area-inset-top))`.
4. No se creó un componente `BottomSheet` genérico — se implementó inline en `CampanillaNotificaciones.tsx` (igual que el patrón "icon-list-row" de ADR-010, que tampoco se generalizó). `DESIGN.md §4`/`§8` documentan el patrón para que el próximo bottom sheet (perfil, filtros) lo replique en vez de partir de cero, y `Notificaciones.md` en la bóveda queda como referencia de implementación.

**Consecuencias**: El dropdown de notificaciones se ve y se comporta distinto solo en ≤720px; tablet/desktop quedan pixel-idénticos. El backdrop del sheet duplica (a propósito, por claridad de affordance) el cierre que ya cubría el listener global de `mousedown` fuera de `dropdownRef`/`botonRef`. Como el `AlertaCriticaBanner` y `CampanillaNotificaciones` son globales (montados en `DashboardHeader`/`app/layout.tsx`), este fix se ve en todo el sistema, no solo en Despacho/911.

## ADR-012: Micro-animaciones de acción (`:active`/press) en `/agente_despacho` — cierre del rediseño móvil (2026-08-06)

**Contexto**: Última etapa del rediseño móvil-nativo de `/agente_despacho` (ADR-010/011): agregar micro-animaciones a las acciones de la vista. Se analizó qué elementos de la página son realmente "acciones" (navegan o ejecutan algo) vs. informativos: las dos cards de navegación (`Reportes de Despacho`, `KPI Incidencias`) son las únicas acciones — el bloque KPI "Resumen del día" no es clicable, así que no se le agregó motion (agregar hover/press ahí sería un affordance falso).

**Decisión**:
1. Las cards `.card-911` ya tenían `:hover` (elevación + sombra); se agregó `:active` (press): `transform: scale(0.97)`, vuelve a la sombra base, transición corta `.12s` **declarada en la propia regla `:active`** — la vuelta a reposo hereda la `.3s` del elemento base, o sea baja rápido y sube suave. `:active` se declaró después de `:hover` en el CSS a propósito: mismo specificity, gana el último — así el `scale` del press sustituye limpiamente el `translateY` del hover en vez de intentar combinarlos.
2. El chevron de navegación (afordance ≤720px) se desliza `translateX(3px)` en hover/press — refuerza que la fila es tocable.
3. Se agregó el bloque `@media (prefers-reduced-motion: reduce)` que faltaba (el resto de transiciones `:hover` de esta vista tampoco lo tenían, pero no se tocaron por no ser parte de lo pedido) — desactiva el `transform`, deja el cambio de `box-shadow`/`border-color` como único feedback.
4. No se agregó motion de entrada a nivel página (fade/translateY al cargar la vista) — ya existe `components/PageTransition.tsx` montado globalmente y su futuro está marcado como "decisión pendiente, no tocar sin pedirlo explícitamente" (ver nota en `DESIGN.md §10`); una animación de entrada por página competiría con esa transición global.

**Consecuencias**: `DESIGN.md §1`, `§6` (nueva sección "Micro-animaciones de acción — hover + press") y `§7` documentan el patrón `:hover`+`:active` como el estándar del sistema para cards/botones interactivos, con el snippet de `prefers-reduced-motion` como referencia — próxima vista que reciba este tratamiento debe replicarlo, no inventar timing/valores nuevos. Con esto se da por cerrado el rediseño móvil-nativo de `/agente_despacho` (ADR-010, 011, 012).

## ADR-013: Tablet como dispositivo principal de Oficiales — qué del rediseño móvil se hereda y qué no (2026-08-06)

**Contexto**: Tras cerrar el rediseño móvil-nativo de `/agente_despacho` (ADR-010/011/012), se evaluó si conviene portar esos mismos ajustes de densidad a la vista de tablet (721-1200px), porque **Oficiales usa tablet como dispositivo principal**, no teléfono — a diferencia de Despacho, donde el móvil sí era el objetivo real. Consultado con el usuario (AskUserQuestion): viewport de referencia **iPad Air 820×1180 vertical**; decisión explícita de **mantener la card hero sin cambios** en vez de crear un tercer nivel de densidad entre móvil y desktop.

**Análisis**: se auditaron los media queries de `app/agente_despacho/page.tsx` (ADR-010/011/012) — los siete bloques `@media` de esa vista están escritos como `max-width: 720px`, ninguno se filtra a 820px, así que a día de hoy **tablet ya cae limpio en el mismo tratamiento que desktop** (cards hero, gap 48px, KPI sin wrap forzado) sin ningún ajuste adicional. Se hizo el cálculo de espacio a 820×1180 con `.pad-dashboard` (32px/48px en ese breakpoint) + `.cat-cards-grid` a 2 columnas: sobra espacio vertical y horizontal de sobra para el layout hero completo — no hay overflow ni necesidad de comprimir. Lo único que de verdad importa para un dispositivo táctil sin mouse (`:active`/press del §6 de `DESIGN.md`, `env(safe-area-inset-bottom)`, los fixes de tipografía de `PageHeader`/`CampanillaNotificaciones` de ADR-010/011) **nunca estuvo condicionado al breakpoint móvil** — ya aplicaba en tablet desde que se escribió.

**Decisión**: no se tocó código — el rediseño ya estaba correctamente aislado por breakpoint. Se documentó en `DESIGN.md §8` ("Tablet — dispositivo principal de Oficiales") el viewport de referencia y la regla explícita de **no crear una tercera densidad** entre móvil y desktop salvo que un caso concreto lo justifique, para que la próxima vez que se toque una vista de Oficiales no se asuma por default que "más compacto es mejor" — en tablet, con espacio de sobra, el criterio es el opuesto al de móvil.

**Consecuencias**: Sirve como plantilla de auditoría para el resto de vistas de Oficiales antes de cualquier trabajo de densidad — primero confirmar en qué breakpoint cae el dispositivo real del rol (`useResponsive()`/las reglas de §8), después decidir si aplica el tratamiento móvil, el de tablet-como-desktop, o algo intermedio, en vez de asumir.

## ADR-014: `DashboardFooter` a Apple-style + fix de pin-to-bottom sistema-wide (plan-footer-sistema, 2026-08-06)

**Contexto**: En `/agente_despacho` se diseñó un footer Apple-style inline (`.desp-footer`, aprobado por el usuario): tipografía `var(--apple-font-display)`, sentence-case, `border-top: 1px solid #e2e8f0`, `color: #94a3b8`, pegado al fondo vía `margin-top: auto`. El componente compartido `components/partials/Footer.tsx` (`DashboardFooter`, usado en **34 páginas**) seguía en el lenguaje táctico anterior (JetBrains Mono, mayúsculas, `letterSpacing: 0.18em`, punto decorativo `#3e5171`). Además se confirmó un bug real: `margin-top: auto` en `DashboardFooter` no pega el footer al fondo si la página no tiene la cadena flex completa (root `display:flex/flexDirection:column/minHeight:100vh` → wrapper de contenido `flex:1`) — patrón ya documentado en `DESIGN.md §8`.

**Decisión**:
1. `DashboardFooter` se restyleó replicando `.desp-footer` tal cual, con el responsive móvil (padding-top 16px / font-size 11px ≤720px) vía `<style>` embebido + clase CSS `.dash-footer` (componente servidor, sin hooks, mismo patrón que `agente_despacho`) y `padding-bottom: env(safe-area-inset-bottom)` **dentro del componente** — el blindaje de safe-area no depende de que cada una de las 34 páginas lo tenga en su root.
2. Fix mecánico de la cadena flex en las páginas que la tenían rota: se auditaron las 34 (Grupo A: confirmar contra el archivo real; Grupo B: reemplazar el workaround `<div style={{marginTop:40}}><DashboardFooter/></div>` por `<DashboardFooter />` directo; Grupo C: sin mitigación previa; caso especial `admin/roles/agregar`). 4 páginas del Grupo A (`analisis/page.tsx`, `analisis/formulario-ingreso/page.tsx`) resultaron **no** tener la cadena completa pese a la clasificación previa del grep y se corrigieron; el resto ya estaban correctas.
3. **Cero cambios de props/API de `DashboardFooter`** (sin sufijo de módulo tipo `· Despacho`), cero cambios de lógica de negocio en ninguna página. Solo estilo + el fix mecánico del layout.
4. `app/agente_despacho/page.tsx` **no se tocó** — su `.desp-footer` inline queda aprobado; la duplicación (dos implementaciones visualmente iguales, una inline y una en componente) se anota como limpieza futura.
5. `app/admin/roles/agregar/page.tsx` recibió **solo** el fix mínimo de posicionamiento del footer (`display:flex/flexDirection:column` en el `<main>` root + `flex:1` en el div interno). Su deuda de lenguaje visual anterior (Google Fonts muertas, sin `DashboardHeader`, `maxWidth` fijo que viola `DESIGN.md §5`) queda anotada como pendiente, fuera de alcance.

**Consecuencias**: Las 34 páginas que usan `DashboardFooter` quedan visualmente alineadas con `/agente_despacho` y con footer pegado al fondo con contenido corto (flujo normal con contenido largo). `DESIGN.md §4` ahora documenta `DashboardFooter` como componente REGLA y `§10` movió estas páginas a Apple-style donde aplica. Deuda detectada y no resuelta (anotada para planes futuros): `maxWidth: '1400px'` inline en `analisis/iph` y `analisis/pendiente-analisis` (contradice `DESIGN.md §5`), el `maxWidth: '1200px'` y el lenguaje táctico completo de `admin/roles/agregar`, y consolidar `.desp-footer` de `agente_despacho` con el componente compartido.
