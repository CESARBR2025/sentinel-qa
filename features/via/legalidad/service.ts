import { unstable_cache } from "next/cache";
import { ArticulosMapper } from "./mapper";
import { ArticulosRepository } from "./repository";
import { FraccionLey } from "./types";

export class ArticulosService {
  static obtenerArticulos = unstable_cache(
    async () => {
      const rows = await ArticulosRepository.obtenerArticulos();
      return ArticulosMapper.toDomain(rows as any);
    },
    ["via-legalidad-articulos"],
    { revalidate: 60 * 60 * 24, tags: ["via", "legalidad", "articulos"] },
  );

  static async obtenerFraccionesPorArticulo(articuloId: string): Promise<FraccionLey[]> {
    const rows = await ArticulosRepository.obtenerFraccionesPorArticulo(articuloId);
    return rows.map((r: any) => ({
      id: r.id,
      articulo_id: r.articulo_id,
      numero: r.numero,
      descripcion: r.descripcion,
      monto_umas: Number(r.monto_umas),
      clasificacion: r.clasificacion as FraccionLey["clasificacion"],
      activo: r.activo,
    }));
  }
}
