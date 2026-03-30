import { useQuery } from "@tanstack/react-query";
import {
  getRelatorioTotaisPorCategoria,
  getRelatorioTotaisPorPessoa,
} from "../../../api/relatorios";

export const relatorioKeys = {
  pessoas: ["relatorio-totais-por-pessoa"] as const,
  categorias: ["relatorio-totais-por-categoria"] as const,
};

export function useRelatorioTotaisPorPessoa() {
  return useQuery({
    queryKey: relatorioKeys.pessoas,
    queryFn: getRelatorioTotaisPorPessoa,
  });
}

export function useRelatorioTotaisPorCategoria() {
  return useQuery({
    queryKey: relatorioKeys.categorias,
    queryFn: getRelatorioTotaisPorCategoria,
  });
}
