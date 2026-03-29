export enum TipoTransacao {
  Despesa = 1,
  Receita = 2,
}

export type Transacao = {
  id: number;
  descricao: string;
  valor: number;
  idTipo: TipoTransacao;
  idCategoria: number;
  idPessoa?: number;
  pessoa?: PessoaResumo;
  dataCriacao?: string;
};

export type PessoaResumo = {
  id: number;
  nome: string;
};

export type TransacaoPayload = {
  idPessoa: number;
  descricao: string;
  valor: number;
  idTipo: TipoTransacao;
  idCategoria: number;
};

export type TransacaoResponseDto = {
  id: number;
  descricao?: string;
  valor: number;
  idTipo: TipoTransacao;
  idCategoria: number;
  idPessoa?: number;
  pessoa?: PessoaResumo;
  dataCriacao?: string;
};
