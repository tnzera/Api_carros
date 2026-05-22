import { IsString, IsNotEmpty, IsEmail, Length, Matches, IsNumberString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  nome!: string;

  @IsString()
  @IsNotEmpty({ message: 'O CPF não pode estar vazio' })
  @Length(11, 11, { message: 'O CPF deve conter exatamente 11 dígitos' })
  @Matches(/^[0-9]+$/, { message: 'O CPF deve conter apenas números' })
  cpf!: string;

  @IsString()
  @IsNotEmpty({ message: 'A CNH não pode estar vazia' })
  @Length(11, 11, { message: 'A CNH deve conter exatamente 11 dígitos' })
  @Matches(/^[0-9]+$/, { message: 'A CNH deve conter apenas números' })
  cnh!: string;

  @IsEmail({}, { message: 'O formato do e-mail é inválido' })
  @IsNotEmpty({ message: 'O e-mail não pode estar vazio' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone não pode estar vazio' })
  @IsNumberString({}, { message: 'O telefone deve conter apenas números' })
  telefone!: string;
}