# Node Description Batch 9 of 87

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

- "despacho_route": "route.ts" | kind=code-symbol | source=app/api/incidentes/[id]/despacho/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, a58a0f7 Despachos, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "fiscalia_formularioasegurado": "FormularioAsegurado.tsx" | kind=code-symbol | source=components/fiscalia/FormularioAsegurado.tsx:L1 | neighbors=[2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, actions.ts, guardarDetallesAseguradosAction()] | lang=en
- "fiscalia_formulariopuestadisposicion": "FormularioPuestaDisposicion.tsx" | kind=code-symbol | source=components/fiscalia/FormularioPuestaDisposicion.tsx:L1 | neighbors=[2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, actions.ts, guardarPuestaDisposicionAction()] | lang=en
- "flota_repository": "repository.ts" | kind=code-symbol | source=lib/flota/repository.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, a21f03f fix bugs reporte denuncia, ac48eb1 Merge pull request #17 from pre…, c27a9ee fase prefinal, dc063f3 gestion de oficiales correctame…, mapper.ts] | lang=en
- "infracciones_repository": "repository.ts" | kind=code-symbol | source=features/via/infracciones/repository.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 91c36bf validando orden de pago] | lang=en
- "iph_bitacoraiph": "BitacoraIPH.tsx" | kind=code-symbol | source=components/analisis/iph/BitacoraIPH.tsx:L1 | neighbors=[5618308 guardado e evidencias con ed, 56b6577 FORMULARIO SE ENLAZO A LA TABLA…, 9550203 Cambios en presentacion, se gen…, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …, fcb223f merge de testing] | lang=en
- "iph_page": "page.tsx" | kind=code-symbol | source=app/analisis/iph/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, 9d67ddf Cambios de formulario analisis, 9faf222 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…] | lang=en
- "medidas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/medidas/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "monitorista_expediente": "expediente.ts" | kind=code-symbol | source=lib/monitorista/expediente.ts:L1 | neighbors=[126b4d1 Monitorista V1, 44ebbc4 Merge branch 'feature/testing' …, 46b2c89 Merge branch 'testing' into juz…, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …] | lang=en
- "partials_subheader_subheader": "SubHeader()" | kind=code-symbol | source=components/partials/SubHeader.tsx:L18 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "reportes_incidentes_service": "service.ts" | kind=code-symbol | source=lib/reportes-incidentes/service.ts:L1 | neighbors=[13f7f39 Reporte-incidentes, ad3ec5f mejorando esto, f7b1aac Merge branch 'feature/testing' …, fcb223f merge de testing, route.ts, page.tsx] | lang=en
- "reportes_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/reportes/permisos.ts:L9 | neighbors=[page.tsx, page.tsx, page.tsx, page.tsx, page.tsx, page.tsx] | lang=en
- "roles_page": "page.tsx" | kind=code-symbol | source=app/admin/roles/page.tsx:L1 | neighbors=[0c31cc2 Merge branch 'testing' into juz…, 0e33bf6 feat: módulo Admin, Prórroga, F…, 12aab65 fase 4, 27dcb21 Merge branch 'feature/testing' …, 44ebbc4 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed] | lang=en
- "steps_pasoconductor": "PasoConductor.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoConductor.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadanoConductor.tsx, PasoConductor()] | lang=en
- "steps_pasodescuentos": "PasoDescuentos.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoDescuentos.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadanoConductor.tsx, ArchivoField] | lang=en
- "subir_foto_detenido_route": "route.ts" | kind=code-symbol | source=app/api/expediente/subir-foto-detenido/route.ts:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, ad3ec5f mejorando esto, c27a9ee fase prefinal, de5682f Merge pull request #10 from pre…, client.ts] | lang=en
- "usuarios_page": "page.tsx" | kind=code-symbol | source=app/admin/usuarios/page.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 12aab65 fase 4, 27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…] | lang=en
- "visitas_route": "route.ts" | kind=code-symbol | source=app/api/prevencion/medidas/[id]/visitas/route.ts:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5558751 feat: módulo Prevención del Del…, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' …, ad3ec5f mejorando esto, f2c66e6 Extender roles y permisos finos…] | lang=en
- "admin_admin_styles": "admin-styles.ts" | kind=code-symbol | source=app/admin/admin-styles.ts:L1 | neighbors=[btnPrimario, btnSecundario, cardStyle, inputStyle, labelStyle, pageWrap] | lang=en
- "admin_transito_modalreactivaroficial": "ModalReactivarOficial.tsx" | kind=code-symbol | source=components/admin-transito/ModalReactivarOficial.tsx:L1 | neighbors=[actions.ts, reactivarOficialConDatos(), Departamento, inputStyle, labelStyle, ModalReactivarOficial()] | lang=en
- "agente_infracciones_capturardatosinfractormodal": "CapturarDatosInfractorModal.tsx" | kind=code-symbol | source=components/agente_infracciones/CapturarDatosInfractorModal.tsx:L1 | neighbors=[actions.ts, capturarInfractorInfraccionesAction(), CapturarDatosInfractorModal(), DatosForm(), Field(), FieldName] | lang=en
- "agregar_page": "page.tsx" | kind=code-symbol | source=app/admin/roles/agregar/page.tsx:L1 | neighbors=[AgregarRolPage(), auth.ts, auth, Footer.tsx, DashboardFooter(), FormularioRol.tsx] | lang=en
- "auxiliar_service": "service.ts" | kind=code-symbol | source=lib/auxiliar/service.ts:L1 | neighbors=[actions.ts, repository.ts, obtenerCuestionariosRobo(), obtenerParesReporte(), upsertChecklist(), guardarChecklist()] | lang=en
- "calcular_route": "route.ts" | kind=code-symbol | source=app/api/reportes/formato-n-fge/calcular/route.ts:L1 | neighbors=[GET(), auth.ts, auth, formato-n-fge-service.ts, calcularConteosPorFecha(), permisos.ts] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@166a26b4031cf3f06e37d03445612176f0458ede": "166a26b Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[conexion, testing, 83f48a2 Merge branch 'feature/correccio…, c6cb029 Formulario editado, schema.ts, actions.ts] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@a2145fb21f4b9adae89074913aa8d4b7ec22d0d0": "a2145fb Merge branch 'testing' into juzgado" | kind=Commit | source=git | neighbors=[7400135 Merge branch 'feature/testing' …, Pagination.tsx, page.tsx, conexion, testing, 0c31cc2 Merge branch 'testing' into juz…] | lang=pt
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@c4523aca7e1438c596b579690aa1366a0ae9ec33": "c4523ac tabla de fiscalia, evidencias funcional" | kind=Commit | source=git | neighbors=[c194e54 envio de solicitud de evidencia…, conexion, testing, 997ef65 Merge pull request #2 from pres…, a2145fb Merge branch 'testing' into juz…, actions.ts] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f7573dd0e86dd7c4c5da20b2ea194db4d3ce5d73": "f7573dd Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seg…" | kind=Commit | source=git | neighbors=[72e8913 cambio de diseño, ef9e0ea Formulario arreglado, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara] | lang=en
- "components_capturardatostitularsection": "CapturarDatosTitularSection.tsx" | kind=code-symbol | source=features/via/infracciones/components/CapturarDatosTitularSection.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection(), Field()] | lang=en
- "fiscalia_cargaroficiosection": "CargarOficioSection.tsx" | kind=code-symbol | source=components/fiscalia/CargarOficioSection.tsx:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 5bbdda8 Merge pull request #8 from pres…, 75ca4b2 Merge pull request #9 from pres…, 953d38a implementando vista de fiscalia, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "fiscalia_pedirevidenciasmodal": "PedirEvidenciasModal.tsx" | kind=code-symbol | source=components/fiscalia/PedirEvidenciasModal.tsx:L1 | neighbors=[090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' …, 5f13b34 Merge branch 'feature/testing' …, 905531c trabajando en panel de fiscalia, 997ef65 Merge pull request #2 from pres…, 9ec6056 flujo de juzgado-monitorista co…] | lang=en
- "flota_types": "types.ts" | kind=code-symbol | source=lib/flota/types.ts:L1 | neighbors=[ModalReactivarOficial.tsx, NuevoOficialForm.tsx, OficialesTable.tsx, PatrullaSelector.tsx, 16a63d4 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…] | lang=en
- "generar_ppt_page": "page.tsx" | kind=code-symbol | source=app/analisis/generar-ppt/page.tsx:L1 | neighbors=[27dcb21 Merge branch 'feature/testing' …, 5618308 guardado e evidencias con ed, 5830570 Seccion de analista, uya con bd…, 77ddf58 Merge branch 'feature/testing' …, f2c66e6 Extender roles y permisos finos…, generarPresentacion.tsx] | lang=en
- "monitorista_permisos_tienepermiso": "tienePermiso()" | kind=code-symbol | source=lib/monitorista/permisos.ts:L13 | neighbors=[route.ts, page.tsx, route.ts, route.ts, route.ts, page.tsx] | lang=en
- "notificaciones_checker": "checker.ts" | kind=code-symbol | source=lib/notificaciones/checker.ts:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 11be750 Fase 1 de correccion - completa…, 5f13b34 Merge branch 'feature/testing' …, 821abe0 replicando flujo de fiscalia-> …, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "prevencion_agregarautoridadform": "AgregarAutoridadForm.tsx" | kind=code-symbol | source=components/prevencion/AgregarAutoridadForm.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, baae82f diseño de medidas de proteccion, page.tsx] | lang=en
- "reportes_operativos_types": "types.ts" | kind=code-symbol | source=lib/reportes-operativos/types.ts:L1 | neighbors=[ad3ec5f mejorando esto, mapper.ts, repository.ts, service.ts, ArmaRow, CateoRow] | lang=en
- "rol_servicios_page": "page.tsx" | kind=code-symbol | source=app/rol_servicios/page.tsx:L1 | neighbors=[a2e0623 Consolidado de formatos N y Sub…, c27a9ee fase prefinal, f5fac0b Merge branch 'testing' into con…, SubHeader.tsx, SubHeader(), ModuloRolZen()] | lang=en
- "sasiete_repository": "repository.ts" | kind=code-symbol | source=features/via/saSiete/repository.ts:L1 | neighbors=[route.ts, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, ede5a1d eliminado referencias a via_pru…, f7b1aac Merge branch 'feature/testing' …] | lang=en
- "911_pagination": "Pagination.tsx" | kind=code-symbol | source=components/911/Pagination.tsx:L1 | neighbors=[arrowBtnStyle, containerStyle, infoStyle, labelStyle, pageNumberStyle, Pagination()] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-008.json

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
