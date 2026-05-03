import { Rol } from "src/common/types/user-role.enum";

export type UpdateUsuario = {
  rol?: Rol;
  nombre?: string;
  correoElectronico?: string;
  contrasena?: string;
  activo?: boolean;
}
