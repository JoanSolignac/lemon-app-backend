import { Rol } from 'src/common/types/user-role.enum';

export type UsuarioResponseDto = {
  id: string;
  rol: Rol;
  nombre: string;
  correoElectronico: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
