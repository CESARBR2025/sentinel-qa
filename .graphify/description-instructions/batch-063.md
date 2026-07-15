# Node Description Batch 64 of 93

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

- "app_layout_rootlayout": "RootLayout()" | kind=code-symbol | source=app/layout.tsx:L13 | neighbors=[layout.tsx]
- "app_not_found_notfound": "NotFound()" | kind=code-symbol | source=app/not-found.tsx:L9 | neighbors=[not-found.tsx]
- "app_page_rootpage": "RootPage()" | kind=code-symbol | source=app/page.tsx:L3 | neighbors=[page.tsx]
- "asegurados_page_aseguradospage": "AseguradosPage()" | kind=code-symbol | source=app/fiscalia/asegurados/page.tsx:L6 | neighbors=[page.tsx]
- "asegurados_page_juzgadoaseguradospage": "JuzgadoAseguradosPage()" | kind=code-symbol | source=app/agente_juzgado/asegurados/page.tsx:L6 | neighbors=[page.tsx]
- "atendidos_route_get": "GET()" | kind=code-symbol | source=app/api/incidentes/atendidos/route.ts:L7 | neighbors=[route.ts]
- "auth_helpers_hub_por_rol": "HUB_POR_ROL" | kind=code-symbol | source=lib/auth/helpers.ts:L46 | neighbors=[helpers.ts]
- "auth_helpers_userwithrole": "UserWithRole" | kind=code-symbol | source=lib/auth/helpers.ts:L3 | neighbors=[helpers.ts]
- "auth_layout_authlayout": "AuthLayout()" | kind=code-symbol | source=app/(auth)/layout.tsx:L7 | neighbors=[layout.tsx]
- "auth_layout_metadata": "metadata" | kind=code-symbol | source=app/(auth)/layout.tsx:L3 | neighbors=[layout.tsx]
- "auxiliar_actions_bool": "bool()" | kind=code-symbol | source=lib/auxiliar/actions.ts:L17 | neighbors=[actions.ts]
- "auxiliar_actions_str": "str()" | kind=code-symbol | source=lib/auxiliar/actions.ts:L18 | neighbors=[actions.ts]
- "auxiliar_page_auxiliarpage": "AuxiliarPage()" | kind=code-symbol | source=app/auxiliar/page.tsx:L12 | neighbors=[page.tsx]
- "auxiliar_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L17 | neighbors=[permisos.ts]
- "auxiliar_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L25 | neighbors=[permisos.ts]
- "auxiliar_permisos_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L9 | neighbors=[permisos.ts]
- "auxiliar_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L21 | neighbors=[permisos.ts]
- "auxiliar_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L7 | neighbors=[permisos.ts]
- "auxiliar_permisos_roles_permitidos": "ROLES_PERMITIDOS" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L30 | neighbors=[permisos.ts]
- "auxiliar_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L5 | neighbors=[permisos.ts]
- "auxiliar_profiledropdownauxiliar_props": "Props" | kind=code-symbol | source=components/auxiliar/ProfileDropdownAuxiliar.tsx:L8 | neighbors=[ProfileDropdownAuxiliar.tsx]
- "buscar_orden_route_get": "GET()" | kind=code-symbol | source=app/api/via/sa7/buscar-orden/route.ts:L9 | neighbors=[route.ts]
- "busquedas_page_busquedaspage": "BusquedasPage()" | kind=code-symbol | source=app/prevencion/busquedas/page.tsx:L18 | neighbors=[page.tsx]
- "busquedas_page_tipo_cfg": "TIPO_CFG" | kind=code-symbol | source=app/prevencion/busquedas/page.tsx:L13 | neighbors=[page.tsx]
- "busquedas_route_get": "GET()" | kind=code-symbol | source=app/api/prevencion/busquedas/route.ts:L8 | neighbors=[route.ts]
- "busquedas_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/busquedas/route.ts:L22 | neighbors=[route.ts]
- "c4_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/c4/route.ts:L7 | neighbors=[route.ts]
- "calcular_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-fge/calcular/route.ts:L7 | neighbors=[route.ts]
- "camara_service_tostr": "toStr()" | kind=code-symbol | source=lib/camara/service.ts:L3 | neighbors=[service.ts]
- "cancelar_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/cancelar/route.ts:L7 | neighbors=[route.ts]
- "captura_page_capturapage": "CapturaPage()" | kind=code-symbol | source=app/infracciones/captura/page.tsx:L9 | neighbors=[page.tsx]
- "checklist_page_checklistpage": "ChecklistPage()" | kind=code-symbol | source=app/auxiliar/checklist/page.tsx:L10 | neighbors=[page.tsx]
- "ciudadano_formulario911_formulario911": "Formulario911()" | kind=code-symbol | source=app/agente_911/ciudadano/Formulario911.tsx:L12 | neighbors=[Formulario911.tsx]
- "ciudadano_formulario911_libraries": "libraries" | kind=code-symbol | source=app/agente_911/ciudadano/Formulario911.tsx:L10 | neighbors=[Formulario911.tsx]
- "ciudadano_page_ciudadano911page": "Ciudadano911Page()" | kind=code-symbol | source=app/agente_911/ciudadano/page.tsx:L15 | neighbors=[page.tsx]
- "complementos_repository_gruarow": "GruaRow" | kind=code-symbol | source=lib/complementos/repository.ts:L3 | neighbors=[repository.ts]
- "completar_route_post": "POST()" | kind=code-symbol | source=app/api/monitorista/solicitudes/[id]/completar/route.ts:L7 | neighbors=[route.ts]
- "completar_solicitud_route_post": "POST()" | kind=code-symbol | source=app/api/via/ciudadano/completar-solicitud/route.ts:L7 | neighbors=[route.ts]
- "components_buttonverdetalles_botonverdetalleprops": "BotonVerDetalleProps" | kind=code-symbol | source=features/compartido/components/ButtonVerDetalles.tsx:L6 | neighbors=[ButtonVerDetalles.tsx]
- "components_capturardatostitularsection_capturardatostitularsection": "CapturarDatosTitularSection()" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L15 | neighbors=[CapturarDatosTitularSection.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-063.json

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
