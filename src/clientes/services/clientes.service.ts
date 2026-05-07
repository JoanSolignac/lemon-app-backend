import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { PaginatedResultDto } from 'src/common/dtos/responses/paginated-result.dto';
import { SyncQueryDto } from 'src/common/dtos/requests/sync-query.dto';
import {
  calculateSkipTakeForPagination,
  normalizePaginationDto,
} from 'src/common/utils/pagination.util';
import { ICLIENTE_REPOSITORY } from '../constants/cliente.constants';
import { CreateClienteDto } from '../dtos/requests/create-cliente.dto';
import { DeleteClienteDto } from '../dtos/requests/delete-cliente.dto';
import { UpdateClienteDto } from '../dtos/requests/update-cliente.dto';
import { ClienteResponseDto } from '../dtos/responses/cliente-response.dto';
import type { IClientesRepository } from '../repositories/clientes.repository';
import { Cliente } from '../types/cliente.type';
import { CreateCliente } from '../types/create-cliente.type';

@Injectable()
export class ClientesService {
  private readonly logger = new Logger(ClientesService.name);

  constructor(
    @Inject(ICLIENTE_REPOSITORY)
    private readonly clienteRepository: IClientesRepository,
  ) {}

  async create(dto: CreateClienteDto): Promise<ClienteResponseDto> {
    const cliente: CreateCliente = {
      id: dto.id,
      razonSocial: dto.razonSocial,
      tipoDocumento: dto.tipoDocumento,
      numeroDocumento: dto.numeroDocumento,
      tipoCliente: dto.tipoCliente,
      numeroTelefono: dto.numeroTelefono,
      correoElectronico: dto.correoElectronico ?? null,
      direccion: dto.direccion,
    };

    const createdCliente = await this.clienteRepository.create(cliente);
    this.logger.log(
      `Cliente creado: id=${createdCliente.id}, razonSocial=${createdCliente.razonSocial}, tipoCliente=${createdCliente.tipoCliente}`,
    );

    return this.toResponse(createdCliente);
  }

  async findById(id: string): Promise<ClienteResponseDto | null> {
    const cliente = await this.clienteRepository.findById(id);

    if (cliente) {
      this.logger.log(`Cliente encontrado: id=${cliente.id}, razonSocial=${cliente.razonSocial}`);
    } else {
      this.logger.log(`Cliente no encontrado: id=${id}`);
    }

    return cliente ? this.toResponse(cliente) : null;
  }

  async findByNumeroDocumento(
    numeroDocumento: string,
  ): Promise<ClienteResponseDto | null> {
    const cliente =
      await this.clienteRepository.findByNumeroDocumento(numeroDocumento);

    if (cliente) {
      this.logger.log(`Cliente encontrado por documento: id=${cliente.id}, razonSocial=${cliente.razonSocial}`);
    } else {
      this.logger.log(`Cliente no encontrado por documento`);
    }

    return cliente ? this.toResponse(cliente) : null;
  }

  async findAllForSync(dto: SyncQueryDto): Promise<ClienteResponseDto[]> {
    const clientes = await this.clienteRepository.findAllForSync(dto);
    this.logger.log(
      `Clientes sincronizados: ${clientes.length} registros desde ${dto.lastSync.toISOString()}`,
    );

    return clientes.map((c) => this.toResponse(c));
  }

  async findAllPaginated(
    dto: PaginatedQueryDto,
  ): Promise<PaginatedResultDto<ClienteResponseDto>> {
    const { page, limit } = normalizePaginationDto(dto);
    const { skip, take } = calculateSkipTakeForPagination({ page, limit });
    const { data, total } = await this.clienteRepository.findAllForPagination({
      skip,
      take,
    });

    this.logger.log(
      `Clientes listados: total=${total}, page=${page}, limit=${limit}, resultados=${data.length}`,
    );

    return {
      data: data.map((c) => this.toResponse(c)),
      meta: {
        page,
        limit,
        total,
      },
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
    this.logger.log(`Cliente actualizado: id=${id}`);
  }

  async delete(id: string, dto: DeleteClienteDto): Promise<void> {
    await this.clienteRepository.softDelete({
      id,
      version: dto.version,
    });
    this.logger.log(`Cliente eliminado: id=${id}`);
  }

  private toResponse(cliente: Cliente): ClienteResponseDto {
    return new ClienteResponseDto(cliente);
  }
}
