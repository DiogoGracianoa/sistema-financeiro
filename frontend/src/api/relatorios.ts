import type {
  RelatorioTotaisPorCategoriaResponse,
  RelatorioTotaisPorPessoaResponse,
} from "../features/relatorios/types";
import httpClient, { getApiErrorMessage } from "./httpClient";
import { unwrap, type ApiEnvelope } from "./types";

const resource = "/relatorios";

export async function getRelatorioTotaisPorPessoa() {
  try {
    const { data } = await httpClient.get<
      ApiEnvelope<RelatorioTotaisPorPessoaResponse>
    >(`${resource}/totais-por-pessoa`);

    const relatorio = unwrap(data);
    return (
      relatorio ?? {
        pessoas: [],
        totalGeral: { receitas: 0, despesas: 0, saldo: 0 },
      }
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getRelatorioTotaisPorCategoria() {
  try {
    const { data } = await httpClient.get<
      ApiEnvelope<RelatorioTotaisPorCategoriaResponse>
    >(`${resource}/totais-por-categoria`);

    const relatorio = unwrap(data);
    return (
      relatorio ?? {
        categorias: [],
        totalGeral: { receitas: 0, despesas: 0, saldo: 0 },
      }
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
