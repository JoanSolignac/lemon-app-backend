import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { CreateDispositivoDto } from '../dtos/requests/create-dispositivo.dto';
import { UserPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Rol } from 'src/common/types/user-role.enum';
import { DispositivosService } from '../services/dispositivos.service';
import { DispositivosController } from './dispositivos.controller';

describe('DispositivosController', () => {
  let controller: DispositivosController;

  const dispositivosService: jest.Mocked<DispositivosService> = {
    create: jest.fn(),
    findById: jest.fn(),
    findAllForPagination: jest.fn(),
    update: jest.fn(),
    updateLastSync: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<DispositivosService>;

  const DEVICE_ID = '2f5c7d3f-0a0b-4b9d-8e2a-7d7c9d7d4a11';
  const USER_ID = '3a6e8d4f-1b2c-5c9e-9f3b-8e8d9e8e5b22';

  const dispositivoMock = {
    deviceId: DEVICE_ID,
    userId: USER_ID,
    activo: true,
    lastSyncAt: null,
    metadata: {
      name: 'Device 1',
      platform: 'Android',
      version: 1,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DispositivosController],
      providers: [
        {
          provide: DispositivosService,
          useValue: dispositivosService,
        },
      ],
    }).compile();

    controller = module.get<DispositivosController>(DispositivosController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un dispositivo', async () => {
      const dto: CreateDispositivoDto = {
        deviceId: DEVICE_ID,
        metadata: {
          name: 'Device 1',
          platform: 'Android',
          version: 1,
        },
      };
      const user: UserPayload = {
        sub: USER_ID,
        email: 'test@test.com',
        rol: Rol.ADMINISTRADOR,
      };
      dispositivosService.create.mockResolvedValue(dispositivoMock);

      const result = await controller.create(dto, user);

      expect(dispositivosService.create).toHaveBeenCalledWith(USER_ID, dto);
      expect(result).toEqual(dispositivoMock);
    });
  });

  describe('findAllForPagination', () => {
    it('debe retornar dispositivos paginados', async () => {
      const dto: PaginatedQueryDto = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [dispositivoMock],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
        },
      };
      dispositivosService.findAllForPagination.mockResolvedValue(paginatedResult);

      const result = await controller.findAllForPagination(dto);

      expect(dispositivosService.findAllForPagination).toHaveBeenCalledWith(dto);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findById', () => {
    it('debe retornar un dispositivo por id', async () => {
      dispositivosService.findById.mockResolvedValue(dispositivoMock);

      const result = await controller.findById(DEVICE_ID);

      expect(dispositivosService.findById).toHaveBeenCalledWith(DEVICE_ID);
      expect(result).toEqual(dispositivoMock);
    });
  });

  describe('update', () => {
    it('debe actualizar un dispositivo', async () => {
      const user: UserPayload = {
        sub: USER_ID,
        email: 'test@test.com',
        rol: Rol.ADMINISTRADOR,
      };
      dispositivosService.update.mockResolvedValue();

      const result = await controller.update(DEVICE_ID, user);

      expect(dispositivosService.update).toHaveBeenCalledWith(DEVICE_ID, USER_ID);
      expect(result).toBeUndefined();
    });
  });

  describe('updateLastSync', () => {
    it('debe actualizar la última sincronización del dispositivo', async () => {
      dispositivosService.updateLastSync.mockResolvedValue();

      const result = await controller.updateLastSync(DEVICE_ID);

      expect(dispositivosService.updateLastSync).toHaveBeenCalledWith(DEVICE_ID);
      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('debe eliminar un dispositivo', async () => {
      dispositivosService.delete.mockResolvedValue();

      const result = await controller.delete(DEVICE_ID);

      expect(dispositivosService.delete).toHaveBeenCalledWith(DEVICE_ID);
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
      const invalidId = 'disp-001';

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
