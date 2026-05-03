import { Rol } from "../../common/types/user-role.enum";


export interface UserPayload {
    sub: string,
    email: string,
    rol: Rol
}
