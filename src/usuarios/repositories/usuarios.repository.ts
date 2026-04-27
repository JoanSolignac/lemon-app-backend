import { PaginatedParams } from 'src/common/types/paginated-params.type';
import { UsuarioForAuth } from '../types/usuario-for-auth.type';
import { UsuarioUpdateParams } from '../types/usuario-update-params.type';
import { Usuario } from '../types/usuario.type';

export interface IUsuariosRepository {
  create(data: Omit<Usuario, 'id'>): Promise<Partial<Usuario>>

  findById(id: string): Promise<Partial<Usuario> | null>

  findByCorreoElectronico(correoElectronico: string): Promise<Partial<Usuario> | null>

  findForAuthByCorreoElectronico(correoElectronico: string): Promise<UsuarioForAuth | null>

  findAllForSync(lastSync: Date): Promise<Partial<Usuario>[]>

  findAllForPagination(params: PaginatedParams): Promise<{ data: Partial<Usuario>[]; total: number }>

  update(params: UsuarioUpdateParams): Promise<void>

  softDelete(id: string): Promise<void>
}
