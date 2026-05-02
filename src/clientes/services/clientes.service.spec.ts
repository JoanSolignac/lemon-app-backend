import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service';
import { ICLIENTE_REPOSITORY } from '../constants/cliente.constants';
import { CreateClienteDto } from '../dtos/requests/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/requests/update-cliente';
import { DeleteClienteDto } from '../dtos/requests/delete-cliente.dto';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { ConflictException } from '@nestjs/common';
import { IClientesRepository } from '../repositories/clientes.repository';

describe('ClientesService', () => {
  let clienteService: ClientesService;

  const clienteRepository: jest.Mocked<IClientesRepository> = {
    create: jest.fn(),
    findById: jest.fn(),
    findByNumeroDocumento: jest.fn(),
    findAllForSync: jest.fn(),
    findAllForPagination: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  enum TipoDocumento {
    DNI = 'DNI',
    RUC = 'RUC'
  }
  enum TipoCliente {
    MINORISTA = 'MINORISTA',
    MAYORISTA = 'MAYORISTA'
  }

  const ID_CLIENTE = 'cli-001';
  const NUMERO_DOCUMENTO = '20123456781';
  const RAZON_SOCIAL = 'LEMON SAC';

  const createDto: CreateClienteDto = {
    id: ID_CLIENTE,
    razonSocial: RAZON_SOCIAL,
    tipoDocumento: TipoDocumento.RUC,
    numeroDocumento: NUMERO_DOCUMENTO,
    tipoCliente: TipoCliente.MAYORISTA,
    numeroTelefono: '987654321',
    correoElectronico: 'contacto@lemon.com',
    direccion: 'IQUITOS',
  };

  const clienteMock = {
    ...createDto,
    activo: true,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: ICLIENTE_REPOSITORY,
          useValue: clienteRepository,
        },
      ],
    }).compile();

    clienteService = module.get<ClientesService>(ClientesService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear un nuevo cliente', async () => {

      clienteRepository.create.mockResolvedValue(clienteMock);

      const result = await clienteService.create(createDto);

      expect(clienteRepository.create).toHaveBeenCalledTimes(1);
      expect(clienteRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createDto,
          activo: true,
          version: 1,
          deletedAt: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
      expect(result).toEqual(clienteMock);
    });

    it('debe propagar conflicto por claves unicas al crear un cliente', async () => {
      const error = new ConflictException('Número de documento ya registrado');
      clienteRepository.create.mockRejectedValue(error);
      await expect(clienteService.create(createDto)).rejects.toThrow(ConflictException);
      expect(clienteRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('debe retornar un cliente si existe', async () => {
      
      clienteRepository.findById.mockResolvedValue(clienteMock);

      const result = await clienteService.findById(ID_CLIENTE);

      expect(clienteRepository.findById).toHaveBeenCalledWith(ID_CLIENTE);
      expect(clienteRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(clienteMock);
    });

    it('debe retornar null si el cliente no existe', async () => {
      
      clienteRepository.findById.mockResolvedValue(null);

      const result = await clienteService.findById(ID_CLIENTE);

      expect(clienteRepository.findById).toHaveBeenCalledWith(ID_CLIENTE);
      expect(clienteRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('findByNumeroDocumento', () => {
    it('debe retornar un cliente por numero de documento', async () => {
      clienteRepository.findByNumeroDocumento.mockResolvedValue(clienteMock);

      const result = await clienteService.findByNumeroDocumento(NUMERO_DOCUMENTO);

      expect(clienteRepository.findByNumeroDocumento).toHaveBeenCalledWith(NUMERO_DOCUMENTO);
      expect(clienteRepository.findByNumeroDocumento).toHaveBeenCalledTimes(1);
      expect(result).toEqual(clienteMock);
    });

    it('debe retornar null si no existe cliente con el numero de documento', async () => {
      clienteRepository.findByNumeroDocumento.mockResolvedValue(null);

      const result = await clienteService.findByNumeroDocumento(NUMERO_DOCUMENTO);

      expect(clienteRepository.findByNumeroDocumento).toHaveBeenCalledWith(NUMERO_DOCUMENTO);
      expect(clienteRepository.findByNumeroDocumento).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('findAllForSync', () => {
    it('debe delegar la búsqueda de cambios desde la última sincronización', async () => {
      const lastSync = new Date();
      clienteRepository.findAllForSync.mockResolvedValue([clienteMock]);

      const result = await clienteService.findAllForSync(lastSync);
      expect(clienteRepository.findAllForSync).toHaveBeenCalledWith(lastSync);
      expect(clienteRepository.findAllForSync).toHaveBeenCalledTimes(1);
      expect(result).toEqual([clienteMock]);
    });
  });

  describe('findAllPaginated', () => {
    it('debe retornar clientes paginados', async () => {
      const dto: PaginatedQueryDto = { page: 2, limit: 10 };
      clienteRepository.findAllForPagination.mockResolvedValue({ data: [clienteMock], total: 25 });
      const result = await clienteService.findAllPaginated(dto);
      expect(clienteRepository.findAllForPagination).toHaveBeenCalledWith({ skip: 10, take: 10 });
      expect(clienteRepository.findAllForPagination).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: [clienteMock],
        page: 2,
        limit: 10,
        total: 25,
      });
    });

    it('debe normalizar parámetros de paginación', async () => {
      const dto: PaginatedQueryDto = { page: 0, limit: 500 };
      clienteRepository.findAllForPagination.mockResolvedValue({ data: [], total: 0 });
      const result = await clienteService.findAllPaginated(dto);
      expect(clienteRepository.findAllForPagination).toHaveBeenCalledWith({ skip: 0, take: 100 });
      expect(clienteRepository.findAllForPagination).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: [],
        page: 1,
        limit: 100,
        total: 0,
      });
    });
  });

  describe('update', () => {
    const updateDto: UpdateClienteDto = {
      razonSocial: RAZON_SOCIAL,
      tipoDocumento: TipoDocumento.RUC,
      version: 1,
    };

    it('debe actualizar un cliente', async () => {
      clienteRepository.update.mockResolvedValue();

      const result = await clienteService.update(ID_CLIENTE, updateDto);

      expect(clienteRepository.update).toHaveBeenCalledWith({
        id: ID_CLIENTE,
        data: updateDto
      });
      expect(result).toBeUndefined();
    });

    it('debe propagar conflicto por claves unicas al actualizar un cliente', async () => {
      const error = new ConflictException('Número de documento ya registrado');
      clienteRepository.update.mockRejectedValue(error);
      await expect(clienteService.update(ID_CLIENTE, updateDto)).rejects.toThrow(ConflictException);
      expect(clienteRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    const deleteDto: DeleteClienteDto = {
      version: 1,
    };
    it('debe eliminar un cliente', async () => {
      clienteRepository.softDelete.mockResolvedValue();
      const result = await clienteService.delete(ID_CLIENTE, deleteDto);
      expect(clienteRepository.softDelete).toHaveBeenCalledWith({
        id: ID_CLIENTE,
        version: deleteDto.version,
      });
      expect(result).toBeUndefined();
    });

    it('debe propagar error al eliminar un cliente', async () => {
      const error = new Error('Error al eliminar cliente');
      clienteRepository.softDelete.mockRejectedValue(error);
      await expect(clienteService.delete(ID_CLIENTE, deleteDto)).rejects.toThrow('Error al eliminar cliente');
      expect(clienteRepository.softDelete).toHaveBeenCalledTimes(1);
    });
  });
});
