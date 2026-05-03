import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { SyncQueryDto } from 'src/common/dtos/requests/sync-query.dto';
import { CreateUsuarioDto } from '../dtos/requests/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/requests/update-usuario';
import { UserPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Rol } from 'src/common/types/user-role.enum';
import { UsuariosService } from '../services/usuarios.service';
import { UsuariosController } from './usuarios.controller';

describe('UsuariosController', () => {
  let controller: UsuariosController;

  const usuariosService: jest.Mocked<UsuariosService> = {
    create: jest.fn(),
    findById: jest.fn(),
    findByCorreoElectronico: jest.fn(),
    findAllForSync: jest.fn(),
    findAllPaginated: jest.fn(),
    update: jest.fn(),
    updateRol: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<UsuariosService>;

  enum Rol {
    ADMINISTRADOR = 'ADMINISTRADOR',
    SUPERVISOR = 'SUPERVISOR',
  }

  const ID_USUARIO = '2f5c7d3f-0a0b-4b9d-8e2a-7d7c9d7d4a11';

  const usuarioMock = {
    id: ID_USUARIO,
    rol: Rol.ADMINISTRADOR,
    nombre: 'JUAN PEREZ',
    correoElectronico: 'admin@lemon.pe',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: usuariosService,
        },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un usuario', async () => {
      const dto: CreateUsuarioDto = {
        rol: Rol.ADMINISTRADOR,
        nombre: 'JUAN PEREZ',
        correoElectronico: 'admin@lemon.pe',
        contrasena: '123456',
      };
      usuariosService.create.mockResolvedValue(usuarioMock);

      const result = await controller.create(dto);

      expect(usuariosService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(usuarioMock);
    });
  });

  describe('findById', () => {
    it('debe retornar un usuario por id', async () => {
      usuariosService.findById.mockResolvedValue(usuarioMock);

      const result = await controller.findById(ID_USUARIO);

      expect(usuariosService.findById).toHaveBeenCalledWith(ID_USUARIO);
      expect(result).toEqual(usuarioMock);
    });
  });

  describe('findByCorreoElectronico', () => {
    it('debe retornar un usuario por correo electronico', async () => {
      usuariosService.findByCorreoElectronico.mockResolvedValue(usuarioMock);

      const result = await controller.findByCorreoElectronico('admin@lemon.pe');

      expect(usuariosService.findByCorreoElectronico).toHaveBeenCalledWith('admin@lemon.pe');
      expect(result).toEqual(usuarioMock);
    });
  });

  describe('findAllPaginated', () => {
    it('debe retornar usuarios paginados', async () => {
      const dto: PaginatedQueryDto = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [usuarioMock],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
        },
      };
      usuariosService.findAllPaginated.mockResolvedValue(paginatedResult);

      const result = await controller.findAllPaginated(dto);

      expect(usuariosService.findAllPaginated).toHaveBeenCalledWith(dto);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('update', () => {
    it('debe actualizar un usuario', async () => {
      const dto: UpdateUsuarioDto = {
        nombre: 'JUAN PEREZ',
      };
      const user: UserPayload = {
        sub: ID_USUARIO,
        email: 'admin@lemon.pe',
        rol: Rol.ADMINISTRADOR,
      };
      usuariosService.update.mockResolvedValue();

      const result = await controller.update(user, dto);

      expect(usuariosService.update).toHaveBeenCalledWith(ID_USUARIO, dto);
      expect(result).toBeUndefined();
    });
  });

  describe('updateRol', () => {
    it('debe actualizar el rol de un usuario', async () => {
      const dto = { rol: Rol.SUPERVISOR };
      usuariosService.updateRol.mockResolvedValue();

      const result = await controller.updateRol(ID_USUARIO, dto);

      expect(usuariosService.updateRol).toHaveBeenCalledWith(ID_USUARIO, dto);
      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('debe eliminar un usuario', async () => {
      usuariosService.delete.mockResolvedValue();

      const result = await controller.delete(ID_USUARIO);

      expect(usuariosService.delete).toHaveBeenCalledWith(ID_USUARIO);
      expect(result).toBeUndefined();
    });
  });

  describe('ParseUUIDPipe', () => {
    const pipe = new ParseUUIDPipe();

    it('debe aceptar un UUID válido', async () => {
      const validUuid = '2f5c7d3f-0a0b-4b9d-8e2a-7d7c9d7d4a11';

      const result = await pipe.transform(validUuid, { type: 'param', metatype: String });

      expect(result).toBe(validUuid);
    });

    it('debe lanzar BadRequestException para un ID inválido', async () => {
      const invalidId = 'usr-001';

      await expect(pipe.transform(invalidId, { type: 'param', metatype: String })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debe lanzar BadRequestException para un UUID con formato incorrecto', async () => {
      const malformedUuid = 'not-a-uuid';

      await expect(pipe.transform(malformedUuid, { type: 'param', metatype: String })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
