import { Rol } from 'src/common/types/user-role.enum';
import type { Usuario } from '../../types/usuario.type';

export class UsuarioResponseDto {
  readonly id!: string;
  readonly rol!: Rol;
  readonly nombre!: string;
  readonly correoElectronico!: string;
  readonly activo!: boolean;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
  readonly deletedAt!: Date | null;
}
