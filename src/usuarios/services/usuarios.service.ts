import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { PaginatedResultDto } from 'src/common/dtos/responses/paginated-result.dto';
import {
  calculateSkipTakeForPagination,
  normalizePaginationDto,
} from 'src/common/utils/pagination.util';
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
  private readonly logger = new Logger(UsuariosService.name);

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
    this.logger.log(
      `Usuario creado exitosamente: id=${createdUsuario.id}, nombre=${createdUsuario.nombre}, rol=${createdUsuario.rol}`,
    );

    return this.toResponse(createdUsuario);
  }

  async findById(id: string): Promise<UsuarioResponseDto | null> {
    const usuario = await this.usuarioRepository.findById(id);

    if (usuario) {
      this.logger.log(`Usuario encontrado: id=${usuario.id}, nombre=${usuario.nombre}`);
    } else {
      this.logger.log(`Usuario no encontrado: id=${id}`);
    }

    return usuario ? this.toResponse(usuario) : null;
  }

  async findByCorreoElectronico(
    correoElectronico: string,
  ): Promise<UsuarioResponseDto | null> {
    const usuario =
      await this.usuarioRepository.findByCorreoElectronico(correoElectronico);

    if (usuario) {
      this.logger.log(`Usuario encontrado por correo: id=${usuario.id}, nombre=${usuario.nombre}`);
    } else {
      this.logger.log(`Usuario no encontrado por correo`);
    }

    return usuario ? this.toResponse(usuario) : null;
  }

  async findForAuthByCorreoElectronico(
    correoElectronico: string,
  ): Promise<UsuarioForAuth | null> {
    this.logger.debug(`Buscando credenciales de usuario para autenticacion`);
    return this.usuarioRepository.findForAuthByCorreoElectronico(
      correoElectronico,
    );
  }

  async findAllPaginated(
    dto: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<UsuarioResponseDto>> {
    const { page, limit } = normalizePaginationDto(dto);
    const { skip, take } = calculateSkipTakeForPagination({ page, limit });
    const { data, total } = await this.usuarioRepository.findAllForPagination({
      skip,
      take,
    });

    this.logger.log(
      `Usuarios listados: total=${total}, page=${page}, limit=${limit}, resultados=${data.length}`,
    );

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
    const hashedPassword = dto.contrasena
      ? await this.hashService.hash(dto.contrasena)
      : undefined;

    await this.usuarioRepository.update({
      id,
      data: {
        nombre: dto.nombre,
        correoElectronico: dto.correoElectronico,
        contrasena: hashedPassword,
      },
    });
    this.logger.log(`Usuario actualizado: id=${id}`);
  }

  async updateRol(id: string, dto: UpdateUsuarioRolDto): Promise<void> {
    await this.usuarioRepository.updateRol({ id, rol: dto.rol });
    this.logger.log(`Rol actualizado: id=${id}, rol=${dto.rol}`);
  }

  async delete(id: string): Promise<void> {
    await this.usuarioRepository.softDelete(id);
    this.logger.log(`Usuario eliminado: id=${id}`);
  }

  private toResponse(usuario: Usuario): UsuarioResponseDto {
    return new UsuarioResponseDto(usuario);
  }
}
