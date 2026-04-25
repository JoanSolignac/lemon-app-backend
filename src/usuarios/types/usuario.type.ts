export type Usuario = {
  id: string
  rol: 'ADMINISTRADOR' | 'SUPERVISOR'
  nombre: string
  correoElectronico: string
  contrasena: string
  activo: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}
