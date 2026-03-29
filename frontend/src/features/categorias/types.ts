export enum FinalidadeCategoria {
  Despesa = 1,
  Receita = 2,
  Ambas = 3,
}

export type Categoria = {
  id: number;
  descricao: string;
  idFinalidade: FinalidadeCategoria;
  dataCriacao?: string;
};

export type CategoriaPayload = {
  descricao: string;
  idFinalidade: FinalidadeCategoria;
};

export type CategoriaResponseDto = {
  id: number;
  descricao?: string;
  idFinalidade: FinalidadeCategoria;
  dataCriacao?: string;
};
