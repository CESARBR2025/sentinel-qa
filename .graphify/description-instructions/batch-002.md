# Node Description Batch 3 of 87

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

- "reportes_operativos_service": "service.ts" | kind=code-symbol | source=lib/reportes-operativos/service.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 07543de Conexion de reportes con d1 y l…, 16a63d4 Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1acddacffcb1e329ce46331427b0b00ca45b65ec": "1acddac Merge branch 'feature/testing' into feature/reportes" | kind=Commit | source=git | neighbors=[07543de Conexion de reportes con d1 y l…, actions.ts, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx] | lang=en
- "detenidos_page": "page.tsx" | kind=code-symbol | source=app/monitorista/detenidos/page.tsx:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…] | lang=en
- "modulo_incidentes_page": "page.tsx" | kind=code-symbol | source=app/modulo_incidentes/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 2516723 Modulo de permisos, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 4400923 Merge branch 'feature/testing' …] | lang=en
- "oficial_formulariorecorrido": "FormularioRecorrido.tsx" | kind=code-symbol | source=components/oficial/FormularioRecorrido.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 16a63d4 Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…] | lang=en
- "agente_liberaciones_actions": "actions.ts" | kind=code-symbol | source=lib/agente_liberaciones/actions.ts:L1 | neighbors=[capturarInfractorAction(), finalizarRevisionAction(), generarOrdenPagoAction(), obtenerDashboardLiberaciones(), obtenerDetalleInfraccionLiberaciones(), obtenerDocumentosLiberacion()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4400923d4e9f8488412e5c6771f48e52f35aedb0": "4400923 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[actions.ts, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx, LiberacionesTable.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bb10dcd3ff729120c088bc0aade7a65f5c7e48f0": "bb10dcd Formatos V1" | kind=Commit | source=git | neighbors=[adf0c3d vista de busqueda y juridico, conexion, testing, route.ts, 06c55f5 Merge branch 'feature/testing' …, module-cards.tsx] | lang=en
- "shared_infracciones": "infracciones.ts" | kind=code-symbol | source=lib/shared/infracciones.ts:L1 | neighbors=[actions.ts, service.ts, types.ts, actions.ts, actions.ts, types.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6a042cd667d49fb424004538d0489dc9a7462329": "6a042cd feat: sistema de autenticación, dashboard y esquema de base de datos" | kind=Commit | source=git | neighbors=[page.tsx, route.ts, page.tsx, layout.tsx, main, 5558751 feat: módulo Prevención del Del…] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b1705997d7fe67b40632f6213447975cc693a3b9": "b170599 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[5830570 Seccion de analista, uya con bd…, page.tsx, ProfileDropdownAuxiliar.tsx, conexion, testing, 24626eb se agregan opciones de reportes] | lang=en
- "exportar_route": "route.ts" | kind=code-symbol | source=app/api/reportes-telefonicos/exportar/route.ts:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "incidentes_mapper": "mapper.ts" | kind=code-symbol | source=lib/incidentes/mapper.ts:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 290d651 feat(despacho): flujo integral …, ad3ec5f mejorando esto, rowToAlarmaEscolar(), rowToDespacho(), rowToDespachoElemento()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2e062304ce5eefae0e6963f20b03b7948764cfc": "a2e0623 Consolidado de formatos N y SubHeader, ajustes en servicios de reportes" | kind=Commit | source=git | neighbors=[page.tsx, conexion, testing, 16a63d4 Merge branch 'feature/testing' …, page.tsx, page.tsx] | lang=nl
- "incidentes_camaras_page": "page.tsx" | kind=code-symbol | source=app/incidentes_camaras/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 2516723 Modulo de permisos, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql] | lang=en
- "monitorista_mapper": "mapper.ts" | kind=code-symbol | source=lib/monitorista/mapper.ts:L1 | neighbors=[c27a9ee fase prefinal, bool(), num(), parseDetenidos(), parseSolicitudesJson(), parseTurno()] | lang=en
- "oficial_mapper": "mapper.ts" | kind=code-symbol | source=lib/oficial/mapper.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 16a63d4 Merge branch 'feature/testing' …, 290d651 feat(despacho): flujo integral …, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "analisis_formanalisis": "formAnalisis.tsx" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L1 | neighbors=[btnBackStyle, btnFinishStyle, btnGeoStyle, btnNextStyle, cardStyle, footerActions] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@fcb223f54e825c649bebacb56b7b0bba99e43045": "fcb223f merge de testing" | kind=Commit | source=git | neighbors=[1dbd480 flujo de liberaciones completado, a6b7556 Formulario se puso a prueba, se…, formAnalisis.tsx, generarPresentacion.tsx, page.tsx, TablonAnalisis.tsx] | lang=nl
- "monitorista_page": "page.tsx" | kind=code-symbol | source=app/monitorista/page.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…] | lang=en
- "partials_header": "Header.tsx" | kind=code-symbol | source=components/partials/Header.tsx:L1 | neighbors=[page.tsx, page.tsx, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, ac9ad49 Merge branch 'feature/testing' …, b170599 Merge branch 'feature/testing' …] | lang=en
- "admin_actions": "actions.ts" | kind=code-symbol | source=lib/admin/actions.ts:L1 | neighbors=[createUser(), requireAdmin(), updateUser(), repository.ts, actualizarUsuario(), asignarRolUsuario()] | lang=en
- "estadisticos_page": "page.tsx" | kind=code-symbol | source=app/estadisticos/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 07543de Conexion de reportes con d1 y l…, 2516723 Modulo de permisos, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql] | lang=en
- "monitorista_actions": "actions.ts" | kind=code-symbol | source=lib/monitorista/actions.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "radio_formsection": "FormSection.tsx" | kind=code-symbol | source=components/911/radio/FormSection.tsx:L1 | neighbors=[13f7f39 Reporte-incidentes, 14fd73a Update FormSection.tsx, 22b7b54 Merge branch 'feature/reportes'…, 305b0bd se quitan campos, 44ebbc4 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…] | lang=en
- "auxiliar_actions": "actions.ts" | kind=code-symbol | source=lib/auxiliar/actions.ts:L1 | neighbors=[bool(), requireAuxiliar(), str(), upsertChecklistAction(), permisos.ts, Accion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@997ef65431c9b4b9f0c02b0b1479177244a4996d": "997ef65 Merge pull request #2 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts, service.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f80d33f79def9197aaad03aabc73ae30d089ff9f": "f80d33f Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[997ef65 Merge pull request #2 from pres…, a2907e2 Boton agregado para crear roles!, actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts] | lang=en
- "incidentes_permisos": "permisos.ts" | kind=code-symbol | source=lib/incidentes/permisos.ts:L1 | neighbors=[route.ts, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "incidentes_service": "service.ts" | kind=code-symbol | source=lib/incidentes/service.ts:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 290d651 feat(despacho): flujo integral …, 552d291 Merge branch 'testing' into con…, 5ef7cf3 Agregar los campos faltantes] | lang=en
- "monitorista_permisos": "permisos.ts" | kind=code-symbol | source=lib/monitorista/permisos.ts:L1 | neighbors=[actions.ts, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, route.ts] | lang=en
- "oficial_store": "store.ts" | kind=code-symbol | source=lib/oficial/store.ts:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …] | lang=en
- "ciudadano_page": "page.tsx" | kind=code-symbol | source=app/agente_911/ciudadano/page.tsx:L1 | neighbors=[permisos.ts, tieneAccesoSeccion(), service.ts, getCatalogos(), Formulario911.tsx, Ciudadano911Page()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0b210fa6152f4caa2943cf28b5e12d813c87664c": "0b210fa Merge pull request #12 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[actions.ts, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx, LiberacionesTable.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@dc063f37c7d04fa2a7c98be48e93ed98a58c35b5": "dc063f3 gestion de oficiales correctamente" | kind=Commit | source=git | neighbors=[91c36bf validando orden de pago, actions.ts, layout.tsx, ModalDestituirOficial.tsx, ModalReactivarOficial.tsx, NuevoOficialForm.tsx] | lang=nl
- "d1_noiniciada_page": "page.tsx" | kind=code-symbol | source=app/d1_noiniciada/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 22b7b54 Merge branch 'feature/reportes'…, 2516723 Modulo de permisos, 41ea169 Merge branch 'testing' into con…, 4c9fa8a vista de reporte de d1 no inici…] | lang=en
- "dashboard_module_cards": "module-cards.tsx" | kind=code-symbol | source=app/dashboard/module-cards.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 11e8817 Merge branch 'testing' into juz…, 126b4d1 Monitorista V1] | lang=en
- "sin_robos_page": "page.tsx" | kind=code-symbol | source=app/sin_robos/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 2516723 Modulo de permisos] | lang=en
- "agente_liberaciones_repository": "repository.ts" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L1 | neighbors=[actualizarInfraccionEstatus(), actualizarInfractor(), actualizarRevisionDocumento(), actualizarSolicitudEstatus(), insertarOrdenPago(), obtenerConceptoPorFraccion()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@090c4dd6c28d10a74ad8eec7001e6fa9a4b5e8b5": "090c4dd vista de fiscalia" | kind=Commit | source=git | neighbors=[actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts, service.ts, ToastExito.tsx] | lang=nl

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-002.json

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
