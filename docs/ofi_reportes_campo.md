# `ofi_reportes_campo`

Tabla independiente para reportes generados por el rol **Oficial de Campo**. Sin FK a catálogos ni a otras tablas — toda la información se captura en texto y JSONB.

## Estructura

| Columna | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `ofi_folio_cad` | `VARCHAR(60)` | `'S/C'` | Folio CAD del incidente |
| `ofi_nombre_reportante` | `VARCHAR(300)` | `NULL` | Nombre del ciudadano que reporta |
| `ofi_anonimo` | `BOOLEAN` | `FALSE` | Si el reportante es anónimo |
| `ofi_tipo_incidente` | `VARCHAR(100)` | `NULL` | Tipo de incidente (texto libre) |
| `ofi_tipo_emergencia` | `VARCHAR(100)` | `NULL` | Tipo de emergencia (texto libre) |
| `ofi_prioridad` | `VARCHAR(50)` | `NULL` | Prioridad: Alta / Media / Baja |
| `ofi_descripcion` | `TEXT` | `NULL` | Descripción breve del incidente |
| `ofi_contenido_reporte` | `TEXT` | `NULL` | Relatoría extensa de los hechos |
| `ofi_calle` | `VARCHAR(200)` | `NULL` | Calle de la ubicación (del mapa) |
| `ofi_colonia` | `VARCHAR(150)` | `NULL` | Colonia (del mapa) |
| `ofi_latitud` | `DECIMAL(10,7)` | `NULL` | Latitud del punto seleccionado |
| `ofi_longitud` | `DECIMAL(10,7)` | `NULL` | Longitud del punto seleccionado |
| `ofi_datos_pn` | `TEXT` | `NULL` | Datos positivos o negativos |
| `ofi_acciones` | `TEXT` | `NULL` | Acciones realizadas por la unidad |
| `ofi_hay_detencion` | `BOOLEAN` | `FALSE` | Si hubo detención |
| `ofi_detenidos` | `JSONB` | `'[]'` | Array: `[{"nombre":"..."}]` |
| `ofi_autoridad_recibe` | `VARCHAR(50)` | `NULL` | `FISCALIA` o `JUZGADO CIVICO` |
| `ofi_monto_robo` | `NUMERIC(12,2)` | `NULL` | Monto de lo robado |
| `ofi_objetos_recuperados` | `TEXT` | `NULL` | Descripción de objetos asegurados |
| `ofi_hay_vehiculo` | `BOOLEAN` | `FALSE` | Si se aseguró vehículo |
| `ofi_vehiculos` | `JSONB` | `'[]'` | Array: `[{"tipo":"...","placas":"...","serie":"...","color":"...","destino":"..."}]` |
| `ofi_hay_cateo` | `BOOLEAN` | `FALSE` | Si hubo cateo |
| `ofi_cateo` | `JSONB` | `NULL` | Objeto: `{"calle":"...","colonia":"...","numero":"...","lat":...,"lng":...}` |
| `ofi_resultado_cateo` | `TEXT` | `NULL` | Resultado del cateo |
| `ofi_oficial_nombre` | `VARCHAR(200)` | `NULL` | Nombre del oficial que reporta |
| `ofi_oficial_id` | `UUID` | `NULL` | ID del oficial (sin FK) |
| `ofi_estatus` | `VARCHAR(30)` | `'registrado'` | `registrado` → `en_fiscalia` → `cerrado` |
| `created_at` | `TIMESTAMPTZ` | `NOW()` | Fecha de creación |
| `updated_at` | `TIMESTAMPTZ` | `NOW()` | Fecha de actualización |

## Columnas JSONB

### `ofi_detenidos`
```json
[
  { "nombre": "Juan Pérez" },
  { "nombre": "María López" }
]
```

### `ofi_vehiculos`
```json
[
  {
    "tipo": "automovil",
    "placas": "ABC-123",
    "serie": "8AGN123456",
    "color": "Rojo",
    "destino": "CORRALON MW"
  }
]
```

### `ofi_cateo`
```json
{
  "calle": "Av. Juárez",
  "colonia": "Centro",
  "numero": "123",
  "lat": 20.3892,
  "lng": -99.9968
}
```

## Dónde se usa

| Archivo | Propósito |
|---|---|
| `app/oficial/nuevo/page.tsx` | Página del formulario (server component, carga catálogos) |
| `components/oficial/FormularioRecorrido.tsx` | Formulario stepper que captura los datos |
| `components/oficial/MapaUbicacion.tsx` | Componente de mapa que provee coordenadas y dirección |
| *(pendiente)* `lib/incidentes/actions.ts` | Server action que inserta el reporte en `ofi_reportes_campo` |

## Estatus

- **`registrado`** — Reporte creado por el oficial, pendiente de revisión
- **`en_fiscalia`** — Turnado a Fiscalía / Juzgado
- **`cerrado`** — Proceso concluido
