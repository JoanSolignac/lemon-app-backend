export enum TipoDocumento {
  DNI = 'DNI',
  RUC = 'RUC',
}

export enum TipoCliente {
  MINORISTA = 'MINORISTA',
  MAYORISTA = 'MAYORISTA',
}

export type Cliente = {
  id: string
  razonSocial: string
  tipoDocumento: TipoDocumento
  numeroDocumento: string
  tipoCliente: TipoCliente
  numeroTelefono: string
  correoElectronico?: string | null
  direccion: string

  activo: boolean
  version: number

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}
