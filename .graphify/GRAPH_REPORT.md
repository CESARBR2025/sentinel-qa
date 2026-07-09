# Graph Report - .  (2026-07-09)

## Corpus Check
- Large corpus: 660 files · ~461,855 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 3151 nodes · 9943 edges · 117 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: MODIFIES: 3555 · contains: 2355 · imports: 1752 · imports_from: 1172 · ON_BRANCH: 411 · calls: 319 · PARENT_OF: 282 · re_exports: 52 · method: 29 · references: 9 · inherits: 7


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 660 · Candidates: 739
- Excluded: 679 untracked · 81866 ignored · 0 sensitive · 73 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `c27a9ee`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `auth` - 132 edges
2. `query()` - 60 edges
3. `DashboardHeader()` - 26 edges
4. `getUserWithRole()` - 25 edges
5. `SubHeader()` - 17 edges
6. `tienePermiso()` - 15 edges
7. `authClient` - 14 edges
8. `AppError` - 14 edges
9. `toStr()` - 13 edges
10. `insertHistorial()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `crearHoja()`  [EXTRACTED]
  app/api/reportes-telefonicos/exportar/route.ts → app/api/camara/exportar/route.ts
- `DetalleCiudadanoCompletoPage()` --calls--> `getStatusBadgeStyle()`  [EXTRACTED]
  app/911/ciudadano/incidentes/[id]/page.tsx → app/911/whatsapp/incidentes/[id]/page.tsx
- `DetalleRondinCompletoPage()` --calls--> `getStatusBadgeStyle()`  [EXTRACTED]
  app/911/rondin/incidentes/[id]/page.tsx → app/911/whatsapp/incidentes/[id]/page.tsx
- `FichaDetailPage()` --calls--> `fmtDT()`  [EXTRACTED]
  app/prevencion/busquedas/[id]/page.tsx → app/prevencion/juridico/solicitudes/[id]/page.tsx
- `POST()` --calls--> `mapearEstatusFinal()`  [EXTRACTED]
  app/api/via/ciudadano/subir-archivo/route.ts → app/api/corralon/subir-archivo/route.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (42): tieneAccesoSeccion(), { GET, POST }, TIPO_CFG, 1e81ec8 Datos se autorellenan de denuncias y seccion de oficial, 5558751 feat: módulo Prevención del Delito completo + fix flujo autenticación 2FA, 5618308 guardado e evidencias con ed, 77ddf58 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, ad3ec5f mejorando esto (+34 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (54): 23b7312 Merge pull request #16 from presidenciaSJR/conexion, 27dcb21 Merge branch 'feature/testing' into feature/reportes, b5233a8 implementando via como modulo de oficial, f7b1aac Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, datosIniciales, mapRowToOficialViaDTO(), OfiOficialRow, OfiOficialViaDTO (+46 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (50): 06c55f5 Merge branch 'feature/testing' into feature/reportes, 41ea169 Merge branch 'testing' into conexion, 8355ac0 Merge branch 'feature/testing' into feature/implementacion-consumir-datos-denuncia, a2e0623 Consolidado de formatos N y SubHeader, ajustes en servicios de reportes, bb10dcd Formatos V1, c95f412 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, f5fac0b Merge branch 'testing' into conexion, filtroBtn() (+42 more)

### Community 3 - "Community 3"
Cohesion: 0.02
Nodes (60): guardarDetallesAseguradosJuzgadoAction(), guardarPuestaDisposicionJuzgadoAction(), obtenerDetalleAseguradoCompletoJuzgadoAction(), obtenerPuestaDisposicionJuzgadoAction(), obtenerDetalleInfraccionLiberaciones(), obtenerDetalleAseguradoCompletoAction(), obtenerPuestaDisposicionAction(), FormularioPuestaDisposicion() (+52 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (68): accionPedirEvidencias(), accionTomarCaso(), guardarDetallesAseguradoAction(), CapturarDetallesForm(), disabledSx, emptyItem(), EvidenciaItem, inputSx (+60 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (69): 0c31cc2 Merge branch 'testing' into juzgado, 0fe445e vista de oficial, 458bbfb registro de reporte de campo - oficial, 93dd3ea Merge pull request #1 from presidenciaSJR/juzgado, aaddee5 Merge branch 'feature/testing' into feature/denuncias, b79a96a Conexión entre ambos modulos, ec1b658 implementando layaredArchitecture para rol de oficial, accounts (+61 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (72): b68a2b7 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, cd4b9bb Carpeta creada, createBodyCam(), createConcepto(), createMedioCanalizacion(), createRadio(), createSector(), createTipoEmergencia() (+64 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (51): actualizarOficial(), buscarUsuariosReincorporar(), crearOficial(), destituirOficial(), obtenerOficialesLista(), obtenerOficialPorId(), reactivarOficialConDatos(), requireAdminTransito() (+43 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (54): accionCerrarCaso(), AseguradosJuzgadoData, LiberacionesData, SolicitudesData, num(), rowToInfraccionDetalle(), rowToSolicitud(), actualizarDetallesAsegurado() (+46 more)

### Community 9 - "Community 9"
Cohesion: 0.09
Nodes (63): conexion, testing, libraries, 0844e6e Corregido, 1265204 paginacion por tablas, 133bb9d pages de listado de llamadas y de radio, 14fd73a Update FormSection.tsx, 166a26b Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing (+55 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (55): 905531c trabajando en panel de fiscalia, c194e54 envio de solicitud de evidencias completado, c4523ac tabla de fiscalia, evidencias funcional, accionPedirEvidencias(), accionTomarCaso(), AseguradosData, guardarDetallesAseguradosAction(), guardarPuestaDisposicionAction() (+47 more)

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (59): num(), parseDetenidos(), parseSolicitudesJson(), parseTurno(), rowToDenunciaDetalle(), rowToDependencia(), rowToEvidencia(), rowToEvidenciaArchivo() (+51 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (43): actualizarDatosInfractor(), actualizarDatosInfractorIniciarProceso(), actualizarEstatusDependenciaMesaControl(), actualizarEstatusPendientePagoInfraccion(), actualizarEstatusSolicitudLiberacion(), actualizarEvidenciasInfraccion(), actualizarUrlOrdenSalida(), actualizarUrlsDocumentosInfraccion() (+35 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (40): capturarInfractorAction(), finalizarRevisionAction(), generarOrdenPagoAction(), obtenerDashboardLiberaciones(), obtenerDocumentosLiberacion(), obtenerLiberaciones(), revisarDocumentoAction(), columns (+32 more)

### Community 14 - "Community 14"
Cohesion: 0.05
Nodes (48): concatNombre(), disabledSx, displayVal(), FormularioAseguradoJuzgado(), labelSx, Props, metadata, 2ca9f50 Formulario sin backend (+40 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (46): 514a705 refactorizacion sql, e211eef upload AGENTS, rowToAutoridadAdicional(), rowToBusqueda(), rowToContestacion(), rowToFichaBusquedaDetalle(), rowToMedida(), rowToMedidaDetalle() (+38 more)

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (26): obtenerAseguradosJuzgadoAction(), obtenerDashboardJuzgado(), obtenerLiberacionesAction(), obtenerSolicitudes(), ProfileDropdown(), Props, ToastExito(), 090c4dd vista de fiscalia (+18 more)

### Community 17 - "Community 17"
Cohesion: 0.10
Nodes (44): rowToAlarmaEscolar(), rowToDespacho(), rowToDespachoElemento(), rowToDespachoUnidad(), rowToExtorsion(), rowToIncidenteBasico(), rowToIncidenteConDespachoBase(), rowToIncidenteDetalleCompletoBase() (+36 more)

### Community 18 - "Community 18"
Cohesion: 0.10
Nodes (30): liberarGarantiaInfraccionesAction(), obtenerDashboardInfracciones(), obtenerDetalleInfraccionInfracciones(), obtenerInfracciones(), columns, DataRow, InfraccionesTableProps, inputToDbParams() (+22 more)

### Community 19 - "Community 19"
Cohesion: 0.06
Nodes (10): 6a042cd feat: sistema de autenticación, dashboard y esquema de base de datos, 90da1ca Initial commit from Create Next App, ADMIN, pool, db, eslintConfig, authClient, LogLine (+2 more)

### Community 20 - "Community 20"
Cohesion: 0.08
Nodes (26): 126b4d1 Monitorista V1, 160d1e1 Monitorista V1.1, 46b2c89 Merge branch 'testing' into juzgado, da33516 Merge pull request #3 from presidenciaSJR/feature/monitorista, BandejaSolicitudes(), btnDetalle, btnPrimary, btnSuccess (+18 more)

### Community 21 - "Community 21"
Cohesion: 0.06
Nodes (27): btnPrimario, btnSecundario, inputStyle, labelStyle, pageWrap, selectStyle, btnPrimario(), btnSecundario (+19 more)

### Community 22 - "Community 22"
Cohesion: 0.12
Nodes (34): rowToArma(), rowToCateo(), rowToDetencionInc(), rowToDetencionOfi(), rowToDroga(), rowToExtorsion(), rowToHidrocarburo(), rowToOrdenAprehension() (+26 more)

### Community 23 - "Community 23"
Cohesion: 0.09
Nodes (24): getCatalogos(), actionTextStyle, cardContentStyle, cardDescStyle, cardStyle, cardTitleStyle, decoratorLine, iconBoxStyle (+16 more)

### Community 24 - "Community 24"
Cohesion: 0.06
Nodes (20): BuscadorEvento(), OPCIONES, AUTORIDADES, btnPrimario(), btnSecundario, NuevaDetenidoPage(), TIPOS, cancelarFicha() (+12 more)

### Community 25 - "Community 25"
Cohesion: 0.09
Nodes (20): SubirFotoDetenido(), 388b997 Apartados para subir fotografias de los detenidos, 672bab5 libearciones para juzgado, de5682f Merge pull request #10 from presidenciaSJR/fix/subir-fotografias, FilaDetenidoRol(), btnDetalle, pagBtn, SubirFotoDetenido() (+12 more)

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (20): 067c4de arreglando flujo de fiscalia  a schema via, 1dbd480 flujo de liberaciones completado, 56b6577 FORMULARIO SE ENLAZO A LA TABLA DE DENUNCIAS, GruaRow, listarGruasActivas(), mapCrearInfraccionToDB(), mapInfraccionDetalle(), InfraccionesRepository (+12 more)

### Community 27 - "Community 27"
Cohesion: 0.11
Nodes (29): 13f7f39 Reporte-incidentes, 305b0bd se quitan campos, 5ef7cf3 Agregar los campos faltantes, 81b9829 Cambios para guardado de persinas afectadas, 917002a Guardado de policia a cargo, ef95840 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, fcb223f merge de testing, addPersonaAfectada() (+21 more)

### Community 28 - "Community 28"
Cohesion: 0.09
Nodes (24): 16df128 flujo de corralones listo, 5a1b5d5 empezando corralon, obtenerDashboardCorralon(), obtenerSolicitudes(), TabSolicitudes, rowToSolicitud(), toStr(), ModuleCard() (+16 more)

### Community 29 - "Community 29"
Cohesion: 0.08
Nodes (32): FormatoNArmaAsegurada, obtenerArmasAseguradasPorFecha(), FormatoNAtencionVictimas, enumerarFechas(), FormatoNConsolidado, obtenerFormatoNConsolidado(), obtenerFormatoNConsolidadoRango(), porPeriodos() (+24 more)

### Community 30 - "Community 30"
Cohesion: 0.13
Nodes (20): 156c925 vista de reporte de sin robos, 22b7b54 Merge branch 'feature/reportes' into feature/testing, 2516723 Modulo de permisos, 97a156c Reportes con D1, sin D1 y sin robo, rowToSinD1(), toStr(), obtenerSinD1(), listarSinD1() (+12 more)

### Community 31 - "Community 31"
Cohesion: 0.12
Nodes (19): createUser(), requireAdmin(), updateUser(), requireAuxiliar(), upsertChecklistAction(), ActionResult, ApiHandler, ApiResponse (+11 more)

### Community 32 - "Community 32"
Cohesion: 0.08
Nodes (19): guardarOficioJuzgadoAction(), obtenerDetalleInfraccionViaActionJuzgado(), BotonVerDetalle(), BotonVerDetalleProps, CargarOficioSectionProps, ConfirmacionModalProps, VARIANTES, AVATAR_COLORS (+11 more)

### Community 33 - "Community 33"
Cohesion: 0.09
Nodes (18): crearRol(), existeRolPorNombre(), 3249f00 Cambios en rellenado de ppt!, 44a01c3 fase 3-4-5, a6b7556 Formulario se puso a prueba, se prellena con datos de denuncia, campo e iph, obtenerIncidenteCompleto(), obtenerIphDetenido(), obtenerPrellenadoCompleto() (+10 more)

### Community 34 - "Community 34"
Cohesion: 0.10
Nodes (22): DetalleInfraccionView(), DocumentacionSection(), formatCurrency(), formatDate(), FundamentoLegalSection(), InfraccionDetalle, InfraccionGarantia, InfraccionHeader (+14 more)

### Community 35 - "Community 35"
Cohesion: 0.13
Nodes (18): cardStyle, rowToRol(), rowToUsuarioLista(), toStr(), actualizarUsuario(), asignarRolUsuario(), eliminarSesion(), listarRoles() (+10 more)

### Community 36 - "Community 36"
Cohesion: 0.12
Nodes (11): rowToDepartamento(), rowToOficialLista(), rowToUserBasico(), toStr(), listarDepartamentosActivos(), obtenerOficialExistente(), upsertOficial(), Departamento (+3 more)

### Community 37 - "Community 37"
Cohesion: 0.11
Nodes (16): getUserWithRole(), rowToUserWithRole(), UserWithRole, ProfileDropdownAuxiliar(), Props, 18f5bac llamada en card, 25de428 Corrección para agregar el botón de cerrar sesion, 5abc683 Merge branch 'feature/auxiliar' into feature/testing (+8 more)

### Community 38 - "Community 38"
Cohesion: 0.16
Nodes (15): 07543de Conexion de reportes con d1 y los diarios, mensuales y semanales, 6f8a089 Vista de estadisticos diarios, semanales y mensuales, bd1a223 Merge branch 'feature/vistas-reportes' into feature/testing, bf2e7ed Reportes del modulo de incidentes, ReportStat(), paginationButtonStyle, PaginationProps, PhoneReport (+7 more)

### Community 39 - "Community 39"
Cohesion: 0.10
Nodes (14): 23a3b9d Cambios en la estructura de los reportes de los detenidos, 5ed311a Merge pull request #5 from presidenciaSJR/fix/detenidos, BotonGenerarPpt(), inputStyle, Accion, PermisoRow, PermisoSeccion, Seccion (+6 more)

### Community 40 - "Community 40"
Cohesion: 0.10
Nodes (19): arrowBtnStyle, containerStyle, infoStyle, labelStyle, pageNumberStyle, Pagination(), PaginationProps, valueStyle (+11 more)

### Community 41 - "Community 41"
Cohesion: 0.14
Nodes (18): rowToIncidenteCamara(), rowToTotalesCamara(), toNum(), toNumNullable(), toStr(), obtenerConcentradoDiario(), obtenerIncidentesCamara(), obtenerPorTurno() (+10 more)

### Community 42 - "Community 42"
Cohesion: 0.10
Nodes (10): 11e8817 Merge branch 'testing' into juzgado, 28da720 Cambio de colores en dashboard y loader (correccion de imagen), MAIN_ROUTES, Enable2FA(), s, Step, Module, ModuleCards() (+2 more)

### Community 43 - "Community 43"
Cohesion: 0.08
Nodes (21): 7c1d096 Merge branch 'feature/denuncias' into feature/testing, ab3d8f6 Formulario con stepper, btnBackStyle, btnNextStyle, btnSubmitStyle, center, fieldContainerStyle, grid2Style (+13 more)

### Community 44 - "Community 44"
Cohesion: 0.16
Nodes (14): 5d179c0 Apartado de reportes, 8e6c8c6 Apartado de reportes, limpiarCacheToken(), obtenerGuestToken(), subirArchivoExpediente(), generarPpt(), getAspectRatio(), parseDetenidos() (+6 more)

### Community 45 - "Community 45"
Cohesion: 0.11
Nodes (17): COLOR_MAP, addAutoridadMedida(), AgregarAutoridadForm(), Autoridad, AUTORIDADES, I, L, Props (+9 more)

### Community 46 - "Community 46"
Cohesion: 0.11
Nodes (8): rowToLiberacion(), obtenerLiberaciones(), obtenerRolUsuario(), listarLiberaciones(), verificarRolLiberaciones(), LiberacionRow, RolRow, 51e682b mejorando flujo de liberaciones

### Community 47 - "Community 47"
Cohesion: 0.19
Nodes (17): rowToCatalogo(), rowToIncidenteDetalle(), rowToIncidenteResumen(), toNum(), toStr(), listarIncidentes(), obtenerCatalogos(), obtenerIncidente() (+9 more)

### Community 48 - "Community 48"
Cohesion: 0.13
Nodes (12): generarAlertasDebug(), marcarLeida(), marcarTodasLeidas(), CampanillaNotificaciones(), Notificacion, Props, ToastProps, rowToNotificacion() (+4 more)

### Community 49 - "Community 49"
Cohesion: 0.13
Nodes (13): ModuleCard(), ModuleCardProps, Stat, Accion, obtenerRolNombre(), PermisoSeccion, ROLES_PERMITIDOS, Seccion (+5 more)

### Community 50 - "Community 50"
Cohesion: 0.10
Nodes (15): listarIncidentesRecientes(), getIncidentesPaginados(), btnNuevoStyle, btnViewStyle, cardStyle, decoratorStyle, footerStyle, headerInnerStyle (+7 more)

### Community 51 - "Community 51"
Cohesion: 0.10
Nodes (16): Arma, cardStyle, Consolidado, Evento, Fge, Fgr, linkBtn, Medios (+8 more)

### Community 52 - "Community 52"
Cohesion: 0.23
Nodes (14): rowToChecklist(), rowToCuestionarioRobo(), rowToParReporte(), toStr(), obtenerCuestionariosRobo(), obtenerParesReporte(), upsertChecklist(), guardarChecklist() (+6 more)

### Community 53 - "Community 53"
Cohesion: 0.13
Nodes (14): FieldName, isNoData(), Props, TitularForm(), getGarantiaInfo(), ModalEntregarGarantia(), Props, DetalleCompleto (+6 more)

### Community 54 - "Community 54"
Cohesion: 0.11
Nodes (12): SECCIONES, SECCIONES, SECCIONES, Accion, PermisoRow, PermisoSeccion, Seccion, SECCIONES (+4 more)

### Community 55 - "Community 55"
Cohesion: 0.13
Nodes (10): Accion, PermisoSeccion, ROLES_PERMITIDOS, Seccion, tieneAccesoAuxiliar(), tienePermiso(), verificarAccesoAuxiliarApi(), listarCuestionariosRobo() (+2 more)

### Community 56 - "Community 56"
Cohesion: 0.18
Nodes (13): 50101e2 Merge pull request #6 from presidenciaSJR/fix/incidentes-camara, 5311c24 Editar Registros, 810844a Cambios en la estructura de los incidentes de camara, b170599 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, caef6e8 Merge pull request #7 from presidenciaSJR/fix/incidentes-camara, FilaIncidenteCamara(), actualizarRegistro(), camelToSnake() (+5 more)

### Community 57 - "Community 57"
Cohesion: 0.16
Nodes (14): Accion, aplicarPlantillaRol(), guardarPermiso(), guardarPermisosSeccionesAction(), guardarPlantillaSeccion(), guardarPlantillaSeccionesAction(), mapaDefault(), obtenerPermisosUsuario() (+6 more)

### Community 58 - "Community 58"
Cohesion: 0.20
Nodes (15): rowToReporteDiario(), rowToReporteSemanal(), toNum(), obtenerReporteDiario(), obtenerReporteSemanal(), combinar(), COMBO_KEYS, listarReporteDiario() (+7 more)

### Community 59 - "Community 59"
Cohesion: 0.14
Nodes (12): btnBackStyle, btnFinishStyle, btnNextStyle, cardStyle, labelStyle, mapBoxStyle, subLabelStyle, titleStyle (+4 more)

### Community 60 - "Community 60"
Cohesion: 0.25
Nodes (10): 2fcba7b vista de reportes de incidentes diarios y semanales, 552d291 Merge branch 'testing' into conexion, 719b5ab cambio para generacion de reportes semanal y diario, FiltrosIncidencias(), PaginationProps, IncidenteStat(), styles, Props (+2 more)

### Community 61 - "Community 61"
Cohesion: 0.19
Nodes (13): MailAttachment, MailOptions, sendMail(), transporter, enviarCorreoAsignacionFiscalia(), enviarCorreoOrdenLiberacion(), EnviarCorreoAsignacionFiscaliaParams, templateAsignacionFiscalia() (+5 more)

### Community 62 - "Community 62"
Cohesion: 0.12
Nodes (12): btnBackStyle, btnFinishStyle, btnGeoStyle, btnNextStyle, cardStyle, footerActions, grid3, labelStyle (+4 more)

### Community 63 - "Community 63"
Cohesion: 0.15
Nodes (11): 9550203 Cambios en presentacion, se genera, 9d67ddf Cambios de formulario analisis, btnPPTStyle, btnStyle, containerStyle, headerRowStyle, tdStyle, thStyle (+3 more)

### Community 64 - "Community 64"
Cohesion: 0.15
Nodes (11): AddressData, eliminarInfraccionAction(), ProcesoEstado, ViewArticulosLista, generarOrdenPago(), config, getStepIndex(), ProcesoModal() (+3 more)

### Community 65 - "Community 65"
Cohesion: 0.13
Nodes (14): BTN, BTN_SM, DespachoForm(), Elemento, ERR, I, LBL, TAG (+6 more)

### Community 66 - "Community 66"
Cohesion: 0.13
Nodes (13): btnBackStyle, IncRow, labelStyle, labelTopStyle, Tab, TablonDespacho(), titleStyle, DespachoDetalle (+5 more)

### Community 67 - "Community 67"
Cohesion: 0.19
Nodes (12): actualizarFgr(), crearFgr(), formatFecha(), FormatoNFgr, FormatoNFgrInput, listarFgr(), obtenerFgr(), obtenerFgrPorFechaPeriodo() (+4 more)

### Community 68 - "Community 68"
Cohesion: 0.17
Nodes (8): obtenerArticulosAction(), obtenerFraccionesAction(), ArticulosMapper, QueryRow, ArticulosRepository, ArticulosService, ArticuloLey, FraccionLey

### Community 69 - "Community 69"
Cohesion: 0.14
Nodes (8): capturarInfractorInfraccionesAction(), FieldName, Props, CapturaInfractorActions, CapturaInfractorState, CapturaInfractorStore, initialState, useCapturaInfractorStore

### Community 70 - "Community 70"
Cohesion: 0.19
Nodes (10): 11be750 Fase 1 de correccion - completada - pendiente testing, generarAlertasBusquedas(), HITOS_ALERTAR, listarNotificacionesNoLeidas(), Props, SeguimientoTimeline(), calcularFechaEsperada(), getLabelSeguimiento() (+2 more)

### Community 71 - "Community 71"
Cohesion: 0.21
Nodes (11): actualizarAtencionVictimas(), crearAtencionVictimas(), formatFecha(), FormatoNAtencionVictimasInput, listarAtencionVictimas(), obtenerAtencionVictimas(), obtenerAtencionVictimasPorFechaPeriodo(), parsePeriodo() (+3 more)

### Community 72 - "Community 72"
Cohesion: 0.15
Nodes (10): btnStyle, containerStyle, headerRowStyle, loadingStyle, pageButtonStyle, paginationContainerStyle, tdStyle, thStyle (+2 more)

### Community 73 - "Community 73"
Cohesion: 0.35
Nodes (8): 0c8695c Cambios en filtros, 4c9fa8a vista de reporte de d1 no iniciada, 712c116 Merge branch 'testing' into conexion, DescargaFilters(), DescargaPagination(), PaginationProps, DescargaTable(), styles

### Community 74 - "Community 74"
Cohesion: 0.20
Nodes (11): cleanColoniaName(), containerStyle, DEFAULT_CENTER, extractAddress(), extractNeighborhoodFromComponents(), getMunicipioEstado(), LIBRARIES, MapaDireccionRegistro() (+3 more)

### Community 75 - "Community 75"
Cohesion: 0.15
Nodes (11): DocConfig, DOCS_ACCIDENTE, DOCS_DELITO, DOCS_EMPRESA, DOCS_INFRACCION, getEstatusConfig(), MOTIVO_TO_SUBTIPO, Props (+3 more)

### Community 76 - "Community 76"
Cohesion: 0.23
Nodes (9): rowToReporteD1(), toBool(), toNum(), toStr(), insertarReporteDenuncia(), obtenerReportesD1(), verificarFolioDenunciaUnico(), listarReportesD1() (+1 more)

### Community 77 - "Community 77"
Cohesion: 0.14
Nodes (9): obtenerDetalleInfraccionViaAction(), BotonVerDetalle(), AVATAR_COLORS, EstatusFiscalia, Props, SORTABLE_KEYS, STATUS_BADGE, STATUS_TABS (+1 more)

### Community 78 - "Community 78"
Cohesion: 0.40
Nodes (7): 98e7e6e vista de reportes de d1, b233bc7 Merge branch 'testing' into conexion, D1Filters(), D1Pagination(), PaginationProps, D1ReportsTable(), styles

### Community 79 - "Community 79"
Cohesion: 0.15
Nodes (10): cardStyle, onlineStyle, obtenerPermisosUsuario(), getMonitoristaStats(), obtenerDenunciaPorId(), obtenerDenunciasAtendidas(), obtenerDenunciasPendientes(), obtenerEvidenciasDenuncia() (+2 more)

### Community 80 - "Community 80"
Cohesion: 0.17
Nodes (7): AVATAR_COLORS, EstatusInfracciones, Props, SORTABLE_KEYS, STATUS_BADGE, STATUS_TABS, BotonVerDetalle()

### Community 81 - "Community 81"
Cohesion: 0.17
Nodes (7): AVATAR_COLORS, EstatusLiberaciones, Props, SORTABLE_KEYS, STATUS_BADGE, STATUS_TABS, TIPO_LIBERACION_OPTS

### Community 82 - "Community 82"
Cohesion: 0.23
Nodes (5): 5bbdda8 Merge pull request #8 from presidenciaSJR/juzgado, ff6d3c2 juzgado, BotonVerDetalleProps, ConfirmacionModalProps, VARIANTES

### Community 83 - "Community 83"
Cohesion: 0.35
Nodes (6): b403f89 Vista para reportes de incidentes por camaras y cambio den header, fa9df15 Reporte de cámaras, ReportFilters(), ReportTable(), styles, SentinelHero()

### Community 84 - "Community 84"
Cohesion: 0.18
Nodes (6): guardarOficioAction(), CargarOficioSectionProps, Toast, ToastStore, ToastType, useToastStore

### Community 85 - "Community 85"
Cohesion: 0.26
Nodes (4): filtroBtn(), IncidentesCamaraPage(), Toast(), ToastTipo

### Community 86 - "Community 86"
Cohesion: 0.18
Nodes (7): 0e33bf6 feat: módulo Admin, Prórroga, Filtros medidas, Autoridades adicionales y Notificaciones/Alertas, createProrroga(), I, L, ProrrogaModal(), ProrrogaViewerModal(), ProrrogaViewerModalProps

### Community 87 - "Community 87"
Cohesion: 0.25
Nodes (6): 4400923 Merge branch 'feature/testing' of https://github.com/presidenciaSJR/seguridad_publica into feature/testing, de14b62 Merge branch 'feature/reportes' into feature/testing, f6954ec Conexion a la bd y la generacion de Excel, ReportFilters(), DetalleInfraccionModalProps, InfraccionDetalle

### Community 88 - "Community 88"
Cohesion: 0.18
Nodes (2): DC, DCCtx

### Community 89 - "Community 89"
Cohesion: 0.33
Nodes (9): createAsignacion(), createObservacion(), createRol(), deleteAsignacion(), deleteObservacion(), guardarFirmas(), requireSession(), updateEncabezadoRol() (+1 more)

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
Cohesion: 0.22
Nodes (1): TWEAKS

### Community 95 - "Community 95"
Cohesion: 0.50
Nodes (8): main, 199ce68 Merge branch 'main' of https://github.com/presidenciaSJR/seguridad_publica, 2e36377 Eliminar tutoriales de flujo innecesarios, 4271f37 feat(doc): agregar manual de usuario interactivo para el módulo de prevención del delito, 6cb1055 Mejoras de UI/UIX, d3e6d95 Update SeguimientoTimeline.tsx, deb4649 eLIMINE CARPETA, ea040d6 Carpeta creada

### Community 96 - "Community 96"
Cohesion: 0.39
Nodes (6): 75ca4b2 Merge pull request #9 from presidenciaSJR/conexion, 8095bdb limpiando .env, 953d38a implementando vista de fiscalia, obtenerTokenFiscalia(), subirArchivoFiscalia(), nextConfig

### Community 97 - "Community 97"
Cohesion: 0.25
Nodes (7): formato_n_armas_aseguradas, formato_n_atencion_victimas, formato_n_eventos, formato_n_fge, formato_n_fgr, formato_n_medios_alternativos, formato_n_rnd

### Community 98 - "Community 98"
Cohesion: 0.25
Nodes (3): Alertas, ICONS, NAV

### Community 99 - "Community 99"
Cohesion: 0.33
Nodes (5): btnDetalle, DetenidoRow, FotoInfo, TablaDetenidos(), tabStyle()

### Community 100 - "Community 100"
Cohesion: 0.52
Nodes (6): drawWatermark(), formatearFecha(), formatearOficio(), generarOrdenSalidaVehiculo(), loadImageAsBase64(), parrafoMixtoConWrap()

### Community 101 - "Community 101"
Cohesion: 0.40
Nodes (5): Session, config, isPublic(), proxy(), PUBLIC_PATHS

### Community 102 - "Community 102"
Cohesion: 0.40
Nodes (3): columns, DataRow, FiscaliaTableProps

### Community 103 - "Community 103"
Cohesion: 0.50
Nodes (5): formatDate(), getStatusStyle(), InfraccionCiudadanoPage(), sanitize(), timeAgo()

### Community 104 - "Community 104"
Cohesion: 0.40
Nodes (1): SA7Repository

### Community 105 - "Community 105"
Cohesion: 0.67
Nodes (1): ping()

### Community 106 - "Community 106"
Cohesion: 0.50
Nodes (2): Filtros, IncidenteResumen

### Community 107 - "Community 107"
Cohesion: 0.50
Nodes (3): MapaPinFijo(), PIN_ICONS, Props

### Community 108 - "Community 108"
Cohesion: 0.50
Nodes (1): OficialesViaRepository

### Community 110 - "Community 110"
Cohesion: 0.50
Nodes (1): SA7Service

### Community 111 - "Community 111"
Cohesion: 0.67
Nodes (1): IncidenteDetalle

### Community 112 - "Community 112"
Cohesion: 0.67
Nodes (1): ReporteCampoDetalle

### Community 113 - "Community 113"
Cohesion: 1.00
Nodes (2): monitorista_permisos, users

### Community 114 - "Community 114"
Cohesion: 1.00
Nodes (2): permisos_plantillas, roles

### Community 115 - "Community 115"
Cohesion: 0.67
Nodes (1): MIME

### Community 116 - "Community 116"
Cohesion: 0.67
Nodes (1): InputProps

### Community 117 - "Community 117"
Cohesion: 0.67
Nodes (1): SectionProps

## Knowledge Gaps
- **638 isolated node(s):** `metadata`, `LogType`, `LogLine`, `libraries`, `cardStyle` (+633 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 88`** (2 nodes): `DC`, `DCCtx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (1 nodes): `WF`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (1 nodes): `TWEAKS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 104`** (1 nodes): `SA7Repository`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 105`** (1 nodes): `ping()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 106`** (2 nodes): `Filtros`, `IncidenteResumen`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 108`** (1 nodes): `OficialesViaRepository`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 110`** (1 nodes): `SA7Service`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 111`** (1 nodes): `IncidenteDetalle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 112`** (1 nodes): `ReporteCampoDetalle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 113`** (2 nodes): `monitorista_permisos`, `users`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 114`** (2 nodes): `permisos_plantillas`, `roles`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 115`** (1 nodes): `MIME`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 116`** (1 nodes): `InputProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 117`** (1 nodes): `SectionProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `auth` connect `Community 0` to `Community 49`, `Community 31`, `Community 7`, `Community 5`, `Community 18`, `Community 8`, `Community 13`, `Community 40`, `Community 23`, `Community 37`, `Community 1`, `Community 2`, `Community 52`, `Community 20`, `Community 28`, `Community 57`, `Community 55`, `Community 73`, `Community 78`, `Community 42`, `Community 25`, `Community 39`, `Community 38`, `Community 87`, `Community 41`, `Community 10`, `Community 33`, `Community 71`, `Community 29`, `Community 67`, `Community 12`, `Community 3`, `Community 27`, `Community 85`, `Community 56`, `Community 83`, `Community 50`, `Community 45`, `Community 93`, `Community 79`, `Community 48`, `Community 70`, `Community 24`, `Community 21`, `Community 115`, `Community 26`, `Community 4`, `Community 60`, `Community 89`, `Community 6`, `Community 30`, `Community 16`, `Community 44`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `query()` connect `Community 5` to `Community 49`, `Community 47`, `Community 35`, `Community 7`, `Community 36`, `Community 12`, `Community 8`, `Community 13`, `Community 46`, `Community 23`, `Community 37`, `Community 55`, `Community 52`, `Community 41`, `Community 26`, `Community 76`, `Community 10`, `Community 105`, `Community 27`, `Community 0`, `Community 17`, `Community 1`, `Community 82`, `Community 25`, `Community 44`, `Community 11`, `Community 70`, `Community 48`, `Community 57`, `Community 15`, `Community 33`, `Community 71`, `Community 2`, `Community 29`, `Community 67`, `Community 58`, `Community 22`, `Community 30`, `Community 89`, `Community 6`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `SA7Repository` connect `Community 104` to `Community 1`, `Community 12`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `metadata`, `LogType`, `LogLine` to the rest of the system?**
  _638 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04770423375074538 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.052907452907452905 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05710162853019996 - nodes in this community are weakly interconnected._