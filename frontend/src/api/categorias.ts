import type {
  Categoria,
  CategoriaPayload,
  CategoriaResponseDto,
  FinalidadeCategoria,
} from "@features/categorias/types";
import httpClient, { getApiErrorMessage } from "./httpClient";
import { unwrap, type ApiEnvelope } from "./types";

const resource = "/categorias";

function mapCategoria(dto: CategoriaResponseDto): Categoria {
  return {
    id: dto.id,
    descricao: dto.descricao ?? "",
    idFinalidade: dto.idFinalidade ?? (1 as FinalidadeCategoria),
    dataCriacao: dto.dataCriacao,
  };
}

export async function getCategorias() {
  try {
    const { data } =
      await httpClient.get<ApiEnvelope<CategoriaResponseDto[]>>(resource);

    return (unwrap(data) ?? []).map(mapCategoria);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function createCategoria(payload: CategoriaPayload) {
  try {
    const { data } = await httpClient.post<ApiEnvelope<CategoriaResponseDto>>(
      resource,
      payload,
    );
    const categoria = unwrap(data);
    return categoria ? mapCategoria(categoria) : undefined;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
