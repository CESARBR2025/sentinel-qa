import { query } from "@/lib/db";

async function clean() {
  console.log("[CLEAN] Eliminando datos demo de infracciones...");
  await query("DELETE FROM via.v2_documentos_liberacion");
  await query("DELETE FROM via.v2_solicitudes_liberacion");
  await query("DELETE FROM via.v2_ordenes_pago_sa7");
  await query("DELETE FROM via.v2_infracciones");
  console.log("[CLEAN] OK");
}

clean()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("[CLEAN] Error:", e);
    process.exit(1);
  });
