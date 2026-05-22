// domain/carro.entity.ts
export class Carro {
  constructor(
    public id: number | undefined,
    public marca: string,
    public modelo: string,
    public placa: string,
    public diaria: number,
  ) {}
}
