import { TipoDocumento, TipoCliente } from "./cliente.type";

export type UpdateCliente = {
  razonSocial?: string;
  tipoDocumento?: TipoDocumento;
  numeroDocumento?: string;
  tipoCliente?: TipoCliente;
  numeroTelefono?: string;
  correoElectronico?: string;
  direccion?: string;
  version: number;
}
