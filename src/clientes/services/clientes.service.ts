import { Inject, Injectable } from '@nestjs/common';
import type { IClientesRepository } from '../repositories/clientes.repository';
import { Cliente } from '../types/cliente.type';
import { CreateClienteDto } from '../dtos/requests/create-cliente.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { calculateSkipTakeForPagination, normalizePaginationDto } from 'src/common/utils/pagination.util';
import { UpdateClienteDto } from '../dtos/requests/update-cliente';
import { DeleteClienteDto } from '../dtos/requests/delete-cliente.dto';
import { ICLIENTE_REPOSITORY } from '../constants/cliente.constants';

@Injectable()
export class ClientesService {
  constructor(
    @Inject(ICLIENTE_REPOSITORY)
    private readonly clienteRepository: IClientesRepository,
  ) {}

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const now = new Date();
    const cliente: Cliente = {
      id: dto.id,
      razonSocial: dto.razonSocial,
      tipoDocumento: dto.tipoDocumento,
      numeroDocumento: dto.numeroDocumento,
      tipoCliente: dto.tipoCliente,
      numeroTelefono: dto.numeroTelefono,
      correoElectronico: dto.correoElectronico ?? null,
      direccion: dto.direccion,
      activo: true,
      version: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    return this.clienteRepository.create(cliente);
  }

  async findById(id: string): Promise<Cliente | null> {
    return this.clienteRepository.findById(id);
  }

  async findByNumeroDocumento(numeroDocumento: string): Promise<Cliente | null> {
    return this.clienteRepository.findByNumeroDocumento(numeroDocumento);
  }

  async findAllForSync(lastSync: Date): Promise<Cliente[]> {
    return this.clienteRepository.findAllForSync(lastSync);
  }

  async findAllPaginated(dto: PaginatedQueryDto): Promise<PaginatedResult<Cliente>> {
    const { page, limit } = normalizePaginationDto(dto);
    const { skip, take } = calculateSkipTakeForPagination({ page, limit });
    const { data, total } = await this.clienteRepository.findAllForPagination({ skip, take });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  async update(id: string, dto: UpdateClienteDto): Promise<void> {
    await this.clienteRepository.update({
      id,
      data: {
        razonSocial: dto.razonSocial,
        tipoDocumento: dto.tipoDocumento,
        numeroDocumento: dto.numeroDocumento,
        tipoCliente: dto.tipoCliente,
        numeroTelefono: dto.numeroTelefono,
        correoElectronico: dto.correoElectronico,
        direccion: dto.direccion,
        version: dto.version,
      },
    });
  }

  async delete(id: string, dto: DeleteClienteDto): Promise<void> {
    await this.clienteRepository.softDelete({
      id,
      version: dto.version,
    });
  }
}
