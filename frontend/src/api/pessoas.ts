import type {
  Pessoa,
  PessoaPayload,
  PessoaResponseDto,
} from "@features/pessoas/types";
import httpClient, { getApiErrorMessage } from "./httpClient";
import { unwrap, type ApiEnvelope } from "./types";

const resource = "/pessoas";

function mapPessoa(dto: PessoaResponseDto): Pessoa {
  return {
    id: dto.id,
    nome: dto.nome ?? "",
    idade: dto.idade ?? 0,
    dataCriacao: dto.dataCriacao,
  };
}

export async function getPessoas() {
  try {
    const { data } =
      await httpClient.get<ApiEnvelope<PessoaResponseDto[]>>(resource);

    return (unwrap(data) ?? []).map(mapPessoa);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function createPessoa(payload: PessoaPayload) {
  try {
    const { data } = await httpClient.post<ApiEnvelope<PessoaResponseDto>>(
      resource,
      payload,
    );
    const pessoa = unwrap(data);
    return pessoa ? mapPessoa(pessoa) : undefined;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function updatePessoa(id: number, payload: PessoaPayload) {
  try {
    const { data } = await httpClient.put<ApiEnvelope<PessoaResponseDto>>(
      `${resource}/${id}`,
      payload,
    );
    const pessoa = unwrap(data);
    return pessoa ? mapPessoa(pessoa) : undefined;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function deletePessoa(id: number) {
  try {
    await httpClient.delete(`${resource}/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
