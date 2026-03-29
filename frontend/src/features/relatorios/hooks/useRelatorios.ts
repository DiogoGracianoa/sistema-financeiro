import { useQuery } from "@tanstack/react-query";
import { getRelatorioTotaisPorPessoa } from "../../../api/relatorios";

const RELATORIO_PESSOAS_KEY = ["relatorio-totais-por-pessoa"];

export function useRelatorioTotaisPorPessoa() {
  return useQuery({
    queryKey: RELATORIO_PESSOAS_KEY,
    queryFn: getRelatorioTotaisPorPessoa,
  });
}
