import { ApiProperty } from '@nestjs/swagger';

import { Rol } from 'src/common/types/user-role.enum';

export class UsuarioResponseDto {
  @ApiProperty({
    example: '8f3f4b2e-6d5c-4e2c-9a8b-123456789abc',
    description: 'Identificador único del usuario.',
  })
  public readonly id: string;

  @ApiProperty({
    enum: Rol,
    example: Rol.ADMINISTRADOR,
    description: 'Rol asignado al usuario dentro del sistema.',
  })
  public readonly rol: Rol;

  @ApiProperty({
    example: 'JUAN PEREZ',
    description: 'Nombre completo del usuario.',
  })
  public readonly nombre: string;

  @ApiProperty({
    example: 'admin@lemon.pe',
    description: 'Correo electrónico del usuario.',
  })
  public readonly correoElectronico: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el usuario se encuentra activo.',
  })
  public readonly activo: boolean;

  @ApiProperty({
    example: '2026-05-07T12:00:00.000Z',
    description: 'Fecha y hora de creación del registro.',
  })
  public readonly createdAt: Date;

  @ApiProperty({
    example: '2026-05-07T15:30:00.000Z',
    description: 'Fecha y hora de la última actualización.',
  })
  public readonly updatedAt: Date;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Fecha de eliminación lógica del usuario.',
  })
  public readonly deletedAt: Date | null;

  constructor(data: Partial<UsuarioResponseDto>) {
    Object.assign(this, data);
  }
}
