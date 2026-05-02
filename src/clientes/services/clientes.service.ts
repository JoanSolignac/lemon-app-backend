import { Inject, Injectable } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { SyncQueryDto } from 'src/common/dtos/requests/sync-query.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';
import { calculateSkipTakeForPagination, normalizePaginationDto } from 'src/common/utils/pagination.util';
import { ICLIENTE_REPOSITORY } from '../constants/cliente.constants';
import { CreateClienteDto } from '../dtos/requests/create-cliente.dto';
import { DeleteClienteDto } from '../dtos/requests/delete-cliente.dto';
import { UpdateClienteDto } from '../dtos/requests/update-cliente';
import { ClienteResponseDto } from '../dtos/responses/cliente-response.dto';
import type { IClientesRepository } from '../repositories/clientes.repository';
import { Cliente } from '../types/cliente.type';

@Injectable()
export class ClientesService {
  constructor(
    @Inject(ICLIENTE_REPOSITORY)
    private readonly clienteRepository: IClientesRepository,
  ) {}

  async create(dto: CreateClienteDto): Promise<ClienteResponseDto> {
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

    const createdCliente = await this.clienteRepository.create(cliente);

    return this.toResponse(createdCliente);
  }

  async findById(id: string): Promise<ClienteResponseDto | null> {
    const cliente = await this.clienteRepository.findById(id);

    return cliente ? this.toResponse(cliente) : null;
  }

  async findByNumeroDocumento(numeroDocumento: string): Promise<ClienteResponseDto | null> {
    const cliente = await this.clienteRepository.findByNumeroDocumento(numeroDocumento);

    return cliente ? this.toResponse(cliente) : null;
  }

  async findAllForSync(dto: SyncQueryDto): Promise<ClienteResponseDto[]> {
    const clientes = await this.clienteRepository.findAllForSync(dto);

    return clientes.map((c) => this.toResponse(c));
  }

  async findAllPaginated(dto: PaginatedQueryDto): Promise<PaginatedResult<ClienteResponseDto>> {
    const { page, limit } = normalizePaginationDto(dto);
    const { skip, take } = calculateSkipTakeForPagination({ page, limit });
    const { data, total } = await this.clienteRepository.findAllForPagination({ skip, take });

    return {
      data: data.map((c) => this.toResponse(c)),
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

  private toResponse(cliente: Cliente): ClienteResponseDto {
    return {
      id: cliente.id,
      razonSocial: cliente.razonSocial,
      tipoDocumento: cliente.tipoDocumento,
      numeroDocumento: cliente.numeroDocumento,
      tipoCliente: cliente.tipoCliente,
      numeroTelefono: cliente.numeroTelefono,
      correoElectronico: cliente.correoElectronico ?? null,
      direccion: cliente.direccion,
      activo: cliente.activo,
      version: cliente.version,
      createdAt: cliente.createdAt,
      updatedAt: cliente.updatedAt,
      deletedAt: cliente.deletedAt ?? null,
    };
  }
}
