export type Cliente = {
  id: string
  razonSocial: string
  tipoDocumento: 'DNI' | 'RUC'
  numeroDocumento: string
  tipoCliente: 'MINORISTA' | 'MAYORISTA'
  numeroTelefono: string
  correoElectronico?: string | null
  direccion: string

  activo: boolean
  version: number

  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}