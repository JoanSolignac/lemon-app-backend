import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { Rol } from 'src/usuarios/types/usuario.type';

export class CreateUsuarioDto {
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
