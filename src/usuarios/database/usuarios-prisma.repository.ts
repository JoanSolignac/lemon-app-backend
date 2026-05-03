import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginatedParams } from 'src/common/types/paginated-params.type';
import { PrismaService } from '../../database/prisma/prisma.service';
import { USUARIO_CORREO_ELECTRONICO_CONFLICT, USUARIO_ID_CONFLICT } from '../errors/usuarios.errors';
import { IUsuariosRepository } from '../repositories/usuarios.repository';
import { UsuarioForAuth } from '../types/usuario-for-auth.type';
import { SELECT_USUARIO_FOR_AUTH } from '../types/usuario-for-auth-select.type';
import { SELECT_USUARIOS } from '../types/usuario-select.type';
import { CreateUsuario } from '../types/create-usuario.type';
import { Usuario } from '../types/usuario.type';
import { UsuarioUpdateParams } from '../types/usuario-update-params.type';
import { toDomain, toDomainForAuth, toDomainList, toPrismaUsuarioRol } from './usuario-prisma-mapper';
import { SyncQueryParams } from '../types/sync-query-params.type';

@Injectable()
export class UsuariosPrismaRepository implements IUsuariosRepository {
  private readonly logger = new Logger(UsuariosPrismaRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUsuario): Promise<Usuario> {
    this.logger.debug('create usuario');

    try {
      const prismaUsuario = await this.prisma.usuario.create({
        data: {
          rol: toPrismaUsuarioRol(data.rol),
          nombre: data.nombre,
          correoElectronico: data.correoElectronico,
          contrasena: data.contrasena,
        },
        select: SELECT_USUARIOS,
      });
      return toDomain(prismaUsuario);
    } catch (error: unknown) {
      this.logger.error(
        'Prisma operation failed',
        JSON.stringify(error, null, 2),
      );
      this.handlePrismaError(error);
    }
  }

  async findById(id: string): Promise<Usuario | null> {
    this.logger.debug('find usuario by id');

    const prismaUsuario = await this.prisma.usuario.findFirst({
      where: { id, deletedAt: null },
      select: SELECT_USUARIOS,
    });
    return prismaUsuario ? toDomain(prismaUsuario) : null;
  }

  async findByCorreoElectronico(correoElectronico: string): Promise<Usuario | null> {
    this.logger.debug('find usuario by correo electronico');

    const prismaUsuario = await this.prisma.usuario.findFirst({
      where: { correoElectronico, deletedAt: null },
      select: SELECT_USUARIOS,
    });
    return prismaUsuario ? toDomain(prismaUsuario) : null;
  }

  async findForAuthByCorreoElectronico(correoElectronico: string): Promise<UsuarioForAuth | null> {
    this.logger.debug('find usuario for auth by correo electronico');

    const prismaUsuarioForAuth = await this.prisma.usuario.findFirst({
      where: { correoElectronico, deletedAt: null },
      select: SELECT_USUARIO_FOR_AUTH,
    });
    return prismaUsuarioForAuth ? toDomainForAuth(prismaUsuarioForAuth) : null;
  }

  async findAllForPagination(params: PaginatedParams): Promise<{ data: Usuario[]; total: number }> {
    this.logger.debug('find all usuarios');

    const { skip, take } = params;
    const where = { deletedAt: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        where,
        skip,
        take,
        orderBy: [
          { nombre: 'desc' },
          { id: 'desc' },
        ],
        select: SELECT_USUARIOS,
      }),
      this.prisma.usuario.count({
        where,
      }),
    ]);

    return { data: toDomainList(data), total };
  }

  async update(params: UsuarioUpdateParams): Promise<void> {
    this.logger.debug('update usuario');

    const { id, data } = params;

    try {
      const result = await this.prisma.usuario.updateMany({
        where: {
          id,
          deletedAt: null,
        },
        data: {
          rol: data.rol,
          nombre: data.nombre,
          correoElectronico: data.correoElectronico,
          contrasena: data.contrasena,
          activo: data.activo,
        },
      });

      if (result.count === 0) {
        throw new NotFoundException('Usuario no encontrado.');
      }
    } catch (error: unknown) {
      this.logger.error(
        'Prisma operation failed',
        JSON.stringify(error, null, 2),
      );
      this.handlePrismaError(error);
    }
  }

  async softDelete(id: string): Promise<void> {
    this.logger.debug('soft delete usuario');

    const result = await this.prisma.usuario.updateMany({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        activo: false,
        deletedAt: new Date(),
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Usuario no encontrado.');
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

      if (target.some(field => field.includes('id'))){
        throw new ConflictException({
          code: USUARIO_ID_CONFLICT,
          message: 'El usuario ya existe.',
        })
      }

      if (target.some(field => field.includes('correoelectronico'))){
        throw new ConflictException({
          code: USUARIO_CORREO_ELECTRONICO_CONFLICT,
          message: 'El correo electronico ya existe.',
        })
      }
    }

    /**
     * @description Maneja errores de Prisma cuando un registro requerido no existe (P2025).
     */
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException('Usuario no encontrado.');
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
     *           fields: ['numeroDocumento']
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
