import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ICLIENTE_REPOSITORY } from '../repositories/clientes.repository';
import type { IClientesRepository } from '../repositories/clientes.repository';
import { Cliente } from '../types/cliente.type';
import { CreateClienteDto } from '../dtos/requests/create-cliente.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';
import { PaginatedQueryDto } from 'src/common/dtos/requests/paginated-query.dto';
import { calculateSkipTakeForPagination, normalizePaginationDto } from 'src/common/utils/pagination.util';
import { UpdateClienteDto } from '../dtos/requests/update-cliente';
import { DeleteClienteDto } from '../dtos/requests/delete-cliente.dto';

@Injectable()
export class ClientesService {
    constructor(
        @Inject(ICLIENTE_REPOSITORY)
        private readonly clienteRepository: IClientesRepository,
    ){}

    async create(dto: CreateClienteDto): Promise<Cliente>{
        const cliente: Cliente = {
            ...dto,
            activo: true,
            version: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null
        }

        return this.clienteRepository.create(cliente);
    }

    async findById(id: string): Promise<Cliente | null>{
        return this.clienteRepository.findById(id);
    }

    async findByNumeroDocumento(numeroDocumento: string): Promise<Cliente | null>{
        return this.clienteRepository.findByNumeroDocumento(numeroDocumento);
    }

    async findAllForSync(lastSync: Date): Promise<Cliente[]>{
        return this.clienteRepository.findAllForSync(lastSync)
    }

    async findAllPaginated(dto: PaginatedQueryDto): Promise<PaginatedResult<Cliente>>{
        const { page, limit } = normalizePaginationDto(dto);
        const { skip, take } = calculateSkipTakeForPagination({ page, limit });
        const { data, total } = await this.clienteRepository.findAllForPagination({ skip, take });
        return {
            data,
            page,
            limit,
            total
        };
    }

    async update(id: string, dto: UpdateClienteDto): Promise<void> {
        const updated = await this.clienteRepository.update(
            { id, data: dto },
        );

        if (!updated) {
            throw new ConflictException('Conflicto de Version o Cliente no encontrado.');
        }
    }

    async delete(id: string, dto: DeleteClienteDto): Promise<void>{
        const { version } = dto;
        const deleted = await this.clienteRepository.softDelete({ id, version })

        if (!deleted) {
            throw new ConflictException('Conflicto de Version o Cliente no encontrado.')
        }
    }
}
