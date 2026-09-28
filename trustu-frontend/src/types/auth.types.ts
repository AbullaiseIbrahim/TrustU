export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say'
export type Designation = 'Student' | 'Faculty' | 'Staff' | 'Alumni' | 'Other'

export interface User {
  id: string
  /**
   * The id used everywhere a post/comment/accommodation/friend record
   * refers to "who authored/owns this" (posts.user_id, accommodations'
   * post.user_id, friends' userId, etc.) -- a *different*, backend-internal
   * numbering than `id` above. `id` comes from GET /user/profile, which
   * never returns this second id at all; the only place the API exposes it
   * is the raw `user_id` field on the /login and /register responses, so
   * it's captured there and preserved across profile refreshes/edits (see
   * AuthProvider's syncProfile/updateUser) rather than re-derived later.
   * Null until a login/register response has been seen this session.
   */
  communityMemberId: string | null
  name: string
  email: string | null
  phone: string | null
  gender: Gender | null
  designation: Designation | null
  institute: string | null
  /** Home/native state name, e.g. "Kerala" — resolved from native_state_id if the API only returns an ID */
  nativeStateName: string | null
  avatarUrl: string | null
  profileComplete: boolean
  communityJoined: boolean
  communityId: string | null
  communityName: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  tokenType: string
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Request payloads — matching Laravel API
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  profile_type: string        // 'student' | 'faculty' | 'staff' | 'alumni'
  native_state_id: number     // home state ID — backend uses this to auto-assign community
  current_state_id: number    // current state ID — required for community assignment
  gender?: string
  phone?: string
  /** Profile photo picked during registration, if any. */
  profile_image?: File | null
}

export interface SendOtpRequest {
  identifier: 'email' | 'phone'
}

export interface VerifyOtpRequest {
  identifier: 'email' | 'phone'
  otp: string
}

export interface AuthResponse {
  user: User
  token: string   // Laravel Sanctum returns 'token', not 'access_token'
}
