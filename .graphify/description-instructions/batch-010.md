# Node Description Batch 11 of 86

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9550203776dbe9f8ba3e1e21c447ef64c9b2713a": "9550203 Cambios en presentacion, se genera" | kind=Commit | source=git | neighbors=[generarPresentacion.tsx, conexion, testing, 8355ac0 Merge branch 'feature/testing' …, FormularioD1.tsx, route.ts] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@95b78c1d99e3697b5e2349399de1c7adc38ec744": "95b78c1 cambios de incidentes" | kind=Commit | source=git | neighbors=[4d4a9b7 formulario de notificaciones po…, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2907e2eb0150bea16791d3d9786037d34db1dca": "a2907e2 Boton agregado para crear roles!" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, page.tsx, conexion, testing, f80d33f Merge branch 'feature/testing' …, page.tsx] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a353e637487c27079ab15d1a99ef2193ae58c0bc": "a353e63 Ya se enlazan datos pero no completos, un problema en la consulta sql q…" | kind=Commit | source=git | neighbors=[formAnalisis.tsx, generarPresentacion.tsx, page.tsx, TablonAnalisis.tsx, conexion, testing] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@af993fbd3820fa58b8d79213c4f60e3ae79001ce": "af993fb Fix/Monitorista" | kind=Commit | source=git | neighbors=[16a63d4 Merge branch 'feature/testing' …, repository.ts, repository.ts, conexion, testing, f5fac0b Merge branch 'testing' into con…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c194e5488d641dda843f63b0e952d4081a438002": "c194e54 envio de solicitud de evidencias completado" | kind=Commit | source=git | neighbors=[905531c trabajando en panel de fiscalia, conexion, testing, c4523ac tabla de fiscalia, evidencias f…, mapper.ts, PedirEvidenciasModal.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@caef6e8dddc3704ff7381785115f3e7344376623": "caef6e8 Merge pull request #7 from presidenciaSJR/fix/incidentes-camara" | kind=Commit | source=git | neighbors=[50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, conexion, testing, b170599 Merge branch 'feature/testing' …, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d04a29d5489b7170722d56787613aa84473ef564": "d04a29d correccion de navegacion entre pagians" | kind=Commit | source=git | neighbors=[conexion, testing, 0c31cc2 Merge branch 'testing' into juz…, 126b4d1 Monitorista V1, a291695 Merge branch 'feature/testing' …, da33516 Merge pull request #3 from pres…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d2a4a5ebc66e5e7e114d49b2f87f28896f03a895": "d2a4a5e guardado de nuemro exterior, interior, e implementacion de mapa para gu…" | kind=Commit | source=git | neighbors=[7d7ebb1 merge de archivos, conexion, testing, 166a26b Merge branch 'feature/testing' …, 56a8ec4 Impkementacion de pa ay guardad…, schema.ts] | lang=pt
- "en_despacho_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/en-despacho/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 511fea4 Modulo de despacho, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "fiscalia_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/fiscalia/ProfileDropdown.tsx:L1 | neighbors=[page.tsx, 090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 997ef65 Merge pull request #2 from pres…, a291695 Merge branch 'feature/testing' …, f80d33f Merge branch 'feature/testing' …] | lang=en
- "fotos_page": "page.tsx" | kind=code-symbol | source=app/oficial/reportes/[id]/fotos/page.tsx:L1 | neighbors=[388b997 Apartados para subir fotografia…, 514a705 refactorizacion sql, 672bab5 libearciones para juzgado, 9d803f2 fix api maps, de5682f Merge pull request #10 from pre…, FotosDetenidoPage()] | lang=en
- "lib_auth_client_authclient": "authClient" | kind=code-symbol | source=lib/auth-client.ts:L5 | neighbors=[page.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdown.tsx, ProfileDropdownAuxiliar.tsx, profile-dropdown.tsx] | lang=en
- "lib_error_handler_apperror": "AppError" | kind=code-symbol | source=lib/error-handler.ts:L1 | neighbors=[actions.ts, actions.ts, actions.ts, error-handler.ts, .constructor(), ConflictError] | lang=en
- "listar_route": "route.ts" | kind=code-symbol | source=app/api/detenidos/listar/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "manual_migrations_0006_formato_n": "0006_formato_n.sql" | kind=code-symbol | source=lib/db/manual-migrations/0006_formato_n.sql:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, formato_n_armas_aseguradas] | lang=en
- "modulo_incidentes_reporttables": "ReportTables.tsx" | kind=code-symbol | source=components/reportes/modulo_incidentes/ReportTables.tsx:L1 | neighbors=[1265204 paginacion por tablas, 4400923 Merge branch 'feature/testing' …, 552d291 Merge branch 'testing' into con…, b170599 Merge branch 'feature/testing' …, bd1a223 Merge branch 'feature/vistas-re…, bf2e7ed Reportes del modulo de incident…] | lang=en
- "notificaciones_repository": "repository.ts" | kind=code-symbol | source=lib/notificaciones/repository.ts:L1 | neighbors=[ad3ec5f mejorando esto, actions.ts, db.ts, query(), mapper.ts, rowToNotificacion()] | lang=en
- "pendientes_despacho_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/pendientes-despacho/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, a58a0f7 Despachos, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "prevencion_types": "types.ts" | kind=code-symbol | source=lib/prevencion/types.ts:L1 | neighbors=[514a705 refactorizacion sql, c27a9ee fase prefinal, mapper.ts, repository.ts, AutoridadAdicional, BusquedaItem] | lang=en
- "rol_servicios_servicetable": "ServiceTable.tsx" | kind=code-symbol | source=components/rol_servicios/ServiceTable.tsx:L1 | neighbors=[c27a9ee fase prefinal, page.tsx, deviceBox, inputStyle, labelMono, Props] | lang=en
- "seguimientos_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/busquedas/[id]/seguimientos/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "shared_pedirevidenciasmodal": "PedirEvidenciasModal.tsx" | kind=code-symbol | source=components/shared/PedirEvidenciasModal.tsx:L1 | neighbors=[TabSolicitudes.tsx, 5f13b34 Merge branch 'feature/testing' …, 9ec6056 flujo de juzgado-monitorista co…, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …, PedirEvidenciasModal.tsx] | lang=en
- "solicitudes_solicitudes_client": "solicitudes-client.tsx" | kind=code-symbol | source=app/corralon/solicitudes/solicitudes-client.tsx:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, page.tsx, types.ts, TabSolicitudes, estatusBg()] | lang=en
- "steps_pasopago": "PasoPago.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoPago.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, InfraccionCreada] | lang=en
- "ui_toastauto": "ToastAuto.tsx" | kind=code-symbol | source=components/ui/ToastAuto.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, page.tsx, page.tsx] | lang=en
- "admin_transito_mapper": "mapper.ts" | kind=code-symbol | source=lib/admin-transito/mapper.ts:L1 | neighbors=[rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), rowToUserWithRole(), toStr(), types.ts] | lang=en
- "admin_transito_oficialestable": "OficialesTable.tsx" | kind=code-symbol | source=components/admin-transito/OficialesTable.tsx:L1 | neighbors=[ModalDestituirOficial.tsx, ModalReactivarOficial.tsx, AccionModal, Departamento, Oficial, OficialesTable()] | lang=en
- "agente_infracciones_mapper": "mapper.ts" | kind=code-symbol | source=lib/agente_infracciones/mapper.ts:L1 | neighbors=[inputToDbParams(), nvl(), rowToLiberacion(), str(), types.ts, CapturaInfractorInput] | lang=en
- "agente_liberaciones_mapper": "mapper.ts" | kind=code-symbol | source=lib/agente_liberaciones/mapper.ts:L1 | neighbors=[rowToLiberacion(), str(), types.ts, LiberacionRow, service.ts, 06c55f5 Merge branch 'feature/testing' …] | lang=en
- "captura_page": "page.tsx" | kind=code-symbol | source=app/infracciones/captura/page.tsx:L1 | neighbors=[CapturaPage(), FormularioInfraccion.tsx, auth.ts, auth, ProfileDropdown.tsx, ProfileDropdown()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@28da720c3833ea537d1a6973a50bd1f6f59ecf8f": "28da720 Cambio de colores en dashboard y loader (correccion de imagen)" | kind=Commit | source=git | neighbors=[160d1e1 Monitorista V1.1, conexion, testing, 7c1d096 Merge branch 'feature/denuncias…, LoadingProvider.tsx, enable-2fa.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@356d3a716d77e5bea2179a3cef18969daacd64dc": "356d3a7 Subir rol agregado, falta darle mejor vista" | kind=Commit | source=git | neighbors=[page.tsx, conexion, testing, 7400135 Merge branch 'feature/testing' …, FormularioRol.tsx, route.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@3b10d723286e7aa7720e192c365c543dbbe70705": "3b10d72 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 283f342 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@4d4a9b714485a6d376fdbde62ed20078b2e4aa8f": "4d4a9b7 formulario de notificaciones por radio" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, 95b78c1 cambios de incidentes] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@81b982962d7b332ec29c5d3e73301ba0b855d4f0": "81b9829 Cambios para guardado de persinas afectadas" | kind=Commit | source=git | neighbors=[conexion, testing, 305b0bd se quitan campos, actions.ts, FormSection.tsx, d5e0e56 Campo para agregar detenidos de…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@98e7e6eb5f17a46e7f4c211ed1ddbac02e91c1f6": "98e7e6e vista de reportes de d1" | kind=Commit | source=git | neighbors=[6f8a089 Vista de estadisticos diarios, …, conexion, testing, 75ca4b2 Merge pull request #9 from pres…, b233bc7 Merge branch 'testing' into con…, D1Filters.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a6b7556e4d852eb3271e60ee87a5cc2814f2c870": "a6b7556 Formulario se puso a prueba, se prellena con datos de denuncia, campo e…" | kind=Commit | source=git | neighbors=[3249f00 Cambios en rellenado de ppt!, page.tsx, TablonAnalisis.tsx, conexion, testing, a2e0623 Consolidado de formatos N y Sub…] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ecebe385dfbc294570d86c996013af6fadd5d874": "ecebe38 Guardado de longitud y latitud en vista de llamada, corrección de guard…" | kind=Commit | source=git | neighbors=[93dd3ea Merge pull request #1 from pres…, conexion, testing, 7d7ebb1 merge de archivos, schema.ts, actions.ts] | lang=nl
- "corralon_permisos": "permisos.ts" | kind=code-symbol | source=lib/corralon/permisos.ts:L1 | neighbors=[5a1b5d5 empezando corralon, Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPermisosUsuario(), obtenerPlantillaRol()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-010.json

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
