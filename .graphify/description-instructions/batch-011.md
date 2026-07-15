# Node Description Batch 12 of 93

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5311c242be0de7380641d9bb29e09f23c59744a0": "5311c24 Editar Registros" | kind=Commit | source=git | neighbors=[feature/testing, fix/incidentes-camara, fix/subir-fotografias, main, caef6e8 Merge pull request #7 from pres…, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@58305708646ad2bbd09424e9572a88505eea3d89": "5830570 Seccion de analista, uya con bd y genera presentacion generica, no jala…" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, feature/testing, fix/subir-fotografias, main, b170599 Merge branch 'feature/testing' …] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@83f48a2d52ed2283798d3a1362eba8544bfb0b24": "83f48a2 Merge branch 'feature/correcciones' into feature/testing" | kind=Commit | source=git | neighbors=[166a26b Merge branch 'feature/testing' …, 56a8ec4 Impkementacion de pa ay guardad…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@905531c8d619a3e556b9255f7422e8466b2e8b64": "905531c trabajando en panel de fiscalia" | kind=Commit | source=git | neighbors=[090c4dd vista de fiscalia, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9550203776dbe9f8ba3e1e21c447ef64c9b2713a": "9550203 Cambios en presentacion, se genera" | kind=Commit | source=git | neighbors=[generarPresentacion.tsx, feature/testing, main, 8355ac0 Merge branch 'feature/testing' …, FormularioD1.tsx, route.ts] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2907e2eb0150bea16791d3d9786037d34db1dca": "a2907e2 Boton agregado para crear roles!" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, page.tsx, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a353e637487c27079ab15d1a99ef2193ae58c0bc": "a353e63 Ya se enlazan datos pero no completos, un problema en la consulta sql q…" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, page.tsx, TablonAnalisis.tsx, feature/testing, main] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@af993fbd3820fa58b8d79213c4f60e3ae79001ce": "af993fb Fix/Monitorista" | kind=Commit | source=git | neighbors=[16a63d4 Merge branch 'feature/testing' …, repository.ts, repository.ts, feature/testing, main, f5fac0b Merge branch 'testing' into con…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b68a2b77559cba69587da44516c497087b7bf59c": "b68a2b7 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 8303881 Subida de header y footer, falt…] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c194e5488d641dda843f63b0e952d4081a438002": "c194e54 envio de solicitud de evidencias completado" | kind=Commit | source=git | neighbors=[905531c trabajando en panel de fiscalia, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@caef6e8dddc3704ff7381785115f3e7344376623": "caef6e8 Merge pull request #7 from presidenciaSJR/fix/incidentes-camara" | kind=Commit | source=git | neighbors=[50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, feature/testing, fix/subir-fotografias, main, b170599 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d04a29d5489b7170722d56787613aa84473ef564": "d04a29d correccion de navegacion entre pagians" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ed748a66d4165feeb638b671f565fd6afa2109ee": "ed748a6 fORMULARIO DE DENUNCIA CONCLUIDO" | kind=Commit | source=git | neighbors=[511fea4 Modulo de despacho, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "en_despacho_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/en-despacho/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 511fea4 Modulo de despacho, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto] | lang=en
- "exportar_excel_route": "route.ts" | kind=code-symbol | source=app/api/reportes-operativos/exportar-excel/route.ts:L1 | neighbors=[07543de Conexion de reportes con d1 y l…, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, 6adb8ad Correciones de versión y nombre, 863c575 Merge pull request #24 from pre…, de14b62 Merge branch 'feature/reportes'…] | lang=en
- "fiscalia_expedienteview": "ExpedienteView.tsx" | kind=code-symbol | source=components/fiscalia/ExpedienteView.tsx:L1 | neighbors=[1f7c0d7 Merge pull request #23 from pre…, 375d265 flujo de fiscalia, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, dsp(), ExpedienteView()] | lang=en
- "fiscalia_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/fiscalia/ProfileDropdown.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 997ef65 Merge pull request #2 from pres…, a291695 Merge branch 'feature/testing' …, f80d33f Merge branch 'feature/testing' …] | lang=en
- "lib_auth_client_authclient": "authClient" | kind=code-symbol | source=lib/auth-client.ts:L5 | neighbors=[page.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdownAuxiliar.tsx, profile-dropdown.tsx] | lang=en
- "manual_migrations_0006_formato_n": "0006_formato_n.sql" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "monitorista_subirfotodetenido": "SubirFotoDetenido.tsx" | kind=code-symbol | source=components/monitorista/SubirFotoDetenido.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 672bab5 libearciones para juzgado, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "n_coordinacion_actions": "actions.ts" | kind=code-symbol | source=lib/n-coordinacion/actions.ts:L1 | neighbors=[67b1cb7 ReporteWord, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, auth.ts, auth, guardarDatosCoordinacion()] | lang=en
- "notificaciones_repository": "repository.ts" | kind=code-symbol | source=lib/notificaciones/repository.ts:L1 | neighbors=[863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, actions.ts, db.ts, query(), mapper.ts] | lang=en
- "pendientes_despacho_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/pendientes-despacho/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a58a0f7 Despachos, ad3ec5f mejorando esto] | lang=en
- "prevencion_types": "types.ts" | kind=code-symbol | source=lib/prevencion/types.ts:L1 | neighbors=[514a705 refactorizacion sql, 863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, mapper.ts, repository.ts, AutoridadAdicional] | lang=en
- "proxy_route": "route.ts" | kind=code-symbol | source=app/api/expediente/proxy/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 75e03e9 puliendo flujo de juzgado-liber…, 863c575 Merge pull request #24 from pre…] | lang=en
- "scripts_load_context": "load-context.mjs" | kind=code-symbol | source=scripts/load-context.mjs:L1 | neighbors=[11ee4f2 mejorando flujo de 911, 22bf125 Merge pull request #20 from pre…, 863c575 Merge pull request #24 from pre…, e6bffc9 boveda conectada, buildInstructions(), buildKeywords()] | lang=en
- "seguimientos_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/seguimientos/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto] | lang=en
- "shared_pedirevidenciasmodal": "PedirEvidenciasModal.tsx" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L1 | neighbors=[TabSolicitudes.tsx, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9ec6056 flujo de juzgado-monitorista co…, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "sin_robos_reportesinrobos": "ReporteSinRobos.tsx" | kind=code-symbol | source=components/reportes/sin_robos/ReporteSinRobos.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 6adb8ad Correciones de versión y nombre] | lang=en
- "steps_pasopago": "PasoPago.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoPago.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx] | lang=en
- "ui_toastauto": "ToastAuto.tsx" | kind=code-symbol | source=components/ui/ToastAuto.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, f2c66e6 Extender roles y permisos finos…, page.tsx] | lang=en
- "admin_transito_mapper": "mapper.ts" | kind=code-symbol | source=lib/admin-transito/mapper.ts:L1 | neighbors=[rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), rowToUserWithRole(), toStr(), types.ts] | lang=en
- "admin_transito_permisos": "permisos.ts" | kind=code-symbol | source=lib/admin-transito/permisos.ts:L1 | neighbors=[layout.tsx, Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion] | lang=en
- "agente_infracciones_mapper": "mapper.ts" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L1 | neighbors=[inputToDbParams(), nvl(), rowToLiberacion(), str(), types.ts, CapturaInfractorInput] | lang=en
- "agente_infracciones_permisos": "permisos.ts" | kind=code-symbol | source=lib/agente_infracciones/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "agente_liberaciones_mapper": "mapper.ts" | kind=code-symbol | source=lib/agente_liberaciones/mapper.ts:L1 | neighbors=[rowToLiberacion(), str(), types.ts, LiberacionRow, service.ts, 06c55f5 Merge branch 'feature/testing' …] | lang=en
- "agente_liberaciones_permisos": "permisos.ts" | kind=code-symbol | source=lib/agente_liberaciones/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0fe445e29f2fa675a83a604d9d85cc407d9dfd71": "0fe445e vista de oficial" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 458bbfb registro de reporte de campo - …] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@28da720c3833ea537d1a6973a50bd1f6f59ecf8f": "28da720 Cambio de colores en dashboard y loader (correccion de imagen)" | kind=Commit | source=git | neighbors=[160d1e1 Monitorista V1.1, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@356d3a716d77e5bea2179a3cef18969daacd64dc": "356d3a7 Subir rol agregado, falta darle mejor vista" | kind=Commit | source=git | neighbors=[page.tsx, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=pt

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-011.json

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
