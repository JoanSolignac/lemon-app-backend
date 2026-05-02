import { Rol } from "src/common/types/user-role.enum"

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
