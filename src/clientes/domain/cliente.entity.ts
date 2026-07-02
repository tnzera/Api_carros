export class Cliente {
  constructor(
    public id: number | undefined,
    public nome: string,
    public cpf: string,
    public cnh: string,
    public email: string,
    public telefone: string,
    public senha: string
  ) {}
}