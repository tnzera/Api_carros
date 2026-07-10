import { IsString, IsNotEmpty, IsEmail, IsIn, IsOptional, Length, Matches, IsNumberString, MinLength } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' }) // <-- Adicionar validação
  senha!: string;

  // Opcional: só admins chegam aqui (apenas eles conseguem token), então é seguro aceitar
  @IsOptional()
  @IsIn(['cliente', 'admin'], { message: "O papel deve ser 'cliente' ou 'admin'" })
  role?: string;
}