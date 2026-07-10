import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cliente } from '../domain/cliente.entity';
import { IClienteRepository } from '../domain/cliente.repository';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResult } from '../../common/dto/paginated-result';
import * as bcrypt from 'bcrypt';

export const CLIENTE_REPOSITORY = 'CLIENTE_REPOSITORY';

@Injectable()
export class ClientesService {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async criar(dto: CreateClienteDto): Promise<Cliente> {
    //Validar CPF Duplicado
    const existeCpf = await this.clienteRepository.buscarPorCpf(dto.cpf);
    if (existeCpf) {
      throw new ConflictException(`Já existe um cliente cadastrado com o CPF ${dto.cpf}`);
    }

    // Validar E-mail Duplicado 
    const existeEmail = await this.clienteRepository.buscarPorEmail(dto.email);
    if (existeEmail) {
      throw new ConflictException(`Já existe um cliente cadastrado com o e-mail ${dto.email}`);
    }

    //Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(dto.senha, salt);
    
    const cliente = new Cliente(
      undefined,
      dto.nome,
      dto.cpf,
      dto.cnh,
      dto.email,
      dto.telefone,
      senhaCriptografada,
      dto.role ?? 'cliente',
    );
    
    // A senha é omitida da resposta pelo @Exclude na entidade + ClassSerializerInterceptor
    return this.clienteRepository.criar(cliente);
  }

  listar(pagination: PaginationQueryDto): Promise<PaginatedResult<Cliente>> {
    return this.clienteRepository.listar(pagination.page, pagination.limit);
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente #${id} não encontrado`);
    }
    return cliente;
  }

  async atualizar(id: number, dto: UpdateClienteDto): Promise<Cliente> {
    await this.buscarPorId(id);

    // Revalida duplicidade de CPF/e-mail, ignorando o próprio registro
    if (dto.cpf) {
      const existente = await this.clienteRepository.buscarPorCpf(dto.cpf);
      if (existente && existente.id !== id) {
        throw new ConflictException(`Já existe um cliente cadastrado com o CPF ${dto.cpf}`);
      }
    }
    if (dto.email) {
      const existente = await this.clienteRepository.buscarPorEmail(dto.email);
      if (existente && existente.id !== id) {
        throw new ConflictException(`Já existe um cliente cadastrado com o e-mail ${dto.email}`);
      }
    }

    // Nunca persistir senha em texto puro: criptografa antes de salvar
    const dados: Partial<Cliente> = { ...dto };
    if (dto.senha) {
      const salt = await bcrypt.genSalt(10);
      dados.senha = await bcrypt.hash(dto.senha, salt);
    }

    return this.clienteRepository.atualizar(id, dados);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id); 
    return this.clienteRepository.remover(id);
  }
}