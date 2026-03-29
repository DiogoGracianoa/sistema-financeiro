import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPessoa,
  deletePessoa,
  getPessoas,
  updatePessoa,
} from "@api/pessoas";
import type { PessoaPayload } from "../types";

const pessoasKeys = {
  all: ["pessoas"] as const,
  detail: (id: number) => ["pessoas", id] as const,
};

export function usePessoas() {
  return useQuery({
    queryKey: pessoasKeys.all,
    queryFn: getPessoas,
  });
}

export function useCreatePessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PessoaPayload) => createPessoa(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pessoasKeys.all });
    },
  });
}

export function useUpdatePessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PessoaPayload }) =>
      updatePessoa(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pessoasKeys.all });
      queryClient.invalidateQueries({
        queryKey: pessoasKeys.detail(variables.id),
      });
    },
  });
}

export function useDeletePessoa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePessoa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pessoasKeys.all });
    },
  });
}
