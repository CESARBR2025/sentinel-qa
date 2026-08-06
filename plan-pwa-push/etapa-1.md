# Etapa 1 — Dependencia, VAPID keys y migración: `push_subscriptions`

Leer primero `00-contexto.md` completo.

## 1. Instalar dependencia

```bash
npm install web-push
npm install -D @types/web-push
```

Verificar en `package.json` que quedó en `dependencies` (no `devDependencies`) `web-push`, y `@types/web-push` en `devDependencies`.

## 2. Generar el par de llaves VAPID

```bash
npx web-push generate-vapid-keys
```

Agregar al `.env` (raíz del repo, **no** commitear valores reales fuera de ese archivo):

```
VAPID_PUBLIC_KEY=<clave pública generada>
VAPID_PRIVATE_KEY=<clave privada generada>
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<la misma clave pública — necesaria en el cliente>
VAPID_SUBJECT=mailto:soporte@sspm-sjr.gob.mx
```

`VAPID_SUBJECT` es obligatorio para el protocolo — puede ser un `mailto:` o una URL; usar un correo de contacto real del proyecto (confirmar con el usuario si `soporte@sspm-sjr.gob.mx` no es el correcto antes de dejarlo fijo en la doc final de Etapa 7).

Actualizar `boveda/🛠 Stack/Variables de Entorno.md` agregando las 4 variables a la tabla `AUTO-GENERATED` (mismo formato que las filas existentes, columna "Requerida" = Sí para las 4).

## 3. Migración: tabla `push_subscriptions`

Verificar el siguiente número libre: `ls lib/db/manual-migrations | sed -E 's/^([0-9]+)_.*/\1/' | sort -n | tail -1` (al momento de diseñar este plan, el último era `0039`, así que este archivo sería `0040`).

**Antes de escribir el `REFERENCES users(id)`**, confirmar el tipo real de `users.id` corriendo contra la BD real (`psql "$DATABASE_URL" -c "\d users"` o equivalente, o revisar `lib/db/schema.ts`) — better-auth normalmente usa `text`, pero verificar contra la BD real antes de fijar el tipo en el `CREATE TABLE`, no asumir.

`lib/db/manual-migrations/0040_push_subscriptions.sql`:

```sql
-- Suscripciones Web Push (VAPID) por dispositivo. Un usuario puede tener
-- varias filas (celular, laptop, tablet). endpoint es único por navegador +
-- dispositivo + origen, lo asigna el push service del navegador (FCM, Mozilla
-- Push, Apple Push). Ver 00-contexto.md del plan plan-pwa-push/.

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  creado_en timestamptz NOT NULL DEFAULT NOW(),
  ultimo_uso timestamptz
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON push_subscriptions (user_id);
```

Aplicarla siguiendo el mismo procedimiento que las migraciones anteriores (ver `lib/db/manual-migrations/README.md`).

## Después de aplicar

Correr `npm run db:schema` para regenerar `boveda/📦 Datos/Esquema BD.md` con la tabla nueva.

## Criterios de aceptación

1. `web-push` en `dependencies`, `@types/web-push` en `devDependencies` de `package.json`.
2. Las 4 variables VAPID existen en `.env` con valores reales generados (no placeholders).
3. La tabla `push_subscriptions` existe en la BD real con las columnas listadas, `endpoint` con constraint `UNIQUE`, FK a `users(id)` con `ON DELETE CASCADE`.
4. `npm run db:schema` corrió sin error y `boveda/📦 Datos/Esquema BD.md` refleja la tabla nueva.
5. `boveda/🛠 Stack/Variables de Entorno.md` incluye las 4 variables nuevas.
6. No se modificó ninguna migración existente (`0001`...`0039`).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 2.
