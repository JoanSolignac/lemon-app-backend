import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LoginDto } from '../dtos/requests/login.dto';
import { AccessTokenDto } from '../dtos/responses/access-token.dto';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import type { AuthenticatedUser } from 'src/common/interfaces/authenticated-user.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
    description:
      'Inicio de sesión realizado correctamente. Devuelve el token de acceso del usuario autenticado.',
    type: AccessTokenDto,
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. El correo electrónico o la contraseña no cumplen con el formato requerido.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Credenciales inválidas. El correo electrónico o la contraseña no son correctos.',
  })
  async login(@Body() dto: LoginDto): Promise<AccessTokenDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description:
      'Token renovado correctamente. Devuelve un nuevo token de acceso.',
    type: AccessTokenDto,
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. El token enviado no cumple con el formato requerido.',
  })
  @ApiUnauthorizedResponse({
    description:
      'No autorizado. Se requiere un refresh token válido para renovar el token de acceso.',
  })
  async refresh(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AccessTokenDto> {
    return this.authService.refresh(user);
  }
}
