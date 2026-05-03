import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginatedParams } from 'src/common/types/paginated-params.type';
import { PrismaService } from '../../database/prisma/prisma.service';
import { IDispositivoRepository } from '../repositories/dispositivo.repository';
import { Dispositivo } from '../types/dispositivo.type';
import { SELECT_DISPOSITIVOS } from '../types/dispositivo-select.type';
import { DispositivoUpdateParams } from '../types/dispositivo-update-params.type';
import { DISPOSITIVO_ID_CONFLICT } from '../errors/dispositivos.errors';
import { toDomain, toDomainList } from './dispositivo-prisma-mapper';
import { CreateDispositivo } from '../types/create-dispositivo.type';

@Injectable()
export class DispositivosPrismaRepository implements IDispositivoRepository {
  private readonly logger = new Logger(DispositivosPrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDispositivo): Promise<Dispositivo> {
    this.logger.debug('create dispositivo');

    try {
      const prismaDispositivo = await this.prisma.dispositivo.create({
        data: {
          deviceId: data.deviceId,
          userId: data.userId,
          metadata: data.metadata,
        },
        select: SELECT_DISPOSITIVOS,
      });
      return toDomain(prismaDispositivo);
    } catch (error: unknown) {
      this.logger.error(
        'Prisma operation failed',
        JSON.stringify(error, null, 2),
      );
      this.handlePrismaError(error);
    }
  }

  async findById(deviceId: string): Promise<Dispositivo | null> {
    this.logger.debug('find dispositivo by id');

    const prismaDispositivo = await this.prisma.dispositivo.findFirst({
      where: { deviceId },
      select: SELECT_DISPOSITIVOS,
    });
    return prismaDispositivo ? toDomain(prismaDispositivo) : null;
  }

  async findAllForPagination(params: PaginatedParams): Promise<{ data: Dispositivo[]; total: number }> {
    this.logger.debug('find all dispositivos');

    const { skip, take } = params;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.dispositivo.findMany({
        skip,
        take,
        orderBy: [
          { createdAt: 'desc' },
          { deviceId: 'desc' },
        ],
        select: SELECT_DISPOSITIVOS,
      }),
      this.prisma.dispositivo.count({
      }),
    ]);

    return { data: toDomainList(data), total };
  }

  async update(params: DispositivoUpdateParams): Promise<void> {
    this.logger.debug('update dispositivo');

    const { deviceId, data } = params;

    try {
      const result = await this.prisma.dispositivo.updateMany({
        where: {
          deviceId,
          deletedAt: null,
        },
        data: {
          userId: data.userId,
          lastSyncAt: data.lastSyncAt,
        },
      });

      if (result.count === 0) {
        throw new NotFoundException('Dispositivo no encontrado.');
      }
    } catch (error: unknown) {
      this.logger.error(
        'Prisma operation failed',
        JSON.stringify(error, null, 2),
      );
      this.handlePrismaError(error);
    }
  }

  async softDelete(deviceId: string): Promise<void> {
    this.logger.debug('soft delete dispositivo');

    const result = await this.prisma.dispositivo.updateMany({
      where: {
        deviceId,
        deletedAt: null,
      },
      data: {
        activo: false,
        deletedAt: new Date(),
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Dispositivo no encontrado.');
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof ConflictException || error instanceof NotFoundException) {
      throw error;
    }

    /**
     * @description Maneja errores de Prisma relacionados con violaciones de restricciones UNIQUE (P2002).
     */
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      let target = this.getUniqueConstraintTarget(error);

      this.logger.debug(
        `Unique constraint target: ${JSON.stringify(target)}`
      );

      target = target.map(field =>
        field.toLowerCase().replace(/_/g, '')
      );

      if (target.some(field => field.includes('deviceid')) || target.some(field => field.includes('id'))) {
        throw new ConflictException({
          code: DISPOSITIVO_ID_CONFLICT,
          message: 'El dispositivo ya existe.',
        });
      }
    }

    /**
     * @description Maneja errores de Prisma cuando un registro requerido no existe (P2025).
     */
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException('Dispositivo no encontrado.');
    }

    throw error;
  }

  private getUniqueConstraintTarget(error: Prisma.PrismaClientKnownRequestError): string[] {
    /**
     * @description Extrae los campos afectados por una restricción UNIQUE (P2002) de Prisma.
     *
     * Con Prisma 7 + driver adapter PostgreSQL, el error viene en:
     * error.meta.driverAdapterError.cause.constraint.fields
     *
     * Ejemplo:
     * {
     *   code: 'P2002',
     *   meta: {
     *     driverAdapterError: {
     *       cause: {
     *         constraint: {
     *           fields: ['deviceId']
     *         }
     *       }
     *     }
     *   }
     * }
     *
     * Esta función normaliza siempre el resultado a `string[]`
     * para poder procesarlo de forma segura en la lógica de negocio.
     */
    const meta = error.meta;

    if (!meta) {
      return [];
    }

    const driverAdapterError = meta.driverAdapterError;

    if (!driverAdapterError || typeof driverAdapterError !== 'object') {
      return [];
    }

    const cause = (driverAdapterError as Record<string, unknown>).cause;

    if (!cause || typeof cause !== 'object') {
      return [];
    }

    const constraint = (cause as Record<string, unknown>).constraint;

    if (!constraint || typeof constraint !== 'object') {
      return [];
    }

    const fields = (constraint as Record<string, unknown>).fields;

    return Array.isArray(fields) ? fields.filter((value): value is string => typeof value === "string") : [];
  }
}
