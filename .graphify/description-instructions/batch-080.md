# Node Description Batch 81 of 93

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

- "notificaciones_campanillanotificaciones_playalertsound": "playAlertSound()" | kind=code-symbol | source=components/notificaciones/CampanillaNotificaciones.tsx:L41 | neighbors=[CampanillaNotificaciones.tsx]
- "notificaciones_campanillanotificaciones_props": "Props" | kind=code-symbol | source=components/notificaciones/CampanillaNotificaciones.tsx:L187 | neighbors=[CampanillaNotificaciones.tsx]
- "notificaciones_campanillanotificaciones_timeago": "timeAgo()" | kind=code-symbol | source=components/notificaciones/CampanillaNotificaciones.tsx:L31 | neighbors=[CampanillaNotificaciones.tsx]
- "notificaciones_campanillanotificaciones_toastprops": "ToastProps" | kind=code-symbol | source=components/notificaciones/CampanillaNotificaciones.tsx:L73 | neighbors=[CampanillaNotificaciones.tsx]
- "notificaciones_checker_hitos_alertar": "HITOS_ALERTAR" | kind=code-symbol | source=lib/notificaciones/checker.ts:L4 | neighbors=[checker.ts]
- "notificaciones_route_get": "GET()" | kind=code-symbol | source=app/api/notificaciones/route.ts:L7 | neighbors=[route.ts]
- "nueva_page_autoridades": "AUTORIDADES" | kind=code-symbol | source=app/prevencion/medidas/nueva/page.tsx:L8 | neighbors=[page.tsx]
- "nueva_page_btnsecundario": "btnSecundario" | kind=code-symbol | source=app/monitorista/detenidos/nueva/page.tsx:L94 | neighbors=[page.tsx]
- "nueva_page_field": "Field()" | kind=code-symbol | source=app/monitorista/detenidos/nueva/page.tsx:L80 | neighbors=[page.tsx]
- "nueva_page_nuevafichapage": "NuevaFichaPage()" | kind=code-symbol | source=app/prevencion/busquedas/nueva/page.tsx:L14 | neighbors=[page.tsx]
- "nueva_page_nuevamedidapage": "NuevaMedidaPage()" | kind=code-symbol | source=app/prevencion/medidas/nueva/page.tsx:L15 | neighbors=[page.tsx]
- "nueva_page_nuevasolicitudpage": "NuevaSolicitudPage()" | kind=code-symbol | source=app/prevencion/juridico/solicitudes/nueva/page.tsx:L16 | neighbors=[page.tsx]
- "nueva_page_row": "Row()" | kind=code-symbol | source=app/prevencion/medidas/nueva/page.tsx:L124 | neighbors=[page.tsx]
- "nueva_page_section": "Section()" | kind=code-symbol | source=app/prevencion/medidas/nueva/page.tsx:L111 | neighbors=[page.tsx]
- "nueva_page_selectfield": "SelectField()" | kind=code-symbol | source=app/prevencion/medidas/nueva/page.tsx:L148 | neighbors=[page.tsx]
- "nueva_page_textareafield": "TextareaField()" | kind=code-symbol | source=app/prevencion/medidas/nueva/page.tsx:L166 | neighbors=[page.tsx]
- "nueva_page_tipos": "TIPOS" | kind=code-symbol | source=app/prevencion/busquedas/nueva/page.tsx:L8 | neighbors=[page.tsx]
- "nuevo_page_btnsecundario": "btnSecundario" | kind=code-symbol | source=app/monitorista/incidentes-camara/nuevo/page.tsx:L150 | neighbors=[page.tsx]
- "nuevo_page_campos": "CAMPOS" | kind=code-symbol | source=app/monitorista/incidentes-camara/nuevo/page.tsx:L16 | neighbors=[page.tsx]
- "nuevo_page_campos_calculables": "CAMPOS_CALCULABLES" | kind=code-symbol | source=app/formato-n-fge/nuevo/page.tsx:L17 | neighbors=[page.tsx]
- "nuevo_page_campos_manuales": "CAMPOS_MANUALES" | kind=code-symbol | source=app/formato-n-fge/nuevo/page.tsx:L26 | neighbors=[page.tsx]
- "nuevo_page_fuentedetencion": "FuenteDetencion" | kind=code-symbol | source=app/formato-n-rnd/nuevo/page.tsx:L11 | neighbors=[page.tsx]
- "nuevo_page_fuenteincidente": "FuenteIncidente" | kind=code-symbol | source=app/formato-n-eventos/nuevo/page.tsx:L11 | neighbors=[page.tsx]
- "nuevo_page_inputstyle": "inputStyle" | kind=code-symbol | source=app/monitorista/incidentes-camara/nuevo/page.tsx:L149 | neighbors=[page.tsx]
- "nuevo_page_label": "Label()" | kind=code-symbol | source=app/monitorista/incidentes-camara/nuevo/page.tsx:L145 | neighbors=[page.tsx]
- "nuevo_page_nuevadenunciad1page": "NuevaDenunciaD1Page()" | kind=code-symbol | source=app/denuncia/nuevo/page.tsx:L13 | neighbors=[page.tsx]
- "nuevo_page_nuevaformatonarmaaseguradapage": "NuevaFormatoNArmaAseguradaPage()" | kind=code-symbol | source=app/formato-n-armas-aseguradas/nuevo/page.tsx:L11 | neighbors=[page.tsx]
- "nuevo_page_nuevoformatonatencionvictimaspage": "NuevoFormatoNAtencionVictimasPage()" | kind=code-symbol | source=app/formato-n-atencion-victimas/nuevo/page.tsx:L17 | neighbors=[page.tsx]
- "nuevo_page_nuevoformatoneventopage": "NuevoFormatoNEventoPage()" | kind=code-symbol | source=app/formato-n-eventos/nuevo/page.tsx:L20 | neighbors=[page.tsx]
- "nuevo_page_nuevoformatonfgepage": "NuevoFormatoNFgePage()" | kind=code-symbol | source=app/formato-n-fge/nuevo/page.tsx:L32 | neighbors=[page.tsx]
- "nuevo_page_nuevoformatonfgrpage": "NuevoFormatoNFgrPage()" | kind=code-symbol | source=app/formato-n-fgr/nuevo/page.tsx:L29 | neighbors=[page.tsx]
- "nuevo_page_nuevoformatonmediosalternativospage": "NuevoFormatoNMediosAlternativosPage()" | kind=code-symbol | source=app/formato-n-medios-alternativos/nuevo/page.tsx:L17 | neighbors=[page.tsx]
- "nuevo_page_nuevoformatonrndpage": "NuevoFormatoNRndPage()" | kind=code-symbol | source=app/formato-n-rnd/nuevo/page.tsx:L20 | neighbors=[page.tsx]
- "nuevo_page_nuevooficialpage": "NuevoOficialPage()" | kind=code-symbol | source=app/admin-transito/oficiales/nuevo/page.tsx:L7 | neighbors=[page.tsx]
- "nuevo_page_nuevoreporteoficialpage": "NuevoReporteOficialPage()" | kind=code-symbol | source=app/oficial/nuevo/page.tsx:L7 | neighbors=[page.tsx]
- "nuevo_page_nuevousuariopage": "NuevoUsuarioPage()" | kind=code-symbol | source=app/admin/usuarios/nuevo/page.tsx:L6 | neighbors=[page.tsx]
- "nuevo_page_periodos": "PERIODOS" | kind=code-symbol | source=app/formato-n-medios-alternativos/nuevo/page.tsx:L11 | neighbors=[page.tsx]
- "nuevo_page_turnos": "TURNOS" | kind=code-symbol | source=app/monitorista/incidentes-camara/nuevo/page.tsx:L10 | neighbors=[page.tsx]
- "oficial_despachocontent_asignacion": "Asignacion" | kind=code-symbol | source=components/oficial/DespachoContent.tsx:L8 | neighbors=[DespachoContent.tsx]
- "oficial_despachocontent_props": "Props" | kind=code-symbol | source=components/oficial/DespachoContent.tsx:L17 | neighbors=[DespachoContent.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-080.json

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
