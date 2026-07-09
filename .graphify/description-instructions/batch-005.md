# Node Description Batch 6 of 79

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

- "reportes_formato_n_atencion_victimas_service": "formato-n-atencion-victimas-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "reportes_formato_n_fgr_service": "formato-n-fgr-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "reportes_formato_n_medios_alternativos_service": "formato-n-medios-alternativos-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "analisis_tablonanalisis": "TablonAnalisis.tsx" | kind=code-symbol | source=components/analisis/TablonAnalisis.tsx:L1 | neighbors=[btnStyle, containerStyle, headerRowStyle, loadingStyle, pageButtonStyle, paginationContainerStyle] | lang=en
- "auxiliar_repository": "repository.ts" | kind=code-symbol | source=lib/auxiliar/repository.ts:L1 | neighbors=[mapper.ts, rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), obtenerCuestionariosRobo(), obtenerParesReporte()] | lang=en
- "components_seccionliberacion": "SeccionLiberacion.tsx" | kind=code-symbol | source=features/via/infracciones/components/SeccionLiberacion.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, DocConfig, DOCS_ACCIDENTE] | lang=en
- "flota_service": "service.ts" | kind=code-symbol | source=lib/flota/service.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, page.tsx, repository.ts] | lang=en
- "infracciones_service": "service.ts" | kind=code-symbol | source=features/via/infracciones/service.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "subir_foto_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/subir-foto/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 672bab5 libearciones para juzgado, 77ddf58 Merge branch 'feature/testing' …, ad3ec5f mejorando esto] | lang=en
- "subir_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/evidencias/subir/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "admin_transito_actions": "actions.ts" | kind=code-symbol | source=lib/admin-transito/actions.ts:L1 | neighbors=[actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista(), obtenerOficialPorId()] | lang=en
- "agente_juzgado_juzgadodashboard": "JuzgadoDashboard.tsx" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L1 | neighbors=[actions.ts, obtenerDetalleInfraccionViaActionJuzgad…, BotonVerDetalle.tsx, BotonVerDetalle(), CargarOficioSection.tsx, ConfirmacionModal.tsx] | lang=en
- "agente_juzgado_tabsolicitudes": "TabSolicitudes.tsx" | kind=code-symbol | source=components/agente_juzgado/TabSolicitudes.tsx:L1 | neighbors=[actions.ts, accionPedirEvidencias(), parseEvidencias(), Props, Tab, tabs] | lang=en
- "ciudadano_formulario911": "Formulario911.tsx" | kind=code-symbol | source=app/911/ciudadano/Formulario911.tsx:L1 | neighbors=[Formulario911(), libraries, actions.ts, createIncidente(), page.tsx, 0844e6e Corregido] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@92393e79eeb8bd73e39875946addf69135d1e790": "92393e7 flujo completado de juzgado" | kind=Commit | source=git | neighbors=[actions.ts, CapturarDetallesForm.tsx, DetallesAseguradoView.tsx, mapper.ts, repository.ts, service.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@93dd3eacbbe61c248cb181e56601565285e2e91d": "93dd3ea Merge pull request #1 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[458bbfb registro de reporte de campo - …, 917002a Guardado de policia a cargo, conexion, testing, aaddee5 Merge branch 'feature/testing' …, ecebe38 Guardado de longitud y latitud …] | lang=en
- "components_revisiondocumentossection": "RevisionDocumentosSection.tsx" | kind=code-symbol | source=features/liberaciones/components/RevisionDocumentosSection.tsx:L1 | neighbors=[LiberacionesDashboard.tsx, 0b210fa Merge pull request #12 from pre…, 16a63d4 Merge branch 'feature/testing' …, 1acddac Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 4400923 Merge branch 'feature/testing' …] | lang=en
- "fiscalia_tabsolicitudes": "TabSolicitudes.tsx" | kind=code-symbol | source=components/fiscalia/TabSolicitudes.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, 997ef65 Merge pull request #2 from pres…, a291695 Merge branch 'feature/testing' …] | lang=en
- "lib_error_handler": "error-handler.ts" | kind=code-symbol | source=lib/error-handler.ts:L1 | neighbors=[actions.ts, actions.ts, c27a9ee fase prefinal, actions.ts, ActionResult, apiError()] | lang=en
- "liberaciones_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/liberaciones/page.tsx:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 75e03e9 puliendo flujo de juzgado-liber…, 953d38a implementando vista de fiscalia, ff3622b Merge pull request #11 from pre…, ff6d3c2 juzgado] | lang=en
- "roles_route": "route.ts" | kind=code-symbol | source=app/api/admin/roles/route.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 27dcb21 Merge branch 'feature/testing' …, 356d3a7 Subir rol agregado, falta darle…, 44a01c3 fase 3-4-5, 44ebbc4 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed] | lang=en
- "steps_secciongarantia": "SeccionGarantia.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionGarantia.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "steps_seccionmotivo": "SeccionMotivo.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionMotivo.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoInfraccion.tsx, actions.ts] | lang=en
- "subir_archivo_route": "route.ts" | kind=code-symbol | source=app/api/via/ciudadano/subir-archivo/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 16df128 flujo de corralones listo, 1dbd480 flujo de liberaciones completado, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto] | lang=en
- "911_repository": "repository.ts" | kind=code-symbol | source=lib/911/repository.ts:L1 | neighbors=[mapper.ts, rowToCatalogo(), rowToIncidenteDetalle(), listarIncidentes(), listarIncidentesRecientes(), obtenerCatalogos()] | lang=en
- "auxiliar_page": "page.tsx" | kind=code-symbol | source=app/auxiliar/page.tsx:L1 | neighbors=[helpers.ts, getUserWithRole(), AuxiliarPage(), ProfileDropdownAuxiliar.tsx, ProfileDropdownAuxiliar(), auth.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5bbdda82b925bfbe59b7f8a59b0662a938d13f0e": "5bbdda8 Merge pull request #8 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[1265204 paginacion por tablas, conexion, testing, 6f8a089 Vista de estadisticos diarios, …, abrirDocumento.ts, actions.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@712c11643da54b46f9f1ab29c123432854a6a9dc": "712c116 Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[5ef7cf3 Agregar los campos faltantes, conexion, testing, 51e682b mejorando flujo de liberaciones, DescargaFilters.tsx, DescargaPagination.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@75ca4b2021613849ef0a98851f4236d15974d7f2": "75ca4b2 Merge pull request #9 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[conexion, testing, 388b997 Apartados para subir fotografia…, de5682f Merge pull request #10 from pre…, mailer.ts, server.ts] | lang=en
- "d1_repository": "repository.ts" | kind=code-symbol | source=lib/d1/repository.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 07543de Conexion de reportes con d1 y l…, 16a63d4 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, ac48eb1 Merge pull request #17 from pre…, ad3ec5f mejorando esto] | lang=en
- "editar_campo_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/editar-campo/route.ts:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 5ed311a Merge pull request #5 from pres…, 672bab5 libearciones para juzgado] | lang=en
- "enviar_foto_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/enviar-foto/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, 8e6c8c6 Apartado de reportes] | lang=en
- "formato_n_atencion_victimas_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-atencion-victimas/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_eventos_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-eventos/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fge_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-fge/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fgr_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-fgr/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_medios_alternativos_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-medios-alternativos/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_rnd_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formulario_ingreso_page": "page.tsx" | kind=code-symbol | source=app/analisis/formulario-ingreso/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 1e81ec8 Datos se autorellenan de denunc…, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "fuente_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-rnd/fuente/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en

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
