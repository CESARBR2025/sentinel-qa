import { OficialesViaRepository } from "./repository";

export class OficialesViaService {
  static async obtenerOficialId(userId: string): Promise<string> {
    const oficialId = await OficialesViaRepository.obtenerOficialIdPorUserId(userId);
    if (!oficialId) {
      throw new Error("Oficial no encontrado o inactivo");
    }
    return oficialId;
  }

  static async obtenerMiPerfil(userId: string) {
    const oficial = await OficialesViaRepository.obtenerOficialPorUserId(userId);
    if (!oficial) {
      throw new Error("Oficial no encontrado");
    }
    return oficial;
  }

  static async obtenerPorId(oficialId: string) {
    const oficial = await OficialesViaRepository.obtenerOficialPorId(oficialId);
    if (!oficial) {
      throw new Error("Oficial no encontrado");
    }
    return oficial;
  }
}
