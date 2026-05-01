import { Rol } from "./usuario.type"

export type UsuarioForAuth = {
  id: string
  rol: Rol
  correoElectronico: string
  contrasena: string
  activo: boolean
}
