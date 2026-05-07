import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { PaginatedResultDto } from 'src/common/dtos/responses/paginated-result.dto';
import { CreateDispositivoDto } from '../dtos/requests/create-dispositivo.dto';
import { DispositivoDto } from '../dtos/responses/dispositivo.dto';
import { DispositivosService } from '../services/dispositivos.service';
import { UseAuth } from 'src/common/decorators/use-auth.decorator';
import { Rol } from 'src/common/types/user-role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/common/interfaces/authenticated-user.interface';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiExtraModels, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Autenticación de portador no autorizada, se requiere un token válido para acceder a este recurso.',
})
@ApiTags('Dispositivos')
@ApiExtraModels(PaginatedResultDto, DispositivoDto)
@ApiUnauthorizedResponse({
  description: 'No autorizado. Se requiere un token Bearer válido para acceder a este recurso.',
})
@Controller('dispositivos')
export class DispositivosController {
  constructor(private readonly dispositivosService: DispositivosService) {}

  @UseAuth()
  @Post()
  @ApiCreatedResponse({
      description: 'El registro se ha creado correctamente, y se devuelve el objeto del cliente creado.',
        type: DispositivoDto,
  })
  @ApiBadRequestResponse({
  description: 'Solicitud inválida. Los datos enviados no cumplen con las validaciones requeridas.',
  })
  @ApiForbiddenResponse({ description: 'Prohibido, no tiene permisos para realizar esta acción.' })
  async create(
    @Body() dto: CreateDispositivoDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DispositivoDto> {
    return this.dispositivosService.create(user.id, dto);
  }

  @UseAuth(Rol.ADMINISTRADOR)
  @Get()
  @ApiOkResponse({
    description: 'Lista paginada de dispositivos obtenida correctamente.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResultDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(DispositivoDto) },
            },
          },
        },
      ],
      example: {
        data: [
          {
            deviceId: '8f3f4b2e-6d5c-4e2c-9a8b-123456789abc',
            userId: 'a1b2c3d4-5678-90ab-cdef-123456789abc',
            activo: true,
            lastSyncAt: '2026-05-05T20:30:00.000Z',
            metadata: {
              name: 'Dispositivo principal',
              platform: 'Windows',
              version: 1,
            },
            createdAt: '2026-05-05T20:00:00.000Z',
            updatedAt: '2026-05-05T20:30:00.000Z',
            deletedAt: null,
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Solicitud inválida. Los parámetros de paginación no son correctos.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido. Solo un administrador puede listar todos los dispositivos.',
  })
  async findAllForPagination(
    @Query() dto: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<DispositivoDto>> {
    return this.dispositivosService.findAllForPagination(dto);
  }

  @UseAuth()
  @Get(':deviceId')
  @ApiOkResponse({
    description: 'Dispositivo encontrado correctamente.',
      type: DispositivoDto,
  })
  @ApiBadRequestResponse({
    description: 'Solicitud inválida. El identificador del dispositivo no tiene formato UUID válido.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido. No tiene permisos para consultar este dispositivo.',
  })
  async findById(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<DispositivoDto> {
    return this.dispositivosService.findById(deviceId);
  }

  @UseAuth()
  @Patch(':deviceId')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'Dispositivo actualizado correctamente. No se devuelve contenido en la respuesta.',
  })
  @ApiBadRequestResponse({
    description: 'Solicitud inválida. El identificador del dispositivo no tiene formato UUID válido.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido. No tiene permisos para actualizar este dispositivo.',
  })
  async update(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.dispositivosService.update(deviceId, user.id);
  }

  @UseAuth()
  @Patch(':deviceId/sync')
  @HttpCode(204)
   @ApiNoContentResponse({
    description: 'Sincronización del dispositivo actualizada correctamente. No se devuelve contenido en la respuesta.',
  })
   @ApiBadRequestResponse({
    description: 'Solicitud inválida. El identificador del dispositivo no tiene formato UUID válido.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido. No tiene permisos para sincronizar este dispositivo.',
  })
  async updateLastSync(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<void> {
    await this.dispositivosService.updateLastSync(deviceId);
  }

  @UseAuth()
  @Delete(':deviceId')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'Dispositivo eliminado correctamente. No se devuelve contenido en la respuesta.',
  })
  @ApiBadRequestResponse({
    description: 'Solicitud inválida. El identificador del dispositivo no tiene formato UUID válido.',
  })
  @ApiForbiddenResponse({
    description: 'Prohibido. No tiene permisos para eliminar este dispositivo.',
  })
  async delete(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<void> {
    await this.dispositivosService.delete(deviceId);
  }
}
