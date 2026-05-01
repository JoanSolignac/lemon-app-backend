import { Rol } from "src/usuarios/types/usuario.type";

export interface UserPayload {
    sub: string,
    email: string,
    rol: Rol
}
