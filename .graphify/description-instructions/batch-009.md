# Node Description Batch 10 of 93

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@5ef7cf3542628cc5d6a4fb8cc32b9a2856a05bf5": "5ef7cf3 Agregar los campos faltantes" | kind=Commit | source=git | neighbors=[4c9fa8a vista de reporte de d1 no inici…, feature/testing, main, 0b210fa Merge pull request #12 from pre…, 712c116 Merge branch 'testing' into con…, ef95840 Merge branch 'feature/testing' …] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@9ec605647493f07c106fc892f96cd7940d488318": "9ec6056 flujo de juzgado-monitorista completo" | kind=Commit | source=git | neighbors=[821abe0 replicando flujo de fiscalia-> …, actions.ts, repository.ts, service.ts, TabSolicitudes.tsx, feature/monitorista-reportes] | lang=nl
- "components_mapadireccionregistro": "MapaDireccionRegistro.tsx" | kind=code-symbol | source=features/via/oficiales/components/MapaDireccionRegistro.tsx:L1 | neighbors=[12aab65 fase 4, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a21f03f fix bugs reporte denuncia, b5233a8 implementando via como modulo d…] | lang=en
- "corralon_actions": "actions.ts" | kind=code-symbol | source=lib/corralon/actions.ts:L1 | neighbors=[16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, 863c575 Merge pull request #24 from pre…, obtenerDashboardCorralon(), obtenerSolicitudes(), TabSolicitudes] | lang=en
- "despacho_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/[id]/despacho/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a58a0f7 Despachos, ad3ec5f mejorando esto] | lang=en
- "finalizarproceso_route": "route.ts" | kind=code-symbol | source=app/api/agente_juzgado/finalizarProceso/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 75e03e9 puliendo flujo de juzgado-liber…, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "fiscalia_formularioasegurado": "FormularioAsegurado.tsx" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L1 | neighbors=[2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, actions.ts] | lang=en
- "fiscalia_formulariopuestadisposicion": "FormularioPuestaDisposicion.tsx" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L1 | neighbors=[2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, actions.ts] | lang=en
- "fiscalia_pedirevidenciasmodal": "PedirEvidenciasModal.tsx" | kind=code-symbol | source=components/fiscalia/PedirEvidenciasModal.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 5f13b34 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 905531c trabajando en panel de fiscalia, 997ef65 Merge pull request #2 from pres…] | lang=en
- "flota_repository": "repository.ts" | kind=code-symbol | source=lib/flota/repository.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, a21f03f fix bugs reporte denuncia, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…] | lang=en
- "infracciones_repository": "repository.ts" | kind=code-symbol | source=features/via/infracciones/repository.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "iniciarproceso_route": "route.ts" | kind=code-symbol | source=app/api/agente_juzgado/iniciarProceso/route.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 75e03e9 puliendo flujo de juzgado-liber…, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "medidas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/medidas/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto] | lang=en
- "monitorista_expediente": "expediente.ts" | kind=code-symbol | source=lib/monitorista/expediente.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …] | lang=en
- "n_coordinacion_repository": "repository.ts" | kind=code-symbol | source=lib/n-coordinacion/repository.ts:L1 | neighbors=[67b1cb7 ReporteWord, 7e39526 Mejoras UI/UX, 863c575 Merge pull request #24 from pre…, route.ts, actions.ts, db.ts] | lang=en
- "oficial_service_verificarroloficial": "verificarRolOficial()" | kind=code-symbol | source=lib/oficial/service.ts:L79 | neighbors=[route.ts, page.tsx, page.tsx, page.tsx, page.tsx, route.ts] | lang=en
- "partials_footer": "Footer.tsx" | kind=code-symbol | source=components/partials/Footer.tsx:L1 | neighbors=[page.tsx, page.tsx, page.tsx, 0068216 Mejora de Dashboard, Login y tr…, 3b10d72 Merge branch 'feature/testing' …, 3ec7484 Header y Footer Fix] | lang=en
- "prevencion_agregarautoridadform": "AgregarAutoridadForm.tsx" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9faf222 Merge branch 'feature/testing' …] | lang=en
- "reportes_incidentes_service": "service.ts" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L1 | neighbors=[13f7f39 Reporte-incidentes, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto, f7b1aac Merge branch 'feature/testing' …, fcb223f merge de testing, route.ts] | lang=en
- "steps_pasoconductor": "PasoConductor.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConductor.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadanoConductor.tsx] | lang=en
- "steps_pasodescuentos": "PasoDescuentos.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoDescuentos.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadanoConductor.tsx] | lang=en
- "visitas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/medidas/[id]/visitas/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, ad3ec5f mejorando esto] | lang=en
- "911_pagination": "Pagination.tsx" | kind=code-symbol | source=components/911/Pagination.tsx:L1 | neighbors=[arrowBtnStyle, containerStyle, infoStyle, labelStyle, pageNumberStyle, Pagination()] | lang=en
- "admin_admin_styles": "admin-styles.ts" | kind=code-symbol | source=app/admin/admin-styles.ts:L1 | neighbors=[btnPrimario, btnSecundario, cardStyle, inputStyle, labelStyle, pageWrap] | lang=en
- "admin_layout": "layout.tsx" | kind=code-symbol | source=app/admin/layout.tsx:L1 | neighbors=[AdminLayout(), helpers.ts, getUserWithRole(), auth.ts, auth, constants.ts] | lang=en
- "agente_infracciones_capturardatosinfractormodal": "CapturarDatosInfractorModal.tsx" | kind=code-symbol | source=components/agente_infracciones/CapturarDatosInfractorModal.tsx:L1 | neighbors=[actions.ts, capturarInfractorInfraccionesAction(), CapturarDatosInfractorModal(), DatosForm(), Field(), FieldName] | lang=en
- "agente_juzgado_permisos": "permisos.ts" | kind=code-symbol | source=lib/agente_juzgado/permisos.ts:L1 | neighbors=[Accion, guardarPermiso(), guardarPlantillaSeccion(), obtenerPlantillaRol(), PermisoSeccion, Seccion] | lang=en
- "auxiliar_service": "service.ts" | kind=code-symbol | source=lib/auxiliar/service.ts:L1 | neighbors=[actions.ts, repository.ts, obtenerCuestionariosRobo(), obtenerParesReporte(), upsertChecklist(), guardarChecklist()] | lang=en
- "calcular_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-fge/calcular/route.ts:L1 | neighbors=[GET(), auth.ts, auth, formato-n-fge-service.ts, calcularConteosPorFecha(), permisos.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2145fb21f4b9adae89074913aa8d4b7ec22d0d0": "a2145fb Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, Pagination.tsx, page.tsx, feature/monitorista-reportes, feature/testing, fix/detenidos] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c4523aca7e1438c596b579690aa1366a0ae9ec33": "c4523ac tabla de fiscalia, evidencias funcional" | kind=Commit | source=git | neighbors=[c194e54 envio de solicitud de evidencia…, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=nl
- "components_capturardatostitularsection": "CapturarDatosTitularSection.tsx" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection()] | lang=en
- "exportar_robo_route": "route.ts" | kind=code-symbol | source=app/api/auxiliar/exportar-robo/route.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5f13b34 Merge branch 'feature/testing' …, 6adb8ad Correciones de versión y nombre, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "fiscalia_cargaroficiosection": "CargarOficioSection.tsx" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 863c575 Merge pull request #24 from pre…, 953d38a implementando vista de fiscalia] | lang=en
- "flota_types": "types.ts" | kind=code-symbol | source=lib/flota/types.ts:L1 | neighbors=[ModalReactivarOficial.tsx, NuevoOficialForm.tsx, OficialesTable.tsx, PatrullaSelector.tsx, 16a63d4 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…] | lang=en
- "incidentes_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/route.ts:L1 | neighbors=[0d9172a mejorando flujo de 911-despacho, 22bf125 Merge pull request #20 from pre…, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 6feefe2 BackEnd completo para hacer la …, 77ddf58 Merge branch 'feature/testing' …] | lang=en
- "listar_route": "route.ts" | kind=code-symbol | source=app/api/detenidos/listar/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 863c575 Merge pull request #24 from pre…, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis] | lang=en
- "notificaciones_checker": "checker.ts" | kind=code-symbol | source=lib/notificaciones/checker.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 11be750 Fase 1 de correccion - completa…, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …, 863c575 Merge pull request #24 from pre…, a7218bd Merge pull request #4 from pres…] | lang=en
- "oficiales_page": "page.tsx" | kind=code-symbol | source=app/admin-transito/oficiales/page.tsx:L1 | neighbors=[0068216 Mejora de Dashboard, Login y tr…, 16a63d4 Merge branch 'feature/testing' …, 514a705 refactorizacion sql, 863c575 Merge pull request #24 from pre…, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal] | lang=en
- "partials_subheader_subheader": "SubHeader()" | kind=code-symbol | source=components/partials/SubHeader.tsx:L18 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en

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
