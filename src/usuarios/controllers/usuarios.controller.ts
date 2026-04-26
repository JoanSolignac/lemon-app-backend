import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';
import { CreateUsuarioDto } from '../dtos/requests/create-usuario.dto';
import { SyncQueryDto } from '../dtos/requests/sync-query.dto';
import { UpdateUsuarioDto } from '../dtos/requests/update-usuario';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../types/usuario.type';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuariosService.create(dto);
  }

  @Get('correo/:correoElectronico')
  async findByCorreoElectronico(@Param('correoElectronico') correoElectronico: string): Promise<Usuario | null> {
    return this.usuariosService.findByCorreoElectronico(correoElectronico);
  }

  @Get('sync')
  async findAllForSync(@Query() dto: SyncQueryDto): Promise<Usuario[]> {
    return this.usuariosService.findAllForSync(dto.lastSync!);
  }

  @Get()
  async findAllPaginated(@Query() dto: PaginatedQueryDto): Promise<PaginatedResult<Usuario>> {
    return this.usuariosService.findAllPaginated(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Usuario | null> {
    return this.usuariosService.findById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto): Promise<void> {
    await this.usuariosService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.usuariosService.delete(id);
  }
}
