import { TipoDocumento, TipoCliente } from "./cliente.type";

export type CreateCliente = {
  id: string;
  razonSocial: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  tipoCliente: TipoCliente;
  numeroTelefono: string;
  correoElectronico: string | null;
  direccion: string;
}
