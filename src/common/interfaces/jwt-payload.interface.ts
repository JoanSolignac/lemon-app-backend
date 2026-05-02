import { Rol } from "../types/user-role.enum";


export interface UserPayload {
    sub: string,
    email: string,
    rol: Rol
}
