import { Usuario } from './usuario.type';

export type UsuarioUpdateParams = {
  id: string;
  data: Partial<Omit<Usuario, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>;
};
