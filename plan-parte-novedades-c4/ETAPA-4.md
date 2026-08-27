# Etapa 4 — Cálculo grupo A: autollenado puro

Requiere Etapa 3. Independiente de las etapas 5 y 6.

Las tres secciones que se llenan **completas** desde la BD, sin depender del
sector ni de captura manual. Son la prueba de que la estrategia funciona, y las
que más tiempo le ahorran al C-4.

El paso 5 (C-4) queda **100% automático** una vez aplicado el fix de fecha del
turno nocturno (Etapa 0.6) — ver "Resolución de la ventana en cámaras" más
abajo.

Archivo: `lib/novedades/calculo/grupo-a.ts`

---

## 4.1 Paso 5 — C-4 (tabla T6 del documento)

### T6a — Línea 9-1-1

El catálogo `cat_tipos_emergencia` ya trae **exactamente** las columnas del
formato. Correspondencia verificada contra la BD real:

| Columna del documento | `cat_tipos_emergencia` |
|---|---|
| Llamadas Improcedentes | id 5 — IMPROCEDENTES |
| Médico | id 2 — MÉDICO |
| Protección Civil | id 8 — PROTECCIÓN CIVIL |
| Seguridad | id 1 — SEGURIDAD |
| Servicios Públicos | id 10 — SERVICIOS PÚBLICOS |
| Asistencia | id 11 — ASISTENCIA |
| Otros Servicios | id 12 — OTROS SERVICIOS |

```
Total de llamadas recibidas = COUNT(incidentes) WHERE canal='911' AND ventana
Por categoría              = GROUP BY tipo_emergencia_id
Llamadas canalizadas       = COUNT WHERE medio_canalizacion_id IS NOT NULL
```

Los tipos 3 (INCENDIO) y 4 (ACCIDENTE VIAL) no tienen columna propia en el
formato → suman a "Otros Servicios". Documentar esta agregación en el código,
porque no es obvia leyendo el documento.

`canal` solo tiene dos valores en BD: `'911'` y `'radio'`. Esta tabla es
exclusivamente `'911'`.

### T6b — C-4 cámaras

Mapeo 1:1 contra `incidentes_camara`, **sumando los turnos del día** (la tabla
tiene índice único en `(fecha, turno)`, así que hay hasta 3 filas por fecha):

| Concepto del documento | Columna |
|---|---|
| Personas vistas en cámaras y mandadas a revisar sin novedad | `personas_sin_novedad` |
| …resultando con antecedentes | `personas_con_antecedentes` |
| Vehículos vistos en cámaras y mandados a revisar sin novedad | `vehiculos_revisar` |
| Vehículos vistos en cámaras y checados en REPUVE | `vehiculos_repuve` |
| Persecuciones captadas a través de cámaras | `persecuciones` |
| Aseguramientos captados a través de cámaras | `asegurados_camara` |
| Vehículos recuperados a través de cámaras | `vehiculos_recuperados` |
| Incendios captados a través de cámaras | `incendios` |
| Hechos de tránsito captados a través de cámaras | `hechos_transito` |

### Resolución de la ventana en cámaras

`incidentes_camara.fecha` es `date`, no timestamp: es una captura **agregada por
turno**, no un evento. Es la única de las 34 tablas que no se filtra por rango de
timestamp. Con el fix de semántica de fecha (Etapa 0.6) la ventana se resuelve
sin ambigüedad.

Turnos, con su intervalo real sobre una fecha D:

| Turno | Intervalo |
|---|---|
| MATUTINO | D 07:00 → D 15:00 |
| VESPERTINO | D 15:00 → D 22:00 |
| NOCTURNO | D 22:00 → **D+1** 07:00 (cruza medianoche) |

El parte del día D cubre `[D-1 06:00, D 06:00)`. Cruzando ambos:

| Turno | ¿Entra en el parte de D? |
|---|---|
| MATUTINO de D-1 | sí, completo |
| VESPERTINO de D-1 | sí, completo |
| NOCTURNO de D-1 | sí (termina a las 07:00 de D, una hora después del corte) |
| MATUTINO de D | no, arranca 07:00 de D |

**Regla resultante — y es exacta:**

```
parte(D).camaras = SUM(incidentes_camara WHERE fecha = D - 1)
```

Los tres turnos capturados con `fecha = D-1`, sumados. Sin excepciones que
documentar y sin captura manual.

El desfase de una hora en los extremos (NOCTURNO de D-2 traslapa 06:00–07:00 de
D-1; NOCTURNO de D-1 traslapa 06:00–07:00 de D) **se cancela**: cada turno
pertenece a exactamente un parte, ninguno se cuenta dos veces ni se pierde. Es
el comportamiento correcto para un agregado por turno — el turno es la unidad
mínima de reporte del C-4, no se puede partir a la mitad.

**Depende enteramente de que `fecha` signifique la fecha de inicio del turno.**
Si el fix de la Etapa 0.6 no está aplicado, esta regla produce números mal —
silenciosamente. Dejarlo escrito como comentario en el servicio, y validar en la
carga: si aparece un registro NOCTURNO cuyo `creado_en` es de madrugada y su
`fecha` coincide con ese mismo día, avisar en el stepper en vez de sumarlo
callando.

La regla se implementa en `ventana.ts` como `fechaTurnosDelParte(fecha)`, no
hardcodeada en la query, para que quede en un solo lugar si el C-4 cambia
horarios de turno.

---

## 4.2 Paso 3 — Subsecretaría (T3, T4)

### T3 — Personas puestas a disposición de la Fiscalía (fuero común o federal)

Columnas: `N° | HORA | LUGAR DEL ASEGURAMIENTO | NOMBRE | FISCAL | MOTIVO | CI | RND`

```
FROM ofi_reportes_campo rc
JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
JOIN ofi_puesta_disposicion pd  ON pd.reporte_campo_id = rc.id
LEFT JOIN iph_detenidos ipd     ON ipd.reporte_denuncia_id = ...
```

| Columna doc | Origen |
|---|---|
| HORA | `ofi_puesta_disposicion.hora_puesta_disposicion` |
| LUGAR DEL ASEGURAMIENTO | `ofi_reportes_campo.ofi_calle` + `ofi_colonia` |
| NOMBRE | `ofi_detalles_asegurados` (nombre + ap. paterno + ap. materno) |
| FISCAL | `ofi_reportes_campo.ofi_autoridad_recibe` |
| MOTIVO | `ofi_reportes_campo.delito` |
| CI | `ofi_reportes_campo.expediente_ci` |
| RND | `iph_detenidos.rnd` |

Filtro: `ofi_puesta_disposicion.gestion_interna = false` o
`dependencia_externa` correspondiente a Fiscalía.

### T4 — Personas remitidas al Juzgado Cívico por faltas administrativas

Columnas: `N° | HORA | LUGAR | NOMBRE | MARCO LEGAL | OFICIAL | UNIDAD | SIJA | REMISIÓN | IPH | RND`

`ofi_reporte_denuncia` ya tiene los cuatro folios que esta tabla pide y que no
existen en ninguna otra parte del sistema: `folio_sija`, `folio_remision`,
`iph`, `marco_legal`.

| Columna doc | Origen |
|---|---|
| HORA | `ofi_reporte_denuncia.hora_reporte` |
| LUGAR | `lugar_hecho` + `colonia_hecho` |
| NOMBRE | `ofi_detalles_asegurados` vía `reporte_campo_id` |
| MARCO LEGAL | `marco_legal` |
| OFICIAL | `policia_a_cargo` (o `oficial_id` → `users`) |
| UNIDAD | `ofi_oficiales.patrulla_id` → `via.v2_patrullas.placa` |
| SIJA | `folio_sija` |
| REMISIÓN | `folio_remision` |
| IPH | `iph` |
| RND | `iph_detenidos.rnd` |

**T12 y T17 son la misma tabla T4 filtrada** por dirección (Tránsito y
Prevención respectivamente). El servicio se escribe **una vez** con parámetro de
filtro y se reusa en los pasos 6 y 7. Lo mismo T13/T16 respecto de T3.

---

## 4.3 Paso 11 — Estado de fuerza (T32)

Requiere la siembra de `cat_estado_fuerza_conceptos` (Etapa 0.5).

```
FROM roles_servicio rs
JOIN rol_estado_fuerza ref ON ref.rol_id = rs.id
JOIN cat_estado_fuerza_conceptos c ON c.id = ref.concepto_id
WHERE rs.fecha = <fecha del parte>
GROUP BY c.codigo
```

Se suman los roles de todos los turnos y sectores del día. La celda
`operativos/administrativos` del formato lleva diagonal literal: se imprime
`{OPER_ADMIN}` tal cual venga capturado (el formato muestra `/` como separador
de dos números, confirmar con el C-4 si son dos valores o uno).

**Estado actual:** `roles_servicio`, `rol_estado_fuerza` y
`cat_estado_fuerza_conceptos` están en 0 filas en la BD de desarrollo. La query
es correcta pero no habrá datos que ver hasta que el módulo de Rol de Servicios
se use en producción. No es bloqueante — la sección degrada a ceros, que es lo
que el formato en blanco muestra de todos modos.

---

## Verificación

1. `npx tsc --noEmit`
2. Por cada una de las 3 secciones, comparar el resultado del servicio contra
   una query manual sobre la BD para una fecha con datos.
3. Prueba de ventana: un incidente 911 a las 05:59 y otro a las 06:01 deben
   caer en partes de días distintos.
4. Prueba de turnos: capturar los 3 turnos de una fecha y verificar que aparecen
   íntegros en el parte del **día siguiente**, y que ninguno aparece además en
   el parte del mismo día.
5. Día sin datos → todos los conteos en 0 y los listados vacíos (no error).
