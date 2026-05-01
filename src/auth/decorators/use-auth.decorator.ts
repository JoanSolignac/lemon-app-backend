import { applyDecorators, UseGuards } from "@nestjs/common";
import { Rol } from "src/usuarios/types/usuario.type";
import { JwtAccessGuard } from "../guards/jwt-access.guard";
import { UseRoles } from "./rol.decorator";
import { RolGuard } from "../guards/rol.guard";

export const UseAuth = (...roles: Rol[]) =>
    applyDecorators(
        UseGuards(JwtAccessGuard, RolGuard),
        ...(roles.length > 0 ? [UseRoles(...roles)] : []),
    );
