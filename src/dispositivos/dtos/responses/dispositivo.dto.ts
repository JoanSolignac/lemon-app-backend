import { ApiProperty } from '@nestjs/swagger';

import { DeviceMetadata, Dispositivo } from '../../types/dispositivo.type';

export class DeviceMetadataResponseDto {
  @ApiProperty({
    example: 'Samsung S24 Fe',
    description: 'Nombre o modelo del dispositivo.',
  })
  public readonly name: string;

  @ApiProperty({
    example: 'IOS',
    description: 'Plataforma o sistema operativo del dispositivo.',
  })
  public readonly platform: string;

  @ApiProperty({
    example: 1,
    description: 'Versión de la aplicación instalada en el dispositivo.',
  })
  public readonly version: number;

  constructor(data: DeviceMetadata) {
    Object.assign(this, data);
  }
}

export class DispositivoResponseDto {
  @ApiProperty({
    example: '8f3f4b2e-6d5c-4e2c-9a8b-123456789abc',
    description: 'Identificador único del dispositivo.',
  })
  public readonly deviceId: string;

  @ApiProperty({
    example: 'a1b2c3d4-5678-90ab-cdef-123456789abc',
    description: 'Identificador del usuario propietario.',
  })
  public readonly userId: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el dispositivo se encuentra activo.',
  })
  public readonly activo: boolean;

  @ApiProperty({
    example: '2026-05-07T15:30:00.000Z',
    nullable: true,
    description: 'Fecha y hora de la última sincronización exitosa.',
  })
  public readonly lastSyncAt: Date | null;

  @ApiProperty({
    type: DeviceMetadataResponseDto,
    nullable: true,
    description: 'Metadatos técnicos del dispositivo.',
  })
  public readonly metadata: DeviceMetadataResponseDto | null;

  @ApiProperty({
    example: '2026-05-01T10:00:00.000Z',
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
    description: 'Fecha de eliminación lógica del dispositivo.',
  })
  public readonly deletedAt: Date | null;

  constructor(data: Dispositivo) {
    Object.assign(this, {
      ...data,
      metadata: data.metadata
        ? new DeviceMetadataResponseDto(data.metadata)
        : null,
    });
  }
}
