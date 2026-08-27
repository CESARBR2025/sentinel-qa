# Etapa 2 — Esquema de persistencia

Independiente de las etapas 0 y 1.

## Por qué 3 tablas y no 20

Formato N usa una tabla SQL por sección (`formato_n_eventos`, `formato_n_fge`,
`formato_n_rnd`…). Con 8 secciones funciona. Con las 34 tablas de NOVEDADES
—agrupadas en 11 pasos, pero con matrices de hasta 29 contadores y listados de
hasta 11 columnas— ese patrón produciría ~20 tablas casi todas de un solo uso.

Se usan 3 tablas genéricas por forma de dato, no por sección.

## Esquema

```sql
-- Semáforo del stepper. Clon estructural de formato_n_estatus_dia.
CREATE TABLE novedades_estatus_dia (
  fecha                     date PRIMARY KEY,
  periodo_confirmado        boolean NOT NULL DEFAULT false,
  resumen_confirmado        boolean NOT NULL DEFAULT false,
  subsecretaria_confirmado  boolean NOT NULL DEFAULT false,
  analisis_confirmado       boolean NOT NULL DEFAULT false,
  c4_confirmado             boolean NOT NULL DEFAULT false,
  transito_confirmado       boolean NOT NULL DEFAULT false,
  prevencion_confirmado     boolean NOT NULL DEFAULT false,
  delictivos_confirmado     boolean NOT NULL DEFAULT false,
  operativos_confirmado     boolean NOT NULL DEFAULT false,
  resumen_nov_confirmado    boolean NOT NULL DEFAULT false,
  fuerza_confirmado         boolean NOT NULL DEFAULT false,
  completado_en             timestamp,
  actualizado_por           text REFERENCES users(id),
  actualizado_en            timestamp NOT NULL DEFAULT now()
);

-- Matrices de contadores: un renglón por (fecha, sección).
CREATE TABLE novedades_seccion (
  fecha           date NOT NULL,
  seccion         text NOT NULL,
  datos           jsonb NOT NULL DEFAULT '{}'::jsonb,
  capturado_por   text REFERENCES users(id),
  actualizado_en  timestamp NOT NULL DEFAULT now(),
  PRIMARY KEY (fecha, seccion)
);

-- Listados capturados: N renglones por (fecha, sección).
CREATE TABLE novedades_filas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha           date NOT NULL,
  seccion         text NOT NULL,
  orden           integer NOT NULL DEFAULT 0,
  datos           jsonb NOT NULL DEFAULT '{}'::jsonb,
  capturado_por   text REFERENCES users(id),
  creado_en       timestamp NOT NULL DEFAULT now(),
  actualizado_en  timestamp NOT NULL DEFAULT now()
);

CREATE INDEX idx_novedades_filas_fecha_seccion
  ON novedades_filas (fecha, seccion, orden);
```

## Regla de contenido del jsonb

El `jsonb` es contenedor de la sección, **no permiso para datos sueltos**. Todo
campo que corresponda a un catálogo guarda el **id del catálogo real**:

| Campo en el jsonb | Guarda | Contra |
|---|---|---|
| `sector_id` | integer | `cat_sectores` |
| `delito_id` | integer | `cat_clasificacion_delitos` |
| `grua_id` | uuid | `via.v2_gruas` |
| `concepto_id` | integer | `cat_estado_fuerza_conceptos` |
| `tipo_incidente_id` | integer | `cat_tipos_incidente` |
| `oficial_id` | uuid | `ofi_oficiales` |

Los nombres para impresión se resuelven con JOIN al momento de generar el
documento. **Nunca se guarda el nombre desnormalizado** — si Administración
renombra un sector, el parte histórico sigue resolviendo bien.

La forma de cada `datos` se tipa en `lib/novedades/types.ts` (Etapa 3), un tipo
por sección. El jsonb es el medio de almacenamiento; el contrato es TypeScript.

## Claves de sección

Las 11 del stepper: `periodo`, `resumen`, `subsecretaria`, `analisis`, `c4`,
`transito`, `prevencion`, `delictivos`, `operativos`, `resumen_nov`, `fuerza`.

Para los listados, la clave lleva sufijo de tabla —
`transito.hechos`, `transito.notificados`, `transito.despejes`,
`prevencion.convenios`, `prevencion.platicas`, `prevencion.jornadas`,
`operativos.supervision`, `delictivos.veh_robados`, etc.— para que
`novedades_filas` no mezcle listados de una misma sección.

## Retiro de `novedades_captura`

La tabla `novedades_captura (id, fecha, capturado_por, datos jsonb, creado_en)`
ya existe en BD:

- **0 filas**
- Sin referencia en código salvo `lib/admin/sistema-constants.ts:38`, donde solo
  aparece dentro de una lista de nombres de tabla.

Es un intento previo abandonado. Se elimina la tabla y se quita el nombre de
`sistema-constants.ts`. Verificar el conteo en 0 antes de hacer `DROP`.

Va junto con las otras dos bajas confirmadas de la [Etapa 10](ETAPA-10.md)
(`ofi_fichas_inteligencia`, `solicitudes_detenido`) — mismo `DROP`, mismo
respaldo previo.

## Verificación

1. Confirmar `SELECT count(*) FROM novedades_captura` = 0 antes del `DROP`.
2. `npm run db:schema` → actualizar `boveda/📦 Datos/Esquema BD.md`.
3. `npx tsc --noEmit` (por el cambio en `sistema-constants.ts`).
