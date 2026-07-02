import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../domain/cliente.entity';
import { IClienteRepository } from '../domain/cliente.repository';
import { ClienteTypeOrmEntity } from './cliente.typeorm-entity';

@Injectable()
export class ClienteTypeOrmRepository implements IClienteRepository {
  constructor(
    @InjectRepository(ClienteTypeOrmEntity)
    private readonly repository: Repository<ClienteTypeOrmEntity>,
  ) {}

  private toDomain(entity: ClienteTypeOrmEntity): Cliente {
    return new Cliente(
      entity.id,
      entity.nome,
      entity.cpf,
      entity.cnh,
      entity.email,
      entity.telefone,
      entity.senha,
    );
  }

  async criar(cliente: Cliente): Promise<Cliente> {
    const entity = this.repository.create(cliente);
    const salvo = await this.repository.save(entity);
    return this.toDomain(salvo);
  }

  async listar(): Promise<Cliente[]> {
    const entities = await this.repository.find();
    return entities.map(this.toDomain);
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async buscarPorCpf(cpf: string): Promise<Cliente | null> {
    const entity = await this.repository.findOne({ where: { cpf } });
    return entity ? this.toDomain(entity) : null;
  }

  async atualizar(id: number, dados: Partial<Cliente>): Promise<Cliente> {
    await this.repository.update(id, dados);
    const entity = await this.repository.findOneOrFail({ where: { id } });
    return this.toDomain(entity);
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
}

  async remover(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}