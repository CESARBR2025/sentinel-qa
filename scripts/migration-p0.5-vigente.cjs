const { Pool } = require("pg");
const pool = new Pool({
  host: "189.141.67.102", port: 5432, user: "postgres",
  password: "AdminSJR@2025", database: "seguridad_publica",
});

async function run() {
  const c = await pool.connect();
  try {
    await c.query("ALTER TABLE via.v2_ordenes_pago_sa7 ADD COLUMN IF NOT EXISTS vigente boolean NOT NULL DEFAULT true");
    console.log("columna vigente OK");

    await c.query(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_orden_pago_vigente_unico ON via.v2_ordenes_pago_sa7 (infraccion_id) WHERE vigente = true",
    );
    console.log("indice OK");

    await c.query(`
      UPDATE via.v2_ordenes_pago_sa7 o1
      SET vigente = false
      WHERE EXISTS (
        SELECT 1 FROM via.v2_ordenes_pago_sa7 o2
        WHERE o2.infraccion_id = o1.infraccion_id
          AND (
            (o2.created_at > o1.created_at AND o2.id != o1.id)
            OR (o1.fecha_vencimiento IS NOT NULL AND o1.fecha_vencimiento < NOW())
          )
      )
    `);
    console.log("backfill OK");
  } finally {
    c.release();
    await pool.end();
  }
}

run().catch((e) => { console.error(e.message); process.exit(1); });
