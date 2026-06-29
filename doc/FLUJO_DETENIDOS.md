# Flujo de Solicitudes de Detenidos — Estados y DB

## Tablas

### `solicitudes_detenido`
Creada por nosotros. Cada registro es una solicitud de fotos de un detenido.

| Columna | Descripción |
|---------|-------------|
| `id` | uuid PK |
| `nombre_detenido` | Nombre del detenido |
| `folio` | Folio del reporte |
| `tipo_evento` | D1 / Flagrancia / Detenido / Otros |
| `delitos` | Texto libre |
| `falta_admin` | Texto libre |
| `modus_operandi` | Texto libre |
| `solicitado_por` | FK → users (Monitorista) |
| `creado_en` | timestamp |
| `completado_en` | timestamp |

### `solicitud_fotos` (nueva)
Cada fila representa **un tipo de foto** dentro de una solicitud. Una solicitud tiene **3 filas** (frontal, derecho, izquierdo).

| Columna | Descripción |
|---------|-------------|
| `id` | uuid PK |
| `solicitud_id` | FK → solicitudes_detenido |
| `tipo_foto` | `'frontal'` \| `'derecho'` \| `'izquierdo'` |
| `enviado_a` | `'FISCALIA'` \| `'JUZGADO_CIVICO'` \| `'AMBOS'` (null si pendiente) |
| `estado` | `'pendiente'` \| `'enviado'` \| `'rechazado'` \| `'completado'` \| `'cancelado'` |

**Constraint:** `UNIQUE (solicitud_id, tipo_foto)` — cada tipo de foto aparece una sola vez por solicitud.

### `evidencias_detenido`
Fotos subidas por Fiscalía/Juzgado. Relación 1:N con `solicitud_fotos` (vía `solicitud_id` + `tipo_foto`).

### `monitorista_historial`
Registro de cada acción (creación, envío de foto, rechazo, completado).

### Destinos (catálogo)

Los destinos se cargan dinámicamente desde `cat_dependencias WHERE tipo = 'externa' AND clave IN ('FISCALIA','JUZGADO_CIVICO')`.

| Clave | Nombre |
|-------|--------|
| `FISCALIA` | Fiscalía General del Estado |
| `JUZGADO_CIVICO` | Juzgado Cívico |
| `AMBOS` | Opción virtual: envía a ambos, el primero que responda gana |

---

## Máquina de Estados (por foto)

```
           ┌───────────┐
           │ PENDIENTE │ ← Se crea automáticamente al crear la solicitud
           └─────┬─────┘
                 │ Monitorista envía (individual o batch)
                 ▼
          ┌──────────────┐
          │   ENVIADO     │
          │ enviado_a:    │
          │ FISCALIA /    │
          │ JUZGADO /     │
          │ AMBOS         │
          └───┬────┬─────┘
              │    │
  ┌───────────┘    └─────────────┐
  ▼                              ▼
┌──────────────┐         ┌──────────────┐
│  RECHAZADO   │         │  COMPLETADO  │
│ (no tienen   │         │ (subieron    │
│  las fotos)  │         │  la foto)    │
└──────┬───────┘         └──────────────┘
       │ Monitorista re-envía
       │ (puede cambiar destino)
       └──────────→ ENVIADO
```

Cada foto es **independiente**: se puede enviar una a Fiscalía, otra a Juzgado, y otra a ambos al mismo tiempo.

---

## Formas de envío

### 1. Individual
Cada foto tiene su propio selector de destino y botón **ENVIAR** / **REENVIAR**. Ideal para:

- Enviar diferentes fotos a diferentes destinos
- Re-enviar una foto rechazada a otro destino
- Re-enviar una foto sin afectar las demás

### 2. Batch (Todas las pendientes)
Al inicio de la sección "Solicitud de Fotos" aparece un recuadro verde que permite seleccionar un destino y enviar **todas las fotos pendientes** de una sola vez.

- Solo actúa sobre fotos en estado `pendiente`
- Las ya enviadas no se modifican
- Las rechazadas no se incluyen (hay que re-enviarlas individualmente)

---

## Filtros por Rol

| Rol | Filtro SQL |
|-----|------------|
| **Monitorista — Pendientes** | `sf.estado IN ('pendiente','enviado','rechazado')` — solicitudes con al menos una foto no completada |
| **Monitorista — Completadas** | `NOT EXISTS (SELECT 1 FROM solicitud_fotos sf2 WHERE sf2.solicitud_id = sd.id AND sf2.estado IN ('pendiente','enviado','rechazado'))` — todas las fotos están completadas o canceladas |
| **Fiscalía** | `sf.estado = 'enviado' AND sf.enviado_a IN ('FISCALIA','AMBOS')` |
| **Juzgado** | `sf.estado = 'enviado' AND sf.enviado_a IN ('JUZGADO_CIVICO','AMBOS')` |

### Lógica de "primero que responde" en AMBOS

Cuando se envía una foto a `AMBOS`, tanto Fiscalía como Juzgado ven la foto en su bandeja. El **primero** que sube la foto cambia `estado = 'completado'`, y el otro automáticamente deja de verla porque su filtro exige `estado = 'enviado'`.

Si uno rechaza (`estado = 'rechazado'`), el otro ya no la ve, y el Monitorista debe re-enviarla manualmente al otro destino.

---

## Ejemplos de flujo

### Caso: Enviar todas las fotos a Fiscalía

```
Monitorista crea solicitud
  → 3 filas en solicitud_fotos (frontal, derecho, izquierdo) con estado='pendiente'
  → Usa batch: selecciona Fiscalía, presiona ENVIAR 3 FOTOS
  → Las 3 cambian a estado='enviado', enviado_a='FISCALIA'
  → Fiscalía ve las 3, sube las fotos
  → Las 3 cambian a estado='completado'
```

### Caso: Enviar cada foto a un destino distinto

```
Monitorista crea solicitud
  → Frontal: enviar a Fiscalía
  → Derecho: enviar a Juzgado
  → Izquierdo: enviar a Ambos

Juzgado responde primero (Derecho):
  → Derecho → completado
  → El batch de Ambos hace que Izquierdo espere al primero

Fiscalía responde (Frontal e Izquierdo gana Ambos):
  → Frontal → completado
  → Izquierdo → completado (Fiscalía ganó la carrera vs Juzgado)
```

### Caso: Rechazo y re-envío

```
Monitorista envía Frontal a Fiscalía
  → Fiscalía rechaza → estado='rechazado'
  → Monitorista cambia destino a Juzgado y re-envía (individual)
  → estado='enviado', enviado_a='JUZGADO_CIVICO'
  → Juzgado sube la foto → completado
```

---

## API Endpoints

| Método | Ruta | Propósito |
|--------|------|-----------|
| POST | `/api/monitorista/detenidos` | Crear solicitud + 3 fotos |
| GET | `/api/monitorista/detenidos` | Listar todas |
| GET | `/api/monitorista/detenidos/{id}` | Detalle + fotos |
| POST | `/api/monitorista/detenidos/{id}/enviar-foto` | Enviar una foto a un destino |
| POST | `/api/monitorista/detenidos/{id}/rechazar` | Rechazar foto (para Fiscalía/Juzgado) |

---

## Expediente Digital (Storage de archivos)

### ¿Qué es?

El **Expediente Digital** es un servicio REST externo que almacena todos los documentos (fotos, PDFs, etc.) del municipio. Corre en un servidor Windows en `sanjuandelrio.sytes.net:3044`.

### Conexión — Guest Token

Para subir o ver archivos, primero se obtiene un **token de invitado**:

```
POST /api/auth/guest-token
Body: { "codigo_invitacion": "INV-2026-001", "nombre_invitado": "Monitorista X" }
Response: { token: "eyJ...", expires_in: "8h" }
```

El token se genera **server-side** y se cachea en memoria (se renueva 5 min antes de expirar). No expone credenciales al cliente.

### Subida de archivos

```
POST /api/documents/upload-and-create
  Headers: Authorization: Bearer {guest_token}
  Body: multipart/form-data (file)
  Query: id_usuario_general=SSPM_SISTEMA&tipo_documento=EVIDENCIA_{TIPO}&folio={folio}&tipo_tramite=EVIDENCIA_MONITORISTA
  Response: { documento: { url_archivo: "/documentos_generales/SSPM_SISTEMA/..." } }
```

El archivo se guarda en el servidor Windows y se devuelve una **URL relativa**. El código la completa con el host del Expediente Digital.

### Visualización de documentos

Para VER un archivo (foto, PDF), se necesita el mismo guest token en el header:

```
GET /documentos_generales/SSPM_SISTEMA/...
  Headers: Authorization: Bearer {guest_token}
```

Como el navegador no puede enviar ese header directo, usamos un **proxy interno**:

```
GET /api/expediente/proxy?url={url_del_documento}
```

El proxy obtiene el token, descarga el archivo del Expediente Digital y lo devuelve con el Content-Type correcto. El navegador lo renderiza sin necesidad de token.

### Código compartido (`lib/expediente/client.ts`)

| Función | Descripción |
|---------|-------------|
| `obtenerGuestToken(nombre)` | Obtiene y cachea el token de invitado |
| `subirArchivoExpediente(token, archivo, folio, tipoDoc)` | Sube archivo al Expediente Digital |
| `limpiarCacheToken()` | Limpia el caché del token |

Este módulo es **reutilizable** por cualquier otro módulo del sistema (monitorista, denuncias, detenidos, etc.).

### APIs compartidas (`app/api/expediente/`)

| Ruta | Propósito |
|------|-----------|
| `POST /api/expediente/subir` | Subir archivo (multipart) — cualquier módulo |
| `GET /api/expediente/proxy` | Proxy de visualización — cualquier módulo |

---

## Flujo de Subida de Evidencias

### ¿Quién sube y a dónde?

El Monitorista **solicita** las fotos, pero **no las sube**. Quien sube es el rol destino (Fiscalía/Juzgado) desde su propio módulo.

```
Monitorista crea solicitud
  → INSERT solicitudes_detenido
  → INSERT solicitud_fotos x3 (frontal, derecho, izquierdo)

Monitorista envía (individual o batch)
  → UPDATE solicitud_fotos SET estado='enviado', enviado_a='FISCALIA'

Fiscalía/Juzgado recibe en su bandeja
  → Toma la foto (frontal/derecho/izquierdo)
  → Llama POST /api/expediente/subir
    → Obtiene guest token
    → Sube al Expediente Digital (upload-and-create)
    → Recibe URL del archivo
  → INSERT evidencias_detenido (solicitud_id, tipo_foto, url_archivo, nombre_archivo)
  → UPDATE solicitud_fotos SET estado='completado'

Monitorista ve el resultado
  → Card de la foto cambia a COMPLETADO + link para ver el archivo via proxy
```

### Diagrama de flujo

```
[Monitorista]                  [Fiscalía/Juzgado]            [Expediente Digital]
     │                               │                             │
     │── crea solicitud ──→ INSERT                                    │
     │── envía foto ──────→ UPDATE                                    │
     │                               │                               │
     │                               │── recibe en bandeja            │
     │                               │── POST /api/expediente/subir   │
     │                               │       │                       │
     │                               │       │── getGuestToken ──────→│
     │                               │       │── upload-and-create ──→│
     │                               │       │       │               │
     │                               │       │← URL del archivo ─────│
     │                               │       │                       │
     │                               │── INSERT evidencias_detenido  │
     │                               │── UPDATE estado='completado'  │
     │                               │                               │
     │← ve foto COMPLETADA                                            │
     │── GET /api/expediente/proxy?url=... ────→ proxy                │
     │       │                               │                       │
     │       │── fetch con token ────────────→│── descarga archivo ──→│
     │       │← blob ─────────────────────────│                       │
     │← renderiza en navegador                                        │
```

### ¿Dónde queda registrado?

| Dato | Tabla |
|------|-------|
| URL del archivo en Expediente Digital | `evidencias_detenido.url_archivo` |
| Tipo de foto (frontal/derecho/izquierdo) | `evidencias_detenido.tipo_foto` |
| Quién subió | `evidencias_detenido.subido_por` |
| Estado de la solicitud por foto | `solicitud_fotos.estado` |
| Destino al que se envió | `solicitud_fotos.enviado_a` |
| Actividad del monitorista | `monitorista_historial` |

### Límites del Expediente Digital

- **Tamaño máximo**: ~25MB por archivo (límite del servidor Windows)
- **Formatos aceptados**: cualquier extensión, pero el sistema solo permite fotos (JPG/PNG) y PDFs
- **Videos**: ❌ No soportados (el servidor rechaza archivos >~25MB)
- **Tokens**: expiran cada 8 horas, se renuevan automáticamente con 5 min de anticipación
