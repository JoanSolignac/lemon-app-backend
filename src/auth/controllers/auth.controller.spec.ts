import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginDto } from '../dtos/requests/login.dto';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  const authService: jest.Mocked<AuthService> = {
    login: jest.fn(),
    refresh: jest.fn(),
  } as unknown as jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('debe delegar el login al servicio de auth', async () => {
      const dto: LoginDto = {
        correoElectronico: 'admin@lemon.pe',
        contrasena: '123456',
      };
      const tokens = {
        accessToken: 'signed-access-token',
        refreshToken: 'signed-refresh-token',
      };
      authService.login.mockResolvedValue(tokens);

      const result = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(tokens);
    });
  });

  describe('refresh', () => {
    it('debe delegar el refresh al servicio de auth', async () => {
      const userPayload: Parameters<AuthController['refresh']>[0] = {
        sub: 'usr-001',
        email: 'admin@lemon.pe',
        rol: 'ADMINISTRADOR',
      };
      const tokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };
      authService.refresh.mockResolvedValue(tokens);

      const result = await controller.refresh(userPayload);

      expect(authService.refresh).toHaveBeenCalledWith(userPayload);
      expect(result).toEqual(tokens);
    });
  });
});
