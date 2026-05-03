import { Rol } from "../types/user-role.enum";

export interface AuthenticatedUser {
    id: string,
    correoElectronico: string,
    rol: Rol
}