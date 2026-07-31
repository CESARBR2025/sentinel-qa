# Verificación final — QA end-to-end

> Ejecutar **después** de completar las Etapas 1-7. No es una etapa de código — es el checklist de cierre del plan.

## 1. Typecheck y build

```bash
npx tsc --noEmit
npm run build
```

Ambos deben terminar sin errores. Si algo falla en `NavegacionDespacho.tsx`, revisa que los tipos de `google.maps.*` estén disponibles (el proyecto ya tiene `@types/google.maps` vía `@react-google-maps/api`, no debería hacer falta instalar nada nuevo).

## 2. Flujo completo con coordenadas — el camino feliz

El usuario del proyecto valida la UI en su propio navegador (no automatizar un navegador para esto salvo que se pida explícitamente). Pasos sugeridos:

1. Como despachador, asignar un incidente **con `latitud`/`longitud` capturadas** (ej. uno creado desde `Formulario911` con el mapa, que sí las exige) a un oficial con cuenta activa.
2. Entrar con la cuenta de ese oficial, ir a "Mis Despachos", abrir el incidente asignado.
3. Confirmar que se ve la pantalla "🚓 INICIAR NAVEGACIÓN" con folio, dirección y badge de prioridad — **sin** que el navegador haya pedido permiso de ubicación todavía.
4. Click en "INICIAR NAVEGACIÓN": el navegador pide permiso de ubicación. Aceptar.
5. Confirmar que aparece el mapa con una ruta real (por calles, no línea recta) desde la posición actual hasta el incidente, con ETA y distancia en el header, y el botón "✓ LLEGUÉ" visible.
6. Confirmar en BD (o en `TablonDespacho.tsx` como despachador) que `incidente_despacho_unidades.hora_salida` ya quedó poblada para ese despacho.
7. Confirmar que la campanita del despachador recibió `despacho.en_camino`.
8. Usando DevTools → Sensors → Location, mover la posición simulada progresivamente hacia el destino. A menos de ~80m del destino, confirmar que la vista cambia sola al formulario de cierre (`FormularioRecorrido embedded`), sin ninguna acción manual.
9. Confirmar en BD que `incidentes.estatus = 'en_sitio'` y `hora_llegada` quedó poblada.
10. Confirmar que la campanita del despachador recibió `despacho.en_sitio`.
11. Confirmar que el formulario de cierre viene con folio/descripción/calle/colonia/clasificación **y ubicación** prellenados (el mapa de la sección "Ubicación" del formulario ya centrado en las coordenadas correctas).
12. Completar y guardar el reporte. Confirmar que el incidente pasa a `atendido`/`cerrado_detencion` según corresponda, igual que antes de este plan.

## 3. Botón manual "LLEGUÉ" como respaldo

1. Repetir el flujo hasta el paso 5 (navegación iniciada).
2. En vez de simular la posición GPS, presionar directamente "✓ LLEGUÉ".
3. Confirmar que dispara exactamente el mismo resultado que el geofence automático (pasos 8-11 de la sección anterior).
4. Confirmar que no se puede disparar dos veces seguidas (el botón se deshabilita o no genera una segunda notificación/mutación si se hace doble click rápido).

## 4. Fallback sin coordenadas

1. Como despachador, asignar un incidente **sin** `latitud`/`longitud` (si no hay uno a mano, verificar contra BD cuáles incidentes reales tienen esas columnas en `NULL`, o crear uno de prueba sin pasar por el mapa del formulario, si el flujo de creación lo permite).
2. Entrar como el oficial asignado, abrir el detalle.
3. Confirmar que se ve el flujo **anterior** intacto: badge "SIN COORDENADAS — REGISTRO MANUAL" + botones "VOY EN CAMINO" / "MARCAR EN SITIO", sin ningún mapa ni pedido de permiso GPS.
4. Confirmar que ese flujo manual sigue funcionando exactamente igual que antes de este plan (mismo comportamiento, mismos datos que registra).

## 5. Casos borde

- **Permiso GPS denegado**: al hacer click en "INICIAR NAVEGACIÓN" y denegar el permiso, confirmar que se muestra un mensaje de error claro (no una pantalla en blanco ni un crash), y que el oficial de alguna forma puede seguir/reintentar (revisar qué UX quedó — si no hay forma de reintentar sin recargar la página, repórtalo como hallazgo, no es necesariamente un bloqueante pero vale la pena anotarlo).
- **Cierre directo sin pasar por llegada**: si por algún motivo el oficial logra cerrar el reporte sin que nunca se haya disparado ni el geofence ni el botón "LLEGUÉ" (ej. cerrando la pestaña y reabriendo en un estado raro), confirmar que el backfill de la Etapa 6 deja `hora_llegada` poblada igual (no `NULL`) al guardar el reporte.
- **Refuerzos**: si a un incidente ya en navegación se le agregan refuerzos (`enviarRefuerzos`), confirmar que el oficial original no pierde su sesión de navegación en curso, y que el/los oficial(es) de refuerzo, al entrar a su propio `/oficial/despachos/[id]`, ven su propia pantalla "INICIAR NAVEGACIÓN" independiente (cada oficial navega por su cuenta, no hay estado compartido de navegación entre elementos del mismo despacho).
- **Costo de Directions API**: revisar en Google Cloud Console, tras varias pruebas end-to-end, cuántas llamadas a Directions API se generaron por servicio — debería ser 1 (cálculo inicial) + como mucho 1-2 recálculos por desviación en un trayecto normal. Si se ven muchas más, revisar el throttle de la Etapa 3 (`RECALCULO_MIN_INTERVALO_MS`, `DESVIACION_RECALCULO_METROS`).

## 6. Cierre según convenciones del repo (`AGENTS.md`)

```bash
npx graphify update
```

### Actualizar la bóveda

- **`boveda/🧩 Features/Reporte Campo.md`**: reemplazar la sección "Voy en Camino / Marcar en Sitio" (que hoy describe los dos botones manuales) por una descripción del nuevo mecanismo: navegación en vivo con Directions API, disparo automático de `marcarEnCaminoOficial`/`marcarEnSitioOficial` por inicio de navegación y geofence de llegada, botón manual "LLEGUÉ" de respaldo, y el fallback de botones manuales para incidentes sin coordenadas. Mantener las referencias a `MarcarEnCaminoButton.tsx`/`MarcarEnSitioButton.tsx` pero aclarar que ahora solo se usan en el caso sin coordenadas.
- **`boveda/🧩 Features/911.md`**: agregar una entrada a la lista de reglas de negocio documentando que Directions API ya está habilitada y en uso para esta vista (aclarar que el mapa de asignación del despachador, `AsignacionMapa.tsx`, sigue usando Haversine — no confundir ambos mapas).
- **`boveda/🧩 Features/Notificaciones.md`** o donde corresponda: anotar que `despacho.en_camino`/`despacho.en_sitio` ya tienen emisor real (dejaron de ser configuración huérfana).
- Si aplica, agregar una entrada en `boveda/🗺 Roadmap/Changelog.md` describiendo el cambio.

### Verificación final

```bash
npx graphify update
```

Confirmar que el grafo se actualizó sin errores tras todos los cambios de archivo de este plan.

## Estado del plan

Una vez validados todos los puntos de este checklist, el plan queda cerrado. No quedan etapas pendientes.
