import { PaginatedParams } from 'src/common/types/paginated-params.type';
import { UsuarioUpdateParams } from '../types/usuario-update-params.type';
import { Usuario } from '../types/usuario.type';

export interface IUsuariosRepository {
  create(data: Usuario): Promise<Usuario>

  findById(id: string): Promise<Usuario | null>

  findByCorreoElectronico(correoElectronico: string): Promise<Usuario | null>

  findAllForSync(lastSync: Date): Promise<Usuario[]>

  findAllForPagination(params: PaginatedParams): Promise<{ data: Usuario[]; total: number }>

  update(params: UsuarioUpdateParams): Promise<void>

  softDelete(id: string): Promise<void>
}
