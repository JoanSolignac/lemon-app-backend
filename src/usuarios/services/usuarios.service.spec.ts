import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { IUSUARIO_REPOSITORY } from '../constants/usuarios.constant';
import { CreateUsuarioDto } from '../dtos/requests/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/requests/update-usuario';
import { IUsuariosRepository } from '../repositories/usuarios.repository';
import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  let usuariosService: UsuariosService;

  const usuarioRepository: jest.Mocked<IUsuariosRepository> = {
    create: jest.fn(),
    findById: jest.fn(),
    findByCorreoElectronico: jest.fn(),
    findAllForSync: jest.fn(),
    findAllForPagination: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  enum Rol {
    ADMINISTRADOR = 'ADMINISTRADOR',
    SUPERVISOR = 'SUPERVISOR',
  }

  const ID_USUARIO = 'usr-001';
  const CORREO_ELECTRONICO = 'admin@lemon.pe';
  const NOMBRE = 'JUAN PEREZ';

  const createDto: CreateUsuarioDto = {
    id: ID_USUARIO,
    rol: Rol.ADMINISTRADOR,
    nombre: NOMBRE,
    correoElectronico: CORREO_ELECTRONICO,
    contrasena: '123456',
  };

  const usuarioMock = {
    ...createDto,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: IUSUARIO_REPOSITORY,
          useValue: usuarioRepository,
        },
      ],
    }).compile();

    usuariosService = module.get<UsuariosService>(UsuariosService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear un nuevo usuario', async () => {
      usuarioRepository.create.mockResolvedValue(usuarioMock);

      const result = await usuariosService.create(createDto);

      expect(usuarioRepository.create).toHaveBeenCalledTimes(1);
      expect(usuarioRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createDto,
          activo: true,
          deletedAt: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
      expect(result).toEqual(usuarioMock);
    });

    it('debe propagar conflicto por claves unicas al crear un usuario', async () => {
      const error = new ConflictException('Correo electronico ya registrado');
      usuarioRepository.create.mockRejectedValue(error);

      await expect(usuariosService.create(createDto)).rejects.toThrow(ConflictException);
      expect(usuarioRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('debe retornar un usuario si existe', async () => {
      usuarioRepository.findById.mockResolvedValue(usuarioMock);

      const result = await usuariosService.findById(ID_USUARIO);

      expect(usuarioRepository.findById).toHaveBeenCalledWith(ID_USUARIO);
      expect(usuarioRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(usuarioMock);
    });

    it('debe retornar null si el usuario no existe', async () => {
      usuarioRepository.findById.mockResolvedValue(null);

      const result = await usuariosService.findById(ID_USUARIO);

      expect(usuarioRepository.findById).toHaveBeenCalledWith(ID_USUARIO);
      expect(usuarioRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('findByCorreoElectronico', () => {
    it('debe retornar un usuario por correo electronico', async () => {
      usuarioRepository.findByCorreoElectronico.mockResolvedValue(usuarioMock);

      const result = await usuariosService.findByCorreoElectronico(CORREO_ELECTRONICO);

      expect(usuarioRepository.findByCorreoElectronico).toHaveBeenCalledWith(CORREO_ELECTRONICO);
      expect(usuarioRepository.findByCorreoElectronico).toHaveBeenCalledTimes(1);
      expect(result).toEqual(usuarioMock);
    });

    it('debe retornar null si no existe usuario con el correo electronico', async () => {
      usuarioRepository.findByCorreoElectronico.mockResolvedValue(null);

      const result = await usuariosService.findByCorreoElectronico(CORREO_ELECTRONICO);

      expect(usuarioRepository.findByCorreoElectronico).toHaveBeenCalledWith(CORREO_ELECTRONICO);
      expect(usuarioRepository.findByCorreoElectronico).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('findAllForSync', () => {
    it('debe delegar la búsqueda de cambios desde la última sincronización', async () => {
      const lastSync = new Date();
      usuarioRepository.findAllForSync.mockResolvedValue([usuarioMock]);

      const result = await usuariosService.findAllForSync(lastSync);

      expect(usuarioRepository.findAllForSync).toHaveBeenCalledWith(lastSync);
      expect(usuarioRepository.findAllForSync).toHaveBeenCalledTimes(1);
      expect(result).toEqual([usuarioMock]);
    });
  });

  describe('findAllPaginated', () => {
    it('debe retornar usuarios paginados', async () => {
      const dto: PaginatedQueryDto = { page: 2, limit: 10 };
      usuarioRepository.findAllForPagination.mockResolvedValue({ data: [usuarioMock], total: 25 });

      const result = await usuariosService.findAllPaginated(dto);

      expect(usuarioRepository.findAllForPagination).toHaveBeenCalledWith({ skip: 10, take: 10 });
      expect(usuarioRepository.findAllForPagination).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: [usuarioMock],
        page: 2,
        limit: 10,
        total: 25,
      });
    });

    it('debe normalizar parámetros de paginación', async () => {
      const dto: PaginatedQueryDto = { page: 0, limit: 500 };
      usuarioRepository.findAllForPagination.mockResolvedValue({ data: [], total: 0 });

      const result = await usuariosService.findAllPaginated(dto);

      expect(usuarioRepository.findAllForPagination).toHaveBeenCalledWith({ skip: 0, take: 100 });
      expect(usuarioRepository.findAllForPagination).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: [],
        page: 1,
        limit: 100,
        total: 0,
      });
    });
  });

  describe('update', () => {
    const updateDto: UpdateUsuarioDto = {
      rol: Rol.SUPERVISOR,
      nombre: NOMBRE,
      correoElectronico: CORREO_ELECTRONICO,
      contrasena: '654321',
      activo: true,
    };

    it('debe actualizar un usuario', async () => {
      usuarioRepository.update.mockResolvedValue();

      const result = await usuariosService.update(ID_USUARIO, updateDto);

      expect(usuarioRepository.update).toHaveBeenCalledWith({
        id: ID_USUARIO,
        data: updateDto,
      });
      expect(result).toBeUndefined();
    });

    it('debe propagar conflicto por claves unicas al actualizar un usuario', async () => {
      const error = new ConflictException('Correo electronico ya registrado');
      usuarioRepository.update.mockRejectedValue(error);

      await expect(usuariosService.update(ID_USUARIO, updateDto)).rejects.toThrow(ConflictException);
      expect(usuarioRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('debe eliminar un usuario', async () => {
      usuarioRepository.softDelete.mockResolvedValue();

      const result = await usuariosService.delete(ID_USUARIO);

      expect(usuarioRepository.softDelete).toHaveBeenCalledWith(ID_USUARIO);
      expect(result).toBeUndefined();
    });

    it('debe propagar error al eliminar un usuario', async () => {
      const error = new Error('Error al eliminar usuario');
      usuarioRepository.softDelete.mockRejectedValue(error);

      await expect(usuariosService.delete(ID_USUARIO)).rejects.toThrow('Error al eliminar usuario');
      expect(usuarioRepository.softDelete).toHaveBeenCalledTimes(1);
    });
  });
});
