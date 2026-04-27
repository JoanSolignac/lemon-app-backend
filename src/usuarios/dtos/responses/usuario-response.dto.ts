import type { Usuario } from '../../types/usuario.type';

export class UsuarioResponseDto {
  readonly id!: Usuario['id'];
  readonly rol!: Usuario['rol'];
  readonly nombre!: Usuario['nombre'];
  readonly correoElectronico!: Usuario['correoElectronico'];
  readonly activo!: Usuario['activo'];
  readonly createdAt!: Usuario['createdAt'];
  readonly updatedAt!: Usuario['updatedAt'];
  readonly deletedAt!: Usuario['deletedAt'];
}
