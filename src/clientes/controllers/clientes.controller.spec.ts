import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { SyncQueryDto } from 'src/common/dtos/requests/sync-query.dto';
import { CreateClienteDto } from '../dtos/requests/create-cliente.dto';
import { DeleteClienteDto } from '../dtos/requests/delete-cliente.dto';
import { UpdateClienteDto } from '../dtos/requests/update-cliente';
import { ClientesService } from '../services/clientes.service';
import { TipoDocumento, TipoCliente } from '../types/cliente.type';
import { ClientesController } from './clientes.controller';

describe('ClientesController', () => {
  let controller: ClientesController;

  const clientesService: jest.Mocked<ClientesService> = {
    create: jest.fn(),
    findById: jest.fn(),
    findByNumeroDocumento: jest.fn(),
    findAllForSync: jest.fn(),
    findAllPaginated: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<ClientesService>;

  const ID_CLIENTE = '2f5c7d3f-0a0b-4b9d-8e2a-7d7c9d7d4a11';

  const clienteMock = {
    id: ID_CLIENTE,
    razonSocial: 'LEMON SAC',
    tipoDocumento: TipoDocumento.RUC,
    numeroDocumento: '20123456781',
    tipoCliente: TipoCliente.MAYORISTA,
    numeroTelefono: '987654321',
    correoElectronico: 'contacto@lemon.pe',
    direccion: 'IQUITOS',
    activo: true,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [
        {
          provide: ClientesService,
          useValue: clientesService,
        },
      ],
    }).compile();

    controller = module.get<ClientesController>(ClientesController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un cliente', async () => {
      const dto: CreateClienteDto = {
        id: ID_CLIENTE,
        razonSocial: 'LEMON SAC',
        tipoDocumento: TipoDocumento.RUC,
        numeroDocumento: '20123456781',
        tipoCliente: TipoCliente.MAYORISTA,
        numeroTelefono: '987654321',
        correoElectronico: 'contacto@lemon.pe',
        direccion: 'IQUITOS',
      };
      clientesService.create.mockResolvedValue(clienteMock);

      const result = await controller.create(dto);

      expect(clientesService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(clienteMock);
    });
  });

  describe('findById', () => {
    it('debe retornar un cliente por id', async () => {
      clientesService.findById.mockResolvedValue(clienteMock);

      const result = await controller.findById(ID_CLIENTE);

      expect(clientesService.findById).toHaveBeenCalledWith(ID_CLIENTE);
      expect(result).toEqual(clienteMock);
    });
  });

  describe('findByNumeroDocumento', () => {
    it('debe retornar un cliente por numero de documento', async () => {
      clientesService.findByNumeroDocumento.mockResolvedValue(clienteMock);

      const result = await controller.findByNumeroDocumento('20123456781');

      expect(clientesService.findByNumeroDocumento).toHaveBeenCalledWith('20123456781');
      expect(result).toEqual(clienteMock);
    });
  });

  describe('findAllForSync', () => {
    it('debe retornar clientes para sincronización', async () => {
      const dto: SyncQueryDto = { lastSync: new Date() };
      clientesService.findAllForSync.mockResolvedValue([clienteMock]);

      const result = await controller.findAllForSync(dto);

      expect(clientesService.findAllForSync).toHaveBeenCalledWith(dto);
      expect(result).toEqual([clienteMock]);
    });
  });

  describe('findAllPaginated', () => {
    it('debe retornar clientes paginados', async () => {
      const dto: PaginatedQueryDto = { page: 1, limit: 10 };
      const paginatedResult = {
        data: [clienteMock],
        page: 1,
        limit: 10,
        total: 1,
      };
      clientesService.findAllPaginated.mockResolvedValue(paginatedResult);

      const result = await controller.findAllPaginated(dto);

      expect(clientesService.findAllPaginated).toHaveBeenCalledWith(dto);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('update', () => {
    it('debe actualizar un cliente', async () => {
      const dto: UpdateClienteDto = {
        razonSocial: 'LEMON SAC',
        version: 1,
      };
      clientesService.update.mockResolvedValue();

      const result = await controller.update(ID_CLIENTE, dto);

      expect(clientesService.update).toHaveBeenCalledWith(ID_CLIENTE, dto);
      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('debe eliminar un cliente', async () => {
      const dto: DeleteClienteDto = {
        version: 1,
      };
      clientesService.delete.mockResolvedValue();

      const result = await controller.delete(ID_CLIENTE, dto);

      expect(clientesService.delete).toHaveBeenCalledWith(ID_CLIENTE, dto);
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
      const invalidId = 'cli-001';

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