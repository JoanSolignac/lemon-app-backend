import { Module } from '@nestjs/common';
import { ClientesController } from './controllers/clientes.controller';
import { ClientesPrismaRepository } from './database/clientes-prisma.repository';
import { ClientesService } from './services/clientes.service';
import { ICLIENTE_REPOSITORY } from './constants/cliente.constants';

@Module({
  controllers: [ClientesController],
  providers: [
    {
      provide: ICLIENTE_REPOSITORY,
      useClass: ClientesPrismaRepository
    },
    ClientesService
  ]
})
export class ClientesModule {}
