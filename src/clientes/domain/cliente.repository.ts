import { Cliente } from './cliente.entity';

export abstract class IClienteRepository {
  abstract criar(cliente: Cliente): Promise<Cliente>;
  abstract listar(): Promise<Cliente[]>;
  abstract buscarPorId(id: number): Promise<Cliente | null>;
  abstract buscarPorCpf(cpf: string): Promise<Cliente | null>; 
  abstract atualizar(id: number, dados: Partial<Cliente>): Promise<Cliente>;
  abstract remover(id: number): Promise<void>;
}