import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CarrosService } from '../../carros/application/carros.service';
import { ClientesService } from '../../clientes/application/clientes.service';
import { Reserva } from '../domain/reserva.entity';
import { IReservaRepository } from '../domain/reserva.repository';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

export const RESERVA_REPOSITORY = 'RESERVA_REPOSITORY';

@Injectable()
export class ReservasService {
  constructor(
    @Inject(RESERVA_REPOSITORY)
    private readonly reservaRepository: IReservaRepository,
    private readonly carrosService: CarrosService,
    private readonly clientesService: ClientesService,
  ) {}

  async criar(dto: CreateReservaDto): Promise<Reserva> {
    const inicio = new Date(dto.dataInicio);
    const fim = new Date(dto.dataFim);

    if (inicio >= fim) {
      throw new BadRequestException('A data de início deve ser cronologicamente anterior à data de fim');
    }

    const carro = await this.carrosService.buscarPorId(dto.carroId);
    const cliente = await this.clientesService.buscarPorId(dto.clienteId);

    const disponivel = await this.reservaRepository.verificarDisponibilidade(dto.carroId, inicio, fim);
    if (!disponivel) {
      throw new ConflictException('O carro já possui uma reserva ativa para o período selecionado');
    }

    const reserva = new Reserva(undefined, carro, cliente, inicio, fim);
    return this.reservaRepository.criar(reserva);
  }

  listar(): Promise<Reserva[]> {
    return this.reservaRepository.listar();
  }

  async buscarPorId(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.buscarPorId(id);
    if (!reserva) {
      throw new NotFoundException(`Reserva #${id} não encontrada`);
    }
    return reserva;
  }

  async atualizar(id: number, dto: UpdateReservaDto): Promise<Reserva> {
    const reservaExistente = await this.buscarPorId(id);

    let carro = reservaExistente.carro;
    let cliente = reservaExistente.cliente;
    let inicio = reservaExistente.dataInicio;
    let fim = reservaExistente.dataFim;

    if (dto.carroId) carro = await this.carrosService.buscarPorId(dto.carroId);
    if (dto.clienteId) cliente = await this.clientesService.buscarPorId(dto.clienteId);
    if (dto.dataInicio) inicio = new Date(dto.dataInicio);
    if (dto.dataFim) fim = new Date(dto.dataFim);

    if (inicio >= fim) {
      throw new BadRequestException('A data de início deve ser anterior à data de fim');
    }

    if (dto.carroId || dto.dataInicio || dto.dataFim) {
      const disponivel = await this.reservaRepository.verificarDisponibilidade(carro.id!, inicio, fim);
      if (!disponivel) {
        throw new ConflictException('O veículo está indisponível para alteração no período informado');
      }
    }

    const reservaAtualizada = new Reserva(id, carro, cliente, inicio, fim);
    return this.reservaRepository.atualizar(id, reservaAtualizada);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    return this.reservaRepository.remover(id);
  }
}