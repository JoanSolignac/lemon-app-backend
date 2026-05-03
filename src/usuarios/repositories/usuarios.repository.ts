import { PaginatedParams } from 'src/common/types/paginated-params.type';
import { UsuarioForAuth } from '../types/usuario-for-auth.type';
import { UsuarioUpdateParams } from '../types/usuario-update-params.type';
import { Usuario } from '../types/usuario.type';
import { SyncQueryParams } from '../types/sync-query-params.type';
import { CreateUsuario } from '../types/create-usuario.type';

export interface IUsuariosRepository {
  create(data: CreateUsuario): Promise<Usuario>

  findById(id: string): Promise<Usuario | null>

  findByCorreoElectronico(correoElectronico: string): Promise<Usuario | null>

  findForAuthByCorreoElectronico(correoElectronico: string): Promise<UsuarioForAuth | null>

  findAllForPagination(params: PaginatedParams): Promise<{ data: Usuario[]; total: number }>

  update(params: UsuarioUpdateParams): Promise<void>

  softDelete(id: string): Promise<void>
}
