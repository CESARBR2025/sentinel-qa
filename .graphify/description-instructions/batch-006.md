# Node Description Batch 7 of 93

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

- "scripts_ab_test": "ab-test.mjs" | kind=code-symbol | source=scripts/ab-test.mjs:L1 | neighbors=[22bf125 Merge pull request #20 from pre…, 7a1ae94 911-rondin, 863c575 Merge pull request #24 from pre…, a, AGENTS_PATH, agentsSize] | lang=en
- "scripts_trace_server": "trace-server.mjs" | kind=code-symbol | source=scripts/trace-server.mjs:L1 | neighbors=[11ee4f2 mejorando flujo de 911, 22bf125 Merge pull request #20 from pre…, 3c12c41 cambios en flujo de 911-despacho, 863c575 Merge pull request #24 from pre…, __dirname, dirty] | lang=en
- "subir_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/evidencias/subir/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "911_repository": "repository.ts" | kind=code-symbol | source=lib/911/repository.ts:L1 | neighbors=[mapper.ts, rowToCatalogo(), rowToIncidenteDetalle(), contarPorEstatus(), listarIncidentes(), listarIncidentesRecientes()] | lang=en
- "agente_despacho_page": "page.tsx" | kind=code-symbol | source=app/agente_despacho/page.tsx:L1 | neighbors=[service.ts, getStats(), AgenteDespachoDashboardPage(), service.ts, verificarRolAgenteDespacho(), helpers.ts] | lang=en
- "agente_liberaciones_page": "page.tsx" | kind=code-symbol | source=app/agente_liberaciones/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardLiberaciones(), obtenerLiberaciones(), LiberacionesTable.tsx, LiberacionesDashboardPage(), helpers.ts] | lang=en
- "analisis_tablonanalisis": "TablonAnalisis.tsx" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L1 | neighbors=[btnStyle, containerStyle, headerRowStyle, loadingStyle, pageButtonStyle, paginationContainerStyle] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@435348e3012477655543c7931641d5046f6f947e": "435348e corrigiendo flujo de rondin" | kind=Commit | source=git | neighbors=[09a02d5 Fix Reporte Rondin, page.tsx, feature/testing, main, f0089cf Merge pull request #21 from pre…, DespachoForm.tsx] | lang=nl
- "completar_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/solicitudes/[id]/completar/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "components_seccionliberacion": "SeccionLiberacion.tsx" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "configuracion_page": "page.tsx" | kind=code-symbol | source=app/oficial/configuracion/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 16a63d4 Merge branch 'feature/testing' …, 3ec7484 Header y Footer Fix, 6adb8ad Correciones de versión y nombre, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "despacho_tablondespacho": "TablonDespacho.tsx" | kind=code-symbol | source=components/911/despacho/TablonDespacho.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 290d651 feat(despacho): flujo integral …, 435348e corrigiendo flujo de rondin, 511fea4 Modulo de despacho] | lang=en
- "monitorista_incidentes_camara_service": "incidentes-camara-service.ts" | kind=code-symbol | source=lib/monitorista/incidentes-camara-service.ts:L1 | neighbors=[50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 810844a Cambios en la estructura de los…, 863c575 Merge pull request #24 from pre…] | lang=en
- "reportes_formato_n_atencion_victimas_service": "formato-n-atencion-victimas-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "reportes_formato_n_fgr_service": "formato-n-fgr-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "reportes_formato_n_medios_alternativos_service": "formato-n-medios-alternativos-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "agente_infracciones_page": "page.tsx" | kind=code-symbol | source=app/agente_infracciones/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardInfracciones(), obtenerInfracciones(), InfraccionesTable.tsx, InfraccionesDashboardPage(), helpers.ts] | lang=en
- "agente_juzgado_juzgadodashboard": "JuzgadoDashboard.tsx" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L1 | neighbors=[actions.ts, obtenerDetalleInfraccionViaActionJuzgad…, BotonVerDetalle.tsx, BotonVerDetalle(), CargarOficioSection.tsx, ConfirmacionModal.tsx] | lang=en
- "agente_liberaciones_service": "service.ts" | kind=code-symbol | source=lib/agente_liberaciones/service.ts:L1 | neighbors=[actions.ts, mapper.ts, rowToLiberacion(), permisos.ts, tienePermiso(), repository.ts] | lang=en
- "auxiliar_repository": "repository.ts" | kind=code-symbol | source=lib/auxiliar/repository.ts:L1 | neighbors=[mapper.ts, rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), obtenerCuestionariosRobo(), obtenerParesReporte()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5bbdda82b925bfbe59b7f8a59b0662a938d13f0e": "5bbdda8 Merge pull request #8 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[1265204 paginacion por tablas, feature/testing, fix/subir-fotografias, main, 6f8a089 Vista de estadisticos diarios, …, abrirDocumento.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6feefe2a8d4977f5ea14360db1048683e0cd411d": "6feefe2 BackEnd completo para hacer la conección con la BD" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 4d4a9b7 formulario de notificaciones po…] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@75ca4b2021613849ef0a98851f4236d15974d7f2": "75ca4b2 Merge pull request #9 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[feature/testing, fix/subir-fotografias, main, 388b997 Apartados para subir fotografia…, de5682f Merge pull request #10 from pre…, mailer.ts] | lang=en
- "despacho_despachoform": "DespachoForm.tsx" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 435348e corrigiendo flujo de rondin, 511fea4 Modulo de despacho, 863c575 Merge pull request #24 from pre…, f0089cf Merge pull request #21 from pre…, f4cf76c Actualización Rondin] | lang=en
- "fiscalia_capturardetallesform": "CapturarDetallesForm.tsx" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L1 | neighbors=[1f7c0d7 Merge pull request #23 from pre…, 375d265 flujo de fiscalia, 5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…] | lang=en
- "formulario_ingreso_page": "page.tsx" | kind=code-symbol | source=app/analisis/formulario-ingreso/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 1e81ec8 Datos se autorellenan de denunc…, 27dcb21 Merge branch 'feature/testing' …, 3ec7484 Header y Footer Fix, 41ea169 Merge branch 'testing' into con…] | lang=en
- "guardar_docs_route": "route.ts" | kind=code-symbol | source=app/api/via/exp-digital/guardar-docs/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5618308 guardado e evidencias con ed, 863c575 Merge pull request #24 from pre…] | lang=en
- "imprimir_page": "page.tsx" | kind=code-symbol | source=app/prevencion/busquedas/[id]/imprimir/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 3ec7484 Header y Footer Fix, 514a705 refactorizacion sql, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 6adb8ad Correciones de versión y nombre] | lang=en
- "infracciones_service": "service.ts" | kind=code-symbol | source=features/via/infracciones/service.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "lib_error_handler": "error-handler.ts" | kind=code-symbol | source=lib/error-handler.ts:L1 | neighbors=[actions.ts, actions.ts, 863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, actions.ts, ActionResult] | lang=en
- "roles_route": "route.ts" | kind=code-symbol | source=app/api/admin/roles/route.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 27dcb21 Merge branch 'feature/testing' …, 356d3a7 Subir rol agregado, falta darle…, 3ec7484 Header y Footer Fix, 44a01c3 fase 3-4-5, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "scripts_session_checkpoint": "session-checkpoint.mjs" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 863c575 Merge pull request #24 from pre…, addDecision(), append(), args] | lang=en
- "admin_transito_actions": "actions.ts" | kind=code-symbol | source=lib/admin-transito/actions.ts:L1 | neighbors=[actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista(), obtenerOficialPorId()] | lang=en
- "agente_911_page": "page.tsx" | kind=code-symbol | source=app/agente_911/page.tsx:L1 | neighbors=[service.ts, getStats(), Agente911DashboardPage(), service.ts, verificarRolAgente911(), helpers.ts] | lang=en
- "agente_bitacorista_page": "page.tsx" | kind=code-symbol | source=app/agente_bitacorista/page.tsx:L1 | neighbors=[service.ts, getStats(), AgenteBitacoristaDashboardPage(), service.ts, verificarRolAgenteBitacorista(), helpers.ts] | lang=en
- "agente_juzgado_tabsolicitudes": "TabSolicitudes.tsx" | kind=code-symbol | source=components/agente_juzgado/TabSolicitudes.tsx:L1 | neighbors=[actions.ts, accionPedirEvidencias(), parseEvidencias(), Props, Tab, tabs] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@458bbfbbbb8506645773d87e6588d25115f17d1c": "458bbfb registro de reporte de campo - oficial" | kind=Commit | source=git | neighbors=[0fe445e vista de oficial, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@712c11643da54b46f9f1ab29c123432854a6a9dc": "712c116 Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[5ef7cf3 Agregar los campos faltantes, feature/testing, main, 51e682b mejorando flujo de liberaciones, DescargaFilters.tsx, DescargaPagination.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ff6d3c2eb2a562855f19a14395c044964623a263": "ff6d3c2 juzgado" | kind=Commit | source=git | neighbors=[5f13b34 Merge branch 'feature/testing' …, feature/testing, fix/subir-fotografias, main, 5bbdda8 Merge pull request #8 from pres…, abrirDocumento.ts] | lang=en
- "components_revisiondocumentossection": "RevisionDocumentosSection.tsx" | kind=code-symbol | source=features/liberaciones/components/RevisionDocumentosSection.tsx:L1 | neighbors=[LiberacionesDashboard.tsx, 0b210fa Merge pull request #12 from pre…, 16a63d4 Merge branch 'feature/testing' …, 1acddac Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 4400923 Merge branch 'feature/testing' …] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-006.json

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
