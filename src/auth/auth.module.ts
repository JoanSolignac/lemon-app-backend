import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HashModule } from 'src/hash/hash.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAccessGuard } from 'src/common/guards/jwt-access.guard';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { RolGuard } from 'src/common/guards/rol.guard';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt-access' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow<string>('jwt.secret'),
                signOptions: {
                    expiresIn: config.getOrThrow('jwt.expiresIn'),
                }
            })
        }),
        UsuariosModule,
        HashModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        JwtAccessGuard,
        JwtRefreshGuard,
        RolGuard,
    ],
    exports: [
        AuthService,
        JwtAccessGuard,
        JwtRefreshGuard,
        RolGuard,
        PassportModule,
        JwtModule,
    ],
})
export class AuthModule {}
