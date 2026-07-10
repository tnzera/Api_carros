import { Type } from 'class-transformer';
import { Carro } from '../../carros/domain/carro.entity';
import { Cliente } from '../../clientes/domain/cliente.entity';

export class Reserva {
  public id: number | undefined;

  @Type(() => Carro)
  public carro: Carro;

  @Type(() => Cliente)
  public cliente: Cliente;

  public dataInicio: Date;
  public dataFim: Date;

  constructor(
    id: number | undefined,
    carro: Carro,
    cliente: Cliente,
    dataInicio: Date,
    dataFim: Date,
  ) {
    this.id = id;
    this.carro = carro;
    this.cliente = cliente;
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
  }
}
