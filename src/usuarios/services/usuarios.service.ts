import { Inject, Injectable } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { SyncQueryDto } from 'src/common/dtos/requests/sync-query.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';
import { calculateSkipTakeForPagination, normalizePaginationDto } from 'src/common/utils/pagination.util';
import { HashService } from 'src/hash/services/hash.service';
import { IUSUARIO_REPOSITORY } from '../constants/usuarios.constant';
import { CreateUsuarioDto } from '../dtos/requests/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/requests/update-usuario';
import { UsuarioResponseDto } from '../dtos/responses/usuario-response.dto';
import type { IUsuariosRepository } from '../repositories/usuarios.repository';
import { UsuarioForAuth } from '../types/usuario-for-auth.type';
import { Usuario } from '../types/usuario.type';

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(IUSUARIO_REPOSITORY)
    private readonly usuarioRepository: IUsuariosRepository,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
    const now = new Date();
    const hashedPassword = await this.hashService.hash(dto.contrasena);
    const usuario: Omit<Usuario, 'id'> = {
      rol: dto.rol,
      nombre: dto.nombre,
      correoElectronico: dto.correoElectronico,
      contrasena: hashedPassword,
      activo: true,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
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

  async findAllForSync(dto: SyncQueryDto): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.usuarioRepository.findAllForSync(dto);

    return usuarios.map((u) => this.toResponse(u));
  }

  async findAllPaginated(dto: PaginatedQueryDto): Promise<PaginatedResult<UsuarioResponseDto>> {
    const { page, limit } = normalizePaginationDto(dto);
    const { skip, take } = calculateSkipTakeForPagination({ page, limit });
    const { data, total } = await this.usuarioRepository.findAllForPagination({ skip, take });

    return {
      data: data.map((u) => this.toResponse(u)),
      page,
      limit,
      total,
    };
  }

  async update(id: string, dto: UpdateUsuarioDto): Promise<void> {
    const hashedPassword = dto.contrasena ? await this.hashService.hash(dto.contrasena) : undefined;

    await this.usuarioRepository.update({
      id,
      data: {
        rol: dto.rol,
        nombre: dto.nombre,
        correoElectronico: dto.correoElectronico,
        contrasena: hashedPassword,
        activo: dto.activo,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.usuarioRepository.softDelete(id);
  }

  private toResponse(usuario: Partial<Usuario>): UsuarioResponseDto {
    return {
      id: usuario.id!,
      rol: usuario.rol!,
      nombre: usuario.nombre!,
      correoElectronico: usuario.correoElectronico!,
      activo: usuario.activo!,
      createdAt: usuario.createdAt!,
      updatedAt: usuario.updatedAt!,
      deletedAt: usuario.deletedAt ?? null,
    };
  }
}
