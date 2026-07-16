import { query } from "@/lib/db";

async function testIdempotencia() {
  const pool = (await import("@/lib/db")).default;

  console.log("[TEST] Iniciando prueba P0.1 — Lock guard idempotencia");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insertRes = await client.query(
      `INSERT INTO via.v2_infracciones
       (id, folio, seq_valor, estatus, estatus_dependencia,
        oficial_id, articulo_id, fraccion_id,
        ciudadano_presente, es_titular, presenta_ine,
        created_at, updated_at)
       VALUES
       (gen_random_uuid(), 'TEST-P0.1', 1, 'PENDIENTE', 'LIBERACION_PENDIENTE_DOCUMENTOS',
        gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
        true, true, false,
        NOW(), NOW())
       RETURNING id`,
    );
    const TEST_ID = insertRes.rows[0].id;
    console.log("[TEST] Infraccion ID:", TEST_ID);

    const LOCK_SQL = [
      "UPDATE via.v2_infracciones",
      "SET estatus_dependencia = 'LIBERACION_EN_PROCESO', updated_at = CURRENT_TIMESTAMP",
      "WHERE id = $1 AND estatus != 'CERRADA' AND estatus_dependencia != 'LIBERACION_EN_PROCESO'",
      "RETURNING id",
    ].join("\n");

    const results = await Promise.all(
      Array.from({ length: 6 }, (_, i) =>
        client.query<{ id: string }>(LOCK_SQL, [TEST_ID]).then((r) => ({
          attempt: i + 1,
          locked: r.rows.length > 0,
        })),
      ),
    );

    const locksAcquired = results.filter((r) => r.locked).length;
    console.log("[TEST] Intentos:", results.map((r) => "#" + r.attempt + ":" + r.locked).join(" "));

    if (locksAcquired === 1) {
      console.log("[TEST] OK: solo 1 de 6 adquirio el lock");
    } else {
      console.error("[TEST] FALLA —", locksAcquired, "locks (esperado: 1)");
    }

    const releaseSql = [
      "UPDATE via.v2_infracciones",
      "SET estatus_dependencia = 'LIBERACION_PENDIENTE_DOCUMENTOS', updated_at = CURRENT_TIMESTAMP",
      "WHERE id = $1",
    ].join("\n");
    await client.query(releaseSql, [TEST_ID]);

    const retry = await client.query<{ id: string }>(LOCK_SQL, [TEST_ID]);
    console.log("[TEST] Reintento tras liberacion:", retry.rows.length > 0 ? "OK lock adquirido" : "denegado");

    const closeSql = [
      "UPDATE via.v2_infracciones",
      "SET estatus = 'CERRADA', estatus_dependencia = 'LIBERADA_POR_INFRACCION', updated_at = CURRENT_TIMESTAMP",
      "WHERE id = $1",
    ].join("\n");
    await client.query(closeSql, [TEST_ID]);

    const afterClose = await client.query<{ id: string }>(LOCK_SQL, [TEST_ID]);
    console.log("[TEST] Lock tras CERRADA:", afterClose.rows.length === 0 ? "OK denegado" : "FALLA adquirido");

    await client.query("ROLLBACK");
    console.log("[TEST] Rollback OK");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

testIdempotencia()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("[TEST] Error:", e);
    process.exit(1);
  });
