export interface UsuarioLista {
  id: string
  name: string
  apellido: string
  email: string
  emailVerified: boolean
  image: string | null
  rolId: number | null
  rolNombre: string | null
  activo: boolean
  twoFactorEnabled: boolean
  createdAt: string
}

export interface RolItem {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
}
