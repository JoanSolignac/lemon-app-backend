import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';
import { CreateClienteDto } from '../dtos/requests/create-cliente.dto';
import { DeleteClienteDto } from '../dtos/requests/delete-cliente.dto';
import { SyncQueryDto } from '../../common/dtos/requests/sync-query.dto';
import { UpdateClienteDto } from '../dtos/requests/update-cliente';
import { ClientesService } from '../services/clientes.service';
import { Cliente } from '../types/cliente.type';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  async create(@Body() dto: CreateClienteDto): Promise<Cliente> {
    return this.clientesService.create(dto);
  }

  @Get('numero-documento/:numeroDocumento')
  async findByNumeroDocumento(@Param('numeroDocumento') numeroDocumento: string): Promise<Cliente | null> {
    return this.clientesService.findByNumeroDocumento(numeroDocumento);
  }

  @Get('sync')
  async findAllForSync(@Query() dto: SyncQueryDto): Promise<Cliente[]> {
    return this.clientesService.findAllForSync(dto.lastSync);
  }

  @Get()
  async findAllPaginated(@Query() dto: PaginatedQueryDto): Promise<PaginatedResult<Cliente>> {
    return this.clientesService.findAllPaginated(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Cliente | null> {
    return this.clientesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() dto: UpdateClienteDto): Promise<void> {
    await this.clientesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string, @Body() dto: DeleteClienteDto): Promise<void> {
    await this.clientesService.delete(id, dto);
  }
}
