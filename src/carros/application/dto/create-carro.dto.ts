import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateCarroDto {
  @IsString()
  @IsNotEmpty({ message: 'A marca não pode estar vazia' })
  marca!: string;

  @IsString()
  @IsNotEmpty({ message: 'O modelo não pode estar vazio' })
  modelo!: string;

  @IsString()
  @IsNotEmpty({ message: 'A placa não pode estar vazia' })
  placa!: string;

  @IsNumber({}, { message: 'A diária deve ser um número' })
  @IsPositive({ message: 'A diária deve ser um valor positivo' })
  diaria!: number;
}