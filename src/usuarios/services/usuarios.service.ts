import { Inject, Injectable } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';
import { calculateSkipTakeForPagination, normalizePaginationDto } from 'src/common/utils/pagination.util';
import { IUSUARIO_REPOSITORY } from '../constants/usuarios.constant';
import { CreateUsuarioDto } from '../dtos/requests/create-usuario.dto';
import { UsuarioResponseDto } from '../dtos/responses/usuario-response.dto';
import { UpdateUsuarioDto } from '../dtos/requests/update-usuario';
import type { IUsuariosRepository } from '../repositories/usuarios.repository';
import { UsuarioForAuth } from '../types/usuario-for-auth.type';
import { Usuario } from '../types/usuario.type';

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(IUSUARIO_REPOSITORY)
    private readonly usuarioRepository: IUsuariosRepository,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
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

    const createdUsuario = await this.usuarioRepository.create(usuario);

    return createdUsuario as UsuarioResponseDto;
  }

  async findById(id: string): Promise<UsuarioResponseDto | null> {
    const usuario = await this.usuarioRepository.findById(id);

    return usuario as UsuarioResponseDto | null;
  }

  async findByCorreoElectronico(correoElectronico: string): Promise<UsuarioResponseDto | null> {
    const usuario = await this.usuarioRepository.findByCorreoElectronico(correoElectronico);

    return usuario as UsuarioResponseDto | null;
  }

  async findForAuthByCorreoElectronico(correoElectronico: string): Promise<UsuarioForAuth | null> {
    return this.usuarioRepository.findForAuthByCorreoElectronico(correoElectronico);
  }

  async findAllForSync(lastSync: Date): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.usuarioRepository.findAllForSync(lastSync);

    return usuarios as UsuarioResponseDto[];
  }

  async findAllPaginated(dto: PaginatedQueryDto): Promise<PaginatedResult<UsuarioResponseDto>> {
    const { page, limit } = normalizePaginationDto(dto);
    const { skip, take } = calculateSkipTakeForPagination({ page, limit });
    const { data, total } = await this.usuarioRepository.findAllForPagination({ skip, take });

    return {
      data: data as UsuarioResponseDto[],
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
