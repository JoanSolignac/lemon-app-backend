import { Inject, Injectable, Logger } from '@nestjs/common';
import { IDISPOSITIVO_REPOSITORY } from '../constants/dispositivos.constants';
import type { IDispositivoRepository } from '../repositories/dispositivo.repository';
import { CreateDispositivoDto } from '../dtos/requests/create-dispositivo.dto';
import { CreateDispositivo } from '../types/create-dispositivo.type';
import { Dispositivo } from '../types/dispositivo.type';
import { DispositivoResponseDto } from '../dtos/responses/dispositivo.dto';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { PaginatedResultDto } from 'src/common/dtos/responses/paginated-result.dto';
import {
  calculateSkipTakeForPagination,
  normalizePaginationDto,
} from 'src/common/utils/pagination.util';

@Injectable()
export class DispositivosService {
  private readonly logger = new Logger(DispositivosService.name);

  constructor(
    @Inject(IDISPOSITIVO_REPOSITORY)
    private readonly dispositivoRepository: IDispositivoRepository,
  ) {}

  async create(
    userId: string,
    dto: CreateDispositivoDto,
  ): Promise<DispositivoResponseDto> {
    const dispositivo: CreateDispositivo = {
      deviceId: dto.deviceId,
      userId,
      metadata: dto.metadata,
    };

    const createdDispositivo =
      await this.dispositivoRepository.create(dispositivo);
    this.logger.log(
      `Dispositivo creado: deviceId=${createdDispositivo.deviceId}, userId=${createdDispositivo.userId}, nombre=${createdDispositivo.metadata?.name}`,
    );

    return this.toResponse(createdDispositivo);
  }

  async findById(deviceId: string): Promise<DispositivoResponseDto | null> {
    const dispositivo = await this.dispositivoRepository.findById(deviceId);

    if (!dispositivo) {
      this.logger.log(`Dispositivo no encontrado: deviceId=${deviceId}`);
      return null;
    }

    this.logger.log(`Dispositivo encontrado: deviceId=${dispositivo.deviceId}`);
    return this.toResponse(dispositivo);
  }

  async findAllForPagination(
    dto: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<DispositivoResponseDto>> {
    const { page, limit } = normalizePaginationDto(dto);
    const { skip, take } = calculateSkipTakeForPagination({ page, limit });
    const { data, total } =
      await this.dispositivoRepository.findAllForPagination({ skip, take });

    this.logger.log(
      `Dispositivos listados: total=${total}, page=${page}, limit=${limit}, resultados=${data.length}`,
    );

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
        userId,
      },
    });
    this.logger.log(`Dispositivo actualizado: deviceId=${deviceId}, userId=${userId}`);
  }

  async updateLastSync(deviceId: string): Promise<void> {
    await this.dispositivoRepository.update({
      deviceId,
      data: {
        lastSyncAt: new Date(),
      },
    });
    this.logger.log(`Sincronizacion actualizada: deviceId=${deviceId}, timestamp=${new Date().toISOString()}`);
  }

  async delete(deviceId: string): Promise<void> {
    await this.dispositivoRepository.softDelete(deviceId);
    this.logger.log(`Dispositivo eliminado: deviceId=${deviceId}`);
  }

  private toResponse(dispositivo: Dispositivo): DispositivoResponseDto {
    return new DispositivoResponseDto(dispositivo);
  }
}
