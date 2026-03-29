export type Pessoa = {
  id: number;
  nome: string;
  idade: number;
  dataCriacao?: string;
};

export type PessoaPayload = {
  nome: string;
  idade: number;
};

export type PessoaResponseDto = {
  id: number;
  nome?: string;
  idade?: number;
  dataCriacao?: string;
};
