import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateReservaDto {
  @IsNumber({}, { message: 'O ID do carro deve ser um número' })
  @IsNotEmpty({ message: 'O ID do carro é obrigatório' })
  carroId!: number;

  @IsNumber({}, { message: 'O ID do cliente deve ser um número' })
  @IsNotEmpty({ message: 'O ID do cliente é obrigatório' })
  clienteId!: number;

  @IsDateString({}, { message: 'A data de início deve possuir um formato de data válido' })
  @IsNotEmpty({ message: 'A data de início é obrigatória' })
  dataInicio!: string;

  @IsDateString({}, { message: 'A data de fim deve possuir um formato de data válido' })
  @IsNotEmpty({ message: 'A data de fim é obrigatória' })
  dataFim!: string;
}