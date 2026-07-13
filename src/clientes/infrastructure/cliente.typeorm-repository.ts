import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../domain/cliente.entity';
import { IClienteRepository } from '../domain/cliente.repository';
import { ClienteTypeOrmEntity } from './cliente.typeorm-entity';
import { buildPaginatedResult, PaginatedResult } from '../../common/dto/paginated-result';

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
      entity.role,
    );
  }

  async criar(cliente: Cliente): Promise<Cliente> {
    const entity = this.repository.create(cliente);
    const salvo = await this.repository.save(entity);
    return this.toDomain(salvo);
  }

  async listar(page: number, limit: number): Promise<PaginatedResult<Cliente>> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
    const data = entities.map((e) => this.toDomain(e));
    return buildPaginatedResult(data, total, page, limit);
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

  async existeAdmin(): Promise<boolean> {
    const admin = await this.repository.findOne({ where: { role: 'admin' } });
    return !!admin;
  }

  async remover(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}