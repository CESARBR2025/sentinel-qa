# Node Description Batch 16 of 87

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
For a code symbol (kind=code-symbol — a function, class, or constant),
describe what the function/symbol does based on its name, source location
and neighbors — e.g. "Resolves the configured ontology profile from graphify.yaml.".
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
LANGUAGE: each entry has a `lang=` marker giving the language of its source.
Write that entry's description in EXACTLY that language. Do not translate to
a single common language — match each node's source language individually.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5d2b0640b03fd989c24c94e0bbbfe570c3ea2488": "5d2b064 fix vercel upload files" | kind=Commit | source=git | neighbors=[46f24f8 generica function for infractio…, actions.ts, LiberacionesDashboard.tsx, conexion, testing, da48f68 implementando flujo de aceptaci…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5e458d61c890c8a4a9e8a990e5b1cc6d10496867": "5e458d6 navegacion" | kind=Commit | source=git | neighbors=[conexion, testing, 86e9319 Merge branch 'feature/testing' …, c96893e Merge branch 'feature/correccio…, feature/monitorista, feature/monitorista-reportes] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6488a30d265406604e860f95a0a52143a16960c5": "6488a30 Formulario sin backend de 911 listo" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 283f342 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@77a125d75f6fc8bf59e520dfcdd575b65d0d1443": "77a125d Merge branch 'feature/monitorista-reportes' of https://github.com/presi…" | kind=Commit | source=git | neighbors=[5d179c0 Apartado de reportes, conexion, testing, 5aa5866 Cambio de colores en interfaz d…, 8e6c8c6 Apartado de reportes, feature/monitorista-reportes] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8a59180baa7bce6e0d325fb3623bb7906d037f94": "8a59180 Form listo" | kind=Commit | source=git | neighbors=[conexion, testing, a291695 Merge branch 'feature/testing' …, FormularioD1.tsx, ec57fd2 Form actualizado, feature/monitorista-reportes] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9d67ddf4fb2eee14861eba2af608eb222dca0e86": "9d67ddf Cambios de formulario analisis" | kind=Commit | source=git | neighbors=[conexion, testing, 9550203 Cambios en presentacion, se gen…, BitacoraIPH.tsx, page.tsx, route.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a0ec8d2c2dfbfde9cb6ea5865a8732c2320f11aa": "a0ec8d2 topbar en 911" | kind=Commit | source=git | neighbors=[83f48a2 Merge branch 'feature/correccio…, conexion, testing, c96893e Merge branch 'feature/correccio…, feature/monitorista, feature/monitorista-reportes] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a21f03f66a00e3f050235aae575a0e6aa6375832": "a21f03f fix bugs reporte denuncia" | kind=Commit | source=git | neighbors=[conexion, testing, 9d803f2 fix api maps, MapaDireccionRegistro.tsx, MapSectionCiudadano.tsx, repository.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@aaab50d699cb73f927fb76c1cc49815d8080821b": "aaab50d Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publ…" | kind=Commit | source=git | neighbors=[2e36377 Eliminar tutoriales de flujo in…, 511fea4 Modulo de despacho, conexion, testing, 44ebbc4 Merge branch 'feature/testing' …, feature/monitorista-reportes] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ab3d8f668113174e104dae7ac21bde8f402d8626": "ab3d8f6 Formulario con stepper" | kind=Commit | source=git | neighbors=[a291695 Merge branch 'feature/testing' …, conexion, testing, 7c1d096 Merge branch 'feature/denuncias…, FormularioD1.tsx, feature/monitorista-reportes] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c69454373882f48c57032868e9293749ba7b70cc": "c694543 cambio dee estatus" | kind=Commit | source=git | neighbors=[519716a Formulario para registro de wha…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ec57fd24ed14fc4836f80d87af0f99fc2146ea9f": "ec57fd2 Form actualizado" | kind=Commit | source=git | neighbors=[69a557f CAMBIO CORREGIDO, conexion, testing, 8a59180 Form listo, FormularioD1.tsx, feature/monitorista-reportes] | lang=en
- "corralon_page": "page.tsx" | kind=code-symbol | source=app/corralon/page.tsx:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, actions.ts, obtenerDashboardCorralon(), obtenerSolicitudes(), module-card.tsx] | lang=en
- "d1_service": "service.ts" | kind=code-symbol | source=lib/d1/service.ts:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, page.tsx, repository.ts] | lang=en
- "deteccion_camara_reportfilters": "ReportFilters.tsx" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportFilters.tsx:L1 | neighbors=[5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, fa9df15 Reporte de cámaras] | lang=en
- "deteccion_camara_reporttables": "ReportTables.tsx" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportTables.tsx:L1 | neighbors=[5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…, bd1a223 Merge branch 'feature/vistas-re…, fa9df15 Reporte de cámaras] | lang=en
- "estadisticos_phonestatscards": "PhoneStatsCards.tsx" | kind=code-symbol | source=components/reportes/estadisticos/PhoneStatsCards.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 552d291 Merge branch 'testing' into con…, 6f8a089 Vista de estadisticos diarios, …, e286619 Merge branch 'feature/testing' …, page.tsx, ReportStat.tsx] | lang=en
- "expediente_proxy_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/expediente-proxy/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 75e03e9 puliendo flujo de juzgado-liber…, da33516 Merge pull request #3 from pres…, ff3622b Merge pull request #11 from pre…] | lang=en
- "fiscalia_fiscaliatable": "FiscaliaTable.tsx" | kind=code-symbol | source=components/fiscalia/FiscaliaTable.tsx:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, ff6d3c2 juzgado, FiscaliaDashboard.tsx, columns] | lang=en
- "formato_n_consolidado_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-consolidado/route.ts:L1 | neighbors=[a2e0623 Consolidado de formatos N y Sub…, f5fac0b Merge branch 'testing' into con…, POST(), auth.ts, auth, formato-n-consolidado-service.ts] | lang=en
- "incidentes_tablaincidentes": "TablaIncidentes.tsx" | kind=code-symbol | source=components/reportes/incidentes/TablaIncidentes.tsx:L1 | neighbors=[2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, 719b5ab cambio para generacion de repor…, e286619 Merge branch 'feature/testing' …, styles.ts, styles] | lang=en
- "legalidad_actions": "actions.ts" | kind=code-symbol | source=features/via/legalidad/actions.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, obtenerArticulosAction()] | lang=en
- "legalidad_mapper": "mapper.ts" | kind=code-symbol | source=features/via/legalidad/mapper.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, ArticulosMapper, QueryRow] | lang=en
- "lib_error_handler_forbiddenerror": "ForbiddenError" | kind=code-symbol | source=lib/error-handler.ts:L30 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, AppError, .constructor()] | lang=en
- "lib_error_handler_unauthorizederror": "UnauthorizedError" | kind=code-symbol | source=lib/error-handler.ts:L24 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, AppError, .constructor()] | lang=en
- "modulo_incidentes_reportestabs": "ReportesTabs.tsx" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportesTabs.tsx:L1 | neighbors=[24626eb se agregan opciones de reportes, b170599 Merge branch 'feature/testing' …, bd1a223 Merge branch 'feature/vistas-re…, bf2e7ed Reportes del modulo de incident…, page.tsx, ReportesTabs()] | lang=en
- "monitorista_galeriaevidencias": "GaleriaEvidencias.tsx" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, da33516 Merge pull request #3 from pres…, page.tsx, cardStyle] | lang=en
- "monitorista_tabladetenidos": "TablaDetenidos.tsx" | kind=code-symbol | source=components/monitorista/TablaDetenidos.tsx:L1 | neighbors=[5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes, ce84893 Merge branch 'feature/testing' …, btnDetalle, DetenidoRow] | lang=en
- "notificaciones_route": "route.ts" | kind=code-symbol | source=app/api/notificaciones/route.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, ad3ec5f mejorando esto, ffcea0c fase 1 completada, auth.ts, auth, checker.ts] | lang=en
- "oficial_mapaubicacion": "MapaUbicacion.tsx" | kind=code-symbol | source=components/oficial/MapaUbicacion.tsx:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 93dd3ea Merge pull request #1 from pres…, a291695 Merge branch 'feature/testing' …, aaddee5 Merge branch 'feature/testing' …] | lang=en
- "oficial_profiledropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=components/oficial/ProfileDropdown.tsx:L16 | neighbors=[layout.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "oficiales_repository": "repository.ts" | kind=code-symbol | source=features/via/oficiales/repository.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, db.ts, query()] | lang=en
- "ordensalida_generarordensalida": "generarOrdenSalida.ts" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, ac48eb1 Merge pull request #17 from pre…, route.ts, drawWatermark(), formatearFecha()] | lang=en
- "partials_footer_dashboardfooter": "DashboardFooter()" | kind=code-symbol | source=components/partials/Footer.tsx:L1 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "prevencion_permisos_tieneaccesoseccion": "tieneAccesoSeccion()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L29 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, actions.ts] | lang=en
- "prevencion_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L13 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "rol_servicios_catalogos_actions_togglecatalogo": "toggleCatalogo()" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L27 | neighbors=[catalogos-actions.ts, toggleBodyCam(), req(), requireAdmin(), toggleConcepto(), toggleMedioCanalizacion()] | lang=en
- "rol_servicios_layout": "layout.tsx" | kind=code-symbol | source=app/rol_servicios/layout.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…, helpers.ts] | lang=en
- "sasiete_mapper": "mapper.ts" | kind=code-symbol | source=features/via/saSiete/mapper.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapRowToOrdenPago(), OrdenPagoRow] | lang=en
- "sin_robos_paginacionsinrobos": "PaginacionSinRobos.tsx" | kind=code-symbol | source=components/reportes/sin_robos/PaginacionSinRobos.tsx:L1 | neighbors=[156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, e286619 Merge branch 'feature/testing' …, PaginacionSinRobos(), paginationButtonStyle] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-015.json

Keep each description factual and concise (one sentence). No markdown, no prose
outside the JSON object. It is acceptable to omit a node if context is
insufficient — but include every node you can ground confidently.

Example answer format:
```json
{
  "node_id_1": "Resolves the configured ontology profile from graphify.yaml.",
  "node_id_2": "Colonel James Barclay, an antagonist in The Crooked Man."
}
```
