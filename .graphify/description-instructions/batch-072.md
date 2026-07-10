# Node Description Batch 73 of 79

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

- "plugins_graphify_skill_path": "SKILL_PATH" | kind=code-symbol | source=.opencode/plugins/graphify.js:L13 | neighbors=[graphify.js]
- "postcss_config_config": "config" | kind=code-symbol | source=postcss.config.mjs:L1 | neighbors=[postcss.config.mjs]
- "prevencion_agregarautoridadform_autoridad": "Autoridad" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L8 | neighbors=[AgregarAutoridadForm.tsx]
- "prevencion_agregarautoridadform_autoridades": "AUTORIDADES" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L7 | neighbors=[AgregarAutoridadForm.tsx]
- "prevencion_agregarautoridadform_i": "I" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L20 | neighbors=[AgregarAutoridadForm.tsx]
- "prevencion_agregarautoridadform_l": "L" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L16 | neighbors=[AgregarAutoridadForm.tsx]
- "prevencion_agregarautoridadform_props": "Props" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L10 | neighbors=[AgregarAutoridadForm.tsx]
- "prevencion_autoridadbadge_cfg": "CFG" | kind=code-symbol | source=components/prevencion/AutoridadBadge.tsx:L1 | neighbors=[AutoridadBadge.tsx]
- "prevencion_cancelacionmodal_inputfield": "InputField()" | kind=code-symbol | source=components/prevencion/CancelacionModal.tsx:L73 | neighbors=[CancelacionModal.tsx]
- "prevencion_cancelacionmodal_textareafield": "TextareaField()" | kind=code-symbol | source=components/prevencion/CancelacionModal.tsx:L85 | neighbors=[CancelacionModal.tsx]
- "prevencion_contestacionform_formfield": "FormField()" | kind=code-symbol | source=components/prevencion/ContestacionForm.tsx:L93 | neighbors=[ContestacionForm.tsx]
- "prevencion_contestacionform_inputstyle": "inputStyle" | kind=code-symbol | source=components/prevencion/ContestacionForm.tsx:L82 | neighbors=[ContestacionForm.tsx]
- "prevencion_layout_prevencionlayout": "PrevencionLayout()" | kind=code-symbol | source=app/prevencion/layout.tsx:L10 | neighbors=[layout.tsx]
- "prevencion_medidasfiltros_autoridades": "AUTORIDADES" | kind=code-symbol | source=components/prevencion/MedidasFiltros.tsx:L14 | neighbors=[MedidasFiltros.tsx]
- "prevencion_medidasfiltros_estados": "ESTADOS" | kind=code-symbol | source=components/prevencion/MedidasFiltros.tsx:L6 | neighbors=[MedidasFiltros.tsx]
- "prevencion_permisos_guardarpermiso": "guardarPermiso()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L18 | neighbors=[permisos.ts]
- "prevencion_permisos_guardarplantillaseccion": "guardarPlantillaSeccion()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L26 | neighbors=[permisos.ts]
- "prevencion_permisos_obtenerpermisosusuario": "obtenerPermisosUsuario()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L10 | neighbors=[permisos.ts]
- "prevencion_permisos_obtenerplantillarol": "obtenerPlantillaRol()" | kind=code-symbol | source=lib/prevencion/permisos.ts:L22 | neighbors=[permisos.ts]
- "prevencion_permisos_permisoseccion": "PermisoSeccion" | kind=code-symbol | source=lib/prevencion/permisos.ts:L8 | neighbors=[permisos.ts]
- "prevencion_permisos_roles_permitidos": "ROLES_PERMITIDOS" | kind=code-symbol | source=lib/prevencion/permisos.ts:L32 | neighbors=[permisos.ts]
- "prevencion_permisos_secciones": "SECCIONES" | kind=code-symbol | source=lib/prevencion/permisos.ts:L5 | neighbors=[permisos.ts]
- "prevencion_prevencionnav_alertas": "Alertas" | kind=code-symbol | source=app/prevencion/PrevencionNav.tsx:L39 | neighbors=[PrevencionNav.tsx]
- "prevencion_prevencionnav_icons": "ICONS" | kind=code-symbol | source=app/prevencion/PrevencionNav.tsx:L37 | neighbors=[PrevencionNav.tsx]
- "prevencion_prevencionnav_nav": "NAV" | kind=code-symbol | source=app/prevencion/PrevencionNav.tsx:L7 | neighbors=[PrevencionNav.tsx]
- "prevencion_prevencionnav_prevencionnav": "PrevencionNav()" | kind=code-symbol | source=app/prevencion/PrevencionNav.tsx:L41 | neighbors=[PrevencionNav.tsx]
- "prevencion_prevencionnav_scaleicon": "ScaleIcon()" | kind=code-symbol | source=app/prevencion/PrevencionNav.tsx:L26 | neighbors=[PrevencionNav.tsx]
- "prevencion_prevencionnav_searchicon": "SearchIcon()" | kind=code-symbol | source=app/prevencion/PrevencionNav.tsx:L19 | neighbors=[PrevencionNav.tsx]
- "prevencion_prevencionnav_shieldicon": "ShieldIcon()" | kind=code-symbol | source=app/prevencion/PrevencionNav.tsx:L13 | neighbors=[PrevencionNav.tsx]
- "prevencion_prorrogamodal_i": "I" | kind=code-symbol | source=components/prevencion/ProrrogaModal.tsx:L127 | neighbors=[ProrrogaModal.tsx]
- "prevencion_prorrogamodal_l": "L" | kind=code-symbol | source=components/prevencion/ProrrogaModal.tsx:L123 | neighbors=[ProrrogaModal.tsx]
- "prevencion_prorrogaviewermodal_prorrogaviewermodalprops": "ProrrogaViewerModalProps" | kind=code-symbol | source=components/prevencion/ProrrogaViewerModal.tsx:L5 | neighbors=[ProrrogaViewerModal.tsx]
- "prevencion_seguimientotimeline_props": "Props" | kind=code-symbol | source=components/prevencion/SeguimientoTimeline.tsx:L8 | neighbors=[SeguimientoTimeline.tsx]
- "prevencion_semaforovigencia_cfg": "CFG" | kind=code-symbol | source=components/prevencion/SemaforoVigencia.tsx:L3 | neighbors=[SemaforoVigencia.tsx]
- "prevencion_timeline_tiposeguimiento": "TipoSeguimiento" | kind=code-symbol | source=lib/prevencion/timeline.ts:L8 | neighbors=[timeline.ts]
- "prevencion_visitamodal_checkboxfield": "CheckboxField()" | kind=code-symbol | source=components/prevencion/VisitaModal.tsx:L110 | neighbors=[VisitaModal.tsx]
- "prevencion_visitamodal_inputfield": "InputField()" | kind=code-symbol | source=components/prevencion/VisitaModal.tsx:L86 | neighbors=[VisitaModal.tsx]
- "prevencion_visitamodal_textareafield": "TextareaField()" | kind=code-symbol | source=components/prevencion/VisitaModal.tsx:L98 | neighbors=[VisitaModal.tsx]
- "proxy_config": "config" | kind=code-symbol | source=proxy.ts:L40 | neighbors=[proxy.ts]
- "proxy_public_paths": "PUBLIC_PATHS" | kind=code-symbol | source=proxy.ts:L6 | neighbors=[proxy.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-072.json

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
