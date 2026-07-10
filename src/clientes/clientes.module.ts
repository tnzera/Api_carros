import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ClientesService, CLIENTE_REPOSITORY } from './application/clientes.service';
import { ClienteTypeOrmEntity } from './infrastructure/cliente.typeorm-entity';
import { ClienteTypeOrmRepository } from './infrastructure/cliente.typeorm-repository';
import { ClientesController } from './presentation/clientes.controller';


@Module({
  imports: [TypeOrmModule.forFeature([ClienteTypeOrmEntity]), PassportModule,],
  controllers: [ClientesController],
  providers: [
    ClientesService,
    {
      provide: CLIENTE_REPOSITORY,
      useClass: ClienteTypeOrmRepository,
    },
  ],
  exports: [ClientesService],
})
export class ClientesModule {}