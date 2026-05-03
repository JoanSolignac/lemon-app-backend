import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
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

@UseAuth(Rol.ADMINISTRADOR)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() dto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
    return this.usuariosService.create(dto);
  }

  @Get('correo/:correoElectronico')
  async findByCorreoElectronico(@Param('correoElectronico') correoElectronico: string): Promise<UsuarioResponseDto | null> {
    return this.usuariosService.findByCorreoElectronico(correoElectronico);
  }

  @Get()
  async findAllPaginated(@Query() dto: PaginatedQueryDto): Promise<PaginatedResultDto<UsuarioResponseDto>> {
    return this.usuariosService.findAllPaginated(dto);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<UsuarioResponseDto | null> {
    return this.usuariosService.findById(id);
  }

  @UseAuth(Rol.ADMINISTRADOR, Rol.SUPERVISOR)
  @Patch()
  @HttpCode(204)
  async update(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateUsuarioDto): Promise<void> {
    console.log(user)
    await this.usuariosService.update(user.id, dto);
  }

  @UseAuth(Rol.ADMINISTRADOR)
  @Patch(':id/rol')
  @HttpCode(204)
  async updateRol(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUsuarioRolDto): Promise<void> {
    await this.usuariosService.updateRol(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usuariosService.delete(id);
  }
}
