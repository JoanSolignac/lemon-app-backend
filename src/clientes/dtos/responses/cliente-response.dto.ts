import { ApiProperty } from '@nestjs/swagger';

import { TipoCliente, TipoDocumento } from '../../types/cliente.type';

export class ClienteResponseDto {
  @ApiProperty({
    example: '8f3f4b2e-6d5c-4e2c-9a8b-123456789abc',
    description: 'Identificador único del cliente.',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'Pacific Market SAC',
    description: 'Razón social o nombre comercial del cliente.',
  })
  public readonly razonSocial: string;

  @ApiProperty({
    enum: TipoDocumento,
    example: TipoDocumento.RUC,
    description: 'Tipo de documento de identificación del cliente.',
  })
  public readonly tipoDocumento: TipoDocumento;

  @ApiProperty({
    example: '20123456789',
    description: 'Número del documento de identificación.',
  })
  public readonly numeroDocumento: string;

  @ApiProperty({
    enum: TipoCliente,
    example: TipoCliente.MAYORISTA,
    description: 'Clasificación comercial del cliente.',
  })
  public readonly tipoCliente: TipoCliente;

  @ApiProperty({
    example: '987654321',
    description: 'Número telefónico principal del cliente.',
  })
  public readonly numeroTelefono: string;

  @ApiProperty({
    example: 'contacto@pacific.pe',
    nullable: true,
    description: 'Correo electrónico del cliente.',
  })
  public readonly correoElectronico: string | null;

  @ApiProperty({
    example: 'Iquitos, Perú',
    description: 'Dirección o referencia de ubicación del cliente.',
  })
  public readonly direccion: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el cliente se encuentra activo.',
  })
  public readonly activo: boolean;

  @ApiProperty({
    example: 1,
    description: 'Versión actual del registro para control optimista.',
  })
  public readonly version: number;

  @ApiProperty({
    example: '2026-05-07T12:00:00.000Z',
    description: 'Fecha y hora de creación del registro.',
  })
  public readonly createdAt: Date;

  @ApiProperty({
    example: '2026-05-07T14:30:00.000Z',
    description: 'Fecha y hora de la última actualización.',
  })
  public readonly updatedAt: Date;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Fecha de eliminación lógica del registro.',
  })
  public readonly deletedAt: Date | null;

  constructor(data: Partial<ClienteResponseDto>) {
    Object.assign(this, data);
  }
}
