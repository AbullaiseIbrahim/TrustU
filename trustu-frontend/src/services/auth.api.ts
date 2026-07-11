import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth.types'

/**
 * Normalize a raw backend user object (snake_case) → frontend User type (camelCase).
 * Handles all known field name variations returned by the Laravel backend.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeUser(raw: any): User {
  // Laravel can nest profile fields under a `profile` object (same shape used
  // for community members / friends) — fall back to it for every field below.
  const profile = raw?.profile ?? {}
  return {
    id:              String(raw?.id ?? ''),
    name:            raw?.name ?? profile.name ?? '',
    email:           raw?.email ?? profile.email ?? null,
    phone:           raw?.phone ?? raw?.phone_number ?? profile.phone ?? null,
    gender:          raw?.gender ?? profile.gender ?? null,
    // Laravel sends profile_type; frontend calls it designation
    designation:     raw?.designation ?? raw?.profile_type ?? profile.designation ?? profile.profile_type ?? null,
    institute:       raw?.institute ?? raw?.institution ?? raw?.college ?? profile.institute ?? null,
    avatarUrl:       profile.profile_image ?? raw?.avatar_url ?? raw?.avatarUrl ?? raw?.avatar ?? null,
    profileComplete: Boolean(raw?.profile_complete ?? raw?.profileComplete ?? false),
    communityJoined: Boolean(raw?.community_joined ?? raw?.communityJoined ?? false),
    communityId:     raw?.community_id   != null ? String(raw.community_id)   : (raw?.communityId   ?? null),
    communityName:   raw?.community_name ?? raw?.communityName ?? null,
    createdAt:       raw?.created_at ?? raw?.createdAt ?? '',
    updatedAt:       raw?.updated_at ?? raw?.updatedAt ?? '',
  }
}

/** Laravel Sanctum can return the token under several field names. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAuthResponse(raw: any): AuthResponse {
  const token: string =
    raw?.token ??
    raw?.access_token ??
    raw?.plainTextToken ??
    raw?.data?.token ??
    raw?.data?.access_token ??
    ''
  // User can be nested under .user, .data.user, or at the root level
  const rawUser = raw?.user ?? raw?.data?.user ?? raw
  return { user: normalizeUser(rawUser), token }
}

export const authApi = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.auth.login(), payload)
    return extractAuthResponse(data.data ?? data)
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.auth.register(), payload)
    return extractAuthResponse(data.data ?? data)
  },

  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.auth.logout())
  },

  sendOtp: async (identifier: 'email' | 'phone' = 'email'): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(ENDPOINTS.otp.send(), { identifier })
    return data.data
  },

  verifyOtp: async (otp: string, identifier: 'email' | 'phone' = 'email'): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(ENDPOINTS.otp.verify(), { identifier, otp })
    return data.data
  },

  resendOtp: async (identifier: 'email' | 'phone' = 'email'): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(ENDPOINTS.otp.resend(), { identifier })
    return data.data
  },
}
