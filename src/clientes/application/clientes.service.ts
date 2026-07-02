import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cliente } from '../domain/cliente.entity';
import { IClienteRepository } from '../domain/cliente.repository';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
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
      senhaCriptografada 
    );
    
    const clienteSalvo = await this.clienteRepository.criar(cliente);

    //remover a senha do retorno
    const { senha, ...clienteSemSenha } = clienteSalvo;

    return clienteSemSenha as Cliente;
  }

  listar(): Promise<Cliente[]> {
    return this.clienteRepository.listar();
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
    return this.clienteRepository.atualizar(id, dto);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id); 
    return this.clienteRepository.remover(id);
  }
}