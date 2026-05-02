import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { IDISPOSITIVO_REPOSITORY } from '../constants/dispositivos.constants';
import { CreateDispositivoDto } from '../dtos/requests/create-dispositivo.dto';
import { IDispositivoRepository } from '../repositories/dispositivo.repository';
import { DispositivosService } from './dispositivos.service';

describe('DispositivosService', () => {
  let dispositivosService: DispositivosService;

  const dispositivoRepository: jest.Mocked<IDispositivoRepository> = {
    create: jest.fn(),
    findById: jest.fn(),
    findAllForPagination: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const DEVICE_ID = '2f5c7d3f-0a0b-4b9d-8e2a-7d7c9d7d4a11';
  const USER_ID = '3a6e8d4f-1b2c-5c9e-9f3b-8e8d9e8e5b22';

  const createDto: CreateDispositivoDto = {
    deviceId: DEVICE_ID,
    metadata: {
      name: 'Device 1',
      platform: 'Android',
      version: 1,
    },
  };

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
      providers: [
        DispositivosService,
        {
          provide: IDISPOSITIVO_REPOSITORY,
          useValue: dispositivoRepository,
        },
      ],
    }).compile();

    dispositivosService = module.get<DispositivosService>(DispositivosService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear un nuevo dispositivo', async () => {
      dispositivoRepository.create.mockResolvedValue(dispositivoMock);

      const result = await dispositivosService.create(USER_ID, createDto);

      expect(dispositivoRepository.create).toHaveBeenCalledTimes(1);
      expect(dispositivoRepository.create).toHaveBeenCalledWith({
        deviceId: createDto.deviceId,
        userId: USER_ID,
        metadata: createDto.metadata,
      });
      expect(result).toEqual({
        deviceId: dispositivoMock.deviceId,
        userId: dispositivoMock.userId,
        activo: dispositivoMock.activo,
        lastSyncAt: dispositivoMock.lastSyncAt,
        metadata: dispositivoMock.metadata,
        createdAt: dispositivoMock.createdAt,
        updatedAt: dispositivoMock.updatedAt,
        deletedAt: dispositivoMock.deletedAt,
      });
    });

    it('debe propagar error al crear un dispositivo', async () => {
      const error = new Error('Error al crear dispositivo');
      dispositivoRepository.create.mockRejectedValue(error);

      await expect(dispositivosService.create(USER_ID, createDto)).rejects.toThrow('Error al crear dispositivo');
      expect(dispositivoRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('debe retornar un dispositivo si existe', async () => {
      dispositivoRepository.findById.mockResolvedValue(dispositivoMock);

      const result = await dispositivosService.findById(DEVICE_ID);

      expect(dispositivoRepository.findById).toHaveBeenCalledWith(DEVICE_ID);
      expect(dispositivoRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        deviceId: dispositivoMock.deviceId,
        userId: dispositivoMock.userId,
        activo: dispositivoMock.activo,
        lastSyncAt: dispositivoMock.lastSyncAt,
        metadata: dispositivoMock.metadata,
        createdAt: dispositivoMock.createdAt,
        updatedAt: dispositivoMock.updatedAt,
        deletedAt: dispositivoMock.deletedAt,
      });
    });

    it('debe lanzar NotFoundException si el dispositivo no existe', async () => {
      dispositivoRepository.findById.mockResolvedValue(null);

      await expect(dispositivosService.findById(DEVICE_ID)).rejects.toThrow(NotFoundException);
      expect(dispositivoRepository.findById).toHaveBeenCalledWith(DEVICE_ID);
      expect(dispositivoRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllForPagination', () => {
    it('debe retornar dispositivos paginados', async () => {
      const dto: PaginatedQueryDto = { page: 2, limit: 10 };
      dispositivoRepository.findAllForPagination.mockResolvedValue({
        data: [dispositivoMock],
        total: 25,
      });

      const result = await dispositivosService.findAllForPagination(dto);

      expect(dispositivoRepository.findAllForPagination).toHaveBeenCalledWith({ skip: 10, take: 10 });
      expect(dispositivoRepository.findAllForPagination).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: [
          {
            deviceId: dispositivoMock.deviceId,
            userId: dispositivoMock.userId,
            activo: dispositivoMock.activo,
            lastSyncAt: dispositivoMock.lastSyncAt,
            metadata: dispositivoMock.metadata,
            createdAt: dispositivoMock.createdAt,
            updatedAt: dispositivoMock.updatedAt,
            deletedAt: dispositivoMock.deletedAt,
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
      dispositivoRepository.findAllForPagination.mockResolvedValue({ data: [], total: 0 });

      const result = await dispositivosService.findAllForPagination(dto);

      expect(dispositivoRepository.findAllForPagination).toHaveBeenCalledWith({ skip: 0, take: 100 });
      expect(dispositivoRepository.findAllForPagination).toHaveBeenCalledTimes(1);
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
    it('debe actualizar un dispositivo', async () => {
      dispositivoRepository.update.mockResolvedValue();

      const result = await dispositivosService.update(DEVICE_ID, USER_ID);

      expect(dispositivoRepository.update).toHaveBeenCalledWith({
        deviceId: DEVICE_ID,
        data: {
          userId: USER_ID,
        },
      });
      expect(result).toBeUndefined();
    });

    it('debe propagar error al actualizar un dispositivo', async () => {
      const error = new Error('Error al actualizar dispositivo');
      dispositivoRepository.update.mockRejectedValue(error);

      await expect(dispositivosService.update(DEVICE_ID, USER_ID)).rejects.toThrow('Error al actualizar dispositivo');
      expect(dispositivoRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateLastSync', () => {
    it('debe actualizar el lastSyncAt del dispositivo', async () => {
      dispositivoRepository.update.mockResolvedValue();

      const result = await dispositivosService.updateLastSync(DEVICE_ID);

      expect(dispositivoRepository.update).toHaveBeenCalledWith({
        deviceId: DEVICE_ID,
        data: {
          lastSyncAt: expect.any(Date),
        },
      });
      expect(result).toBeUndefined();
    });

    it('debe propagar error al actualizar lastSyncAt', async () => {
      const error = new Error('Error al actualizar sincronización');
      dispositivoRepository.update.mockRejectedValue(error);

      await expect(dispositivosService.updateLastSync(DEVICE_ID)).rejects.toThrow('Error al actualizar sincronización');
      expect(dispositivoRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('debe eliminar un dispositivo', async () => {
      dispositivoRepository.softDelete.mockResolvedValue();

      const result = await dispositivosService.delete(DEVICE_ID);

      expect(dispositivoRepository.softDelete).toHaveBeenCalledWith(DEVICE_ID);
      expect(result).toBeUndefined();
    });

    it('debe propagar error al eliminar un dispositivo', async () => {
      const error = new Error('Error al eliminar dispositivo');
      dispositivoRepository.softDelete.mockRejectedValue(error);

      await expect(dispositivosService.delete(DEVICE_ID)).rejects.toThrow('Error al eliminar dispositivo');
      expect(dispositivoRepository.softDelete).toHaveBeenCalledTimes(1);
    });
  });
});
