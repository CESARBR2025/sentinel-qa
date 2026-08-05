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
│   │   │   ├── login.css
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── admin/
│   │   ├── notificaciones/
│   │   │   ├── enviar/
│   │   │   │   └── page.tsx
│   │   │   ├── mantenimiento/
│   │   │   │   └── page.tsx
│   │   │   ├── matriz/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── roles/
│   │   │   ├── [id]/
│   │   │   │   └── plantilla-permisos/
│   │   │   ├── agregar/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── sistema/
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
│   │   │   ├── revisar/
│   │   │   │   ├── page.tsx
│   │   │   │   └── RevisarFormulario.tsx
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
│   │   ├── kpi-incidencias/
│   │   │   └── page.tsx
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
│   ├── agente_reportes/
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
│   │   │   ├── secciones-permitidas/
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
│   │   ├── cron/
│   │   │   └── notificaciones/
│   │   │       └── route.ts
│   │   ├── d1/
│   │   │   └── exportar/
│   │   │       └── route.ts
│   │   ├── despacho/
│   │   │   ├── buscar-oficial/
│   │   │   │   └── route.ts
│   │   │   └── unidades-cercanas/
│   │   │       └── route.ts
│   │   ├── detenidos/
│   │   │   ├── detalle/
│   │   │   │   └── [id]/
│   │   │   ├── listar/
│   │   │   │   └── route.ts
│   │   │   └── registrar/
│   │   │       └── route.ts
│   │   ├── dev/
│   │   │   └── cambiar-sesion/
│   │   │       └── route.ts
│   │   ├── expediente/
│   │   │   ├── proxy/
│   │   │   │   └── route.ts
│   │   │   ├── subir/
│   │   │   │   └── route.ts
│   │   │   ├── subir-foto-detenido/
│   │   │   │   └── route.ts
│   │   │   ├── token/
│   │   │   │   └── route.ts
│   │   │   └── vista/
│   │   │       └── [token]/
│   │   ├── fiscalia/
│   │   │   └── expediente/
│   │   │       └── subir-foto/
│   │   ├── formatos-udai/
│   │   │   └── faltas-administrativas/
│   │   │       └── exportar/
│   │   ├── health/
│   │   │   └── route.ts
│   │   ├── incidentes/
│   │   │   ├── [id]/
│   │   │   │   ├── despacho/
│   │   │   │   ├── reporte/
│   │   │   │   └── route.ts
│   │   │   ├── atendidos/
│   │   │   │   └── route.ts
│   │   │   ├── bitacora-911/
│   │   │   │   └── route.ts
│   │   │   ├── en-despacho/
│   │   │   │   └── route.ts
│   │   │   ├── kpi-geo/
│   │   │   │   └── route.ts
│   │   │   ├── pendientes-despacho/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── monitorista/
│   │   │   ├── denuncias/
│   │   │   │   ├── [id]/
│   │   │   │   └── subir/
│   │   │   ├── detenidos/
│   │   │   │   └── [id]/
│   │   │   ├── evidencias/
│   │   │   │   └── subir/
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
│   │   │   ├── contador/
│   │   │   │   └── route.ts
│   │   │   ├── leer/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── oficial/
│   │   │   └── contador/
│   │   │       └── route.ts
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
│   │   ├── reporte-detenidos/
│   │   │   └── generar-ppt/
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
│   │       ├── descargar-orden/
│   │       │   └── [infraccionId]/
│   │       ├── exp-digital/
│   │       │   ├── guardar-docs/
│   │       │   └── guardar-evidencias/
│   │       ├── infracciones/
│   │       │   ├── [id]/
│   │       │   ├── auto-acceso/
│   │       │   ├── iniciar-proceso/
│   │       │   ├── liberar-garantia/
│   │       │   ├── por-curp/
│   │       │   ├── registradas/
│   │       │   ├── registrar/
│   │       │   ├── retencion-placa/
│   │       │   └── verificar-pin/
│   │       ├── liberaciones/
│   │       │   └── documentos/
│   │       ├── pagos/
│   │       │   ├── confirmar-ausente/
│   │       │   ├── confirmar-instante/
│   │       │   ├── confirmar-liberacion/
│   │       │   ├── confirmar-retenida/
│   │       │   ├── finalizar-instante/
│   │       │   ├── forzar-pago/
│   │       │   └── verificar-pago-pruebas/
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
│   │   ├── catalogos/
│   │   │   ├── oficiales/
│   │   │   │   ├── [id]/
│   │   │   │   ├── nuevo/
│   │   │   │   └── page.tsx
│   │   │   ├── patrullas/
│   │   │   │   ├── [id]/
│   │   │   │   ├── nuevo/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── enable-2fa.tsx
│   │   ├── module-cards.tsx
│   │   ├── page.tsx
│   │   ├── sign-out-button.tsx
│   │   └── sspm-general.tsx
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
│   ├── formatos-udai/
│   │   ├── faltas-administrativas/
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
│   ├── notificaciones/
│   │   └── page.tsx
│   ├── offline/
│   │   └── page.tsx
│   ├── oficial/
│   │   ├── configuracion/
│   │   │   ├── EditarTelefono.tsx
│   │   │   └── page.tsx
│   │   ├── despachos/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── reportes/
│   │   │   └── [id]/
│   │   │       ├── fotos/
│   │   │       └── page.tsx
│   │   ├── rondin/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
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
│   ├── reporte-detenidos/
│   │   └── page.tsx
│   ├── reportes_incidentes/
│   │   └── page.tsx
│   ├── rol_servicios/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── sin_robos/
│   │   └── page.tsx
│   ├── error.tsx
│   ├── favicon.ico
│   ├── global-error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── 911/
│   │   ├── despacho/
│   │   │   ├── AsignacionMapa.tsx
│   │   │   ├── DespachoForm.tsx
│   │   │   ├── MapaSeguimientoOficial.tsx
│   │   │   ├── SeleccionarUnidadesModal.tsx
│   │   │   ├── TablonDespacho.tsx
│   │   │   └── UnidadCards.tsx
│   │   ├── kpi/
│   │   │   ├── FiltrosRangoKpi.tsx
│   │   │   ├── formato.ts
│   │   │   ├── KpiIncidenciasView.tsx
│   │   │   ├── MapaCalorIncidencias.tsx
│   │   │   ├── MapaPuntosIncidencias.tsx
│   │   │   ├── ModalDetalleIncidencia.tsx
│   │   │   ├── TablaIncidencias.tsx
│   │   │   └── useMapaIncidencias.ts
│   │   ├── radio/
│   │   │   ├── FormRondinEscalado.tsx
│   │   │   └── Input.tsx
│   │   ├── whatsapp/
│   │   │   ├── FormSection.tsx
│   │   │   └── RegistroIncidenteForm.tsx
│   │   ├── Bitacora911.tsx
│   │   ├── FiltrosIncidentes.tsx
│   │   ├── ModuleCard.tsx
│   │   └── Pagination.tsx
│   ├── admin/
│   │   ├── roles/
│   │   │   └── FormularioRol.tsx
│   │   └── ResetSistemaForm.tsx
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
│   ├── catalogos/
│   │   ├── ModalDestituirOficial.tsx
│   │   ├── ModalReactivarOficial.tsx
│   │   ├── NuevoOficialForm.tsx
│   │   ├── OficialesTablaConFiltros.tsx
│   │   ├── OficialesTable.tsx
│   │   ├── PatrullaForm.tsx
│   │   ├── PatrullasTablaConFiltros.tsx
│   │   └── PatrullasTable.tsx
│   ├── denuncias/
│   │   └── FormularioD1.tsx
│   ├── dev/
│   │   └── CambiarSesionDev.tsx
│   ├── fiscalia/
│   │   ├── AntecedentesExternos.tsx
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
│   ├── formatos-udai/
│   │   ├── BotonExportarExcel.tsx
│   │   └── DetalleFaltaAdministrativaModal.tsx
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
│   │   ├── CampanillaNotificaciones.tsx
│   │   └── ListaHistorial.tsx
│   ├── oficial/
│   │   ├── navegacion/
│   │   │   ├── AsignacionCard.tsx
│   │   │   ├── NavegacionDespacho.tsx
│   │   │   └── NavegacionModal.tsx
│   │   ├── rondin/
│   │   │   ├── RondinPageClient.tsx
│   │   │   └── RondinTabla.tsx
│   │   ├── ContadorAsignaciones.tsx
│   │   ├── DespachoContent.tsx
│   │   ├── FormularioRecorrido.tsx
│   │   ├── MapaPinFijo.tsx
│   │   ├── MapaUbicacion.tsx
│   │   ├── MiUbicacionSection.tsx
│   │   ├── ModalSeleccionarUnidad.tsx
│   │   ├── OficialUbicacionTracker.tsx
│   │   ├── ProfileDropdown.tsx
│   │   ├── SegmentControl.tsx
│   │   ├── SelectorDestinoLegal.tsx
│   │   ├── ToastExito.tsx
│   │   └── UnidadAsignadaSection.tsx
│   ├── partials/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── PageHeader.tsx
│   │   ├── SegmentPage.tsx
│   │   ├── StepIndicator.tsx
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
│   ├── reporte-detenidos/
│   │   └── BotonGenerarPpt.tsx
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
│   │   ├── PedirEvidenciasModal.tsx
│   │   └── SecureImg.tsx
│   ├── ui/
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── Toast.tsx
│   │   └── ToastAuto.tsx
│   ├── FilaDetenidoRol.tsx
│   ├── LoadingProvider.tsx
│   ├── PageTransition.tsx
│   └── sw-register.tsx
├── docs/
│   └── notificaciones-oficial-despacho/
│       ├── 00-contexto.md
│       ├── 01-backend-despacho-asignado.md
│       ├── 02-backend-despacho-refuerzos.md
│       ├── 03-frontend-campanita-ui.md
│       ├── 04-verificacion.md
│       ├── 05-fix-prioritario-oficial-ocupado.md
│       └── 06-fix-prioritario-notificado-al-despachar.md
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
│       ├── infracciones/
│       │   ├── components/
│       │   │   ├── steps/
│       │   │   ├── ui/
│       │   │   ├── CapturarDatosTitularSection.tsx
│       │   │   ├── DictadoGuiadoInfraccion.tsx
│       │   │   ├── DictadoInicialInfraccion.tsx
│       │   │   ├── DictadoRevision.tsx
│       │   │   ├── EspectroVoz.tsx
│       │   │   ├── MapSectionCiudadano.tsx
│       │   │   ├── ModalEntregarGarantia.tsx
│       │   │   ├── PagoInfraccion.tsx
│       │   │   ├── PinBarrier.tsx
│       │   │   └── SeccionLiberacion.tsx
│       │   ├── constants/
│       │   │   ├── preguntasGuiadas.ts
│       │   │   └── vehiculo.ts
│       │   ├── hooks/
│       │   │   ├── useEspectroAudio.ts
│       │   │   └── useReconocimientoVoz.ts
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
│   ├── useIncidente.ts
│   ├── useIncidentes.ts
│   ├── useMediaQuery.ts
│   ├── usePolling.ts
│   ├── useRegistroDetenido.ts
│   ├── useReporteCampo.ts
│   └── useResponsive.ts
├── lib/
│   ├── 911/
│   │   ├── estatus-c4.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── admin/
│   │   ├── actions.ts
│   │   ├── mapper.ts
│   │   ├── repository.ts
│   │   ├── sistema-actions.ts
│   │   ├── sistema-constants.ts
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
│   ├── ai/
│   │   └── client.ts
│   ├── analisis/
│   │   └── permisos.ts
│   ├── auth/
│   │   ├── actions.ts
│   │   ├── dev-sesiones.ts
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
│   ├── catalogos/
│   │   ├── actions.ts
│   │   ├── mapper.ts
│   │   ├── repository.ts
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
│   │   │   ├── 0013_roles_es_admin.sql
│   │   │   ├── 0014_infracciones_narrativa.sql
│   │   │   ├── 0015_catalogo_jerarquico_3_niveles.sql
│   │   │   ├── 0016_seed_catalogo_nacional.sql
│   │   │   ├── 0017_incidentes_folio_cad.sql
│   │   │   ├── 0018_drop_eventos_cat_estatus_evento.sql
│   │   │   ├── 0019_incidentes_svv_notificado.sql
│   │   │   ├── 0020_incidentes_dependencia_id.sql
│   │   │   ├── 0021_incidentes_telefono_reportante.sql
│   │   │   ├── 0022_dependencia_sugerida_por_tipo.sql
│   │   │   ├── 0023_despacho_unidades_horarios.sql
│   │   │   ├── 0024_reportes_campo_catalogo_fk.sql
│   │   │   ├── 0025_ubicacion_oficiales.sql
│   │   │   ├── 0026_notificaciones_por_rol.sql
│   │   │   ├── 0027_patrullas_parque_vehicular.sql
│   │   │   ├── 0028_v2_patrullas_placa.sql
│   │   │   ├── 0029_asignar_oficiales_patrulla.sql
│   │   │   ├── 0030_tokens_recurso.sql
│   │   │   ├── 0031_incidente_despacho_elementos_atiende_caso.sql
│   │   │   ├── 0032_reportes_campo_integridad.sql
│   │   │   ├── 0033_detenidos_asegurados_idx.sql
│   │   │   ├── 0034_iph_romper_circular.sql
│   │   │   ├── 0035_d1_integridad.sql
│   │   │   ├── 0036_fks_faltantes_e_indices.sql
│   │   │   ├── 0037_datos_biograficos_detenido.sql
│   │   │   ├── 0038_antecedentes_externos_detenido.sql
│   │   │   └── README.md
│   │   ├── create-admin.ts
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   ├── seed-catalogo-nacional.ts
│   │   └── seed.ts
│   ├── denuncias/
│   │   └── storeD1.ts
│   ├── emails/
│   │   ├── templates/
│   │   │   ├── asignacion-fiscalia.ts
│   │   │   ├── layout.ts
│   │   │   ├── orden-liberacion.ts
│   │   │   ├── pago-confirmado.ts
│   │   │   └── pin-acceso.ts
│   │   ├── mailer.ts
│   │   └── server.ts
│   ├── expediente/
│   │   ├── v2/
│   │   │   ├── carpetas.ts
│   │   │   ├── client.ts
│   │   │   ├── ref.ts
│   │   │   ├── token.ts
│   │   │   └── view-store.ts
│   │   └── client.ts
│   ├── fiscalia/
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
│   ├── formatos-udai/
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   └── types.ts
│   ├── health/
│   │   └── repository.ts
│   ├── incidentes/
│   │   ├── actions.ts
│   │   ├── audit.ts
│   │   ├── folio.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── prioridad-colores.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── maps/
│   │   ├── googleMapsConfig.ts
│   │   └── loadGoogleMaps.ts
│   ├── monitorista/
│   │   ├── actions.ts
│   │   ├── denuncia-service.ts
│   │   ├── detenido-service.ts
│   │   ├── expediente.ts
│   │   ├── incidentes-camara-service.ts
│   │   ├── mapper.ts
│   │   ├── permisos.ts
│   │   ├── repository.ts
│   │   ├── service.ts
│   │   └── types.ts
│   ├── n-coordinacion/
│   │   ├── actions.ts
│   │   └── repository.ts
│   ├── notificaciones/
│   │   ├── actions.ts
│   │   ├── admin-actions.ts
│   │   ├── catalogo.ts
│   │   ├── checker.ts
│   │   ├── emisor.ts
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
│   │   ├── mapa-secciones.ts
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
│   ├── recursos/
│   │   └── token-recurso.ts
│   ├── reporte-detenidos/
│   │   ├── permisos.ts
│   │   ├── ppt-service.ts
│   │   ├── repository.ts
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
│   │   ├── geo.ts
│   │   └── infracciones.ts
│   ├── utils/
│   │   ├── generateIPHPPT.ts
│   │   └── generatePPT.ts
│   ├── via/
│   │   ├── auth-ciudadano.ts
│   │   ├── crypto-ciudadano.ts
│   │   ├── online.ts
│   │   ├── pagos.ts
│   │   └── sa7.ts
│   ├── auth-client.ts
│   ├── auth.ts
│   ├── constants.ts
│   ├── db.ts
│   ├── detenidos-compartido.ts
│   ├── error-handler.ts
│   └── utils.ts
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
├── plan-auditoria-url/
│   ├── 00-contexto.md
│   ├── etapa-0-auditoria.md
│   ├── etapa-1-cierre-autorizacion.md
│   ├── etapa-2-idor-hardening.md
│   ├── etapa-3-cosmetica-opcional.md
│   ├── README.md
│   └── test-qa.md
├── plan-cierre-idor-pendientes/
│   ├── 00-contexto.md
│   ├── etapa-1-token-solicitudes-generales.md
│   ├── etapa-2-autorizacion-uploads.md
│   ├── README.md
│   └── test-qa.md
├── plan-formato-faltasadministrativas/
│   ├── 00-contexto.md
│   ├── etapa-1.md
│   ├── etapa-2.md
│   ├── etapa-3.md
│   ├── etapa-4.md
│   ├── etapa-5.md
│   ├── etapa-6.md
│   ├── PROMPT-DEEPSEEK.md
│   └── README.md
├── plan-formato-incidencias/
│   ├── 00-contexto.md
│   ├── etapa-1.md
│   ├── etapa-2.md
│   ├── etapa-3.md
│   ├── etapa-4.md
│   └── etapa-5.md
├── plan-formulario-d1/
│   ├── 00-contexto.md
│   ├── etapa-1.md
│   ├── etapa-2.md
│   ├── etapa-3.md
│   ├── etapa-4.md
│   ├── etapa-5.md
│   ├── etapa-6.md
│   ├── etapa-7.md
│   ├── etapa-8.md
│   └── README.md
├── plan-mapa-despacho/
│   ├── 00-contexto.md
│   ├── etapa-1.md
│   ├── etapa-10.md
│   ├── etapa-11.md
│   ├── etapa-12.md
│   ├── etapa-2.md
│   ├── etapa-3.md
│   ├── etapa-4.md
│   ├── etapa-5.md
│   ├── etapa-6.md
│   ├── etapa-7.md
│   ├── etapa-8.md
│   ├── etapa-9.md
│   ├── README.md
│   └── test-qa.md
├── plan-navegacion-modal/
│   ├── 00-contexto.md
│   ├── etapa-1.md
│   ├── etapa-2.md
│   ├── etapa-3.md
│   ├── etapa-4.md
│   ├── README.md
│   └── test-qa.md
├── plan-navegacion-oficial/
│   ├── 00-contexto.md
│   ├── etapa-1.md
│   ├── etapa-2.md
│   ├── etapa-3.md
│   ├── etapa-4.md
│   ├── etapa-5.md
│   ├── etapa-6.md
│   ├── etapa-7.md
│   ├── README.md
│   └── test-qa.md
├── plan-reporte-detenidos/
│   ├── 00-contexto.md
│   ├── etapa-1.md
│   ├── etapa-2.md
│   ├── etapa-3.md
│   ├── etapa-4.md
│   ├── etapa-5.md
│   ├── etapa-6.md
│   ├── etapa-7.md
│   ├── etapa-8.md
│   └── README.md
├── plan-reporte-detenidos-bueno/
│   ├── 00-contexto.md
│   ├── etapa-1.md
│   ├── etapa-2.md
│   ├── etapa-3.md
│   ├── etapa-4.md
│   ├── etapa-5.md
│   ├── etapa-6.md
│   ├── etapa-7.md
│   ├── etapa-8.md
│   └── README.md
├── plan-reporte-ppt/
│   ├── 00-contexto.md
│   ├── etapa-1.md
│   ├── etapa-2.md
│   ├── etapa-3.md
│   ├── etapa-4.md
│   └── README.md
├── plan-saneamiento-bd-d1/
│   ├── 00-contexto.md
│   ├── etapa-1.md
│   ├── etapa-2.md
│   ├── etapa-3.md
│   ├── etapa-4.md
│   ├── etapa-5.md
│   ├── etapa-6.md
│   ├── etapa-7.md
│   ├── etapa-8.md
│   ├── etapa-9.md
│   └── README.md
├── public/
│   ├── files-xlsx/
│   │   └── flota-vehicular-nuevo.xlsx
│   ├── marca_agua/
│   │   └── plantilla-orden-salida.png
│   ├── uploads/
│   │   └── detenidos/
│   │       ├── FRONTAL_1782840405256_wp2881829.jpg
│   │       └── OBJETOS_1782840405257_fondo.png
│   ├── admin.png
│   ├── chaleco.png
│   ├── file.svg
│   ├── globe.svg
│   ├── logo_centinel.png
│   ├── logo_ficha_udai.png
│   ├── logo_gobierno_mx.png
│   ├── logo_queretaro.jpeg
│   ├── logo_sentinel.png
│   ├── logo-shield.png
│   ├── logo-sspm.png
│   ├── logo-text-dark.png
│   ├── logo-text-light.png
│   ├── manifest.json
│   ├── next.svg
│   ├── sjr.png
│   ├── sw.js
│   ├── vercel.svg
│   └── window.svg
├── scripts/
│   ├── reportes/
│   │   └── auditoria-permisos.csv
│   ├── responsive/
│   │   └── exceptions.json
│   ├── ab-test.mjs
│   ├── audit-responsive.mjs
│   ├── auditoria-permisos.mjs
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
│   ├── verify-browser-sim.ts
│   ├── ym-dev.mjs
│   ├── ym-hook-guard.mjs
│   ├── ym-hook-posttool.mjs
│   ├── ym-hook-session-start.mjs
│   └── ym-sync-background.mjs
├── services/
│   ├── analisisService.ts
│   ├── analistaService.ts
│   └── registroDetenidoService.ts
├── stores/
│   ├── useInfraccionStore.ts
│   ├── useRondinFormStore.ts
│   └── useToastStore.ts
├── types/
│   └── simpleheat.d.ts
├── AGENTS.md
├── AGENTS.md.bak
├── cesar.md
├── CLAUDE.md
├── components.json
├── CREACION_BOVEDA.md
├── DESIGN.md
├── eslint.config.mjs
├── INSTRUCCIONES-INFRACCIONES.md
├── next-env.d.ts
├── next.config.ts
├── opencode.json
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── proxy.ts
├── README.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
```
<!-- AUTO-GENERATED END -->




























































