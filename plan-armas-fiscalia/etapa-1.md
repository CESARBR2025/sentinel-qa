# Etapa 1 — Migración BD

## Objetivo

Crear la tabla donde Fiscalía captura las armas estructuradas, y preparar
`formato_n_armas_aseguradas` para poder sincronizarse desde ahí por id de
origen (mismo patrón que `origen_incidente_id`/`origen_reporte_campo_id` de
la migración 0047).

## Archivos a tocar

- Nuevo: `lib/db/manual-migrations/0048_fiscalia_armas_aseguradas.sql`
  (el siguiente número libre — confirmar con
  `ls lib/db/manual-migrations | sed -E 's/^([0-9]+)_.*/\1/' | sort -n | tail -1`
  antes de nombrarlo, por si alguien más agregó una migración entre tanto).

## Verificación previa obligatoria (no asumir)

Antes de decidir si `fiscalia_armas_aseguradas` lleva FK física a
`ofi_reportes_campo(id)`, confirmar contra la BD real si las tablas gemelas
ya existentes la llevan:

```sql
SELECT tc.table_name, kcu.column_name, ccu.table_name AS references_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('evidencias_detenido', 'antecedentes_externos_detenido');
```

Replicar exactamente lo que salga (si no tienen FK física, `fiscalia_armas_aseguradas`
tampoco la lleva — consistencia con el resto de `lib/fiscalia`).

## SQL de la migración

Idempotente (`IF NOT EXISTS` en todo), como el resto de `manual-migrations/`:

```sql
CREATE TABLE IF NOT EXISTS "fiscalia_armas_aseguradas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporte_campo_id" uuid NOT NULL,
	"tipo_arma" varchar(120) NOT NULL,
	"marca" varchar(120),
	"matricula" varchar(80),
	"calibre" varchar(40),
	"observaciones" text,
	"capturado_por" text NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "faa_reporte_campo_idx" ON "fiscalia_armas_aseguradas" ("reporte_campo_id");
--> statement-breakpoint
ALTER TABLE "formato_n_armas_aseguradas" ADD COLUMN IF NOT EXISTS "origen_fiscalia_arma_id" uuid;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "fnaa_origen_fiscalia_arma_uq" ON "formato_n_armas_aseguradas" ("origen_fiscalia_arma_id") WHERE "origen_fiscalia_arma_id" IS NOT NULL;
```

(Si el paso de verificación previa muestra que las tablas gemelas SÍ tienen FK
física, agregar `CONSTRAINT "faa_reporte_campo_fk" FOREIGN KEY
("reporte_campo_id") REFERENCES "public"."ofi_reportes_campo"("id") ON DELETE
CASCADE` al `CREATE TABLE` — pero solo en ese caso, para no romper el patrón
existente.)

## Cómo aplicarla

Igual que la migración 0047 en esta misma sesión — **no hay runner
automático**, se aplica con un script tsx temporal contra el pool real:

```ts
// scripts/tmp-migrate-0048.ts (borrar después de correrlo)
import { readFileSync } from 'node:fs'
import { loadEnvConfig } from '@next/env'

async function main() {
  loadEnvConfig(process.cwd())
  const { default: pool, query } = await import('@/lib/db')
  const sql = readFileSync('lib/db/manual-migrations/0048_fiscalia_armas_aseguradas.sql', 'utf-8')
  const statements = sql.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean)
  for (const stmt of statements) {
    console.log('Ejecutando:', stmt.slice(0, 100).replace(/\s+/g, ' '), '...')
    await query(stmt)
  }
  console.log('Migración 0048 aplicada correctamente.')
  await pool.end()
}
main().catch(err => { console.error(err); process.exit(1) })
```

`npx tsx scripts/tmp-migrate-0048.ts`, luego borrar el script.

**IMPORTANTE — `DATABASE_URL` en este proyecto apunta a un servidor remoto real
(no localhost).** Confirmar con el usuario antes de ejecutar el script contra
la BD (es aditivo — `ADD COLUMN`/`CREATE TABLE`/`CREATE INDEX`, no destructivo
— pero sigue siendo una escritura en infraestructura compartida real).

Después de aplicar: `npm run db:schema` (regenera
`boveda/📦 Datos/Esquema BD.md` desde el esquema real).

## Criterios de aceptación

1. La migración corre sin error contra la BD real.
2. `SELECT * FROM fiscalia_armas_aseguradas LIMIT 1` no truena (tabla existe,
   vacía).
3. `SELECT origen_fiscalia_arma_id FROM formato_n_armas_aseguradas LIMIT 1` no
   truena (columna existe).
4. Insertar dos filas de prueba en `formato_n_armas_aseguradas` con el mismo
   `origen_fiscalia_arma_id` debe fallar por el índice único parcial;
   insertarlas con `origen_fiscalia_arma_id = NULL` en ambas debe funcionar
   sin problema (confirma que el índice es parcial, no total).
5. `npm run db:schema` corre sin error y `boveda/📦 Datos/Esquema BD.md` refleja
   las dos tablas/columnas nuevas.
6. Script temporal borrado del repo antes de terminar la etapa.
