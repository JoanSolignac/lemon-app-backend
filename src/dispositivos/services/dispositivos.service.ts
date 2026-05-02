import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDISPOSITIVO_REPOSITORY } from '../constants/dispositivos.constants';
import type { IDispositivoRepository } from '../repositories/dispositivo.repository';
import { CreateDispositivoDto } from '../dtos/requests/create-dispositivo.dto';
import { CreateDispositivo } from '../types/create-dispositivo.type';
import { Dispositivo } from '../types/dispositivo.type';
import { DispositivoDto } from '../dtos/responses/dispositivo.dto';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { PaginatedResultDto } from 'src/common/dtos/responses/paginated-result.dto';
import {
  calculateSkipTakeForPagination,
  normalizePaginationDto,
} from 'src/common/utils/pagination.util';

@Injectable()
export class DispositivosService {
  constructor(
    @Inject(IDISPOSITIVO_REPOSITORY)
    private readonly dispositivoRepository: IDispositivoRepository,
  ) {}

  async create(userId: string, dto: CreateDispositivoDto): Promise<DispositivoDto> {
    const dispositivo: CreateDispositivo = {
      deviceId: dto.deviceId,
      userId,
      metadata: dto.metadata,
    };

    const createdDispositivo =
      await this.dispositivoRepository.create(dispositivo);

    return this.toResponse(createdDispositivo);
  }

  async findById(deviceId: string): Promise<DispositivoDto> {
    const dispositivo = await this.dispositivoRepository.findById(deviceId);

    if (!dispositivo) {
      throw new NotFoundException('Dispositivo no encontrado.');
    }

    return this.toResponse(dispositivo);
  }

  async findAllForPagination(
    dto: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<DispositivoDto>> {
    const { page, limit } = normalizePaginationDto(dto);
    const { skip, take } = calculateSkipTakeForPagination({ page, limit });
    const { data, total } =
      await this.dispositivoRepository.findAllForPagination({ skip, take });

    return {
      data: data.map((d) => this.toResponse(d)),
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async update(deviceId: string, userId: string): Promise<void> {
    await this.dispositivoRepository.update({
      deviceId,
      data: {
        userId
      },
    });
  }

  async updateLastSync(deviceId: string): Promise<void> {
    await this.dispositivoRepository.update({
        deviceId,
        data: {
            lastSyncAt: new Date(),
        }
    })
  };

  async delete(deviceId: string): Promise<void> {
    await this.dispositivoRepository.softDelete(deviceId);
  }

  private toResponse(dispositivo: Dispositivo): DispositivoDto {
    return {
      deviceId: dispositivo.deviceId,
      userId: dispositivo.userId,
      activo: dispositivo.activo,
      lastSyncAt: dispositivo.lastSyncAt,
      metadata: dispositivo.metadata && {
        name: dispositivo.metadata.name,
        platform: dispositivo.metadata.platform,
        version: dispositivo.metadata.version,
      },
      createdAt: dispositivo.createdAt,
      updatedAt: dispositivo.updatedAt,
      deletedAt: dispositivo.deletedAt,
    };
  }
}
