# Etapa 6 — Secciones de captura manual

Requiere Etapa 3. Independiente de las etapas 4 y 5.

Las secciones sin fuente en la BD. El valor que agrega el sistema aquí no es
autollenado sino: persistencia entre días, arrastre del día anterior donde
aplica, validación de tipos, y que el `.docx` salga armado.

Archivo: `lib/novedades/calculo/manual.ts` + los tipos correspondientes.

---

## 6.1 Paso 4 — Unidad de Análisis (T5)

Matriz de 6 valores, `seccion = 'analisis'`:

| Campo | Etiqueta del documento |
|---|---|
| `consultas_personas` | Consultas realizadas en Plataforma México — Total de personas |
| `ordenes_aprehension` | Órdenes de Aprehensión vigentes |
| `consultas_vehiculos` | Consultas realizadas en Plataforma México — Total de vehículos |
| `vehiculos_reporte_robo` | Vehículos con reporte de robo |
| `detenidos_carcel` | Detenidos a Cárcel Municipal — Total de personas |
| `detenidos_fiscalia` | Detenidos a FGE/FGR |

`detenidos_fiscalia` **sí es derivable** de T0 (Etapa 5.1) — se prellena con ese
conteo y queda editable. Los otros cinco son captura pura: no hay integración con
Plataforma México y `lib/analisis/` solo contiene `permisos.ts`.

El encabezado impreso de esta tabla dice "DE 05:00 A 05:00 HORAS"; por la
decisión de ventana única se imprime **06:00 a 06:00** (ver Etapa 8).

---

## 6.2 Paso 7 — Prevención del Delito (T14 a T24)

Es el paso más pesado en número de tablas (11) y el que menos fuente tiene.

### T14 — Matriz de Atención a Víctimas (29 contadores)

**Autollenables (~8):**

| Concepto | Fuente |
|---|---|
| Medidas realizadas | `medidas_proteccion` en la ventana |
| Constancias domiciliarias (primera visita) | `visitas_domiciliarias` primera por `medida_id` |
| Incumplimientos de medidas | `visitas_domiciliarias.apercibimiento_aplicado = true` |
| BAESVIM | `fichas_busqueda` WHERE `tipo` = BAESVIM |
| Persona no localizada | `fichas_busqueda` WHERE `tipo` = no localizada |
| Seguimiento de BAESVIM | `seguimientos_busqueda` de fichas BAESVIM |
| Seguimiento de persona no localizada (ya localizada) | `seguimientos_busqueda` + `status` |
| Personas a disposición de Fiscalía / Juzgado cívico | reuso de Etapa 4.2 filtrado a Prevención |

**Sin fuente (~21):** Apoyos de traslado, Reportes riña familiar, Reportes
generales, Seguimiento de Colaboración de búsqueda, Personas inspeccionadas,
Vehículos inspeccionados, Vehículos notificados, Vehículos remitidos al corralón,
Infracciones por infringir el reglamento, Firma de delegados, Firma de bitácora,
Apoyo a actuarios, Custodias, Pláticas de vinculación ciudadana, Jornadas de
Trabajo a Favor de la Comunidad, Firmas de bitácora (Vinculación), Jornadas con
Stand, Convenios de mediación, Seguimiento de Convenios de mediación, Otros
(Contención Psicológica).

Más el bloque final "Otros" con 6 conceptos de texto corrido: Supervisión de
Farmacias, Atención a Víctimas, Reportes atendidos (Mediación), Visitas
realizadas (Mediación), Visitas finalizadas en sistema (Mediación), Firma de
bitácora (Mediación), Entrega de copia de convenios (Mediación).

Los contadores autollenables se muestran diferenciados en la UI (mismo patrón
visual que `FGE_AUTOMATICOS` vs `FGE_MANUALES` en el stepper de Formato N).

### T15 — Reporte de persona no localizada

`FECHA | HORA | LUGAR | CARPETA | DELITO | POLICIA | UNIDAD | OBSERVACIONES`

**Autollenable** desde `fichas_busqueda`: `fecha_activacion`,
`carpeta_investigacion`, `nombre_desaparecida`, `rt_atiende`,
`elemento_novedades`, `motivo_cancelacion`. Editable antes de confirmar.

### T16 / T17 / T18 / T19

Reuso de servicios ya escritos, filtrados a adscripción Prevención:
- T16 = T3 (Etapa 4.2)
- T17 = T4 (Etapa 4.2)
- T18 = infracciones (Etapa 5.1)
- T19 = corralón (Etapa 5.2 / T9)

No se reimplementa nada.

### T20 a T24 — Captura manual pura

| Tabla | `seccion` en `novedades_filas` | Columnas |
|---|---|---|
| T20 Convenios (mediadores) | `prevencion.convenios` | FECHA, LUGAR, INVOLUCRADOS, POLICIA, UNIDAD, CONVENIO |
| T21 Seguimiento de convenios | `prevencion.seg_convenios` | FECHA, LUGAR, INVOLUCRADOS, ELEMENTO/ADMINISTRATIVO, UNIDAD, CONVENIO |
| T22 Pláticas vinculación | `prevencion.platicas` | FECHA, PLÁTICAS, TEMA, LUGAR, ELEMENTO, AFORO, UNIDAD |
| T23 Jornadas trabajo comunidad | `prevencion.jornadas_trabajo` | FECHA, HORA, LUGAR, ELEMENTO, UNIDAD, COMPLEMENTARIOS |
| T24 Jornadas con stand | `prevencion.jornadas_stand` | FECHA, HORA, LUGAR, ELEMENTO, AFORO, UNIDAD |

En todas, el campo UNIDAD es select contra `via.v2_patrullas` y ELEMENTO select
contra `ofi_oficiales` — **no texto libre**, aunque el documento original los
escriba a mano.

---

## 6.3 Paso 9 — Supervisión y Operativos (T29, T30)

### T29 — Supervisión general

Matriz fija de **10 operativos × 11 columnas**. Las filas son constantes del
formato, no capturables:

```
VIGILANCIA IGLESIAS SECTOR ORIENTE
CAJEROS ZONA BANCARIA SECTOR ORIENTE
PARQUES SEGUROS SECTOR ORIENTE
VIGILANCIA COMERCIOS SECTOR ORIENTE
ESCUELA SEGURA SECTOR ORIENTE
SUPERVISIÓN CENTROS COMERCIALES SECTOR PONIENTE
VIGILANCIA IGLESIAS SECTOR PONIENTE
CAJEROS ZONA BANCARIA SECTOR PONIENTE
PARQUES SEGUROS SECTOR PONIENTE
ESCUELA SEGURA SECTOR PONIENTE
```

Columnas: Total de Unidades, Total de Elementos, Vehículos Revisados, Vehículos
PD, Personas Revisadas, Remitidas a Juzgado, A FGE, A FGR, Revisiones, Inicio
del Operativo, Término del Operativo.

Se define como constante `OPERATIVOS_SUPERVISION` en el código y se guarda como
matriz en `novedades_seccion` con `seccion = 'operativos.supervision'`.

### T30 — Operativos

Matriz fija de **5 operativos × 12 columnas**:

```
OPERATIVO ECO 8
METROPOLITANO II
INTERINSTITUCIONAL
CATEO SSPM/FGE
CATEO SSPM/FGR
```

**Parcialmente autollenable.** `ofi_reportes_campo` tiene los flags booleanos que
identifican el operativo:

| Fila | Flag |
|---|---|
| OPERATIVO ECO 8 | `ofi_eco8` |
| METROPOLITANO II | `ofi_operativos_metropolitano` |
| CATEO SSPM/FGE | `ofi_apoyo_cateos_fge` |
| CATEO SSPM/FGR | `ofi_apoyo_cateos_fgr` |
| INTERINSTITUCIONAL | sin flag — manual |

Con esos flags se autollenan las columnas de personas puestas a disposición
(Juzgado, FGE, FGR) por operativo. El estado de fuerza (unidades, elementos,
horas de inicio/término, afluencia) es manual.

---

## Verificación

1. `npx tsc --noEmit`
2. Capturar una sección completa, recargar la página y confirmar que persiste.
3. Confirmar la sección y verificar que el recálculo posterior **no** pisa el
   snapshot.
4. Día sin captura → el `.docx` debe imprimir `SIN NOVEDAD` en cada tabla, no
   filas vacías.
