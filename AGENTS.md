<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# No Drizzle — raw pg only

Never use Drizzle ORM (`drizzle-orm`, `db.insert`, `db.select`, etc.). All database access is via raw SQL with the `query`, `queryVia`, and `viaPool` exports from `@/lib/db`. The `@/lib/db/index.ts` drizzle instance is never used for queries.
