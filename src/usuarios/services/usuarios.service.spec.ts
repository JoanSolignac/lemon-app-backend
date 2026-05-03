import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { SyncQueryDto } from 'src/common/dtos/requests/sync-query.dto';
import { IUSUARIO_REPOSITORY } from '../constants/usuarios.constant';
import { CreateUsuarioDto } from '../dtos/requests/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/requests/update-usuario';
import { IUsuariosRepository } from '../repositories/usuarios.repository';
import { HashService } from 'src/hash/services/hash.service';
import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  let usuariosService: UsuariosService;
  const hashService = {
    hash: jest.fn(),
  } as unknown as jest.Mocked<HashService>;

  const usuarioRepository: jest.Mocked<IUsuariosRepository> = {
    create: jest.fn(),
    findById: jest.fn(),
    findByCorreoElectronico: jest.fn(),
    findForAuthByCorreoElectronico: jest.fn(),
    findAllForPagination: jest.fn(),
    update: jest.fn(),
    updateRol: jest.fn(),
    softDelete: jest.fn(),
  };

  enum Rol {
    ADMINISTRADOR = 'ADMINISTRADOR',
    SUPERVISOR = 'SUPERVISOR',
  }

  const ID_USUARIO = '2f5c7d3f-0a0b-4b9d-8e2a-7d7c9d7d4a11';
  const CORREO_ELECTRONICO = 'admin@lemon.pe';
  const NOMBRE = 'JUAN PEREZ';

  const createDto: CreateUsuarioDto = {
    rol: Rol.ADMINISTRADOR,
    nombre: NOMBRE,
    correoElectronico: CORREO_ELECTRONICO,
    contrasena: '123456',
  };

  const usuarioMock = {
    id: ID_USUARIO,
    rol: Rol.ADMINISTRADOR,
    nombre: NOMBRE,
    correoElectronico: CORREO_ELECTRONICO,
    contrasena: 'hashed-123456',
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
        {
          provide: HashService,
          useValue: hashService,
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
      const hashedPassword = 'hashed-123456';
      hashService.hash.mockResolvedValue(hashedPassword);
      usuarioRepository.create.mockResolvedValue(usuarioMock);

      const result = await usuariosService.create(createDto);

      expect(hashService.hash).toHaveBeenCalledWith(createDto.contrasena);
      expect(usuarioRepository.create).toHaveBeenCalledTimes(1);
      expect(usuarioRepository.create).toHaveBeenCalledWith({
        rol: createDto.rol,
        nombre: createDto.nombre,
        correoElectronico: createDto.correoElectronico,
        contrasena: hashedPassword,
      });
      expect(result).toEqual({
        id: usuarioMock.id,
        rol: usuarioMock.rol,
        nombre: usuarioMock.nombre,
        correoElectronico: usuarioMock.correoElectronico,
        activo: usuarioMock.activo,
        createdAt: usuarioMock.createdAt,
        updatedAt: usuarioMock.updatedAt,
        deletedAt: usuarioMock.deletedAt,
      });
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
      expect(result).toEqual({
        id: usuarioMock.id,
        rol: usuarioMock.rol,
        nombre: usuarioMock.nombre,
        correoElectronico: usuarioMock.correoElectronico,
        activo: usuarioMock.activo,
        createdAt: usuarioMock.createdAt,
        updatedAt: usuarioMock.updatedAt,
        deletedAt: usuarioMock.deletedAt,
      });
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
      expect(result).toEqual({
        id: usuarioMock.id,
        rol: usuarioMock.rol,
        nombre: usuarioMock.nombre,
        correoElectronico: usuarioMock.correoElectronico,
        activo: usuarioMock.activo,
        createdAt: usuarioMock.createdAt,
        updatedAt: usuarioMock.updatedAt,
        deletedAt: usuarioMock.deletedAt,
      });
    });

    it('debe retornar null si no existe usuario con el correo electronico', async () => {
      usuarioRepository.findByCorreoElectronico.mockResolvedValue(null);

      const result = await usuariosService.findByCorreoElectronico(CORREO_ELECTRONICO);

      expect(usuarioRepository.findByCorreoElectronico).toHaveBeenCalledWith(CORREO_ELECTRONICO);
      expect(usuarioRepository.findByCorreoElectronico).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
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
        data: [
          {
            id: usuarioMock.id,
            rol: usuarioMock.rol,
            nombre: usuarioMock.nombre,
            correoElectronico: usuarioMock.correoElectronico,
            activo: usuarioMock.activo,
            createdAt: usuarioMock.createdAt,
            updatedAt: usuarioMock.updatedAt,
            deletedAt: usuarioMock.deletedAt,
          },
        ],
        meta: {
          page: 2,
          limit: 10,
          total: 25,
        },
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
        meta: {
          page: 1,
          limit: 100,
          total: 0,
        },
      });
    });
  });

  describe('update', () => {
    const updateDto: UpdateUsuarioDto = {
      nombre: NOMBRE,
      correoElectronico: CORREO_ELECTRONICO,
      contrasena: '654321',
    };

    it('debe actualizar un usuario', async () => {
      const hashedPassword = 'hashed-654321';
      hashService.hash.mockResolvedValue(hashedPassword);
      usuarioRepository.update.mockResolvedValue();

      const result = await usuariosService.update(ID_USUARIO, updateDto);

      expect(hashService.hash).toHaveBeenCalledWith(updateDto.contrasena!);
      expect(usuarioRepository.update).toHaveBeenCalledWith({
        id: ID_USUARIO,
        data: {
          ...updateDto,
          contrasena: hashedPassword,
        },
      });
      expect(result).toBeUndefined();
    });

    it('no debe actualizar la contraseña si no se envía', async () => {
      const dto: UpdateUsuarioDto = {
        nombre: NOMBRE,
        correoElectronico: CORREO_ELECTRONICO,
      };

      usuarioRepository.update.mockResolvedValue();

      await usuariosService.update(ID_USUARIO, dto);

      expect(hashService.hash).not.toHaveBeenCalled();

      expect(usuarioRepository.update).toHaveBeenCalledWith({
        id: ID_USUARIO,
        data: dto,
      });
    });

    it('debe propagar conflicto por claves unicas al actualizar un usuario', async () => {
      const error = new ConflictException('Correo electronico ya registrado');
      usuarioRepository.update.mockRejectedValue(error);

      await expect(usuariosService.update(ID_USUARIO, updateDto)).rejects.toThrow(ConflictException);
      expect(usuarioRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateRol', () => {
    it('debe actualizar el rol de un usuario', async () => {
      const dto = { rol: Rol.SUPERVISOR };
      usuarioRepository.updateRol.mockResolvedValue();

      const result = await usuariosService.updateRol(ID_USUARIO, dto);

      expect(usuarioRepository.updateRol).toHaveBeenCalledWith({
        id: ID_USUARIO,
        rol: dto.rol,
      });
      expect(result).toBeUndefined();
    });

    it('debe propagar error si el usuario no existe al actualizar rol', async () => {
      const dto = { rol: Rol.SUPERVISOR };
      const error = new Error('Usuario no encontrado');
      usuarioRepository.updateRol.mockRejectedValue(error);

      await expect(usuariosService.updateRol(ID_USUARIO, dto)).rejects.toThrow('Usuario no encontrado');
      expect(usuarioRepository.updateRol).toHaveBeenCalledTimes(1);
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
