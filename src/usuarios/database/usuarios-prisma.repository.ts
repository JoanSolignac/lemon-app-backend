import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginatedParams } from 'src/common/types/paginated-params.type';
import { PrismaService } from '../../database/prisma/prisma.service';
import { USUARIO_CORREO_ELECTRONICO_CONFLICT, USUARIO_ID_CONFLICT } from '../errors/usuarios.errors';
import { IUsuariosRepository } from '../repositories/usuarios.repository';
import { UsuarioForAuth } from '../types/usuario-for-auth.type';
import { SELECT_USUARIO_FOR_AUTH } from '../types/usuario-for-auth-select.type';
import { SELECT_USUARIOS } from '../types/usuario-select.type';
import { Usuario } from '../types/usuario.type';
import { UsuarioUpdateParams } from '../types/usuario-update-params.type';

@Injectable()
export class UsuariosPrismaRepository implements IUsuariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Usuario): Promise<Partial<Usuario>> {
    try {
      return await this.prisma.usuario.create({
        data: {
          id: data.id,
          rol: data.rol,
          nombre: data.nombre,
          correoElectronico: data.correoElectronico,
          contrasena: data.contrasena,
          activo: data.activo,
          deletedAt: data.deletedAt ?? null,
        },
        select: SELECT_USUARIOS,
      });
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  async findById(id: string): Promise<Partial<Usuario> | null> {
    return this.prisma.usuario.findFirst({
      where: { id, deletedAt: null },
      select: SELECT_USUARIOS,
    });
  }

  async findByCorreoElectronico(correoElectronico: string): Promise<Partial<Usuario> | null> {
    return this.prisma.usuario.findFirst({
      where: { correoElectronico, deletedAt: null },
      select: SELECT_USUARIOS,
    });
  }

  async findForAuthByCorreoElectronico(correoElectronico: string): Promise<UsuarioForAuth | null> {
    return this.prisma.usuario.findFirst({
      where: { correoElectronico, deletedAt: null },
      select: SELECT_USUARIO_FOR_AUTH,
    });
  }

  async findAllForSync(lastSync: Date): Promise<Partial<Usuario>[]> {
    return this.prisma.usuario.findMany({
      where: {
        updatedAt: {
          gt: lastSync,
        },
      },
      orderBy: [
        { updatedAt: 'asc' },
        { id: 'asc' },
      ],
      select: SELECT_USUARIOS,
    });
  }

  async findAllForPagination(params: PaginatedParams): Promise<{ data: Partial<Usuario>[]; total: number }> {
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

    return { data, total };
  }

  async update(params: UsuarioUpdateParams): Promise<void> {
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
        throw new ConflictException('Usuario no encontrado.');
      }
    } catch (error: unknown) {
      this.handlePrismaError(error);
    }
  }

  async softDelete(id: string): Promise<void> {
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
      throw new ConflictException('Usuario no encontrado.');
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof ConflictException) {
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
