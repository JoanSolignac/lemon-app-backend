import { ConflictException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";

import { IClientesRepository } from "../repositories/clientes.repository";
import { Cliente } from "../types/cliente.type";
import { ClienteUpdateParams } from "../types/cliente-update-params.type";
import { PaginatedParams } from "src/common/types/paginated-params.type";
import { SoftDeleteParams } from "../types/soft-delete-params.type";

@Injectable()
export class ClientesPrismaRepository implements IClientesRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(data: Cliente): Promise<Cliente> {
    try {
      return await this.prisma.cliente.create({
        data: {
          id: data.id,
          razonSocial: data.razonSocial,
          tipoDocumento: data.tipoDocumento,
          numeroDocumento: data.numeroDocumento,
          tipoCliente: data.tipoCliente,
          numeroTelefono: data.numeroTelefono,
          correoElectronico: data.correoElectronico,
          direccion: data.direccion,
          activo: data.activo,
          version: data.version,
          deletedAt: data.deletedAt ?? null,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = Array.isArray(error.meta?.target) ? error.meta.target : [];

        if (target.includes('id')) {
          return this.prisma.cliente.findUniqueOrThrow({
          where: { id: data.id },
          });
        }

        throw new ConflictException('El numero de documento o correo electronico ya existe.');
      }

      throw error;
    }
  }

  async findById(id: string): Promise<Cliente | null> {
    return this.prisma.cliente.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByNumeroDocumento(numeroDocumento: string): Promise<Cliente | null> {
    return this.prisma.cliente.findFirst({
      where: { numeroDocumento, deletedAt: null },
    });
  }

  async findAllForSync(lastSync: Date): Promise<Cliente[]> {
    return this.prisma.cliente.findMany({
      where: {
        updatedAt: {
          gt: lastSync
        }
      }
    });
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
      }),
      this.prisma.cliente.count({
        where,
      }),
    ]);

    return { data, total };
  }

  async update(params: ClienteUpdateParams): Promise<boolean> {
    const { id, data } =  params;

    const result = await this.prisma.cliente.updateMany({
      where: { id,version: data.version, deletedAt: null }, 
      data: {
        ...data,
        version: { increment: 1 },
      },
    });

    return result.count > 0;
  }

  async softDelete(params: SoftDeleteParams): Promise<boolean> {
    const { id, version } = params

    const result = await this.prisma.cliente.updateMany({
      where: { id, version,  deletedAt: null },
      data: {
        activo: false,
        deletedAt: new Date(),
        version: { increment: 1 },
      },
    });

    return result.count > 0;
  }
}
