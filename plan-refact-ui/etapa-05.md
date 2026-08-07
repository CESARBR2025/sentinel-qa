# Etapa 5 — `navegacion/NavegacionDespacho.tsx` (HUD de navegación GPS)

No depende de otras etapas, pero se recomienda hacerla después de la Etapa 4 (su wrapper modal ya migrado). Leer `00-contexto.md` primero.

## ⚠️ Cuidado especial

Este es **el componente más complejo y de mayor riesgo de todo el plan**: HUD de navegación GPS en tiempo real con mapa 3D, usando `@react-google-maps/api` + `DirectionsService` + `watchPosition` de alta precisión + cálculo de rumbo/geofence + recalculo de ruta. Un error aquí puede dejar a un oficial sin navegación funcional en campo.

**Antes de tocar el archivo**, identificar con claridad qué es puramente visual (headers flotantes, botones, pills de estado, tipografía) vs. qué es cálculo/lógica (rumbo, geofence, recalculo de ruta, `DirectionsService`, `watchPosition`). Si hay duda sobre si una línea es visual o funcional, **no tocarla** y reportarlo en vez de asumir.

## Objetivo

Restylear únicamente el chrome visual del HUD: header/HUD/botones flotantes (hoy 100% `style={{}}` inline). Aplicar `DESIGN.md §3` tipografía y `DESIGN.md §6` radios/sombras a los elementos de UI (pills de distancia/tiempo restante, botones de acción, banners de alerta) sin tocar el mapa en sí ni sus cálculos.

**Excepción documentada en el propio código**: el pill de destino usa `borderRadius: 999` — ya coincide con `var(--radius-full)` de `DESIGN.md §6`, no hace falta cambiarlo, solo puede formalizarse como el token.

## Archivo: `components/oficial/navegacion/NavegacionDespacho.tsx`

No tocar bajo ninguna circunstancia: `@react-google-maps/api`, `DirectionsService`, `watchPosition`, cálculo de rumbo/geofence, recalculo de ruta, cualquier `useEffect` que dependa de coordenadas GPS.

Sí tocar: `fontFamily`, `fontSize`, `textTransform`, `letterSpacing`, `borderRadius`, `boxShadow`, `background` de elementos puramente decorativos/informativos (headers, pills de texto, botones que no disparan lógica de mapa).

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. **Prueba manual obligatoria y exhaustiva antes de reportar terminada esta etapa**: iniciar una navegación real (o simulada si hay modo de prueba), confirmar que el mapa se mueve, la ruta se calcula, la posición se actualiza en vivo, y no hay ningún error en consola relacionado a Google Maps o geolocalización.
3. Responsive en los 3 breakpoints — el HUD es mobile-first (se usa en campo desde el celular), verificar con especial cuidado en móvil ≤720px.

Si algo de esta etapa se siente riesgoso o ambiguo, **detenerse y preguntar antes de aplicar el cambio**, no asumir. Detenerse aquí y esperar confirmación antes de pasar a Etapa 6.
