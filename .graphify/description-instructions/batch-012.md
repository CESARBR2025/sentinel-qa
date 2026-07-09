# Node Description Batch 13 of 79

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

- "sasiete_types": "types.ts" | kind=code-symbol | source=features/via/saSiete/types.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapper.ts, repository.ts] | lang=en
- "steps_pasoinfraccion": "PasoInfraccion.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoInfraccion.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, PasoInfraccion()] | lang=en
- "steps_pasoubicacion": "PasoUbicacion.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacion.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, MapaDireccionRegistro.tsx, MapaDireccionRegistro()] | lang=en
- "via_pagos": "pagos.ts" | kind=code-symbol | source=lib/via/pagos.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ede5a1d eliminado referencias a via_pru…, route.ts, db.ts] | lang=en
- "wireframes_shared": "shared.jsx" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, Arrow(), Corner(), DarkFrame(), GridBG(), InputField()] | lang=en
- "admin_transito_patrullaselector": "PatrullaSelector.tsx" | kind=code-symbol | source=components/admin-transito/PatrullaSelector.tsx:L1 | neighbors=[NuevoOficialForm.tsx, PatrullaSelector(), Props, types.ts, PatrullaAsignacion, 16a63d4 Merge branch 'feature/testing' …] | lang=en
- "agente_infracciones_infraccionestable": "InfraccionesTable.tsx" | kind=code-symbol | source=components/agente_infracciones/InfraccionesTable.tsx:L1 | neighbors=[InfraccionesDashboard.tsx, columns, DataRow, InfraccionesTable(), InfraccionesTableProps, page.tsx] | lang=en
- "agente_infracciones_storecapturainfractor": "storeCapturaInfractor.ts" | kind=code-symbol | source=lib/agente_infracciones/storeCapturaInfractor.ts:L1 | neighbors=[CapturarDatosInfractorModal.tsx, CapturaInfractorActions, CapturaInfractorState, CapturaInfractorStore, initialState, useCapturaInfractorStore] | lang=en
- "camara_mapper": "mapper.ts" | kind=code-symbol | source=lib/camara/mapper.ts:L1 | neighbors=[rowToIncidenteCamara(), rowToTotalesCamara(), toNum(), toNumNullable(), toStr(), types.ts] | lang=en
- "camara_service": "service.ts" | kind=code-symbol | source=lib/camara/service.ts:L1 | neighbors=[repository.ts, obtenerIncidentesCamara(), obtenerTotalesCamara(), listarIncidentesCamara(), toStr(), 5618308 guardado e evidencias con ed] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@11e88171582a012ea2cb786bb80b8ec3072123c6": "11e8817 Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[conexion, testing, 821abe0 replicando flujo de fiscalia-> …, LoadingProvider.tsx, enable-2fa.tsx, module-cards.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@166a26b4031cf3f06e37d03445612176f0458ede": "166a26b Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[conexion, testing, Formulario911.tsx, 83f48a2 Merge branch 'feature/correccio…, c6cb029 Formulario editado, schema.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1e81ec820432148abb04683b00b2f357e5385177": "1e81ec8 Datos se autorellenan de denuncias y seccion de oficial" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, TablonAnalisis.tsx, conexion, testing, 77ddf58 Merge branch 'feature/testing' …, FormularioD1.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2ca9f50c34a034d79d53d0a1a8971bf85be26d26": "2ca9f50 Formulario sin backend" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, page.tsx, conexion, testing, 5f13b34 Merge branch 'feature/testing' …, useAnalistaForm.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2fcba7bd260cba70d92594ca197b78326d4b5de5": "2fcba7b vista de reportes de incidentes diarios y semanales" | kind=Commit | source=git | neighbors=[conexion, testing, 719b5ab cambio para generacion de repor…, FiltrosIncidencias.tsx, Paginacion.tsx, StatIncidencia.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6f8a0895ef63c7d0e87e580266dfb6599ff94c5e": "6f8a089 Vista de estadisticos diarios, semanales y mensuales" | kind=Commit | source=git | neighbors=[5bbdda8 Merge pull request #8 from pres…, conexion, testing, 953d38a implementando vista de fiscalia, 98e7e6e vista de reportes de d1, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@86e93197ed0a6a560d8b403e68ef1883ab444a4e": "86e9319 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[5e458d6 navegacion, page.tsx, conexion, testing, Formulario911.tsx, 356d3a7 Subir rol agregado, falta darle…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bf790a7531dfa12cf7c237625f9af6f0c2787860": "bf790a7 opcion booleana arreglada" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, conexion, testing, 9d67ddf Cambios de formulario analisis, FormularioD1.tsx, useAnalistaForm.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c4523aca7e1438c596b579690aa1366a0ae9ec33": "c4523ac tabla de fiscalia, evidencias funcional" | kind=Commit | source=git | neighbors=[c194e54 envio de solicitud de evidencia…, conexion, testing, 997ef65 Merge pull request #2 from pres…, a2145fb Merge branch 'testing' into juz…, actions.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f7573dd0e86dd7c4c5da20b2ea194db4d3ce5d73": "f7573dd Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[72e8913 cambio de diseño, ef9e0ea Formulario arreglado, conexion, testing, 7f3fe1a Formulariop de Rondines listo, …, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@fa9df15da4bab3feb96af888bfbbe33d5452b967": "fa9df15 Reporte de cámaras" | kind=Commit | source=git | neighbors=[06c55f5 Merge branch 'feature/testing' …, conexion, testing, repository.ts, service.ts, 9faf222 Merge branch 'feature/testing' …] | lang=nl
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
- "lib_error_handler_notfounderror": "NotFoundError" | kind=code-symbol | source=lib/error-handler.ts:L12 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, AppError, .constructor()] | lang=en
- "lib_error_handler_unauthorizederror": "UnauthorizedError" | kind=code-symbol | source=lib/error-handler.ts:L24 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, AppError, .constructor()] | lang=en
- "lib_error_handler_validationerror": "ValidationError" | kind=code-symbol | source=lib/error-handler.ts:L18 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, AppError, .constructor()] | lang=en
- "modulo_incidentes_reportestabs": "ReportesTabs.tsx" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportesTabs.tsx:L1 | neighbors=[24626eb se agregan opciones de reportes, b170599 Merge branch 'feature/testing' …, bd1a223 Merge branch 'feature/vistas-re…, bf2e7ed Reportes del modulo de incident…, page.tsx, ReportesTabs()] | lang=en
- "monitorista_galeriaevidencias": "GaleriaEvidencias.tsx" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, da33516 Merge pull request #3 from pres…, page.tsx, cardStyle] | lang=en
- "monitorista_tabladetenidos": "TablaDetenidos.tsx" | kind=code-symbol | source=components/monitorista/TablaDetenidos.tsx:L1 | neighbors=[5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes, ce84893 Merge branch 'feature/testing' …, btnDetalle, DetenidoRow] | lang=en
- "notificaciones_route": "route.ts" | kind=code-symbol | source=app/api/notificaciones/route.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, ad3ec5f mejorando esto, ffcea0c fase 1 completada, auth.ts, auth, checker.ts] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-012.json

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
