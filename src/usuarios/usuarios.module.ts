import { Module } from '@nestjs/common';
import { IUSUARIO_REPOSITORY } from './constants/usuarios.constant';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosPrismaRepository } from './database/usuarios-prisma.repository';
import { UsuariosService } from './services/usuarios.service';
import { HashModule } from 'src/hash/hash.module';

@Module({
  controllers: [UsuariosController],
  providers: [
    {
      provide: IUSUARIO_REPOSITORY,
      useClass: UsuariosPrismaRepository,
    },
    UsuariosService,
  ],
  exports: [UsuariosService],
  imports: [HashModule],
})
export class UsuariosModule {}
