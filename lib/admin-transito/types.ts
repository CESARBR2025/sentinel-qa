export interface UserWithRole {
  id: string
  name: string
  apellido: string
  email: string
  rolId: number | null
  rolNombre: string | null
  activo: boolean
}
