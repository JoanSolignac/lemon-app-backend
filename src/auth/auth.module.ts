import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HashModule } from 'src/hash/hash.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
    imports: [
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
})
export class AuthModule {}
