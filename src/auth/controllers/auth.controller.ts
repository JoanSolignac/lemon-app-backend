import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LoginDto } from '../dtos/requests/login.dto';
import { AccessTokenDto } from '../dtos/responses/access-token.dto';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import type { UserPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../services/auth.service';
import { GetMe } from '../decorators/get-me.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto): Promise<AccessTokenDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  async refresh(@GetMe() userPayload: UserPayload): Promise<AccessTokenDto> {
    return this.authService.refresh(userPayload);
  }
}
