# Node Description Batch 54 of 86

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

- "admin_transito_permisos_accion": "Accion" | kind=code-symbol | source=lib/admin-transito/permisos.ts:L5 | neighbors=[permisos.ts]
- "admin_transito_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/admin-transito/permisos.ts:L12 | neighbors=[permisos.ts]
- "admin_transito_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/admin-transito/permisos.ts:L20 | neighbors=[permisos.ts]
- "admin_transito_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/admin-transito/permisos.ts:L16 | neighbors=[permisos.ts]
- "admin_transito_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/admin-transito/permisos.ts:L6 | neighbors=[permisos.ts]
- "admin_transito_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/admin-transito/permisos.ts:L4 | neighbors=[permisos.ts]
- "admin_transito_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/admin-transito/permisos.ts:L3 | neighbors=[permisos.ts]
- "admin_transito_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/admin-transito/permisos.ts:L8 | neighbors=[permisos.ts]
- "admin_transito_repository_actualizaroficialrecord": "actualizarOficialRecord()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L153 | neighbors=[repository.ts]
- "admin_transito_repository_actualizaruserinfo": "actualizarUserInfo()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L139 | neighbors=[repository.ts]
- "admin_transito_repository_asignarrolusuario": "asignarRolUsuario()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L32 | neighbors=[repository.ts]
- "admin_transito_repository_buscarusuariosparareincorporar": "buscarUsuariosParaReincorporar()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L167 | neighbors=[repository.ts]
- "admin_transito_repository_destituiroficial": "destituirOficial()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L95 | neighbors=[repository.ts]
- "admin_transito_repository_eliminarsesion": "eliminarSesion()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L73 | neighbors=[repository.ts]
- "admin_transito_repository_getuserrole": "getUserRole()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L12 | neighbors=[repository.ts]
- "admin_transito_repository_listaroficiales": "listarOficiales()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L77 | neighbors=[repository.ts]
- "admin_transito_repository_obteneroficialporid": "obtenerOficialPorId()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L119 | neighbors=[repository.ts]
- "admin_transito_repository_obtenerroloficialcampo": "obtenerRolOficialCampo()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L24 | neighbors=[repository.ts]
- "admin_transito_repository_reactivaroficial": "reactivarOficial()" | kind=code-symbol | source=lib/admin-transito/repository.ts:L103 | neighbors=[repository.ts]
- "agente_911_page_agente911dashboardpage": "Agente911DashboardPage()" | kind=code-symbol | source=app/agente_911/page.tsx:L10 | neighbors=[page.tsx]
- "agente_bitacorista_page_agentebitacoristadashboardpage": "AgenteBitacoristaDashboardPage()" | kind=code-symbol | source=app/agente_bitacorista/page.tsx:L10 | neighbors=[page.tsx]
- "agente_despacho_page_agentedespachodashboardpage": "AgenteDespachoDashboardPage()" | kind=code-symbol | source=app/agente_despacho/page.tsx:L10 | neighbors=[page.tsx]
- "agente_infracciones_capturardatosinfractormodal_capturardatosinfractormodal": "CapturarDatosInfractorModal()" | kind=code-symbol | source=components/agente_infracciones/CapturarDatosInfractorModal.tsx:L36 | neighbors=[CapturarDatosInfractorModal.tsx]
- "agente_infracciones_capturardatosinfractormodal_datosform": "DatosForm()" | kind=code-symbol | source=components/agente_infracciones/CapturarDatosInfractorModal.tsx:L80 | neighbors=[CapturarDatosInfractorModal.tsx]
- "agente_infracciones_capturardatosinfractormodal_field": "Field()" | kind=code-symbol | source=components/agente_infracciones/CapturarDatosInfractorModal.tsx:L538 | neighbors=[CapturarDatosInfractorModal.tsx]
- "agente_infracciones_capturardatosinfractormodal_fieldname": "FieldName" | kind=code-symbol | source=components/agente_infracciones/CapturarDatosInfractorModal.tsx:L18 | neighbors=[CapturarDatosInfractorModal.tsx]
- "agente_infracciones_capturardatosinfractormodal_isnodata": "isNoData()" | kind=code-symbol | source=components/agente_infracciones/CapturarDatosInfractorModal.tsx:L20 | neighbors=[CapturarDatosInfractorModal.tsx]
- "agente_infracciones_capturardatosinfractormodal_props": "Props" | kind=code-symbol | source=components/agente_infracciones/CapturarDatosInfractorModal.tsx:L12 | neighbors=[CapturarDatosInfractorModal.tsx]
- "agente_infracciones_capturardatosinfractormodal_validatefield": "validateField()" | kind=code-symbol | source=components/agente_infracciones/CapturarDatosInfractorModal.tsx:L24 | neighbors=[CapturarDatosInfractorModal.tsx]
- "agente_infracciones_infraccionesdashboard_avatar_colors": "AVATAR_COLORS" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L10 | neighbors=[InfraccionesDashboard.tsx]
- "agente_infracciones_infraccionesdashboard_estatusinfracciones": "EstatusInfracciones" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L40 | neighbors=[InfraccionesDashboard.tsx]
- "agente_infracciones_infraccionesdashboard_getbadge": "getBadge()" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L70 | neighbors=[InfraccionesDashboard.tsx]
- "agente_infracciones_infraccionesdashboard_getinitials": "getInitials()" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L21 | neighbors=[InfraccionesDashboard.tsx]
- "agente_infracciones_infraccionesdashboard_hashcolor": "hashColor()" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L28 | neighbors=[InfraccionesDashboard.tsx]
- "agente_infracciones_infraccionesdashboard_infraccionesdashboard": "InfraccionesDashboard()" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L76 | neighbors=[InfraccionesDashboard.tsx]
- "agente_infracciones_infraccionesdashboard_props": "Props" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L34 | neighbors=[InfraccionesDashboard.tsx]
- "agente_infracciones_infraccionesdashboard_sortable_keys": "SORTABLE_KEYS" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L74 | neighbors=[InfraccionesDashboard.tsx]
- "agente_infracciones_infraccionesdashboard_status_badge": "STATUS_BADGE" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L55 | neighbors=[InfraccionesDashboard.tsx]
- "agente_infracciones_infraccionesdashboard_status_tabs": "STATUS_TABS" | kind=code-symbol | source=components/agente_infracciones/InfraccionesDashboard.tsx:L47 | neighbors=[InfraccionesDashboard.tsx]
- "agente_infracciones_infraccionestable_columns": "columns" | kind=code-symbol | source=components/agente_infracciones/InfraccionesTable.tsx:L23 | neighbors=[InfraccionesTable.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-053.json

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
