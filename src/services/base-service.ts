import {
  create,
  isAxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export const apiClient: AxiosInstance = create({
  baseURL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vantax_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const baseService = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.get<T>(url, config).then((response) => response.data)
  },

  post<T, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return apiClient
      .post<T>(url, body, config)
      .then((response) => response.data)
  },

  put<T, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return apiClient.put<T>(url, body, config).then((response) => response.data)
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return apiClient.delete<T>(url, config).then((response) => response.data)
  },
}

type ApiErrorBody = {
  message?: string | string[]
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error inesperado',
): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message

    if (Array.isArray(message)) {
      return message.join(', ')
    }

    if (message) {
      return message
    }

    if (error.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado. Intenta de nuevo.'
    }

    if (!error.response) {
      return 'No se pudo conectar con el servidor.'
    }

    return error.message || fallback
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
