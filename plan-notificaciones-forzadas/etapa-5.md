# Etapa 5 — Bóveda y verificación final

Leer primero `00-contexto.md`. Depende de todas las anteriores. Última etapa.

## Archivo a modificar: `boveda/🧩 Features/Notificaciones.md`

Ampliar la sección "Push a dispositivo (Web Push / VAPID)" (agregada por `plan-pwa-push/`) o agregar una nueva subsección al final cubriendo:

- **Alerta in-app de pantalla completa**: cuándo se dispara (`severidad: 'critico'`, no leída), de dónde sale el dato (`criticaMasRecienteSinLeer`, mismo polling de 30s que ya existía para el contador), y que "Descartar" no marca como leída (solo "Ver" lo hace).
- **Vibración en push crítico**: solo Android, campo `vibrate` en `sw.js`, se ignora sin error en plataformas sin soporte.
- **Escalación de críticas sin leer**: `UMBRAL_ESCALACION_MINUTOS`, columna `push_reescalado_en`, un solo reintento, corre en `/api/cron/notificaciones` — y el hallazgo importante de la Etapa 3 sobre si el cron ya estaba configurado o se agregó `vercel.json` (documentar el schedule real que quedó corriendo en producción, esto es importante para que quien lea la doc después sepa si el cron de verdad está vivo).
- **Contador en el título de la pestaña**: comportamiento y su limitación conocida (puede tardar hasta el siguiente poll en reflejar un cambio de ruta si el conteo no cambió).

## Archivo a modificar: `boveda/🏗 Arquitectura/Estructura.md` o el feature correspondiente a Oficial (si existe uno; si no, crear una sección breve dentro de `Notificaciones.md` o donde el usuario indique)

Documentar `GuardiaPermisosOficial`:
- Alcance: solo `/oficial/*`, montado en `app/oficial/layout.tsx` dentro de `OficialUbicacionProvider`.
- Comportamiento de bloqueo total (sin excepción), y por qué se decidió así (confirmado explícitamente con el usuario — ubicación y push son "vitales" para el funcionamiento del despacho de campo).
- Los 5 estados que cubre (ubicación no soportada / denegada / pendiente; push no soportado / denegado / pendiente / activo) y el colchón de seguridad de 8 segundos.
- Aclarar que **no** aplica a ningún otro rol — decisión explícita, no un olvido, para no generar la expectativa de que se agregue a Fiscalía/Admin sin que haya un consumidor real de esos datos ahí.

## Verificación final (todas las etapas juntas)

1. `npx tsc --noEmit` — sin errores en todo el proyecto.
2. `npm run build` — sin errores.
3. `npx graphify update`.
4. `npm run db:schema` refleja la columna `push_reescalado_en` de la Etapa 3.
5. Confirmar en `git status`/`git diff` que los únicos archivos tocados son los listados en las Etapas 1-5, y en particular que **ningún rol fuera de Oficial de Campo** quedó afectado por el guard de permisos (revisar que no se tocó ningún otro `layout.tsx` de rol).

## Criterios de aceptación

- Bóveda refleja ambos entregables (notificaciones más forzosas + guard de permisos) con el mismo nivel de detalle que el resto de `Notificaciones.md`.
- `npx tsc --noEmit` y `npm run build` limpios.
- Flujo end-to-end en dispositivo real de un Oficial de Campo (lo confirma el usuario): entrar a `/oficial` sin permisos activos → modal bloqueante → activar ambos → modal desaparece solo → recibir un despacho crítico → banner de pantalla completa + vibración + sonido distinto, aunque esté en otra sección de la app → no leerlo → después del umbral de escalación, llega un segundo push con `⚠`.
