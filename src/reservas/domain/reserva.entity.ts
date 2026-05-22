import { Carro } from '../../carros/domain/carro.entity';
import { Cliente } from '../../clientes/domain/cliente.entity';

export class Reserva {
  constructor(
    public id: number | undefined,
    public carro: Carro,
    public cliente: Cliente,
    public dataInicio: Date,
    public dataFim: Date,
  ) {}
}