import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @Length(3, 120)
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  declare readonly nombre?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
  declare readonly correoElectronico?: string;

  @IsOptional()
  @IsString()
  @Length(6, 255)
  declare readonly contrasena?: string;
}
