import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { LoginDto } from '../dtos/requests/login.dto';
import { AccessTokenDto } from '../dtos/responses/access-token.dto';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import type { AuthenticatedUser } from 'src/common/interfaces/authenticated-user.interface';

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
  async refresh(@CurrentUser() user: AuthenticatedUser): Promise<AccessTokenDto> {
    return this.authService.refresh(user);
  }
}
