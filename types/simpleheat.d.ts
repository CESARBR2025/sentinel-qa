declare module 'simpleheat' {
  /** Punto en píxeles de canvas: [x, y, peso]. */
  export type SimpleHeatPoint = [number, number, number]

  export interface SimpleHeat {
    data(points: SimpleHeatPoint[]): SimpleHeat
    max(max: number): SimpleHeat
    add(point: SimpleHeatPoint): SimpleHeat
    clear(): SimpleHeat
    /** radius(r, blur) — hay que llamarlo antes de draw(). */
    radius(r: number, blur?: number): SimpleHeat
    /** Rampa de color { 0..1: cssColor }. OJO: draw() NO acepta gradiente. */
    gradient(grad: Record<number, string>): SimpleHeat
    resize(): SimpleHeat
    /** draw(minOpacity) — un solo argumento. */
    draw(minOpacity?: number): SimpleHeat
  }

  function simpleheat(canvas: HTMLCanvasElement | string): SimpleHeat
  export default simpleheat
}
