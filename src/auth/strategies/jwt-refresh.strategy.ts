import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserPayload } from "../interfaces/jwt-payload.interface";
import { AuthenticatedUser } from "src/common/interfaces/authenticated-user.interface";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly config: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('jwt.refreshSecret'),
        });
    };

    async validate(payload: UserPayload): Promise<AuthenticatedUser> { 
        return {
            id: payload.sub,
            correoElectronico: payload.email,
            rol: payload.rol
        };
    }
}
