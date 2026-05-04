import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse } from '../types/api.types'
import type { User } from '../types/auth.types'
import { normalizeUser } from './auth.api'

export const profileApi = {
  /** GET /user/profile — fetch current user's full profile */
  get: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>(ENDPOINTS.profile.me())
    return normalizeUser(res.data.data ?? res.data)
  },
}
