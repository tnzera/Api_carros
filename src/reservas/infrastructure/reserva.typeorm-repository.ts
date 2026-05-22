import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../domain/reserva.entity';
import { IReservaRepository } from '../domain/reserva.repository';
import { ReservaTypeOrmEntity } from './reserva.typeorm-entity';
import { Carro } from '../../carros/domain/carro.entity';
import { Cliente } from '../../clientes/domain/cliente.entity';

@Injectable()
export class ReservaTypeOrmRepository implements IReservaRepository {
  constructor(
    @InjectRepository(ReservaTypeOrmEntity)
    private readonly repository: Repository<ReservaTypeOrmEntity>,
  ) {}

  private toDomain(entity: ReservaTypeOrmEntity): Reserva {
    return new Reserva(
      entity.id,
      new Carro(entity.carro.id, entity.carro.marca, entity.carro.modelo, entity.carro.placa, Number(entity.carro.diaria)),
      new Cliente(entity.cliente.id, entity.cliente.nome, entity.cliente.cpf, entity.cliente.cnh, entity.cliente.email, entity.cliente.telefone),
      entity.dataInicio,
      entity.dataFim,
    );
  }

  async criar(reserva: Reserva): Promise<Reserva> {
    const entity = this.repository.create({
      carro: { id: reserva.carro.id },
      cliente: { id: reserva.cliente.id },
      dataInicio: reserva.dataInicio,
      dataFim: reserva.dataFim,
    });
    const salvo = await this.repository.save(entity);
    const completo = await this.repository.findOneOrFail({ where: { id: salvo.id } });
    return this.toDomain(completo);
  }

  async listar(): Promise<Reserva[]> {
    const entities = await this.repository.find();
    return entities.map(this.toDomain);
  }

  async buscarPorId(id: number): Promise<Reserva | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async atualizar(id: number, dados: Partial<Reserva>): Promise<Reserva> {
    const updateData: any = {};
    if (dados.dataInicio) updateData.dataInicio = dados.dataInicio;
    if (dados.dataFim) updateData.dataFim = dados.dataFim;
    if (dados.carro) updateData.carro = { id: dados.carro.id };
    if (dados.cliente) updateData.cliente = { id: dados.cliente.id };

    await this.repository.update(id, updateData);
    const entity = await this.repository.findOneOrFail({ where: { id } });
    return this.toDomain(entity);
  }

  async remover(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async verificarDisponibilidade(carroId: number, dataInicio: Date, dataFim: Date): Promise<boolean> {
    //validação de locação de veiculos na mesma data 
    const conflito = await this.repository.createQueryBuilder('reserva')
      .where('reserva.carro_id = :carroId', { carroId })
      .andWhere('reserva.data_inicio < :dataFim AND reserva.data_fim > :dataInicio', {
        dataInicio,
        dataFim,
      })
      .getOne();

    return !conflito;
  }
}