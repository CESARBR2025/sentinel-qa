# Node Description Batch 35 of 89

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

- "shared_direcciongooglemaps_direcciongooglemaps": "DireccionGoogleMaps()" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L18 | neighbors=[CapturarDetallesForm.tsx, CapturarDetallesForm.tsx, DireccionGoogleMaps.tsx]
- "shared_infracciones_obtenertokenguest": "obtenerTokenGuest()" | kind=code-symbol | source=lib/shared/infracciones.ts:L5 | neighbors=[service.ts, actions.ts, infracciones.ts]
- "shared_infracciones_viainfracciondetalle": "ViaInfraccionDetalle" | kind=code-symbol | source=lib/shared/infracciones.ts:L128 | neighbors=[types.ts, types.ts, infracciones.ts]
- "steps_procesomodal_procesomodal": "ProcesoModal()" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L85 | neighbors=[FormularioInfraccion.tsx, ProcesoModal.tsx, getStepIndex()]
- "templates_layout_emaillayout": "emailLayout()" | kind=code-symbol | source=lib/emails/templates/layout.ts:L56 | neighbors=[asignacion-fiscalia.ts, layout.ts, orden-liberacion.ts]
- "templates_layout_emailstyles": "emailStyles" | kind=code-symbol | source=lib/emails/templates/layout.ts:L1 | neighbors=[asignacion-fiscalia.ts, layout.ts, orden-liberacion.ts]
- "templates_layout_inlinestyles": "inlineStyles()" | kind=code-symbol | source=lib/emails/templates/layout.ts:L50 | neighbors=[asignacion-fiscalia.ts, layout.ts, orden-liberacion.ts]
- "types_detalleinfraccion_detallecompleto": "DetalleCompleto" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L61 | neighbors=[CapturarDatosTitularSection.tsx, ModalEntregarGarantia.tsx, detalleInfraccion.ts]
- "via_sa7_consultarestatussa7": "consultarEstatusSA7()" | kind=code-symbol | source=lib/via/sa7.ts:L3 | neighbors=[route.ts, pagos.ts, sa7.ts]
- "whatsapp_formsection": "FormSection.tsx" | kind=code-symbol | source=components/911/whatsapp/FormSection.tsx:L1 | neighbors=[519716a Formulario para registro de wha…, FormSection(), SectionProps]
- "wireframes_wf_c": "wf-c.jsx" | kind=code-symbol | source=login-desing/wireframes/wf-c.jsx:L1 | neighbors=[5558751 feat: módulo Prevención del Del…, 6a042cd feat: sistema de autenticación,…, WireframeC()]
- "911_filtrosincidentes_filtrosincidentes": "FiltrosIncidentes()" | kind=code-symbol | source=components/911/FiltrosIncidentes.tsx:L29 | neighbors=[FiltrosIncidentes.tsx, page.tsx]
- "911_mapper_rowtocatalogo": "rowToCatalogo()" | kind=code-symbol | source=lib/911/mapper.ts:L73 | neighbors=[mapper.ts, repository.ts]
- "911_mapper_rowtoincidenteresumen": "rowToIncidenteResumen()" | kind=code-symbol | source=lib/911/mapper.ts:L15 | neighbors=[mapper.ts, toStr()]
- "911_mapper_tonum": "toNum()" | kind=code-symbol | source=lib/911/mapper.ts:L9 | neighbors=[mapper.ts, rowToIncidenteDetalle()]
- "911_pagination_pagination": "Pagination()" | kind=code-symbol | source=components/911/Pagination.tsx:L13 | neighbors=[Pagination.tsx, page.tsx]
- "911_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/911/permisos.ts:L4 | neighbors=[permisos.ts, registro.ts]
- "911_permisos_tieneaccesohub": "tieneAccesoHub()" | kind=code-symbol | source=lib/911/permisos.ts:L46 | neighbors=[permisos.ts, obtenerRolNombre()]
- "911_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/911/permisos.ts:L9 | neighbors=[permisos.ts, tieneAccesoSeccion()]
- "911_repository_contarporestatus": "contarPorEstatus()" | kind=code-symbol | source=lib/911/repository.ts:L144 | neighbors=[repository.ts, service.ts]
- "911_repository_listarincidentes": "listarIncidentes()" | kind=code-symbol | source=lib/911/repository.ts:L42 | neighbors=[repository.ts, service.ts]
- "911_repository_listarincidentesrecientes": "listarIncidentesRecientes()" | kind=code-symbol | source=lib/911/repository.ts:L122 | neighbors=[repository.ts, page.tsx]
- "911_repository_obtenercatalogos": "obtenerCatalogos()" | kind=code-symbol | source=lib/911/repository.ts:L5 | neighbors=[repository.ts, service.ts]
- "911_repository_obtenerincidente": "obtenerIncidente()" | kind=code-symbol | source=lib/911/repository.ts:L89 | neighbors=[repository.ts, service.ts]
- "911_repository_obtenerincidenteconextras": "obtenerIncidenteConExtras()" | kind=code-symbol | source=lib/911/repository.ts:L103 | neighbors=[repository.ts, service.ts]
- "911_repository_obtenerstats": "obtenerStats()" | kind=code-symbol | source=lib/911/repository.ts:L25 | neighbors=[repository.ts, service.ts]
- "911_repository_obtenertiposincidente": "obtenerTiposIncidente()" | kind=code-symbol | source=lib/911/repository.ts:L136 | neighbors=[repository.ts, service.ts]
- "911_service_getconteoestatus": "getConteoEstatus()" | kind=code-symbol | source=lib/911/service.ts:L33 | neighbors=[service.ts, page.tsx]
- "911_service_getincidenteconextras": "getIncidenteConExtras()" | kind=code-symbol | source=lib/911/service.ts:L25 | neighbors=[service.ts, page.tsx]
- "911_service_getincidentespaginados": "getIncidentesPaginados()" | kind=code-symbol | source=lib/911/service.ts:L12 | neighbors=[service.ts, page.tsx]
- "911_service_gettiposincidente": "getTiposIncidente()" | kind=code-symbol | source=lib/911/service.ts:L29 | neighbors=[service.ts, page.tsx]
- "911_types_incidenteresumen": "IncidenteResumen" | kind=code-symbol | source=lib/911/types.ts:L1 | neighbors=[mapper.ts, types.ts]
- "admin_page": "page.tsx" | kind=code-symbol | source=app/admin/page.tsx:L1 | neighbors=[AdminPage(), 0e33bf6 feat: módulo Admin, Prórroga, F…]
- "admin_repository_actualizarusuario": "actualizarUsuario()" | kind=code-symbol | source=lib/admin/repository.ts:L78 | neighbors=[actions.ts, repository.ts]
- "admin_repository_asignarrolusuario": "asignarRolUsuario()" | kind=code-symbol | source=lib/admin/repository.ts:L88 | neighbors=[actions.ts, repository.ts]
- "admin_repository_crearrol": "crearRol()" | kind=code-symbol | source=lib/admin/repository.ts:L60 | neighbors=[repository.ts, route.ts]
- "admin_repository_eliminarsesion": "eliminarSesion()" | kind=code-symbol | source=lib/admin/repository.ts:L92 | neighbors=[actions.ts, repository.ts]
- "admin_repository_existerolpornombre": "existeRolPorNombre()" | kind=code-symbol | source=lib/admin/repository.ts:L52 | neighbors=[repository.ts, route.ts]
- "admin_repository_listarroles": "listarRoles()" | kind=code-symbol | source=lib/admin/repository.ts:L37 | neighbors=[repository.ts, page.tsx]
- "admin_repository_listarusuarios": "listarUsuarios()" | kind=code-symbol | source=lib/admin/repository.ts:L5 | neighbors=[repository.ts, page.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-034.json

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
