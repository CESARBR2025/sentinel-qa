# Etapa 7 — Rediseñar el slide del PPT para calcar la Ficha UDAI real

Leer primero `00-contexto.md`. Requiere Etapa 6 confirmada. Requiere que `plan-reporte-ppt/etapa-2.md` (fix de fotos mal etiquetadas) ya esté aplicado.

## Objetivo

Reemplazar el slide actual de `addDetenidoSlide()` (tabla simple de 6 filas + hasta 3 fotos en fila) por un layout que calque la estructura real de `FORMATO FICHA DE DETENIDOS.pptx`: página **vertical** (no la diapositiva horizontal 16:9 actual), con foto frontal grande, foto(s) de objetos, tabla de datos generales, tabla de evento delictivo, y tabla de antecedentes.

## Referencia exacta del formato oficial (medidas reales extraídas del .pptx)

- Tamaño de página: **7.5in × 10in** (vertical/retrato — `6858000 × 9144000` EMU), no el 10×5.625in horizontal que usa hoy `generarPptAgrupado()`.
- Foto frontal del detenido: única, prominente, cerca de la parte superior (posición aprox. 1.56in, 1.2in, tamaño aprox. 1.82in × 2.11in en el original — ajusta proporciones al nuevo layout, no copies coordenadas exactas del original).
- Foto(s) de objetos asegurados: más pequeñas, a un costado de la foto frontal.
- Logo institucional: esquina superior, pequeño.
- Debajo: tabla de nombre completo / apodo / folio.
- Debajo: tabla "DATOS GENERALES DETENIDO" (2 columnas de pares label-valor, algunas filas ocupan el ancho completo como Domicilio y Rasgos Particulares).
- Debajo: tabla "EVENTO DELICTIVO" (mismo patrón de pares label-valor, con Modus Operandi como fila de texto largo ocupando todo el ancho).
- Al final: tabla de dos columnas "DELITOS (ANTECEDENTES)" / "FALTAS ADMINISTRATIVAS (ANTECEDENTES)", cada celda con una lista de líneas `fecha + descripción + lugar`.

No es necesario clonar pixel-por-pixel el original — el objetivo es que un usuario que conozca el formato oficial reconozca la misma estructura y las mismas secciones, con las proporciones de `pptxgenjs` (usa `addTable` para las tablas, no imágenes).

## Archivo a tocar

`lib/reporte-detenidos/ppt-service.ts`

## Cambios

1. **Layout de página**: agregar un layout custom antes de crear las slides:

```ts
pptx.defineLayout({ name: 'FICHA_UDAI', width: 7.5, height: 10 })
pptx.layout = 'FICHA_UDAI'
```

Esto afecta a **todas** las slides del documento (incluyendo las divisorias de `addDividerSlide`) — ajusta también las coordenadas de `addDividerSlide` al nuevo tamaño de página (hoy asume 10×5.625).

2. **Reemplazar `addDetenidoSlide(pptx, d: DetenidoCompleto)`** por una versión que:
   - Recibe también la ficha completa: `addDetenidoSlide(pptx: PptxGenJS, d: DetenidoCompleto, ficha: FichaDetenidoCompleta)` (importar `obtenerFichaCompleta` y `FichaDetenidoCompleta` de `./repository` y `./types`, Etapa 6).
   - Sigue trayendo las fotos con el query ya corregido en `plan-reporte-ppt/etapa-2.md` (`tipo_contenido='detenido' AND detenido_index=0`), pero ahora:
     - Usa **solo** la foto `frontal` en la posición prominente (grande, cerca de arriba) — las fotos `derecho`/`izquierdo` **no se dibujan en este slide** (siguen existiendo en `evidencias_detenido` para el expediente, pero el formato oficial de la ficha solo muestra 1 foto frontal — es una decisión deliberada de este plan, no un descuido).
     - Además, trae las fotos de objetos (`tipo_contenido = 'objeto'`, mismo `reporte_campo_id`, dedup por `tipo_foto` igual que ya hace el query existente) y las dibuja más pequeñas a un costado, igual que en el original.
   - Header: logo (si hay un asset de logo institucional en `public/`, úsalo; si no existe, omite el logo y no bloquees la etapa por esto — repórtalo como pendiente) + tabla nombre/apodo/folio (`ficha.nombreCompleto`, `ficha.apodo`, `ficha.folioFicha`).
   - Tabla "DATOS GENERALES DETENIDO": fecha nacimiento + edad (`${ficha.fechaNacimiento} (${ficha.edad} años)` si `edad` no es null, si no solo mostrar `—`), género, originario, estado civil, escolaridad, ocupación, domicilio (fila ancho completo), rasgos particulares (fila ancho completo).
   - Tabla "EVENTO DELICTIVO": fecha/hora (`ficha.fechaHoraEvento`), RND (`ficha.rnd`), expediente (`ficha.expediente`), lugar del evento (`ficha.lugarEvento`), lugar de la detención (`ficha.lugarDetencion`), IPH (`ficha.iph`), nexos delictivos (`ficha.nexosDelictivos` — siempre se renderiza como celda vacía, no como texto "null" ni "—"; usa `''`), zona de operación (`ficha.zonaOperacion`), puesta a disposición (`ficha.puestaDisposicion`), modus operandi (`ficha.modusOperandi`, fila ancho completo), información adicional (`ficha.informacionAdicional`, fila ancho completo).
   - Tabla "ANTECEDENTES" de dos columnas: izquierda `ficha.antecedentesDelitos`, derecha `ficha.antecedentesFaltas`. Cada antecedente se renderiza como una línea `${fecha ?? 's/f'} — ${descripcion}${lugar ? ' — ' + lugar : ''}`, y si `fuente === 'EXTERNO'` agrega un sufijo visual discreto, ej. `(externo)`, para que quede claro cuál antecedente viene de una fuente fuera de este sistema. Si el arreglo está vacío, la celda muestra `—` (no deja la tabla vacía/rota).
   - Usa el mismo estilo tipográfico que ya existe en el archivo (Arial, la paleta de colores `1E40AF`/`334155`/`64748B`/`F1F5F9`/`E2E8F0` ya usada en el resto del archivo) — no inventes una paleta nueva.

3. **`generarPptAgrupado()`**: el `for (const d of enRango) { await addDetenidoSlide(pptx, d) }` pasa a:

```ts
for (const d of enRango) {
  const ficha = await obtenerFichaCompleta(d.id)
  if (!ficha) continue // no debería pasar (d.id viene de listarDetenidosCompletos, que ya exige D1), pero no revientes el PPT completo por un dato inconsistente
  await addDetenidoSlide(pptx, d, ficha)
}
```

No cambies el resto de `generarPptAgrupado()` (cálculo de rangos diario/semanal/mensual, divisor de secciones) — eso sigue igual, solo cambia qué se dibuja por cada detenido.

## Verificación

1. `npx tsc --noEmit`.
2. Generar el PPT para el registro de prueba usado en `plan-reporte-ppt` (`SSPM/D1/20260805/AIO0V2`) y abrirlo — confirmar visualmente que la estructura se parece a la ficha oficial (foto frontal grande, tabla de datos generales, tabla de evento delictivo con lugar de detención y zona de operación llenos, sección de antecedentes aunque esté vacía por ser un registro de prueba sin historial).
3. Confirmar que un detenido con antecedentes de prueba (crea 2 reportes con el mismo nombre/CURP si hace falta) los muestra correctamente en la tabla de antecedentes, y que un antecedente externo capturado en la Etapa 4 aparece marcado `(externo)`.

## Criterios de aceptación

- El PPT generado sigue la misma estructura de secciones que el formato oficial (encabezado con foto+nombre+folio, datos generales, evento delictivo, antecedentes).
- Página vertical 7.5×10in, no la horizontal anterior.
- `npx tsc --noEmit` limpio.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 8.**
