# Node Description Batch 3 of 79

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

- "oficial_actions": "actions.ts" | kind=code-symbol | source=lib/oficial/actions.ts:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 16a63d4 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 5f13b34 Merge branch 'feature/testing' …] | lang=en
- "analisis_formanalisis": "formAnalisis.tsx" | kind=code-symbol | source=components/analisis/formAnalisis.tsx:L1 | neighbors=[btnBackStyle, btnFinishStyle, btnGeoStyle, btnNextStyle, cardStyle, footerActions] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2e062304ce5eefae0e6963f20b03b7948764cfc": "a2e0623 Consolidado de formatos N y SubHeader, ajustes en servicios de reportes" | kind=Commit | source=git | neighbors=[page.tsx, conexion, testing, 16a63d4 Merge branch 'feature/testing' …, page.tsx, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b1705997d7fe67b40632f6213447975cc693a3b9": "b170599 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[5830570 Seccion de analista, uya con bd…, page.tsx, ProfileDropdownAuxiliar.tsx, conexion, testing, 24626eb se agregan opciones de reportes] | lang=en
- "incidentes_mapper": "mapper.ts" | kind=code-symbol | source=lib/incidentes/mapper.ts:L1 | neighbors=[ad3ec5f mejorando esto, rowToAlarmaEscolar(), rowToDespacho(), rowToDespachoElemento(), rowToDespachoUnidad(), rowToExtorsion()] | lang=en
- "monitorista_page": "page.tsx" | kind=code-symbol | source=app/monitorista/page.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…] | lang=en
- "admin_actions": "actions.ts" | kind=code-symbol | source=lib/admin/actions.ts:L1 | neighbors=[createUser(), requireAdmin(), updateUser(), repository.ts, actualizarUsuario(), asignarRolUsuario()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@fcb223f54e825c649bebacb56b7b0bba99e43045": "fcb223f merge de testing" | kind=Commit | source=git | neighbors=[1dbd480 flujo de liberaciones completado, a6b7556 Formulario se puso a prueba, se…, formAnalisis.tsx, generarPresentacion.tsx, page.tsx, TablonAnalisis.tsx] | lang=nl
- "monitorista_actions": "actions.ts" | kind=code-symbol | source=lib/monitorista/actions.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "radio_formsection": "FormSection.tsx" | kind=code-symbol | source=components/911/radio/FormSection.tsx:L1 | neighbors=[13f7f39 Reporte-incidentes, 14fd73a Update FormSection.tsx, 22b7b54 Merge branch 'feature/reportes'…, 305b0bd se quitan campos, 44ebbc4 Merge branch 'feature/testing' …, 4d4a9b7 formulario de notificaciones po…] | lang=en
- "incidentes_camaras_page": "page.tsx" | kind=code-symbol | source=app/incidentes_camaras/page.tsx:L1 | neighbors=[2516723 Modulo de permisos, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "oficial_formulariorecorrido": "FormularioRecorrido.tsx" | kind=code-symbol | source=components/oficial/FormularioRecorrido.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 0c31cc2 Merge branch 'testing' into juz…, 13f7f39 Reporte-incidentes, 16a63d4 Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "partials_header": "Header.tsx" | kind=code-symbol | source=components/partials/Header.tsx:L1 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, 2be4ca9 Cambio en header, 3b10d72 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6a042cd667d49fb424004538d0489dc9a7462329": "6a042cd feat: sistema de autenticación, dashboard y esquema de base de datos" | kind=Commit | source=git | neighbors=[page.tsx, route.ts, page.tsx, layout.tsx, main, 5558751 feat: módulo Prevención del Del…] | lang=nl
- "monitorista_permisos": "permisos.ts" | kind=code-symbol | source=lib/monitorista/permisos.ts:L1 | neighbors=[actions.ts, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, route.ts] | lang=en
- "oficial_mapper": "mapper.ts" | kind=code-symbol | source=lib/oficial/mapper.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 0c31cc2 Merge branch 'testing' into juz…, 16a63d4 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 5f13b34 Merge branch 'feature/testing' …] | lang=en
- "agente_liberaciones_repository": "repository.ts" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L1 | neighbors=[actualizarInfraccionEstatus(), actualizarInfractor(), actualizarRevisionDocumento(), actualizarSolicitudEstatus(), insertarOrdenPago(), obtenerConceptoPorFraccion()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0b210fa6152f4caa2943cf28b5e12d813c87664c": "0b210fa Merge pull request #12 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[actions.ts, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx, LiberacionesTable.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@dc063f37c7d04fa2a7c98be48e93ed98a58c35b5": "dc063f3 gestion de oficiales correctamente" | kind=Commit | source=git | neighbors=[91c36bf validando orden de pago, actions.ts, layout.tsx, ModalDestituirOficial.tsx, ModalReactivarOficial.tsx, NuevoOficialForm.tsx] | lang=nl
- "components_formularioinfraccion": "FormularioInfraccion.tsx" | kind=code-symbol | source=features/via/oficiales/components/FormularioInfraccion.tsx:L1 | neighbors=[page.tsx, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "medidas_page": "page.tsx" | kind=code-symbol | source=app/prevencion/medidas/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 1970615 vista de medidas, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql] | lang=en
- "registrar_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/registrar/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2ca9f50 Formulario sin backend, 44a01c3 fase 3-4-5] | lang=en
- "911_page": "page.tsx" | kind=code-symbol | source=app/911/page.tsx:L1 | neighbors=[ModuleCard.tsx, ModuleCard(), SeleccionAtencionPage(), permisos.ts, tieneAccesoHub(), service.ts] | lang=en
- "admin_transito_repository": "repository.ts" | kind=code-symbol | source=lib/admin-transito/repository.ts:L1 | neighbors=[mapper.ts, rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), actualizarOficialRecord(), actualizarUserInfo()] | lang=en
- "analisis_generarpresentacion": "generarPresentacion.tsx" | kind=code-symbol | source=components/analisis/generarPresentacion.tsx:L1 | neighbors=[btnBackStyle, btnFinishStyle, btnNextStyle, cardStyle, labelStyle, mapBoxStyle] | lang=en
- "auxiliar_actions": "actions.ts" | kind=code-symbol | source=lib/auxiliar/actions.ts:L1 | neighbors=[helpers.ts, getUserWithRole(), bool(), requireAuxiliar(), str(), upsertChecklistAction()] | lang=en
- "incidentes_camara_page": "page.tsx" | kind=code-symbol | source=app/monitorista/incidentes-camara/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …] | lang=en
- "incidentes_permisos": "permisos.ts" | kind=code-symbol | source=lib/incidentes/permisos.ts:L1 | neighbors=[route.ts, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, route.ts] | lang=en
- "oficial_store": "store.ts" | kind=code-symbol | source=lib/oficial/store.ts:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 552d291 Merge branch 'testing' into con…] | lang=en
- "reportes_formato_n_consolidado_service": "formato-n-consolidado-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-consolidado-service.ts:L1 | neighbors=[a2e0623 Consolidado de formatos N y Sub…, f5fac0b Merge branch 'testing' into con…, route.ts, formato-n-armas-aseguradas-service.ts, FormatoNArmaAsegurada, obtenerArmasAseguradasPorFecha()] | lang=en
- "reportes_formato_n_fge_service": "formato-n-fge-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L1 | neighbors=[route.ts, 06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "rol_servicios_mapper": "mapper.ts" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L1 | neighbors=[c27a9ee fase prefinal, rowToBodyCam(), rowToEstadoFuerzaConcepto(), rowToMedioCanalizacion(), rowToRadio(), rowToRolAsignacion()] | lang=en
- "solicitudes_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/solicitudes/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed] | lang=en
- "admin_repository": "repository.ts" | kind=code-symbol | source=lib/admin/repository.ts:L1 | neighbors=[actions.ts, mapper.ts, rowToRol(), rowToUsuarioLista(), actualizarUsuario(), asignarRolUsuario()] | lang=en
- "auth_helpers": "helpers.ts" | kind=code-symbol | source=lib/auth/helpers.ts:L1 | neighbors=[actions.ts, layout.tsx, layout.tsx, getUserWithRole(), rowToUserWithRole(), UserWithRole] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2dde72009bc9dbe13a6a3886ce1bee73887356d5": "2dde720 Merge pull request #14 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[22b7b54 Merge branch 'feature/reportes'…, actions.ts, CapturarDatosInfractorModal.tsx, InfraccionesDashboard.tsx, InfraccionesTable.tsx, mapper.ts] | lang=en
- "dashboard_module_cards": "module-cards.tsx" | kind=code-symbol | source=app/dashboard/module-cards.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 11e8817 Merge branch 'testing' into juz…, 126b4d1 Monitorista V1, 283f342 Merge branch 'feature/testing' …, 28da720 Cambio de colores en dashboard …] | lang=en
- "estadisticos_page": "page.tsx" | kind=code-symbol | source=app/estadisticos/page.tsx:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 2516723 Modulo de permisos, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql, 552d291 Merge branch 'testing' into con…, 6f8a089 Vista de estadisticos diarios, …] | lang=en
- "oficial_page": "page.tsx" | kind=code-symbol | source=app/oficial/page.tsx:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 0fe445e vista de oficial, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@672bab5a15c2d12a174d78669bc3766bda96d83c": "672bab5 libearciones para juzgado" | kind=Commit | source=git | neighbors=[page.tsx, SubirFotoDetenido.tsx, conexion, testing, 46f24f8 generica function for infractio…, ff3622b Merge pull request #11 from pre…] | lang=en

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
