import { applyDecorators, UseGuards } from "@nestjs/common";
import { UseRoles } from "./rol.decorator";
import { JwtAccessGuard } from "../guards/jwt-access.guard";
import { RolGuard } from "../guards/rol.guard";
import { Rol } from "../types/user-role.enum";

export const UseAuth = (...roles: Rol[]) =>
    applyDecorators(
        UseGuards(JwtAccessGuard, RolGuard),
        ...(roles.length > 0 ? [UseRoles(...roles)] : []),
    );
