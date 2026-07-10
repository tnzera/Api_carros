
import { PaginatedResult } from '../../common/dto/paginated-result';
import { Carro } from './carro.entity';

export abstract class ICarroRepository {
  abstract criar(carro: Carro): Promise<Carro>;
  abstract listar(page: number, limit: number): Promise<PaginatedResult<Carro>>;
  abstract buscarPorId(id: number): Promise<Carro | null>;
  abstract buscarPorPlaca(placa: string): Promise<Carro | null>; 
  abstract atualizar(id: number, dados: Partial<Carro>): Promise<Carro>;
  abstract remover(id: number): Promise<void>;
}