import { Module } from '@nestjs/common';
import { ISUARIOS_REPOSITORY } from './constants/usuarios.constant';
import { UsuariosPrismaRepository } from './database/usuarios-prisma.repository';
import { ServicesService } from './services/services.service';

@Module({
    providers: [{
        provide: ISUARIOS_REPOSITORY,
        useClass: UsuariosPrismaRepository,
    }, ServicesService]
})
export class UsuariosModule {}
