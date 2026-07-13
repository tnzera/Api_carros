import { PaginatedResult } from '../../common/dto/paginated-result';
import { Cliente } from './cliente.entity';

export abstract class IClienteRepository {
  abstract criar(cliente: Cliente): Promise<Cliente>;
  abstract listar(page: number, limit: number): Promise<PaginatedResult<Cliente>>;
  abstract buscarPorId(id: number): Promise<Cliente | null>;
  abstract buscarPorCpf(cpf: string): Promise<Cliente | null>; 
  abstract buscarPorEmail(email: string): Promise<Cliente | null>;
  // Usado pelo seed inicial: garante que o sistema nunca fique sem administrador
  abstract existeAdmin(): Promise<boolean>;
  abstract atualizar(id: number, dados: Partial<Cliente>): Promise<Cliente>;
  abstract remover(id: number): Promise<void>;
}