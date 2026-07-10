import { PaginatedResult } from '../../common/dto/paginated-result';
import { Reserva } from './reserva.entity';

export abstract class IReservaRepository {
  abstract criar(reserva: Reserva): Promise<Reserva>;
  abstract listar(page: number, limit: number): Promise<PaginatedResult<Reserva>>;
  abstract buscarPorId(id: number): Promise<Reserva | null>;
  abstract atualizar(id: number, dados: Partial<Reserva>): Promise<Reserva>;
  abstract remover(id: number): Promise<void>;
  // Regra de negócio essencial: impede duplicidade de agendamento do mesmo veículo
  abstract verificarDisponibilidade(carroId: number, dataInicio: Date, dataFim: Date): Promise<boolean>;
}