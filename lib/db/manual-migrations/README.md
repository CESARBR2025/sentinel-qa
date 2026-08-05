# Migraciones manuales

Convención: `NNNN_descripcion.sql`, cuatro dígitos, sin colisiones.

- Verificar el siguiente número libre: `ls lib/db/manual-migrations | sed -E 's/^([0-9]+)_.*/\1/' | sort -n | tail -1`
- Cada archivo debe ser idempotente: usar `IF NOT EXISTS` / `IF EXISTS` en `CREATE INDEX`, `ALTER TABLE ... ADD COLUMN`, `DROP TABLE`, etc.
- Aplicar siempre en orden numérico ascendente.
- No renumerar migraciones ya aplicadas en producción sin coordinar — en desarrollo es seguro si el archivo no ha sido ejecutado fuera de este repo.
- Tras cualquier migración con índices/FKs nuevos, correr `npm run db:schema` para regenerar `boveda/📦 Datos/Esquema BD.md`.
