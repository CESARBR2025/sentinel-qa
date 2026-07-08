<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# No Drizzle — raw pg only (except better-auth)

Never use Drizzle ORM (`drizzle-orm`, `db.insert`, `db.select`, etc.) in application code. All database access is via raw SQL with the `query` export from `@/lib/db`. The only exception is `lib/auth.ts` which uses Drizzle internally for `better-auth`. The `@/lib/db/index.ts` drizzle instance is used exclusively by better-auth and must never be imported in application code.
