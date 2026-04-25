import { PaginatedParams } from 'src/common/types/paginated-params.type';
import { Usuario } from '../types/usuario.type';

export type UsuarioUpdateParams = {
  id: string
  data: Pick<Usuario, 'rol' | 'nombre' | 'correoElectronico' | 'contrasena' | 'activo'>
}

export interface IUsuarioRepository {
  create(data: Usuario): Promise<Usuario>

  findById(id: string): Promise<Usuario | null>

  findByCorreoElectronico(correoElectronico: string): Promise<Usuario | null>

  findAllForSync(lastSync: Date): Promise<Usuario[]>

  findAllForPagination(params: PaginatedParams): Promise<{ data: Usuario[]; total: number }>

  update(params: UsuarioUpdateParams): Promise<void>

  softDelete(id: string): Promise<void>
}
