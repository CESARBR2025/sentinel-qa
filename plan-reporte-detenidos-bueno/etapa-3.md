# Etapa 3 — Tabla y backend de antecedentes externos (captura manual)

Leer primero `00-contexto.md`. Requiere Etapa 2 confirmada.

## Objetivo

Nueva tabla para que Fiscalía registre manualmente antecedentes de la persona que obtiene de su plataforma externa (otro estado / fuente fuera de esta BD) — delitos o faltas administrativas previas que el sistema no puede calcular solo.

## Archivo a crear (migración)

`lib/db/manual-migrations/0038_antecedentes_externos_detenido.sql`

```sql
-- Antecedentes de un detenido capturados manualmente por Fiscalía desde una
-- fuente externa (plataforma estatal/nacional de otra entidad) a la que este
-- sistema no tiene acceso. Complementa (no reemplaza) los antecedentes
-- calculados automáticamente contra la BD local (ver lib/reporte-detenidos).

CREATE TABLE IF NOT EXISTS antecedentes_externos_detenido (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporte_campo_id uuid NOT NULL REFERENCES ofi_reportes_campo(id),
  tipo character varying NOT NULL CHECK (tipo IN ('DELITO', 'FALTA_ADMINISTRATIVA')),
  descripcion text NOT NULL,
  fecha date,
  lugar character varying,
  capturado_por text REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_antecedentes_externos_reporte ON antecedentes_externos_detenido (reporte_campo_id);
```

Revisa el tipo real de `users.id` en el esquema (`information_schema.columns`) antes de escribir el `REFERENCES users(id)` — en el resto del proyecto `capturado_por`/`creado_por` a veces es `text` y a veces `uuid` según la tabla; usa el que ya usa `ofi_reporte_denuncia.capturado_por` como referencia (es `text`, ver `lib/reporte-detenidos/00-contexto.md`... si no, confírmalo con una consulta a `information_schema` antes de escribir el DDL).

## Archivos a tocar (backend)

- `lib/fiscalia/types.ts`
- `lib/fiscalia/repository.ts`
- `lib/fiscalia/service.ts`
- `lib/fiscalia/actions.ts`

## Cambios

### `types.ts` — nuevo tipo

```ts
export interface AntecedenteExterno {
  id: string
  reporteCampoId: string
  tipo: 'DELITO' | 'FALTA_ADMINISTRATIVA'
  descripcion: string
  fecha: string | null
  lugar: string | null
  capturadoPorNombre: string | null
  createdAt: string
}

export interface AntecedenteExternoInput {
  tipo: 'DELITO' | 'FALTA_ADMINISTRATIVA'
  descripcion: string
  fecha: string | null
  lugar: string | null
}
```

### `repository.ts` — CRUD (sin UPDATE, solo agregar/listar/eliminar — son entradas de historial, no se editan, se corrigen borrando y volviendo a capturar)

```ts
export async function listarAntecedentesExternos(reporteCampoId: string): Promise<Record<string, unknown>[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT ae.id, ae.tipo, ae.descripcion, ae.fecha, ae.lugar, ae.created_at,
            CONCAT(u.name, ' ', COALESCE(u.apellido, '')) AS capturado_por_nombre
     FROM antecedentes_externos_detenido ae
     LEFT JOIN users u ON u.id = ae.capturado_por
     WHERE ae.reporte_campo_id = $1
     ORDER BY ae.fecha DESC NULLS LAST, ae.created_at DESC`,
    [reporteCampoId],
  )
  return result.rows
}

export async function insertarAntecedenteExterno(
  reporteCampoId: string,
  input: { tipo: string; descripcion: string; fecha: string | null; lugar: string | null },
  capturadoPor: string,
): Promise<void> {
  await query(
    `INSERT INTO antecedentes_externos_detenido (reporte_campo_id, tipo, descripcion, fecha, lugar, capturado_por)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [reporteCampoId, input.tipo, input.descripcion, input.fecha, input.lugar, capturadoPor],
  )
}

export async function eliminarAntecedenteExterno(id: string): Promise<void> {
  await query(`DELETE FROM antecedentes_externos_detenido WHERE id = $1`, [id])
}
```

Sigue el patrón de mapeo `row → tipo` que ya usa el resto de `lib/fiscalia/mapper.ts` (crea `rowToAntecedenteExterno` ahí en vez de mapear inline si prefieres consistencia con el resto del archivo).

### `service.ts` — wrappers delgados, mismo patrón que `guardarDetallesAseguradosService`

```ts
export async function listarAntecedentesExternosService(reporteCampoId: string): Promise<AntecedenteExterno[]> {
  const rows = await listarAntecedentesExternos(reporteCampoId)
  return rows.map(rowToAntecedenteExterno) // o inline si no creaste el mapper
}

export async function agregarAntecedenteExternoService(
  reporteCampoId: string,
  input: AntecedenteExternoInput,
  capturadoPor: string,
): Promise<void> {
  await insertarAntecedenteExterno(reporteCampoId, input, capturadoPor)
}

export async function eliminarAntecedenteExternoService(id: string): Promise<void> {
  await eliminarAntecedenteExterno(id)
}
```

### `actions.ts` — server actions, mismo patrón try/catch/verificarRolFiscalia que `guardarDetallesAseguradosAction`

```ts
export async function listarAntecedentesExternosAction(reporteCampoId: string) {
  try {
    await verificarRolFiscalia()
    return { data: await listarAntecedentesExternosService(reporteCampoId) }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[listarAntecedentesExternosAction]', msg)
    return { error: msg }
  }
}

export async function agregarAntecedenteExternoAction(reporteCampoId: string, input: AntecedenteExternoInput) {
  try {
    const session = await verificarRolFiscalia()
    await agregarAntecedenteExternoService(reporteCampoId, input, session.user.id)
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[agregarAntecedenteExternoAction]', msg)
    return { error: msg }
  }
}

export async function eliminarAntecedenteExternoAction(id: string) {
  try {
    await verificarRolFiscalia()
    await eliminarAntecedenteExternoService(id)
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[eliminarAntecedenteExternoAction]', msg)
    return { error: msg }
  }
}
```

Revisa la firma real de `verificarRolFiscalia()` en `lib/fiscalia/actions.ts` antes de copiar esto literal — ajusta si devuelve la sesión completa o solo hace `throw` si no tiene el rol.

## Verificación

1. Aplicar la migración contra la BD real, confirmar la tabla con `information_schema`.
2. `npx tsc --noEmit`.
3. Probar `agregarAntecedenteExternoAction` con un `reporteCampoId` real (de prueba) y confirmar que `listarAntecedentesExternosAction` lo devuelve.

## Criterios de aceptación

- Tabla creada, CRUD funcional (agregar/listar/eliminar), gateado a `verificarRolFiscalia`.
- `npx tsc --noEmit` limpio.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 4.**
