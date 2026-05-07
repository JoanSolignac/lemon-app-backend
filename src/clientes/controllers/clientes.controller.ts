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
import { SyncQueryDto } from 'src/common/dtos/requests/sync-query.dto';
import { PaginatedResultDto } from 'src/common/dtos/responses/paginated-result.dto';
import { CreateClienteDto } from '../dtos/requests/create-cliente.dto';
import { DeleteClienteDto } from '../dtos/requests/delete-cliente.dto';
import { UpdateClienteDto } from '../dtos/requests/update-cliente.dto';
import { ClienteResponseDto } from '../dtos/responses/cliente-response.dto';
import { ClientesService } from '../services/clientes.service';
import { UseAuth } from 'src/common/decorators/use-auth.decorator';
import { Rol } from 'src/common/types/user-role.enum';
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
@ApiTags('Clientes')
@ApiExtraModels(PaginatedResultDto, ClienteResponseDto)
@UseAuth(Rol.ADMINISTRADOR, Rol.SUPERVISOR)
@Controller('clientes')
export class ClientesController {
  private readonly logger = new Logger(ClientesController.name);

  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiCreatedResponse({
    description:
      'Cliente creado correctamente. Devuelve la información del cliente registrado.',
    type: ClienteResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido. No tiene permisos para realizar esta acción.',
  })
  async create(@Body() dto: CreateClienteDto): Promise<ClienteResponseDto> {
    this.logger.debug(
      `Creando cliente: razonSocial=${dto.razonSocial}, tipoDocumento=${dto.tipoDocumento}, tipoCliente=${dto.tipoCliente}`,
    );
    return this.clientesService.create(dto);
  }

  @Get('numero-documento/:numeroDocumento')
  @ApiOkResponse({
    description: 'Cliente encontrado correctamente.',
    type: ClienteResponseDto,
    nullable: true,
  })
  @ApiForbiddenResponse({
    description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async findByNumeroDocumento(
    @Param('numeroDocumento') numeroDocumento: string,
  ): Promise<ClienteResponseDto | null> {
    this.logger.debug(`Buscando cliente por numero de documento`);
    return this.clientesService.findByNumeroDocumento(numeroDocumento);
  }

  @Get('sync')
  @ApiOkResponse({
    description:
      'Lista de clientes obtenida correctamente para sincronización.',
    type: ClienteResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. Los parámetros de sincronización no son correctos.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async findAllForSync(
    @Query() dto: SyncQueryDto,
  ): Promise<ClienteResponseDto[]> {
    this.logger.debug(`Sincronizando clientes desde: ${dto.lastSync.toISOString()}`);
    return this.clientesService.findAllForSync(dto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista paginada de clientes obtenida correctamente.',
    type: PaginatedResultDto<ClienteResponseDto>,
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
  ): Promise<PaginatedResultDto<ClienteResponseDto>> {
    this.logger.debug(`Listando clientes: page=${dto.page}, limit=${dto.limit}`);
    return this.clientesService.findAllPaginated(dto);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Cliente encontrado correctamente.',
    type: ClienteResponseDto,
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
  ): Promise<ClienteResponseDto | null> {
    this.logger.debug(`Buscando cliente por id: ${id}`);
    return this.clientesService.findById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description:
      'El cliente se ha actualizado correctamente. No se devuelve contenido.',
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClienteDto,
  ): Promise<void> {
    this.logger.debug(`Actualizando cliente: id=${id}, version=${dto.version}`);
    await this.clientesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description:
      'El cliente se ha eliminado correctamente. No se devuelve contenido.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DeleteClienteDto,
  ): Promise<void> {
    this.logger.debug(`Eliminando cliente: id=${id}, version=${dto.version}`);
    await this.clientesService.delete(id, dto);
  }
}
