import { Rol } from 'src/common/types/user-role.enum';

export type UsuarioUpdateRolParams = {
  id: string;
  rol: Rol;
};