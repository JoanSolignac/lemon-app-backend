import { Rol } from "src/common/types/user-role.enum";

export type CreateUsuario = {
  rol: Rol;
  nombre: string;
  correoElectronico: string;
  contrasena: string;
}
