import { Inject, Injectable } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';
import { calculateSkipTakeForPagination, normalizePaginationDto } from 'src/common/utils/pagination.util';
import { IUSUARIO_REPOSITORY } from '../constants/usuarios.constant';
import { CreateUsuarioDto } from '../dtos/requests/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/requests/update-usuario';
import type { IUsuariosRepository } from '../repositories/usuarios.repository';
import { Usuario } from '../types/usuario.type';

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(IUSUARIO_REPOSITORY)
    private readonly usuarioRepository: IUsuariosRepository,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const now = new Date();
    const usuario: Usuario = {
      id: dto.id,
      rol: dto.rol,
      nombre: dto.nombre,
      correoElectronico: dto.correoElectronico,
      contrasena: dto.contrasena,
      activo: true,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    return this.usuarioRepository.create(usuario);
  }

  async findById(id: string): Promise<Usuario | null> {
    return this.usuarioRepository.findById(id);
  }

  async findByCorreoElectronico(correoElectronico: string): Promise<Usuario | null> {
    return this.usuarioRepository.findByCorreoElectronico(correoElectronico);
  }

  async findAllForSync(lastSync: Date): Promise<Usuario[]> {
    return this.usuarioRepository.findAllForSync(lastSync);
  }

  async findAllPaginated(dto: PaginatedQueryDto): Promise<PaginatedResult<Usuario>> {
    const { page, limit } = normalizePaginationDto(dto);
    const { skip, take } = calculateSkipTakeForPagination({ page, limit });
    const { data, total } = await this.usuarioRepository.findAllForPagination({ skip, take });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async update(id: string, dto: UpdateUsuarioDto): Promise<void> {
    await this.usuarioRepository.update({
      id,
      data: {
        rol: dto.rol,
        nombre: dto.nombre,
        correoElectronico: dto.correoElectronico,
        contrasena: dto.contrasena,
        activo: dto.activo,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.usuarioRepository.softDelete(id);
  }
}
