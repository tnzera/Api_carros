import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  senha!: string;
}