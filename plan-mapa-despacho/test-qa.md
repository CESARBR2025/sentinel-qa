# Fase de QA — validar la regla de "unidad ya ocupada" con datos de prueba

> Repo: `seguridad_publica` (Next.js 16.2.4, Postgres, sin ORM para este dominio — todo SQL crudo). Fase final del plan "Mapa tipo Uber en Asignar Unidades". **Requiere que la Etapa 6 ya esté construida y compilando.** Ver `00-contexto.md` y `etapa-6.md` para el trasfondo completo de la regla de negocio que se está validando aquí.

## Objetivo

Sembrar datos de prueba directamente en la base de datos (oficiales, patrullas, incidentes, despachos) para poder ver en el mapa/lista de asignación cómo se distinguen visualmente unidades libres de unidades ocupadas, y confirmar funcionalmente que el backend (Etapa 6) bloquea la asignación de una unidad ocupada mientras permite la de una libre.

## ⚠️ Advertencias antes de empezar

- **Ejecutar contra una base de datos de desarrollo/staging, nunca contra producción.** Verifica `DATABASE_URL` en tu `.env` antes de correr cualquier `INSERT`.
- Usa el prefijo **`QA-`** en todo dato identificable de texto (número de unidad, placas, folio, nombre) para poder ubicarlo y limpiarlo sin ambigüedad.
- Todos los `INSERT` de este documento asumen que se ejecutan con `psql` (o un cliente Postgres equivalente) usando la misma cadena de conexión de `DATABASE_URL`. Guarda cada `id` generado (`RETURNING id`) — los vas a necesitar en pasos posteriores.
- Este documento no incluye una migración ni script `.sql` nuevo en el repo — es una guía de comandos a ejecutar manualmente y verificar. Si prefieres, estos mismos statements se pueden envolver en un script `tsx` puntual (siguiendo el patrón de `lib/db/create-admin.ts`), pero no es obligatorio para completar esta fase.

## Paso 1 — Punto de referencia geográfico

Usa el mismo punto que ya usa el proyecto como default de San Juan del Río (`COORDS_DEFAULT` en `lib/incidentes/actions.ts`): `{ lat: 20.3889, lng: -99.9961 }`. Todas las coordenadas de prueba de este documento están armadas como variaciones pequeñas alrededor de ese punto.

## Paso 2 — Crear usuarios + oficiales de prueba

Se necesitan 6 oficiales de prueba (uno por patrulla del Paso 3). Cada oficial requiere primero una fila en `users` (FK `ofi_oficiales.user_id`, `NOT NULL`). No hace falta que puedan iniciar sesión (no se les crea fila en `accounts`), solo que existan para satisfacer la FK.

```sql
-- Repite este bloque para QA-01 .. QA-06 (aquí solo QA-01 como plantilla; ejecuta los 6)
INSERT INTO users (id, name, apellido, email, email_verified, activo, two_factor_enabled)
VALUES ('qa-user-01', 'OFICIAL', 'PRUEBA QA-01', 'qa-oficial-01@test.local', true, true, false)
RETURNING id;

INSERT INTO ofi_oficiales (user_id, no_nomina, numero_empleado, telefono, patrulla_id, ofi_estatus)
VALUES ('qa-user-01', 'QA-NOM-01', 'QA-EMP-01', '4270000001', NULL, 'activo')
RETURNING id;
```

Nota: `patrulla_id` se deja `NULL` en este INSERT porque la patrulla todavía no existe (Paso 3) — se actualiza después con un `UPDATE ofi_oficiales SET patrulla_id = ...`. Usa ids de `users` fáciles de identificar como `qa-user-01`..`qa-user-06` (la columna `users.id` es `text`, no `uuid`, así que un id legible es válido — sigue el mismo patrón que usa `better-auth`/`generateId()` en el resto del proyecto, pero para datos de prueba un id manual es más fácil de referenciar en los pasos siguientes).

## Paso 3 — Crear patrullas de prueba

6 patrullas: 4 "libres" (QA-01 a QA-04) a distintas distancias del punto de referencia, y 2 que en el Paso 6 se marcarán "ocupadas" (QA-05, QA-06).

```sql
INSERT INTO via.v2_patrullas (numero_unidad, placas, descripcion, activo, sincronizado_en) VALUES
  ('P-QA-01', 'QA-PLACA-01', 'Patrulla de prueba QA - libre, muy cercana', true, NOW()),
  ('P-QA-02', 'QA-PLACA-02', 'Patrulla de prueba QA - libre, cercana',      true, NOW()),
  ('P-QA-03', 'QA-PLACA-03', 'Patrulla de prueba QA - libre, lejana',       true, NOW()),
  ('P-QA-04', 'QA-PLACA-04', 'Patrulla de prueba QA - libre, ubicacion vieja', true, NOW()),
  ('P-QA-05', 'QA-PLACA-05', 'Patrulla de prueba QA - OCUPADA en otro incidente', true, NOW()),
  ('P-QA-06', 'QA-PLACA-06', 'Patrulla de prueba QA - OCUPADA en otro incidente', true, NOW())
RETURNING id, numero_unidad;
```

Guarda los 6 `id` devueltos (son `uuid`) — los necesitas para los `UPDATE` del Paso 4, el Paso 6, y las pruebas del Paso 8. Para el resto de este documento se referencian como `<id-patrulla-QA-01>` … `<id-patrulla-QA-06>`.

## Paso 4 — Vincular oficiales a patrullas y posicionarlos

```sql
UPDATE ofi_oficiales SET patrulla_id = '<id-patrulla-QA-01>' WHERE user_id = 'qa-user-01';
UPDATE ofi_oficiales SET patrulla_id = '<id-patrulla-QA-02>' WHERE user_id = 'qa-user-02';
UPDATE ofi_oficiales SET patrulla_id = '<id-patrulla-QA-03>' WHERE user_id = 'qa-user-03';
UPDATE ofi_oficiales SET patrulla_id = '<id-patrulla-QA-04>' WHERE user_id = 'qa-user-04';
UPDATE ofi_oficiales SET patrulla_id = '<id-patrulla-QA-05>' WHERE user_id = 'qa-user-05';
UPDATE ofi_oficiales SET patrulla_id = '<id-patrulla-QA-06>' WHERE user_id = 'qa-user-06';

-- Posiciones: variaciones pequeñas alrededor de (20.3889, -99.9961)
-- QA-01: ~300m del punto de referencia (muy cercana), ubicación fresca
UPDATE ofi_oficiales SET ultima_lat = 20.3910, ultima_lng = -99.9955, ultima_ubicacion_en = NOW()
WHERE user_id = 'qa-user-01';

-- QA-02: ~1.2km (cercana), ubicación fresca
UPDATE ofi_oficiales SET ultima_lat = 20.3980, ultima_lng = -99.9920, ultima_ubicacion_en = NOW()
WHERE user_id = 'qa-user-02';

-- QA-03: ~6km (lejana), ubicación fresca
UPDATE ofi_oficiales SET ultima_lat = 20.4350, ultima_lng = -99.9500, ultima_ubicacion_en = NOW()
WHERE user_id = 'qa-user-03';

-- QA-04: ~800m (cercana), pero ubicación reportada hace 20 minutos (para probar el estado "no fresca" de la Etapa 4)
UPDATE ofi_oficiales SET ultima_lat = 20.3950, ultima_lng = -99.9980, ultima_ubicacion_en = NOW() - INTERVAL '20 minutes'
WHERE user_id = 'qa-user-04';

-- QA-05: ~500m (cercana si no estuviera ocupada), ubicación fresca
UPDATE ofi_oficiales SET ultima_lat = 20.3920, ultima_lng = -99.9930, ultima_ubicacion_en = NOW()
WHERE user_id = 'qa-user-05';

-- QA-06: ~2km, ubicación fresca
UPDATE ofi_oficiales SET ultima_lat = 20.4050, ultima_lng = -100.0050, ultima_ubicacion_en = NOW()
WHERE user_id = 'qa-user-06';
```

## Paso 5 — Crear el incidente objetivo (el que se va a despachar en las pruebas)

```sql
INSERT INTO incidentes (
  folio, folio_consecutivo, canal, tipo_reporte, anonimo, es_usuario_frecuente,
  es_persona_afectada, es_migrante, municipio, latitud, longitud,
  fecha_hora_inicio, requiere_despacho, estatus, capturado_por
) VALUES (
  'QA/INC/OBJETIVO/001',
  (SELECT COALESCE(MAX(folio_consecutivo), 0) + 1 FROM incidentes WHERE EXTRACT(YEAR FROM creado_en) = EXTRACT(YEAR FROM NOW())),
  '911', 'normal', false, false, false, false, 'San Juan del Río',
  20.3889, -99.9961,
  NOW(), true, 'sin_despachar', 'qa-user-01'
)
RETURNING id;
```

Guarda el `id` devuelto como `<id-incidente-objetivo>` — es el incidente contra el que vas a probar `createDespacho`/`enviarRefuerzos` y el que abrirás en el tablón real para ver el mapa.

## Paso 6 — Simular unidades "ocupadas": crear un incidente ocupante con despacho activo

```sql
-- Incidente "ocupante" — ya en despacho, para que QA-05 y QA-06 queden marcadas como ocupadas
INSERT INTO incidentes (
  folio, folio_consecutivo, canal, tipo_reporte, anonimo, es_usuario_frecuente,
  es_persona_afectada, es_migrante, municipio, latitud, longitud,
  fecha_hora_inicio, requiere_despacho, estatus, capturado_por
) VALUES (
  'QA/INC/OCUPANTE/001',
  (SELECT COALESCE(MAX(folio_consecutivo), 0) + 1 FROM incidentes WHERE EXTRACT(YEAR FROM creado_en) = EXTRACT(YEAR FROM NOW())),
  '911', 'normal', false, false, false, false, 'San Juan del Río',
  20.4200, -99.9700,
  NOW() - INTERVAL '30 minutes', true, 'en_despacho', 'qa-user-01'
)
RETURNING id;
-- guarda como <id-incidente-ocupante>

INSERT INTO incidente_despacho (incidente_id, despachado_por)
VALUES ('<id-incidente-ocupante>', 'qa-user-01')
RETURNING id;
-- guarda como <id-despacho-ocupante>

INSERT INTO incidente_despacho_unidades (despacho_id, unidad_ext_id, unidad_placa) VALUES
  ('<id-despacho-ocupante>', '<id-patrulla-QA-05>', 'QA-PLACA-05'),
  ('<id-despacho-ocupante>', '<id-patrulla-QA-06>', 'QA-PLACA-06');
```

Con esto: QA-01 a QA-04 quedan libres; QA-05 y QA-06 quedan ocupadas (asignadas al incidente ocupante, que está `en_despacho`).

## Paso 7 — Verificación visual en el mapa/lista real

1. Levanta el proyecto (`npm run dev` o el comando habitual) y entra al tablón de despacho como usuario operador/911.
2. Localiza el incidente `QA/INC/OBJETIVO/001` en la pestaña "pendientes" (folio visible en la card).
3. Expándelo y abre "Elegir unidades cercanas".
4. Verificar en el mapa y en la lista:
   - QA-01 aparece como la más cercana (marcador verde en el mapa, badge "Más cercana" en la lista).
   - QA-02 y QA-05 aparecen como cercanas (si QA-05 no estuviera ocupada, sería de las más cercanas — verifica que aun así se vea marcada como OCUPADA y no como cercana seleccionable).
   - QA-03 aparece como lejana (marcador gris/opacidad reducida).
   - QA-04 aparece cercana pero con indicador de ubicación no fresca (borde punteado / antigüedad de ~20 min visible).
   - QA-05 y QA-06 aparecen con el badge/estilo "OCUPADA", no seleccionables ni desde el mapa ni desde la lista (click no las marca como seleccionadas).

## Paso 8 — Casos de prueba funcionales (backend)

Ejecuta estos casos usando el flujo real de la UI cuando sea posible (más representativo), y al menos uno directo contra la server action para confirmar que el bloqueo no depende solo del cliente.

1. **Despachar unidad libre (control):** selecciona QA-01 desde el picker y confirma el despacho del incidente objetivo. Debe completarse normalmente. Verifica con:
   ```sql
   SELECT * FROM incidente_despacho_unidades idu
   JOIN incidente_despacho id2 ON id2.id = idu.despacho_id
   WHERE id2.incidente_id = '<id-incidente-objetivo>' AND idu.unidad_ext_id = '<id-patrulla-QA-01>';
   ```
   Debe devolver 1 fila.

2. **Intentar despachar unidad ocupada (bypaseando la UI):** en un entorno de prueba/consola de Node (o un endpoint temporal de prueba, o `tsx` ad-hoc), invoca `createDespacho` con un `FormData` armado a mano que incluya `incidenteId = <id-incidente-objetivo>` y `unidades` incluyendo `{ extId: '<id-patrulla-QA-06>', placa: 'QA-PLACA-06' }`. Debe lanzar el `ValidationError` de la Etapa 6 y no insertar nada. Verifica:
   ```sql
   SELECT * FROM incidente_despacho_unidades idu
   JOIN incidente_despacho id2 ON id2.id = idu.despacho_id
   WHERE id2.incidente_id = '<id-incidente-objetivo>' AND idu.unidad_ext_id = '<id-patrulla-QA-06>';
   ```
   Debe devolver 0 filas.

3. **Refuerzo al mismo incidente no se autobloquea:** con el incidente objetivo ya despachado (paso 1), intenta `enviarRefuerzos` agregando QA-02 al mismo incidente objetivo. Debe funcionar sin que la validación de "ocupada" lo bloquee (QA-02 no está en otro incidente).

4. **Liberación tras cerrar el incidente ocupante:**
   ```sql
   UPDATE incidentes SET estatus = 'atendido', actualizado_en = NOW() WHERE id = '<id-incidente-ocupante>';
   ```
   Vuelve a abrir el picker del incidente objetivo (o espera un ciclo de polling si el modal sigue abierto) y confirma que QA-05 y QA-06 ahora aparecen libres y seleccionables.

## Paso 9 — Limpieza (obligatorio al terminar)

Ejecutar en este orden exacto (respeta FKs):

```sql
-- 1. Unidades de despacho (objetivo + ocupante)
DELETE FROM incidente_despacho_unidades
WHERE despacho_id IN (
  SELECT id FROM incidente_despacho
  WHERE incidente_id IN (
    SELECT id FROM incidentes WHERE folio LIKE 'QA/INC/%'
  )
);

-- 2. Despachos
DELETE FROM incidente_despacho
WHERE incidente_id IN (SELECT id FROM incidentes WHERE folio LIKE 'QA/INC/%');

-- 3. Incidentes de prueba
DELETE FROM incidentes WHERE folio LIKE 'QA/INC/%';

-- 4. Oficiales de prueba
DELETE FROM ofi_oficiales WHERE user_id LIKE 'qa-user-%';

-- 5. Patrullas de prueba
DELETE FROM via.v2_patrullas WHERE numero_unidad LIKE 'P-QA-%';

-- 6. Usuarios de prueba
DELETE FROM users WHERE id LIKE 'qa-user-%';
```

Verifica que las 6 queries anteriores no dejan nada huérfano:
```sql
SELECT count(*) FROM incidentes WHERE folio LIKE 'QA/INC/%';        -- debe ser 0
SELECT count(*) FROM via.v2_patrullas WHERE numero_unidad LIKE 'P-QA-%'; -- debe ser 0
SELECT count(*) FROM users WHERE id LIKE 'qa-user-%';                -- debe ser 0
```

## Criterios de aceptación de esta fase

1. Los 4 casos del Paso 8 se comportan como se describe (1 y 3 funcionan, 2 se rechaza sin insertar, 4 libera correctamente).
2. La verificación visual del Paso 7 muestra las 6 unidades de prueba con el estilo correcto (más cercana, cercanas, lejana, no fresca, 2 ocupadas).
3. La limpieza del Paso 9 no deja ningún registro con prefijo `QA-`/`qa-user-`/`QA/INC/` en ninguna tabla tocada (las 3 queries de verificación devuelven 0).
