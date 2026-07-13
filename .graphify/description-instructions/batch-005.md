# Node Description Batch 6 of 87

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

- "partials_header_dashboardheader": "DashboardHeader()" | kind=code-symbol | source=components/partials/Header.tsx:L17 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "reportes_formato_n_eventos_service": "formato-n-eventos-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-eventos-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, a2e0623 Consolidado de formatos N y Sub…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "reportes_formato_n_rnd_service": "formato-n-rnd-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-rnd-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, a2e0623 Consolidado de formatos N y Sub…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "agente_juzgado_mapper": "mapper.ts" | kind=code-symbol | source=lib/agente_juzgado/mapper.ts:L1 | neighbors=[bool(), num(), rowToInfraccionDetalle(), rowToSolicitud(), str(), types.ts] | lang=en
- "busquedas_page": "page.tsx" | kind=code-symbol | source=app/prevencion/busquedas/page.tsx:L1 | neighbors=[BusquedasPage(), TIPO_CFG, auth.ts, auth, permisos.ts, tieneAccesoSeccion()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2db162a35e85541990e7bebb64d390272cdcdd51": "2db162a flujo de asegurados" | kind=Commit | source=git | neighbors=[actions.ts, FormularioAseguradoJuzgado.tsx, page.tsx, repository.ts, service.ts, layout.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@91c36bfc0feedd37a66fb0c7e072f7f1c4cf67a0": "91c36bf validando orden de pago" | kind=Commit | source=git | neighbors=[2c128e5 test expediente vercel, conexion, testing, dc063f3 gestion de oficiales correctame…, route.ts, CapturarDatosTitularSection.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c471e9c8cb121c2df42cf794f92379e038368fb1": "c471e9c Merge pull request #15 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[2db162a flujo de asegurados, c1ed4c3 cambios en busquedas, actions.ts, FormularioAseguradoJuzgado.tsx, page.tsx, repository.ts] | lang=en
- "db_schema": "schema.ts" | kind=code-symbol | source=lib/db/schema.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 126b4d1 Monitorista V1, 166a26b Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 458bbfb registro de reporte de campo - …, 46b2c89 Merge branch 'testing' into juz…] | lang=en
- "flota_service": "service.ts" | kind=code-symbol | source=lib/flota/service.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, a21f03f fix bugs reporte denuncia, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, page.tsx] | lang=en
- "generar_ppt_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/generar-ppt/route.ts:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…] | lang=en
- "monitorista_denuncia_service": "denuncia-service.ts" | kind=code-symbol | source=lib/monitorista/denuncia-service.ts:L1 | neighbors=[126b4d1 Monitorista V1, 160d1e1 Monitorista V1.1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5f13b34 Merge branch 'feature/testing' …, 9ec6056 flujo de juzgado-monitorista co…] | lang=en
- "monitorista_detenido_service": "detenido-service.ts" | kind=code-symbol | source=lib/monitorista/detenido-service.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 11be750 Fase 1 de correccion - completa…, 16a63d4 Merge branch 'feature/testing' …, 23a3b9d Cambios en la estructura de los…, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…] | lang=en
- "notificaciones_actions": "actions.ts" | kind=code-symbol | source=lib/notificaciones/actions.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 11be750 Fase 1 de correccion - completa…, ad3ec5f mejorando esto, c27a9ee fase prefinal, auth.ts, auth] | lang=en
- "partials_subheader": "SubHeader.tsx" | kind=code-symbol | source=components/partials/SubHeader.tsx:L1 | neighbors=[a2e0623 Consolidado de formatos N y Sub…, f5fac0b Merge branch 'testing' into con…, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6feefe2a8d4977f5ea14360db1048683e0cd411d": "6feefe2 BackEnd completo para hacer la conección con la BD" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 4d4a9b7 formulario de notificaciones po…] | lang=es
- "completar_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/solicitudes/[id]/completar/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "completar_solicitud_route": "route.ts" | kind=code-symbol | source=app/api/via/ciudadano/completar-solicitud/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes] | lang=en
- "login_page": "page.tsx" | kind=code-symbol | source=app/(auth)/login/page.tsx:L1 | neighbors=[1acddac Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 5aa5866 Cambio de colores en interfaz d…, 5f13b34 Merge branch 'feature/testing' …, 6a042cd feat: sistema de autenticación,…] | lang=en
- "monitorista_incidentes_camara_service": "incidentes-camara-service.ts" | kind=code-symbol | source=lib/monitorista/incidentes-camara-service.ts:L1 | neighbors=[50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 810844a Cambios en la estructura de los…, 8e6c8c6 Apartado de reportes] | lang=en
- "reportes_formato_n_atencion_victimas_service": "formato-n-atencion-victimas-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "reportes_formato_n_fgr_service": "formato-n-fgr-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "reportes_formato_n_medios_alternativos_service": "formato-n-medios-alternativos-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "911_repository": "repository.ts" | kind=code-symbol | source=lib/911/repository.ts:L1 | neighbors=[mapper.ts, rowToCatalogo(), rowToIncidenteDetalle(), contarPorEstatus(), listarIncidentes(), listarIncidentesRecientes()] | lang=en
- "analisis_tablonanalisis": "TablonAnalisis.tsx" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L1 | neighbors=[btnStyle, containerStyle, headerRowStyle, loadingStyle, pageButtonStyle, paginationContainerStyle] | lang=en
- "auxiliar_repository": "repository.ts" | kind=code-symbol | source=lib/auxiliar/repository.ts:L1 | neighbors=[mapper.ts, rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), obtenerCuestionariosRobo(), obtenerParesReporte()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@458bbfbbbb8506645773d87e6588d25115f17d1c": "458bbfb registro de reporte de campo - oficial" | kind=Commit | source=git | neighbors=[0fe445e vista de oficial, conexion, testing, 93dd3ea Merge pull request #1 from pres…, schema.ts, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5bbdda82b925bfbe59b7f8a59b0662a938d13f0e": "5bbdda8 Merge pull request #8 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[1265204 paginacion por tablas, conexion, testing, 6f8a089 Vista de estadisticos diarios, …, abrirDocumento.ts, actions.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@75ca4b2021613849ef0a98851f4236d15974d7f2": "75ca4b2 Merge pull request #9 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[conexion, testing, 388b997 Apartados para subir fotografia…, de5682f Merge pull request #10 from pre…, mailer.ts, server.ts] | lang=en
- "components_seccionliberacion": "SeccionLiberacion.tsx" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, DocConfig, DOCS_ACCIDENTE] | lang=en
- "cuestionario_robo_page": "page.tsx" | kind=code-symbol | source=app/auxiliar/cuestionario-robo/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 27dcb21 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …] | lang=en
- "infracciones_service": "service.ts" | kind=code-symbol | source=features/via/infracciones/service.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "lib_error_handler": "error-handler.ts" | kind=code-symbol | source=lib/error-handler.ts:L1 | neighbors=[actions.ts, actions.ts, c27a9ee fase prefinal, actions.ts, ActionResult, apiError()] | lang=en
- "plugins_context_loader": "context-loader.js" | kind=code-symbol | source=.opencode/plugins/context-loader.js:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, BUDGET_WARN_MSG(), checkBudget(), checkpoint(), CHECKPOINT_SCRIPT, ContextLoaderPlugin()] | lang=en
- "subir_foto_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/subir-foto/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 672bab5 libearciones para juzgado, 77ddf58 Merge branch 'feature/testing' …, ad3ec5f mejorando esto] | lang=en
- "subir_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/evidencias/subir/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "admin_transito_actions": "actions.ts" | kind=code-symbol | source=lib/admin-transito/actions.ts:L1 | neighbors=[actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista(), obtenerOficialPorId()] | lang=en
- "agente_juzgado_juzgadodashboard": "JuzgadoDashboard.tsx" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L1 | neighbors=[actions.ts, obtenerDetalleInfraccionViaActionJuzgad…, BotonVerDetalle.tsx, BotonVerDetalle(), CargarOficioSection.tsx, ConfirmacionModal.tsx] | lang=en
- "agente_juzgado_tabsolicitudes": "TabSolicitudes.tsx" | kind=code-symbol | source=components/agente_juzgado/TabSolicitudes.tsx:L1 | neighbors=[actions.ts, accionPedirEvidencias(), parseEvidencias(), Props, Tab, tabs] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@712c11643da54b46f9f1ab29c123432854a6a9dc": "712c116 Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[5ef7cf3 Agregar los campos faltantes, conexion, testing, 51e682b mejorando flujo de liberaciones, DescargaFilters.tsx, DescargaPagination.tsx] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-005.json

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
