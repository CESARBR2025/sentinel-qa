# Etapa 4 — Diferenciación visual de marcadores

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript). Parte 4 de 5 del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` en esta misma carpeta para trasfondo completo. **Requiere que las etapas 1, 2 y 3 ya estén hechas y validadas** (mapa integrado en el modal, con datos reales sin truncar a 10).

## Objetivo

Que el mapa comunique visualmente, de un vistazo, cuál unidad es la **más cercana**, cuáles son **cercanas**, cuáles están **lejos**, cuáles están **seleccionadas**, y cuáles tienen una **ubicación no fresca** (posición reportada hace rato) — usando exclusivamente datos que el backend ya provee (ajustado en Etapa 2), sin tocar backend ni tipos.

## Archivos

- **Modificar (único archivo a tocar):** `components/911/despacho/AsignacionMapa.tsx`

No modificar `SeleccionarUnidadesModal.tsx`, `lib/flota/service.ts`, `lib/flota/types.ts` en esta etapa.

## Contexto técnico necesario

- `UnidadCards.tsx` ya exporta `formatAntiguedad(iso: string): { texto: string; fresco: boolean }` — úsala tal cual, no reimplementes el cálculo de frescura. Import: `import { formatAntiguedad } from '@/components/911/despacho/UnidadCards'`.
- Paleta de referencia ya usada en el resto del módulo (mantener consistencia):
  - Azul institucional (seleccionado/cercana): `#1f355a`
  - Verde éxito (más cercana / fresco): `#16a34a`
  - Ámbar (ubicación vieja): `#b45309`
  - Gris (no cercana / texto secundario): `#94a3b8`
- `SeleccionarUnidadesModal.tsx` ya deriva `masCercanaId` así: `unidades.find(u => u.distanciaKm != null)?.id` (porque el array ya viene ordenado ascendente por `distanciaKm` desde el backend). Usa el mismo criterio dentro de `AsignacionMapa` para no duplicar una lógica distinta.
- Constante de referencia para "cercana": el backend usaba `TOP_UNIDADES_CERCANAS = 10` para truncar (ya no trunca desde la Etapa 2, pero el concepto de "las primeras 10 más cercanas" sigue siendo el criterio de negocio para destacar "cercanas" vs "lejanas"). Declara una constante local equivalente en `AsignacionMapa.tsx` (ej. `const MAX_UNIDADES_CERCANAS = 10`).

## Instrucciones

1. Dentro de `AsignacionMapa`, a partir del array `unidades` recibido por props (ya viene ordenado ascendente por `distanciaKm` desde el backend, con las que no tienen ubicación ya excluidas por el propio backend salvo que decidas filtrar de nuevo por seguridad):
   - `masCercanaId = unidades.find(u => u.distanciaKm != null)?.id` (mismo criterio que el modal).
   - `idsCercanas = new Set(unidades.filter(u => u.distanciaKm != null).slice(0, MAX_UNIDADES_CERCANAS).map(u => u.id))`.
2. Para cada unidad a plotear, calcula:
   - `esMasCercana = u.id === masCercanaId`
   - `esCercana = idsCercanas.has(u.id)` (nota: `esMasCercana` implica `esCercana`, no son mutuamente excluyentes — la más cercana es un caso especial dentro de las cercanas)
   - `fresco = u.ultimaUbicacionEn ? formatAntiguedad(u.ultimaUbicacionEn).fresco : false`
   - `seleccionada = seleccionadas.includes(u.id)` (prop ya recibida desde la Etapa 1/3)
3. Define el estilo del ícono de cada marcador combinando estas banderas, en este orden de prioridad visual (de mayor a menor prominencia):
   - Color de relleno: verde `#16a34a` si `esMasCercana`; azul `#1f355a` si `esCercana` (y no es la más cercana) — con opacidad plena en ambos casos; gris `#94a3b8` con opacidad reducida (~0.55) si no es cercana.
   - Borde del marcador: sólido si `fresco`, punteado/discontinuo si `!fresco` (independiente del color de relleno).
   - Si `seleccionada`: agregar un indicador adicional superpuesto (ej. un check o un anillo extra azul oscuro) que sea visible sin importar el color base del marcador.
4. Implementación sugerida: generar un ícono SVG como data-URI (`data:image/svg+xml;base64,...` o `data:image/svg+xml;utf8,...`) parametrizado por estas banderas, y pasarlo como `icon` al `MarkerF` correspondiente. No se requieren imágenes nuevas en `/public`. Si `@react-google-maps/api`/`MarkerF` en este proyecto soporta `icon` como objeto `{ url, scaledSize }` (como en otros usos de Google Maps del repo), sigue ese mismo patrón de construcción de ícono.
5. El marcador del incidente (lugar del hecho) no cambia en esta etapa — sigue con su ícono distinto ya definido en la Etapa 1.
6. Verifica que el `onClick` de cada marcador (que llama `onToggleUnidad(u.id)`) sigue funcionando igual — esta etapa es solo visual, no toca la interacción de selección.

## Qué NO hacer en esta etapa

- No tocar el backend, ni `lib/flota/types.ts`.
- No tocar `SeleccionarUnidadesModal.tsx` — la sincronización de selección ya quedó resuelta en la Etapa 3.
- No agregar un `InfoWindow`/popup con detalle de tripulación si no estaba ya contemplado — mantén el alcance acotado a la diferenciación visual del propio marcador. Si te parece valioso agregarlo, es una mejora opcional fuera de este plan, no la implementes sin confirmarlo primero.

## Criterios de aceptación (verificar antes de pasar a Etapa 5)

1. `npx tsc --noEmit` corre sin errores nuevos.
2. Con datos reales (un incidente con varias unidades a distintas distancias y con distinta antigüedad de última ubicación reportada), el mapa muestra a simple vista:
   - Exactamente 1 marcador verde (la más cercana).
   - Varios marcadores azules a opacidad plena (cercanas, dentro del top ~10 por distancia).
   - Marcadores grises a opacidad reducida para el resto (lejanas).
   - Al menos un marcador con borde punteado si hay alguna unidad con `ultimaUbicacionEn` de más de 5 minutos de antigüedad.
3. Seleccionar una unidad (desde el mapa o desde la lista) hace visible el indicador de "seleccionada" en su marcador correspondiente, sin importar su color base.
4. No se rompió ninguna de las validaciones ya hechas en la Etapa 3 (split-view, caso sin coordenadas, buscador, confirmación de selección).

Cuando estos criterios pasen, detente y espera confirmación antes de continuar con `etapa-5.md`.
