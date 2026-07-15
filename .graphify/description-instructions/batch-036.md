# Node Description Batch 37 of 93

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
- "admin_repository_obtenerrol": "obtenerRol()" | kind=code-symbol | source=lib/admin/repository.ts:L44 | neighbors=[repository.ts, page.tsx]
- "admin_repository_obtenerrolusuario": "obtenerRolUsuario()" | kind=code-symbol | source=lib/admin/repository.ts:L70 | neighbors=[actions.ts, repository.ts]
- "admin_repository_obtenerusuario": "obtenerUsuario()" | kind=code-symbol | source=lib/admin/repository.ts:L16 | neighbors=[repository.ts, page.tsx]
- "admin_transito_actions_buscarusuariosreincorporar": "buscarUsuariosReincorporar()" | kind=code-symbol | source=lib/admin-transito/actions.ts:L295 | neighbors=[actions.ts, requireAdminTransito()]
- "admin_transito_repository_obteneroficialexistente": "obtenerOficialExistente()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L36 | neighbors=[repository.ts, upsertOficial()]
- "admin_transito_repository_upsertoficial": "upsertOficial()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L44 | neighbors=[repository.ts, obtenerOficialExistente()]
- "admin_transito_types_userwithrole": "UserWithRole" | kind=code-symbol | source=lib/admin-transito/types.ts:L1 | neighbors=[mapper.ts, types.ts]
- "agente_911_service_verificarrolagente911": "verificarRolAgente911()" | kind=code-symbol | source=lib/agente_911/service.ts:L3 | neighbors=[page.tsx, service.ts]
- "agente_bitacorista_service_verificarrolagentebitacorista": "verificarRolAgenteBitacorista()" | kind=code-symbol | source=lib/agente_bitacorista/service.ts:L3 | neighbors=[page.tsx, service.ts]
- "agente_despacho_service_verificarrolagentedespacho": "verificarRolAgenteDespacho()" | kind=code-symbol | source=lib/agente_despacho/service.ts:L3 | neighbors=[page.tsx, service.ts]
- "agente_infracciones_actions_capturarinfractorinfraccionesaction": "capturarInfractorInfraccionesAction()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L61 | neighbors=[actions.ts, CapturarDatosInfractorModal.tsx]
- "agente_infracciones_actions_liberargarantiainfraccionesaction": "liberarGarantiaInfraccionesAction()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L79 | neighbors=[actions.ts, ModalEntregarGarantia.tsx]
- "agente_infracciones_actions_obtenerdashboardinfracciones": "obtenerDashboardInfracciones()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L10 | neighbors=[actions.ts, page.tsx]
- "agente_infracciones_actions_obtenerinfracciones": "obtenerInfracciones()" | kind=code-symbol | source=lib/agente_infracciones/actions.ts:L26 | neighbors=[actions.ts, page.tsx]
- "agente_infracciones_mapper_nvl": "nvl()" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L23 | neighbors=[mapper.ts, inputToDbParams()]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-036.json

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
