# Node Description Batch 15 of 93

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
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
LANGUAGE: each entry has a `lang=` marker giving the language of its source.
Write that entry's description in EXACTLY that language. Do not translate to
a single common language — match each node's source language individually.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "admin_transito_patrullaselector": "PatrullaSelector.tsx" | kind=code-symbol | source=components/admin-transito/PatrullaSelector.tsx:L1 | neighbors=[NuevoOficialForm.tsx, PatrullaSelector(), Props, types.ts, PatrullaAsignacion, 0068216 Mejora de Dashboard, Login y tr…] | lang=en
- "agente_911_service": "service.ts" | kind=code-symbol | source=lib/agente_911/service.ts:L1 | neighbors=[page.tsx, permisos.ts, tieneAlgunAcceso(), verificarRolAgente911(), 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…] | lang=en
- "agente_despacho_service": "service.ts" | kind=code-symbol | source=lib/agente_despacho/service.ts:L1 | neighbors=[page.tsx, permisos.ts, tieneAlgunAcceso(), verificarRolAgenteDespacho(), 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…] | lang=en
- "agente_liberaciones_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/agente_liberaciones/ProfileDropdown.tsx:L1 | neighbors=[ProfileDropdown(), Props, auth-client.ts, authClient, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …] | lang=en
- "auxiliar_mapper": "mapper.ts" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L1 | neighbors=[rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), toStr(), types.ts, AuxChecklist] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@1e81ec820432148abb04683b00b2f357e5385177": "1e81ec8 Datos se autorellenan de denuncias y seccion de oficial" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, TablonAnalisis.tsx, feature/testing, main, 77ddf58 Merge branch 'feature/testing' …, FormularioD1.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2fcba7bd260cba70d92594ca197b78326d4b5de5": "2fcba7b vista de reportes de incidentes diarios y semanales" | kind=Commit | source=git | neighbors=[feature/testing, main, 719b5ab cambio para generacion de repor…, FiltrosIncidencias.tsx, Paginacion.tsx, StatIncidencia.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3a00521b6d46834af2e8ddc660cff4a5f58bd349": "3a00521 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[283f342 Merge branch 'feature/testing' …, 2be4ca9 Cambio en header, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3b0e087f1fdd0285db9176c6679877af2b06aced": "3b0e087 NAVEGACION" | kind=Commit | source=git | neighbors=[133bb9d pages de listado de llamadas y …, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@50101e2d3282e026715fc114d37ac180b4685370": "50101e2 Merge pull request #6 from presidenciaSJR/fix/incidentes-camara" | kind=Commit | source=git | neighbors=[feature/testing, fix/subir-fotografias, main, caef6e8 Merge pull request #7 from pres…, page.tsx, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@519716a61975d62ddcb9d3d0a1cfdaa3911e5a13": "519716a Formulario para registro de whatsapp" | kind=Commit | source=git | neighbors=[3a00521 Merge branch 'feature/testing' …, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@56a8ec4f997e4351cd0c4c3e3a4b33fe4427c175": "56a8ec4 Impkementacion de pa ay guardado de numero exterior e interior en bd, r…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 83f48a2 Merge branch 'feature/correccio…] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5aa5866f2596cb59e4321a860046e68b808e7e64": "5aa5866 Cambio de colores en interfaz de login" | kind=Commit | source=git | neighbors=[layout.tsx, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, main] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5d09f3148a5d50435e0b5ff477e1988edeac2a4f": "5d09f31 integración de componente de paginacion para vista de listado de rondin…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@6cb1055d8e59375ddb1c1197a01d6216e7852ba8": "6cb1055 Mejoras de UI/UIX" | kind=Commit | source=git | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@71912a4116ceaa28e3ae16e06b19d97a3c6665fb": "71912a4 Bitacora incluida" | kind=Commit | source=git | neighbors=[0844e6e Corregido, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@72e8913da9454e21586cb1aaa79d01804d47ed8c": "72e8913 cambio de diseño" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, f7573dd Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7c1d0962288af811c88f7a708534e38caadc6e64": "7c1d096 Merge branch 'feature/denuncias' into feature/testing" | kind=Commit | source=git | neighbors=[28da720 Cambio de colores en dashboard …, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@90da1ca35ab391d63a1adc4af5558ddd8250e0d2": "90da1ca Initial commit from Create Next App" | kind=Commit | source=git | neighbors=[layout.tsx, page.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@97a433bae40f188013d240b41e6d64515f395fa2": "97a433b empezando rol juzgado/fiscalia" | kind=Commit | source=git | neighbors=[83f48a2 Merge branch 'feature/correccio…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bf2e7ed1cd9bab700be7b07172fa6274b92da9c8": "bf2e7ed Reportes del modulo de incidentes" | kind=Commit | source=git | neighbors=[b403f89 Vista para reportes de incident…, feature/testing, fix/subir-fotografias, main, bd1a223 Merge branch 'feature/vistas-re…, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@bf790a7531dfa12cf7c237625f9af6f0c2787860": "bf790a7 opcion booleana arreglada" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, feature/testing, main, 9d67ddf Cambios de formulario analisis, FormularioD1.tsx, useAnalistaForm.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c6cb0295a60d971e802a3ac065defc926c089c2c": "c6cb029 Formulario editado" | kind=Commit | source=git | neighbors=[166a26b Merge branch 'feature/testing' …, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c96893ea9cf58204304c1e59970fe5171f9015fe": "c96893e Merge branch 'feature/correcciones' into feature/testing" | kind=Commit | source=git | neighbors=[3b0e087 NAVEGACION, a0ec8d2 topbar en 911, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d3e6d958008563ec30d4b225434ce61660e6686f": "d3e6d95 Update SeguimientoTimeline.tsx" | kind=Commit | source=git | neighbors=[6cb1055 Mejoras de UI/UIX, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ef9e0ea90799410bf11b63750bd051a2b5cfe619": "ef9e0ea Formulario arreglado" | kind=Commit | source=git | neighbors=[4d4a9b7 formulario de notificaciones po…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f2d7c18cad3a6bb45d3736aa48794ad07e0ce924": "f2d7c18 logica de redirección dinamica" | kind=Commit | source=git | neighbors=[b79a96a Conexión entre ambos modulos, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f9243acfbf6018473ce60a5ac6e3bb5e1d80b986": "f9243ac Interfaz de formulario de rol de servicios adaptado a diseño con cambio…" | kind=Commit | source=git | neighbors=[d3e6d95 Update SeguimientoTimeline.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@fa9df15da4bab3feb96af888bfbbe33d5452b967": "fa9df15 Reporte de cámaras" | kind=Commit | source=git | neighbors=[06c55f5 Merge branch 'feature/testing' …, feature/testing, main, repository.ts, service.ts, 9faf222 Merge branch 'feature/testing' …] | lang=nl
- "components_loadingprovider": "LoadingProvider.tsx" | kind=code-symbol | source=components/LoadingProvider.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 11e8817 Merge branch 'testing' into juz…, 28da720 Cambio de colores en dashboard …, 44ebbc4 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 6adb8ad Correciones de versión y nombre] | lang=en
- "components_modalentregargarantia": "ModalEntregarGarantia.tsx" | kind=code-symbol | source=features/via/infracciones/components/ModalEntregarGarantia.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection.tsx, getGarantiaInfo()] | lang=en
- "corralon_repository": "repository.ts" | kind=code-symbol | source=lib/corralon/repository.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, finalizarInfraccionCorralon(), obtenerEstatusInfraccion()] | lang=en
- "deteccion_camara_reportfilters": "ReportFilters.tsx" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportFilters.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…] | lang=en
- "deteccion_camara_reporttables": "ReportTables.tsx" | kind=code-symbol | source=components/reportes/deteccion_camara/ReportTables.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b170599 Merge branch 'feature/testing' …, b403f89 Vista para reportes de incident…] | lang=en
- "incidentes_actions_req": "req()" | kind=code-symbol | source=lib/incidentes/actions.ts:L26 | neighbors=[actions.ts, addPersonaAfectada(), createAlarmaEscolar(), createDespacho(), createExtorsion(), createIncidente()] | lang=en
- "incidentes_historialincidente": "HistorialIncidente.tsx" | kind=code-symbol | source=components/incidentes/HistorialIncidente.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 290d651 feat(despacho): flujo integral …, 863c575 Merge pull request #24 from pre…, Badge(), Dato(), fmt()] | lang=en
- "monitorista_botongenerarppt": "BotonGenerarPpt.tsx" | kind=code-symbol | source=components/monitorista/BotonGenerarPpt.tsx:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 5d179c0 Apartado de reportes, 5ed311a Merge pull request #5 from pres…, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 8e6c8c6 Apartado de reportes] | lang=en
- "monitorista_editarcampodetenido": "EditarCampoDetenido.tsx" | kind=code-symbol | source=components/monitorista/EditarCampoDetenido.tsx:L1 | neighbors=[23a3b9d Cambios en la estructura de los…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5ed311a Merge pull request #5 from pres…, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "monitorista_tabladetenidos": "TablaDetenidos.tsx" | kind=code-symbol | source=components/monitorista/TablaDetenidos.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 8e6c8c6 Apartado de reportes, ce84893 Merge branch 'feature/testing' …] | lang=en
- "oficial_mapapinfijo": "MapaPinFijo.tsx" | kind=code-symbol | source=components/oficial/MapaPinFijo.tsx:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 44ebbc4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a291695 Merge branch 'feature/testing' …, b79a96a Conexión entre ambos modulos, dd2f306 Fix Mapa] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-014.json

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
