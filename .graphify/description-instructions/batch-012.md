# Node Description Batch 13 of 82

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

- "commit:repo:github.com/presidenciaSJR/seguridad_publica@b233bc7cf4d1935110e3958ea3b735d12a90770f": "b233bc7 Merge branch 'testing' into conexion" | kind=Commit | source=git | neighbors=[8095bdb limpiando .env, 98e7e6e vista de reportes de d1, feature/testing, 75e03e9 puliendo flujo de juzgado-liber…, D1Filters.tsx, D1Pagination.tsx] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@d3e6d958008563ec30d4b225434ce61660e6686f": "d3e6d95 Update SeguimientoTimeline.tsx" | kind=Commit | source=git | neighbors=[6cb1055 Mejoras de UI/UIX, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@de14b628c597751b2adddaebedd581c41690e8e2": "de14b62 Merge branch 'feature/reportes' into feature/testing" | kind=Commit | source=git | neighbors=[0b210fa Merge pull request #12 from pre…, feature/testing, 4400923 Merge branch 'feature/testing' …, route.ts, page.tsx, ReportFilters.tsx] | lang=nl
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@ef9e0ea90799410bf11b63750bd051a2b5cfe619": "ef9e0ea Formulario arreglado" | kind=Commit | source=git | neighbors=[4d4a9b7 formulario de notificaciones po…, feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f6954ecab5cbc29333e7b5fa272233ed46d15b86": "f6954ec Conexion a la bd y la generacion de Excel" | kind=Commit | source=git | neighbors=[5ef7cf3 Agregar los campos faltantes, feature/testing, 07543de Conexion de reportes con d1 y l…, de14b62 Merge branch 'feature/reportes'…, route.ts, page.tsx] | lang=es
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@f9243acfbf6018473ce60a5ac6e3bb5e1d80b986": "f9243ac Interfaz de formulario de rol de servicios adaptado a diseño con cambio…" | kind=Commit | source=git | neighbors=[d3e6d95 Update SeguimientoTimeline.tsx, feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=nl
- "components_buttonverdetalles": "ButtonVerDetalles.tsx" | kind=code-symbol | source=features/compartido/components/ButtonVerDetalles.tsx:L1 | neighbors=[InfraccionesDashboard.tsx, LiberacionesDashboard.tsx, 06c55f5 Merge branch 'feature/testing' …, 0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 2dde720 Merge pull request #14 from pre…] | lang=en
- "d1_noiniciada_descargafilters": "DescargaFilters.tsx" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaFilters.tsx:L1 | neighbors=[0c8695c Cambios en filtros, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 4c9fa8a vista de reporte de d1 no inici…, 552d291 Merge branch 'testing' into con…, 712c116 Merge branch 'testing' into con…] | lang=en
- "d1_noiniciada_descargatable": "DescargaTable.tsx" | kind=code-symbol | source=components/reportes/d1_noiniciada/DescargaTable.tsx:L1 | neighbors=[22b7b54 Merge branch 'feature/reportes'…, 4c9fa8a vista de reporte de d1 no inici…, 552d291 Merge branch 'testing' into con…, 712c116 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, e286619 Merge branch 'feature/testing' …] | lang=en
- "dashboard_enable_2fa": "enable-2fa.tsx" | kind=code-symbol | source=app/dashboard/enable-2fa.tsx:L1 | neighbors=[11e8817 Merge branch 'testing' into juz…, 28da720 Cambio de colores en dashboard …, 44ebbc4 Merge branch 'feature/testing' …, 6a042cd feat: sistema de autenticación,…, ce84893 Merge branch 'feature/testing' …, Card()] | lang=en
- "fiscalia_permisos": "permisos.ts" | kind=code-symbol | source=lib/fiscalia/permisos.ts:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, ac9ad49 Merge branch 'feature/testing' …, Accion, guardarPermiso(), guardarPlantillaSeccion()] | lang=en
- "fiscalia_tabasegurados": "TabAsegurados.tsx" | kind=code-symbol | source=components/fiscalia/TabAsegurados.tsx:L1 | neighbors=[page.tsx, 2db162a flujo de asegurados, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, c471e9c Merge pull request #15 from pre…, Props] | lang=en
- "generar_orden_pago_route": "route.ts" | kind=code-symbol | source=app/api/via/sa7/generar-orden-pago/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "legalidad_service": "service.ts" | kind=code-symbol | source=features/via/legalidad/service.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, actions.ts, mapper.ts] | lang=en
- "lib_detenidos_compartido": "detenidos-compartido.ts" | kind=code-symbol | source=lib/detenidos-compartido.ts:L1 | neighbors=[388b997 Apartados para subir fotografia…, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from pre…, page.tsx, page.tsx, db.ts] | lang=en
- "manual_migrations_0007_formato_n_split": "0007_formato_n_split.sql" | kind=code-symbol | source=lib/db/manual-migrations/0007_formato_n_split.sql:L1 | neighbors=[06c55f5 Merge branch 'feature/testing' …, 41ea169 Merge branch 'testing' into con…, 8355ac0 Merge branch 'feature/testing' …, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' …, formato_n_armas_aseguradas] | lang=en
- "oficial_permisos": "permisos.ts" | kind=code-symbol | source=lib/oficial/permisos.ts:L1 | neighbors=[03f8b2a implementado rbac, 046f18c Merge pull request #19 from pre…, ac9ad49 Merge branch 'feature/testing' …, Accion, guardarPermiso(), guardarPlantillaSeccion()] | lang=en
- "oficiales_mapper": "mapper.ts" | kind=code-symbol | source=features/via/oficiales/mapper.ts:L1 | neighbors=[067c4de arreglando flujo de fiscalia  a…, 16a63d4 Merge branch 'feature/testing' …, 23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, ac48eb1 Merge pull request #17 from pre…, b5233a8 implementando via como modulo d…] | lang=en
- "partials_footer": "Footer.tsx" | kind=code-symbol | source=components/partials/Footer.tsx:L1 | neighbors=[page.tsx, page.tsx, page.tsx, 3b10d72 Merge branch 'feature/testing' …, 8303881 Subida de header y footer, falt…, page.tsx] | lang=en
- "prevencion_seguimientotimeline": "SeguimientoTimeline.tsx" | kind=code-symbol | source=components/prevencion/SeguimientoTimeline.tsx:L1 | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 5558751 feat: módulo Prevención del Del…, d3e6d95 Update SeguimientoTimeline.tsx, page.tsx, actions.ts, createSeguimiento()] | lang=en
- "prevencion_visitamodal": "VisitaModal.tsx" | kind=code-symbol | source=components/prevencion/VisitaModal.tsx:L1 | neighbors=[41ea169 Merge branch 'testing' into con…, 5558751 feat: módulo Prevención del Del…, 8355ac0 Merge branch 'feature/testing' …, 9faf222 Merge branch 'feature/testing' …, baae82f diseño de medidas de proteccion, page.tsx] | lang=en
- "proxy_route": "route.ts" | kind=code-symbol | source=app/api/expediente/proxy/route.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 1dbd480 flujo de liberaciones completado, 5d179c0 Apartado de reportes, 5f13b34 Merge branch 'feature/testing' …, 75e03e9 puliendo flujo de juzgado-liber…, 8e6c8c6 Apartado de reportes] | lang=en
- "reportes_operativos_mapper_tostr": "toStr()" | kind=code-symbol | source=lib/reportes-operativos/mapper.ts:L7 | neighbors=[mapper.ts, rowToArma(), rowToCateo(), rowToDetencionInc(), rowToDetencionOfi(), rowToDroga()] | lang=en
- "reportes_permisos_tieneaccesoformaton": "tieneAccesoFormatoN()" | kind=code-symbol | source=lib/reportes/permisos.ts:L25 | neighbors=[page.tsx, page.tsx, page.tsx, route.ts, page.tsx, page.tsx] | lang=en
- "revision_documental_page": "page.tsx" | kind=code-symbol | source=app/agente_liberaciones/revision-documental/page.tsx:L1 | neighbors=[0b210fa Merge pull request #12 from pre…, 1acddac Merge branch 'feature/testing' …, 4400923 Merge branch 'feature/testing' …, 46f24f8 generica function for infractio…, e286619 Merge branch 'feature/testing' …, actions.ts] | lang=en
- "sasiete_service": "service.ts" | kind=code-symbol | source=features/via/saSiete/service.ts:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, mapper.ts, mapRowToOrdenPago()] | lang=en
- "shared_abrirdocumento": "abrirDocumento.ts" | kind=code-symbol | source=lib/shared/abrirDocumento.ts:L1 | neighbors=[DetallesAseguradoView.tsx, 5f13b34 Merge branch 'feature/testing' …, 75e03e9 puliendo flujo de juzgado-liber…, 92393e7 flujo completado de juzgado, a7218bd Merge pull request #4 from pres…, ce84893 Merge branch 'feature/testing' …] | lang=en
- "sin_robos_reportesinrobos": "ReporteSinRobos.tsx" | kind=code-symbol | source=components/reportes/sin_robos/ReporteSinRobos.tsx:L1 | neighbors=[156c925 vista de reporte de sin robos, 1acddac Merge branch 'feature/testing' …, 22b7b54 Merge branch 'feature/reportes'…, 552d291 Merge branch 'testing' into con…, 97a156c Reportes con D1, sin D1 y sin r…, e286619 Merge branch 'feature/testing' …] | lang=en
- "steps_pasociudadanoconductor": "PasoCiudadanoConductor.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/PasoCiudadanoConductor.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, PasoCiudadano.tsx] | lang=en
- "steps_procesomodal": "ProcesoModal.tsx" | kind=code-symbol | source=features/via/infracciones/components/steps/ProcesoModal.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, FormularioInfraccion.tsx, types.ts] | lang=en
- "stores_useinfraccionstore_useinfraccionstore": "useInfraccionStore" | kind=code-symbol | source=stores/useInfraccionStore.ts:L130 | neighbors=[FormularioInfraccion.tsx, PasoCiudadano.tsx, PasoCiudadanoConductor.tsx, PasoConductor.tsx, PasoConfirmacion.tsx, PasoDescuentos.tsx] | lang=en
- "types_detalleinfraccion": "detalleInfraccion.ts" | kind=code-symbol | source=features/via/compartido/types/detalleInfraccion.ts:L1 | neighbors=[16a63d4 Merge branch 'feature/testing' …, 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from pre…, CapturarDatosTitularSection.tsx, ModalEntregarGarantia.tsx, DetalleCompleto] | lang=en
- "ui_cardtitle": "CardTitle.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/CardTitle.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, PasoCiudadano.tsx, PasoConductor.tsx] | lang=en
- "ui_segmentedcontrol": "SegmentedControl.tsx" | kind=code-symbol | source=features/via/infracciones/components/ui/SegmentedControl.tsx:L1 | neighbors=[23b7312 Merge pull request #16 from pre…, 27dcb21 Merge branch 'feature/testing' …, b5233a8 implementando via como modulo d…, f7b1aac Merge branch 'feature/testing' …, SeccionLiberacion.tsx, PasoCiudadano.tsx] | lang=en
- "911_mapper": "mapper.ts" | kind=code-symbol | source=lib/911/mapper.ts:L1 | neighbors=[rowToCatalogo(), rowToIncidenteDetalle(), rowToIncidenteResumen(), toNum(), toStr(), types.ts] | lang=en
- "agente_infracciones_page": "page.tsx" | kind=code-symbol | source=app/agente_infracciones/page.tsx:L1 | neighbors=[actions.ts, obtenerDashboardInfracciones(), obtenerInfracciones(), InfraccionesTable.tsx, InfraccionesDashboardPage(), ProfileDropdown.tsx] | lang=en
- "agente_liberaciones_profiledropdown": "ProfileDropdown.tsx" | kind=code-symbol | source=components/agente_liberaciones/ProfileDropdown.tsx:L1 | neighbors=[page.tsx, ProfileDropdown(), Props, auth-client.ts, authClient, 0b210fa Merge pull request #12 from pre…] | lang=en
- "auxiliar_mapper": "mapper.ts" | kind=code-symbol | source=lib/auxiliar/mapper.ts:L1 | neighbors=[rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), toStr(), types.ts, AuxChecklist] | lang=en
- "branch:repo:github.com/presidenciaSJR/seguridad_publica#main": "main" | kind=Branch | source=git | neighbors=[0e33bf6 feat: módulo Admin, Prórroga, F…, 199ce68 Merge branch 'main' of https://…, 2e36377 Eliminar tutoriales de flujo in…, 4271f37 feat(doc): agregar manual de us…, 5558751 feat: módulo Prevención del Del…, 6a042cd feat: sistema de autenticación,…] | lang=en
- "commit:repo:github.com/presidenciaSJR/seguridad_publica@0844e6e1c27168ffc88acbe2c2d8b6f4cfb6a8f6": "0844e6e Corregido" | kind=Commit | source=git | neighbors=[feature/monitorista, feature/monitorista-reportes, feature/testing, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias] | lang=en

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/ugomez/Documents/GitHub/seguridad_publica/.graphify/description-instructions/batch-012.json

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
