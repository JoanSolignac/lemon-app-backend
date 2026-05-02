import { SetMetadata } from "@nestjs/common";
import { Rol } from "../types/user-role.enum";

export const ROLES_KEY = 'roles'

export const UseRoles = (...roles: Rol[]) => SetMetadata(
    ROLES_KEY,
    roles
);
