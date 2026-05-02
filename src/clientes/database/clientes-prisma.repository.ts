import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginatedParams } from 'src/common/types/paginated-params.type';
import { PrismaService } from '../../database/prisma/prisma.service';
import { IClientesRepository } from '../repositories/clientes.repository';
import { Cliente } from '../types/cliente.type';
import { SELECT_CLIENTES } from '../types/cliente-select.type';
import { ClienteUpdateParams } from '../types/cliente-update-params.type';
import { SoftDeleteParams } from '../types/soft-delete-params.type';
import { SyncQueryParams } from '../types/sync-query-params.type';
import { CLIENTE_CORREO_ELECTRONICO_CONFLICT, CLIENTE_ID_CONFLICT, CLIENTE_NUMERO_DOCUMENTO_CONFLICT, CLIENTE_NUMERO_TELEFONO_CONFLICT } from '../errors/clientes.errors';
import { toDomain, toDomainList, toPrismaTipoDocumento, toPrismaTipoCliente } from './cliente-prisma-mapper';
@Injectable()
export class ClientesPrismaRepository implements IClientesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Cliente): Promise<Cliente> {
    try {
      const prismaCliente = await this.prisma.cliente.create({
        data: {
          id: data.id,
          razonSocial: data.razonSocial,
          tipoDocumento: toPrismaTipoDocumento(data.tipoDocumento),
          numeroDocumento: data.numeroDocumento,
          tipoCliente: toPrismaTipoCliente(data.tipoCliente),
          numeroTelefono: data.numeroTelefono,
          correoElectronico: data.correoElectronico,
          direccion: data.direccion,
          activo: data.activo,
          version: data.version,
          deletedAt: data.deletedAt ?? null,
        },
        select: SELECT_CLIENTES,
      });
      return toDomain(prismaCliente);
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  async findById(id: string): Promise<Cliente | null> {
    const prismaCliente = await this.prisma.cliente.findFirst({
      where: { id, deletedAt: null },
      select: SELECT_CLIENTES,
    });
    return prismaCliente ? toDomain(prismaCliente) : null;
  }

  async findByNumeroDocumento(numeroDocumento: string): Promise<Cliente | null> {
    const prismaCliente = await this.prisma.cliente.findFirst({
      where: { numeroDocumento, deletedAt: null },
      select: SELECT_CLIENTES,
    });
    return prismaCliente ? toDomain(prismaCliente) : null;
  }

  async findAllForSync(params: SyncQueryParams): Promise<Cliente[]> {
    const prismaClientes = await this.prisma.cliente.findMany({
      where: {
        updatedAt: {
          gt: params.lastSync,
        },
      },
      orderBy: [
        { updatedAt: 'asc' },
        { id: 'asc' },
      ],
      select: SELECT_CLIENTES,
    });
    return toDomainList(prismaClientes);
  }

  async findAllForPagination(params: PaginatedParams): Promise<{ data: Cliente[]; total: number }> {
    const { skip, take } = params;
    const where = { deletedAt: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.cliente.findMany({
        where,
        skip,
        take,
        orderBy: [
          { razonSocial: 'desc' },
          { id: 'desc' },
        ],
        select: SELECT_CLIENTES,
      }),
      this.prisma.cliente.count({
        where,
      }),
    ]);

    return { data: toDomainList(data), total };
  }

  async update(params: ClienteUpdateParams): Promise<void> {
    const { id, data } = params;

    try {
      const result = await this.prisma.cliente.updateMany({
        where: {
          id,
          version: data.version,
          deletedAt: null,
        },
        data: {
          razonSocial: data.razonSocial,
          tipoDocumento: data.tipoDocumento,
          numeroDocumento: data.numeroDocumento,
          tipoCliente: data.tipoCliente,
          numeroTelefono: data.numeroTelefono,
          correoElectronico: data.correoElectronico,
          direccion: data.direccion,
          version: { increment: 1 },
        },
      });

      if (result.count === 0) {
        throw new NotFoundException('Conflicto de version o cliente no encontrado.');
      }
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  async softDelete(params: SoftDeleteParams): Promise<void> {
    const { id, version } = params;

    const result = await this.prisma.cliente.updateMany({
      where: {
        id,
        version,
        deletedAt: null,
      },
      data: {
        activo: false,
        deletedAt: new Date(),
        version: { increment: 1 },
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Conflicto de version o cliente no encontrado.');
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

      target = target.map(field =>
        field.toLowerCase().replace(/_/g, '')
      );

      if (target.some(field => field.includes('id'))){
        throw new ConflictException({
          code: CLIENTE_ID_CONFLICT,
          message: 'El cliente ya existe.',
        })
      }

      if (target.some(field => field.includes('numerodocumento'))){
        throw new ConflictException({
          code: CLIENTE_NUMERO_DOCUMENTO_CONFLICT,
          message: 'El numero de documento ya existe.',
        })
      }
      
       if (target.some(field => field.includes('numerotelefono'))){
        throw new ConflictException({
          code: CLIENTE_NUMERO_TELEFONO_CONFLICT,
          message: 'El numero de telefono ya existe.',
        })
      }

        if (target.some(field => field.includes('correoelectronico'))){
        throw new ConflictException({
          code: CLIENTE_CORREO_ELECTRONICO_CONFLICT,
          message: 'El correo electronico ya existe.',
        })
      }
    }

    /**
     * @description Maneja errores de Prisma cuando un registro requerido no existe (P2025).
     */
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException('Cliente no encontrado.');
    }

    throw error;
  }

  private getUniqueConstraintTarget(error: Prisma.PrismaClientKnownRequestError): string[] {

    /**
     * @description Extrae los campos afectados por una restricción UNIQUE (P2002) de Prisma.
     *
     * Prisma puede devolver `meta.target` en diferentes formatos:
     *
     * Ejemplos:
     * {
     *   code: 'P2002',
     *   meta: { target: ['numeroDocumento'] }
     * }
     *
     * {
     *   code: 'P2002',
     *   meta: { target: 'numeroDocumento' }
     * }
     *
     * {
     *   code: 'P2002',
     *   meta: { target: ['Cliente_numeroDocumento_key'] }
     * }
     *
     * {
     *   code: 'P2002',
     *   meta: {}
     * }
     *
     * Esta función normaliza siempre el resultado a `string[]`
     * para poder procesarlo de forma segura en la lógica de negocio.
     */
    const target = error.meta?.target;

    return Array.isArray(target) ? target.filter((value): value is string => typeof value === "string") 
      : typeof target === "string" ? [target] 
      : [];
  }
}
