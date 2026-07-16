<!-- AUTO-GENERATED START -->
# Estructura del Proyecto

**Propósito**: Mapa del árbol de directorios del proyecto.

---

```
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   ├── 2fa/
│   │   │   │   └── page.tsx
│   │   │   ├── ptpag/
│   │   │   │   └── page.tsx
│   │   │   ├── setup-2fa/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── roles/
│   │   │   ├── [id]/
│   │   │   │   └── plantilla-permisos/
│   │   │   ├── agregar/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── usuarios/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── nuevo/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── admin-styles.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── admin-transito/
│   │   ├── oficiales/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── nuevo/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── agente_911/
│   │   ├── ciudadano/
│   │   │   ├── incidentes/
│   │   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── ToastOnLoad.tsx
│   │   │   ├── Formulario911.tsx
│   │   │   └── page.tsx
│   │   ├── despacho/
│   │   │   └── page.tsx
│   │   ├── rondin/
│   │   │   ├── incidentes/
│   │   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── whatsapp/
│   │   │   ├── incidentes/
│   │   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── agente_bitacorista/
│   │   └── page.tsx
│   ├── agente_despacho/
│   │   └── page.tsx
│   ├── agente_infracciones/
│   │   ├── revision-documental/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── page.tsx
│   ├── agente_juzgado/
│   │   ├── asegurados/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── puesta-disposicion/
│   │   │   │   └── [id]/
│   │   │   └── page.tsx
│   │   ├── detenidos/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── liberaciones/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── solicitudes/
│   │   │   ├── [solicitudId]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── agente_liberaciones/
│   │   ├── revision-documental/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── analisis/
│   │   ├── formulario-ingreso/
│   │   │   └── page.tsx
│   │   ├── generar-ppt/
│   │   │   └── page.tsx
│   │   ├── iph/
│   │   │   └── page.tsx
│   │   ├── pendiente-analisis/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   └── roles/
│   │   │       └── route.ts
│   │   ├── agente_juzgado/
│   │   │   ├── finalizarProceso/
│   │   │   │   └── route.ts
│   │   │   └── iniciarProceso/
│   │   │       └── route.ts
│   │   ├── analisis/
│   │   │   ├── prellenado/
│   │   │   │   └── [id]/
│   │   │   ├── prellenado-completo/
│   │   │   │   └── [id]/
│   │   │   └── reportes-campo/
│   │   │       └── route.ts
│   │   ├── auth/
│   │   │   ├── [...all]/
│   │   │   │   └── route.ts
│   │   │   └── token-guest/
│   │   │       └── route.ts
│   │   ├── auxiliar/
│   │   │   └── exportar-robo/
│   │   │       └── route.ts
│   │   ├── camara/
│   │   │   └── exportar/
│   │   │       └── route.ts
│   │   ├── complementos/
│   │   │   └── gruas/
│   │   │       └── route.ts
│   │   ├── corralon/
│   │   │   └── subir-archivo/
│   │   │       └── route.ts
│   │   ├── d1/
│   │   │   └── exportar/
│   │   │       └── route.ts
│   │   ├── detenidos/
│   │   │   ├── detalle/
│   │   │   │   └── [id]/
│   │   │   ├── listar/
│   │   │   │   └── route.ts
│   │   │   └── registrar/
│   │   │       └── route.ts
│   │   ├── expediente/
│   │   │   ├── proxy/
│   │   │   │   └── route.ts
│   │   │   ├── subir/
│   │   │   │   └── route.ts
│   │   │   └── subir-foto-detenido/
│   │   │       └── route.ts
│   │   ├── fiscalia/
│   │   │   └── expediente/
│   │   │       └── subir-foto/
│   │   ├── health/
│   │   │   └── route.ts
│   │   ├── incidentes/
│   │   │   ├── [id]/
│   │   │   │   ├── despacho/
│   │   │   │   ├── reporte/
│   │   │   │   └── route.ts
│   │   │   ├── atendidos/
│   │   │   │   └── route.ts
│   │   │   ├── en-despacho/
│   │   │   │   └── route.ts
│   │   │   ├── pendientes-despacho/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── monitorista/
│   │   │   ├── denuncias/
│   │   │   │   ├── [id]/
│   │   │   │   └── subir/
│   │   │   ├── detenidos/
│   │   │   │   ├── [id]/
│   │   │   │   └── generar-ppt/
│   │   │   ├── evidencias/
│   │   │   │   └── subir/
│   │   │   ├── expediente-proxy/
│   │   │   │   └── route.ts
│   │   │   ├── historial/
│   │   │   │   └── route.ts
│   │   │   ├── incidentes-camara/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── solicitudes/
│   │   │       ├── [id]/
│   │   │       └── route.ts
│   │   ├── nCoordinacion/
│   │   │   └── generar/
│   │   │       └── route.ts
│   │   ├── notificaciones/
│   │   │   └── route.ts
│   │   ├── prevencion/
│   │   │   ├── busquedas/
│   │   │   │   ├── [id]/
│   │   │   │   ├── alertas/
│   │   │   │   └── route.ts
│   │   │   ├── medidas/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── solicitudes/
│   │   │       ├── [id]/
│   │   │       └── route.ts
│   │   ├── registro-detenidos/
│   │   │   └── registrar/
│   │   │       └── route.ts
│   │   ├── reportes/
│   │   │   ├── formato-n-armas-aseguradas/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   ├── formato-n-atencion-victimas/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   ├── formato-n-consolidado/
│   │   │   │   └── route.ts
│   │   │   ├── formato-n-eventos/
│   │   │   │   ├── [id]/
│   │   │   │   ├── fuente/
│   │   │   │   └── route.ts
│   │   │   ├── formato-n-fge/
│   │   │   │   ├── [id]/
│   │   │   │   ├── calcular/
│   │   │   │   └── route.ts
│   │   │   ├── formato-n-fgr/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   ├── formato-n-medios-alternativos/
│   │   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── formato-n-rnd/
│   │   │       ├── [id]/
│   │   │       ├── fuente/
│   │   │       └── route.ts
│   │   ├── reportes-d1/
│   │   │   └── route.ts
│   │   ├── reportes-incidentes/
│   │   │   └── exportar/
│   │   │       └── route.ts
│   │   ├── reportes-operativos/
│   │   │   └── exportar-excel/
│   │   │       └── route.ts
│   │   ├── reportes-sin-d1/
│   │   │   └── exportar/
│   │   │       └── route.ts
│   │   ├── reportes-sin-novedad/
│   │   │   └── exportar/
│   │   │       └── route.ts
│   │   ├── reportes-telefonicos/
│   │   │   └── exportar/
│   │   │       └── route.ts
│   │   ├── rol-servicios/
│   │   │   └── externos/
│   │   │       ├── flota/
│   │   │       └── rh/
│   │   ├── uploads/
│   │   │   └── [...path]/
│   │   │       └── route.ts
│   │   └── via/
│   │       ├── ciudadano/
│   │       │   ├── completar-solicitud/
│   │       │   ├── iniciar-solicitud/
│   │       │   └── subir-archivo/
│   │       ├── curp/
│   │       │   └── route.ts
│   │       ├── exp-digital/
│   │       │   ├── guardar-docs/
│   │       │   ├── guardar-evidencias/
│   │       │   └── token/
│   │       ├── infracciones/
│   │       │   ├── iniciar-proceso/
│   │       │   ├── liberar-garantia/
│   │       │   ├── registradas/
│   │       │   ├── registrar/
│   │       │   └── retencion-placa/
│   │       ├── liberaciones/
│   │       │   └── documentos/
│   │       ├── pagos/
│   │       │   ├── confirmar-ausente/
│   │       │   ├── confirmar-instante/
│   │       │   ├── confirmar-liberacion/
│   │       │   ├── confirmar-retenida/
│   │       │   └── finalizar-instante/
│   │       └── sa7/
│   │           ├── buscar-orden/
│   │           └── generar-orden-pago/
│   ├── auxiliar/
│   │   ├── checklist/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── cuestionario-robo/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── corralon/
│   │   ├── solicitudes/
│   │   │   ├── page.tsx
│   │   │   ├── solicitudes-client.tsx
│   │   │   ├── subir-oficio-modal.tsx
│   │   │   └── ver-documento-modal.tsx
│   │   ├── layout.tsx
│   │   ├── module-card.tsx
│   │   ├── page.tsx
│   │   └── profile-dropdown.tsx
│   ├── d1/
│   │   └── page.tsx
│   ├── d1_noiniciada/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── enable-2fa.tsx
│   │   ├── module-cards.tsx
│   │   ├── page.tsx
│   │   └── sign-out-button.tsx
│   ├── denuncia/
│   │   └── nuevo/
│   │       └── page.tsx
│   ├── envio-de-formatos/
│   │   ├── consolidar/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── estadisticos/
│   │   └── page.tsx
│   ├── fiscalia/
│   │   ├── asegurados/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── [reporteCampoId]/
│   │   │   ├── puesta-disposicion/
│   │   │   │   └── [id]/
│   │   │   └── page.tsx
│   │   ├── detenidos/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── expedientes/
│   │   │   └── [solicitudId]/
│   │   │       └── page.tsx
│   │   ├── liberaciones/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── solicitudes/
│   │   │   ├── [solicitudId]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── formato-n-armas-aseguradas/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── nuevo/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── formato-n-atencion-victimas/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── nuevo/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── formato-n-eventos/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── nuevo/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── formato-n-fge/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── nuevo/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── formato-n-fgr/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── nuevo/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── formato-n-medios-alternativos/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── nuevo/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── formato-n-rnd/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── nuevo/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── incidentes/
│   │   └── page.tsx
│   ├── incidentes_camaras/
│   │   └── page.tsx
│   ├── infracciones/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── captura/
│   │       └── page.tsx
│   ├── modulo_incidentes/
│   │   └── page.tsx
│   ├── monitorista/
│   │   ├── denuncias/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── detenidos/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── nueva/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── historial/
│   │   │   └── page.tsx
│   │   ├── incidentes-camara/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── nuevo/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── solicitudes/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── nCoordinacion/
│   │   └── page.tsx
│   ├── oficial/
│   │   ├── configuracion/
│   │   │   └── page.tsx
│   │   ├── despachos/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── nuevo/
│   │   │   └── page.tsx
│   │   ├── reportes/
│   │   │   ├── [id]/
│   │   │   │   ├── fotos/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── rondin/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── prevencion/
│   │   ├── busquedas/
│   │   │   ├── [id]/
│   │   │   │   ├── imprimir/
│   │   │   │   └── page.tsx
│   │   │   ├── nueva/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── juridico/
│   │   │   ├── solicitudes/
│   │   │   │   ├── [id]/
│   │   │   │   └── nueva/
│   │   │   └── page.tsx
│   │   ├── medidas/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── nueva/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── PrevencionNav.tsx
│   ├── reportes/
│   │   └── page.tsx
│   ├── reportes_incidentes/
│   │   └── page.tsx
│   ├── rol_servicios/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── sin_robos/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── 911/
│   │   ├── despacho/
│   │   │   ├── DespachoForm.tsx
│   │   │   └── TablonDespacho.tsx
│   │   ├── radio/
│   │   │   ├── FormRondinEscalado.tsx
│   │   │   ├── FormSection.tsx
│   │   │   └── Input.tsx
│   │   ├── whatsapp/
│   │   │   ├── FormSection.tsx
│   │   │   └── RegistroIncidenteForm.tsx
│   │   ├── FiltrosIncidentes.tsx
│   │   ├── ModuleCard.tsx
│   │   └── Pagination.tsx
│   ├── admin/
│   │   └── roles/
│   │       └── FormularioRol.tsx
│   ├── admin-transito/
│   │   ├── ModalDestituirOficial.tsx
│   │   ├── ModalReactivarOficial.tsx
│   │   ├── NuevoOficialForm.tsx
│   │   ├── OficialesTable.tsx
│   │   └── PatrullaSelector.tsx
│   ├── agente_infracciones/
│   │   ├── CapturarDatosInfractorModal.tsx
│   │   ├── InfraccionesDashboard.tsx
│   │   ├── InfraccionesTable.tsx
│   │   ├── ModalEntregarGarantia.tsx
│   │   └── ProfileDropdown.tsx
│   ├── agente_juzgado/
│   │   ├── BotonVerDetalle.tsx
│   │   ├── CapturarDetallesForm.tsx
│   │   ├── CargarOficioSection.tsx
│   │   ├── CerrarCasoModal.tsx
│   │   ├── ConfirmacionModal.tsx
│   │   ├── DetallesAseguradoView.tsx
│   │   ├── FormularioAseguradoJuzgado.tsx
│   │   ├── JuzgadoDashboard.tsx
│   │   ├── JuzgadoTable.tsx
│   │   ├── ProfileDropdown.tsx
│   │   ├── SubirFotoDetenido.tsx
│   │   ├── TabSolicitudes.tsx
│   │   ├── ToastExito.tsx
│   │   └── TomarCasoModal.tsx
│   ├── agente_liberaciones/
│   │   ├── LiberacionesDashboard.tsx
│   │   ├── LiberacionesTable.tsx
│   │   └── ProfileDropdown.tsx
│   ├── analisis/
│   │   ├── iph/
│   │   │   └── BitacoraIPH.tsx
│   │   ├── formAnalisis.tsx
│   │   ├── generarPresentacion.tsx
│   │   └── TablonAnalisis.tsx
│   ├── auxiliar/
│   │   └── ProfileDropdownAuxiliar.tsx
│   ├── denuncias/
│   │   └── FormularioD1.tsx
│   ├── fiscalia/
│   │   ├── ButtonVerDetalles.tsx
│   │   ├── CapturarDetallesForm.tsx
│   │   ├── CargarOficioSection.tsx
│   │   ├── ConfirmacionModal.tsx
│   │   ├── DetallesAseguradoView.tsx
│   │   ├── ExpedienteView.tsx
│   │   ├── FiscaliaDashboard.tsx
│   │   ├── FiscaliaTable.tsx
│   │   ├── FormularioAsegurado.tsx
│   │   ├── FormularioPuestaDisposicion.tsx
│   │   ├── FotosExpedienteSection.tsx
│   │   ├── PedirEvidenciasModal.tsx
│   │   ├── PrintButton.tsx
│   │   ├── ProfileDropdown.tsx
│   │   ├── SubirFotoDetenido.tsx
│   │   ├── TabAsegurados.tsx
│   │   ├── TabSolicitudes.tsx
│   │   ├── ToastExito.tsx
│   │   └── TomarCasoModal.tsx
│   ├── forms/
│   │   └── FormKit.tsx
│   ├── incidentes/
│   │   └── HistorialIncidente.tsx
│   ├── maps/
│   │   └── GoogleMapPicker.tsx
│   ├── monitorista/
│   │   ├── AccionesDetenido.tsx
│   │   ├── BandejaSolicitudes.tsx
│   │   ├── BatchEnvioFotos.tsx
│   │   ├── BotonGenerarPpt.tsx
│   │   ├── BotonSubirDenuncia.tsx
│   │   ├── BuscadorEvento.tsx
│   │   ├── CardEnvioFoto.tsx
│   │   ├── EditarCampoDetenido.tsx
│   │   ├── FilaIncidenteCamara.tsx
│   │   ├── GaleriaEvidencias.tsx
│   │   ├── SubirEvidenciaModal.tsx
│   │   ├── SubirFotoDetenido.tsx
│   │   └── TablaDetenidos.tsx
│   ├── nCoordinacion/
│   │   └── ProfileDropdownCoordinacion.tsx
│   ├── notificaciones/
│   │   └── CampanillaNotificaciones.tsx
│   ├── oficial/
│   │   ├── rondin/
│   │   │   ├── RondinPageClient.tsx
│   │   │   └── RondinTabla.tsx
│   │   ├── DespachoContent.tsx
│   │   ├── FormularioRecorrido.tsx
│   │   ├── MapaPinFijo.tsx
│   │   ├── MapaUbicacion.tsx
│   │   ├── MarcarEnSitioButton.tsx
│   │   ├── ModalSeleccionarUnidad.tsx
│   │   ├── ProfileDropdown.tsx
│   │   ├── SelectorDestinoLegal.tsx
│   │   ├── ToastExito.tsx
│   │   └── UnidadAsignadaSection.tsx
│   ├── partials/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── SubHeader.tsx
│   ├── prevencion/
│   │   ├── AgregarAutoridadForm.tsx
│   │   ├── AutoridadBadge.tsx
│   │   ├── BusquedasFiltros.tsx
│   │   ├── CancelacionModal.tsx
│   │   ├── ContestacionForm.tsx
│   │   ├── JuridicoFiltros.tsx
│   │   ├── MedidasFiltros.tsx
│   │   ├── Pagination.tsx
│   │   ├── PrintButton.tsx
│   │   ├── ProrrogaModal.tsx
│   │   ├── ProrrogaViewerModal.tsx
│   │   ├── SearchBox.tsx
│   │   ├── SeguimientoTimeline.tsx
│   │   ├── SemaforoVigencia.tsx
│   │   ├── SolicitudC4Form.tsx
│   │   └── VisitaModal.tsx
│   ├── reportes/
│   │   ├── d1/
│   │   │   ├── D1Filters.tsx
│   │   │   ├── D1Pagination.tsx
│   │   │   ├── D1ReportsTable.tsx
│   │   │   └── styles.ts
│   │   ├── d1_noiniciada/
│   │   │   ├── DescargaFilters.tsx
│   │   │   ├── DescargaPagination.tsx
│   │   │   ├── DescargaTable.tsx
│   │   │   └── styles.ts
│   │   ├── deteccion_camara/
│   │   │   ├── ReportFilters.tsx
│   │   │   ├── ReportStat.tsx
│   │   │   ├── ReportTables.tsx
│   │   │   └── styles.ts
│   │   ├── estadisticos/
│   │   │   ├── PhonePagination.tsx
│   │   │   ├── PhoneReportsTable.tsx
│   │   │   ├── PhoneStatsCards.tsx
│   │   │   └── ReportFilters.tsx
│   │   ├── incidentes/
│   │   │   ├── FiltrosIncidencias.tsx
│   │   │   ├── Paginacion.tsx
│   │   │   ├── StatIncidencia.tsx
│   │   │   ├── styles.ts
│   │   │   └── TablaIncidentes.tsx
│   │   ├── modulo_incidentes/
│   │   │   ├── ReportesTabs.tsx
│   │   │   ├── ReportFilters.tsx
│   │   │   ├── ReportTables.tsx
│   │   │   └── styles.ts
│   │   ├── sin_robos/
│   │   │   ├── PaginacionSinRobos.tsx
│   │   │   ├── ReporteSinRobos.tsx
│   │   │   ├── ReportFilters.tsx
│   │   │   └── styles.ts
│   │   ├── form-styles.ts
│   │   ├── menuOption.tsx
│   │   └── welcomeBanner.tsx
│   ├── rol_servicios/
│   │   ├── RolInputs.tsx
│   │   ├── ServiceFooter.tsx
│   │   ├── ServiceTable.tsx
│   │   └── SignatureModal.tsx
│   ├── shared/
│   │   ├── DetalleInfraccionView.tsx
│   │   ├── DireccionGoogleMaps.tsx
│   │   └── PedirEvidenciasModal.tsx
│   ├── ui/
│   │   ├── Toast.tsx
│   │   └── ToastAuto.tsx
│   ├── FilaDetenidoRol.tsx
│   ├── LoadingProvider.tsx
│   ├── PageTransition.tsx
│   └── SmoothScroll.tsx
├── features/
│   ├── compartido/
│   │   └── components/
│   │       └── ButtonVerDetalles.tsx
│   ├── depInfracciones/
│   │   └── components/
│   │       └── TablaDevInfracciones/
│   │           └── DetalleInfraccionModal.tsx
│   ├── liberaciones/
│   │   └── components/
│   │       ├── CapturarInfractorSection.tsx
│   │       └── RevisionDocumentosSection.tsx
│   └── via/
│       ├── compartido/
│       │   └── types/
│       │       └── detalleInfraccion.ts
│       ├── emails/
│       │   └── templates/
│       ├── expediente/
│       │   └── helpers/
│       │       └── abrirDocumento.ts
│       ├── infracciones/
│       │   ├── components/
│       │   │   ├── steps/
│       │   │   ├── ui/
│       │   │   ├── CapturarDatosTitularSection.tsx
│       │   │   ├── MapSectionCiudadano.tsx
│       │   │   ├── ModalEntregarGarantia.tsx
│       │   │   ├── PagoInfraccion.tsx
│       │   │   └── SeccionLiberacion.tsx
│       │   ├── actions.ts
│       │   ├── constants.ts
│       │   ├── mapper.ts
│       │   ├── repository.ts
│       │   ├── service.ts
│       │   └── types.ts
│       ├── legalidad/
│       │   ├── actions.ts
│       │   ├── mapper.ts
│       │   ├── repository.ts
│       │   ├── service.ts
│       │   └── types.ts
│       ├── oficiales/
│       │   ├── components/
│       │   │   ├── FormularioInfraccion.tsx
│       │   │   └── MapaDireccionRegistro.tsx
│       │   ├── mapper.ts
│       │   ├── repository.ts
│       │   ├── service.ts
│       │   └── types.ts
│       └── saSiete/
│           ├── client.ts
│           ├── mapper.ts
│           ├── repository.ts
│           ├── service.ts
│           └── types.ts
├── hooks/
│   ├── useAnalistaForm.ts
│   ├── useDespacho.ts
│   ├── useEmpleado.ts
│   ├── useFlota.ts
│   ├── useIncidente.ts
│   ├── useIncidentes.ts
│   ├── usePolling.ts
│   ├── useRegistroDetenido.ts
│   └── useReporteCampo.ts
├── lib/
│   ├── 911/
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── admin/
│   │   ├── actions.ts
│   │   ├── mapper.ts
│   │   ├── repository.ts
│   │   └── types.ts
│   ├── admin-transito/
│   │   ├── actions.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   └── types.ts
│   ├── agente_911/
│   │   └── service.ts
│   ├── agente_bitacorista/
│   │   └── service.ts
│   ├── agente_despacho/
│   │   └── service.ts
│   ├── agente_infracciones/
│   │   ├── actions.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   ├── storeCapturaInfractor.ts
│   │   └── types.ts
│   ├── agente_juzgado/
│   │   ├── actions.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── agente_liberaciones/
│   │   ├── actions.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── analisis/
│   │   └── permisos.ts
│   ├── auth/
│   │   └── helpers.ts
│   ├── auxiliar/
│   │   ├── actions.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── camara/
│   │   ├── mapper.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── complementos/
│   │   └── repository.ts
│   ├── corralon/
│   │   ├── actions.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── d1/
│   │   ├── mapper.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── db/
│   │   ├── manual-migrations/
│   │   │   ├── 0006_formato_n.sql
│   │   │   ├── 0007_formato_n_split.sql
│   │   │   ├── 0008_monitorista_permisos.sql
│   │   │   ├── 0009_rename_permisos.sql
│   │   │   ├── 0010_permisos_seccion_libre.sql
│   │   │   ├── 0011_permisos_plantillas.sql
│   │   │   ├── 0012_permisos_eliminar.sql
│   │   │   └── 0013_roles_es_admin.sql
│   │   ├── create-admin.ts
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   ├── denuncias/
│   │   └── storeD1.ts
│   ├── emails/
│   │   ├── templates/
│   │   │   ├── asignacion-fiscalia.ts
│   │   │   ├── layout.ts
│   │   │   └── orden-liberacion.ts
│   │   ├── mailer.ts
│   │   └── server.ts
│   ├── expediente/
│   │   └── client.ts
│   ├── fiscalia/
│   │   ├── abrirDocumento.ts
│   │   ├── actions.ts
│   │   ├── expediente.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   ├── types.ts
│   │   └── useToastStore.ts
│   ├── flota/
│   │   ├── mapper.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── health/
│   │   └── repository.ts
│   ├── incidentes/
│   │   ├── actions.ts
│   │   ├── audit.ts
│   │   ├── folio.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── maps/
│   │   └── loadGoogleMaps.ts
│   ├── monitorista/
│   │   ├── actions.ts
│   │   ├── denuncia-service.ts
│   │   ├── detenido-service.ts
│   │   ├── expediente.ts
│   │   ├── incidentes-camara-service.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── ppt-service.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── n-coordinacion/
│   │   ├── actions.ts
│   │   └── repository.ts
│   ├── notificaciones/
│   │   ├── actions.ts
│   │   ├── checker.ts
│   │   ├── mapper.ts
│   │   ├── repository.ts
│   │   └── types.ts
│   ├── oficial/
│   │   ├── actions.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   ├── store.ts
│   │   └── types.ts
│   ├── ordenSalida/
│   │   └── generarOrdenSalida.ts
│   ├── permisos/
│   │   ├── core.ts
│   │   └── registro.ts
│   ├── prevencion/
│   │   ├── actions.ts
│   │   ├── mapper.ts
│   │   ├── paginate.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── semaforo.ts
│   │   ├── timeline.ts
│   │   └── types.ts
│   ├── reportes/
│   │   ├── formato-n-armas-aseguradas-service.ts
│   │   ├── formato-n-atencion-victimas-service.ts
│   │   ├── formato-n-consolidado-service.ts
│   │   ├── formato-n-eventos-service.ts
│   │   ├── formato-n-fge-service.ts
│   │   ├── formato-n-fgr-service.ts
│   │   ├── formato-n-medios-alternativos-service.ts
│   │   ├── formato-n-rnd-service.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   └── types.ts
│   ├── reportes-incidentes/
│   │   ├── mapper.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── reportes-operativos/
│   │   ├── mapper.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── reportes-sin-d1/
│   │   ├── mapper.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── reportes-sin-novedad/
│   │   ├── mapper.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── rol-servicios/
│   │   ├── actions.ts
│   │   ├── catalogos-actions.ts
│   │   ├── mapper.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── shared/
│   │   ├── abrirDocumento.ts
│   │   └── infracciones.ts
│   ├── utils/
│   │   ├── generateIPHPPT.ts
│   │   └── generatePPT.ts
│   ├── via/
│   │   ├── expediente.ts
│   │   ├── online.ts
│   │   ├── pagos.ts
│   │   └── sa7.ts
│   ├── auth-client.ts
│   ├── auth.ts
│   ├── constants.ts
│   ├── db.ts
│   ├── detenidos-compartido.ts
│   └── error-handler.ts
├── login-desing/
│   ├── assets/
│   │   ├── logo-shield.png
│   │   ├── logo-sspm.png
│   │   └── logo-text-light.png
│   ├── uploads/
│   │   ├── logo_seguridadP.png
│   │   └── pasted-1776873955895-0.png
│   ├── wireframes/
│   │   ├── shared.jsx
│   │   ├── wf-a.jsx
│   │   ├── wf-b.jsx
│   │   ├── wf-c.jsx
│   │   ├── wf-d.jsx
│   │   └── wf-e.jsx
│   ├── app.jsx
│   ├── design-canvas.jsx
│   ├── Login Hi-Fi.html
│   ├── Login Wireframes.html
│   └── login-app.jsx
├── public/
│   ├── uploads/
│   │   └── detenidos/
│   │       ├── FRONTAL_1782840405256_wp2881829.jpg
│   │       └── OBJETOS_1782840405257_fondo.png
│   ├── admin.png
│   ├── chaleco.png
│   ├── file.svg
│   ├── globe.svg
│   ├── logo_centinel.png
│   ├── logo_gobierno_mx.png
│   ├── logo_queretaro.jpeg
│   ├── logo_sentinel.png
│   ├── logo-shield.png
│   ├── logo-sspm.png
│   ├── logo-text-dark.png
│   ├── logo-text-light.png
│   ├── next.svg
│   ├── sjr.png
│   ├── vercel.svg
│   └── window.svg
├── scripts/
│   ├── ab-test.mjs
│   ├── benchmark.mjs
│   ├── export-schema.mjs
│   ├── exportar-schema.ts
│   ├── extract-domain.mjs
│   ├── load-context.mjs
│   ├── populate-vault.mjs
│   ├── session-checkpoint.mjs
│   ├── token-summary.mjs
│   ├── trace-client.mjs
│   ├── trace-components.mjs
│   ├── trace-server.mjs
│   ├── trace-utils.mjs
│   └── ym-dev.mjs
├── services/
│   ├── analisisService.ts
│   ├── analistaService.ts
│   └── registroDetenidoService.ts
├── stores/
│   ├── useInfraccionStore.ts
│   ├── useRondinFormStore.ts
│   └── useToastStore.ts
├── AGENTS.md
├── AGENTS.md.bak
├── cesar.md
├── CLAUDE.md
├── CREACION_BOVEDA.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── proxy.ts
├── README.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
```
<!-- AUTO-GENERATED END -->
