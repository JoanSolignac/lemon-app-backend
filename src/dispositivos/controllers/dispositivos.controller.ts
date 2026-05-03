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
import type { UserPayload } from 'src/common/interfaces/jwt-payload.interface';
import { UseAuth } from 'src/common/decorators/use-auth.decorator';
import { Rol } from 'src/common/types/user-role.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('dispositivos')
export class DispositivosController {
  constructor(private readonly dispositivosService: DispositivosService) {}

  @UseAuth()
  @Post()
  async create(
    @Body() dto: CreateDispositivoDto,
    @CurrentUser() user: UserPayload,
  ): Promise<DispositivoDto> {
    return this.dispositivosService.create(user.sub, dto);
  }

  @UseAuth(Rol.ADMINISTRADOR)
  @Get()
  async findAllForPagination(
    @Query() dto: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<DispositivoDto>> {
    return this.dispositivosService.findAllForPagination(dto);
  }

  @UseAuth()
  @Get(':deviceId')
  async findById(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<DispositivoDto> {
    return this.dispositivosService.findById(deviceId);
  }

  @UseAuth()
  @Patch(':deviceId')
  @HttpCode(204)
  async update(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
    @CurrentUser() user: UserPayload,
  ): Promise<void> {
    await this.dispositivosService.update(deviceId, user.sub);
  }

  @UseAuth()
  @Patch(':deviceId/sync')
  @HttpCode(204)
  async updateLastSync(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<void> {
    await this.dispositivosService.updateLastSync(deviceId);
  }

  @UseAuth()
  @Delete(':deviceId')
  @HttpCode(204)
  async delete(
    @Param('deviceId', ParseUUIDPipe) deviceId: string,
  ): Promise<void> {
    await this.dispositivosService.delete(deviceId);
  }
}
