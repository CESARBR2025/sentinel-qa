# Node Description Batch 11 of 79

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

- "prevencion_permisos_verificaraccesoprevencionapi": "verificarAccesoPrevencionApi()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L50 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "prevencion_prevencionnav": "PrevencionNav.tsx" | kind=code-symbol | source=app/prevencion/PrevencionNav.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 1970615 vista de medidas, 41ea169 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 8355ac0 Merge branch 'feature/testing' …, layout.tsx] | lang=en
- "reportes_permisos_verificaraccesoformatonapi": "verificarAccesoFormatoNApi()" | kind=code-symbol | source=lib/reportes/permisos.ts:L36 | neighbors=[route.ts, route.ts, route.ts, route.ts, route.ts, route.ts] | lang=en
- "reportes_sin_d1_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-sin-d1/repository.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, db.ts] | lang=en
- "reportes_sin_d1_service": "service.ts" | kind=code-symbol | source=lib/reportes-sin-d1/service.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "reportes_sin_novedad_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/repository.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, db.ts] | lang=en
- "reportes_sin_novedad_service": "service.ts" | kind=code-symbol | source=lib/reportes-sin-novedad/service.ts:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, ad3ec5f mejorando esto, e286619 Merge branch 'feature/testing' …, route.ts] | lang=en
- "rol_servicios_servicetable": "ServiceTable.tsx" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L1 | neighbors=[b68a2b7 Merge branch 'feature/testing' …, c27a9ee fase prefinal, page.tsx, deviceBox, inputStyle, labelMono] | lang=en
- "stores_usetoaststore": "useToastStore.ts" | kind=code-symbol | source=stores/useToastStore.ts:L1 | neighbors=[0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 5d2b064 fix vercel upload files, e286619 Merge branch 'feature/testing' …, CapturarDatosTitularSection.tsx] | lang=en
- "ui_card": "Card.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/Card.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, page.tsx, PasoCiudadano.tsx] | lang=en
- "admin_layout": "layout.tsx" | kind=code-symbol | source=app/admin/layout.tsx:L1 | neighbors=[AdminLayout(), helpers.ts, getUserWithRole(), auth.ts, auth, 0e33bf6 feat: módulo Admin, Prórroga, F…] | lang=en
- "admin_transito_layout": "layout.tsx" | kind=code-symbol | source=app/admin-transito/layout.tsx:L1 | neighbors=[AdminTransitoLayout(), helpers.ts, getUserWithRole(), auth.ts, auth, ProfileDropdown.tsx] | lang=en
- "agente_infracciones_modalentregargarantia": "ModalEntregarGarantia.tsx" | kind=code-symbol | source=components/agente_infracciones/ModalEntregarGarantia.tsx:L1 | neighbors=[InfraccionesDashboard.tsx, actions.ts, liberarGarantiaInfraccionesAction(), obtenerDetalleInfraccionInfracciones(), getGarantiaInfo(), ModalEntregarGarantia()] | lang=en
- "agente_juzgado_cargaroficiosection": "CargarOficioSection.tsx" | kind=code-symbol | source=components/agente_juzgado/CargarOficioSection.tsx:L1 | neighbors=[actions.ts, guardarOficioJuzgadoAction(), Campo(), CargarOficioSection(), CargarOficioSectionProps, FileUpload()] | lang=en
- "agente_liberaciones_liberacionestable": "LiberacionesTable.tsx" | kind=code-symbol | source=components/agente_liberaciones/LiberacionesTable.tsx:L1 | neighbors=[LiberacionesDashboard.tsx, columns, DataRow, LiberacionesTable(), LiberacionesTableProps, page.tsx] | lang=en
- "agente_liberaciones_page": "page.tsx" | kind=code-symbol | source=app/agente_liberaciones/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardLiberaciones(), obtenerLiberaciones(), LiberacionesTable.tsx, LiberacionesDashboardPage(), ProfileDropdown.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@16df1286eab91ffb1ff2955737ba9e4abc42cd47": "16df128 flujo de corralones listo" | kind=Commit | source=git | neighbors=[conexion, ede5a1d eliminado referencias a via_pru…, actions.ts, page.tsx, repository.ts, service.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@58305708646ad2bbd09424e9572a88505eea3d89": "5830570 Seccion de analista, uya con bd y genera presentacion generica, no jala…" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, conexion, testing, b170599 Merge branch 'feature/testing' …, page.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9ec605647493f07c106fc892f96cd7940d488318": "9ec6056 flujo de juzgado-monitorista completo" | kind=Commit | source=git | neighbors=[821abe0 replicando flujo de fiscalia-> …, actions.ts, repository.ts, service.ts, TabSolicitudes.tsx, conexion] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2145fb21f4b9adae89074913aa8d4b7ec22d0d0": "a2145fb Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, page.tsx, Pagination.tsx, page.tsx, conexion, testing] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a6b7556e4d852eb3271e60ee87a5cc2814f2c870": "a6b7556 Formulario se puso a prueba, se prellena con datos de denuncia, campo e…" | kind=Commit | source=git | neighbors=[3249f00 Cambios en rellenado de ppt!, page.tsx, TablonAnalisis.tsx, conexion, testing, a2e0623 Consolidado de formatos N y Sub…] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@caef6e8dddc3704ff7381785115f3e7344376623": "caef6e8 Merge pull request #7 from presidenciaSJR/fix/incidentes-camara" | kind=Commit | source=git | neighbors=[50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, conexion, testing, b170599 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "components_buttonverdetalles": "ButtonVerDetalles.tsx" | kind=code-symbol | source=features/compartido/components/ButtonVerDetalles.tsx:L1 | neighbors=[InfraccionesDashboard.tsx, LiberacionesDashboard.tsx, 06c55f5 Merge branch 'feature/testing' …, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 2dde720 Merge pull request #14 from pre…] | lang=en
- "d1_noiniciada_descargafilters": "DescargaFilters.tsx" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaFilters.tsx:L1 | neighbors=[0c8695c Cambios en filtros, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 4c9fa8a vista de reporte de d1 no inici…, 552d291 Merge branch 'testing' into con…, 712c116 Merge branch 'testing' into con…] | lang=en
- "d1_noiniciada_descargatable": "DescargaTable.tsx" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaTable.tsx:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 4c9fa8a vista de reporte de d1 no inici…, 552d291 Merge branch 'testing' into con…, 712c116 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, e286619 Merge branch 'feature/testing' …] | lang=en
- "dashboard_enable_2fa": "enable-2fa.tsx" | kind=code-symbol | source=app/dashboard/enable-2fa.tsx:L1 | neighbors=[11e8817 Merge branch 'testing' into juz…, 28da720 Cambio de colores en dashboard …, 44ebbc4 Merge branch 'feature/testing' …, 6a042cd feat: sistema de autenticación,…, ce84893 Merge branch 'feature/testing' …, Card()] | lang=en
- "fiscalia_tabasegurados": "TabAsegurados.tsx" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L1 | neighbors=[page.tsx, 2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, Props] | lang=en
- "generar_orden_pago_route": "route.ts" | kind=code-symbol | source=app/api/via/sa7/generar-orden-pago/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "legalidad_service": "service.ts" | kind=code-symbol | source=features/via/legalidad/service.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, actions.ts, mapper.ts] | lang=en
- "lib_detenidos_compartido": "detenidos-compartido.ts" | kind=code-symbol | source=lib/detenidos-compartido.ts:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, page.tsx, page.tsx, db.ts] | lang=en
- "manual_migrations_0007_formato_n_split": "0007_formato_n_split.sql" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, formato_n_armas_aseguradas] | lang=en
- "oficiales_mapper": "mapper.ts" | kind=code-symbol | source=features/via/oficiales/mapper.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "partials_footer": "Footer.tsx" | kind=code-symbol | source=components/partials/Footer.tsx:L1 | neighbors=[page.tsx, page.tsx, page.tsx, 3b10d72 Merge branch 'feature/testing' …, 8303881 Subida de header y footer, falt…, page.tsx] | lang=en
- "prevencion_seguimientotimeline": "SeguimientoTimeline.tsx" | kind=code-symbol | source=components/prevencion/SeguimientoTimeline.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 5558751 feat: módulo Prevención del Del…, d3e6d95 Update SeguimientoTimeline.tsx, page.tsx, actions.ts, createSeguimiento()] | lang=en
- "prevencion_visitamodal": "VisitaModal.tsx" | kind=code-symbol | source=components/prevencion/VisitaModal.tsx:L1 | neighbors=[41ea169 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, baae82f diseño de medidas de proteccion, page.tsx] | lang=en
- "proxy_route": "route.ts" | kind=code-symbol | source=app/api/expediente/proxy/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 75e03e9 puliendo flujo de juzgado-liber…, 8e6c8c6 Apartado de reportes] | lang=en
- "reportes_operativos_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L7 | neighbors=[mapper.ts, rowToArma(), rowToCateo(), rowToDetencionInc(), rowToDetencionOfi(), rowToDroga()] | lang=en
- "revision_documental_page": "page.tsx" | kind=code-symbol | source=app/agente_liberaciones/revision-documental/page.tsx:L1 | neighbors=[0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…, e286619 Merge branch 'feature/testing' …, actions.ts] | lang=en
- "sasiete_service": "service.ts" | kind=code-symbol | source=features/via/saSiete/service.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapper.ts, mapRowToOrdenPago()] | lang=en
- "shared_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=lib/shared/abrirDocumento.ts:L1 | neighbors=[DetallesAseguradoView.tsx, 5f13b34 Merge branch 'feature/testing' …, 75e03e9 puliendo flujo de juzgado-liber…, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-010.json

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
