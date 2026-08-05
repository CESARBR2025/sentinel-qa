import pool from '../lib/db'
import { writeFileSync } from 'fs'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const SCHEMAS = ['public', 'via']

interface ColumnInfo {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

interface IndexInfo {
  indexname: string
  indexdef: string
}

interface ForeignKeyInfo {
  constraint_name: string
  column_name: string
  foreign_table: string
  foreign_column: string
}

async function getTables(schema: string): Promise<string[]> {
  const result = await pool.query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = $1 AND table_type = 'BASE TABLE'
     ORDER BY table_name`,
    [schema],
  )
  return result.rows.map(r => r.table_name)
}

async function getColumns(schema: string, table: string): Promise<ColumnInfo[]> {
  const result = await pool.query<ColumnInfo>(
    `SELECT column_name, data_type, is_nullable,
            column_default::text AS column_default
     FROM information_schema.columns
     WHERE table_schema = $1 AND table_name = $2
     ORDER BY ordinal_position`,
    [schema, table],
  )
  return result.rows
}

async function getEnums(schema: string): Promise<Record<string, string[]>> {
  const result = await pool.query<{ enum_name: string; enum_value: string }>(
    `SELECT t.typname AS enum_name, e.enumlabel AS enum_value
     FROM pg_type t
     JOIN pg_enum e ON t.oid = e.enumtypid
     JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
     WHERE n.nspname = $1
     ORDER BY t.typname, e.enumsortorder`,
    [schema],
  )
  const enums: Record<string, string[]> = {}
  for (const r of result.rows) {
    if (!enums[r.enum_name]) enums[r.enum_name] = []
    enums[r.enum_name].push(r.enum_value)
  }
  return enums
}

async function getIndexes(schema: string, table: string): Promise<IndexInfo[]> {
  const result = await pool.query<IndexInfo>(
    `SELECT indexname, indexdef FROM pg_indexes
     WHERE tablename = $1 AND schemaname = $2
     ORDER BY indexname`,
    [table, schema],
  )
  return result.rows
}

async function getForeignKeys(schema: string, table: string): Promise<ForeignKeyInfo[]> {
  const result = await pool.query<ForeignKeyInfo>(
    `SELECT tc.constraint_name, kcu.column_name, ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
     FROM information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
     JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
     WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1 AND tc.table_schema = $2
     ORDER BY tc.constraint_name`,
    [table, schema],
  )
  return result.rows
}

function typeToReadable(t: string): string {
  if (t.startsWith('timestamp')) return 'timestamp'
  if (t.startsWith('character varying')) return 'text'
  if (t === 'USER-DEFINED') return 'enum'
  return t
}

async function main() {
  let md = `# Esquema de Base de Datos — Sentinel SSPM

> Documentación generada desde \`information_schema\` el ${new Date().toISOString().split('T')[0]}.
> Fuente de verdad del schema real en PostgreSQL.

---

## Convenciones

- Los nombres están en **snake_case** (convención de PostgreSQL)
- \`public\` = tablas de aplicación
- \`via\` = tablas del módulo VIA (infracciones vehiculares)

---

## Nota sobre better-auth

Las 5 tablas \`users\`, \`sessions\`, \`accounts\`, \`verifications\`, \`two_factors\` son gestionadas exclusivamente por **better-auth** a través del adaptador Drizzle.
La aplicación **no debe modificarlas directamente**. Las columnas \`rol_id\` y \`dependencia_id\` en \`users\` se modifican vía server actions con raw SQL.

---

`

  for (const schema of SCHEMAS) {
    md += `## Schema \\\`${schema}\\\`\n\n`

    const enums = await getEnums(schema)
    if (Object.keys(enums).length > 0) {
      md += `### Enums\n\n`
      for (const [name, values] of Object.entries(enums)) {
        md += `- \`${name}\`: ${values.map(v => `\`${v}\``).join(', ')}\n`
      }
      md += '\n'
    }

    const tables = await getTables(schema)
    for (const table of tables) {
      const cols = await getColumns(schema, table)
      md += `### \\\`${table}\\\`\n\n`
      md += `| # | Columna | Tipo | Nulable | Default |\n`
      md += `|---|---------|------|---------|--------|\n`
      cols.forEach((c, i) => {
        md += `| ${i + 1} | \`${c.column_name}\` | \`${typeToReadable(c.data_type)}\` | ${c.is_nullable === 'YES' ? 'SÍ' : 'NO'} | ${c.column_default ? `\`${c.column_default.replace(/\|/g, '\\|')}\`` : '—'} |\n`
      })
      md += '\n'

      const fks = await getForeignKeys(schema, table)
      if (fks.length > 0) {
        md += `**Foreign Keys**\n\n`
        for (const fk of fks) {
          md += `- \`${fk.constraint_name}\`: \`${fk.column_name}\` → \`${fk.foreign_table}(${fk.foreign_column})\`\n`
        }
        md += '\n'
      }

      const indexes = await getIndexes(schema, table)
      const nonPkIndexes = indexes.filter(i => !i.indexname.endsWith('_pkey'))
      if (nonPkIndexes.length > 0) {
        md += `**Índices**\n\n`
        for (const idx of nonPkIndexes) {
          md += `- \`${idx.indexname}\`: \`${idx.indexdef.replace(/\|/g, '\\|')}\`\n`
        }
        md += '\n'
      }
    }
  }

  writeFileSync('boveda/📦 Datos/Esquema BD.md', md)
  console.log('✅ Esquema actualizado en boveda/📦 Datos/Esquema BD.md')
  await pool.end()
}

main().catch(console.error)
