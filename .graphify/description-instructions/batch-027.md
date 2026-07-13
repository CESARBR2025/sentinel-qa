# Node Description Batch 28 of 87

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
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "agente_liberaciones_types_liberacionrow": "LiberacionRow" | kind=code-symbol | source=lib/agente_liberaciones/types.ts:L11 | neighbors=[mapper.ts, service.ts, types.ts]
- "app_page": "page.tsx" | kind=code-symbol | source=app/page.tsx:L1 | neighbors=[RootPage(), 6a042cd feat: sistema de autenticación,…, 90da1ca Initial commit from Create Next…]
- "auxiliar_actions_upsertchecklistaction": "upsertChecklistAction()" | kind=code-symbol | source=lib/auxiliar/actions.ts:L20 | neighbors=[actions.ts, requireAuxiliar(), page.tsx]
- "auxiliar_mapper_rowtocuestionariorobo": "rowToCuestionarioRobo()" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L66 | neighbors=[mapper.ts, toStr(), repository.ts]
- "auxiliar_permisos_tieneaccesoauxiliar": "tieneAccesoAuxiliar()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L29 | neighbors=[permisos.ts, tienePermiso(), verificarAccesoAuxiliarApi()]
- "auxiliar_service_listarcuestionariosrobo": "listarCuestionariosRobo()" | kind=code-symbol | source=lib/auxiliar/service.ts:L9 | neighbors=[service.ts, page.tsx, route.ts]
- "auxiliar_service_listarparesreporte": "listarParesReporte()" | kind=code-symbol | source=lib/auxiliar/service.ts:L5 | neighbors=[service.ts, page.tsx, page.tsx]
- "auxiliar_types_auxchecklist": "AuxChecklist" | kind=code-symbol | source=lib/auxiliar/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts]
- "auxiliar_types_auxcuestionariorobo": "AuxCuestionarioRobo" | kind=code-symbol | source=lib/auxiliar/types.ts:L36 | neighbors=[mapper.ts, repository.ts, types.ts]
- "auxiliar_types_auxparreporte": "AuxParReporte" | kind=code-symbol | source=lib/auxiliar/types.ts:L21 | neighbors=[mapper.ts, repository.ts, types.ts]
- "auxiliar_types_upsertchecklistinput": "UpsertChecklistInput" | kind=code-symbol | source=lib/auxiliar/types.ts:L51 | neighbors=[repository.ts, service.ts, types.ts]
- "camara_mapper_rowtototalescamara": "rowToTotalesCamara()" | kind=code-symbol | source=lib/camara/mapper.ts:L42 | neighbors=[mapper.ts, toNumNullable(), repository.ts]
- "camara_repository_obtenertotalescamara": "obtenerTotalesCamara()" | kind=code-symbol | source=lib/camara/repository.ts:L34 | neighbors=[repository.ts, service.ts, route.ts]
- "camara_types_totalescamara": "TotalesCamara" | kind=code-symbol | source=lib/camara/types.ts:L20 | neighbors=[mapper.ts, repository.ts, types.ts]
- "components_buttonverdetalles_botonverdetalle": "BotonVerDetalle()" | kind=code-symbol | source=features/compartido/components/ButtonVerDetalles.tsx:L11 | neighbors=[InfraccionesDashboard.tsx, LiberacionesDashboard.tsx, ButtonVerDetalles.tsx]
- "components_mapadireccionregistro_cleancolonianame": "cleanColoniaName()" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L37 | neighbors=[MapaDireccionRegistro.tsx, normalizeUpper(), extractNeighborhoodFromComponents()]
- "components_mapadireccionregistro_extractneighborhoodfromcomponents": "extractNeighborhoodFromComponents()" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L60 | neighbors=[MapaDireccionRegistro.tsx, extractAddress(), cleanColoniaName()]
- "components_mapadireccionregistro_normalizeupper": "normalizeUpper()" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L30 | neighbors=[MapaDireccionRegistro.tsx, cleanColoniaName(), getMunicipioEstado()]
- "corralon_actions_obtenerdashboardcorralon": "obtenerDashboardCorralon()" | kind=code-symbol | source=lib/corralon/actions.ts:L10 | neighbors=[actions.ts, page.tsx, page.tsx]
- "corralon_actions_obtenersolicitudes": "obtenerSolicitudes()" | kind=code-symbol | source=lib/corralon/actions.ts:L31 | neighbors=[actions.ts, page.tsx, page.tsx]
- "corralon_mapper_rowtosolicitud": "rowToSolicitud()" | kind=code-symbol | source=lib/corralon/mapper.ts:L8 | neighbors=[mapper.ts, toStr(), service.ts]
- "corralon_module_card": "module-card.tsx" | kind=code-symbol | source=app/corralon/module-card.tsx:L1 | neighbors=[5a1b5d5 empezando corralon, ModuleCard(), page.tsx]
- "corralon_profile_dropdown_profiledropdown": "ProfileDropdown()" | kind=code-symbol | source=app/corralon/profile-dropdown.tsx:L14 | neighbors=[page.tsx, profile-dropdown.tsx, page.tsx]
- "d1_service_listarreportesd1": "listarReportesD1()" | kind=code-symbol | source=lib/d1/service.ts:L5 | neighbors=[page.tsx, service.ts, route.ts]
- "d1_types_reported1": "ReporteD1" | kind=code-symbol | source=lib/d1/types.ts:L1 | neighbors=[mapper.ts, repository.ts, types.ts]
- "dashboard_sign_out_button_signoutbutton": "SignOutButton()" | kind=code-symbol | source=app/dashboard/sign-out-button.tsx:L6 | neighbors=[page.tsx, sign-out-button.tsx, SubHeader.tsx]
- "exportar_route_get": "GET()" | kind=code-symbol | source=app/api/reportes-telefonicos/exportar/route.ts:L60 | neighbors=[route.ts, crearHoja(), getRango()]
- "fiscalia_actions_accionpedirevidencias": "accionPedirEvidencias()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L78 | neighbors=[actions.ts, PedirEvidenciasModal.tsx, PedirEvidenciasModal.tsx]
- "fiscalia_actions_obtenerdetalleinfraccionviaaction": "obtenerDetalleInfraccionViaAction()" | kind=code-symbol | source=lib/fiscalia/actions.ts:L285 | neighbors=[actions.ts, FiscaliaDashboard.tsx, page.tsx]
- "fiscalia_capturardetallesform_capturardetallesform": "CapturarDetallesForm()" | kind=code-symbol | source=components/fiscalia/CapturarDetallesForm.tsx:L62 | neighbors=[CapturarDetallesForm.tsx, emptyItem(), page.tsx]
- "fiscalia_expediente_subirarchivofiscalia": "subirArchivoFiscalia()" | kind=code-symbol | source=lib/fiscalia/expediente.ts:L42 | neighbors=[actions.ts, expediente.ts, obtenerTokenFiscalia()]
- "fiscalia_formularioasegurado_formularioasegurado": "FormularioAsegurado()" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L63 | neighbors=[FormularioAsegurado.tsx, displayVal(), page.tsx]
- "fiscalia_mapper_rowtoasegurado": "rowToAsegurado()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L165 | neighbors=[repository.ts, mapper.ts, repository.ts]
- "fiscalia_mapper_rowtosolicitud": "rowToSolicitud()" | kind=code-symbol | source=lib/fiscalia/mapper.ts:L21 | neighbors=[mapper.ts, num(), service.ts]
- "fiscalia_service_guardardetallesaseguradosservice": "guardarDetallesAseguradosService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L134 | neighbors=[actions.ts, actions.ts, service.ts]
- "fiscalia_service_guardarpuestadisposicionservice": "guardarPuestaDisposicionService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L159 | neighbors=[actions.ts, actions.ts, service.ts]
- "fiscalia_service_listaraseguradoscondisposicionservice": "listarAseguradosConDisposicionService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L151 | neighbors=[actions.ts, actions.ts, service.ts]
- "fiscalia_service_obtenerdatosasegurado": "obtenerDatosAsegurado()" | kind=code-symbol | source=lib/fiscalia/service.ts:L63 | neighbors=[actions.ts, service.ts, page.tsx]
- "fiscalia_service_obtenerpuestadisposicionservice": "obtenerPuestaDisposicionService()" | kind=code-symbol | source=lib/fiscalia/service.ts:L155 | neighbors=[actions.ts, actions.ts, service.ts]
- "fiscalia_service_verificarrolfiscalia": "verificarRolFiscalia()" | kind=code-symbol | source=lib/fiscalia/service.ts:L25 | neighbors=[actions.ts, service.ts, page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-027.json

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
