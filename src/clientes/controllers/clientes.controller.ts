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
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Autenticación de portador no autorizada, se requiere un token válido para acceder a este recurso.',
})
@ApiTags('Clientes')
@UseAuth(Rol.ADMINISTRADOR, Rol.SUPERVISOR)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'El registro se ha creado correctamente, y se devuelve el objeto del cliente creado.',
  })
  @ApiForbiddenResponse({ description: 'Prohibido, no tiene permisos para realizar esta acción.' })
  async create(@Body() dto: CreateClienteDto): Promise<ClienteResponseDto> {
    return this.clientesService.create(dto);
  }

  @Get('numero-documento/:numeroDocumento')
  @ApiOkResponse({
    description: 'Cliente encontrado correctamente.',
  })
  @ApiForbiddenResponse({ description: 'Prohibido, no tiene permisos para realizar esta acción.' })
  async findByNumeroDocumento(@Param('numeroDocumento') numeroDocumento: string): Promise<ClienteResponseDto | null> {
    return this.clientesService.findByNumeroDocumento(numeroDocumento);
  }

  @Get('sync')
  @ApiOkResponse({
  description: 'Lista de clientes obtenida correctamente para sincronización.',
  }) 
  async findAllForSync(@Query() dto: SyncQueryDto): Promise<ClienteResponseDto[]> {
    return this.clientesService.findAllForSync(dto);
  }

  @Get()
  @ApiOkResponse({
  description: 'Lista paginada de clientes obtenida correctamente.',
  })
  async findAllPaginated(@Query() dto: PaginatedQueryDto): Promise<PaginatedResultDto<ClienteResponseDto>> {
    return this.clientesService.findAllPaginated(dto);
  }

  @Get(':id')
  @ApiOkResponse({
  description: 'Cliente encontrado correctamente.',
  })
  @ApiForbiddenResponse({ description: 'Prohibido, no tiene permisos para realizar esta acción.' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<ClienteResponseDto | null> {
    return this.clientesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
  description: 'El cliente se ha actualizado correctamente. No se devuelve contenido.',
  })
  @ApiForbiddenResponse({
  description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClienteDto): Promise<void> {
    await this.clientesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
  description: 'El cliente se ha eliminado correctamente. No se devuelve contenido.',
  })
  @ApiForbiddenResponse({
  description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async delete(@Param('id', ParseUUIDPipe) id: string, @Body() dto: DeleteClienteDto): Promise<void> {
    await this.clientesService.delete(id, dto);
  }
}
