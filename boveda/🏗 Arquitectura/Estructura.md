# Estructura del Proyecto

**Propósito**: Mapa del árbol de directorios del proyecto.

---

```
├── app/              # Next.js App Router (páginas y API routes)
├── boveda/           # Bóveda de conocimiento (documentación)
├── components/       # Componentes React compartidos
├── features/         # Feature components (por dominio, colocation)
├── hooks/            # React hooks personalizados
├── lib/              # Lógica de negocio (types, mapper, repository, service, actions)
├── public/           # Archivos estáticos (imágenes, logos)
├── scripts/          # Scripts de utilidad (exportar-schema, seed)
├── services/         # Servicios externos (integración APIs)
├── stores/           # Estado global (Zustand)
└── uploads/          # Archivos subidos temporalmente
```

### `lib/` — Módulos de dominio
| Módulo | Propósito |
|--------|-----------|
| `lib/911/` | Atención de emergencias (Ciudadano, WhatsApp, Rondín) |
| `lib/admin/` | Administración de usuarios y roles |
| `lib/admin-transito/` | Gestión de oficiales de tránsito |
| `lib/auxiliar/` | Auxiliar de novedades (checklist, cuestionario robo) |
| `lib/camara/` | Detección de incidentes por cámara |
| `lib/corralon/` | Gestión de corralón (solicitudes, documentos) |
| `lib/d1/` | Reportes D1 (denuncias iniciales) |
| `lib/incidentes/` | Gestión de incidentes (despacho, reporte campo) |
| `lib/fiscalia/` | Fiscalía (asegurados, solicitudes, puesta disposición) |
| `lib/flota/` | Sincronización de patrullas con API externa |
| `lib/monitorista/` | Monitorista (solicitudes evidencia, detenidos) |
| `lib/notificaciones/` | Sistema de notificaciones push |
| `lib/oficial/` | Oficial de campo (reportes, infracciones) |
| `lib/prevencion/` | Prevención del delito (medidas, búsquedas, jurídico) |
| `lib/reportes/` | Reportes (Formato N, estadísticas) |
| `lib/reportes-operativos/` | Reportes operativos (motos, vehículos, cateos) |
| `lib/reportes-sin-d1/` | Reportes sin D1 iniciada |
| `lib/reportes-sin-novedad/` | Reportes sin novedad |
| `lib/reportes-incidentes/` | Reportes de incidentes (diario, semanal) |
| `lib/agente_juzgado/` | Agente de juzgado (procesos, liberaciones) |
| `lib/agente_liberaciones/` | Liberaciones (revisión documental, órdenes pago) |
| `lib/agente_infracciones/` | Infracciones (captura, garantías, corralón) |
| `lib/rol-servicios/` | Rol de servicios y estado de fuerza |

### `app/` — Rutas
| Ruta | Propósito |
|------|-----------|
| `app/api/` | 58+ API routes (REST) |
| `app/911/` | Páginas del módulo 911 |
| `app/admin/` | Administración usuarios/roles |
| `app/monitorista/` | Panel del monitorista |
| `app/prevencion/` | Prevención del delito |
| `app/fiscalia/` | Fiscalía |
| ... | ... (cada módulo tiene su ruta) |
