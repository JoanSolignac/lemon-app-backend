import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


/*export type DeviceMetadataDto = {
  name: string;
  platform: string;
  version: number;
};*/


/*export type DispositivoDto = {
  deviceId: string;
  userId: string;
  activo: boolean;
  lastSyncAt: Date | null;
  metadata: DeviceMetadataDto | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};*/

export class DeviceMetadataDto {
  @ApiProperty({
    example: 'Celular de Mariano Lovera',
    description: 'Nombre del dispositivo.',
  })
  name!: string;

  @ApiProperty({
    example: 'Android',
    description: 'Plataforma o sistema operativo del dispositivo.',
  })
  platform!: string;

  @ApiProperty({
    example: 1,
    description: 'Versión del dispositivo o de la aplicación instalada.',
  })
  version!: number;
}


export class DispositivoDto {
  @ApiProperty({
    example: '8f3f4b2e-6d5c-4e2c-9a8b-123456789abc',
    description: 'Identificador único del dispositivo.',
  })
  id!: string;

  @ApiProperty({
    example: 'Dispositivo principal',
    description: 'Nombre asignado al dispositivo.',
  })
  nombre!: string;

  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-123456789abc',
    description: 'Identificador del usuario propietario del dispositivo.',
  })
  usuarioId!: string;

  @ApiPropertyOptional({
    example: '2026-05-05T20:30:00.000Z',
    description: 'Fecha de la última sincronización del dispositivo.',
  })
  ultimaSincronizacion?: Date;

  @ApiProperty({
    example: '2026-05-05T20:00:00.000Z',
    description: 'Fecha de creación del dispositivo.',
  })
  creadoEn!: Date;
}