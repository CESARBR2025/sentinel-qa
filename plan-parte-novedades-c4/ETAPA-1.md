# Etapa 1 — Extraer helpers docx

Refactor puro. **Cero cambio funcional**: el `.docx` de nCoordinación debe salir
byte-idéntico antes y después.

## Por qué

`app/api/nCoordinacion/generar/route.ts` son 326 líneas para 8 tablas, con los
helpers de construcción declarados inline (líneas 17–87). NOVEDADES tiene 34
tablas — al mismo ritmo serían ~1,400 líneas en un solo archivo de ruta, y con
los helpers duplicados entre los dos formatos.

## Qué se extrae

Nuevo archivo `lib/reportes/docx-helpers.ts` con lo que hoy vive inline en la
ruta:

| Símbolo | Ubicación actual | Qué hace |
|---|---|---|
| `NO_BORDER`, `THIN`, `allBorders`, `noBorders` | route.ts:17-20 | constantes de borde |
| `r(text, opts)` | route.ts:22 | `TextRun` con Calibri size 16 por defecto |
| `Alignment` (type) | route.ts:26 | alias de alineación |
| `p(children, opts)` | route.ts:28 | `Paragraph` con spacing |
| `tc(child, opts)` | route.ts:36 | `TableCell` con ancho/sombreado/bordes |
| `tr(cells)` | route.ts:45 | `TableRow` |
| `hRow(labels, widths, shade)` | route.ts:47 | fila de encabezado centrada |
| `dRow(values, widths)` | route.ts:53 | fila de datos centrada |
| `toN(v)` | route.ts:59 | `String(v ?? '00').padStart(2, '0')` |
| `lineaFirma()` | route.ts:212 | tabla de 1 celda con borde inferior |

Se agregan dos helpers nuevos que ambos formatos necesitan:

- `encabezadoConLogos()` — el `Header` con `logo_gobierno_mx.png` y
  `logo_queretaro.jpeg` que hoy está inline en route.ts:244-266. Lee de
  `public/` con `fs.readFileSync`.
- `tablaSinNovedad(headers, widths)` — el patrón que hoy se repite a mano en
  cada tabla de nCoordinación (`tablaRnd`, `tablaArmas`): encabezado + una fila
  con "Sin Novedad" en la primera celda y el resto vacías. En NOVEDADES este
  patrón aparece en **17 de las 34 tablas**, así que extraerlo no es opcional.

## Qué NO se extrae

La lógica de negocio de cada tabla (`tablaFiscalia`, `tablaEventos`,
`tablaNiveles`, `tablaMasc`, `tablaVictimas`, `tablaObs`, `tablaArmas`,
`tablaFirmas`) se queda en la ruta de nCoordinación. Son de ese formato, no
compartidas.

## Después del refactor

`app/api/nCoordinacion/generar/route.ts` queda en ~200 líneas, importando de
`@/lib/reportes/docx-helpers`.

## Verificación

1. Generar el `.docx` de una fecha con datos **antes** del refactor y guardarlo.
2. Aplicar el refactor.
3. Generar el mismo `.docx` y comparar: descomprimir ambos y diff sobre
   `word/document.xml`. Debe ser idéntico salvo metadatos de timestamp.
4. `npx tsc --noEmit`
