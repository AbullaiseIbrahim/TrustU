import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'

// ── Constants ─────────────────────────────────────────────────────────────────
/** 0 = Room, 1 = Apartment, 2 = House */
export const ACCOMMODATION_TYPES = [
  { value: 0, label: 'Room' },
  { value: 1, label: 'Apartment' },
  { value: 2, label: 'House' },
] as const

/** 0 = Any, 1 = Male only, 2 = Female only */
export const ACCOMMODATION_GENDERS = [
  { value: 0, label: 'Any' },
  { value: 1, label: 'Male only' },
  { value: 2, label: 'Female only' },
] as const

export const accommodationTypeLabel = (v: number) =>
  ACCOMMODATION_TYPES.find(t => t.value === v)?.label ?? String(v)

export const accommodationGenderLabel = (v: number) =>
  ACCOMMODATION_GENDERS.find(g => g.value === v)?.label ?? String(v)

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Accommodation {
  id: string
  userId: string
  userName: string
  title: string
  address: string
  description: string
  amount: number
  cityId: number
  communityId: number | null
  subCommunityId: number | null
  type: number          // 0=Room, 1=Apartment, 2=House
  isNegotiable: boolean
  availableFrom: string // YYYY-MM-DD
  gender: number        // 0=Any, 1=Male, 2=Female
  isConnected: boolean
  mutualFriends: number
  createdAt: string
}

export interface CreateAccommodationPayload {
  title: string
  description: string
  amount: number
  city_id: number
  community_id: number | null
  sub_community_id: number | null
  type: number
  is_negotiable: boolean
  address: string
  available_from: string
  gender: number
}

export interface UpdateAccommodationPayload extends Partial<CreateAccommodationPayload> {
  id: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(raw: any): Accommodation {
  // Title and community live inside the nested `post` object
  const post = raw.post ?? {}
  return {
    id:             String(raw.id ?? ''),
    userId:         String(post.user_id      ?? raw.user_id     ?? raw.userId     ?? ''),
    userName:       String(post.user?.name   ?? raw.user_name   ?? raw.userName   ?? ''),
    title:          String(post.title        ?? raw.title       ?? ''),
    address:        String(raw.address       ?? ''),
    description:    String(raw.description   ?? post.description ?? ''),
    amount:         Number(raw.amount        ?? 0),
    cityId:         Number(raw.city_id       ?? raw.cityId      ?? 0),
    communityId:    post.community_id     != null ? Number(post.community_id)     : (raw.communityId     ?? null),
    subCommunityId: raw.subcommunity_id   != null ? Number(raw.subcommunity_id)   : (raw.subCommunityId  ?? null),
    type:           Number(raw.type          ?? 0),
    isNegotiable:   Boolean(raw.is_negotiable ?? raw.isNegotiable ?? false),
    availableFrom:  String(raw.available_from ?? raw.availableFrom ?? ''),
    gender:         Number(raw.gender        ?? 0),
    isConnected:    Boolean(raw.is_connected  ?? raw.isConnected  ?? false),
    mutualFriends:  Number(raw.mutual_friends ?? raw.mutualFriends ?? 0),
    createdAt:      String(raw.created_at     ?? raw.createdAt    ?? ''),
  }
}

// ── API ───────────────────────────────────────────────────────────────────────
export const accommodationApi = {
  list: async (params?: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<any>(
      ENDPOINTS.accommodation.list(),
      { params },
    )
    // Laravel returns pagination fields at the top level (snake_case).
    // Mock data wraps them under `meta`. Handle both.
    return {
      data:    (data.data ?? []).map(normalize),
      meta: {
        total:       data.total        ?? data.meta?.total       ?? 0,
        currentPage: data.current_page ?? data.meta?.currentPage ?? 1,
        lastPage:    data.last_page    ?? data.meta?.lastPage    ?? 1,
        perPage:     data.per_page     ?? data.meta?.perPage     ?? 15,
        from:        data.from         ?? data.meta?.from        ?? 0,
        to:          data.to           ?? data.meta?.to          ?? 0,
      },
      message: data.message ?? '',
      success: data.success ?? true,
    } as PaginatedResponse<Accommodation>
  },

  userList: async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<PaginatedResponse<any>>(
      ENDPOINTS.accommodation.userList(),
    )
    return {
      ...data,
      data: (data.data ?? []).map(normalize),
    } as PaginatedResponse<Accommodation>
  },

  detail: async (id: string): Promise<Accommodation> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any>>(
      ENDPOINTS.accommodation.detail(id),
    )
    return normalize(data.data)
  },

  create: async (payload: CreateAccommodationPayload): Promise<Accommodation> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.post<ApiResponse<any>>(
      ENDPOINTS.accommodation.create(),
      payload,
    )
    return normalize(data.data)
  },

  // PUT /accommodations — id lives in the body per the API spec
  update: async (payload: UpdateAccommodationPayload): Promise<Accommodation> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.put<ApiResponse<any>>(
      ENDPOINTS.accommodation.update(),
      payload,
    )
    return normalize(data.data)
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.accommodation.delete(id))
  },
}
