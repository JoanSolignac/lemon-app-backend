import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Rol } from "src/usuarios/types/usuario.type";
import { ROLES_KEY } from "../decorators/rol.decorator";

@Injectable()
export class RolGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const REQUIRED_ROLES = this.reflector.getAllAndOverride<Rol[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ]
        );

        if (!REQUIRED_ROLES?.length) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return REQUIRED_ROLES.includes(user.rol);
    } 
}
