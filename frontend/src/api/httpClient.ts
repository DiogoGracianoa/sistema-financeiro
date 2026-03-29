import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5172/api/v1";

const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      mensagem?: string;
      erro?: string;
    }>;
    return (
      axiosError.response?.data?.mensagem ||
      axiosError.response?.data?.erro ||
      axiosError.message ||
      "Erro inesperado ao comunicar com a API."
    );
  }

  return "Erro inesperado ao comunicar com a API.";
}

export default httpClient;
