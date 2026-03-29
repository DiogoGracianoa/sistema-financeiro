export type ApiEnvelope<T> = {
  sucesso: boolean;
  mensagem?: string;
  dados?: T;
};

export function unwrap<T>(response: ApiEnvelope<T>) {
  return response.dados;
}
