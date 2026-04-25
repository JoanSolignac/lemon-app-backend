import { Module } from '@nestjs/common';
import { IUSUARIO_REPOSITORY } from './constants/usuarios.constant';
import { UsuariosPrismaRepository } from './database/usuarios-prisma.repository';
import { UsuariosService } from './services/usuarios.service';

@Module({
  providers: [
    {
      provide: IUSUARIO_REPOSITORY,
      useClass: UsuariosPrismaRepository,
    },
    UsuariosService,
  ],
})
export class UsuariosModule {}
