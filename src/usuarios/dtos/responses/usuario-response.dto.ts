import { Rol } from 'src/common/types/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';  

/*export type UsuarioResponseDto = {
  id: string;
  rol: Rol;
  nombre: string;
  correoElectronico: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};*/

export class UsuarioResponseDto {
  @ApiProperty({
    example: '8f3f4b2e-6d5c-4e2c-9a8b-123456789abc',
    description: 'Identificador único del cliente.',
  })
  id!: string;
  
  @ApiProperty({
    enum: Rol,
    example: Rol.ADMINISTRADOR,
    description: 'Rol asignado al usuario dentro del sistema.',
  })
  rol!: Rol;

  @ApiProperty({
    example: 'Lemon SAC',
    description: 'Razón social del cliente.',
  })
  razonSocial!: string;

  @ApiProperty({
    example: 'RUC',
    description: 'Tipo de documento del cliente.',
  })
  tipoDocumento!: string;

  @ApiProperty({
    example: '20123456789',
    description: 'Número de documento del cliente.',
  })
  numeroDocumento!: string;

  @ApiProperty({
    example: 'MAYORISTA',
    description: 'Tipo de cliente.',
  })
  tipoCliente!: string;

  @ApiProperty({
    example: '987654321',
    description: 'Número telefónico del cliente.',
  })
  numeroTelefono!: string;

  @ApiProperty({
    example: 'contacto@lemon.com',
    description: 'Correo electrónico del cliente.',
  })
  correoElectronico!: string;

  @ApiProperty({
    example: 'Iquitos, Perú',
    description: 'Dirección del cliente.',
  })
  direccion!: string;
}


