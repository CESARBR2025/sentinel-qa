export type Turno = 'PRIMERO' | 'SEGUNDO' | 'TERCERO';

export interface ServiceRow {
  id: string;
  unidad: string;
  nomina: string;
  nombre: string;
  zona: string;
  gpsRadio: string;
  bodyCam: string;
}