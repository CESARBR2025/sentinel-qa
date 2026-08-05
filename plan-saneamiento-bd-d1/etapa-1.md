# Etapa 1 — Gobernanza de esquema

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

Arreglar la colisión de numeración de migraciones, documentar la convención, y hacer que el exportador de esquema (`npm run db:schema`) incluya índices y FKs — necesario porque las etapas siguientes crean índices/FKs y hoy no hay forma automática de verificarlos en la bóveda.

## Archivos

- Rename: `lib/db/manual-migrations/0026_incidente_despacho_elementos_atiende_caso.sql` → `lib/db/manual-migrations/0031_incidente_despacho_elementos_atiende_caso.sql`
- Create: `lib/db/manual-migrations/README.md`
- Modify: `scripts/exportar-schema.ts`

## Cambios

### 1. Renumerar la migración duplicada

Ya está verificado con `git log --diff-filter=A --follow` cuál de los dos `0026_*.sql` es el original y cuál el duplicado posterior — **no hace falta volver a investigarlo**:
- `0026_notificaciones_por_rol.sql` — original (2026-07-29 11:00), **se queda igual, no se toca**.
- `0026_incidente_despacho_elementos_atiende_caso.sql` — duplicado posterior (2026-07-29 13:33), **se renombra a `0031_incidente_despacho_elementos_atiende_caso.sql`**.

```bash
git mv lib/db/manual-migrations/0026_incidente_despacho_elementos_atiende_caso.sql lib/db/manual-migrations/0031_incidente_despacho_elementos_atiende_caso.sql
```

Verificar que no queden colisiones:
```bash
ls lib/db/manual-migrations | sed -E 's/^([0-9]+)_.*/\1/' | sort | uniq -d
```
Debe devolver vacío. El siguiente número libre después de esta etapa es `0032` (usado en la Etapa 2).

**Importante**: si esta migración ya fue aplicada a la BD de desarrollo bajo el nombre `0026`, el rename de archivo no requiere ninguna acción sobre la BD — el contenido SQL no cambia, solo el nombre del archivo. No volver a ejecutar el `ALTER TABLE`/`CREATE` que contenga.

### 2. Documentar la convención

Crear `lib/db/manual-migrations/README.md`:

```markdown
# Migraciones manuales

Convención: `NNNN_descripcion.sql`, cuatro dígitos, sin colisiones.

- Verificar el siguiente número libre: `ls lib/db/manual-migrations | sed -E 's/^([0-9]+)_.*/\1/' | sort -n | tail -1`
- Cada archivo debe ser idempotente: usar `IF NOT EXISTS` / `IF EXISTS` en `CREATE INDEX`, `ALTER TABLE ... ADD COLUMN`, `DROP TABLE`, etc.
- Aplicar siempre en orden numérico ascendente.
- No renumerar migraciones ya aplicadas en producción sin coordinar — en desarrollo es seguro si el archivo no ha sido ejecutado fuera de este repo.
- Tras cualquier migración con índices/FKs nuevos, correr `npm run db:schema` para regenerar `boveda/📦 Datos/Esquema BD.md`.
```

### 3. Exportador de esquema — agregar índices y FKs

En `scripts/exportar-schema.ts`, agregar dos funciones (usar el mismo patrón de conexión/queries que ya usa el archivo para tablas/columnas):

```sql
-- índices por tabla
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = $1 AND schemaname = 'public';

-- foreign keys por tabla
SELECT tc.constraint_name, kcu.column_name, ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1;
```

Emitir en el markdown generado, por tabla, dos secciones nuevas "Índices" y "Foreign Keys" (seguir el estilo de sección ya usado para columnas en el mismo archivo).

## Criterios de aceptación

1. `ls lib/db/manual-migrations | sed -E 's/^([0-9]+)_.*/\1/' | sort | uniq -d` devuelve vacío.
2. `git status` muestra el rename limpio (no un delete+create con contenido distinto).
3. `npm run db:schema` corre sin error y `boveda/📦 Datos/Esquema BD.md` ahora lista "Índices" y "Foreign Keys" para al menos `ofi_reporte_denuncia` (que ya tiene FKs reales hoy, sirve para verificar que la query nueva funciona).
4. `npx tsc --noEmit` sin errores nuevos.
5. No modificar ningún otro archivo.

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-2.md`.**
