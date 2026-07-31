# Verificación final — QA end-to-end

> Ejecutar **después** de completar las Etapas 1-4. No es una etapa de código — es el checklist de cierre del plan.

## 1. Typecheck y build

```bash
npx tsc --noEmit
npm run build
```

Ambos deben terminar sin errores.

## 2. Flujo completo — el camino feliz

El usuario del proyecto valida la UI en su propio navegador (no automatizar un navegador para esto salvo que se pida explícitamente). Pasos sugeridos:

1. Como despachador, asignar un incidente con `latitud`/`longitud` a un oficial con cuenta activa.
2. Entrar con la cuenta del oficial, abrir "Mis Despachos" → el incidente asignado.
3. Confirmar que se ve la card blanca `AsignacionCard`: folio grande, ubicación con ícono, badge de impacto coloreado según prioridad, botón "🚓 INICIAR NAVEGACIÓN" — no debe verse ningún mapa todavía.
4. Click en el botón → confirmar que abre un modal a **pantalla completa** (sin dejar ver la card ni el header de la página detrás) y entra **directo en modo navegación** (mapa inclinado, ícono 3D de patrulla) — sin pasar por una vista de arriba primero.
5. Confirmar en BD que `incidente_despacho_unidades.hora_salida` ya quedó poblada apenas se abrió el modal (no hace falta ninguna otra acción del oficial).
6. Dentro del modal, confirmar que "VISTA DE ARRIBA" alterna correctamente a la vista top-down y de regreso a "MODO NAVEGACIÓN".
7. Simular llegada con DevTools → Sensors → Location (mover la posición a menos de 80m del destino). Confirmar:
   - El mapa desaparece de inmediato (sin esperar respuesta del servidor).
   - Aparece la pantalla "HAS LLEGADO A DESTINO" con el ícono animado y el folio.
   - En BD, `incidentes.estatus` ya es `en_sitio` y `hora_llegada` ya está poblada.
8. Click en "ATENDER" → el modal se cierra por completo y aparece `FormularioRecorrido` embebido con el prefill de siempre (folio, calle, colonia, clasificación, ubicación en el mapa del formulario).
9. Completar y guardar el reporte — confirmar que el incidente pasa a `atendido`/`cerrado_detencion` según corresponda, sin cambios respecto al comportamiento anterior a este plan.

## 3. Botón manual "YA ESTOY AQUÍ"

1. Repetir el flujo hasta el paso 6 (dentro del modal, en modo navegación, sin haber llegado realmente).
2. Presionar "YA ESTOY AQUÍ" directamente.
3. Confirmar que dispara exactamente el mismo resultado que el geofence automático (pasos 7-8 de la sección anterior).
4. Confirmar que no se puede disparar dos veces seguidas (doble click rápido no genera una segunda notificación/mutación ni rompe la transición de pantalla).

## 4. Casos borde

- **Recargar la página con el modal abierto**: al recargar, el modal se pierde (es estado local de React, no persistido) y el oficial vuelve a ver la card `AsignacionCard`. Confirmar que tocar "Iniciar navegación" de nuevo no rompe nada (la guarda `estatus !== 'en_despacho'` en `marcarEnCaminoOficial` es idempotente — no hay error visible, solo un `COALESCE` que no pisa `hora_salida` ya registrada).
- **Permiso GPS denegado dentro del modal**: confirmar que se muestra el mensaje de error existente, sin quedar en una pantalla en blanco, y sin que el modal se cierre solo.
- **Incidente ya en `en_sitio` al entrar** (el oficial ya había llegado antes y solo le falta cerrar el reporte): confirmar que va directo a `FormularioRecorrido embedded`, sin pasar por la card ni el modal en absoluto.

## 5. Revisión visual (criterio del usuario, "estilos bonitos")

- La card `AsignacionCard` debe verse como una tarjeta blanca elevada, con jerarquía tipográfica clara (folio grande, labels pequeños en mayúsculas con buen contraste), no como un formulario plano.
- El badge de impacto debe cambiar de color según la prioridad real del incidente (`MEDIA` amarillo, `ALTA` naranja, `CRITICA` rojo, `BAJA` azul).
- La pantalla de llegada debe sentirse como una confirmación positiva (ícono verde animado, no un simple texto plano).
- Ningún elemento de esta nueva UI debe introducir `border-radius` grande ni tipografías fuera de la paleta ya usada en el resto del proyecto (`Inter`/`Barlow Condensed`/`JetBrains Mono`).

## 6. Cierre según convenciones del repo (`AGENTS.md`)

```bash
npx graphify update
```

### Actualizar la bóveda

- **`boveda/🧩 Features/911.md`** o **`boveda/🧩 Features/Reporte Campo.md`**: documentar el nuevo flujo card → modal → pantalla de llegada → Atender, mencionando que reemplaza a la pantalla "no_iniciado" embebida y al salto abrupto anterior (referenciar `AsignacionCard.tsx`, `NavegacionModal.tsx`, y la nueva prop `onAtender` de `NavegacionDespacho.tsx`).
- Si aplica, agregar una entrada en `boveda/🗺 Roadmap/Changelog.md`.

## Estado del plan

Una vez validados todos los puntos de este checklist, el plan queda cerrado. No quedan etapas pendientes.
