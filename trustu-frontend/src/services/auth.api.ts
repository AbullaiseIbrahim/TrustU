import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { AuthResponse, Designation, Gender, LoginRequest, RegisterRequest, User } from '@/types/auth.types'
import { INDIA_STATES } from '@/constants/states'

// Registration sends lowercase values ('male', 'student', ...); the backend may
// echo them back as-is. Downstream <SelectField> options are capitalized
// ('Male', 'Student', ...) and match by strict equality, so without this
// normalization the Edit Profile dropdowns silently fail to pre-select despite
// the data being present (the read-only view "works" only because it prints
// the raw string with no matching involved).
const GENDER_MAP: Record<string, Gender> = {
  male: 'Male', female: 'Female', other: 'Other', 'prefer not to say': 'Prefer not to say',
}
const DESIGNATION_MAP: Record<string, Designation> = {
  student: 'Student', faculty: 'Faculty', staff: 'Staff', alumni: 'Alumni', other: 'Other',
}
function normalizeGender(raw: unknown): Gender | null {
  if (typeof raw !== 'string' || !raw.trim()) return null
  return GENDER_MAP[raw.trim().toLowerCase()] ?? (raw as Gender)
}
function normalizeDesignation(raw: unknown): Designation | null {
  if (typeof raw !== 'string' || !raw.trim()) return null
  return DESIGNATION_MAP[raw.trim().toLowerCase()] ?? (raw as Designation)
}

/**
 * Normalize a raw backend user object (snake_case) → frontend User type (camelCase).
 * Handles all known field name variations returned by the Laravel backend.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeUser(raw: any): User {
  // Laravel can nest profile fields under a `profile` object (same shape used
  // for community members / friends) — fall back to it for every field below.
  const profile = raw?.profile ?? {}

  // Home/native state — API may return a resolved name, or only the ID we sent
  // at registration (native_state_id). Resolve the ID against our own state list
  // as a fallback so "From" isn't blank just because the API echoes an ID.
  const nativeStateRaw =
    raw?.native_state ?? raw?.nativeState ?? profile.native_state ??
    raw?.home_state    ?? profile.home_state ?? null
  const nativeStateId =
    raw?.native_state_id ?? raw?.nativeStateId ?? profile.native_state_id ?? null
  const nativeStateName =
    (typeof nativeStateRaw === 'string' && nativeStateRaw) ||
    nativeStateRaw?.name ||
    (nativeStateId != null ? INDIA_STATES.find(s => s.id === Number(nativeStateId))?.name : null) ||
    null

  // Community — /register and /login return it as a `communities` array (one
  // entry today, since the app only has one live community), not the flat
  // community_id/community_name fields the rest of this normalizer otherwise
  // checks for. Prefer a flat field if the backend ever adds one, then fall
  // back to communities[0] (or a singular `community` object, in case another
  // endpoint shapes it that way) so the user's actual community carries over
  // instead of silently defaulting to "no community".
  const communitiesArr = Array.isArray(raw?.communities) ? raw.communities : []
  const primaryCommunity = raw?.community ?? profile.community ?? communitiesArr[0] ?? null
  const resolvedCommunityId =
    raw?.community_id != null ? String(raw.community_id) :
    raw?.communityId   != null ? String(raw.communityId) :
    primaryCommunity?.id != null ? String(primaryCommunity.id) : null
  const resolvedCommunityName =
    raw?.community_name ?? raw?.communityName ?? primaryCommunity?.name ?? null

  return {
    id:              String(raw?.id ?? ''),
    name:            raw?.name ?? profile.name ?? '',
    email:           raw?.email ?? profile.email ?? null,
    phone:           raw?.phone ?? raw?.phone_number ?? profile.phone ?? null,
    gender:          normalizeGender(raw?.gender ?? profile.gender),
    // Laravel sends profile_type; frontend calls it designation
    designation:     normalizeDesignation(raw?.designation ?? raw?.profile_type ?? profile.designation ?? profile.profile_type),
    institute:       raw?.institute ?? raw?.institution ?? raw?.college ?? profile.institute ?? profile.institution ?? profile.college ?? null,
    nativeStateName,
    // /user/profile, /register and /login all put profile_image at the TOP
    // level of the user object, not nested under `profile` like the other
    // fields this normalizer resolves -- check that first (confirmed against
    // a live GET /user/profile response), then fall back to the nested/other
    // shapes in case some other endpoint ever nests it.
    avatarUrl:       raw?.profile_image ?? profile.profile_image ?? raw?.avatar_url ?? raw?.avatarUrl ?? raw?.avatar ?? null,
    // Only /login and /register responses carry this (as a top-level
    // `user_id` alongside `id`, both equal to the pivot/community-member id
    // -- confirmed against live responses); GET /user/profile has no such
    // field, so this normalizes to null there and AuthProvider is
    // responsible for not letting that null clobber a value already saved.
    communityMemberId: raw?.user_id != null ? String(raw.user_id) : null,
    profileComplete: Boolean(raw?.profile_complete ?? raw?.profileComplete ?? false),
    communityJoined: Boolean(raw?.community_joined ?? raw?.communityJoined ?? (resolvedCommunityId != null)),
    communityId:     resolvedCommunityId,
    communityName:   resolvedCommunityName,
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
    const { profile_image, ...fields } = payload
    // Only switch to multipart when a photo was actually picked -- the common
    // (no-photo) path stays identical JSON, exactly as before.
    if (profile_image) {
      const fd = new FormData()
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) fd.append(key, String(value))
      })
      fd.append('profile_image', profile_image)
      const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
        ENDPOINTS.auth.register(),
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      return extractAuthResponse(data.data ?? data)
    }
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.auth.register(), fields)
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
