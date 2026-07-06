import { ArticuloLey, FraccionLey } from "./types";

interface QueryRow {
  articulo_id: string;
  articulo_numero: string;
  articulo_descripcion: string;
  articulo_activo: boolean;
  fraccion_id: string | null;
  fraccion_numero: string | null;
  fraccion_descripcion: string | null;
  monto_umas: number | null;
  clasificacion: string | null;
  fraccion_activo: boolean | null;
}

export class ArticulosMapper {
  static toDomain(rows: QueryRow[]): ArticuloLey[] {
    const map = new Map<string, ArticuloLey>();

    for (const row of rows) {
      if (!map.has(row.articulo_id)) {
        map.set(row.articulo_id, {
          id: row.articulo_id,
          numero: row.articulo_numero,
          descripcion: row.articulo_descripcion,
          activo: row.articulo_activo,
          fracciones: [],
        });
      }

      if (row.fraccion_id) {
        const articulo = map.get(row.articulo_id)!;
        articulo.fracciones.push({
          id: row.fraccion_id,
          articulo_id: row.articulo_id,
          numero: row.fraccion_numero!,
          descripcion: row.fraccion_descripcion!,
          monto_umas: row.monto_umas!,
          clasificacion: row.clasificacion as FraccionLey["clasificacion"],
          activo: row.fraccion_activo!,
        });
      }
    }

    return Array.from(map.values());
  }
}
