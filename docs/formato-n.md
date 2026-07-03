# Formato N a Coordinación

7 reportes **independientes** que se capturan en el Panel de Gestión (`/reportes`), no en monitorista. Cada uno tiene su propia tabla, su propia fecha de captura y su propio mini-CRUD (lista / nuevo / editar) — no dependen de un reporte "padre" compartido.

## Acceso

- Entrada: tile "Reportes" en `/dashboard` → `/reportes` (Panel de Gestión) → tile "Envío de Formatos" → `/envio-de-formatos` (hub intermedio con los 7 tiles) → cada CRUD.
- Cualquier usuario autenticado puede acceder (mismo modelo que el resto de tiles en `/reportes`: sesión requerida, sin gate de rol adicional).
- Rutas de los CRUDs: `/formato-n-eventos`, `/formato-n-fge`, `/formato-n-fgr`, `/formato-n-rnd`, `/formato-n-medios-alternativos`, `/formato-n-atencion-victimas`, `/formato-n-armas-aseguradas`.

## Los 7 reportes

### 1. Eventos Informados — `formato_n_eventos` (bitácora)

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | PK |
| `fecha` | `DATE` | Fecha del evento |
| `hora` | `TIME` | Hora del evento |
| `region` | `VARCHAR(120)` | Región |
| `evento` | `VARCHAR(200)` | Descripción corta del evento |
| `ubicacion` | `VARCHAR(300)` | Ubicación |
| `descripcion` | `TEXT` | Descripción detallada |
| `atenciones` | `VARCHAR(300)` | Atenciones brindadas |
| `capturado_por` | `TEXT` | Usuario que capturó |
| `creado_en` | `TIMESTAMPTZ` | Fecha de creación del registro |

### 2. Eventos Informados por la FGE — `formato_n_fge` (agregado, uno por fecha+periodo)

### 3. Eventos Informados por la FGR — `formato_n_fgr` (agregado, idéntico a FGE)

| Columna | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `fecha` | `DATE` | — | Fecha del reporte |
| `periodo` | `VARCHAR(10)` | — | `diario` \| `semanal` \| `mensual` |
| `capturado_por` | `TEXT` | — | Usuario que capturó |
| `carpetas_iniciadas` | `INTEGER` | `0` | Carpetas de investigación iniciadas |
| `numero_cateos` | `INTEGER` | `0` | Número de cateos |
| `vehiculos_asegurados` | `INTEGER` | `0` | Vehículos asegurados |
| `domicilios_cateados` | `INTEGER` | `0` | Domicilios cateados |
| `personas_aseguradas` | `INTEGER` | `0` | Personas aseguradas |
| `aprehensiones` | `INTEGER` | `0` | Aprehensiones |
| `audiencias_iniciales` | `INTEGER` | `0` | Audiencias iniciales |
| `abreviados` | `INTEGER` | `0` | Procedimientos abreviados |
| `audiencias_intermedias` | `INTEGER` | `0` | Audiencias intermedias |
| `creado_en` | `TIMESTAMPTZ` | `now()` | Fecha de creación |

`FGE` = Fiscalía General del Estado. `FGR` = Fiscalía General de la República. Restricción `UNIQUE (fecha, periodo)` en ambas — 409 al intentar duplicar.

### 4. Registro Nacional de Detenciones — `formato_n_rnd` (bitácora)

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | PK |
| `fecha` | `DATE` | Fecha de la inscripción |
| `hora_detencion` | `TIME` | Hora de la detención |
| `delito` | `VARCHAR(200)` | Delito |
| `autoridad_que_realizo_detencion` | `VARCHAR(200)` | Autoridad que realizó la detención |
| `folio` | `VARCHAR(80)` | Folio |
| `capturado_por` | `TEXT` | Usuario que capturó |
| `creado_en` | `TIMESTAMPTZ` | Fecha de creación |

### 5. Medios Alternativos de Solución de Conflictos — `formato_n_medios_alternativos` (agregado)

| Columna | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `fecha` | `DATE` | — | Fecha del reporte |
| `periodo` | `VARCHAR(10)` | — | `diario` \| `semanal` \| `mensual` |
| `capturado_por` | `TEXT` | — | Usuario que capturó |
| `asuntos_canalizados_por_fiscalia` | `INTEGER` | `0` | Asuntos canalizados por Fiscalía |
| `acuerdos` | `INTEGER` | `0` | Acuerdos alcanzados |
| `monto_reparacion_danos` | `NUMERIC(14,2)` | `0` | Monto total de reparación de daños |
| `creado_en` | `TIMESTAMPTZ` | `now()` | Fecha de creación |

`UNIQUE (fecha, periodo)`.

### 6. Atención a Víctimas — `formato_n_atencion_victimas` (agregado)

| Columna | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `fecha` | `DATE` | — | Fecha del reporte |
| `periodo` | `VARCHAR(10)` | — | `diario` \| `semanal` \| `mensual` |
| `capturado_por` | `TEXT` | — | Usuario que capturó |
| `numero_atenciones` | `INTEGER` | `0` | Número total de atenciones |
| `atenciones_medicas` | `INTEGER` | `0` | Atenciones médicas |
| `atenciones_psicologicas` | `INTEGER` | `0` | Atenciones psicológicas |
| `asesorias_juridicas` | `INTEGER` | `0` | Asesorías jurídicas |
| `observaciones` | `TEXT` | `NULL` | Observaciones |
| `creado_en` | `TIMESTAMPTZ` | `now()` | Fecha de creación |

`UNIQUE (fecha, periodo)`.

### 7. Armas de Fuego Aseguradas — `formato_n_armas_aseguradas` (bitácora)

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | PK |
| `fecha` | `DATE` | Fecha del aseguramiento |
| `carpeta_investigacion` | `VARCHAR(120)` | Carpeta de investigación asociada |
| `tipo_arma` | `VARCHAR(120)` | Tipo de arma |
| `matricula` | `VARCHAR(80)` | Matrícula del arma |
| `calibre` | `VARCHAR(40)` | Calibre |
| `observaciones` | `TEXT` | Observaciones |
| `capturado_por` | `TEXT` | Usuario que capturó |
| `creado_en` | `TIMESTAMPTZ` | Fecha de creación |

## Endpoints API

Cada reporte tiene su propio par de rutas bajo `/api/reportes/formato-n-<slug>`:

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/reportes/formato-n-<slug>[?periodo=]` | Lista (filtro por periodo solo en FGE/FGR/medios-alternativos/atención-víctimas) |
| `POST` | `/api/reportes/formato-n-<slug>` | Crea. 409 si ya existe fecha+periodo (solo en los 4 "agregado") |
| `GET` | `/api/reportes/formato-n-<slug>/[id]` | Detalle |
| `PATCH` | `/api/reportes/formato-n-<slug>/[id]` | Actualiza |

`<slug>` ∈ `eventos`, `fge`, `fgr`, `rnd`, `medios-alternativos`, `atencion-victimas`, `armas-aseguradas`.

## Páginas

Cada reporte sigue el mismo patrón bajo `/formato-n-<slug>`: `page.tsx` (lista), `nuevo/page.tsx` (captura), `[id]/page.tsx` (edición). Estilos compartidos en `components/reportes/form-styles.ts`.

## Envío a Coordinación

Por ahora "envío" = guardar el reporte (queda listado y disponible en `/reportes`). No hay export a PDF/PPT ni correo automático todavía.
