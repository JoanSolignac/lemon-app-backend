import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { SyncQueryDto } from 'src/common/dtos/requests/sync-query.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';
import { CreateClienteDto } from '../dtos/requests/create-cliente.dto';
import { DeleteClienteDto } from '../dtos/requests/delete-cliente.dto';
import { UpdateClienteDto } from '../dtos/requests/update-cliente';
import { ClienteResponseDto } from '../dtos/responses/cliente-response.dto';
import { ClientesService } from '../services/clientes.service';

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
  async findAllPaginated(@Query() dto: PaginatedQueryDto): Promise<PaginatedResult<ClienteResponseDto>> {
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
