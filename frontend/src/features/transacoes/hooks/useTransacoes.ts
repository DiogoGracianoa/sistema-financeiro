import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransacao, getTransacoes } from "../../../api/transacoes";
import { TransacaoPayload } from "../types";

const TRANSACOES_QUERY_KEY = ["transacoes"];

export const useTransacoes = () => {
  return useQuery({
    queryKey: TRANSACOES_QUERY_KEY,
    queryFn: getTransacoes,
  });
};

export const useCreateTransacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TransacaoPayload) => createTransacao(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACOES_QUERY_KEY });
    },
  });
};
