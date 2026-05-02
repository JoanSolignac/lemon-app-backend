import { Rol } from "src/common/types/user-role.enum"


export type UsuarioForAuth = {
  id: string
  rol: Rol
  correoElectronico: string
  contrasena: string
  activo: boolean
}
