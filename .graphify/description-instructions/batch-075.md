# Node Description Batch 76 of 79

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

- "roles_route_post": "POST()" | kind=code-symbol | source=app/api/admin/roles/route.ts:L7 | neighbors=[route.ts]
- "rondin_page_reporterecorridopage": "ReporteRecorridoPage()" | kind=code-symbol | source=app/911/rondin/page.tsx:L9 | neighbors=[page.tsx]
- "sasiete_mapper_ordenpagorow": "OrdenPagoRow" | kind=code-symbol | source=features/via/saSiete/mapper.ts:L3 | neighbors=[mapper.ts]
- "sasiete_repository_sa7repository_actualizarordenpago": ".actualizarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L65 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_buscarordenporinfraccionid": ".buscarOrdenPorInfraccionId()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L57 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_insertarordenpago": ".insertarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L14 | neighbors=[SA7Repository]
- "sasiete_repository_sa7repository_obtenerconceptoidporclasificacion": ".obtenerConceptoIdPorClasificacion()" | kind=code-symbol | source=features/via/saSiete/repository.ts:L6 | neighbors=[SA7Repository]
- "sasiete_service_sa7service_buscarordenporinfraccion": ".buscarOrdenPorInfraccion()" | kind=code-symbol | source=features/via/saSiete/service.ts:L87 | neighbors=[SA7Service]
- "sasiete_service_sa7service_generarordenpago": ".generarOrdenPago()" | kind=code-symbol | source=features/via/saSiete/service.ts:L13 | neighbors=[SA7Service]
- "sasiete_service_sa7service_obtenerconceptoid": ".obtenerConceptoId()" | kind=code-symbol | source=features/via/saSiete/service.ts:L9 | neighbors=[SA7Service]
- "sasiete_types_catalogoconceptosa7": "CatalogoConceptoSA7" | kind=code-symbol | source=features/via/saSiete/types.ts:L1 | neighbors=[types.ts]
- "seguimientos_route_post": "POST()" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/seguimientos/route.ts:L7 | neighbors=[route.ts]
- "setup_2fa_page_setup2fapage": "Setup2FAPage()" | kind=code-symbol | source=app/(auth)/login/setup-2fa/page.tsx:L7 | neighbors=[page.tsx]
- "shared_detalleinfraccionview_fieldwithicon": "FieldWithIcon()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L463 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_getstatusstyle": "getStatusStyle()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L96 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infracciondetalle": "InfraccionDetalle" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L77 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infracciongarantia": "InfraccionGarantia" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L63 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionheader": "InfraccionHeader" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L15 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccioninfractor": "InfraccionInfractor" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L41 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionlegal": "InfraccionLegal" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L31 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionoficial": "InfraccionOficial" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L47 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionubicacion": "InfraccionUbicacion" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L67 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_infraccionvehiculo": "InfraccionVehiculo" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L54 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_props": "Props" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L142 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_section": "Section()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L439 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_status_styles": "STATUS_STYLES" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L89 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_streetviewmap": "StreetViewMap()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L399 | neighbors=[DetalleInfraccionView.tsx]
- "shared_detalleinfraccionview_timelinenode": "TimelineNode()" | kind=code-symbol | source=components/shared/DetalleInfraccionView.tsx:L730 | neighbors=[DetalleInfraccionView.tsx]
- "shared_direcciongooglemaps_props": "Props" | kind=code-symbol | source=components/shared/DireccionGoogleMaps.tsx:L13 | neighbors=[DireccionGoogleMaps.tsx]
- "shared_infracciones_bool": "bool()" | kind=code-symbol | source=lib/shared/infracciones.ts:L48 | neighbors=[infracciones.ts]
- "shared_infracciones_num": "num()" | kind=code-symbol | source=lib/shared/infracciones.ts:L55 | neighbors=[infracciones.ts]
- "shared_infracciones_str": "str()" | kind=code-symbol | source=lib/shared/infracciones.ts:L43 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfracciongarantia": "ViaInfraccionGarantia" | kind=code-symbol | source=lib/shared/infracciones.ts:L114 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionheader": "ViaInfraccionHeader" | kind=code-symbol | source=lib/shared/infracciones.ts:L63 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccioninfractor": "ViaInfraccionInfractor" | kind=code-symbol | source=lib/shared/infracciones.ts:L90 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionlegal": "ViaInfraccionLegal" | kind=code-symbol | source=lib/shared/infracciones.ts:L80 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionoficial": "ViaInfraccionOficial" | kind=code-symbol | source=lib/shared/infracciones.ts:L98 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionubicacion": "ViaInfraccionUbicacion" | kind=code-symbol | source=lib/shared/infracciones.ts:L118 | neighbors=[infracciones.ts]
- "shared_infracciones_viainfraccionvehiculo": "ViaInfraccionVehiculo" | kind=code-symbol | source=lib/shared/infracciones.ts:L105 | neighbors=[infracciones.ts]
- "shared_pedirevidenciasmodal_evidenciaitem": "EvidenciaItem" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L18 | neighbors=[PedirEvidenciasModal.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-075.json

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
