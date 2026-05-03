import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { SyncQueryDto } from 'src/common/dtos/requests/sync-query.dto';
import { PaginatedResultDto } from 'src/common/dtos/responses/paginated-result.dto';
import { CreateClienteDto } from '../dtos/requests/create-cliente.dto';
import { DeleteClienteDto } from '../dtos/requests/delete-cliente.dto';
import { UpdateClienteDto } from '../dtos/requests/update-cliente.dto';
import { ClienteResponseDto } from '../dtos/responses/cliente-response.dto';
import { ClientesService } from '../services/clientes.service';
import { UseAuth } from 'src/common/decorators/use-auth.decorator';
import { Rol } from 'src/common/types/user-role.enum';

@UseAuth(Rol.ADMINISTRADOR, Rol.SUPERVISOR)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  async create(@Body() dto: CreateClienteDto): Promise<ClienteResponseDto> {
    return this.clientesService.create(dto);
  }

  @Get('numero-documento/:numeroDocumento')
  async findByNumeroDocumento(@Param('numeroDocumento') numeroDocumento: string): Promise<ClienteResponseDto | null> {
    return this.clientesService.findByNumeroDocumento(numeroDocumento);
  }

  @Get('sync')
  async findAllForSync(@Query() dto: SyncQueryDto): Promise<ClienteResponseDto[]> {
    return this.clientesService.findAllForSync(dto);
  }

  @Get()
  async findAllPaginated(@Query() dto: PaginatedQueryDto): Promise<PaginatedResultDto<ClienteResponseDto>> {
    return this.clientesService.findAllPaginated(dto);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<ClienteResponseDto | null> {
    return this.clientesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClienteDto): Promise<void> {
    await this.clientesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string, @Body() dto: DeleteClienteDto): Promise<void> {
    await this.clientesService.delete(id, dto);
  }
}
