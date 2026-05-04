import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'
import { setupMockInterceptor } from '@/mocks/mockInterceptor' // ← remove this line to fully revert

// In development VITE_API_BASE_URL is intentionally empty — Vite proxies /api → backend.
// In production it holds the full backend host (set in .env.production).
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const apiClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

// ── Dev mock mode (remove this line to fully revert) ─────────────────────────
setupMockInterceptor(apiClient)

// Attach Bearer token from localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('trustu_token')
    // Guard against localStorage holding the literal string "undefined" or "null"
    // (can happen if the backend returns an unexpected field name for the token)
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Normalize errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response

      if (status === 401) {
        localStorage.removeItem('trustu_token')
        localStorage.removeItem('trustu_user')
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth/login'
        }
      }

      const data = error.response.data as { message?: string; errors?: Record<string, string[]> }
      const normalizedError = new Error(data?.message ?? 'An unexpected error occurred.') as Error & {
        status: number
        errors?: Record<string, string[]>
      }
      normalizedError.status = status
      normalizedError.errors = data?.errors
      return Promise.reject(normalizedError)
    }
    if (error.request) return Promise.reject(new Error('Network error — check your connection.'))
    return Promise.reject(error)
  }
)

export default apiClient
