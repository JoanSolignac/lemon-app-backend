import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { TipoDocumento, TipoCliente } from 'src/clientes/types/cliente.type';

export class CreateClienteDto {
  @IsString()
  declare readonly id: string;

  @IsString()
  @Length(3, 150)
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  declare readonly razonSocial: string;

  @IsEnum(TipoDocumento)
  declare readonly tipoDocumento: TipoDocumento;

  @IsString()
  @Length(8, 11)
  declare readonly numeroDocumento: string;

  @IsEnum(TipoCliente)
  declare readonly tipoCliente: TipoCliente;

  @IsString()
  @Length(6, 9)
  declare readonly numeroTelefono: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
  declare readonly correoElectronico?: string;

  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  declare readonly direccion: string;
}
