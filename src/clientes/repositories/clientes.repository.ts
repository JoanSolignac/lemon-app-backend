import { PaginatedParams } from 'src/common/types/paginated-params.type';
import { ClienteUpdateParams } from '../types/cliente-update-params.type';
import { Cliente } from '../types/cliente.type'
import { SoftDeleteParams } from '../types/soft-delete-params.type';

export interface IClientesRepository {
  create(data: Cliente): Promise<Cliente>

  findById(id: string): Promise<Cliente | null>

  findByNumeroDocumento(numeroDocumento: string): Promise<Cliente | null>

  findAllForSync(lastSync: Date): Promise<Cliente[]>

  findAllForPagination(params: PaginatedParams): Promise<{ data: Cliente[]; total: number }>

  update(params: ClienteUpdateParams): Promise<void>

  softDelete(params: SoftDeleteParams): Promise<void>
}
