import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';

enum TipoDocumento {
  DNI = 'DNI',
  RUC = 'RUC'
}

enum TipoCliente {
  MINORISTA = 'MINORISTA',
  MAYORISTA = 'MAYORISTA'
}

export class UpdateClienteDto {

  @IsOptional()
  @IsString()
  @Length(3, 150)
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  readonly razonSocial?: string;

  @IsOptional()
  @IsEnum(TipoDocumento)
  readonly tipoDocumento?: TipoDocumento;

  @IsOptional()
  @IsString()
  @Length(8, 11)
  readonly numeroDocumento?: string;

  @IsOptional()
  @IsEnum(TipoCliente)
  readonly tipoCliente?: TipoCliente;

  @IsOptional()
  @IsString()
  @Length(6, 9)
  readonly numeroTelefono?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
  readonly correoElectronico?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  readonly direccion?: string;

  @IsInt()
  readonly version!: number;
}
