import { Module } from '@nestjs/common';
import { DispositivosService } from './services/dispositivos.service';
import { IDISPOSITIVO_REPOSITORY } from './constants/dispositivos.constants';
import { DispositivosPrismaRepository } from './database/dispositivos-prisma.repository';
import { DispositivosController } from './controllers/dispositivos.controller';

@Module({
  providers: [
    {
      provide: IDISPOSITIVO_REPOSITORY,
      useClass: DispositivosPrismaRepository
    },
    DispositivosService
  ],
  controllers: [DispositivosController]
})
export class DispositivosModule {}
