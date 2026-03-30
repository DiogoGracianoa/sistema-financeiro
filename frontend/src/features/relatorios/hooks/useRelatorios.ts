import { useQuery } from "@tanstack/react-query";
import {
  getRelatorioTotaisPorCategoria,
  getRelatorioTotaisPorPessoa,
} from "../../../api/relatorios";

const RELATORIO_PESSOAS_KEY = ["relatorio-totais-por-pessoa"];
const RELATORIO_CATEGORIAS_KEY = ["relatorio-totais-por-categoria"];

export function useRelatorioTotaisPorPessoa() {
  return useQuery({
    queryKey: RELATORIO_PESSOAS_KEY,
    queryFn: getRelatorioTotaisPorPessoa,
  });
}

export function useRelatorioTotaisPorCategoria() {
  return useQuery({
    queryKey: RELATORIO_CATEGORIAS_KEY,
    queryFn: getRelatorioTotaisPorCategoria,
  });
}
