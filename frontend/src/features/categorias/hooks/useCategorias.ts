import { createCategoria, getCategorias } from "@api/categorias";
import type { CategoriaPayload } from "@features/categorias/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const categoriasKeys = {
  all: ["categorias"] as const,
};

export function useCategorias() {
  return useQuery({
    queryKey: categoriasKeys.all,
    queryFn: getCategorias,
  });
}

export function useCreateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoriaPayload) => createCategoria(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriasKeys.all });
    },
  });
}
