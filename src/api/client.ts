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

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const payload = error.response?.data
    const message =
      payload?.exception ??
      payload?.mensagemErro ??
      'Não foi possível completar a operação. Tente novamente.'
    return Promise.reject(new ApiError(message))
  },
)
