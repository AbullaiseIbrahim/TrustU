import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'

// ── Constants (matching API enum values exactly) ──────────────────────────────

/** 0=Shared Room · 1=Short Stay · 2=Flat for Rent · 3=Hostel/PG · 4=Hotel */
export const ACCOMMODATION_TYPES = [
  { value: 0, label: 'Shared Room' },
  { value: 1, label: 'Short Stay' },
  { value: 2, label: 'Flat for Rent' },
  { value: 3, label: 'Hostel / PG' },
  { value: 4, label: 'Hotel' },
] as const

/** 0=Male · 1=Female · 2=Mixed/Any */
export const ACCOMMODATION_GENDERS = [
  { value: 0, label: 'Male' },
  { value: 1, label: 'Female' },
  { value: 2, label: 'Mixed / Any' },
] as const

/** 0=Unfurnished · 1=Semi-furnished · 2=Fully-furnished */
export const FURNISHING_OPTIONS = [
  { value: 0, label: 'Unfurnished' },
  { value: 1, label: 'Semi-furnished' },
  { value: 2, label: 'Fully-furnished' },
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
  depositAmount: number
  cityId: number | null
  communityId: number | null
  subCommunityId: number | null
  /** 0=Shared Room · 1=Short Stay · 2=Flat for Rent · 3=Hostel/PG · 4=Hotel */
  type: number
  isNegotiable: boolean
  availableFrom: string   // YYYY-MM-DD
  /** 0=Male · 1=Female · 2=Mixed */
  gender: number
  /** 1=1BHK · 2=2BHK · 3=3BHK · 4=4BHK */
  flatType: number | null
  securityDeposit: boolean
  floor: number | null
  /** 0=Unfurnished · 1=Semi · 2=Fully */
  furnishing: number
  availableSpots: number
  peopleAllowed: number
  isConnected: boolean
  mutualFriends: number
  createdAt: string
  /** Poster's WhatsApp / phone number (raw string from API, may be empty) */
  phone: string
}

export interface CreateAccommodationPayload {
  title: string
  description?: string
  amount: number
  city_id: number
  community_id?: number | null
  sub_community_id?: number | null
  /** 0=Shared Room · 1=Short Stay · 2=Flat for Rent · 3=Hostel/PG · 4=Hotel */
  type: number
  /** 0=no · 1=yes */
  is_negotiable: boolean
  address: string
  available_from: string  // YYYY-MM-DD
  /** 0=male · 1=female · 2=mixed */
  gender: number
  deposit_amount?: number
  /** 1=1BHK · 2=2BHK · 3=3BHK · 4=4BHK */
  flat_type?: number | null
  /** 0=no · 1=yes */
  security_deposit?: boolean
  floor?: number | null
  /** 0=unfurnished · 1=semi · 2=fully */
  furnishing?: number
  available_spots?: number
  people_allowed?: number
  amenity_ids?: number[]
  photos?: File[]
  /** WhatsApp / contact number for interested users to reach the poster */
  phone?: string
}

export interface UpdateAccommodationPayload {
  id: number
  title?: string
  amount?: number
  available_spots?: number
  is_negotiable?: boolean
  roommate_preference?: number
  flat_type?: number
  floor?: number
  furnishing?: number
  security_deposit?: boolean
  amenity_ids?: number[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(raw: any): Accommodation {
  const post = raw.post ?? {}
  return {
    id:             String(raw.id ?? ''),
    userId:         String(post.user_id      ?? raw.user_id     ?? raw.userId     ?? ''),
    userName:       String(post.user?.name   ?? raw.user_name   ?? raw.userName   ?? ''),
    title:          String(post.title        ?? raw.title       ?? ''),
    address:        String(raw.address       ?? ''),
    description:    String(raw.description   ?? post.description ?? ''),
    amount:         Number(raw.amount        ?? 0),
    depositAmount:  Number(raw.deposit_amount ?? raw.depositAmount ?? 0),
    cityId:         raw.city_id != null ? Number(raw.city_id) : (raw.cityId != null ? Number(raw.cityId) : null),
    communityId:    post.community_id   != null ? Number(post.community_id)   : (raw.community_id  != null ? Number(raw.community_id)  : null),
    subCommunityId: raw.subcommunity_id != null ? Number(raw.subcommunity_id) : (raw.subCommunityId != null ? Number(raw.subCommunityId) : null),
    type:           Number(raw.type          ?? 0),
    isNegotiable:   Boolean(raw.is_negotiable ?? raw.isNegotiable ?? false),
    availableFrom:  String(raw.available_from ?? raw.availableFrom ?? ''),
    gender:         Number(raw.gender        ?? 2),
    flatType:       raw.flat_type  != null ? Number(raw.flat_type)  : (raw.flatType  != null ? Number(raw.flatType)  : null),
    securityDeposit: Boolean(raw.security_deposit ?? raw.securityDeposit ?? false),
    floor:          raw.floor != null ? Number(raw.floor) : null,
    furnishing:     Number(raw.furnishing    ?? 0),
    availableSpots: Number(raw.available_spots ?? raw.availableSpots ?? 0),
    peopleAllowed:  Number(raw.people_allowed  ?? raw.peopleAllowed  ?? 0),
    isConnected:    Boolean(raw.is_connected   ?? raw.isConnected   ?? false),
    mutualFriends:  Number(raw.mutual_friends  ?? raw.mutualFriends  ?? 0),
    createdAt:      String(raw.created_at      ?? raw.createdAt      ?? ''),
    phone:          String(
      raw.phone            ??
      raw.phone_number     ??
      raw.whatsapp         ??
      raw.whatsapp_number  ??
      raw.mobile           ??
      raw.contact          ??
      raw.contact_number   ??
      post.user?.phone     ??
      post.user?.mobile    ??
      '',
    ),
  }
}

// ── API ───────────────────────────────────────────────────────────────────────

export const accommodationApi = {
  list: async (params?: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<any>(ENDPOINTS.accommodation.list(), { params })
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
    const { data } = await apiClient.get<PaginatedResponse<any>>(ENDPOINTS.accommodation.userList())
    return { ...data, data: (data.data ?? []).map(normalize) } as PaginatedResponse<Accommodation>
  },

  detail: async (id: string): Promise<Accommodation> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any>>(ENDPOINTS.accommodation.detail(id))
    return normalize(data.data)
  },

  /** Create uses multipart/form-data (supports photo uploads) */
  create: async (payload: CreateAccommodationPayload): Promise<Accommodation> => {
    const fd = new FormData()
    fd.append('title',          payload.title)
    fd.append('description',    payload.description ?? '')
    fd.append('amount',         String(payload.amount))
    fd.append('city_id',        String(payload.city_id))
    fd.append('type',           String(payload.type))
    fd.append('gender',         String(payload.gender))
    fd.append('address',        payload.address)
    fd.append('available_from', payload.available_from)
    fd.append('is_negotiable',  payload.is_negotiable ? '1' : '0')

    if (payload.community_id     != null) fd.append('community_id',     String(payload.community_id))
    if (payload.sub_community_id != null) fd.append('sub_community_id', String(payload.sub_community_id))
    if (payload.deposit_amount   != null) fd.append('deposit_amount',   String(payload.deposit_amount))
    if (payload.flat_type        != null) fd.append('flat_type',        String(payload.flat_type))
    if (payload.security_deposit != null) fd.append('security_deposit', payload.security_deposit ? '1' : '0')
    if (payload.floor            != null) fd.append('floor',            String(payload.floor))
    if (payload.furnishing       != null) fd.append('furnishing',       String(payload.furnishing))
    if (payload.available_spots  != null) fd.append('available_spots',  String(payload.available_spots))
    if (payload.people_allowed   != null) fd.append('people_allowed',   String(payload.people_allowed))

    payload.amenity_ids?.forEach(id => fd.append('amenity_ids[]', String(id)))
    payload.photos?.forEach(photo   => fd.append('photos[]',      photo))
    if (payload.phone) fd.append('phone', payload.phone)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.post<ApiResponse<any>>(
      ENDPOINTS.accommodation.create(),
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return normalize(data.data)
  },

  /** Update uses JSON (id in body, per API spec) */
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
