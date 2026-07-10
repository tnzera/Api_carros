import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarrosService, CARRO_REPOSITORY } from './application/carros.service';
import { CarroTypeOrmEntity } from './infrastructure/carro.typeorm-entity';
import { CarroTypeOrmRepository } from './infrastructure/carro.typeorm-repository';
import { CarrosController } from './presentation/carros.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([CarroTypeOrmEntity]), PassportModule],
  controllers: [CarrosController],
  providers: [
    CarrosService,
    {
      provide: CARRO_REPOSITORY,
      useClass: CarroTypeOrmRepository,
    },
  ],
  exports: [CarrosService],
})
export class CarrosModule {}
