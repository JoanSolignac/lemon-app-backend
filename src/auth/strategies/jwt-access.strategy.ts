import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserPayload } from "../../common/interfaces/jwt-payload.interface";
import { Usuario } from "src/usuarios/types/usuario.type";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(
        private readonly config: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('jwt.secret'),
        });
    };

    async validate(payload: UserPayload): Promise<Pick<Usuario, 'id'| 'correoElectronico' | 'rol'>> { 
        return {
            id: payload.sub,
            correoElectronico: payload.email,
            rol: payload.rol
        };
    }
}