import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma/prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VALIDATION_SCHEMA } from './config/validation.schema';
import { APP_CONFIG } from './config/app.config';
import { DATABASE_CONFIG } from './config/database.config';
import { JWT_CONFIG } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
      validationSchema: VALIDATION_SCHEMA,
      load: [APP_CONFIG, DATABASE_CONFIG, JWT_CONFIG],
      isGlobal: true,
    }),
    PrismaModule,
    ClientesModule,
    UsuariosModule
  ],
})
export class AppModule {}
