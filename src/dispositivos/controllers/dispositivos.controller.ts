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
import { CreateDispositivoDto } from '../dtos/requests/create-dispositivo.dto';
import { DispositivoResponseDto } from '../dtos/responses/dispositivo.dto';
import { DispositivosService } from '../services/dispositivos.service';
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
@ApiTags('Dispositivos')
@ApiExtraModels(PaginatedResultDto, DispositivoResponseDto)
@Controller('dispositivos')
export class DispositivosController {
  private readonly logger = new Logger(DispositivosController.name);

  constructor(private readonly dispositivosService: DispositivosService) {}

  @UseAuth()
  @Post()
  @ApiCreatedResponse({
    description:
      'El registro se ha creado correctamente, y se devuelve el objeto del dispositivo creado.',
    type: DispositivoResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido, no tiene permisos para realizar esta acción.',
  })
  async create(
    @Body() dto: CreateDispositivoDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DispositivoResponseDto> {
    this.logger.debug(
      `Creando dispositivo: deviceId=${dto.deviceId}, userId=${user.id}`,
    );
    return this.dispositivosService.create(user.id, dto);
  }

  @UseAuth(Rol.ADMINISTRADOR)
  @Get()
  @ApiOkResponse({
    description: 'Lista paginada de dispositivos obtenida correctamente.',
    type: PaginatedResultDto<DispositivoResponseDto>,
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. Los parámetros de paginación no son correctos.',
  })
  @ApiForbiddenResponse({
    description:
      'Prohibido. Solo un administrador puede listar todos los dispositivos.',
  })
  async findAllForPagination(
    @Query() dto: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<DispositivoResponseDto>> {
    this.logger.debug(`Listando dispositivos: page=${dto.page}, limit=${dto.limit}`);
    return this.dispositivosService.findAllForPagination(dto);
  }

  @UseAuth()
  @Get(':deviceId')
  @ApiOkResponse({
    description: 'Dispositivo encontrado correctamente.',
    type: DispositivoResponseDto,
    nullable: true,
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. El identificador del dispositivo no tiene formato UUID válido.',
  })
  @ApiForbiddenResponse({
    description:
      'Prohibido. No tiene permisos para consultar este dispositivo.',
  })
  async findById(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<DispositivoResponseDto | null> {
    this.logger.debug(`Buscando dispositivo por id: ${deviceId}`);
    return this.dispositivosService.findById(deviceId);
  }

  @UseAuth()
  @Patch(':deviceId')
  @HttpCode(204)
  @ApiNoContentResponse({
    description:
      'Dispositivo actualizado correctamente. No se devuelve contenido en la respuesta.',
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. El identificador del dispositivo no tiene formato UUID válido.',
  })
  @ApiForbiddenResponse({
    description:
      'Prohibido. No tiene permisos para actualizar este dispositivo.',
  })
  async update(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    this.logger.debug(
      `Actualizando dispositivo: deviceId=${deviceId}, userId=${user.id}`,
    );
    await this.dispositivosService.update(deviceId, user.id);
  }

  @UseAuth()
  @Patch(':deviceId/sync')
  @HttpCode(204)
  @ApiNoContentResponse({
    description:
      'Sincronización del dispositivo actualizada correctamente. No se devuelve contenido en la respuesta.',
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. El identificador del dispositivo no tiene formato UUID válido.',
  })
  @ApiForbiddenResponse({
    description:
      'Prohibido. No tiene permisos para sincronizar este dispositivo.',
  })
  async updateLastSync(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<void> {
    this.logger.debug(`Sincronizando dispositivo: deviceId=${deviceId}`);
    await this.dispositivosService.updateLastSync(deviceId);
  }

  @UseAuth()
  @Delete(':deviceId')
  @HttpCode(204)
  @ApiNoContentResponse({
    description:
      'Dispositivo eliminado correctamente. No se devuelve contenido en la respuesta.',
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. El identificador del dispositivo no tiene formato UUID válido.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido. No tiene permisos para eliminar este dispositivo.',
  })
  async delete(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<void> {
    this.logger.debug(`Eliminando dispositivo: deviceId=${deviceId}`);
    await this.dispositivosService.delete(deviceId);
  }
}
