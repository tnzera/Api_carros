import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carro } from '../domain/carro.entity';
import { ICarroRepository } from '../domain/carro.repository';
import { CarroTypeOrmEntity } from './carro.typeorm-entity';
import { buildPaginatedResult, PaginatedResult } from '../../common/dto/paginated-result';

@Injectable()
export class CarroTypeOrmRepository implements ICarroRepository {
  constructor(
    @InjectRepository(CarroTypeOrmEntity)
    private readonly repo: Repository<CarroTypeOrmEntity>,
  ) {}

  private toEntity(orm: CarroTypeOrmEntity): Carro {
    return new Carro(orm.id, orm.marca, orm.modelo, orm.placa, Number(orm.diaria));
  }

  async criar(carro: Carro): Promise<Carro> {
    const entity = this.repo.create({
      marca: carro.marca,
      modelo: carro.modelo,
      placa: carro.placa,
      diaria: carro.diaria,
    });
    const saved = await this.repo.save(entity);
    return this.toEntity(saved);
  }

  async listar(page: number, limit: number): Promise<PaginatedResult<Carro>> {
    const [entities, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
    const data = entities.map((e) => this.toEntity(e));
    return buildPaginatedResult(data, total, page, limit);
  }

  async buscarPorId(id: number): Promise<Carro | null> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) return null;
    return this.toEntity(entity);
  }

  async buscarPorPlaca(placa: string): Promise<Carro | null> {
    const entity = await this.repo.findOneBy({ placa });
    if (!entity) return null;
    return this.toEntity(entity);
}

  async atualizar(id: number, dados: Partial<Carro>): Promise<Carro> {
    await this.repo.update(id, {
      ...(dados.marca && { marca: dados.marca }),
      ...(dados.modelo && { modelo: dados.modelo }),
      ...(dados.placa && { placa: dados.placa }),
      ...(dados.diaria && { diaria: dados.diaria }),
    });
    return this.buscarPorId(id) as Promise<Carro>;
  }

  async remover(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
