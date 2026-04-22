import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service';
import { ICLIENTE_REPOSITORY } from '../constants/cliente.constants';

describe('ClientesService', () => {
  let service: ClientesService;

  const clienteRepositoryMock = {
    create: jest.fn(),
    findById: jest.fn(),
    findByNumeroDocumento: jest.fn(),
    findAllForSync: jest.fn(),
    findAllForPagination: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: ICLIENTE_REPOSITORY,
          useValue: clienteRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ClientesService>(ClientesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
