import { TipoDocumento, TipoCliente } from '../../types/cliente.type';
import { ApiProperty } from '@nestjs/swagger';

/*export type ClienteResponseDto = {
  id: string;
  razonSocial: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  tipoCliente: TipoCliente;
  numeroTelefono: string;
  correoElectronico: string | null;
  direccion: string;
  activo: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};*/

export class ClienteResponseDto {
  
  @ApiProperty({
    example: '8f3f4b2e-6d5c-4e2c-9a8b-123456789abc',
    description: 'Identificador único del cliente.',
  })
  id!: string;

  @ApiProperty({
    example: 'Pacific Market SAC',
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
