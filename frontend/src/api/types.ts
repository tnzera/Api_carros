// Tipos espelhando as entidades e respostas do backend (api-cars)

export interface Carro {
  id: number;
  marca: string;
  modelo: string;
  placa: string;
  diaria: number;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  cnh: string;
  email: string;
  telefone: string;
  role: 'cliente' | 'admin';
}

export interface Reserva {
  id: number;
  carro: Carro;
  cliente: Cliente;
  dataInicio: string;
  dataFim: string;
}

// Formato de retorno das listagens paginadas do backend
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    nome: string;
    email: string;
  };
}
