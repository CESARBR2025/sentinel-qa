# Node Description Batch 4 of 84

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

- "components_formularioinfraccion": "FormularioInfraccion.tsx" | kind=code-symbol | source=features/via/oficiales/components/FormularioInfraccion.tsx:L1 | neighbors=[page.tsx, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "d1_page": "page.tsx" | kind=code-symbol | source=app/d1/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 07543de Conexion de reportes con d1 y l…, 2516723 Modulo de permisos, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql] | lang=en
- "medidas_page": "page.tsx" | kind=code-symbol | source=app/prevencion/medidas/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 1970615 vista de medidas, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql] | lang=en
- "oficial_page": "page.tsx" | kind=code-symbol | source=app/oficial/page.tsx:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 0fe445e vista de oficial, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 290d651 feat(despacho): flujo integral …] | lang=en
- "registrar_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/registrar/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2ca9f50 Formulario sin backend, 44a01c3 fase 3-4-5] | lang=en
- "admin_transito_repository": "repository.ts" | kind=code-symbol | source=lib/admin-transito/repository.ts:L1 | neighbors=[mapper.ts, rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), actualizarOficialRecord(), actualizarUserInfo()] | lang=en
- "analisis_generarpresentacion": "generarPresentacion.tsx" | kind=code-symbol | source=components/analisis/generarPresentacion.tsx:L1 | neighbors=[btnBackStyle, btnFinishStyle, btnNextStyle, cardStyle, labelStyle, mapBoxStyle] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@126b4d1cd0263f9642cdcd9b368513963ad3af33": "126b4d1 Monitorista V1" | kind=Commit | source=git | neighbors=[conexion, testing, da33516 Merge pull request #3 from pres…, route.ts, route.ts, module-cards.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@2dde72009bc9dbe13a6a3886ce1bee73887356d5": "2dde720 Merge pull request #14 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[22b7b54 Merge branch 'feature/reportes'…, actions.ts, CapturarDatosInfractorModal.tsx, InfraccionesDashboard.tsx, InfraccionesTable.tsx, mapper.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@46b2c891040e758bb11656ea5bc2b0a5e9cde851": "46b2c89 Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 160d1e1 Monitorista V1.1, conexion, testing, 11e8817 Merge branch 'testing' into juz…, route.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@da335165100725cf72f3294443f794992cc90e5f": "da33516 Merge pull request #3 from presidenciaSJR/feature/monitorista" | kind=Commit | source=git | neighbors=[126b4d1 Monitorista V1, d04a29d correccion de navegacion entre …, conexion, testing, 160d1e1 Monitorista V1.1, route.ts] | lang=en
- "incidentes_camara_page": "page.tsx" | kind=code-symbol | source=app/monitorista/incidentes-camara/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …] | lang=en
- "reportes_d1_route": "route.ts" | kind=code-symbol | source=app/api/reportes-d1/route.ts:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 27dcb21 Merge branch 'feature/testing' …, 44a01c3 fase 3-4-5, 44ebbc4 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …] | lang=en
- "reportes_formato_n_consolidado_service": "formato-n-consolidado-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-consolidado-service.ts:L1 | neighbors=[a2e0623 Consolidado de formatos N y Sub…, f5fac0b Merge branch 'testing' into con…, route.ts, formato-n-armas-aseguradas-service.ts, FormatoNArmaAsegurada, obtenerArmasAseguradasPorFecha()] | lang=en
- "reportes_formato_n_fge_service": "formato-n-fge-service.ts" | kind=code-symbol | source=lib/reportes/formato-n-fge-service.ts:L1 | neighbors=[route.ts, 06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …] | lang=en
- "rol_servicios_mapper": "mapper.ts" | kind=code-symbol | source=lib/rol-servicios/mapper.ts:L1 | neighbors=[c27a9ee fase prefinal, rowToBodyCam(), rowToEstadoFuerzaConcepto(), rowToMedioCanalizacion(), rowToRadio(), rowToRolAsignacion()] | lang=en
- "solicitudes_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/solicitudes/route.ts:L1 | neighbors=[126b4d1 Monitorista V1, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed] | lang=en
- "911_permisos": "permisos.ts" | kind=code-symbol | source=lib/911/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), obtenerRolNombre(), PermisoSeccion] | lang=en
- "admin_repository": "repository.ts" | kind=code-symbol | source=lib/admin/repository.ts:L1 | neighbors=[actions.ts, mapper.ts, rowToRol(), rowToUsuarioLista(), actualizarUsuario(), asignarRolUsuario()] | lang=en
- "auth_helpers": "helpers.ts" | kind=code-symbol | source=lib/auth/helpers.ts:L1 | neighbors=[actions.ts, layout.tsx, layout.tsx, getUserWithRole(), rowToUserWithRole(), UserWithRole] | lang=en
- "auxiliar_permisos": "permisos.ts" | kind=code-symbol | source=lib/auxiliar/permisos.ts:L1 | neighbors=[actions.ts, page.tsx, Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPermisosUsuario()] | lang=en
- "ciudadano_page": "page.tsx" | kind=code-symbol | source=app/agente_911/ciudadano/page.tsx:L1 | neighbors=[permisos.ts, tieneAccesoSeccion(), service.ts, getCatalogos(), Formulario911.tsx, Ciudadano911Page()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0c31cc284a0b556a865b9d45217e793fb60a5485": "0c31cc2 Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[page.tsx, conexion, testing, 46b2c89 Merge branch 'testing' into juz…, FormularioD1.tsx, page.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@672bab5a15c2d12a174d78669bc3766bda96d83c": "672bab5 libearciones para juzgado" | kind=Commit | source=git | neighbors=[page.tsx, SubirFotoDetenido.tsx, conexion, testing, 46f24f8 generica function for infractio…, ff3622b Merge pull request #11 from pre…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@aaddee5724bd0502be1074ff7c9f23a79e5ddaa1": "aaddee5 Merge branch 'feature/testing' into feature/denuncias" | kind=Commit | source=git | neighbors=[93dd3ea Merge pull request #1 from pres…, conexion, testing, 69a557f CAMBIO CORREGIDO, page.tsx, schema.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@de5682fb11072104ed8ddbb320a1aada57193083": "de5682f Merge pull request #10 from presidenciaSJR/fix/subir-fotografias" | kind=Commit | source=git | neighbors=[388b997 Apartados para subir fotografia…, 75ca4b2 Merge pull request #9 from pres…, page.tsx, SubirFotoDetenido.tsx, conexion, testing] | lang=en
- "juridico_page": "page.tsx" | kind=code-symbol | source=app/prevencion/juridico/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 514a705 refactorizacion sql] | lang=en
- "permisos_registro": "registro.ts" | kind=code-symbol | source=lib/permisos/registro.ts:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5a1b5d5 empezando corralon, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@22b7b54fd301460187e0de0fea19c2647daf780e": "22b7b54 Merge branch 'feature/reportes' into feature/testing" | kind=Commit | source=git | neighbors=[18f5bac llamada en card, conexion, testing, 2516723 Modulo de permisos, 2dde720 Merge pull request #14 from pre…, 552d291 Merge branch 'testing' into con…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@388b99707848ef0e0e02349ce0d31614ef0719ae": "388b997 Apartados para subir fotografias de los detenidos" | kind=Commit | source=git | neighbors=[page.tsx, SubirFotoDetenido.tsx, conexion, testing, de5682f Merge pull request #10 from pre…, FilaDetenidoRol.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@821abe04c3a968d9bb8106fe453d78e2df8be143": "821abe0 replicando flujo de fiscalia-> juzgado" | kind=Commit | source=git | neighbors=[11e8817 Merge branch 'testing' into juz…, actions.ts, actions.ts, CerrarCasoModal.tsx, mapper.ts, page.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ff3622b8be4baebcbb5d1a21ffdf1aa6371b964d": "ff3622b Merge pull request #11 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, actions.ts, BotonVerDetalle.tsx, CargarOficioSection.tsx, ConfirmacionModal.tsx] | lang=en
- "fiscalia_fiscaliadashboard": "FiscaliaDashboard.tsx" | kind=code-symbol | source=components/fiscalia/FiscaliaDashboard.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 2dde720 Merge pull request #14 from pre…, 5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, d64c8cd flujo de infracciones-liberacio…] | lang=en
- "formato_n_atencion_victimas_page": "page.tsx" | kind=code-symbol | source=app/formato-n-atencion-victimas/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fge_page": "page.tsx" | kind=code-symbol | source=app/formato-n-fge/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_fgr_page": "page.tsx" | kind=code-symbol | source=app/formato-n-fgr/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "formato_n_medios_alternativos_page": "page.tsx" | kind=code-symbol | source=app/formato-n-medios-alternativos/page.tsx:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 8355ac0 Merge branch 'feature/testing' …] | lang=en
- "historial_page": "page.tsx" | kind=code-symbol | source=app/monitorista/historial/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 388b997 Apartados para subir fotografia…, 514a705 refactorizacion sql, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …] | lang=en
- "incidentes_types": "types.ts" | kind=code-symbol | source=lib/incidentes/types.ts:L1 | neighbors=[290d651 feat(despacho): flujo integral …, ad3ec5f mejorando esto, HistorialIncidente.tsx, mapper.ts, repository.ts, service.ts] | lang=en
- "rol_servicios_catalogos_actions": "catalogos-actions.ts" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, c27a9ee fase prefinal, auth.ts, auth, db.ts, query()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-003.json

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
