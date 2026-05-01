import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UnauthorizedException } from '@nestjs/common';
import { HashService } from 'src/hash/services/hash.service';
import { UsuariosService } from 'src/usuarios/services/usuarios.service';
import { Rol } from 'src/usuarios/types/usuario.type';
import { LoginDto } from '../dtos/requests/login.dto';

describe('AuthService', () => {
  let authService: AuthService;

  const usuariosService: jest.Mocked<UsuariosService> = {
    findForAuthByCorreoElectronico: jest.fn(),
  } as unknown as jest.Mocked<UsuariosService>;

  const hashService = {
    compare: jest.fn(),
  } as unknown as jest.Mocked<HashService>;

  const jwtService = {
    signAsync: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;

  const configService = {
    getOrThrow: jest.fn(),
  } as unknown as jest.Mocked<ConfigService>;

  const loginDto: LoginDto = {
    correoElectronico: 'admin@lemon.pe',
    contrasena: '123456',
  };

  const authUserMock = {
    id: 'usr-001',
    rol: Rol.ADMINISTRADOR,
    correoElectronico: loginDto.correoElectronico,
    contrasena: 'hashed-password',
    activo: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuariosService,
          useValue: usuariosService,
        },
        {
          provide: HashService,
          useValue: hashService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    configService.getOrThrow.mockImplementation((key: string) => {
      if (key === 'jwt.refreshSecret') return 'refresh-secret';
      if (key === 'jwt.refreshExpiresIn') return '7d';
      throw new Error(`Unexpected config key: ${key}`);
    });
  });

  it('debe estar definido', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('debe retornar access y refresh token cuando las credenciales son válidas', async () => {
      usuariosService.findForAuthByCorreoElectronico.mockResolvedValue(authUserMock);
      hashService.compare.mockResolvedValue(true);
      jwtService.signAsync
        .mockResolvedValueOnce('signed-access-token')
        .mockResolvedValueOnce('signed-refresh-token');

      const result = await authService.login(loginDto);

      expect(usuariosService.findForAuthByCorreoElectronico).toHaveBeenCalledWith(loginDto.correoElectronico);
      expect(hashService.compare).toHaveBeenCalledWith(loginDto.contrasena, authUserMock.contrasena);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: authUserMock.id,
        email: authUserMock.correoElectronico,
        rol: authUserMock.rol,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: authUserMock.id,
          email: authUserMock.correoElectronico,
          rol: authUserMock.rol,
        },
        {
          secret: 'refresh-secret',
          expiresIn: '7d',
        },
      );
      expect(result).toEqual({
        accessToken: 'signed-access-token',
        refreshToken: 'signed-refresh-token',
      });
    });

    it('debe rechazar cuando el usuario no existe', async () => {
      usuariosService.findForAuthByCorreoElectronico.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(hashService.compare).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('debe rechazar cuando el usuario está inactivo', async () => {
      usuariosService.findForAuthByCorreoElectronico.mockResolvedValue({
        ...authUserMock,
        activo: false,
      });

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(hashService.compare).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('debe rechazar cuando la contraseña es inválida', async () => {
      usuariosService.findForAuthByCorreoElectronico.mockResolvedValue(authUserMock);
      hashService.compare.mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('debe retornar nuevos access y refresh tokens a partir del payload autenticado', async () => {
      jwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await authService.refresh({
        sub: authUserMock.id,
        email: authUserMock.correoElectronico,
        rol: authUserMock.rol,
      });

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });
  });
});

