<!-- AUTO-GENERATED START -->
# API Routes

**Propósito**: Endpoints RESTful del sistema.

---

| Ruta | Métodos | Descripción |
|------|---------|-------------|
| `admin/roles` | POST | (Pendiente) |
| `agente_juzgado/finalizarProceso` | PATCH | (Pendiente) |
| `agente_juzgado/iniciarProceso` | PATCH | (Pendiente) |
| `analisis/prellenado-completo/[id]` | GET | (Pendiente) |
| `analisis/prellenado/[id]` | GET | (Pendiente) |
| `analisis/reportes-campo` | GET | (Pendiente) |
| `auth/[...all]` | GET | (Pendiente) |
| `auth/secciones-permitidas` | GET | (Pendiente) |
| `auth/token-guest` | POST | (Pendiente) |
| `auxiliar/exportar-robo` | GET | (Pendiente) |
| `camara/exportar` | GET | (Pendiente) |
| `complementos/gruas` | GET | (Pendiente) |
| `corralon/subir-archivo` | POST | (Pendiente) |
| `cron/notificaciones` | GET | (Pendiente) |
| `d1/exportar` | GET | (Pendiente) |
| `despacho/buscar-oficial` | GET | (Pendiente) |
| `despacho/unidades-cercanas` | GET | (Pendiente) |
| `detenidos/detalle/[id]` | GET | (Pendiente) |
| `detenidos/listar` | GET | (Pendiente) |
| `detenidos/registrar` | POST | (Pendiente) |
| `dev/cambiar-sesion` | POST | (Pendiente) |
| `expediente/proxy` | GET | (Pendiente) |
| `expediente/subir` | POST | (Pendiente) |
| `expediente/token` | POST | (Pendiente) |
| `expediente/vista/[token]` | GET | (Pendiente) |
| `fiscalia/expediente/subir-foto` | POST | (Pendiente) |
| `formatos-udai/faltas-administrativas/exportar` | GET | (Pendiente) |
| `formatos-udai/reportes-incidencias/exportar` | GET | (Pendiente) |
| `health` | GET | (Pendiente) |
| `incidentes` | GET | (Pendiente) |
| `incidentes/[id]` | GET | (Pendiente) |
| `incidentes/[id]/despacho` | GET | (Pendiente) |
| `incidentes/[id]/reporte` | GET | (Pendiente) |
| `incidentes/atendidos` | GET | (Pendiente) |
| `incidentes/bitacora-911` | GET | (Pendiente) |
| `incidentes/en-despacho` | GET | (Pendiente) |
| `incidentes/kpi-911-generales` | GET | (Pendiente) |
| `incidentes/kpi-geo` | GET | (Pendiente) |
| `incidentes/pendientes-despacho` | GET | (Pendiente) |
| `monitorista/denuncias/[id]/completar-solicitud` | POST | (Pendiente) |
| `monitorista/denuncias/subir` | POST | (Pendiente) |
| `monitorista/evidencias/subir` | POST | (Pendiente) |
| `monitorista/historial` | GET | (Pendiente) |
| `monitorista/incidentes-camara` | GET, POST | (Pendiente) |
| `monitorista/incidentes-camara/[id]` | GET, PATCH | (Pendiente) |
| `monitorista/solicitudes` | GET, POST | (Pendiente) |
| `monitorista/solicitudes/[id]` | GET | (Pendiente) |
| `monitorista/solicitudes/[id]/completar` | POST | (Pendiente) |
| `nCoordinacion/generar` | GET | (Pendiente) |
| `novedades/dia` | GET | Parte de Novedades C-4: día completo (calculado + capturado + estatus) |
| `novedades/confirmar` | POST | Snapshot + confirmación de una sección (`{fecha, seccion, datos}`) |
| `novedades/guardar` | POST | Guarda el draft de una sección sin confirmarla |
| `novedades/estatus` | GET | Estatus por rango de fechas (`?desde=&hasta=`) para el consolidado |
| `novedades/generar` | GET | Genera el `.docx` completo (`?fecha=YYYY-MM-DD`) |
| `notificaciones` | GET | (Pendiente) |
| `notificaciones/contador` | GET | (Pendiente) |
| `notificaciones/leer` | POST | (Pendiente) |
| `oficial/contador` | GET | (Pendiente) |
| `prevencion/busquedas` | GET, POST | (Pendiente) |
| `prevencion/busquedas/[id]` | GET, PUT | (Pendiente) |
| `prevencion/busquedas/[id]/cancelar` | POST | (Pendiente) |
| `prevencion/busquedas/[id]/seguimientos` | POST | (Pendiente) |
| `prevencion/busquedas/alertas` | GET | (Pendiente) |
| `prevencion/medidas` | GET, POST | (Pendiente) |
| `prevencion/medidas/[id]` | GET, PUT, PATCH | (Pendiente) |
| `prevencion/medidas/[id]/visitas` | GET, POST | (Pendiente) |
| `prevencion/solicitudes` | GET, POST | (Pendiente) |
| `prevencion/solicitudes/[id]` | GET, PUT | (Pendiente) |
| `prevencion/solicitudes/[id]/c4` | POST | (Pendiente) |
| `prevencion/solicitudes/[id]/contestacion` | POST | (Pendiente) |
| `registro-detenidos/registrar` | POST | (Pendiente) |
| `reporte-detenidos/generar-ppt` | POST | (Pendiente) |
| `reportes-d1` | POST | (Pendiente) |
| `reportes-incidentes/exportar` | GET | (Pendiente) |
| `reportes-operativos/exportar-excel` | GET | (Pendiente) |
| `reportes-sin-d1/exportar` | GET | (Pendiente) |
| `reportes-sin-novedad/exportar` | GET | (Pendiente) |
| `reportes/alarma-escolar/exportar` | GET | (Pendiente) |
| `reportes/extorsion/exportar` | GET | (Pendiente) |
| `reportes/formato-n-armas-aseguradas` | GET, POST | (Pendiente) |
| `reportes/formato-n-armas-aseguradas/[id]` | GET, PATCH | (Pendiente) |
| `reportes/formato-n-armas-aseguradas/sincronizar` | POST | (Pendiente) |
| `reportes/formato-n-atencion-victimas` | GET, POST | (Pendiente) |
| `reportes/formato-n-atencion-victimas/[id]` | GET, PATCH | (Pendiente) |
| `reportes/formato-n-consolidado` | POST | (Pendiente) |
| `reportes/formato-n-estatus` | POST, DELETE | (Pendiente) |
| `reportes/formato-n-eventos` | GET, POST | (Pendiente) |
| `reportes/formato-n-eventos/[id]` | GET, PATCH | (Pendiente) |
| `reportes/formato-n-eventos/fuente` | GET | (Pendiente) |
| `reportes/formato-n-eventos/sincronizar` | POST | (Pendiente) |
| `reportes/formato-n-fge` | GET, POST | (Pendiente) |
| `reportes/formato-n-fge/[id]` | GET, PATCH | (Pendiente) |
| `reportes/formato-n-fge/calcular` | GET | (Pendiente) |
| `reportes/formato-n-fgr` | GET, POST | (Pendiente) |
| `reportes/formato-n-fgr/[id]` | GET, PATCH | (Pendiente) |
| `reportes/formato-n-fgr/calcular` | GET | (Pendiente) |
| `reportes/formato-n-medios-alternativos` | GET, POST | (Pendiente) |
| `reportes/formato-n-medios-alternativos/[id]` | GET, PATCH | (Pendiente) |
| `reportes/formato-n-observaciones` | GET, POST | (Pendiente) |
| `reportes/formato-n-rnd` | GET, POST | (Pendiente) |
| `reportes/formato-n-rnd/[id]` | GET, PATCH | (Pendiente) |
| `reportes/formato-n-rnd/fuente` | GET | (Pendiente) |
| `reportes/formato-n-rnd/sincronizar` | POST | (Pendiente) |
| `reportes/numeros-extorsion/exportar` | GET | (Pendiente) |
| `rol-servicios/externos/rh` | GET | (Pendiente) |
| `uploads/[...path]` | GET | (Pendiente) |
| `via/ciudadano/completar-solicitud` | POST | (Pendiente) |
| `via/ciudadano/iniciar-solicitud` | POST | (Pendiente) |
| `via/ciudadano/subir-archivo` | POST | (Pendiente) |
| `via/curp` | POST | (Pendiente) |
| `via/descargar-orden/[infraccionId]` | GET | (Pendiente) |
| `via/exp-digital/guardar-docs` | POST | (Pendiente) |
| `via/exp-digital/guardar-evidencias` | POST | (Pendiente) |
| `via/infracciones/[id]` | GET | (Pendiente) |
| `via/infracciones/auto-acceso` | GET | (Pendiente) |
| `via/infracciones/iniciar-proceso` | PATCH | (Pendiente) |
| `via/infracciones/liberar-garantia` | PATCH | (Pendiente) |
| `via/infracciones/por-curp` | GET | (Pendiente) |
| `via/infracciones/registradas/[id]` | GET | (Pendiente) |
| `via/infracciones/registrar` | POST | (Pendiente) |
| `via/infracciones/retencion-placa` | PATCH | (Pendiente) |
| `via/infracciones/verificar-pin` | POST | (Pendiente) |
| `via/liberaciones/documentos/[infraccionId]` | GET | (Pendiente) |
| `via/pagos/confirmar-ausente/[infraccionId]` | GET | (Pendiente) |
| `via/pagos/confirmar-instante/[infraccionId]` | GET | (Pendiente) |
| `via/pagos/confirmar-liberacion/[infraccionId]` | GET | (Pendiente) |
| `via/pagos/confirmar-retenida/[infraccionId]` | GET | (Pendiente) |
| `via/pagos/finalizar-instante/[infraccionId]` | GET | (Pendiente) |
| `via/pagos/forzar-pago/[infraccionId]` | POST | (Pendiente) |
| `via/pagos/verificar-pago-pruebas/[infraccionId]` | GET | (Pendiente) |
| `via/sa7/buscar-orden` | GET | (Pendiente) |
| `via/sa7/generar-orden-pago` | POST | (Pendiente) |
<!-- AUTO-GENERATED END -->






























