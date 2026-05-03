import { TipoDocumento, TipoCliente } from '../../types/cliente.type';

export type ClienteResponseDto = {
  id: string;
  razonSocial: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  tipoCliente: TipoCliente;
  numeroTelefono: string;
  correoElectronico: string | null;
  direccion: string;
  activo: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
