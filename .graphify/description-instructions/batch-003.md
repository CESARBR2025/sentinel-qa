# Node Description Batch 4 of 93

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

- "rondin_page": "page.tsx" | kind=code-symbol | source=app/oficial/rondin/page.tsx:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 290d651 feat(despacho): flujo integral …, 435348e corrigiendo flujo de rondin, 863c575 Merge pull request #24 from pre…, ac9ad49 Merge branch 'feature/testing' …] | lang=en
- "admin_actions": "actions.ts" | kind=code-symbol | source=lib/admin/actions.ts:L1 | neighbors=[createUser(), requireAdmin(), updateUser(), repository.ts, actualizarUsuario(), asignarRolUsuario()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@fcb223f54e825c649bebacb56b7b0bba99e43045": "fcb223f merge de testing" | kind=Commit | source=git | neighbors=[1dbd480 flujo de liberaciones completado, a6b7556 Formulario se puso a prueba, se…, formAnalisis.tsx, generarPresentacion.tsx, page.tsx, TablonAnalisis.tsx] | lang=nl
- "estadisticos_page": "page.tsx" | kind=code-symbol | source=app/estadisticos/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 07543de Conexion de reportes con d1 y l…, 2516723 Modulo de permisos, 41ea169 Merge branch 'testing' into con…] | lang=en
- "registrar_route": "route.ts" | kind=code-symbol | source=app/api/via/infracciones/registrar/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 2ca9f50 Formulario sin backend, 44a01c3 fase 3-4-5] | lang=en
- "agente_infracciones_service": "service.ts" | kind=code-symbol | source=lib/agente_infracciones/service.ts:L1 | neighbors=[actions.ts, mapper.ts, rowToLiberacion(), permisos.ts, tienePermiso(), repository.ts] | lang=en
- "ciudadano_page": "page.tsx" | kind=code-symbol | source=app/agente_911/ciudadano/page.tsx:L1 | neighbors=[permisos.ts, tieneAccesoSeccion(), service.ts, getCatalogos(), Formulario911.tsx, Ciudadano911Page()] | lang=en
- "incidentes_service": "service.ts" | kind=code-symbol | source=lib/incidentes/service.ts:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 22bf125 Merge pull request #20 from pre…, 290d651 feat(despacho): flujo integral …, 552d291 Merge branch 'testing' into con…] | lang=en
- "oficial_store": "store.ts" | kind=code-symbol | source=lib/oficial/store.ts:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 22b7b54 Merge branch 'feature/reportes'…, 22bf125 Merge pull request #20 from pre…, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "sin_robos_page": "page.tsx" | kind=code-symbol | source=app/sin_robos/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…] | lang=en
- "911_permisos": "permisos.ts" | kind=code-symbol | source=lib/911/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), obtenerRolNombre(), PermisoSeccion] | lang=en
- "auxiliar_actions": "actions.ts" | kind=code-symbol | source=lib/auxiliar/actions.ts:L1 | neighbors=[bool(), requireAuxiliar(), str(), upsertChecklistAction(), permisos.ts, Accion] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@997ef65431c9b4b9f0c02b0b1479177244a4996d": "997ef65 Merge pull request #2 from presidenciaSJR/juzgado" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts, service.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f80d33f79def9197aaad03aabc73ae30d089ff9f": "f80d33f Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[997ef65 Merge pull request #2 from pres…, a2907e2 Boton agregado para crear roles!, actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts] | lang=en
- "d1_noiniciada_page": "page.tsx" | kind=code-symbol | source=app/d1_noiniciada/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 22b7b54 Merge branch 'feature/reportes'…, 2516723 Modulo de permisos, 41ea169 Merge branch 'testing' into con…] | lang=en
- "dashboard_module_cards": "module-cards.tsx" | kind=code-symbol | source=app/dashboard/module-cards.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 06c55f5 Merge branch 'feature/testing' …, 0e33bf6 feat: módulo Admin, Prórroga, F…, 11e8817 Merge branch 'testing' into juz…] | lang=en
- "fiscalia_page": "page.tsx" | kind=code-symbol | source=app/fiscalia/page.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 2db162a flujo de asegurados, 388b997 Apartados para subir fotografia…, 3ec7484 Header y Footer Fix, 44ebbc4 Merge branch 'feature/testing' …, 5bbdda8 Merge pull request #8 from pres…] | lang=en
- "incidentes_types": "types.ts" | kind=code-symbol | source=lib/incidentes/types.ts:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 290d651 feat(despacho): flujo integral …, 435348e corrigiendo flujo de rondin, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto] | lang=en
- "agente_liberaciones_repository": "repository.ts" | kind=code-symbol | source=lib/agente_liberaciones/repository.ts:L1 | neighbors=[actualizarInfraccionEstatus(), actualizarInfractor(), actualizarRevisionDocumento(), actualizarSolicitudEstatus(), insertarOrdenPago(), obtenerConceptoPorFraccion()] | lang=en
- "busquedas_page": "page.tsx" | kind=code-symbol | source=app/prevencion/busquedas/page.tsx:L1 | neighbors=[BusquedasPage(), TIPO_CFG, auth.ts, auth, BusquedasFiltros.tsx, BusquedasFiltros()] | lang=en
- "ciudadano_formulario911": "Formulario911.tsx" | kind=code-symbol | source=app/agente_911/ciudadano/Formulario911.tsx:L1 | neighbors=[Formulario911(), libraries, actions.ts, createIncidenteCliente(), page.tsx, 0068216 Mejora de Dashboard, Login y tr…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0b210fa6152f4caa2943cf28b5e12d813c87664c": "0b210fa Merge pull request #12 from presidenciaSJR/conexion" | kind=Commit | source=git | neighbors=[actions.ts, mapper.ts, types.ts, actions.ts, LiberacionesDashboard.tsx, LiberacionesTable.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0d9172a67b265622b6c0916bc9de38e96ba4ae86": "0d9172a mejorando flujo de 911-despacho" | kind=Commit | source=git | neighbors=[0caf5dd Fixes, FiltrosIncidentes.tsx, layout.tsx, feature/testing, main, Formulario911.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@dc063f37c7d04fa2a7c98be48e93ed98a58c35b5": "dc063f3 gestion de oficiales correctamente" | kind=Commit | source=git | neighbors=[91c36bf validando orden de pago, actions.ts, layout.tsx, ModalDestituirOficial.tsx, ModalReactivarOficial.tsx, NuevoOficialForm.tsx] | lang=nl
- "d1_page": "page.tsx" | kind=code-symbol | source=app/d1/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, 07543de Conexion de reportes con d1 y l…, 2516723 Modulo de permisos, 41ea169 Merge branch 'testing' into con…] | lang=en
- "infraccionid_route": "route.ts" | kind=code-symbol | source=app/api/via/pagos/finalizar-instante/[ordenPagoId]/[infraccionId]/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 3ec7484 Header y Footer Fix, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "reportes_d1_route": "route.ts" | kind=code-symbol | source=app/api/reportes-d1/route.ts:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 27dcb21 Merge branch 'feature/testing' …, 44a01c3 fase 3-4-5, 44ebbc4 Merge branch 'feature/testing' …] | lang=en
- "scripts_benchmark": "benchmark.mjs" | kind=code-symbol | source=scripts/benchmark.mjs:L1 | neighbors=[22bf125 Merge pull request #20 from pre…, 7a1ae94 911-rondin, 863c575 Merge pull request #24 from pre…, AGENTS_PATH, agentsChars, BOVEDA_DIR] | lang=en
- "analisis_generarpresentacion": "generarPresentacion.tsx" | kind=code-symbol | source=components/analisis/generarPresentacion.tsx:L1 | neighbors=[btnBackStyle, btnFinishStyle, btnNextStyle, cardStyle, labelStyle, mapBoxStyle] | lang=en
- "analisis_page": "page.tsx" | kind=code-symbol | source=app/analisis/page.tsx:L1 | neighbors=[actionTextStyle, cardContentStyle, cardDescStyle, cardStyle, cardTitleStyle, decoratorLine] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@090c4dd6c28d10a74ad8eec7001e6fa9a4b5e8b5": "090c4dd vista de fiscalia" | kind=Commit | source=git | neighbors=[actions.ts, page.tsx, ProfileDropdown.tsx, repository.ts, service.ts, ToastExito.tsx] | lang=nl
- "components_formularioinfraccion": "FormularioInfraccion.tsx" | kind=code-symbol | source=features/via/oficiales/components/FormularioInfraccion.tsx:L1 | neighbors=[page.tsx, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago] | lang=en
- "incidentes_camara_page": "page.tsx" | kind=code-symbol | source=app/monitorista/incidentes-camara/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 27dcb21 Merge branch 'feature/testing' …, 50101e2 Merge pull request #6 from pres…, 5311c24 Editar Registros, 5618308 guardado e evidencias con ed, 5d179c0 Apartado de reportes] | lang=en
- "rol_servicios_catalogos_actions": "catalogos-actions.ts" | kind=code-symbol | source=lib/rol-servicios/catalogos-actions.ts:L1 | neighbors=[11be750 Fase 1 de correccion - completa…, 3ec7484 Header y Footer Fix, 6feefe2 BackEnd completo para hacer la …, 863c575 Merge pull request #24 from pre…, c27a9ee fase prefinal, helpers.ts] | lang=en
- "subir_foto_route": "route.ts" | kind=code-symbol | source=app/api/monitorista/detenidos/[id]/subir-foto/route.ts:L1 | neighbors=[1f7c0d7 Merge pull request #23 from pre…, 27dcb21 Merge branch 'feature/testing' …, 375d265 flujo de fiscalia, 388b997 Apartados para subir fotografia…, 5618308 guardado e evidencias con ed, 672bab5 libearciones para juzgado] | lang=en
- "911_service": "service.ts" | kind=code-symbol | source=lib/911/service.ts:L1 | neighbors=[repository.ts, contarPorEstatus(), listarIncidentes(), obtenerCatalogos(), obtenerIncidente(), obtenerIncidenteConExtras()] | lang=en
- "admin_transito_repository": "repository.ts" | kind=code-symbol | source=lib/admin-transito/repository.ts:L1 | neighbors=[mapper.ts, rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), actualizarOficialRecord(), actualizarUserInfo()] | lang=en
- "auxiliar_page": "page.tsx" | kind=code-symbol | source=app/auxiliar/page.tsx:L1 | neighbors=[helpers.ts, getUserWithRole(), obtenerHubRol(), AuxiliarPage(), permisos.ts, tienePermiso()] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0e33bf68e8273b1f03c79b3bca0bcb6905c5e739": "0e33bf6 feat: módulo Admin, Prórroga, Filtros medidas, Autoridades adicionales …" | kind=Commit | source=git | neighbors=[actions.ts, layout.tsx, page.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@126b4d1cd0263f9642cdcd9b368513963ad3af33": "126b4d1 Monitorista V1" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-003.json

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
