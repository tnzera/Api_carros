import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrosModule } from '../carros/carros.module';
import { ClientesModule } from '../clientes/clientes.module';
import { ReservasService, RESERVA_REPOSITORY } from './application/reservas.service';
import { ReservaTypeOrmEntity } from './infrastructure/reserva.typeorm-entity';
import { ReservaTypeOrmRepository } from './infrastructure/reserva.typeorm-repository';
import { ReservasController } from './presentation/reservas.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservaTypeOrmEntity]),
    CarrosModule,   
    ClientesModule, 
  ],
  controllers: [ReservasController],
  providers: [
    ReservasService,
    {
      provide: RESERVA_REPOSITORY,
      useClass: ReservaTypeOrmRepository,
    },
  ],
})
export class ReservasModule {}