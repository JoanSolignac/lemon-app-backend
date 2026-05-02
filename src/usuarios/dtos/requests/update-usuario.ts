import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Rol } from 'src/common/types/user-role.enum';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsEnum(Rol)
  readonly rol?: Rol;

  @IsOptional()
  @IsString()
  @Length(3, 120)
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  readonly nombre?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
  readonly correoElectronico?: string;

  @IsOptional()
  @IsString()
  @Length(6, 255)
  readonly contrasena?: string;

  @IsOptional()
  @IsBoolean()
  readonly activo?: boolean;
}
