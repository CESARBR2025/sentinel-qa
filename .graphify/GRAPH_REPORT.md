# Graph Report - .  (2026-07-10)

## Corpus Check
- Large corpus: 759 files · ~538,924 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 3268 nodes · 10984 edges · 119 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: MODIFIES: 3689 · contains: 2438 · imports: 1775 · imports_from: 1196 · ON_BRANCH: 1158 · calls: 331 · PARENT_OF: 300 · re_exports: 52 · method: 29 · references: 9 · inherits: 7


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 759 · Candidates: 810
- Excluded: 5 untracked · 77080 ignored · 0 sensitive · 28 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `ac9ad49`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `auth` - 134 edges
2. `query()` - 63 edges
3. `DashboardHeader()` - 25 edges
4. `getUserWithRole()` - 25 edges
5. `SubHeader()` - 17 edges
6. `tienePermiso()` - 17 edges
7. `tienePermiso()` - 16 edges
8. `authClient` - 14 edges
9. `AppError` - 14 edges
10. `toStr()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `crearHoja()`  [EXTRACTED]
  app/api/reportes-telefonicos/exportar/route.ts → app/api/camara/exportar/route.ts
- `DetalleCiudadanoCompletoPage()` --calls--> `getStatusBadgeStyle()`  [EXTRACTED]
  app/agente_911/ciudadano/incidentes/[id]/page.tsx → app/agente_911/whatsapp/incidentes/[id]/page.tsx
- `DetalleRondinCompletoPage()` --calls--> `getStatusBadgeStyle()`  [EXTRACTED]
  app/agente_911/rondin/incidentes/[id]/page.tsx → app/agente_911/whatsapp/incidentes/[id]/page.tsx
- `FichaDetailPage()` --calls--> `fmtDT()`  [EXTRACTED]
  app/prevencion/busquedas/[id]/page.tsx → app/prevencion/juridico/solicitudes/[id]/page.tsx
- `POST()` --calls--> `mapearEstatusFinal()`  [EXTRACTED]
  app/api/via/ciudadano/subir-archivo/route.ts → app/api/corralon/subir-archivo/route.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (61): 06c55f5 Merge branch 'feature/testing' into feature/reportes, 41ea169 Merge branch 'testing' into conexion, 8355ac0 Merge branch 'feature/testing' into feature/implementacion-consumir-datos-denuncia, a2e0623 Consolidado de formatos N y SubHeader, ajustes en servicios de reportes, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, f5fac0b Merge branch 'testing' into conexion, SignOutButton() (+53 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (43): TIPO_CFG, 1e81ec8 Datos se autorellenan de denuncias y seccion de oficial, 44a01c3 fase 3-4-5, 5558751 feat: módulo Prevención del Delito completo + fix flujo autenticación 2FA, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, f2c66e6 Extender roles y permisos finos a incidentes, prevención, auxiliar, 911, análisis, denuncia D1 y Formato N, ffcea0c fase 1 completada (+35 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (48): Accion, obtenerRolNombre(), PermisoSeccion, ROLES_PERMITIDOS, Seccion, SECCIONES, tieneAccesoHub(), tieneAccesoSeccion() (+40 more)

### Community 3 - "Community 3"
Cohesion: 0.02
Nodes (60): guardarDetallesAseguradosJuzgadoAction(), guardarPuestaDisposicionJuzgadoAction(), obtenerDetalleAseguradoCompletoJuzgadoAction(), obtenerPuestaDisposicionJuzgadoAction(), obtenerDetalleInfraccionLiberaciones(), obtenerDetalleAseguradoCompletoAction(), obtenerPuestaDisposicionAction(), FormularioPuestaDisposicion() (+52 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (74): num(), parseDetenidos(), parseSolicitudesJson(), parseTurno(), rowToDenunciaDetalle(), rowToDependencia(), rowToEvidencia(), rowToEvidenciaArchivo() (+66 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (55): guardarDetallesAseguradoAction(), CapturarDetallesForm(), disabledSx, emptyItem(), EvidenciaItem, inputSx, labelSx, Props (+47 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (54): 07543de Conexion de reportes con d1 y los diarios, mensuales y semanales, 98e7e6e vista de reportes de d1, af993fb Fix/Monitorista, b233bc7 Merge branch 'testing' into conexion, de14b62 Merge branch 'feature/reportes' into feature/testing, f6954ec Conexion a la bd y la generacion de Excel, D1Filters(), D1Pagination() (+46 more)

### Community 7 - "Community 7"
Cohesion: 0.04
Nodes (55): obtenerIncidenteCompleto(), obtenerIphDetenido(), obtenerPrellenadoCompleto(), obtenerSolicitudConEvidencias(), obtenerPrellenado(), FormatoNAtencionVictimas, enumerarFechas(), FormatoNConsolidado (+47 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (57): createBodyCam(), createConcepto(), createMedioCanalizacion(), createRadio(), createSector(), createTipoEmergencia(), createTipoObservacion(), req() (+49 more)

### Community 9 - "Community 9"
Cohesion: 0.05
Nodes (48): obtenerAseguradosJuzgadoAction(), concatNombre(), disabledSx, displayVal(), FormularioAseguradoJuzgado(), labelSx, Props, metadata (+40 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (52): accionTomarCaso(), AseguradosData, guardarDetallesAseguradoAction(), guardarDetallesAseguradosAction(), guardarPuestaDisposicionAction(), LiberacionesData, SolicitudesData, rowToAsegurado() (+44 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (50): accionCerrarCaso(), accionTomarCaso(), AseguradosJuzgadoData, LiberacionesData, SolicitudesData, num(), rowToInfraccionDetalle(), rowToSolicitud() (+42 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (36): insertarDocumentoLiberacion(), 16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, obtenerDashboardCorralon(), obtenerSolicitudes(), TabSolicitudes, rowToSolicitud(), toStr() (+28 more)

### Community 13 - "Community 13"
Cohesion: 0.04
Nodes (30): Accion, PermisoSeccion, Seccion, SECCIONES, Accion, PermisoSeccion, Seccion, SECCIONES (+22 more)

### Community 14 - "Community 14"
Cohesion: 0.06
Nodes (40): rowToCatalogo(), rowToIncidenteDetalle(), rowToIncidenteResumen(), toNum(), toStr(), arrowBtnStyle, containerStyle, infoStyle (+32 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (51): conexion, feature/testing, testing, 0c8695c Cambios en filtros, 0fe445e vista de oficial, 1265204 paginacion por tablas, 160d1e1 Monitorista V1.1, 18f5bac llamada en card (+43 more)

### Community 16 - "Community 16"
Cohesion: 0.07
Nodes (23): { GET, POST }, actionTextStyle, cardContentStyle, cardDescStyle, cardStyle, cardTitleStyle, decoratorLine, iconBoxStyle (+15 more)

### Community 17 - "Community 17"
Cohesion: 0.08
Nodes (45): 9d803f2 fix api maps, parseJsonField(), rowToD1(), rowToOficial(), rowToReporteCampo(), rowToReporteDetalle(), rowToReporteResumen(), toStr() (+37 more)

### Community 18 - "Community 18"
Cohesion: 0.05
Nodes (34): btnBackStyle, btnFinishStyle, btnGeoStyle, btnNextStyle, cardStyle, footerActions, grid3, labelStyle (+26 more)

### Community 19 - "Community 19"
Cohesion: 0.10
Nodes (27): obtenerDashboardJuzgado(), obtenerLiberacionesAction(), obtenerSolicitudes(), ProfileDropdown(), Props, ToastExito(), 090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into testing (+19 more)

### Community 20 - "Community 20"
Cohesion: 0.10
Nodes (44): rowToAlarmaEscolar(), rowToDespacho(), rowToDespachoElemento(), rowToDespachoUnidad(), rowToExtorsion(), rowToIncidenteBasico(), rowToIncidenteConDespachoBase(), rowToIncidenteDetalleCompletoBase() (+36 more)

### Community 21 - "Community 21"
Cohesion: 0.08
Nodes (44): rowToAutoridadAdicional(), rowToBusqueda(), rowToContestacion(), rowToFichaBusquedaDetalle(), rowToMedida(), rowToMedidaDetalle(), rowToSeguimiento(), rowToSolicitud() (+36 more)

### Community 22 - "Community 22"
Cohesion: 0.08
Nodes (21): SubirFotoDetenido(), 388b997 Apartados para subir fotografias de los detenidos, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from presidenciaSJR/fix/subir-fotografias, FilaDetenidoRol(), btnDetalle, pagBtn, SubirFotoDetenido() (+13 more)

### Community 23 - "Community 23"
Cohesion: 0.06
Nodes (28): btnPrimario, btnSecundario, inputStyle, labelStyle, pageWrap, selectStyle, btnPrimario(), btnSecundario (+20 more)

### Community 24 - "Community 24"
Cohesion: 0.16
Nodes (38): feature/monitorista-reportes, fix/detenidos, fix/subir-fotografias, main, 0e33bf6 feat: módulo Admin, Prórroga, Filtros medidas, Autoridades adicionales y Notificaciones/Alertas, 133bb9d pages de listado de llamadas y de radio, 199ce68 Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publica, 2e36377 Eliminar tutoriales de flujo innecesarios (+30 more)

### Community 25 - "Community 25"
Cohesion: 0.10
Nodes (29): liberarGarantiaInfraccionesAction(), obtenerDashboardInfracciones(), obtenerDetalleInfraccionInfracciones(), obtenerInfracciones(), columns, DataRow, InfraccionesTableProps, inputToDbParams() (+21 more)

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (25): 126b4d1 Monitorista V1, 46b2c89 Merge branch 'testing' into juzgado, da33516 Merge pull request #3 from presidenciaSJR/feature/monitorista, BandejaSolicitudes(), btnDetalle, btnPrimary, btnSuccess, origenBadge (+17 more)

### Community 27 - "Community 27"
Cohesion: 0.07
Nodes (21): guardarOficioJuzgadoAction(), obtenerDetalleInfraccionViaActionJuzgado(), BotonVerDetalle(), BotonVerDetalleProps, CargarOficioSectionProps, ConfirmacionModalProps, VARIANTES, AVATAR_COLORS (+13 more)

### Community 28 - "Community 28"
Cohesion: 0.09
Nodes (27): capturarInfractorAction(), finalizarRevisionAction(), generarOrdenPagoAction(), obtenerDocumentosLiberacion(), revisarDocumentoAction(), LiberacionesResponse, UserInfo, 0b210fa Merge pull request #12 from presidenciaSJR/conexion (+19 more)

### Community 29 - "Community 29"
Cohesion: 0.10
Nodes (28): ModuleCardProps, Stat, feature/monitorista, 283f342 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, 2be4ca9 Cambio en header, 3a00521 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, 3b10d72 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, 6488a30 Formulario sin backend de 911 listo (+20 more)

### Community 30 - "Community 30"
Cohesion: 0.10
Nodes (18): Props, Props, Props, ArchivoField, Props, InfraccionCreada, PasoPagoProps, COLORES (+10 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (20): createUser(), requireAdmin(), updateUser(), requireAuxiliar(), upsertChecklistAction(), 11be750 Fase 1 de correccion - completada - pendiente testing, ActionResult, ApiHandler (+12 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (26): fix/incidentes-camara, libraries, 0844e6e Corregido, 166a26b Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, 23a3b9d Cambios en la estructura de los reportes de los detenidos, 25de428 Corrección para agregar el botón de cerrar sesion, 49dca47 cambio, 4d4a9b7 formulario de notificaciones por radio (+18 more)

### Community 33 - "Community 33"
Cohesion: 0.11
Nodes (19): Departamento, inputStyle, labelStyle, Props, selectStyle, AccionModal, Departamento, Oficial (+11 more)

### Community 34 - "Community 34"
Cohesion: 0.13
Nodes (26): 13f7f39 Reporte-incidentes, 5ef7cf3 Agregar los campos faltantes, ef95840 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, fcb223f merge de testing, addPersonaAfectada(), CANALES, createAlarmaEscolar(), createDespacho() (+18 more)

### Community 35 - "Community 35"
Cohesion: 0.11
Nodes (21): cardStyle, rowToRol(), rowToUsuarioLista(), toStr(), actualizarUsuario(), asignarRolUsuario(), crearRol(), eliminarSesion() (+13 more)

### Community 36 - "Community 36"
Cohesion: 0.09
Nodes (26): actualizarDatosInfractor(), actualizarDatosInfractorIniciarProceso(), actualizarEstatusDependenciaMesaControl(), actualizarEstatusPendientePagoInfraccion(), actualizarEstatusSolicitudLiberacion(), actualizarEvidenciasInfraccion(), actualizarUrlOrdenSalida(), actualizarUrlsDocumentosInfraccion() (+18 more)

### Community 37 - "Community 37"
Cohesion: 0.07
Nodes (25): BTN, BTN_SM, DespachoForm(), Elemento, ERR, I, LBL, TAG (+17 more)

### Community 38 - "Community 38"
Cohesion: 0.13
Nodes (17): 5d179c0 Apartado de reportes, 8e6c8c6 Apartado de reportes, limpiarCacheToken(), obtenerGuestToken(), subirArchivoExpediente(), BuscadorEvento(), OPCIONES, generarPpt() (+9 more)

### Community 39 - "Community 39"
Cohesion: 0.12
Nodes (16): 067c4de arreglando flujo de fiscalia  a schema via, 1dbd480 flujo de liberaciones completado, mapCrearInfraccionToDB(), mapInfraccionDetalle(), InfraccionesRepository, generarFolioInfraccion(), InfraccionesService, randomBase36Char() (+8 more)

### Community 40 - "Community 40"
Cohesion: 0.10
Nodes (22): DetalleInfraccionView(), DocumentacionSection(), formatCurrency(), formatDate(), FundamentoLegalSection(), InfraccionDetalle, InfraccionGarantia, InfraccionHeader (+14 more)

### Community 41 - "Community 41"
Cohesion: 0.12
Nodes (14): b170599 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, fa9df15 Reporte de cámaras, ReportFilters(), ReportStat(), ReportTable(), styles, PhoneStatsCards(), ReportFilters() (+6 more)

### Community 42 - "Community 42"
Cohesion: 0.10
Nodes (19): cleanColoniaName(), containerStyle, DEFAULT_CENTER, extractAddress(), extractNeighborhoodFromComponents(), getMunicipioEstado(), LIBRARIES, MapaDireccionRegistro() (+11 more)

### Community 43 - "Community 43"
Cohesion: 0.10
Nodes (7): ProfileDropdownAuxiliar(), Props, 6a042cd feat: sistema de autenticación, dashboard y esquema de base de datos, Enable2FA(), s, Step, authClient

### Community 44 - "Community 44"
Cohesion: 0.12
Nodes (11): rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), toStr(), listarDepartamentosActivos(), obtenerOficialExistente(), upsertOficial(), Departamento (+3 more)

### Community 45 - "Community 45"
Cohesion: 0.08
Nodes (15): AVATAR_COLORS, EstatusInfracciones, Props, SORTABLE_KEYS, STATUS_BADGE, STATUS_TABS, AVATAR_COLORS, EstatusLiberaciones (+7 more)

### Community 46 - "Community 46"
Cohesion: 0.13
Nodes (15): obtenerDashboardLiberaciones(), obtenerLiberaciones(), columns, DataRow, LiberacionesTableProps, ProfileDropdown(), Props, 1acddac Merge branch 'feature/testing' into feature/reportes (+7 more)

### Community 47 - "Community 47"
Cohesion: 0.14
Nodes (19): rowToIncidenteCamara(), rowToTotalesCamara(), toNum(), toNumNullable(), toStr(), obtenerConcentradoDiario(), obtenerIncidentesCamara(), obtenerPorTurno() (+11 more)

### Community 48 - "Community 48"
Cohesion: 0.15
Nodes (17): 0c31cc2 Merge branch 'testing' into juzgado, 458bbfb registro de reporte de campo - oficial, 93dd3ea Merge pull request #1 from presidenciaSJR/juzgado, aaddee5 Merge branch 'feature/testing' into feature/denuncias, b79a96a Conexión entre ambos modulos, accounts, sessions, twoFactors (+9 more)

### Community 49 - "Community 49"
Cohesion: 0.09
Nodes (13): tdStyle, thStyle, Accion, obtenerPermisosUsuario(), PermisoRow, PermisoSeccion, Seccion, tienePermiso() (+5 more)

### Community 50 - "Community 50"
Cohesion: 0.09
Nodes (12): AUTORIDADES, btnPrimario(), btnSecundario, NuevaDetenidoPage(), TIPOS, createFicha(), createMedida(), createSeguimiento() (+4 more)

### Community 51 - "Community 51"
Cohesion: 0.14
Nodes (9): 23b7312 Merge pull request #16 from presidenciaSJR/conexion, mapRowToOrdenPago(), OrdenPagoRow, SA7Repository, SA7Service, CatalogoConceptoSA7, GenerarOrdenPagoDTO, OrdenPagoSA7 (+1 more)

### Community 52 - "Community 52"
Cohesion: 0.08
Nodes (20): 11e8817 Merge branch 'testing' into juzgado, ec1b658 implementando layaredArchitecture para rol de oficial, btnBackStyle, btnNextStyle, btnSubmitStyle, center, fieldContainerStyle, grid2Style (+12 more)

### Community 53 - "Community 53"
Cohesion: 0.11
Nodes (8): rowToLiberacion(), obtenerLiberaciones(), obtenerRolUsuario(), listarLiberaciones(), verificarRolLiberaciones(), LiberacionRow, RolRow, 51e682b mejorando flujo de liberaciones

### Community 54 - "Community 54"
Cohesion: 0.17
Nodes (16): 75ca4b2 Merge pull request #9 from presidenciaSJR/conexion, 953d38a implementando vista de fiscalia, MailAttachment, MailOptions, sendMail(), transporter, enviarCorreoAsignacionFiscalia(), enviarCorreoOrdenLiberacion() (+8 more)

### Community 55 - "Community 55"
Cohesion: 0.13
Nodes (12): generarAlertasDebug(), marcarLeida(), marcarTodasLeidas(), CampanillaNotificaciones(), Notificacion, Props, ToastProps, rowToNotificacion() (+4 more)

### Community 56 - "Community 56"
Cohesion: 0.14
Nodes (14): actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista(), obtenerOficialPorId(), reactivarOficialConDatos(), requireAdminTransito() (+6 more)

### Community 57 - "Community 57"
Cohesion: 0.12
Nodes (11): AddressData, eliminarInfraccionAction(), ProcesoEstado, ViewArticulosLista, generarOrdenPago(), config, getStepIndex(), ProcesoModal() (+3 more)

### Community 58 - "Community 58"
Cohesion: 0.12
Nodes (15): FieldName, isNoData(), Props, TitularForm(), getGarantiaInfo(), ModalEntregarGarantia(), Props, useToastStore (+7 more)

### Community 59 - "Community 59"
Cohesion: 0.10
Nodes (16): Arma, cardStyle, Consolidado, Evento, Fge, Fgr, linkBtn, Medios (+8 more)

### Community 60 - "Community 60"
Cohesion: 0.16
Nodes (14): a21f03f fix bugs reporte denuncia, rowToPatrulla(), toBool(), toStr(), estaStale(), listarActivas(), obtenerPorId(), upsertPatrullas() (+6 more)

### Community 61 - "Community 61"
Cohesion: 0.13
Nodes (6): b5233a8 implementando via como modulo de oficial, mapRowToOficialViaDTO(), OfiOficialRow, OficialesViaRepository, OficialesViaService, OfiOficialViaDTO

### Community 62 - "Community 62"
Cohesion: 0.13
Nodes (7): insertarSolicitudLiberacion(), marcarGarantiaEntregada(), 91c36bf validando orden de pago, ac48eb1 Merge pull request #17 from presidenciaSJR/conexion, containerStyle, Props, Props

### Community 63 - "Community 63"
Cohesion: 0.19
Nodes (8): 2c128e5 test expediente vercel, ede5a1d eliminado referencias a via_prueba, f7b1aac Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, POST(), subirArchivo(), validarArchivo(), getExpedienteHost(), getExpedienteToken()

### Community 64 - "Community 64"
Cohesion: 0.20
Nodes (15): rowToReporteDiario(), rowToReporteSemanal(), toNum(), obtenerReporteDiario(), obtenerReporteSemanal(), combinar(), COMBO_KEYS, listarReporteDiario() (+7 more)

### Community 65 - "Community 65"
Cohesion: 0.24
Nodes (14): rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), toStr(), obtenerCuestionariosRobo(), obtenerParesReporte(), upsertChecklist(), guardarChecklist() (+6 more)

### Community 66 - "Community 66"
Cohesion: 0.19
Nodes (12): 22b7b54 Merge branch 'feature/reportes' into feature/testing, 97a156c Reportes con D1, sin D1 y sin robo, initialState, OficialFormActions, OficialFormState, OficialFormStore, useOficialFormStore, VehiculoState (+4 more)

### Community 67 - "Community 67"
Cohesion: 0.25
Nodes (10): 2fcba7b vista de reportes de incidentes diarios y semanales, 552d291 Merge branch 'testing' into conexion, 719b5ab cambio para generacion de reportes semanal y diario, FiltrosIncidencias(), PaginationProps, IncidenteStat(), styles, Props (+2 more)

### Community 68 - "Community 68"
Cohesion: 0.13
Nodes (13): COLOR_MAP, addAutoridadMedida(), AgregarAutoridadForm(), Autoridad, AUTORIDADES, I, L, Props (+5 more)

### Community 69 - "Community 69"
Cohesion: 0.18
Nodes (6): 27dcb21 Merge branch 'feature/testing' into feature/reportes, ArticulosMapper, QueryRow, ArticulosRepository, ArticuloLey, FraccionLey

### Community 70 - "Community 70"
Cohesion: 0.14
Nodes (13): accionPedirEvidencias(), Props, Tab, tabs, TabSolicitudes(), TomarCasoBoton(), accionPedirEvidencias(), emptyItem() (+5 more)

### Community 71 - "Community 71"
Cohesion: 0.14
Nodes (8): capturarInfractorInfraccionesAction(), FieldName, Props, CapturaInfractorActions, CapturaInfractorState, CapturaInfractorStore, initialState, useCapturaInfractorStore

### Community 72 - "Community 72"
Cohesion: 0.17
Nodes (8): 5bbdda8 Merge pull request #8 from presidenciaSJR/juzgado, ff6d3c2 juzgado, BotonVerDetalleProps, ConfirmacionModalProps, VARIANTES, columns, DataRow, FiscaliaTableProps

### Community 73 - "Community 73"
Cohesion: 0.13
Nodes (7): 6feefe2 BackEnd completo para hacer la conección con la BD, 71912a4 Bitacora incluida, a58a0f7 Despachos, IncidenteDetalle, Filtros, IncidenteResumen, ReporteCampoDetalle

### Community 74 - "Community 74"
Cohesion: 0.21
Nodes (11): actualizarAtencionVictimas(), crearAtencionVictimas(), formatFecha(), FormatoNAtencionVictimasInput, listarAtencionVictimas(), obtenerAtencionVictimas(), obtenerAtencionVictimasPorFechaPeriodo(), parsePeriodo() (+3 more)

### Community 75 - "Community 75"
Cohesion: 0.20
Nodes (10): 9550203 Cambios en presentacion, se genera, 9d67ddf Cambios de formulario analisis, btnPPTStyle, btnStyle, containerStyle, headerRowStyle, tdStyle, thStyle (+2 more)

### Community 76 - "Community 76"
Cohesion: 0.15
Nodes (11): DocConfig, DOCS_ACCIDENTE, DOCS_DELITO, DOCS_EMPRESA, DOCS_INFRACCION, getEstatusConfig(), MOTIVO_TO_SUBTIPO, Props (+3 more)

### Community 77 - "Community 77"
Cohesion: 0.21
Nodes (8): paginationButtonStyle, PaginationProps, PhoneReport, PhoneReportsTable(), ReportesTabs(), OperationalTable(), OperationalTableProps, styles

### Community 78 - "Community 78"
Cohesion: 0.14
Nodes (9): obtenerDetalleInfraccionViaAction(), BotonVerDetalle(), AVATAR_COLORS, EstatusFiscalia, Props, SORTABLE_KEYS, STATUS_BADGE, STATUS_TABS (+1 more)

### Community 79 - "Community 79"
Cohesion: 0.21
Nodes (9): generarAlertasBusquedas(), HITOS_ALERTAR, listarNotificacionesNoLeidas(), Props, SeguimientoTimeline(), calcularFechaEsperada(), getLabelSeguimiento(), TIPOS_SEGUIMIENTO (+1 more)

### Community 80 - "Community 80"
Cohesion: 0.33
Nodes (7): 156c925 vista de reporte de sin robos, PaginacionSinRobos(), paginationButtonStyle, PaginationProps, TablaReportesLimpios(), ReportFilters(), styles

### Community 81 - "Community 81"
Cohesion: 0.18
Nodes (9): obtenerArticulosAction(), obtenerFraccionesAction(), ArticulosService, Articulo, Fraccion, SeccionMotivoProps, CustomSelect(), CustomSelectProps (+1 more)

### Community 82 - "Community 82"
Cohesion: 0.26
Nodes (8): 14fd73a Update FormSection.tsx, 305b0bd se quitan campos, 81b9829 Cambios para guardado de persinas afectadas, 917002a Guardado de policia a cargo, d5e0e56 Campo para agregar detenidos de forma dinámica y eliminación de campos extras, d665f95 Camo dinamico y cambio a select en datos positivos, EmpleadoResult, useEmpleado()

### Community 83 - "Community 83"
Cohesion: 0.18
Nodes (6): guardarOficioAction(), CargarOficioSectionProps, Toast, ToastStore, ToastType, useToastStore

### Community 84 - "Community 84"
Cohesion: 0.17
Nodes (2): LogLine, LogType

### Community 85 - "Community 85"
Cohesion: 0.38
Nodes (7): 4c9fa8a vista de reporte de d1 no iniciada, 712c116 Merge branch 'testing' into conexion, DescargaFilters(), DescargaPagination(), PaginationProps, DescargaTable(), styles

### Community 86 - "Community 86"
Cohesion: 0.18
Nodes (3): Module, ModuleCards(), MODULES

### Community 87 - "Community 87"
Cohesion: 0.18
Nodes (2): DC, DCCtx

### Community 88 - "Community 88"
Cohesion: 0.33
Nodes (9): createAsignacion(), createObservacion(), createRol(), deleteAsignacion(), deleteObservacion(), guardarFirmas(), requireSession(), updateEncabezadoRol() (+1 more)

### Community 89 - "Community 89"
Cohesion: 0.25
Nodes (10): buildInstructions(), CONTEXT_MAP, __dirname, extractDomain(), GRAPH_JSON, KEYWORDS, main(), queryGraph() (+2 more)

### Community 90 - "Community 90"
Cohesion: 0.18
Nodes (1): WF

### Community 91 - "Community 91"
Cohesion: 0.20
Nodes (1): TWEAKS

### Community 92 - "Community 92"
Cohesion: 0.36
Nodes (9): formato_n_armas_aseguradas, formato_n_atencion_victimas, formato_n_eventos, formato_n_fge, formato_n_fgr, formato_n_medios_alternativos, formato_n_reportes, formato_n_rnd (+1 more)

### Community 93 - "Community 93"
Cohesion: 0.27
Nodes (8): cancelarSolicitud(), completarSolicitud(), requireMonitorista(), subirEvidencia(), actualizarEstadoSolicitud(), crearSolicitudEvidencia(), insertarEvidencia(), obtenerSolicitudFolioIncidente()

### Community 94 - "Community 94"
Cohesion: 0.38
Nodes (5): rowToSinNovedad(), toStr(), obtenerReportesSinNovedad(), listarReportesSinNovedad(), SinNovedadRow

### Community 95 - "Community 95"
Cohesion: 0.20
Nodes (7): btnSubmitStyle, fieldContainerStyle, grid2Style, iconStyle, inputStyle, labelStyle, sectionTitleStyle

### Community 96 - "Community 96"
Cohesion: 0.24
Nodes (6): PasoInfraccionProps, MAPA_GARANTIAS, SeccionGarantia(), SeccionGarantiaProps, SeccionMotivo(), SelectWrapper()

### Community 97 - "Community 97"
Cohesion: 0.28
Nodes (2): ad3ec5f mejorando esto, ping()

### Community 98 - "Community 98"
Cohesion: 0.22
Nodes (4): Accion, PermisoSeccion, Seccion, SECCIONES

### Community 99 - "Community 99"
Cohesion: 0.22
Nodes (1): TWEAKS

### Community 100 - "Community 100"
Cohesion: 0.22
Nodes (4): Accion, PermisoSeccion, Seccion, SECCIONES

### Community 101 - "Community 101"
Cohesion: 0.25
Nodes (6): CONTEXT_MAP_PATH, __dirname, GRAPH_JSON, LOADER_SCRIPT, ROOT, SKILL_PATH

### Community 102 - "Community 102"
Cohesion: 0.25
Nodes (3): Alertas, ICONS, NAV

### Community 103 - "Community 103"
Cohesion: 0.36
Nodes (6): ColumnInfo, getColumns(), getEnums(), getTables(), main(), SCHEMAS

### Community 104 - "Community 104"
Cohesion: 0.33
Nodes (5): btnDetalle, DetenidoRow, FotoInfo, TablaDetenidos(), tabStyle()

### Community 105 - "Community 105"
Cohesion: 0.52
Nodes (6): drawWatermark(), formatearFecha(), formatearOficio(), generarOrdenSalidaVehiculo(), loadImageAsBase64(), parrafoMixtoConWrap()

### Community 106 - "Community 106"
Cohesion: 0.29
Nodes (3): PasoConfirmacionProps, SeccionEstructurada, Props

### Community 107 - "Community 107"
Cohesion: 0.40
Nodes (5): Session, config, isPublic(), proxy(), PUBLIC_PATHS

### Community 108 - "Community 108"
Cohesion: 0.40
Nodes (4): calcularSemaforoVigencia(), SemaforoColor, CFG, SemaforoVigencia()

### Community 109 - "Community 109"
Cohesion: 0.50
Nodes (2): GruaRow, listarGruasActivas()

### Community 110 - "Community 110"
Cohesion: 0.50
Nodes (5): formatDate(), getStatusStyle(), InfraccionCiudadanoPage(), sanitize(), timeAgo()

### Community 111 - "Community 111"
Cohesion: 0.40
Nodes (2): cancelarFicha(), CancelacionModal()

### Community 112 - "Community 112"
Cohesion: 0.40
Nodes (4): createProrroga(), I, L, ProrrogaModal()

### Community 113 - "Community 113"
Cohesion: 0.40
Nodes (3): __dirname, KEYWORDS, ROOT

### Community 114 - "Community 114"
Cohesion: 0.50
Nodes (1): MAIN_ROUTES

### Community 115 - "Community 115"
Cohesion: 0.50
Nodes (2): ADMIN, pool

### Community 116 - "Community 116"
Cohesion: 0.50
Nodes (3): MapaPinFijo(), PIN_ICONS, Props

### Community 117 - "Community 117"
Cohesion: 1.00
Nodes (2): obtenerTokenFiscalia(), subirArchivoFiscalia()

### Community 118 - "Community 118"
Cohesion: 0.67
Nodes (2): ProrrogaViewerModal(), ProrrogaViewerModalProps

## Knowledge Gaps
- **678 isolated node(s):** `__dirname`, `ROOT`, `CONTEXT_MAP_PATH`, `GRAPH_JSON`, `LOADER_SCRIPT` (+673 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 84`** (2 nodes): `LogLine`, `LogType`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (2 nodes): `DC`, `DCCtx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (1 nodes): `WF`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (2 nodes): `ad3ec5f mejorando esto`, `ping()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 99`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 109`** (2 nodes): `GruaRow`, `listarGruasActivas()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 111`** (2 nodes): `cancelarFicha()`, `CancelacionModal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 114`** (1 nodes): `MAIN_ROUTES`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 115`** (2 nodes): `ADMIN`, `pool`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 117`** (2 nodes): `obtenerTokenFiscalia()`, `subirArchivoFiscalia()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 118`** (2 nodes): `ProrrogaViewerModal()`, `ProrrogaViewerModalProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `auth` connect `Community 16` to `Community 31`, `Community 1`, `Community 56`, `Community 62`, `Community 2`, `Community 25`, `Community 11`, `Community 28`, `Community 51`, `Community 0`, `Community 57`, `Community 26`, `Community 33`, `Community 12`, `Community 22`, `Community 49`, `Community 6`, `Community 69`, `Community 47`, `Community 27`, `Community 10`, `Community 73`, `Community 74`, `Community 7`, `Community 38`, `Community 63`, `Community 3`, `Community 34`, `Community 41`, `Community 14`, `Community 68`, `Community 93`, `Community 55`, `Community 79`, `Community 50`, `Community 23`, `Community 48`, `Community 13`, `Community 39`, `Community 5`, `Community 67`, `Community 88`, `Community 8`, `Community 80`, `Community 19`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `query()` connect `Community 2` to `Community 14`, `Community 35`, `Community 56`, `Community 44`, `Community 36`, `Community 11`, `Community 28`, `Community 53`, `Community 65`, `Community 47`, `Community 109`, `Community 12`, `Community 6`, `Community 10`, `Community 60`, `Community 97`, `Community 34`, `Community 20`, `Community 39`, `Community 69`, `Community 22`, `Community 38`, `Community 4`, `Community 79`, `Community 55`, `Community 17`, `Community 61`, `Community 13`, `Community 1`, `Community 21`, `Community 0`, `Community 74`, `Community 7`, `Community 64`, `Community 66`, `Community 94`, `Community 88`, `Community 8`, `Community 51`, `Community 16`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `SA7Repository` connect `Community 51` to `Community 63`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `__dirname`, `ROOT`, `CONTEXT_MAP_PATH` to the rest of the system?**
  _678 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0464213631423692 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04586404586404586 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.04690530770587198 - nodes in this community are weakly interconnected._