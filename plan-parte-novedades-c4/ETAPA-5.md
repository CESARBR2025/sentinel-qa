# Etapa 5 — Cálculo grupo B: secciones con sector

Requiere etapas 0 y 3. Independiente de las etapas 4 y 6.

Estas tres secciones sí dependen de `sectorDeHecho()` (Etapa 0.3). Todo lo que
no resuelva sector cae en "sin asignar" y se muestra en el stepper para
distribución manual — **nunca se reparte solo**.

**Columnas de sector: ORIENTE | PONIENTE | CENTRO | TOTALES.** El `.docx`
original solo trae ORIENTE y PONIENTE; CENTRO se agrega por decisión del
usuario (ver README y Etapa 0.3). Aplica a T0, T2 y T7.

Archivo: `lib/novedades/calculo/grupo-b.ts`

---

## 5.1 Paso 2 — Resumen general (T0, T1, T2)

### T0 — Aseguramientos (`CONCEPTO × ORIENTE | PONIENTE | CENTRO | TOTALES`)

| Concepto | Fuente |
|---|---|
| Puesta a disposición de la FGR | `ofi_reportes_campo` WHERE `ofi_autoridad_recibe` = FGR |
| Puesta a disposición de la FGE | idem WHERE = FGE |
| Carpetas iniciadas en Fiscalía | `ofi_reporte_denuncia` WHERE `num_carpeta_investigacion IS NOT NULL` |
| Remisiones a Juzgado Cívico | `ofi_reporte_denuncia` WHERE `folio_remision IS NOT NULL` |
| Apoyo a Diligencias de Actuarios | `ofi_reportes_campo.ofi_apoyo_actuarios = true` |

Cada fila se agrupa por `sectorDeHecho()`. La columna TOTALES es la suma de
ORIENTE + PONIENTE + CENTRO + sin asignar, para que el total del documento nunca
mienta aunque falte asignar sector. Las columnas se generan iterando
`cat_sectores` activos, no como constantes — si mañana se da de alta un cuarto
sector, la tabla crece sola.

**Aprovechar lo ya corregido:** el cálculo de FGE/FGR ya existe y ya fue
depurado en `plan-formato-n-fge-fgr/` —
`calcularConteosPorFecha` en `lib/reportes/formato-n-fge-service.ts` y su par de
FGR. Reusar esa lógica de clasificación en vez de escribir una tercera
implementación; el diagnóstico de aquel plan fue precisamente que existían dos
implementaciones divergentes del mismo conteo.

### T1 — Infracciones (`SECTOR I | SECTOR II | TRÁNSITO | TÁCTICO | ATENCIÓN A VÍCTIMAS | TOTAL`)

Ojo: aquí las columnas **no** son ORIENTE/PONIENTE sino agrupaciones operativas
distintas. `SECTOR I` / `SECTOR II` son los sectores de patrullaje; `TRÁNSITO`,
`TÁCTICO` y `ATENCIÓN A VÍCTIMAS` son adscripciones.

```
FROM via.v2_infracciones i
JOIN ofi_oficiales o ON o.id = i.oficial_id
```

- SECTOR I / SECTOR II → `o.sector_id` → `cat_sectores`
- TRÁNSITO → `o.departamento_id` = `DEP_TRANSITO` (`via.v2_departamentos`)
- TÁCTICO / ATENCIÓN A VÍCTIMAS → **no existe adscripción para estos dos** en
  `via.v2_departamentos` (solo tiene Infracciones, Liberaciones, Tránsito).
  Quedan en captura manual hasta que Administración los dé de alta. Documentar
  el hueco en el stepper con el motivo, no con un cero silencioso.

### T2 — Vehículos a corralón por infracción y hechos de tránsito

Misma agrupación de columnas que T1, filtrando
`via.v2_infracciones WHERE grua_id IS NOT NULL`.

---

## 5.2 Paso 6 — Dirección de Tránsito (T7 a T13)

### T7 — Matriz de 19 conceptos × ORIENTE | PONIENTE | CENTRO | TOTALES

Es la tabla individual más grande del documento. Se llena por partes:

**Autollenables:**

| Concepto | Fuente |
|---|---|
| Hechos de Tránsito | `incidentes` JOIN `cat_tipos_incidente` WHERE `clasificacion_cad = 'TRANSITO'`, o `tipo_emergencia_id = 4` (ACCIDENTE VIAL) |
| Personas a Disposición de Fiscalía | T0 filtrado a adscripción Tránsito |
| Personas a disposición a Juzgado Cívico | idem |
| Vehículos remitidos al corralón por Hecho de Tránsito | `v2_infracciones` con grúa + motivo hecho de tránsito |
| Vehículos Remitidos al corralón Por Infracción | `v2_infracciones` con grúa + motivo infracción |
| Infracciones por Hecho de Tránsito | `v2_infracciones` con `motivo_retencion` de hecho |
| Infracciones por Infringir el reglamento | resto de `v2_infracciones` |

**Sin fuente — captura manual** (10 de los 19): Actas Convenio, Daños
Materiales, Reportes de Accidente, Personas Lesionadas, Personas Fallecidas,
Vehículos Participantes, Vehículos PD Fiscalía, Vehículos PD Juzgado Cívico,
Hechos de tránsito no localizados, Acuerdo entre particulares, Orientaciones,
Otros.

La tabla cierra con una celda de **Observaciones** (default `SIN NOVEDAD`).

### T8 — Hechos de tránsito, detalle

`HECHOS | HORA | LUGAR | VEHÍCULO | CONDUCTOR(ES)` — sin fuente estructurada.
Captura manual en `novedades_filas` con `seccion = 'transito.hechos'`.

Se prellena la lista con los incidentes de tránsito de la ventana (folio, hora,
lugar) para que el capturista solo complete vehículo y conductor. No es
autollenado completo, pero elimina la retranscripción.

### T9 — Vehículos a corralón por infracción

`N° | FOLIO/MOTIVO | HORA | FECHA | LUGAR | VEHÍCULO | GRÚA` — **autollenable
completo**:

```
FROM via.v2_infracciones i
JOIN via.v2_gruas g ON g.id = i.grua_id
WHERE i.grua_id IS NOT NULL AND <ventana sobre i.created_at>
```

VEHÍCULO se compone de `marca + modelo + color + placa`.

### T10 — Vehículos notificados / T11 — Operativos y despejes

Sin fuente. Captura manual: `transito.notificados`, `transito.despejes`.

### T12 / T13

Reuso directo de los servicios de la Etapa 4.2 con filtro de adscripción
Tránsito. No se reimplementan.

---

## 5.3 Paso 8 — Hechos delictivos (T25 a T28)

### T25 — Delitos del fuero común y federal

4 bloques (`DELITOS PATRIMONIALES CU`, `CONTRA LA SOCIEDAD`, `CONTRA LAS
PERSONAS`, `OTROS`), cada uno con `TIPO | DELITOS | DETENIDOS` y su fila de
Totales.

```
FROM ofi_reporte_denuncia d
LEFT JOIN cat_clasificacion_delitos c ON c.delito = d.delito
GROUP BY c.familia, d.delito
```

- DELITOS = conteo de denuncias por tipo
- DETENIDOS = conteo en `iph_detenidos` por el mismo delito en la ventana

Los delitos sin fila en `cat_clasificacion_delitos` caen en `OTROS` **y se
listan aparte en el stepper** para que el capturista los clasifique; esa
clasificación se persiste en el catálogo (Etapa 0.4). Así el catálogo se
completa solo con el uso.

Los totales del formato vienen con formato `00` (dos dígitos) — usar el helper
`toN()` de Etapa 1.

### T26 — Denuncias digitales

`N° | TIPO DE DELITO | UBICACIÓN | NOMBRE DEL DENUNCIANTE | C.R.P. | CUESTIONARIO ÚNICO`

Autollenable completo desde `ofi_reporte_denuncia`: `delito`, `lugar_hecho` +
`colonia_hecho`, `crp`, `folio_cu`. Filtro `se_genero_d1 = true`.

Es exactamente el dato del módulo `/d1` que ya existe — reusar
`lib/reportes-operativos/` y el repositorio de D1 antes de escribir SQL nuevo.

### T27 / T28 — Vehículos recuperados y robados

11 columnas cada una (`MARCA | TIPO | MODELO | COLOR | PLACAS | ENTIDAD | SERIE
| UBICACIÓN | CARPETA` / `CUESTIONARIO ÚNICO`).

Datos dispersos en tres lugares:
- `ofi_reportes_campo.ofi_vehiculos` (jsonb, array)
- `formato_incidencia_complemento` (`marca`, `submarca`, `tipo_vehiculo`,
  `color`, `placas`, `estado_vehiculo`, `niv`, `motor`, `modelo`)
- `iph_detenidos.*_vehiculo`

Se unifican en un servicio único con prioridad
`formato_incidencia_complemento > iph_detenidos > ofi_vehiculos` (de más
estructurado a menos). Lo que falte, captura manual sobre la fila prellenada.

`incidentes_camara.vehiculos_recuperados` da el **conteo** de recuperados por
cámara, pero no el detalle — sirve como cifra de control para avisar al
capturista si el listado no cuadra con el conteo.

---

## Verificación

1. `npx tsc --noEmit`
2. Query de control por cada tabla contra la BD real en una fecha con datos.
3. Verificar que ORIENTE + PONIENTE + CENTRO + sin asignar = TOTAL en T0, T2 y T7.
4. Verificar que un delito nuevo no clasificado aparece en OTROS y en la lista
   de pendientes de clasificar, sin romper el conteo.
