# Node Description Batch 10 of 82

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@86e93197ed0a6a560d8b403e68ef1883ab444a4e": "86e9319 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[5e458d6 navegacion, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b403f89a497d4ec089c09c8fcdb3f51ae3c3157b": "b403f89 Vista para reportes de incidentes por camaras y cambio den header" | kind=Commit | source=git | neighbors=[5aa5866 Cambio de colores en interfaz d…, feature/testing, fix/subir-fotografias, bf2e7ed Reportes del modulo de incident…, ReportFilters.tsx, ReportStat.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b68a2b77559cba69587da44516c497087b7bf59c": "b68a2b7 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 8303881 Subida de header y footer, falt…] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@da48f68a11b31923ca37285ae8882363e6bb81dd": "da48f68 implementando flujo de aceptacion de documentos" | kind=Commit | source=git | neighbors=[5d2b064 fix vercel upload files, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx, feature/testing] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ed748a66d4165feeb638b671f565fd6afa2109ee": "ed748a6 fORMULARIO DE DENUNCIA CONCLUIDO" | kind=Commit | source=git | neighbors=[511fea4 Modulo de despacho, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ef95840b5ad7ebf42d66485abca37a97c02d16d9": "ef95840 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[0c8695c Cambios en filtros, 5ef7cf3 Agregar los campos faltantes, feature/testing, 4400923 Merge branch 'feature/testing' …, actions.ts, repository.ts] | lang=en
- "components_capturarinfractorsection": "CapturarInfractorSection.tsx" | kind=code-symbol | source=features/liberaciones/components/CapturarInfractorSection.tsx:L1 | neighbors=[LiberacionesDashboard.tsx, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…, 5d2b064 fix vercel upload files] | lang=en
- "denuncias_stored1": "storeD1.ts" | kind=code-symbol | source=lib/denuncias/storeD1.ts:L1 | neighbors=[5f13b34 Merge branch 'feature/testing' …, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, FormularioD1.tsx, ahora] | lang=en
- "exportar_robo_route": "route.ts" | kind=code-symbol | source=app/api/auxiliar/exportar-robo/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…] | lang=en
- "finalizarproceso_route": "route.ts" | kind=code-symbol | source=app/api/agente_juzgado/finalizarProceso/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 75e03e9 puliendo flujo de juzgado-liber…, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "fiscalia_detallesaseguradoview": "DetallesAseguradoView.tsx" | kind=code-symbol | source=components/fiscalia/DetallesAseguradoView.tsx:L1 | neighbors=[5f13b34 Merge branch 'feature/testing' …, 6109a7a replicando flujo para fiscalia, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, DetallesAseguradoView(), disabledSx] | lang=en
- "incidentes_service": "service.ts" | kind=code-symbol | source=lib/incidentes/service.ts:L1 | neighbors=[13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 5ef7cf3 Agregar los campos faltantes, 712c116 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…] | lang=en
- "iniciarproceso_route": "route.ts" | kind=code-symbol | source=app/api/agente_juzgado/iniciarProceso/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 75e03e9 puliendo flujo de juzgado-liber…, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "lib_auth_client": "auth-client.ts" | kind=code-symbol | source=lib/auth-client.ts:L1 | neighbors=[page.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdownAuxiliar.tsx, 6a042cd feat: sistema de autenticación,…] | lang=en
- "oficiales_page": "page.tsx" | kind=code-symbol | source=app/admin-transito/oficiales/page.tsx:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, actions.ts] | lang=en
- "reporte_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/[id]/reporte/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, a58a0f7 Despachos, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "reportes_incidentes_repository": "repository.ts" | kind=code-symbol | source=lib/reportes-incidentes/repository.ts:L1 | neighbors=[13f7f39 Reporte-incidentes, ad3ec5f mejorando esto, f7b1aac Merge branch 'feature/testing' …, fcb223f merge de testing, db.ts, query()] | lang=en
- "steps_pasociudadano": "PasoCiudadano.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadano.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadano(), Props] | lang=en
- "via_expediente": "expediente.ts" | kind=code-symbol | source=lib/via/expediente.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2c128e5 test expediente vercel, 5618308 guardado e evidencias con ed, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "911_pagination": "Pagination.tsx" | kind=code-symbol | source=components/911/Pagination.tsx:L1 | neighbors=[arrowBtnStyle, containerStyle, infoStyle, labelStyle, pageNumberStyle, Pagination()] | lang=en
- "agente_juzgado_formularioaseguradojuzgado": "FormularioAseguradoJuzgado.tsx" | kind=code-symbol | source=components/agente_juzgado/FormularioAseguradoJuzgado.tsx:L1 | neighbors=[concatNombre(), disabledSx, displayVal(), FormularioAseguradoJuzgado(), labelSx, Props] | lang=en
- "atendidos_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/atendidos/route.ts:L1 | neighbors=[GET(), permisos.ts, verificarAccesoIncidentesApi(), repository.ts, listarIncidentesAtendidos(), auth.ts] | lang=en
- "c4_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/solicitudes/[id]/c4/route.ts:L1 | neighbors=[POST(), auth.ts, auth, actions.ts, createSolicitudC4Api(), permisos.ts] | lang=en
- "cancelar_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/cancelar/route.ts:L1 | neighbors=[POST(), auth.ts, auth, actions.ts, cancelarFichaApi(), permisos.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0fe445e29f2fa675a83a604d9d85cc407d9dfd71": "0fe445e vista de oficial" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@25167235624891e98af3080d98f97e1a435923e6": "2516723 Modulo de permisos" | kind=Commit | source=git | neighbors=[22b7b54 Merge branch 'feature/reportes'…, feature/testing, 06c55f5 Merge branch 'feature/testing' …, page.tsx, page.tsx, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2ca9f50c34a034d79d53d0a1a8971bf85be26d26": "2ca9f50 Formulario sin backend" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, page.tsx, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5311c242be0de7380641d9bb29e09f23c59744a0": "5311c24 Editar Registros" | kind=Commit | source=git | neighbors=[feature/testing, fix/incidentes-camara, fix/subir-fotografias, caef6e8 Merge pull request #7 from pres…, page.tsx, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@58305708646ad2bbd09424e9572a88505eea3d89": "5830570 Seccion de analista, uya con bd y genera presentacion generica, no jala…" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, feature/testing, fix/subir-fotografias, b170599 Merge branch 'feature/testing' …, page.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@69a557f3c74b4d884dd90df831a14df224747f8f": "69a557f CAMBIO CORREGIDO" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@7f3fe1ac2c04221ffa46cca74bc2018ff13df091": "7f3fe1a Formulariop de Rondines listo, falta revisarlo PERO YA ES FUNCIONAL" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@905531c8d619a3e556b9255f7422e8466b2e8b64": "905531c trabajando en panel de fiscalia" | kind=Commit | source=git | neighbors=[090c4dd vista de fiscalia, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9550203776dbe9f8ba3e1e21c447ef64c9b2713a": "9550203 Cambios en presentacion, se genera" | kind=Commit | source=git | neighbors=[generarPresentacion.tsx, feature/testing, 8355ac0 Merge branch 'feature/testing' …, FormularioD1.tsx, route.ts, BitacoraIPH.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@95b78c1d99e3697b5e2349399de1c7adc38ec744": "95b78c1 cambios de incidentes" | kind=Commit | source=git | neighbors=[4d4a9b7 formulario de notificaciones po…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2907e2eb0150bea16791d3d9786037d34db1dca": "a2907e2 Boton agregado para crear roles!" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, page.tsx, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a353e637487c27079ab15d1a99ef2193ae58c0bc": "a353e63 Ya se enlazan datos pero no completos, un problema en la consulta sql q…" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, page.tsx, TablonAnalisis.tsx, feature/testing, e286619 Merge branch 'feature/testing' …] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@af993fbd3820fa58b8d79213c4f60e3ae79001ce": "af993fb Fix/Monitorista" | kind=Commit | source=git | neighbors=[16a63d4 Merge branch 'feature/testing' …, repository.ts, repository.ts, feature/testing, f5fac0b Merge branch 'testing' into con…, repository.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c194e5488d641dda843f63b0e952d4081a438002": "c194e54 envio de solicitud de evidencias completado" | kind=Commit | source=git | neighbors=[905531c trabajando en panel de fiscalia, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@caef6e8dddc3704ff7381785115f3e7344376623": "caef6e8 Merge pull request #7 from presidenciaSJR/fix/incidentes-camara" | kind=Commit | source=git | neighbors=[50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, feature/testing, fix/subir-fotografias, b170599 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d04a29d5489b7170722d56787613aa84473ef564": "d04a29d correccion de navegacion entre pagians" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-009.json

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
