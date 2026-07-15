# API Routes

**Propósito**: Endpoints RESTful del sistema.

---

| Endpoint | Método | Propósito | Módulo |
|----------|--------|-----------|--------|
| `/api/health` | GET | Health check | health |
| `/api/auth/[...all]` | * | Auth (better-auth handler) | auth |
| `/api/auth/token-guest` | POST | Token de invitado | auth |
| `/api/admin/roles` | GET | Listar roles | admin |
| `/api/agente_juzgado/finalizarProceso` | POST | Finalizar proceso juzgado | agente_juzgado |
| `/api/agente_juzgado/iniciarProceso` | POST | Iniciar proceso juzgado | agente_juzgado |
| `/api/analisis/prellenado-completo/[id]` | GET | Prellenado completo análisis | analisis |
| `/api/analisis/prellenado/[id]` | GET | Prellenado análisis | analisis |
| `/api/analisis/reportes-campo` | GET | Reportes de campo análisis | analisis |
| `/api/auxiliar/exportar-robo` | GET | Exportar robo auxiliar | auxiliar |
| `/api/camara/exportar` | GET | Exportar datos cámara | camara |
| `/api/complementos/gruas` | GET | Listar grúas | complementos |
| `/api/corralon/subir-archivo` | POST | Subir archivo corralón | corralon |
| `/api/d1/exportar` | GET | Exportar D1 | d1 |
| `/api/detenidos/detalle/[id]` | GET | Detalle detenido | detenidos |
| `/api/detenidos/listar` | GET | Listar detenidos | detenidos |
| `/api/detenidos/registrar` | POST | Registrar detenido | detenidos |
| `/api/expediente/proxy` | GET | Proxy expediente | expediente |
| `/api/expediente/subir` | POST | Subir archivo expediente | expediente |
| `/api/expediente/subir-foto-detenido` | POST | Subir foto detenido | expediente |
| `/api/incidentes` | GET | Listar incidentes | incidentes |
| `/api/incidentes/[id]` | GET | Detalle de incidente | incidentes |
| `/api/incidentes/[id]/despacho` | GET/POST | Despacho de incidente | incidentes |
| `/api/incidentes/[id]/reporte` | GET/POST | Reporte de campo de incidente | incidentes |
| `/api/incidentes/atendidos` | GET | Incidentes atendidos | incidentes |
| `/api/incidentes/en-despacho` | GET | Incidentes en despacho | incidentes |
| `/api/incidentes/pendientes-despacho` | GET | Incidentes pendientes de despacho | incidentes |
| `/api/monitorista/denuncias/[id]/completar-solicitud` | POST | Completar solicitud denuncia | monitorista |
| `/api/monitorista/denuncias/subir` | POST | Subir evidencia denuncia | monitorista |
| `/api/monitorista/detenidos/[id]/editar-campo` | PATCH | Editar campo detenido | monitorista |
| `/api/monitorista/detenidos/[id]/enviar-foto` | POST | Enviar foto detenido | monitorista |
| `/api/monitorista/detenidos/[id]/subir-foto` | POST | Subir foto detenido | monitorista |
| `/api/monitorista/detenidos/generar-ppt` | POST | Generar PPT detenidos | monitorista |
| `/api/monitorista/evidencias/subir` | POST | Subir evidencia | monitorista |
| `/api/monitorista/expediente-proxy` | GET | Proxy expediente monitorista | monitorista |
| `/api/monitorista/historial` | GET | Historial monitorista | monitorista |
| `/api/monitorista/incidentes-camara` | GET | Listar incidentes cámara | monitorista |
| `/api/monitorista/incidentes-camara/[id]` | GET | Detalle incidente cámara | monitorista |
| `/api/monitorista/solicitudes` | GET | Listar solicitudes | monitorista |
| `/api/monitorista/solicitudes/[id]` | GET | Detalle solicitud | monitorista |
| `/api/monitorista/solicitudes/[id]/completar` | POST | Completar solicitud | monitorista |
| `/api/notificaciones` | GET | Listar notificaciones | notificaciones |
| `/api/prevencion/busquedas` | GET | Listar búsquedas | prevencion |
| `/api/prevencion/busquedas/[id]` | GET | Detalle búsqueda | prevencion |
| `/api/prevencion/busquedas/[id]/cancelar` | POST | Cancelar búsqueda | prevencion |
| `/api/prevencion/busquedas/[id]/seguimientos` | GET | Seguimientos de búsqueda | prevencion |
| `/api/prevencion/busquedas/alertas` | GET | Alertas de búsqueda | prevencion |
| `/api/prevencion/medidas` | GET | Listar medidas | prevencion |
| `/api/prevencion/medidas/[id]` | GET | Detalle medida | prevencion |
| `/api/prevencion/medidas/[id]/visitas` | GET | Visitas de medida | prevencion |
| `/api/prevencion/solicitudes` | GET | Listar solicitudes | prevencion |
| `/api/prevencion/solicitudes/[id]` | GET | Detalle solicitud | prevencion |
| `/api/prevencion/solicitudes/[id]/c4` | GET | Solicitud C4 interna | prevencion |
| `/api/prevencion/solicitudes/[id]/contestacion` | GET | Contestación de solicitud | prevencion |
| `/api/registro-detenidos/registrar` | POST | Registrar detenido (alterno) | registro-detenidos |
| `/api/reportes-d1` | GET | Reportes D1 | reportes-d1 |
| `/api/reportes-incidentes/exportar` | GET | Exportar reportes incidentes | reportes-incidentes |
| `/api/reportes-operativos/exportar-excel` | GET | Exportar reportes operativos a Excel | reportes-operativos |
| `/api/reportes-sin-d1/exportar` | GET | Exportar reportes sin D1 | reportes-sin-d1 |
| `/api/reportes-sin-novedad/exportar` | GET | Exportar reportes sin novedad | reportes-sin-novedad |
| `/api/reportes-telefonicos/exportar` | GET | Exportar reportes telefónicos | reportes-telefonicos |
| `/api/reportes/formato-n-armas-aseguradas` | GET | Listar formato N armas | reportes |
| `/api/reportes/formato-n-armas-aseguradas/[id]` | GET | Detalle formato N armas | reportes |
| `/api/reportes/formato-n-atencion-victimas` | GET | Listar formato N atención víctimas | reportes |
| `/api/reportes/formato-n-atencion-victimas/[id]` | GET | Detalle formato N atención víctimas | reportes |
| `/api/reportes/formato-n-consolidado` | GET | Consolidado formato N | reportes |
| `/api/reportes/formato-n-eventos` | GET | Listar formato N eventos | reportes |
| `/api/reportes/formato-n-eventos/[id]` | GET | Detalle formato N eventos | reportes |
| `/api/reportes/formato-n-eventos/fuente` | GET | Fuente de datos eventos | reportes |
| `/api/reportes/formato-n-fge` | GET | Listar formato N FGE | reportes |
| `/api/reportes/formato-n-fge/[id]` | GET | Detalle formato N FGE | reportes |
| `/api/reportes/formato-n-fge/calcular` | POST | Calcular formato N FGE | reportes |
| `/api/reportes/formato-n-fgr` | GET | Listar formato N FGR | reportes |
| `/api/reportes/formato-n-fgr/[id]` | GET | Detalle formato N FGR | reportes |
| `/api/reportes/formato-n-medios-alternativos` | GET | Listar formato N medios alternativos | reportes |
| `/api/reportes/formato-n-medios-alternativos/[id]` | GET | Detalle formato N medios alternativos | reportes |
| `/api/reportes/formato-n-rnd` | GET | Listar formato N RND | reportes |
| `/api/reportes/formato-n-rnd/[id]` | GET | Detalle formato N RND | reportes |
| `/api/reportes/formato-n-rnd/fuente` | GET | Fuente de datos RND | reportes |
| `/api/rol-servicios/externos/flota` | GET | Sincronizar flota | rol-servicios |
| `/api/rol-servicios/externos/rh` | GET | Sincronizar RH | rol-servicios |
| `/api/uploads/[...path]` | GET | Servir archivos subidos | uploads |
| `/api/via/ciudadano/completar-solicitud` | POST | Completar solicitud ciudadano | via |
| `/api/via/ciudadano/iniciar-solicitud` | POST | Iniciar solicitud ciudadano | via |
| `/api/via/ciudadano/subir-archivo` | POST | Subir archivo ciudadano | via |
| `/api/via/curp` | GET | Consultar CURP | via |
| `/api/via/exp-digital/guardar-docs` | POST | Guardar docs expediente digital | via |
| `/api/via/exp-digital/guardar-evidencias` | POST | Guardar evidencias exp digital | via |
| `/api/via/exp-digital/token` | POST | Token expediente digital | via |
| `/api/via/infracciones/iniciar-proceso` | POST | Iniciar proceso infracción | via |
| `/api/via/infracciones/liberar-garantia` | POST | Liberar garantía infracción | via |
| `/api/via/infracciones/registradas/[id]` | GET | Detalle infracción registrada | via |
| `/api/via/infracciones/registrar` | POST | Registrar infracción | via |
| `/api/via/infracciones/retencion-placa` | POST | Retención de placa | via |
| `/api/via/liberaciones/documentos/[infraccionId]` | GET | Documentos de liberación | via |
| `/api/via/pagos/confirmar-ausente/[ordenPagoId]/[infraccionId]` | POST | Confirmar pago ausente | via |
| `/api/via/pagos/confirmar-instante/[ordenPagoId]/[infraccionId]` | POST | Confirmar pago instantáneo | via |
| `/api/via/pagos/confirmar-liberacion/[ordenPagoId]/[infraccionId]` | POST | Confirmar pago liberación | via |
| `/api/via/pagos/confirmar-retenida/[ordenPagoId]/[infraccionId]` | POST | Confirmar pago retenida | via |
| `/api/via/pagos/finalizar-instante/[ordenPagoId]/[infraccionId]` | POST | Finalizar pago instantáneo | via |
| `/api/via/sa7/buscar-orden` | POST | Buscar orden SA7 | via |
| `/api/via/sa7/generar-orden-pago` | POST | Generar orden de pago SA7 | via |

### Grupos de endpoints

| Módulo | Endpoints |
|--------|-----------|
| `health` | 1 |
| `auth` | 2 |
| `admin` | 1 |
| `agente_juzgado` | 2 |
| `analisis` | 3 |
| `auxiliar` | 1 |
| `camara` | 1 |
| `complementos` | 1 |
| `corralon` | 1 |
| `d1` | 1 |
| `detenidos` | 3 |
| `expediente` | 3 |
| `incidentes` | 7 |
| `monitorista` | 14 |
| `notificaciones` | 1 |
| `prevencion` | 12 |
| `registro-detenidos` | 1 |
| `reportes` (formato-n) | 18 |
| `reportes-d1` | 1 |
| `reportes-incidentes` | 1 |
| `reportes-operativos` | 1 |
| `reportes-sin-d1` | 1 |
| `reportes-sin-novedad` | 1 |
| `reportes-telefonicos` | 1 |
| `rol-servicios` | 2 |
| `uploads` | 1 |
| `via` | 20 |

**Total: 97 endpoints**
