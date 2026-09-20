import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse } from '../types/api.types'
import type { User } from '../types/auth.types'
import { normalizeUser } from './auth.api'

export interface UpdateProfilePayload {
  name?: string
  designation?: string
  gender?: string
  phone?: string
  institute?: string
  /** New profile photo to upload, if the user picked one in this edit. */
  photo?: File | null
}

export const profileApi = {
  /** GET /user/profile — fetch current user's full profile */
  get: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>(ENDPOINTS.profile.me())
    return normalizeUser(res.data.data ?? res.data)
  },

  /** PUT /user/profile — update editable fields */
  update: async (payload: UpdateProfilePayload): Promise<User> => {
    const { photo, ...fields } = payload
    if (photo) {
      // /user/profile only accepts GET/PUT, and PHP never populates $_FILES for
      // a genuine multipart PUT body -- the standard fix is a POST carrying a
      // `_method` override field, which Laravel routes to the PUT handler while
      // still letting PHP parse the file upload correctly.
      const fd = new FormData()
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) fd.append(key, String(value))
      })
      fd.append('profile_image', photo)
      fd.append('_method', 'PUT')
      const res = await apiClient.post<ApiResponse<User>>(
        ENDPOINTS.profile.update(),
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      return normalizeUser(res.data.data ?? res.data)
    }
    const res = await apiClient.put<ApiResponse<User>>(ENDPOINTS.profile.update(), fields)
    return normalizeUser(res.data.data ?? res.data)
  },
}
