export type RelatorioPessoaItem = {
  id: number;
  nome: string;
  receitas: number;
  despesas: number;
  saldo: number;
};

export type RelatorioTotalGeral = {
  receitas: number;
  despesas: number;
  saldo: number;
};

export type RelatorioTotaisPorPessoaResponse = {
  pessoas: RelatorioPessoaItem[];
  totalGeral: RelatorioTotalGeral;
};

export type RelatorioCategoriaItem = {
  id: number;
  descricao: string;
  idFinalidade: number;
  receitas: number;
  despesas: number;
  saldo: number;
};

export type RelatorioTotaisPorCategoriaResponse = {
  categorias: RelatorioCategoriaItem[];
  totalGeral: RelatorioTotalGeral;
};
