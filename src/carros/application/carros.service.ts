import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Carro } from '../domain/carro.entity';
import { ICarroRepository } from '../domain/carro.repository';
import { CreateCarroDto } from './dto/create-carro.dto';
import { UpdateCarroDto } from './dto/update-carro.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResult } from '../../common/dto/paginated-result';

export const CARRO_REPOSITORY = 'CARRO_REPOSITORY';

@Injectable()
export class CarrosService {
  constructor(
    @Inject(CARRO_REPOSITORY)
    private readonly carroRepository: ICarroRepository,
  ) {}

  async criar(dto: CreateCarroDto): Promise<Carro> {
  const existe = await this.carroRepository.buscarPorPlaca(dto.placa);
  if (existe) {
    throw new ConflictException(`Já existe um carro cadastrado com a placa ${dto.placa}`);
  }
  const carro = new Carro(
    undefined, 
    dto.marca, 
    dto.modelo, 
    dto.placa, 
    dto.diaria
  );
  return this.carroRepository.criar(carro);
}

  listar(pagination: PaginationQueryDto): Promise<PaginatedResult<Carro>> {
    return this.carroRepository.listar(pagination.page, pagination.limit);
  }

  async buscarPorId(id: number): Promise<Carro> {
    const carro = await this.carroRepository.buscarPorId(id);
    if (!carro) {
      throw new NotFoundException(`Carro #${id} não encontrado`);
    }
    return carro;
  }

  async atualizar(id: number, dto: UpdateCarroDto): Promise<Carro> {
    await this.buscarPorId(id);
    return this.carroRepository.atualizar(id, dto);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    return this.carroRepository.remover(id);
  }
}
