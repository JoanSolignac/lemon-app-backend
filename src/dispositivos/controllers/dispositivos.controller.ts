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
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Autenticación de portador no autorizada, se requiere un token válido para acceder a este recurso.',
})
@ApiTags('Dispositivos')
@Controller('dispositivos')
export class DispositivosController {
  constructor(private readonly dispositivosService: DispositivosService) {}

  @UseAuth()
  @Post()
  @ApiCreatedResponse({
      description: 'El registro se ha creado correctamente, y se devuelve el objeto del cliente creado.',
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
  async updateLastSync(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<void> {
    await this.dispositivosService.updateLastSync(deviceId);
  }

  @UseAuth()
  @Delete(':deviceId')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'Sincronización del dispositivo actualizada correctamente. No se devuelve contenido en la respuesta.',
  })
  async delete(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<void> {
    await this.dispositivosService.delete(deviceId);
  }
}
