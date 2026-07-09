# Node Description Batch 56 of 79

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

- "auth_layout_metadata": "metadata" | kind=code-symbol | source=app/(auth)/layout.tsx:L3 | neighbors=[layout.tsx]
- "auxiliar_actions_bool": "bool()" | kind=code-symbol | source=lib/auxiliar/actions.ts:L21 | neighbors=[actions.ts]
- "auxiliar_actions_str": "str()" | kind=code-symbol | source=lib/auxiliar/actions.ts:L22 | neighbors=[actions.ts]
- "auxiliar_page_auxiliarpage": "AuxiliarPage()" | kind=code-symbol | source=app/auxiliar/page.tsx:L11 | neighbors=[page.tsx]
- "auxiliar_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L18 | neighbors=[permisos.ts]
- "auxiliar_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L26 | neighbors=[permisos.ts]
- "auxiliar_permisos_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L10 | neighbors=[permisos.ts]
- "auxiliar_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L22 | neighbors=[permisos.ts]
- "auxiliar_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L8 | neighbors=[permisos.ts]
- "auxiliar_permisos_roles_permitidos": "ROLES_PERMITIDOS" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L30 | neighbors=[permisos.ts]
- "auxiliar_permisos_seccion": "Seccion" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L6 | neighbors=[permisos.ts]
- "auxiliar_profiledropdownauxiliar_props": "Props" | kind=code-symbol | source=components/auxiliar/ProfileDropdownAuxiliar.tsx:L8 | neighbors=[ProfileDropdownAuxiliar.tsx]
- "buscar_orden_route_get": "GET()" | kind=code-symbol | source=app/api/via/sa7/buscar-orden/route.ts:L6 | neighbors=[route.ts]
- "busquedas_page_busquedaspage": "BusquedasPage()" | kind=code-symbol | source=app/prevencion/busquedas/page.tsx:L14 | neighbors=[page.tsx]
- "busquedas_page_tipo_cfg": "TIPO_CFG" | kind=code-symbol | source=app/prevencion/busquedas/page.tsx:L9 | neighbors=[page.tsx]
- "busquedas_route_get": "GET()" | kind=code-symbol | source=app/api/prevencion/busquedas/route.ts:L8 | neighbors=[route.ts]
- "busquedas_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/busquedas/route.ts:L22 | neighbors=[route.ts]
- "c4_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/c4/route.ts:L7 | neighbors=[route.ts]
- "calcular_route_get": "GET()" | kind=code-symbol | source=app/api/reportes/formato-n-fge/calcular/route.ts:L7 | neighbors=[route.ts]
- "camara_service_tostr": "toStr()" | kind=code-symbol | source=lib/camara/service.ts:L3 | neighbors=[service.ts]
- "cancelar_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/cancelar/route.ts:L7 | neighbors=[route.ts]
- "captura_page_capturapage": "CapturaPage()" | kind=code-symbol | source=app/infracciones/captura/page.tsx:L10 | neighbors=[page.tsx]
- "checklist_page_checklistpage": "ChecklistPage()" | kind=code-symbol | source=app/auxiliar/checklist/page.tsx:L10 | neighbors=[page.tsx]
- "ciudadano_formulario911_formulario911": "Formulario911()" | kind=code-symbol | source=app/911/ciudadano/Formulario911.tsx:L11 | neighbors=[Formulario911.tsx]
- "ciudadano_formulario911_libraries": "libraries" | kind=code-symbol | source=app/911/ciudadano/Formulario911.tsx:L9 | neighbors=[Formulario911.tsx]
- "ciudadano_page_ciudadano911page": "Ciudadano911Page()" | kind=code-symbol | source=app/911/ciudadano/page.tsx:L16 | neighbors=[page.tsx]
- "complementos_repository_gruarow": "GruaRow" | kind=code-symbol | source=lib/complementos/repository.ts:L3 | neighbors=[repository.ts]
- "completar_route_post": "POST()" | kind=code-symbol | source=app/api/monitorista/solicitudes/[id]/completar/route.ts:L7 | neighbors=[route.ts]
- "completar_solicitud_route_post": "POST()" | kind=code-symbol | source=app/api/via/ciudadano/completar-solicitud/route.ts:L7 | neighbors=[route.ts]
- "components_buttonverdetalles_botonverdetalleprops": "BotonVerDetalleProps" | kind=code-symbol | source=features/compartido/components/ButtonVerDetalles.tsx:L6 | neighbors=[ButtonVerDetalles.tsx]
- "components_capturardatostitularsection_capturardatostitularsection": "CapturarDatosTitularSection()" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L15 | neighbors=[CapturarDatosTitularSection.tsx]
- "components_capturardatostitularsection_field": "Field()" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L671 | neighbors=[CapturarDatosTitularSection.tsx]
- "components_capturardatostitularsection_fieldname": "FieldName" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L33 | neighbors=[CapturarDatosTitularSection.tsx]
- "components_capturardatostitularsection_props": "Props" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L9 | neighbors=[CapturarDatosTitularSection.tsx]
- "components_capturardatostitularsection_validatefield": "validateField()" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L35 | neighbors=[CapturarDatosTitularSection.tsx]
- "components_capturarinfractorsection_capturarinfractorsection": "CapturarInfractorSection()" | kind=code-symbol | source=features/liberaciones/components/CapturarInfractorSection.tsx:L42 | neighbors=[CapturarInfractorSection.tsx]
- "components_capturarinfractorsection_field": "Field()" | kind=code-symbol | source=features/liberaciones/components/CapturarInfractorSection.tsx:L15 | neighbors=[CapturarInfractorSection.tsx]
- "components_capturarinfractorsection_props": "Props" | kind=code-symbol | source=features/liberaciones/components/CapturarInfractorSection.tsx:L8 | neighbors=[CapturarInfractorSection.tsx]
- "components_formularioinfraccion_addressdata": "AddressData" | kind=code-symbol | source=features/via/oficiales/components/FormularioInfraccion.tsx:L9 | neighbors=[FormularioInfraccion.tsx]
- "components_formularioinfraccion_formularioinfraccion": "FormularioInfraccion()" | kind=code-symbol | source=features/via/oficiales/components/FormularioInfraccion.tsx:L71 | neighbors=[FormularioInfraccion.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-055.json

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
