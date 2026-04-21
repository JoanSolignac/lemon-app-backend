import { Transform } from 'class-transformer'
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator'

enum TipoDocumento {
  DNI = 'DNI',
  RUC = 'RUC'
}

enum TipoCliente {
  MINORISTA = 'MINORISTA',
  MAYORISTA = 'MAYORISTA'
}

export class CreateClienteDto {
  @IsString()
  readonly id!: string

  @IsString()
  @Length(3, 150)
  @Transform(({ value }) => typeof(value) === "string" ? value.toUpperCase() : value)
  readonly razonSocial!: string

  @IsEnum(TipoDocumento)
  readonly tipoDocumento!: TipoDocumento

  @IsString()
  @Length(8, 11)
  readonly numeroDocumento!: string

  @IsEnum(TipoCliente)
  readonly tipoCliente!: TipoCliente

  @IsString()
  @Length(6, 9)
  readonly numeroTelefono!: string

  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => typeof(value) === "string" ? value.toLocaleLowerCase() : value)
  readonly correoElectronico?: string

  @IsString()
  @Transform(({ value }) => typeof(value) === "string" ? value.toUpperCase() : value)
  readonly direccion!: string
}