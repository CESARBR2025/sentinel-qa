Eres el worker de implementación para el repo `seguridad_publica` (Next.js 16 + Postgres, capa `lib/<modulo>/{types,repository,service,actions}.ts`, sin ORM salvo better-auth con Drizzle, migraciones SQL manuales en `lib/db/manual-migrations/`, deploy en Vercel).

Hay un plan ya diseñado en la carpeta `plan-notificaciones-forzadas/` (raíz del repo). Tu trabajo es **ejecutarlo etapa por etapa**, no rediseñarlo. Es la continuación directa de `plan-pwa-push/` (ya implementado, en producción) — reutiliza `enviarPush` (`lib/push/service.ts`), `usePushSubscription` (`hooks/usePushSubscription.ts`) y el sistema de tracking de ubicación de Oficial de Campo que ya existía antes de cualquiera de estos dos planes (`components/oficial/OficialUbicacionTracker.tsx`).

Cubre dos cosas con alcance distinto — no las mezcles:

1. **Notificaciones críticas más visibles** (todo el sistema): vibración en push, banner de pantalla completa que interrumpe la app aunque el usuario esté en otra sección, reenvío automático si sigue sin leerse, contador en el título de la pestaña.
2. **Modal obligatorio de ubicación + push activos** (**solo Oficial de Campo**, confirmado explícitamente con el usuario — ningún otro rol): bloqueo total de toda la app, sin botón de "continuar sin esto", hasta que ambos permisos estén concedidos.

Instrucciones:

1. Lee `plan-notificaciones-forzadas/README.md` completo primero.
2. Lee `plan-notificaciones-forzadas/00-contexto.md` completo — ahí está qué ya existe (no lo reconstruyas) y las 4 decisiones que ya tomó el usuario, en particular el alcance acotado del modal (solo Oficial de Campo) y que el bloqueo es total, sin excepción.
3. Antes de escribir código, revisa con tus propios ojos: `public/sw.js`, `components/notificaciones/CampanillaNotificaciones.tsx`, `lib/notificaciones/repository.ts`, `lib/notificaciones/checker.ts`, `app/api/cron/notificaciones/route.ts`, `app/api/notificaciones/contador/route.ts`, `components/oficial/OficialUbicacionTracker.tsx`, `components/oficial/MiUbicacionSection.tsx`, `app/oficial/layout.tsx`, `hooks/usePushSubscription.ts`, `lib/db/manual-migrations/README.md` y el archivo de migración más reciente. El plan describe su estado al 2026-08-05; si algo cambió, prioriza lo real y avísalo.
4. Ejecuta `etapa-1.md`. Al terminar, corre sus "Criterios de aceptación". Reporta qué hiciste y **detente** — no sigas a la Etapa 2 sin que el usuario confirme.
5. Repite el mismo patrón para `etapa-2.md` → `etapa-5.md`, siempre deteniéndote al final de cada una. Las etapas 1-4 no dependen entre sí, pero ejecútalas en orden numérico salvo que el usuario pida otra cosa.
6. Presta atención especial a la Etapa 3, sección "0. Verificación previa": antes de asumir que la escalación de críticas va a funcionar en producción, verifica si `/api/cron/notificaciones` ya tiene un disparador configurado (dashboard de Vercel → Cron Jobs, o `vercel.json` en el repo, que hoy no existe). Si no hay ninguno, sigue las instrucciones de esa sección para agregar `vercel.json` — pero confirma primero con el usuario el plan de Vercel del proyecto, porque el intervalo mínimo de cron depende de eso (Hobby vs. Pro).
7. En la Etapa 4, el componente `GuardiaPermisosOficial` se monta **solo** en `app/oficial/layout.tsx` — no lo repliques ni lo apliques a ningún otro layout de rol. No agregues ninguna forma de saltarse el bloqueo (el usuario lo pidió explícitamente así).
8. Si el código real no coincide con lo que describe el plan (tipo de columna, estructura de un archivo, numeración de migración), prioriza lo real, ajusta manteniendo el mismo patrón, y avísalo explícitamente en tu reporte — no lo resuelvas en silencio.
9. Antes de cualquier cambio de UI, lee `DESIGN.md` (raíz del repo) — el banner crítico y el modal de permisos deben verse consistentes con el resto de la app (Barlow Condensed / JetBrains Mono / Inter, paleta `#1f355a`/`#dc2626` para crítico), no inventar un estilo nuevo.
10. La migración de la Etapa 3 sigue la convención de `lib/db/manual-migrations/README.md` — verifica el siguiente número libre antes de nombrar el archivo, no asumas que sigue siendo `0042`.

Empieza confirmando que leíste `README.md` y `00-contexto.md`, y luego arranca la Etapa 1.
