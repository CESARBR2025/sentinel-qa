# Node Description Batch 1 of 87

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

- "id_page": "page.tsx" | kind=code-symbol | source=app/prevencion/medidas/[id]/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 06c55f5 Merge branch 'feature/testing' …, 0b210fa Merge pull request #12 from pre…, 0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho] | lang=en
- "branch:repo:github.com/presidenciaSJR/seguridad_publica#testing": "testing" | kind=Branch | source=git | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 067c4de arreglando flujo de fiscalia  a…, 06c55f5 Merge branch 'feature/testing' …, 07543de Conexion de reportes con d1 y l…, 090c4dd vista de fiscalia] | lang=en
- "branch:repo:github.com/presidenciaSJR/seguridad_publica#conexion": "conexion" | kind=Branch | source=git | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 067c4de arreglando flujo de fiscalia  a…, 06c55f5 Merge branch 'feature/testing' …, 07543de Conexion de reportes con d1 y l…, 090c4dd vista de fiscalia] | lang=en
- "branch:repo:github.com/presidenciaSJR/seguridad_publica#feature/testing": "feature/testing" | kind=Branch | source=git | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 067c4de arreglando flujo de fiscalia  a…, 06c55f5 Merge branch 'feature/testing' …, 07543de Conexion de reportes con d1 y l…, 0844e6e Corregido] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@27dcb21a86db2de26bfc779f4aaf4fec8991eb0a": "27dcb21 Merge branch 'feature/testing' into feature/reportes" | kind=Commit | source=git | neighbors=[13f7f39 Reporte-incidentes, 23b7312 Merge pull request #16 from pre…, permisos.ts, actions.ts, admin-styles.ts, layout.tsx] | lang=en
- "lib_auth": "auth.ts" | kind=code-symbol | source=lib/auth.ts:L1 | neighbors=[actions.ts, layout.tsx, actions.ts, layout.tsx, page.tsx, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@56183089bb0dbab7ac016b53a0048eb82663de88": "5618308 guardado e evidencias con ed" | kind=Commit | source=git | neighbors=[permisos.ts, actions.ts, admin-styles.ts, layout.tsx, page.tsx, route.ts] | lang=en
- "lib_auth_auth": "auth" | kind=code-symbol | source=lib/auth.ts:L7 | neighbors=[actions.ts, layout.tsx, actions.ts, layout.tsx, page.tsx, page.tsx] | lang=en
- "branch:repo:github.com/presidenciaSJR/seguridad_publica#fix/subir-fotografias": "fix/subir-fotografias" | kind=Branch | source=git | neighbors=[0844e6e Corregido, 090c4dd vista de fiscalia, 0c31cc2 Merge branch 'testing' into juz…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 0fe445e vista de oficial, 11e8817 Merge branch 'testing' into juz…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@77ddf581e964b55bb5508a24e9c90d4a9a9ff3c2": "77ddf58 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[1e81ec8 Datos se autorellenan de denunc…, permisos.ts, actions.ts, admin-styles.ts, layout.tsx, page.tsx] | lang=en
- "branch:repo:github.com/presidenciaSJR/seguridad_publica#fix/incidentes-camara": "fix/incidentes-camara" | kind=Branch | source=git | neighbors=[0844e6e Corregido, 090c4dd vista de fiscalia, 0c31cc2 Merge branch 'testing' into juz…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 0fe445e vista de oficial, 11e8817 Merge branch 'testing' into juz…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f2c66e682e59e5ecf07ab51eba5d316be33317dc": "f2c66e6 Extender roles y permisos finos a incidentes, prevención, auxiliar, 911…" | kind=Commit | source=git | neighbors=[9faf222 Merge branch 'feature/testing' …, permisos.ts, actions.ts, admin-styles.ts, layout.tsx, page.tsx] | lang=es
- "branch:repo:github.com/presidenciaSJR/seguridad_publica#fix/detenidos": "fix/detenidos" | kind=Branch | source=git | neighbors=[0844e6e Corregido, 090c4dd vista de fiscalia, 0c31cc2 Merge branch 'testing' into juz…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 0fe445e vista de oficial, 11e8817 Merge branch 'testing' into juz…] | lang=en
- "nuevo_page": "page.tsx" | kind=code-symbol | source=app/oficial/nuevo/page.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 06c55f5 Merge branch 'feature/testing' …, 0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 0e33bf6 feat: módulo Admin, Prórroga, F…, 12aab65 fase 4] | lang=en
- "branch:repo:github.com/presidenciaSJR/seguridad_publica#feature/monitorista-reportes": "feature/monitorista-reportes" | kind=Branch | source=git | neighbors=[0844e6e Corregido, 090c4dd vista de fiscalia, 0c31cc2 Merge branch 'testing' into juz…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 0fe445e vista de oficial, 11e8817 Merge branch 'testing' into juz…] | lang=en
- "fiscalia_actions": "actions.ts" | kind=code-symbol | source=lib/fiscalia/actions.ts:L1 | neighbors=[page.tsx, 067c4de arreglando flujo de fiscalia  a…, 090c4dd vista de fiscalia, 0b210fa Merge pull request #12 from pre…, 16a63d4 Merge branch 'feature/testing' …, 1acddac Merge branch 'feature/testing' …] | lang=en
- "id_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/registradas/[id]/route.ts:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 126b4d1 Monitorista V1, 16a63d4 Merge branch 'feature/testing' …, 1e81ec8 Datos se autorellenan de denunc…, 27dcb21 Merge branch 'feature/testing' …, 3249f00 Cambios en rellenado de ppt!] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5f13b344f53381f1e0be53d48cc01531c733ca4b": "5f13b34 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[2ca9f50 Formulario sin backend, actions.ts, actions.ts, CapturarDetallesForm.tsx, CerrarCasoModal.tsx, DetallesAseguradoView.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ad3ec5f3be685ac0390b1bb26ed1b4e4ee446256": "ad3ec5f mejorando esto" | kind=Commit | source=git | neighbors=[repository.ts, repository.ts, route.ts, route.ts, conexion, testing] | lang=en
- "agente_juzgado_actions": "actions.ts" | kind=code-symbol | source=lib/agente_juzgado/actions.ts:L1 | neighbors=[accionCerrarCaso(), accionPedirEvidencias(), accionTomarCaso(), AseguradosJuzgadoData, guardarDetallesAseguradoAction(), guardarDetallesAseguradosJuzgadoAction()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@e2866195018542bc43b977d15d5ad61dba4012b6": "e286619 Merge branch 'feature/testing' into feature/implementacion-consumir-dat…" | kind=Commit | source=git | neighbors=[2dde720 Merge pull request #14 from pre…, a353e63 Ya se enlazan datos pero no com…, actions.ts, CapturarDatosInfractorModal.tsx, InfraccionesDashboard.tsx, InfraccionesTable.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ce8489357ed5f2deb9bda9a767b60cc7b7e6a784": "ce84893 Merge branch 'feature/testing' into feature/auxiliar" | kind=Commit | source=git | neighbors=[5aa5866 Cambio de colores en interfaz d…, actions.ts, actions.ts, CapturarDetallesForm.tsx, CerrarCasoModal.tsx, DetallesAseguradoView.tsx] | lang=fr
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@16a63d41144eb3b22c4c032b204a5e609c2feabb": "16a63d4 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[actions.ts, layout.tsx, ModalDestituirOficial.tsx, ModalReactivarOficial.tsx, NuevoOficialForm.tsx, OficialesTable.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ac48eb101cef07bcbce887a91ef387034142b7e7": "ac48eb1 Merge pull request #17 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[a6b7556 Formulario se puso a prueba, se…, actions.ts, layout.tsx, ModalDestituirOficial.tsx, ModalReactivarOficial.tsx, NuevoOficialForm.tsx] | lang=en
- "incidentes_actions": "actions.ts" | kind=code-symbol | source=lib/incidentes/actions.ts:L1 | neighbors=[Formulario911.tsx, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 0fe445e vista de oficial] | lang=en
- "monitorista_repository": "repository.ts" | kind=code-symbol | source=lib/monitorista/repository.ts:L1 | neighbors=[514a705 refactorizacion sql, ad3ec5f mejorando esto, c27a9ee fase prefinal, route.ts, route.ts, route.ts] | lang=en
- "oficial_service": "service.ts" | kind=code-symbol | source=lib/oficial/service.ts:L1 | neighbors=[page.tsx, 067c4de arreglando flujo de fiscalia  a…, 0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 16a63d4 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f7b1aacd08a138818884c835b5627b6fdae25f5f": "f7b1aac Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[27dcb21 Merge branch 'feature/testing' …, 56b6577 FORMULARIO SE ENLAZO A LA TABLA…, route.ts, conexion, testing, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@44ebbc492f4b09958c6b586813dea76d0d0902f3": "44ebbc4 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[Pagination.tsx, actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts, service.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@06c55f55b30a9e5a7643d5e4e1d2b21e612a2fb1": "06c55f5 Merge branch 'feature/testing' into feature/reportes" | kind=Commit | source=git | neighbors=[actions.ts, CapturarDatosInfractorModal.tsx, InfraccionesDashboard.tsx, InfraccionesTable.tsx, mapper.ts, ModalEntregarGarantia.tsx] | lang=en
- "lib_db": "db.ts" | kind=code-symbol | source=lib/db.ts:L1 | neighbors=[permisos.ts, repository.ts, repository.ts, actions.ts, repository.ts, service.ts] | lang=en
- "branch:repo:github.com/presidenciaSJR/seguridad_publica#feature/monitorista": "feature/monitorista" | kind=Branch | source=git | neighbors=[0844e6e Corregido, 090c4dd vista de fiscalia, 0e33bf6 feat: módulo Admin, Prórroga, F…, 0fe445e vista de oficial, 126b4d1 Monitorista V1, 133bb9d pages de listado de llamadas y …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@8355ac04a9b7a756c9f5d856cb11cc5f332a8607": "8355ac0 Merge branch 'feature/testing' into feature/implementacion-consumir-dat…" | kind=Commit | source=git | neighbors=[actions.ts, FormularioAseguradoJuzgado.tsx, page.tsx, repository.ts, service.ts, layout.tsx] | lang=en
- "oficial_repository": "repository.ts" | kind=code-symbol | source=lib/oficial/repository.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 12aab65 fase 4, 13f7f39 Reporte-incidentes, 16a63d4 Merge branch 'feature/testing' …] | lang=en
- "fiscalia_service": "service.ts" | kind=code-symbol | source=lib/fiscalia/service.ts:L1 | neighbors=[actions.ts, 067c4de arreglando flujo de fiscalia  a…, 090c4dd vista de fiscalia, 16a63d4 Merge branch 'feature/testing' …, 2db162a flujo de asegurados, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "incidentes_page": "page.tsx" | kind=code-symbol | source=app/incidentes/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 0d9172a mejorando flujo de 911-despacho, 27dcb21 Merge branch 'feature/testing' …, 290d651 feat(despacho): flujo integral …, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "fiscalia_types": "types.ts" | kind=code-symbol | source=lib/fiscalia/types.ts:L1 | neighbors=[actions.ts, FormularioAseguradoJuzgado.tsx, repository.ts, service.ts, 067c4de arreglando flujo de fiscalia  a…, 090c4dd vista de fiscalia] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@23b73129c2f870345a5ea9ae06130efd4edb9c3d": "23b7312 Merge pull request #16 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[route.ts, conexion, testing, route.ts, page.tsx, 27dcb21 Merge branch 'feature/testing' …] | lang=en
- "incidentes_repository": "repository.ts" | kind=code-symbol | source=lib/incidentes/repository.ts:L1 | neighbors=[route.ts, 0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 290d651 feat(despacho): flujo integral …, 552d291 Merge branch 'testing' into con…] | lang=en
- "fiscalia_repository": "repository.ts" | kind=code-symbol | source=lib/fiscalia/repository.ts:L1 | neighbors=[actions.ts, 067c4de arreglando flujo de fiscalia  a…, 090c4dd vista de fiscalia, 16a63d4 Merge branch 'feature/testing' …, 2db162a flujo de asegurados, 44ebbc4 Merge branch 'feature/testing' …] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-000.json

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
