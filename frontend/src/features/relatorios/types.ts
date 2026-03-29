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
