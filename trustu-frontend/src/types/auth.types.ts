export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say'
export type Designation = 'Student' | 'Faculty' | 'Staff' | 'Alumni' | 'Other'

export interface User {
  id: string
  name: string
  email: string | null
  phone: string | null
  gender: Gender | null
  designation: Designation | null
  institute: string | null
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
  institute?: string
}

export interface SendOtpRequest {
  // OTP endpoints are auth-required (post login/register)
  type: 'email' | 'phone'
}

export interface VerifyOtpRequest {
  otp: string
}

export interface AuthResponse {
  user: User
  token: string   // Laravel Sanctum returns 'token', not 'access_token'
}
