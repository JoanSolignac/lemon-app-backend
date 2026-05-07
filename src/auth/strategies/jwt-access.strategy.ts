import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '../interfaces/jwt-payload.interface';
import { AuthenticatedUser } from 'src/common/interfaces/authenticated-user.interface';
import { UsuariosService } from '../../usuarios/services/usuarios.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly config: ConfigService,
    private readonly usuarioService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: UserPayload): Promise<AuthenticatedUser> {
    const usuario = await this.usuarioService.findForAuthByCorreoElectronico(
      payload.email,
    );

    if (!usuario) {
      throw new UnauthorizedException();
    }

    if (!usuario.activo) {
      throw new UnauthorizedException();
    }

    return {
      id: payload.sub,
      correoElectronico: payload.email,
      rol: payload.rol,
    };
  }
}
