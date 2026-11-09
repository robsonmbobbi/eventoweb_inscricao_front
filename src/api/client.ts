import axios, { AxiosError } from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

/** Erro com a mensagem já extraída do payload da API, pronta para exibir ao usuário. */
export class ApiError extends Error {}

interface ApiErrorPayload {
  exception?: string
  mensagemErro?: string
}

/** Respostas da validação de origem e do rate limit do back, caso cheguem sem corpo. */
const MENSAGENS_POR_STATUS: Record<number, string> = {
  403: 'Acesso não permitido.',
  429: 'Muitas tentativas em pouco tempo. Aguarde alguns instantes e tente novamente.',
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const payload = error.response?.data
    const message =
      payload?.exception ??
      payload?.mensagemErro ??
      MENSAGENS_POR_STATUS[error.response?.status ?? 0] ??
      'Não foi possível completar a operação. Tente novamente.'
    return Promise.reject(new ApiError(message))
  },
)
