import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/services/hash.service';
import { UsuariosService } from 'src/usuarios/services/usuarios.service';
import { LoginDto } from '../dtos/requests/login.dto';
import { UsuarioForAuth } from 'src/usuarios/types/usuario-for-auth.type';
import { UserPayload } from '../interfaces/jwt-payload.interface';
import { AccessTokenDto } from '../dtos/responses/access-token.dto';

@Injectable()
export class AuthService {
    private readonly INVALID_CREDENTIALS_MESSAGE = 'Credenciales no válidas';

    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ){};

    async login(dto: LoginDto): Promise<AccessTokenDto> {
        const authUser = await this.validateCredentials(dto.correoElectronico, dto.contrasena);
        if (!authUser) throw new UnauthorizedException(this.INVALID_CREDENTIALS_MESSAGE);
        const userPayload = this.createPayload(authUser);
        return this.signTokens(userPayload);
    }

    async refresh(payload: UserPayload): Promise<AccessTokenDto> {
        return this.signTokens(payload);
    }

    private async validateCredentials(email: string, password: string): Promise<UsuarioForAuth | null> {
        const usuario = await this.usuariosService.findForAuthByCorreoElectronico(email);
        if(!usuario || !usuario.activo) return null;
        const isValid = await this.hashService.compare(password, usuario.contrasena);
        if (!isValid) return null;
        return usuario;
    }

    private createPayload(authUser: UsuarioForAuth): UserPayload {
        return {
            sub: authUser.id,
            email: authUser.correoElectronico,
            rol: authUser.rol
        };
    }

    private async signTokens(payload: UserPayload): Promise<AccessTokenDto> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
                expiresIn: this.configService.getOrThrow('jwt.refreshExpiresIn'),
            }),
        ]);

        return { accessToken, refreshToken };
    }
}
