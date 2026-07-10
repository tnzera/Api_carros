import { Exclude } from 'class-transformer';

export class Cliente {
  public id: number | undefined;
  public nome: string;
  public cpf: string;
  public cnh: string;
  public email: string;
  public telefone: string;

  // Omitido respostas HTTP
  @Exclude()
  public senha: string;

  //  somente 'admin'
  public role: string;

  constructor(
    id: number | undefined,
    nome: string,
    cpf: string,
    cnh: string,
    email: string,
    telefone: string,
    senha: string,
    role: string = 'cliente',
  ) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.cnh = cnh;
    this.email = email;
    this.telefone = telefone;
    this.senha = senha;
    this.role = role;
  }
}
