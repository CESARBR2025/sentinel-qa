# Etapa 11 — Piezas pequeñas sueltas: `ContadorAsignaciones` + `ProfileDropdown` + `ToastExito`

No depende de otras etapas. Cierra el módulo Oficial. Leer `00-contexto.md` primero.

## Objetivo

Migrar 3 componentes pequeños y autocontenidos que no encajaron en las etapas anteriores.

## Archivos

- `components/oficial/ContadorAsignaciones.tsx` — badge con conteo de asignaciones activas. Inline pequeño, táctico (JetBrains Mono uppercase) → `DESIGN.md §3`/§6 (pill, `var(--radius-full)`). **No tocar**: el polling de 30s (`usePolling`) ni el listener de `visibilitychange`.
- `components/oficial/ProfileDropdown.tsx` — dropdown de perfil (avatar, logout) en el header. 100% inline, con `onMouseEnter/Leave` manual — puede migrarse a CSS `:hover` si se introduce una clase local, o mantenerse manual (reportar cuál). Aplicar radios/sombras de `DESIGN.md §6` al panel desplegable (probablemente glass, ya que es un panel flotante). **No tocar**: `authClient.signOut`.
- `components/oficial/ToastExito.tsx` — toast de confirmación (folio registrado), con `@keyframes slideIn` embebido. La animación de entrada puede quedarse (es motion con propósito: feedback de una acción) pero revisar que no tenga parpadeo infinito — solo entra y sale. Aplicar tipografía/radios de `DESIGN.md §3`/§6.

No tocar: ningún `setTimeout`/lógica de auto-cierre.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Verificación manual: el contador de asignaciones sigue actualizándose, el dropdown de perfil abre/cierra y cierra sesión correctamente, el toast aparece tras una acción exitosa y se oculta solo.
3. Con esto se cierra el módulo Oficial — correr un sanity check rápido navegando las 8 páginas del módulo antes de pasar a Despacho/911.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 12.
