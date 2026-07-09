export interface UserWithRole {
  id: string
  name: string
  apellido: string
  email: string
  rolId: number | null
  rolNombre: string | null
  activo: boolean
}

export interface Departamento {
  id: string
  clave: string
  nombre: string
}

export interface OficialLista {
  id: string
  userName: string
  userApellido: string
  userEmail: string
  noNomina: string | null
  numeroEmpleado: string | null
  telefono: string | null
  departamentoId: string | null
  departamentoNombre: string | null
  patrullaId: string | null
  patrullaUnidad: string | null
  userId: string | null
  ofiEstatus: string
  createdAt: string
  updatedAt: string
}

export interface UserBasico {
  id: string
  name: string
  apellido: string
  email: string
}
