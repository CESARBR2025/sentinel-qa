export interface Notificacion {
  id: string
  userId: string
  tipo: string
  titulo: string
  mensaje: string
  href: string | null
  leida: boolean
  fichaId: string | null
  hito: string | null
  creadoEn: string
}
