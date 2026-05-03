import { Inject, Injectable } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { PaginatedResultDto } from 'src/common/dtos/responses/paginated-result.dto';
import { calculateSkipTakeForPagination, normalizePaginationDto } from 'src/common/utils/pagination.util';
import { HashService } from 'src/hash/services/hash.service';
import { IUSUARIO_REPOSITORY } from '../constants/usuarios.constant';
import { CreateUsuarioDto } from '../dtos/requests/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/requests/update-usuario';
import { UpdateUsuarioRolDto } from '../dtos/requests/update-usuario-rol.dto';
import { UsuarioResponseDto } from '../dtos/responses/usuario-response.dto';
import type { IUsuariosRepository } from '../repositories/usuarios.repository';
import { UsuarioForAuth } from '../types/usuario-for-auth.type';
import { Usuario } from '../types/usuario.type';
import { CreateUsuario } from '../types/create-usuario.type';

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(IUSUARIO_REPOSITORY)
    private readonly usuarioRepository: IUsuariosRepository,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
    const hashedPassword = await this.hashService.hash(dto.contrasena);
    const usuario: CreateUsuario = {
      rol: dto.rol,
      nombre: dto.nombre,
      correoElectronico: dto.correoElectronico,
      contrasena: hashedPassword,
    };

    const createdUsuario = await this.usuarioRepository.create(usuario);

    return this.toResponse(createdUsuario);
  }

  async findById(id: string): Promise<UsuarioResponseDto | null> {
    const usuario = await this.usuarioRepository.findById(id);

    return usuario ? this.toResponse(usuario) : null;
  }

  async findByCorreoElectronico(correoElectronico: string): Promise<UsuarioResponseDto | null> {
    const usuario = await this.usuarioRepository.findByCorreoElectronico(correoElectronico);

    return usuario ? this.toResponse(usuario) : null;
  }

  async findForAuthByCorreoElectronico(correoElectronico: string): Promise<UsuarioForAuth | null> {
    return this.usuarioRepository.findForAuthByCorreoElectronico(correoElectronico);
  }

  async findAllPaginated(dto: PaginatedQueryDto): Promise<PaginatedResultDto<UsuarioResponseDto>> {
    const { page, limit } = normalizePaginationDto(dto);
    const { skip, take } = calculateSkipTakeForPagination({ page, limit });
    const { data, total } = await this.usuarioRepository.findAllForPagination({ skip, take });

    return {
      data: data.map((u) => this.toResponse(u)),
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async update(id: string, dto: UpdateUsuarioDto): Promise<void> {
    const hashedPassword = dto.contrasena ? await this.hashService.hash(dto.contrasena) : undefined;

    await this.usuarioRepository.update({
      id,
      data: {
        nombre: dto.nombre,
        correoElectronico: dto.correoElectronico,
        contrasena: hashedPassword,
      },
    });
  }

  async updateRol(id: string, dto: UpdateUsuarioRolDto): Promise<void> {
    await this.usuarioRepository.updateRol({ id, rol: dto.rol });
  }

  async delete(id: string): Promise<void> {
    await this.usuarioRepository.softDelete(id);
  }

  private toResponse(usuario: Usuario): UsuarioResponseDto {
    return {
      id: usuario.id,
      rol: usuario.rol,
      nombre: usuario.nombre,
      correoElectronico: usuario.correoElectronico,
      activo: usuario.activo,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
      deletedAt: usuario.deletedAt,
    };
  }
}
