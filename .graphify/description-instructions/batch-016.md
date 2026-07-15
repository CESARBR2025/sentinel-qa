# Node Description Batch 17 of 93

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
Write every description in Dutch (nl). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "expediente_proxy_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/expediente-proxy/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 75e03e9 puliendo flujo de juzgado-liber…, 863c575 Merge pull request #24 from pre…, da33516 Merge pull request #3 from pres…]
- "fiscalia_fiscaliatable": "FiscaliaTable.tsx" | kind=code-symbol | source=components/fiscalia/FiscaliaTable.tsx:L1 | neighbors=[5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 863c575 Merge pull request #24 from pre…, 953d38a implementando vista de fiscalia, ff6d3c2 juzgado, FiscaliaDashboard.tsx]
- "formato_n_consolidado_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-consolidado/route.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, a2e0623 Consolidado de formatos N y Sub…, f5fac0b Merge branch 'testing' into con…, POST(), auth.ts, auth]
- "incidentes_tablaincidentes": "TablaIncidentes.tsx" | kind=code-symbol | source=components/reportes/incidentes/TablaIncidentes.tsx:L1 | neighbors=[2fcba7b vista de reportes de incidentes…, 552d291 Merge branch 'testing' into con…, 719b5ab cambio para generacion de repor…, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …, styles.ts]
- "legalidad_actions": "actions.ts" | kind=code-symbol | source=features/via/legalidad/actions.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx]
- "legalidad_mapper": "mapper.ts" | kind=code-symbol | source=features/via/legalidad/mapper.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, ArticulosMapper]
- "lib_error_handler_notfounderror": "NotFoundError" | kind=code-symbol | source=lib/error-handler.ts:L12 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, AppError, .constructor()]
- "lib_error_handler_validationerror": "ValidationError" | kind=code-symbol | source=lib/error-handler.ts:L18 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, AppError, .constructor()]
- "login_desing_design_canvas": "design-canvas.jsx" | kind=code-symbol | source=login-desing/design-canvas.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, DC, DCArtboard(), DCArtboardFrame(), DCCtx, DCEditable()]
- "login_desing_login_app": "login-app.jsx" | kind=code-symbol | source=login-desing/login-app.jsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, 6a042cd feat: sistema de autenticación,…, App(), IconArrow(), IconCheck(), IconLock()]
- "modulo_incidentes_reportestabs": "ReportesTabs.tsx" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportesTabs.tsx:L1 | neighbors=[24626eb se agregan opciones de reportes, 863c575 Merge pull request #24 from pre…, b170599 Merge branch 'feature/testing' …, bd1a223 Merge branch 'feature/vistas-re…, bf2e7ed Reportes del modulo de incident…, page.tsx]
- "modulo_incidentes_reportfilters": "ReportFilters.tsx" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportFilters.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, de14b62 Merge branch 'feature/reportes'…, e286619 Merge branch 'feature/testing' …]
- "monitorista_galeriaevidencias": "GaleriaEvidencias.tsx" | kind=code-symbol | source=components/monitorista/GaleriaEvidencias.tsx:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 863c575 Merge pull request #24 from pre…, da33516 Merge pull request #3 from pres…, page.tsx]
- "notificaciones_route": "route.ts" | kind=code-symbol | source=app/api/notificaciones/route.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, ffcea0c fase 1 completada, auth.ts, auth]
- "oficial_service_verificarroloficial": "verificarRolOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L79 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx]
- "oficiales_repository": "repository.ts" | kind=code-symbol | source=features/via/oficiales/repository.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, db.ts]
- "ordensalida_generarordensalida": "generarOrdenSalida.ts" | kind=code-symbol | source=lib/ordenSalida/generarOrdenSalida.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…, route.ts, drawWatermark()]
- "prevencion_actions_requireacceso": "requireAcceso()" | kind=code-symbol | source=lib/prevencion/actions.ts:L13 | neighbors=[actions.ts, addAutoridadMedida(), cancelarFicha(), createContestacion(), createFicha(), createMedida()]
- "prevencion_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/prevencion/mapper.ts:L3 | neighbors=[mapper.ts, rowToAutoridadAdicional(), rowToBusqueda(), rowToContestacion(), rowToFichaBusquedaDetalle(), rowToMedida()]
- "prevencion_solicitudc4form": "SolicitudC4Form.tsx" | kind=code-symbol | source=components/prevencion/SolicitudC4Form.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9faf222 Merge branch 'feature/testing' …]
- "reportes_form_styles_pagewrap": "pageWrap" | kind=code-symbol | source=components/reportes/form-styles.ts:L24 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx]
- "rol_servicios_layout": "layout.tsx" | kind=code-symbol | source=app/rol_servicios/layout.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…]
- "rondin_rondintabla": "RondinTabla.tsx" | kind=code-symbol | source=components/oficial/rondin/RondinTabla.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 435348e corrigiendo flujo de rondin, 863c575 Merge pull request #24 from pre…, f0089cf Merge pull request #21 from pre…, RondinPageClient.tsx, types.ts]
- "sasiete_mapper": "mapper.ts" | kind=code-symbol | source=features/via/saSiete/mapper.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapRowToOrdenPago()]
- "scripts_export_schema": "export-schema.mjs" | kind=code-symbol | source=scripts/export-schema.mjs:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 863c575 Merge pull request #24 from pre…, __dirname, getColumns(), getEnums()]
- "sin_robos_styles": "styles.ts" | kind=code-symbol | source=components/reportes/sin_robos/styles.ts:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, 863c575 Merge pull request #24 from pre…, e286619 Merge branch 'feature/testing' …]
- "steps_pasoconfirmacion": "PasoConfirmacion.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConfirmacion.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoConfirmacion()]
- "steps_pasoubicacionevidencias": "PasoUbicacionEvidencias.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoUbicacionEvidencias.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx]
- "templates_asignacion_fiscalia": "asignacion-fiscalia.ts" | kind=code-symbol | source=lib/emails/templates/asignacion-fiscalia.ts:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 75ca4b2 Merge pull request #9 from pres…, 863c575 Merge pull request #24 from pre…, 953d38a implementando vista de fiscalia, server.ts, EnviarCorreoAsignacionFiscaliaParams]
- "wireframes_shared": "shared.jsx" | kind=code-symbol | source=login-desing/wireframes/shared.jsx:L1 | neighbors=[6a042cd feat: sistema de autenticación,…, Arrow(), Corner(), DarkFrame(), GridBG(), InputField()]
- "agente_911_service": "service.ts" | kind=code-symbol | source=lib/agente_911/service.ts:L1 | neighbors=[page.tsx, permisos.ts, tieneAccesoSeccion(), verificarRolAgente911(), 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…]
- "agente_bitacorista_service": "service.ts" | kind=code-symbol | source=lib/agente_bitacorista/service.ts:L1 | neighbors=[page.tsx, verificarRolAgenteBitacorista(), permisos.ts, tienePermiso(), 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…]
- "agente_despacho_service": "service.ts" | kind=code-symbol | source=lib/agente_despacho/service.ts:L1 | neighbors=[page.tsx, permisos.ts, tieneAccesoSeccion(), verificarRolAgenteDespacho(), 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…]
- "agente_infracciones_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/agente_infracciones/ProfileDropdown.tsx:L1 | neighbors=[page.tsx, ProfileDropdown(), Props, auth-client.ts, authClient, 06c55f5 Merge branch 'feature/testing' …]
- "auxiliar_profiledropdownauxiliar": "ProfileDropdownAuxiliar.tsx" | kind=code-symbol | source=components/auxiliar/ProfileDropdownAuxiliar.tsx:L1 | neighbors=[page.tsx, ProfileDropdownAuxiliar(), Props, auth-client.ts, authClient, 0068216 Mejora de Dashboard, Login y tr…]
- "auxiliar_types": "types.ts" | kind=code-symbol | source=lib/auxiliar/types.ts:L1 | neighbors=[mapper.ts, repository.ts, service.ts, AuxChecklist, AuxCuestionarioRobo, AuxParReporte]
- "buscar_orden_route": "route.ts" | kind=code-symbol | source=app/api/via/sa7/buscar-orden/route.ts:L1 | neighbors=[GET(), auth.ts, auth, repository.ts, SA7Repository, 23b7312 Merge pull request #16 from pre…]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0caf5dd72e9d67acad76dd1b85267da65b6518c0": "0caf5dd Fixes" | kind=Commit | source=git | neighbors=[feature/testing, main, 0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, mapper.ts, repository.ts]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@11ee4f2b2cc1ba889f6389920403a97b2cd1c654": "11ee4f2 mejorando flujo de 911" | kind=Commit | source=git | neighbors=[feature/testing, main, 6c646af fix loader bug en login, extract-domain.mjs, load-context.mjs, trace-components.mjs]
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@19706150d0786c086d77d18ea69cb122db073a38": "1970615 vista de medidas" | kind=Commit | source=git | neighbors=[feature/testing, main, 3800cab formulario de nueva medida de p…, page.tsx, layout.tsx, MedidasFiltros.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-016.json

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
