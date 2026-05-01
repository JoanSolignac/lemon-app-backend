export type Usuario = {
  id: string
  rol: Rol
  nombre: string
  correoElectronico: string
  contrasena: string
  activo: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export enum Rol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  SUPERVISOR = 'SUPERVISOR',
}
