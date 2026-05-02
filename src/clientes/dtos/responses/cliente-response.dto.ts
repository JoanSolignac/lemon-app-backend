import { TipoDocumento, TipoCliente } from '../../types/cliente.type';

export class ClienteResponseDto {
  readonly id!: string;
  readonly razonSocial!: string;
  readonly tipoDocumento!: TipoDocumento;
  readonly numeroDocumento!: string;
  readonly tipoCliente!: TipoCliente;
  readonly numeroTelefono!: string;
  readonly correoElectronico!: string | null;
  readonly direccion!: string;
  readonly activo!: boolean;
  readonly version!: number;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
  readonly deletedAt!: Date | null;
}
