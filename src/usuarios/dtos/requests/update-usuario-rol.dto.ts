import { IsEnum } from 'class-validator';
import { Rol } from 'src/common/types/user-role.enum';

export class UpdateUsuarioRolDto {
  @IsEnum(Rol)
  declare readonly rol: Rol;
}