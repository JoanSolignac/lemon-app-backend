import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { PrismaModule } from './database/prisma/prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`,
      validationSchema,
      load: [appConfig, databaseConfig],
      isGlobal: true,
    }),
    PrismaModule,
    ClientesModule,
    UsuariosModule
  ],
})
export class AppModule {}
