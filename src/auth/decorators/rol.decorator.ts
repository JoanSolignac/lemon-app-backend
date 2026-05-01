import { SetMetadata } from "@nestjs/common";
import { Rol } from "src/usuarios/types/usuario.type";

export const ROLES_KEY = 'roles'

export const UseRoles = (...roles: Rol[]) => SetMetadata(
    ROLES_KEY,
    roles
);
