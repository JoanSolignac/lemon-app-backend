import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { PaginatedResultDto } from 'src/common/dtos/responses/paginated-result.dto';
import { CreateUsuarioDto } from '../dtos/requests/create-usuario.dto';
import { UsuarioResponseDto } from '../dtos/responses/usuario-response.dto';
import { UpdateUsuarioDto } from '../dtos/requests/update-usuario';
import { UpdateUsuarioRolDto } from '../dtos/requests/update-usuario-rol.dto';
import { UsuariosService } from '../services/usuarios.service';
import { UseAuth } from 'src/common/decorators/use-auth.decorator';
import { Rol } from 'src/common/types/user-role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/common/interfaces/authenticated-user.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description:
    'Autenticación de portador no autorizada, se requiere un token válido para acceder a este recurso.',
})
@ApiTags('Usuarios')
@ApiExtraModels(PaginatedResultDto, UsuarioResponseDto)
@UseAuth(Rol.ADMINISTRADOR)
@Controller('usuarios')
export class UsuariosController {
  private readonly logger = new Logger(UsuariosController.name);

  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiCreatedResponse({
    description:
      'El registro se ha creado correctamente, y se devuelve el objeto del cliente creado.',
    type: UsuarioResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async create(@Body() dto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
    this.logger.debug(
      `Creando usuario: nombre=${dto.nombre}, rol=${dto.rol}`,
    );
    return this.usuariosService.create(dto);
  }

  @Get('correo/:correoElectronico')
  @ApiOkResponse({
    description:
      'Usuario encontrado correctamente mediante su correo electrónico.',
    type: UsuarioResponseDto,
    nullable: true,
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. El correo electrónico enviado no tiene formato válido.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async findByCorreoElectronico(
    @Param('correoElectronico') correoElectronico: string,
  ): Promise<UsuarioResponseDto | null> {
    this.logger.debug(`Buscando usuario por correo electronico`);
    return this.usuariosService.findByCorreoElectronico(correoElectronico);
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista paginada de usuarios obtenida correctamente.',
    type: PaginatedResultDto<UsuarioResponseDto>,
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. Los parámetros de paginación no son correctos.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async findAllPaginated(
    @Query() dto: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<UsuarioResponseDto>> {
    this.logger.debug(`Listando usuarios: page=${dto.page}, limit=${dto.limit}`);
    return this.usuariosService.findAllPaginated(dto);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Usuario encontrado correctamente.',
    type: UsuarioResponseDto,
    nullable: true,
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. El identificador enviado no tiene formato UUID válido.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UsuarioResponseDto | null> {
    this.logger.debug(`Buscando usuario por id: ${id}`);
    return this.usuariosService.findById(id);
  }

  @UseAuth(Rol.ADMINISTRADOR, Rol.SUPERVISOR)
  @Patch()
  @HttpCode(204)
  @ApiNoContentResponse({
    description:
      'Usuario actualizado correctamente. No se devuelve contenido en la respuesta.',
  })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateUsuarioDto,
  ): Promise<void> {
    this.logger.debug(
      `Actualizando usuario autenticado: id=${user.id}, rol=${user.rol}, datos=${JSON.stringify({ nombre: dto.nombre, correo: dto.correoElectronico })}`,
    );
    await this.usuariosService.update(user.id, dto);
  }

  @UseAuth(Rol.ADMINISTRADOR)
  @Patch(':id/rol')
  @HttpCode(204)
  @ApiNoContentResponse({
    description:
      'Rol del usuario actualizado correctamente. No se devuelve contenido en la respuesta.',
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async updateRol(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUsuarioRolDto,
  ): Promise<void> {
    this.logger.debug(`Actualizando rol de usuario: id=${id}, nuevoRol=${dto.rol}`);
    await this.usuariosService.updateRol(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description:
      'Usuario eliminado correctamente. No se devuelve contenido en la respuesta.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.debug(`Eliminando usuario: id=${id}`);
    await this.usuariosService.delete(id);
  }
}
