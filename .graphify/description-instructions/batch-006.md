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

- "ncoordinacion_page": "page.tsx" | kind=code-symbol | source=app/nCoordinacion/page.tsx:L1 | neighbors=[67b1cb7 ReporteWord, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, auth.ts, auth, actions.ts] | lang=en
- "reportes_formato_n_atencion_victimas_service": "formato-n-atencion-victimas-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-atencion-victimas-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "reportes_formato_n_fgr_service": "formato-n-fgr-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-fgr-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "reportes_formato_n_medios_alternativos_service": "formato-n-medios-alternativos-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-medios-alternativos-service.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "agente_juzgado_juzgadodashboard": "JuzgadoDashboard.tsx" | kind=code-symbol | source=components/agente_juzgado/JuzgadoDashboard.tsx:L1 | neighbors=[actions.ts, obtenerDetalleInfraccionViaActionJuzgad…, BotonVerDetalle.tsx, BotonVerDetalle(), CargarOficioSection.tsx, ConfirmacionModal.tsx] | lang=en
- "auxiliar_repository": "repository.ts" | kind=code-symbol | source=lib/auxiliar/repository.ts:L1 | neighbors=[mapper.ts, rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), obtenerCuestionariosRobo(), obtenerParesReporte()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5bbdda82b925bfbe59b7f8a59b0662a938d13f0e": "5bbdda8 Merge pull request #8 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[1265204 paginacion por tablas, feature/testing, fix/subir-fotografias, main, 6f8a089 Vista de estadisticos diarios, …, abrirDocumento.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6feefe2a8d4977f5ea14360db1048683e0cd411d": "6feefe2 BackEnd completo para hacer la conección con la BD" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 4d4a9b7 formulario de notificaciones po…] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@75ca4b2021613849ef0a98851f4236d15974d7f2": "75ca4b2 Merge pull request #9 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[feature/testing, fix/subir-fotografias, main, 388b997 Apartados para subir fotografia…, de5682f Merge pull request #10 from pre…, mailer.ts] | lang=en
- "despacho_despachoform": "DespachoForm.tsx" | kind=code-symbol | source=components/911/despacho/DespachoForm.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 435348e corrigiendo flujo de rondin, 511fea4 Modulo de despacho, 863c575 Merge pull request #24 from pre…, f0089cf Merge pull request #21 from pre…, f4cf76c Actualización Rondin] | lang=en
- "fiscalia_capturardetallesform": "CapturarDetallesForm.tsx" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L1 | neighbors=[1f7c0d7 Merge pull request #23 from pre…, 375d265 flujo de fiscalia, 5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…] | lang=en
- "infracciones_service": "service.ts" | kind=code-symbol | source=features/via/infracciones/service.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "lib_error_handler": "error-handler.ts" | kind=code-symbol | source=lib/error-handler.ts:L1 | neighbors=[actions.ts, actions.ts, 863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, actions.ts, ActionResult] | lang=en
- "liberaciones_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/liberaciones/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 75e03e9 puliendo flujo de juzgado-liber…, 863c575 Merge pull request #24 from pre…, 953d38a implementando vista de fiscalia] | lang=en
- "scripts_session_checkpoint": "session-checkpoint.mjs" | kind=code-symbol | source=scripts/session-checkpoint.mjs:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 863c575 Merge pull request #24 from pre…, addDecision(), append(), args] | lang=en
- "subir_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/evidencias/subir/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "admin_transito_actions": "actions.ts" | kind=code-symbol | source=lib/admin-transito/actions.ts:L1 | neighbors=[actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista(), obtenerOficialPorId()] | lang=en
- "agente_juzgado_tabsolicitudes": "TabSolicitudes.tsx" | kind=code-symbol | source=components/agente_juzgado/TabSolicitudes.tsx:L1 | neighbors=[actions.ts, accionPedirEvidencias(), parseEvidencias(), Props, Tab, tabs] | lang=en
- "checklist_page": "page.tsx" | kind=code-symbol | source=app/auxiliar/checklist/page.tsx:L1 | neighbors=[permisos.ts, tienePermiso(), service.ts, listarParesReporte(), ChecklistPage(), auth.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@458bbfbbbb8506645773d87e6588d25115f17d1c": "458bbfb registro de reporte de campo - oficial" | kind=Commit | source=git | neighbors=[0fe445e vista de oficial, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@712c11643da54b46f9f1ab29c123432854a6a9dc": "712c116 Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[5ef7cf3 Agregar los campos faltantes, feature/testing, main, 51e682b mejorando flujo de liberaciones, DescargaFilters.tsx, DescargaPagination.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ff6d3c2eb2a562855f19a14395c044964623a263": "ff6d3c2 juzgado" | kind=Commit | source=git | neighbors=[5f13b34 Merge branch 'feature/testing' …, feature/testing, fix/subir-fotografias, main, 5bbdda8 Merge pull request #8 from pres…, abrirDocumento.ts] | lang=en
- "components_revisiondocumentossection": "RevisionDocumentosSection.tsx" | kind=code-symbol | source=features/liberaciones/components/RevisionDocumentosSection.tsx:L1 | neighbors=[LiberacionesDashboard.tsx, 0b210fa Merge pull request #12 from pre…, 16a63d4 Merge branch 'feature/testing' …, 1acddac Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 4400923 Merge branch 'feature/testing' …] | lang=en
- "formulario_ingreso_page": "page.tsx" | kind=code-symbol | source=app/analisis/formulario-ingreso/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 1e81ec8 Datos se autorellenan de denunc…, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed] | lang=en
- "monitorista_cardenviofoto": "CardEnvioFoto.tsx" | kind=code-symbol | source=components/monitorista/CardEnvioFoto.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …] | lang=en
- "oficial_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/oficial/ProfileDropdown.tsx:L1 | neighbors=[layout.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "prevencion_layout": "layout.tsx" | kind=code-symbol | source=app/prevencion/layout.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 1970615 vista de medidas, 41ea169 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…] | lang=en
- "radio_formrondinescalado": "FormRondinEscalado.tsx" | kind=code-symbol | source=components/911/radio/FormRondinEscalado.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 290d651 feat(despacho): flujo integral …, 435348e corrigiendo flujo de rondin, 863c575 Merge pull request #24 from pre…, dd2f306 Fix Mapa, f0089cf Merge pull request #21 from pre…] | lang=en
- "roles_formulariorol": "FormularioRol.tsx" | kind=code-symbol | source=components/admin/roles/FormularioRol.tsx:L1 | neighbors=[page.tsx, 0068216 Mejora de Dashboard, Login y tr…, 0c31cc2 Merge branch 'testing' into juz…, 27dcb21 Merge branch 'feature/testing' …, 356d3a7 Subir rol agregado, falta darle…, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "roles_route": "route.ts" | kind=code-symbol | source=app/api/admin/roles/route.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 27dcb21 Merge branch 'feature/testing' …, 356d3a7 Subir rol agregado, falta darle…, 44a01c3 fase 3-4-5, 44ebbc4 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed] | lang=en
- "steps_secciongarantia": "SeccionGarantia.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionGarantia.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "steps_seccionmotivo": "SeccionMotivo.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/SeccionMotivo.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoInfraccion.tsx] | lang=en
- "subir_archivo_route": "route.ts" | kind=code-symbol | source=app/api/via/ciudadano/subir-archivo/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 16df128 flujo de corralones listo, 1dbd480 flujo de liberaciones completado, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "agente_infracciones_infraccionesdashboard": "InfraccionesDashboard.tsx" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L1 | neighbors=[CapturarDatosInfractorModal.tsx, AVATAR_COLORS, EstatusInfracciones, getBadge(), getInitials(), hashColor()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1dbd48080de3d32ae2a09478a517c513f919bd3c": "1dbd480 flujo de liberaciones completado" | kind=Commit | source=git | neighbors=[067c4de arreglando flujo de fiscalia  a…, actions.ts, feature/testing, main, fcb223f merge de testing, route.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@953d38a8785c865b6246509015755436900e1e6d": "953d38a implementando vista de fiscalia" | kind=Commit | source=git | neighbors=[6f8a089 Vista de estadisticos diarios, …, feature/testing, fix/subir-fotografias, main, 8095bdb limpiando .env, mailer.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bd1a2232feea618e2956a3d5c0db185515c3a304": "bd1a223 Merge branch 'feature/vistas-reportes' into feature/testing" | kind=Commit | source=git | neighbors=[5ed311a Merge pull request #5 from pres…, feature/testing, fix/subir-fotografias, main, 50101e2 Merge pull request #6 from pres…, ReportFilters.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ede5a1dba726d7f39d03c50b028d77f38cd165d0": "ede5a1d eliminado referencias a via_prueba" | kind=Commit | source=git | neighbors=[16df128 flujo de corralones listo, feature/testing, main, 11be750 Fase 1 de correccion - completa…, route.ts, repository.ts] | lang=pt
- "despacho_page": "page.tsx" | kind=code-symbol | source=app/agente_911/despacho/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 863c575 Merge pull request #24 from pre…, ac9ad49 Merge branch 'feature/testing' …, permisos.ts, obtenerRolNombre()] | lang=en
- "editar_campo_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/editar-campo/route.ts:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 5ed311a Merge pull request #5 from pres…, 672bab5 libearciones para juzgado] | lang=en

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
