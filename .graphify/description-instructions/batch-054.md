# Node Description Batch 55 of 89

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

- "admin_transito_modalreactivaroficial_modalreactivaroficial": "ModalReactivarOficial()" | kind=code-symbol | source=components/admin-transito/ModalReactivarOficial.tsx:L262 | neighbors=[ModalReactivarOficial.tsx]
- "admin_transito_modalreactivaroficial_patrullaselect": "PatrullaSelect()" | kind=code-symbol | source=components/admin-transito/ModalReactivarOficial.tsx:L55 | neighbors=[ModalReactivarOficial.tsx]
- "admin_transito_modalreactivaroficial_props": "Props" | kind=code-symbol | source=components/admin-transito/ModalReactivarOficial.tsx:L15 | neighbors=[ModalReactivarOficial.tsx]
- "admin_transito_modalreactivaroficial_selectstyle": "selectStyle" | kind=code-symbol | source=components/admin-transito/ModalReactivarOficial.tsx:L50 | neighbors=[ModalReactivarOficial.tsx]
- "admin_transito_nuevooficialform_departamento": "Departamento" | kind=code-symbol | source=components/admin-transito/NuevoOficialForm.tsx:L8 | neighbors=[NuevoOficialForm.tsx]
- "admin_transito_nuevooficialform_inputstyle": "inputStyle" | kind=code-symbol | source=components/admin-transito/NuevoOficialForm.tsx:L29 | neighbors=[NuevoOficialForm.tsx]
- "admin_transito_nuevooficialform_labelstyle": "labelStyle" | kind=code-symbol | source=components/admin-transito/NuevoOficialForm.tsx:L19 | neighbors=[NuevoOficialForm.tsx]
- "admin_transito_nuevooficialform_nuevooficialform": "NuevoOficialForm()" | kind=code-symbol | source=components/admin-transito/NuevoOficialForm.tsx:L46 | neighbors=[NuevoOficialForm.tsx]
- "admin_transito_nuevooficialform_props": "Props" | kind=code-symbol | source=components/admin-transito/NuevoOficialForm.tsx:L14 | neighbors=[NuevoOficialForm.tsx]
- "admin_transito_nuevooficialform_selectstyle": "selectStyle" | kind=code-symbol | source=components/admin-transito/NuevoOficialForm.tsx:L41 | neighbors=[NuevoOficialForm.tsx]
- "admin_transito_oficialestable_accionmodal": "AccionModal" | kind=code-symbol | source=components/admin-transito/OficialesTable.tsx:L38 | neighbors=[OficialesTable.tsx]
- "admin_transito_oficialestable_departamento": "Departamento" | kind=code-symbol | source=components/admin-transito/OficialesTable.tsx:L11 | neighbors=[OficialesTable.tsx]
- "admin_transito_oficialestable_oficial": "Oficial" | kind=code-symbol | source=components/admin-transito/OficialesTable.tsx:L17 | neighbors=[OficialesTable.tsx]
- "admin_transito_oficialestable_oficialestable": "OficialesTable()" | kind=code-symbol | source=components/admin-transito/OficialesTable.tsx:L52 | neighbors=[OficialesTable.tsx]
- "admin_transito_oficialestable_props": "Props" | kind=code-symbol | source=components/admin-transito/OficialesTable.tsx:L32 | neighbors=[OficialesTable.tsx]
- "admin_transito_page_admintransitodashboardpage": "AdminTransitoDashboardPage()" | kind=code-symbol | source=app/admin-transito/page.tsx:L4 | neighbors=[page.tsx]
- "admin_transito_patrullaselector_patrullaselector": "PatrullaSelector()" | kind=code-symbol | source=components/admin-transito/PatrullaSelector.tsx:L12 | neighbors=[PatrullaSelector.tsx]
- "admin_transito_patrullaselector_props": "Props" | kind=code-symbol | source=components/admin-transito/PatrullaSelector.tsx:L7 | neighbors=[PatrullaSelector.tsx]
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

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-054.json

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
