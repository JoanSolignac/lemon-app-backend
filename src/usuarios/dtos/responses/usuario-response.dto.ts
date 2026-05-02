import type { Rol, Usuario } from '../../types/usuario.type';

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
