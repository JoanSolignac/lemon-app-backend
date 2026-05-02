import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { TipoDocumento, TipoCliente } from 'src/clientes/types/cliente.type';

export class CreateClienteDto {
  @IsString()
  readonly id!: string;

  @IsString()
  @Length(3, 150)
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  readonly razonSocial!: string;

  @IsEnum(TipoDocumento)
  readonly tipoDocumento!: TipoDocumento;

  @IsString()
  @Length(8, 11)
  readonly numeroDocumento!: string;

  @IsEnum(TipoCliente)
  readonly tipoCliente!: TipoCliente;

  @IsString()
  @Length(6, 9)
  readonly numeroTelefono!: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
  readonly correoElectronico?: string;

  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  readonly direccion!: string;
}
