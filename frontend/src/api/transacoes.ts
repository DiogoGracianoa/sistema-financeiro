import {
  Transacao,
  TransacaoPayload,
  TransacaoResponseDto,
} from "../features/transacoes/types";
import httpClient, { getApiErrorMessage } from "./httpClient";
import { unwrap, type ApiEnvelope } from "./types";

const mapTransacao = (dto: TransacaoResponseDto): Transacao => ({
  id: dto.id,
  descricao: dto.descricao ?? "",
  valor: dto.valor,
  idTipo: dto.idTipo,
  idCategoria: dto.idCategoria,
  idPessoa: dto.idPessoa ?? dto.pessoa?.id,
  pessoa: dto.pessoa,
  dataCriacao: dto.dataCriacao,
});

export const getTransacoes = async (): Promise<Transacao[]> => {
  try {
    const { data } =
      await httpClient.get<ApiEnvelope<TransacaoResponseDto[]>>("/transacoes");
    const lista = unwrap(data) ?? [];
    return lista.map(mapTransacao);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const createTransacao = async (
  payload: TransacaoPayload,
): Promise<Transacao> => {
  try {
    const { data } = await httpClient.post<ApiEnvelope<TransacaoResponseDto>>(
      "/transacoes",
      payload,
    );
    const transacao = unwrap(data);
    if (!transacao) {
      throw new Error("Resposta da API não veio no formato esperado.");
    }
    return mapTransacao(transacao);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
