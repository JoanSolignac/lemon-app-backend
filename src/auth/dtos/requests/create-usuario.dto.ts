import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

enum Rol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  SUPERVISOR = 'SUPERVISOR',
}

export class CreateUsuarioDto {
  @IsString()
  readonly id!: string;

  @IsEnum(Rol)
  readonly rol!: Rol;

  @IsString()
  @Length(3, 120)
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  readonly nombre!: string;

  @IsString()
  @IsEmail()
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
  readonly correoElectronico!: string;

  @IsString()
  @Length(6, 255)
  readonly contrasena!: string;
}
