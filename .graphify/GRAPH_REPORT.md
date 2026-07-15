# Graph Report - .  (2026-07-15)

## Corpus Check
- Large corpus: 729 files · ~512,910 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 3706 nodes · 13010 edges · 137 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: MODIFIES: 4690 · contains: 2803 · imports: 1939 · ON_BRANCH: 1436 · imports_from: 1292 · calls: 415 · PARENT_OF: 337 · re_exports: 52 · method: 29 · references: 9 · inherits: 8


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 729 · Candidates: 880
- Excluded: 1 untracked · 73341 ignored · 1 sensitive · 30 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `7e39526`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `auth` - 140 edges
2. `query()` - 65 edges
3. `getUserWithRole()` - 27 edges
4. `DashboardHeader()` - 26 edges
5. `SubHeader()` - 17 edges
6. `tienePermiso()` - 17 edges
7. `tienePermiso()` - 16 edges
8. `authClient` - 15 edges
9. `AppError` - 14 edges
10. `requireOperador()` - 14 edges

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
Cohesion: 0.03
Nodes (72): Accion, obtenerRolNombre(), PermisoSeccion, ROLES_PERMITIDOS, Seccion, SECCIONES, tieneAccesoHub(), tieneAccesoSeccion() (+64 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (56): { GET, POST }, TIPO_CFG, 5558751 feat: módulo Prevención del Delito completo + fix flujo autenticación 2FA, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, f2c66e6 Extender roles y permisos finos a incidentes, prevención, auxiliar, 911, análisis, denuncia D1 y Formato N, ffcea0c fase 1 completada, db (+48 more)

### Community 2 - "Community 2"
Cohesion: 0.02
Nodes (66): guardarDetallesAseguradosJuzgadoAction(), guardarPuestaDisposicionJuzgadoAction(), obtenerDetalleAseguradoCompletoJuzgadoAction(), obtenerPuestaDisposicionJuzgadoAction(), obtenerDetalleAseguradoCompletoAction(), obtenerDetalleInfraccionViaAction(), obtenerPuestaDisposicionAction(), FormularioPuestaDisposicion() (+58 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (82): feature/monitorista, feature/monitorista-reportes, fix/detenidos, fix/incidentes-camara, fix/subir-fotografias, libraries, 0844e6e Corregido, 0fe445e vista de oficial (+74 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (48): 23b7312 Merge pull request #16 from presidenciaSJR/conexion, 27dcb21 Merge branch 'feature/testing' into feature/reportes, b5233a8 implementando via como modulo de oficial, f7b1aac Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, datosIniciales, mapRowToOficialViaDTO(), OfiOficialRow, OfiOficialViaDTO (+40 more)

### Community 5 - "Community 5"
Cohesion: 0.04
Nodes (55): 06c55f5 Merge branch 'feature/testing' into feature/reportes, 41ea169 Merge branch 'testing' into conexion, 8355ac0 Merge branch 'feature/testing' into feature/implementacion-consumir-datos-denuncia, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, filtroBtn(), FormatoNFgePage(), formato_n_armas_aseguradas (+47 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (75): num(), parseDetenidos(), parseSolicitudesJson(), parseTurno(), rowToDenunciaDetalle(), rowToDependencia(), rowToEvidencia(), rowToEvidenciaArchivo() (+67 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (79): conexion, feature/testing, main, testing, 0c8695c Cambios en filtros, 0caf5dd Fixes, 11be750 Fase 1 de correccion - completada - pendiente testing, 11e8817 Merge branch 'testing' into juzgado (+71 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (69): 0d9172a mejorando flujo de 911-despacho, 13f7f39 Reporte-incidentes, 2e958e1 catalogo de grupo de incidencia, 5ef7cf3 Agregar los campos faltantes, ef95840 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, parseJsonField(), rowToD1(), rowToDespachoAsignado() (+61 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (65): createBodyCam(), createConcepto(), createMedioCanalizacion(), createRadio(), createSector(), createTipoEmergencia(), createTipoObservacion(), req() (+57 more)

### Community 10 - "Community 10"
Cohesion: 0.04
Nodes (49): btnBackStyle, btnFinishStyle, btnGeoStyle, btnNextStyle, cardStyle, footerActions, grid3, labelStyle (+41 more)

### Community 11 - "Community 11"
Cohesion: 0.05
Nodes (59): 067c4de arreglando flujo de fiscalia  a schema via, accionTomarCaso(), AseguradosData, guardarDetallesAseguradoAction(), guardarDetallesAseguradosAction(), guardarPuestaDisposicionAction(), LiberacionesData, obtenerSolicitudes() (+51 more)

### Community 12 - "Community 12"
Cohesion: 0.04
Nodes (51): obtenerAseguradosJuzgadoAction(), concatNombre(), disabledSx, displayVal(), FormularioAseguradoJuzgado(), labelSx, Props, metadata (+43 more)

### Community 13 - "Community 13"
Cohesion: 0.06
Nodes (33): Departamento, inputStyle, labelStyle, Props, selectStyle, 16a63d4 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, 863c575 Merge pull request #24 from presidenciaSJR/feature/testing, 91c36bf validando orden de pago (+25 more)

### Community 14 - "Community 14"
Cohesion: 0.05
Nodes (46): Accion, registrarAudit(), obtenerIphDetenido(), obtenerPrellenadoCompleto(), obtenerSolicitudConEvidencias(), obtenerPrellenado(), actualizarArmaAsegurada(), ArmaFuente (+38 more)

### Community 15 - "Community 15"
Cohesion: 0.07
Nodes (54): rowToAlarmaEscolar(), rowToDespacho(), rowToDespachoElemento(), rowToDespachoUnidad(), rowToExtorsion(), rowToIncidenteBasico(), rowToIncidenteConDespachoBase(), rowToIncidenteDetalleCompletoBase() (+46 more)

### Community 16 - "Community 16"
Cohesion: 0.06
Nodes (41): actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista(), obtenerOficialPorId(), reactivarOficialConDatos(), requireAdminTransito() (+33 more)

### Community 17 - "Community 17"
Cohesion: 0.05
Nodes (47): accionPedirEvidencias(), guardarDetallesAseguradoAction(), CapturarDetallesForm(), disabledSx, emptyItem(), EvidenciaItem, inputSx, labelSx (+39 more)

### Community 18 - "Community 18"
Cohesion: 0.06
Nodes (51): accionCerrarCaso(), accionTomarCaso(), AseguradosJuzgadoData, LiberacionesData, obtenerSolicitudes(), SolicitudesData, num(), rowToInfraccionDetalle() (+43 more)

### Community 19 - "Community 19"
Cohesion: 0.05
Nodes (40): 435348e corrigiendo flujo de rondin, f0089cf Merge pull request #21 from presidenciaSJR/conexion, BTN, BTN_SM, DespachoForm(), Elemento, ERR, I (+32 more)

### Community 20 - "Community 20"
Cohesion: 0.08
Nodes (32): capturarInfractorAction(), finalizarRevisionAction(), generarOrdenPagoAction(), obtenerDashboardLiberaciones(), obtenerDetalleInfraccionLiberaciones(), obtenerDocumentosLiberacion(), obtenerLiberaciones(), revisarDocumentoAction() (+24 more)

### Community 21 - "Community 21"
Cohesion: 0.08
Nodes (25): SubirFotoDetenido(), 388b997 Apartados para subir fotografias de los detenidos, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from presidenciaSJR/fix/subir-fotografias, FilaDetenidoRol(), btnDetalle, pagBtn, insertarFotoFiscalia() (+17 more)

### Community 22 - "Community 22"
Cohesion: 0.08
Nodes (22): a2e0623 Consolidado de formatos N y SubHeader, ajustes en servicios de reportes, f5fac0b Merge branch 'testing' into conexion, SignOutButton(), filtroBtn(), FormatoNAtencionVictimasPage(), filtroBtn(), FormatoNFgrPage(), filtroBtn() (+14 more)

### Community 23 - "Community 23"
Cohesion: 0.07
Nodes (30): createUser(), requireAdmin(), updateUser(), ActionResult, ApiHandler, ApiResponse, AppError, ConflictError (+22 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (26): obtenerDashboardJuzgado(), ProfileDropdown(), Props, ToastExito(), 090c4dd vista de fiscalia, 44ebbc4 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into testing, 997ef65 Merge pull request #2 from presidenciaSJR/juzgado, a291695 Merge branch 'feature/testing' into feature/denuncias (+18 more)

### Community 25 - "Community 25"
Cohesion: 0.06
Nodes (36): obtenerEvidenciasMonitorista(), obtenerDatosAsegurado(), verificarRolJuzgado(), 1f7c0d7 Merge pull request #23 from presidenciaSJR/conexion, 375d265 flujo de fiscalia, 6109a7a replicando flujo para fiscalia, CapturarDetallesForm(), disabledSx (+28 more)

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (44): rowToAutoridadAdicional(), rowToBusqueda(), rowToContestacion(), rowToFichaBusquedaDetalle(), rowToMedida(), rowToMedidaDetalle(), rowToSeguimiento(), rowToSolicitud() (+36 more)

### Community 27 - "Community 27"
Cohesion: 0.06
Nodes (29): btnPrimario, btnSecundario, inputStyle, labelStyle, pageWrap, selectStyle, btnPrimario(), btnSecundario (+21 more)

### Community 28 - "Community 28"
Cohesion: 0.08
Nodes (23): actionTextStyle, cardContentStyle, cardDescStyle, cardStyle, cardTitleStyle, decoratorLine, iconBoxStyle, systemStatusStyle (+15 more)

### Community 29 - "Community 29"
Cohesion: 0.06
Nodes (23): guardarOficioJuzgadoAction(), obtenerDetalleInfraccionViaActionJuzgado(), obtenerLiberacionesAction(), BotonVerDetalle(), BotonVerDetalleProps, CargarOficioSectionProps, ConfirmacionModalProps, VARIANTES (+15 more)

### Community 30 - "Community 30"
Cohesion: 0.07
Nodes (26): insertarDocumentoLiberacion(), obtenerDashboardCorralon(), obtenerSolicitudes(), TabSolicitudes, rowToSolicitud(), toStr(), ModuleCard(), ProfileDropdown() (+18 more)

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (34): rowToArma(), rowToCateo(), rowToDetencionInc(), rowToDetencionOfi(), rowToDroga(), rowToExtorsion(), rowToHidrocarburo(), rowToOrdenAprehension() (+26 more)

### Community 32 - "Community 32"
Cohesion: 0.06
Nodes (23): 3c12c41 cambios en flujo de 911-despacho, 7a1ae94 911-rondin, cacheGet(), cacheKey(), cacheSet(), CHECKPOINT_SCRIPT, ContextLoaderPlugin(), DECISION_MSG (+15 more)

### Community 33 - "Community 33"
Cohesion: 0.08
Nodes (23): 126b4d1 Monitorista V1, 46b2c89 Merge branch 'testing' into juzgado, da33516 Merge pull request #3 from presidenciaSJR/feature/monitorista, BandejaSolicitudes(), btnDetalle, btnPrimary, btnSuccess, origenBadge (+15 more)

### Community 34 - "Community 34"
Cohesion: 0.11
Nodes (27): liberarGarantiaInfraccionesAction(), obtenerDashboardInfracciones(), obtenerDetalleInfraccionInfracciones(), obtenerInfracciones(), columns, DataRow, InfraccionesTableProps, inputToDbParams() (+19 more)

### Community 35 - "Community 35"
Cohesion: 0.10
Nodes (24): 5d179c0 Apartado de reportes, 8e6c8c6 Apartado de reportes, limpiarCacheToken(), obtenerGuestToken(), subirArchivoExpediente(), cancelarSolicitud(), completarSolicitud(), requireMonitorista() (+16 more)

### Community 36 - "Community 36"
Cohesion: 0.07
Nodes (16): rowToLiberacion(), Accion, PermisoSeccion, Seccion, SECCIONES, tienePermiso(), obtenerLiberaciones(), obtenerRolUsuario() (+8 more)

### Community 37 - "Community 37"
Cohesion: 0.14
Nodes (29): 09a02d5 Fix Reporte Rondin, 22bf125 Merge pull request #20 from presidenciaSJR/conexion, f4cf76c Actualización Rondin, addPersonaAfectada(), CANALES, cerrarPorDetencion(), createAlarmaEscolar(), createDespacho() (+21 more)

### Community 38 - "Community 38"
Cohesion: 0.07
Nodes (20): AGENTS_PATH, agentsChars, BOVEDA_DIR, charsToTokens(), __dirname, discoveryCost, { docs, chars: bovedaChars }, estimateYoumindagContext() (+12 more)

### Community 39 - "Community 39"
Cohesion: 0.10
Nodes (15): mapCrearInfraccionToDB(), mapInfraccionDetalle(), InfraccionesRepository, generarFolioInfraccion(), InfraccionesService, randomBase36Char(), rellenarBase36(), sanitizeCrearInfraccionPayload() (+7 more)

### Community 40 - "Community 40"
Cohesion: 0.12
Nodes (20): cardStyle, rowToRol(), rowToUsuarioLista(), toStr(), actualizarUsuario(), asignarRolUsuario(), crearRol(), eliminarSesion() (+12 more)

### Community 41 - "Community 41"
Cohesion: 0.09
Nodes (26): actualizarDatosInfractor(), actualizarDatosInfractorIniciarProceso(), actualizarEstatusDependenciaMesaControl(), actualizarEstatusPendientePagoInfraccion(), actualizarEstatusSolicitudLiberacion(), actualizarEvidenciasInfraccion(), actualizarUrlOrdenSalida(), actualizarUrlsDocumentosInfraccion() (+18 more)

### Community 42 - "Community 42"
Cohesion: 0.12
Nodes (20): 0c31cc2 Merge branch 'testing' into juzgado, 290d651 feat(despacho): flujo integral 911 → despacho → oficial → D1 → legal, 458bbfb registro de reporte de campo - oficial, 93dd3ea Merge pull request #1 from presidenciaSJR/juzgado, b79a96a Conexión entre ambos modulos, accounts, sessions, twoFactors (+12 more)

### Community 43 - "Community 43"
Cohesion: 0.10
Nodes (22): DetalleInfraccionView(), DocumentacionSection(), formatCurrency(), formatDate(), FundamentoLegalSection(), InfraccionDetalle, InfraccionGarantia, InfraccionHeader (+14 more)

### Community 44 - "Community 44"
Cohesion: 0.13
Nodes (20): rowToIncidenteCamara(), rowToTotalesCamara(), toNum(), toNumNullable(), toStr(), obtenerConcentradoDiario(), obtenerIncidentesCamara(), obtenerPorTurno() (+12 more)

### Community 45 - "Community 45"
Cohesion: 0.12
Nodes (11): rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), toStr(), listarDepartamentosActivos(), obtenerOficialExistente(), upsertOficial(), Departamento (+3 more)

### Community 46 - "Community 46"
Cohesion: 0.09
Nodes (17): ac5d42f cerrando flujo de 911-despacho-, eacfdaf mostrando toast de guardado, btnNuevoStyle, btnViewStyle, cardStyle, decoratorStyle, footerStyle, headerInnerStyle (+9 more)

### Community 47 - "Community 47"
Cohesion: 0.11
Nodes (13): Field(), FormActions(), FormHeader(), Section(), Select(), Textarea(), BuscadorEvento(), OPCIONES (+5 more)

### Community 48 - "Community 48"
Cohesion: 0.12
Nodes (7): ProfileDropdownAuxiliar(), Props, 6a042cd feat: sistema de autenticación, dashboard y esquema de base de datos, Enable2FA(), s, Step, authClient

### Community 49 - "Community 49"
Cohesion: 0.13
Nodes (9): ede5a1d eliminado referencias a via_prueba, mapRowToOrdenPago(), OrdenPagoRow, SA7Repository, SA7Service, CatalogoConceptoSA7, GenerarOrdenPagoDTO, OrdenPagoSA7 (+1 more)

### Community 50 - "Community 50"
Cohesion: 0.08
Nodes (20): btnBackStyle, btnNextStyle, btnSubmitStyle, center, fieldContainerStyle, grid2Style, grid3Style, grid4Style (+12 more)

### Community 51 - "Community 51"
Cohesion: 0.11
Nodes (13): 5bbdda8 Merge pull request #8 from presidenciaSJR/juzgado, ff6d3c2 juzgado, BotonVerDetalle(), BotonVerDetalleProps, ConfirmacionModalProps, VARIANTES, AVATAR_COLORS, EstatusFiscalia (+5 more)

### Community 52 - "Community 52"
Cohesion: 0.09
Nodes (17): a, AGENTS_PATH, agentsSize, b, BOVEDA_DIR, bovedaDocs, charsToTokens(), __dirname (+9 more)

### Community 53 - "Community 53"
Cohesion: 0.17
Nodes (16): 75ca4b2 Merge pull request #9 from presidenciaSJR/conexion, 953d38a implementando vista de fiscalia, MailAttachment, MailOptions, sendMail(), transporter, enviarCorreoAsignacionFiscalia(), enviarCorreoOrdenLiberacion() (+8 more)

### Community 54 - "Community 54"
Cohesion: 0.12
Nodes (14): 0e33bf6 feat: módulo Admin, Prórroga, Filtros medidas, Autoridades adicionales y Notificaciones/Alertas, HITOS_ALERTAR, createProrroga(), I, L, ProrrogaModal(), ProrrogaViewerModal(), ProrrogaViewerModalProps (+6 more)

### Community 55 - "Community 55"
Cohesion: 0.10
Nodes (16): Arma, cardStyle, Consolidado, Evento, Fge, Fgr, linkBtn, Medios (+8 more)

### Community 56 - "Community 56"
Cohesion: 0.15
Nodes (18): addDecision(), append(), args, budget(), budgetReport(), DECISIONS_FILE, __dirname, ensureDir() (+10 more)

### Community 57 - "Community 57"
Cohesion: 0.14
Nodes (11): AddressData, eliminarInfraccionAction(), ProcesoEstado, ViewArticulosLista, generarOrdenPago(), config, getStepIndex(), ProcesoModal() (+3 more)

### Community 58 - "Community 58"
Cohesion: 0.20
Nodes (15): rowToReporteDiario(), rowToReporteSemanal(), toNum(), obtenerReporteDiario(), obtenerReporteSemanal(), combinar(), COMBO_KEYS, listarReporteDiario() (+7 more)

### Community 59 - "Community 59"
Cohesion: 0.14
Nodes (16): components, __dirname, dirty, EXTENSIONS, fileMap, filesToModify, forceFlag, ROOT (+8 more)

### Community 60 - "Community 60"
Cohesion: 0.25
Nodes (10): 2fcba7b vista de reportes de incidentes diarios y semanales, 552d291 Merge branch 'testing' into conexion, 719b5ab cambio para generacion de reportes semanal y diario, FiltrosIncidencias(), PaginationProps, IncidenteStat(), styles, Props (+2 more)

### Community 61 - "Community 61"
Cohesion: 0.14
Nodes (14): 5d2b064 fix vercel upload files, da48f68 implementando flujo de aceptacion de documentos, concatName(), obtenerDetalleInfraccionVia(), obtenerTokenGuest(), parseEvidencias(), rowToInfraccionDetalle(), ViaInfraccionGarantia (+6 more)

### Community 62 - "Community 62"
Cohesion: 0.20
Nodes (6): ad3ec5f mejorando esto, ping(), rowToSinD1(), toStr(), obtenerSinD1(), SinD1Row

### Community 63 - "Community 63"
Cohesion: 0.18
Nodes (14): contarPorEstatus(), listarIncidentes(), listarIncidentesRecientes(), obtenerCatalogos(), obtenerIncidente(), obtenerIncidenteConExtras(), obtenerStats(), obtenerTiposIncidente() (+6 more)

### Community 64 - "Community 64"
Cohesion: 0.26
Nodes (13): rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), toStr(), obtenerCuestionariosRobo(), obtenerParesReporte(), upsertChecklist(), guardarChecklist() (+5 more)

### Community 65 - "Community 65"
Cohesion: 0.21
Nodes (12): rowToReporteD1(), toBool(), toNum(), toStr(), insertarReporteDenuncia(), obtenerGruposAdscripcion(), obtenerReportesD1(), verificarFolioDenunciaUnico() (+4 more)

### Community 66 - "Community 66"
Cohesion: 0.13
Nodes (9): cardStyle, onlineStyle, Accion, obtenerPermisosUsuario(), PermisoRow, PermisoSeccion, Seccion, enviarFoto() (+1 more)

### Community 67 - "Community 67"
Cohesion: 0.16
Nodes (16): __dirname, dirty, escapeRegex(), EXTENSIONS, fileMap, filesToModify, findFunctionBody(), findFunctionBodyFallback() (+8 more)

### Community 68 - "Community 68"
Cohesion: 0.16
Nodes (10): 67b1cb7 ReporteWord, 7e39526 Mejoras UI/UX, CARD, G3, INP, LBL, NUM, SEC (+2 more)

### Community 69 - "Community 69"
Cohesion: 0.17
Nodes (8): obtenerArticulosAction(), obtenerFraccionesAction(), ArticulosMapper, QueryRow, ArticulosRepository, ArticulosService, ArticuloLey, FraccionLey

### Community 70 - "Community 70"
Cohesion: 0.14
Nodes (8): capturarInfractorInfraccionesAction(), FieldName, Props, CapturaInfractorActions, CapturaInfractorState, CapturaInfractorStore, initialState, useCapturaInfractorStore

### Community 71 - "Community 71"
Cohesion: 0.31
Nodes (9): 156c925 vista de reporte de sin robos, 22b7b54 Merge branch 'feature/reportes' into feature/testing, 97a156c Reportes con D1, sin D1 y sin robo, PaginacionSinRobos(), paginationButtonStyle, PaginationProps, TablaReportesLimpios(), ReportFilters() (+1 more)

### Community 72 - "Community 72"
Cohesion: 0.25
Nodes (14): Alignment, allBorders, dRow(), GET(), hRow(), NO_BORDER, noBorders, p() (+6 more)

### Community 73 - "Community 73"
Cohesion: 0.19
Nodes (12): guardarDatosCoordinacion(), num(), obtenerArmasDia(), obtenerConteosDetenidos(), obtenerDatosCapturados(), obtenerEventosDia(), obtenerRND(), upsertFge() (+4 more)

### Community 74 - "Community 74"
Cohesion: 0.20
Nodes (11): cleanColoniaName(), containerStyle, DEFAULT_CENTER, extractAddress(), extractNeighborhoodFromComponents(), getMunicipioEstado(), LIBRARIES, MapaDireccionRegistro() (+3 more)

### Community 75 - "Community 75"
Cohesion: 0.15
Nodes (11): DocConfig, DOCS_ACCIDENTE, DOCS_DELITO, DOCS_EMPRESA, DOCS_INFRACCION, getEstatusConfig(), MOTIVO_TO_SUBTIPO, Props (+3 more)

### Community 76 - "Community 76"
Cohesion: 0.21
Nodes (8): paginationButtonStyle, PaginationProps, PhoneReport, PhoneReportsTable(), ReportesTabs(), OperationalTable(), OperationalTableProps, styles

### Community 77 - "Community 77"
Cohesion: 0.23
Nodes (10): actualizarFgr(), crearFgr(), formatFecha(), FormatoNFgrInput, listarFgr(), obtenerFgr(), obtenerFgrPorFechaPeriodo(), parsePeriodo() (+2 more)

### Community 78 - "Community 78"
Cohesion: 0.23
Nodes (10): actualizarMediosAlternativos(), crearMediosAlternativos(), formatFecha(), FormatoNMediosAlternativosInput, listarMediosAlternativos(), obtenerMediosAlternativos(), obtenerMediosAlternativosPorFechaPeriodo(), parsePeriodo() (+2 more)

### Community 79 - "Community 79"
Cohesion: 0.18
Nodes (13): buildHelperCode(), components, __dirname, dirty, EXTENSIONS, fileMap, filesToModify, findReactImportWithTS() (+5 more)

### Community 80 - "Community 80"
Cohesion: 0.38
Nodes (7): 4c9fa8a vista de reporte de d1 no iniciada, 712c116 Merge branch 'testing' into conexion, DescargaFilters(), DescargaPagination(), PaginationProps, DescargaTable(), styles

### Community 81 - "Community 81"
Cohesion: 0.26
Nodes (11): CWD, __dirname, populateAPIRoutes(), populateComandos(), populateEnvVars(), populateEstructura(), populateFeatures(), populateLibrerias() (+3 more)

### Community 82 - "Community 82"
Cohesion: 0.17
Nodes (11): btnBuscarStyle, btnLimpiarStyle, CANALES, CatalogoItem, ESTATUS, fieldStyle, FiltrosIncidentes(), inputStyle (+3 more)

### Community 83 - "Community 83"
Cohesion: 0.17
Nodes (7): AVATAR_COLORS, EstatusInfracciones, Props, SORTABLE_KEYS, STATUS_BADGE, STATUS_TABS, BotonVerDetalle()

### Community 84 - "Community 84"
Cohesion: 0.17
Nodes (7): AVATAR_COLORS, EstatusLiberaciones, Props, SORTABLE_KEYS, STATUS_BADGE, STATUS_TABS, TIPO_LIBERACION_OPTS

### Community 85 - "Community 85"
Cohesion: 0.18
Nodes (6): guardarOficioAction(), CargarOficioSectionProps, Toast, ToastStore, ToastType, useToastStore

### Community 86 - "Community 86"
Cohesion: 0.27
Nodes (5): POST(), subirArchivo(), validarArchivo(), getExpedienteHost(), getExpedienteToken()

### Community 87 - "Community 87"
Cohesion: 0.17
Nodes (2): LogLine, LogType

### Community 88 - "Community 88"
Cohesion: 0.24
Nodes (7): generarAlertasBusquedas(), rowToNotificacion(), eliminarAlertasBusqueda(), listarNotificacionesNoLeidas(), marcarNotificacionLeida(), marcarTodasNotificacionesLeidas(), Notificacion

### Community 89 - "Community 89"
Cohesion: 0.24
Nodes (11): buildInstructions(), buildKeywords(), CONTEXT_MAP, __dirname, extractDomain(), GRAPH_JSON, KEYWORDS, main() (+3 more)

### Community 90 - "Community 90"
Cohesion: 0.40
Nodes (7): 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into conexion, D1Filters(), D1Pagination(), PaginationProps, D1ReportsTable(), styles

### Community 91 - "Community 91"
Cohesion: 0.18
Nodes (5): Accion, PermisoRow, PermisoSeccion, Seccion, SECCIONES

### Community 92 - "Community 92"
Cohesion: 0.18
Nodes (3): Module, ModuleCards(), MODULES

### Community 93 - "Community 93"
Cohesion: 0.18
Nodes (2): DC, DCCtx

### Community 94 - "Community 94"
Cohesion: 0.18
Nodes (1): WF

### Community 95 - "Community 95"
Cohesion: 0.33
Nodes (8): rowToCatalogo(), rowToIncidenteDetalle(), rowToIncidenteResumen(), toNum(), toStr(), CatalogoItem, IncidenteDetalle, IncidenteResumen

### Community 96 - "Community 96"
Cohesion: 0.22
Nodes (8): HistorialIncidente(), marcarEnSitioOficial(), Asignacion, DespachoContent(), Props, FormularioRecorrido(), MarcarEnSitioButton(), Props

### Community 97 - "Community 97"
Cohesion: 0.20
Nodes (1): TWEAKS

### Community 98 - "Community 98"
Cohesion: 0.36
Nodes (9): formato_n_armas_aseguradas, formato_n_atencion_victimas, formato_n_eventos, formato_n_fge, formato_n_fgr, formato_n_medios_alternativos, formato_n_reportes, formato_n_rnd (+1 more)

### Community 99 - "Community 99"
Cohesion: 0.24
Nodes (6): BusquedasFiltros(), ESTADOS, TIPOS, AUTORIDADES, JuridicoFiltros(), SearchBox()

### Community 100 - "Community 100"
Cohesion: 0.20
Nodes (7): btnSubmitStyle, fieldContainerStyle, grid2Style, iconStyle, inputStyle, labelStyle, sectionTitleStyle

### Community 101 - "Community 101"
Cohesion: 0.20
Nodes (7): child, LOG, needsShell, opts, ORIG, PID_FILE, ROOT

### Community 102 - "Community 102"
Cohesion: 0.22
Nodes (8): arrowBtnStyle, containerStyle, infoStyle, labelStyle, pageNumberStyle, Pagination(), PaginationProps, valueStyle

### Community 103 - "Community 103"
Cohesion: 0.22
Nodes (4): Accion, PermisoSeccion, Seccion, SECCIONES

### Community 104 - "Community 104"
Cohesion: 0.22
Nodes (5): Accion, PermisoSeccion, Seccion, SECCIONES, tienePermiso()

### Community 105 - "Community 105"
Cohesion: 0.22
Nodes (5): Accion, PermisoSeccion, Seccion, SECCIONES, tienePermiso()

### Community 106 - "Community 106"
Cohesion: 0.22
Nodes (1): TWEAKS

### Community 107 - "Community 107"
Cohesion: 0.22
Nodes (4): Accion, PermisoSeccion, Seccion, SECCIONES

### Community 108 - "Community 108"
Cohesion: 0.44
Nodes (4): rowToSinNovedad(), toStr(), obtenerReportesSinNovedad(), SinNovedadRow

### Community 109 - "Community 109"
Cohesion: 0.33
Nodes (7): __dirname, getColumns(), getEnums(), getSchemas(), getTables(), main(), ROOT

### Community 110 - "Community 110"
Cohesion: 0.25
Nodes (6): CONTEXT_MAP_PATH, __dirname, GRAPH_JSON, LOADER_SCRIPT, ROOT, SKILL_PATH

### Community 111 - "Community 111"
Cohesion: 0.36
Nodes (6): ColumnInfo, getColumns(), getEnums(), getTables(), main(), SCHEMAS

### Community 112 - "Community 112"
Cohesion: 0.38
Nodes (6): getMapsWindow(), GoogleMapsNamespace, GoogleMapsWindow, loadGoogleMaps(), waitForGoogle(), Window

### Community 113 - "Community 113"
Cohesion: 0.33
Nodes (5): btnDetalle, DetenidoRow, FotoInfo, TablaDetenidos(), tabStyle()

### Community 114 - "Community 114"
Cohesion: 0.52
Nodes (6): drawWatermark(), formatearFecha(), formatearOficio(), generarOrdenSalidaVehiculo(), loadImageAsBase64(), parrafoMixtoConWrap()

### Community 115 - "Community 115"
Cohesion: 0.29
Nodes (6): AgregarAutoridadForm(), Autoridad, AUTORIDADES, I, L, Props

### Community 116 - "Community 116"
Cohesion: 0.33
Nodes (6): CONTEXT_MAP, __dirname, extractDomain(), KEYWORDS, loadKeywords(), ROOT

### Community 117 - "Community 117"
Cohesion: 0.40
Nodes (5): Session, config, isPublic(), proxy(), PUBLIC_PATHS

### Community 118 - "Community 118"
Cohesion: 0.33
Nodes (2): createVisita(), VisitaModal()

### Community 119 - "Community 119"
Cohesion: 0.40
Nodes (4): calcularSemaforoVigencia(), SemaforoColor, CFG, SemaforoVigencia()

### Community 120 - "Community 120"
Cohesion: 0.40
Nodes (3): columns, DataRow, FiscaliaTableProps

### Community 121 - "Community 121"
Cohesion: 0.40
Nodes (2): cancelarFicha(), CancelacionModal()

### Community 122 - "Community 122"
Cohesion: 0.50
Nodes (2): ModuleCardProps, Stat

### Community 123 - "Community 123"
Cohesion: 0.50
Nodes (4): 905531c trabajando en panel de fiscalia, a2145fb Merge branch 'testing' into juzgado, c194e54 envio de solicitud de evidencias completado, c4523ac tabla de fiscalia, evidencias funcional

### Community 124 - "Community 124"
Cohesion: 0.50
Nodes (1): MAIN_ROUTES

### Community 125 - "Community 125"
Cohesion: 0.50
Nodes (2): ADMIN, pool

### Community 126 - "Community 126"
Cohesion: 0.50
Nodes (2): Filtros, IncidenteResumen

### Community 127 - "Community 127"
Cohesion: 0.50
Nodes (1): OficialesViaRepository

### Community 128 - "Community 128"
Cohesion: 0.67
Nodes (3): getExtension(), Props, VerDocumentoModal()

### Community 129 - "Community 129"
Cohesion: 0.67
Nodes (1): Stage

### Community 130 - "Community 130"
Cohesion: 1.00
Nodes (2): obtenerTokenFiscalia(), subirArchivoFiscalia()

### Community 131 - "Community 131"
Cohesion: 0.67
Nodes (1): IncidenteDetalle

### Community 132 - "Community 132"
Cohesion: 0.67
Nodes (1): ReporteCampoDetalle

### Community 133 - "Community 133"
Cohesion: 0.67
Nodes (1): InputProps

### Community 134 - "Community 134"
Cohesion: 0.67
Nodes (1): SectionProps

### Community 135 - "Community 135"
Cohesion: 1.00
Nodes (1): eslintConfig

### Community 136 - "Community 136"
Cohesion: 1.00
Nodes (1): config

## Knowledge Gaps
- **828 isolated node(s):** `__dirname`, `ROOT`, `TOKEN_LOG`, `GRAPH_PATH`, `CHECKPOINT_SCRIPT` (+823 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 87`** (2 nodes): `LogLine`, `LogType`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (2 nodes): `DC`, `DCCtx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (1 nodes): `WF`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 106`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 118`** (2 nodes): `createVisita()`, `VisitaModal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 121`** (2 nodes): `cancelarFicha()`, `CancelacionModal()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 122`** (2 nodes): `ModuleCardProps`, `Stat`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 124`** (1 nodes): `MAIN_ROUTES`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 125`** (2 nodes): `ADMIN`, `pool`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 126`** (2 nodes): `Filtros`, `IncidenteResumen`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 127`** (1 nodes): `OficialesViaRepository`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 129`** (1 nodes): `Stage`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 130`** (2 nodes): `obtenerTokenFiscalia()`, `subirArchivoFiscalia()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 131`** (1 nodes): `IncidenteDetalle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 132`** (1 nodes): `ReporteCampoDetalle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 133`** (1 nodes): `InputProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 134`** (1 nodes): `SectionProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 135`** (1 nodes): `eslintConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 136`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `auth` connect `Community 1` to `Community 23`, `Community 16`, `Community 13`, `Community 0`, `Community 34`, `Community 18`, `Community 20`, `Community 28`, `Community 49`, `Community 5`, `Community 33`, `Community 30`, `Community 80`, `Community 8`, `Community 21`, `Community 66`, `Community 44`, `Community 29`, `Community 11`, `Community 3`, `Community 22`, `Community 14`, `Community 77`, `Community 78`, `Community 72`, `Community 86`, `Community 2`, `Community 37`, `Community 46`, `Community 41`, `Community 35`, `Community 73`, `Community 68`, `Community 88`, `Community 47`, `Community 27`, `Community 42`, `Community 39`, `Community 17`, `Community 60`, `Community 4`, `Community 9`, `Community 19`, `Community 71`, `Community 24`, `Community 25`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `query()` connect `Community 0` to `Community 63`, `Community 40`, `Community 16`, `Community 45`, `Community 41`, `Community 18`, `Community 20`, `Community 36`, `Community 64`, `Community 44`, `Community 13`, `Community 30`, `Community 65`, `Community 11`, `Community 62`, `Community 37`, `Community 14`, `Community 15`, `Community 39`, `Community 4`, `Community 21`, `Community 35`, `Community 6`, `Community 73`, `Community 54`, `Community 88`, `Community 8`, `Community 1`, `Community 26`, `Community 17`, `Community 5`, `Community 77`, `Community 78`, `Community 58`, `Community 31`, `Community 108`, `Community 23`, `Community 9`, `Community 49`, `Community 61`, `Community 28`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `SA7Repository` connect `Community 49` to `Community 13`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `__dirname`, `ROOT`, `TOKEN_LOG` to the rest of the system?**
  _828 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.033232016210739616 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04002026342451875 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.024054982817869417 - nodes in this community are weakly interconnected._