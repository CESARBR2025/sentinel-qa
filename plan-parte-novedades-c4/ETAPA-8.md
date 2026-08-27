# Etapa 8 — Generador del `.docx`

Requiere etapas 1, 3, 4, 5 y 6. Puede desarrollarse en paralelo a la 7.

## Estructura

```
lib/novedades/docx/
├── index.ts          — arma el Document completo
├── encabezado.ts     — carta de presentación + párrafo de fundamento legal
├── resumen.ts        — T0, T1, T2
├── subsecretaria.ts  — T3, T4
├── analisis.ts       — T5
├── c4.ts             — T6
├── transito.ts       — T7 a T13
├── prevencion.ts     — T14 a T24
├── delictivos.ts     — T25 a T28
├── operativos.ts     — T29, T30
├── resumen-nov.ts    — T31
└── fuerza.ts         — T32 + firmas
```

Cada módulo exporta `(datos) => (Paragraph | Table)[]`. `index.ts` los concatena.
Todos importan de `@/lib/reportes/docx-helpers` (Etapa 1).

Ruta: `app/api/novedades/generar/route.ts` — `GET ?fecha=YYYY-MM-DD`, misma
forma que `app/api/nCoordinacion/generar/route.ts`: auth → permiso → cargar día
→ construir → `Packer.toBuffer` → responder con
`Content-Disposition: attachment; filename="parte_novedades_c4_${fecha}.docx"`.

## Encabezado del documento

Texto fijo verificado contra el `.docx` original:

```
San Juan del Río, Querétaro {fecha} del {año}

SECRETARIO DE SEGURIDAD CIUDADANA.
QUERÉTARO, QRO.
PRESENTE.

Con fundamento legal en lo dispuesto por los artículos 21 con relación al 115
de la Constitución Política de los Estados Unidos Mexicanos, artículo 24, 34,
35 fracción V, VII, VIII, XI, XIII, XIV, XV, XVIII, XIX, XX, XXII y XXIII del
Reglamento Interior de la Secretaría de Seguridad Pública Municipal de San Juan
del Río, Querétaro., me permito informar a usted el Parte Informativo de las
Novedades ocurridas en el Municipio de San Juan del Río, Qro., durante las 24
horas anteriores al día de la fecha, elaborado por el Centro de Control,
Comando, Comunicaciones y Computo C-4, dependiente de ésta Secretaría de
Seguridad Pública Municipal.

Las novedades correspondientes de las 06:00 horas del día {D-1} a las 06:00
horas del día {D} del {año}.
```

Ese párrafo va como constante en `encabezado.ts`. Los logos vienen de
`encabezadoConLogos()` (Etapa 1).

## Desviaciones deliberadas respecto del `.docx` original

Son dos, ambas por decisión del usuario. Dejarlas comentadas en el código con su
razón, para que quien lea el generador junto al formato original no las tome por
error.

**1. Ventana impresa en T5.** El original dice **"PLATAFORMA MÉXICO DE 05:00 A
05:00 HORAS"**. Por la decisión de ventana única se imprime **"DE 06:00 A 06:00
HORAS"**.

**2. Columna CENTRO.** Las tablas T0, T2 y T7 pasan de
`ORIENTE | PONIENTE | TOTALES` a `ORIENTE | PONIENTE | CENTRO | TOTALES`.

Esto obliga a **recalcular los anchos de columna** de esas tres tablas. El
generador de nCoordinación usa anchos fijos en DXA sobre un total de 9360
(`const wFge = [1872, 1872, 1872, 1872, 1872]`, etc.). Al agregar una columna,
los anchos de T0, T2 y T7 se reparten sobre el mismo total de 9360 — no basta
con añadir un valor al arreglo. T7 es la más delicada: 19 conceptos con etiquetas
largas ("Vehículos puestos a disposición del Juzgado Cívico") en la primera
columna; verificar en Word que no se rompa el salto de línea.

Las columnas de sector se generan **iterando `cat_sectores` activos**, no como
arreglo fijo — si se da de alta un cuarto sector, el ancho se recalcula solo.

## Regla "SIN NOVEDAD"

17 de las 34 tablas traen en el formato en blanco una fila con `SIN NOVEDAD` en
una celda y el resto vacías. Es el comportamiento por defecto, no un caso de
error: se resuelve con `tablaSinNovedad()` (Etapa 1) cuando el listado viene
vacío.

Las matrices de contadores no llevan `SIN NOVEDAD` sino `00` — dos dígitos, vía
`toN()`.

## Plantillas INFORMATIVOS de T31

La tabla "RESUMEN DE NOVEDADES" (`HORA | EVENTO | DESCRIPCIÓN | TI | IPH | PI`)
tiene filas normales autollenadas desde `incidentes`, más filas etiquetadas
`INFORMATIVOS` que contienen bloques de texto largo con estructura fija. Tres
plantillas, verificadas contra el original:

**ECO 8:**
```
FOLIO BITÁCORA {folio} OPERATIVO ECO 8 {hora} horas, se brindó apoyó con
seguridad y vigilancia con el siguiente estado de fuerza:
Policía Municipal {n} Policías a cargo {n} Unidades
Complementarias {texto}
Novedades:
{n} Vehículos revisados
{n} Personas entrevistadas
{n} Personas inspeccionadas
{n} Juzgado Cívico
{n} Puestas a disposición de Fiscalía General del Estado
{n} Puestas a disposición de Fiscalía General de la República
{n} Reportes atendidos
{n} Vehículos a Corralón
{n} Infracciones
Dándole término a las {hora} horas.
```

**INTERINSTITUCIONAL:** misma forma, con estado de fuerza de Táctico, Policía
Municipal, SEDENA y Guardia Nacional (Policías a cargo + Unidades cada uno), más
línea "Se realizaron recorridos en {zonas}".

**METROPOLITANO II:** estado de fuerza por corporación —Policía Estatal Base San
Juan del Río, Policía Municipal San Juan del Río, Tequisquiapan, Pedro Escobedo,
Amealco—, cada una con Policías a cargo, Unidades, Armas Cortas, Armas Largas y
Chalecos. Su línea de FGE dice "(Vehículo recuperado)" entre paréntesis.

Se implementan como funciones de plantilla en `resumen-nov.ts` que reciben los
valores capturados en el paso 9 (Operativos) y el paso 10, **no como textarea
libre**. El capturista llena números, el sistema arma la redacción — que es
idéntica todos los días salvo las cifras.

## Cierre

Tabla de firmas de dos columnas (Elaboró / Jefe C4) más la firma del Secretario,
igual que `tablaFirmas` en nCoordinación, y el bloque final:

```
R E S P E T U O S A M E N T E
"TRADICIÓN Y PROGRESO"
```

## Verificación

1. `npx tsc --noEmit` y `npm run build`
2. Generar el `.docx` de un día completo y **compararlo lado a lado con
   `FORMATO NOVEDADES.docx`**: las 34 tablas, en el mismo orden, con los mismos
   encabezados de columna — salvo las dos desviaciones documentadas arriba.
3. Generar el `.docx` de un día sin datos y comparar contra el formato en
   blanco: debe quedar equivalente.
4. Abrir ambos en Word (no solo validar el XML) — anchos de columna y saltos de
   página se rompen ahí antes que en el parser.
