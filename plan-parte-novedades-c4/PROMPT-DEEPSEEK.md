Eres el implementador de un plan ya diseñado por el arquitecto del proyecto.
No rediseñes la arquitectura ni cuestiones las decisiones tomadas — están
documentadas y verificadas contra el código y la base de datos real. Tu
trabajo es ejecutar las etapas en orden, una por una, verificando los
criterios de aceptación de cada una antes de pasar a la siguiente.

## Contexto del proyecto

Next.js (SSPM — Sistema de Seguridad Pública Municipal, San Juan del Río).
Sigue la arquitectura por capas documentada en `AGENTS.md` de la raíz del repo:
`types.ts` / `mapper.ts` / `repository.ts` / `service.ts` / `actions.ts` por
módulo en `lib/<módulo>/`. Toda la UI se rige por `DESIGN.md` de la raíz —
léelo completo antes de escribir cualquier JSX.

Antes de tocar cualquier archivo, léelo completo. **No asumas su contenido a
partir de este plan**: los números de línea citados pueden haber cambiado si
algo más tocó esos archivos entre que se escribió el plan (2026-08-10) y que tú
lo ejecutas.

## Qué estás construyendo

El **Parte de Novedades del C-4**: el reporte diario más grande del sistema,
34 tablas, ventana 06:00 → 06:00. Un stepper de 11 pasos que autollena desde la
BD lo que tiene fuente, pide captura manual lo que no, y genera el `.docx`
completo al final.

Ya existe un módulo hermano y funcionando con la misma estrategia —**Formato N a
Coordinación** (`/envio-de-formatos/consolidar`, stepper de 8 pasos)—. Es tu
referencia de estilo y de patrones. Reúsalo; no inventes un patrón nuevo donde
ya hay uno probado.

## Qué leer, en orden

1. [README.md](README.md) — arquitectura, mapeo completo de las 34 tablas del
   documento a sus fuentes en BD, decisiones tomadas con el usuario, y dos
   hallazgos que contradicen supuestos iniciales (el sector y la fecha del turno
   nocturno). **Léelo entero antes de escribir una línea.**
2. [ETAPA-0.md](ETAPA-0.md) — prerrequisitos de datos: consolidar catálogo de
   sectores, `ofi_oficiales.sector_id`, catálogo de clasificación de delitos,
   siembra de conceptos de estado de fuerza, y el fix de la fecha del turno
   nocturno en `incidentes_camara`. **Sin esta etapa, tres secciones del reporte
   no pueden autollenarse.**
3. [ETAPA-1.md](ETAPA-1.md) — extraer los helpers `docx` a
   `lib/reportes/docx-helpers.ts`. Refactor puro, cero cambio funcional.
4. [ETAPA-2.md](ETAPA-2.md) — esquema de persistencia: 3 tablas genéricas.
5. [ETAPA-3.md](ETAPA-3.md) — capa de dominio `lib/novedades/` y el helper de
   ventana 06→06.
6. [ETAPA-4.md](ETAPA-4.md) — cálculo grupo A: las secciones de autollenado
   puro (C-4, Subsecretaría, Estado de fuerza).
7. [ETAPA-5.md](ETAPA-5.md) — cálculo grupo B: las secciones que dependen del
   sector (Resumen general, Tránsito, Hechos delictivos).
8. [ETAPA-6.md](ETAPA-6.md) — secciones de captura manual (Análisis,
   Prevención, Supervisión y Operativos).
9. [ETAPA-7.md](ETAPA-7.md) — store Zustand y stepper de 11 pasos.
10. [ETAPA-8.md](ETAPA-8.md) — generador del `.docx` completo.
11. [ETAPA-9.md](ETAPA-9.md) — integración, permisos y bóveda.
12. [ETAPA-10.md](ETAPA-10.md) — limpieza de deuda técnica en BD. Independiente
    del resto; puede ir al final o en cualquier momento.

## Orden y dependencias

- **0, 1 y 2 son prerrequisito de todo lo demás** y son independientes entre sí.
- De la **3 en adelante es secuencial**, salvo **4, 5 y 6**, que son
  independientes entre ellas (las tres dependen de la 3).
- La **8** puede desarrollarse en paralelo a la **7**.
- La **10** es independiente de todo.

Aun así, **ejecútalas en orden numérico** salvo que algo te bloquee.

## Reglas de ejecución

- **Una etapa a la vez.** No mezcles cambios de dos etapas en el mismo commit ni
  los apliques en paralelo — cada `ETAPA-N.md` es atómica y su criterio de
  aceptación asume que las anteriores ya están verificadas.
- **Detente al terminar cada etapa y espera confirmación** antes de pasar a la
  siguiente. No encadenes. Reporta lo hecho y lo verificado, y espera.
- **Si un criterio de aceptación falla, no avances** — corrige primero.
- **No inventes alcance.** Hay cosas marcadas explícitamente como fuera de
  alcance (migrar `turno` en las otras tres tablas, gestión de turnos por
  usuario, cerrar la feature de fichas de inteligencia). Si crees que hace
  falta algo, anótalo al final de tu reporte de esa etapa en vez de construirlo.
- **Verifica contra la base de datos real, no solo contra el código.** Casi todo
  el mapeo del README se confirmó consultando la BD directamente. Si vas a tocar
  lógica de cálculo, corre la consulta antes y después para confirmar que el
  número no cambió sin querer.
- **Después de cada etapa**, ejecuta los criterios de aceptación de esa etapa tal
  cual están escritos (son pasos manuales + comandos — ejecútalos, no los des por
  hecho) y como mínimo `npx tsc --noEmit`.
- Sigue el resto de `AGENTS.md`. Estas etapas son todas **T2**, así que al cerrar
  el plan corre el checklist T2 completo: `npx tsc --noEmit`, `npm run build`,
  `npm run lint`, `npm run db:schema`, `npx graphify update` y actualización de
  la bóveda.

## Cosas que se rompen fácil — presta atención especial

**1. La ventana 06:00 → 06:00 no es un día natural.**
Ninguna query de este módulo puede usar `::date` sobre una columna de timestamp.
Todas filtran `columna >= $inicio AND columna < $fin`. Las tablas que guardan
fecha y hora separadas (`ofi_reporte_denuncia.fecha_reporte` + `hora_reporte`,
`iph_detenidos.fecha_evento` + `hora_inicio_evento`) se filtran componiendo
ambas. Ya hubo un bug de timezone por esto en Formato N; no lo repitas.

**2. `incidentes_camara` es la única excepción.**
Es un agregado por turno, no un evento. Su regla es
`SUM(incidentes_camara WHERE fecha = D-1)` y **depende de que el fix de la
Etapa 0.6 esté aplicado**. Si no lo está, produce números mal en silencio.

**3. Snapshot al confirmar, no recálculo en vivo.**
Es un documento oficial diario: si mañana se corrige un IPH, el parte de ayer no
debe cambiar. `obtenerDiaNovedades` **no escribe**; el snapshot ocurre solo en
`confirmarSeccionNovedades` y **solo sobre la sección que se confirma**. Esa
acotación es lo que evita el bug que ya se corrigió en Formato N, donde guardar
desde una pantalla sobreescribía con ceros los campos de otra.

**4. Los catálogos van por id, nunca por nombre.**
Dentro del `jsonb` de `novedades_seccion` / `novedades_filas`, todo campo de
catálogo guarda el **id** (`sector_id`, `delito_id`, `grua_id`, `concepto_id`,
`oficial_id`). El nombre se resuelve con JOIN al generar el documento. Si
guardas el nombre desnormalizado, el parte histórico se rompe cuando
Administración renombre algo.

**5. El `.docx` lleva dos desviaciones deliberadas** respecto del original
(`FORMATO NOVEDADES.docx`): la columna CENTRO en T0/T2/T7, y el rótulo de T5 que
pasa de "05:00 A 05:00" a "06:00 A 06:00". Están documentadas en la Etapa 8.
Coméntalas en el código para que no se lean como error.

**6. Agregar la columna CENTRO obliga a recalcular anchos DXA.**
Los anchos son fijos sobre un total de 9360. No basta con añadir un valor al
arreglo: hay que repartir el mismo total. T7 es la más delicada (19 conceptos
con etiquetas largas). Ábrela en Word, no solo valides el XML.

**7. Nada de `DROP` sin respaldo.**
En la Etapa 10, reconfirma `count(*) = 0` y el `grep` **inmediatamente antes**
de cada `DROP`. La auditoría es del 2026-08-10 y el código se mueve.

## Al terminar

Reporta, etapa por etapa: qué se cambió (archivos y resumen), qué criterio de
aceptación se verificó y cómo, y cualquier desviación del plan con su
justificación.

Si alguna etapa revela que un supuesto del plan era incorrecto —igual que pasó
con `ofi_oficiales.sector_id`, que el usuario creía que existía y no existe—
**dilo explícitamente y detente**. No lo ajustes en silencio.
