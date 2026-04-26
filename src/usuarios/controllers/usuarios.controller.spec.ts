import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { CreateUsuarioDto } from '../dtos/requests/create-usuario.dto';
import { DeleteUsuarioDto } from '../dtos/requests/delete-usuario.dto';
import { SyncQueryDto } from '../dtos/requests/sync-query.dto';
import { UpdateUsuarioDto } from '../dtos/requests/update-usuario';
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
    delete: jest.fn(),
  } as unknown as jest.Mocked<UsuariosService>;

  enum Rol {
    ADMINISTRADOR = 'ADMINISTRADOR',
    SUPERVISOR = 'SUPERVISOR',
  }

  const usuarioMock = {
    id: 'usr-001',
    rol: Rol.ADMINISTRADOR,
    nombre: 'JUAN PEREZ',
    correoElectronico: 'admin@lemon.pe',
    contrasena: '123456',
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
        id: 'usr-001',
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

      const result = await controller.findById('usr-001');

      expect(usuariosService.findById).toHaveBeenCalledWith('usr-001');
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

  describe('findAllForSync', () => {
    it('debe retornar usuarios para sincronización', async () => {
      const dto: SyncQueryDto = { lastSync: new Date() };
      usuariosService.findAllForSync.mockResolvedValue([usuarioMock]);

      const result = await controller.findAllForSync(dto);

      expect(usuariosService.findAllForSync).toHaveBeenCalledWith(dto.lastSync!);
      expect(result).toEqual([usuarioMock]);
    });
  });

  describe('findAllPaginated', () => {
    it('debe retornar usuarios paginados', async () => {
      const dto: PaginatedQueryDto = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [usuarioMock],
        page: 1,
        limit: 10,
        total: 1,
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
        activo: true,
      };
      usuariosService.update.mockResolvedValue();

      const result = await controller.update('usr-001', dto);

      expect(usuariosService.update).toHaveBeenCalledWith('usr-001', dto);
      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('debe eliminar un usuario', async () => {
      const dto: DeleteUsuarioDto = {};
      usuariosService.delete.mockResolvedValue();

      const result = await controller.delete('usr-001', dto);

      expect(usuariosService.delete).toHaveBeenCalledWith('usr-001', dto);
      expect(result).toBeUndefined();
    });
  });
});
