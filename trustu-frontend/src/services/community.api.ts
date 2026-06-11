import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { Community, SubCommunity, CommunityMember } from '@/types/community.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCommunity(raw: any): Community {
  return {
    id:          String(raw?.id ?? ''),
    name:        raw?.name ?? '',
    description: raw?.description ?? '',
    memberCount: Number(raw?.member_count ?? raw?.memberCount ?? 0),
    subCommunities: Array.isArray(raw?.subcommunities)
      ? raw.subcommunities.map(normalizeSubCommunity)
      : undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSubCommunity(raw: any): SubCommunity {
  return {
    id:          String(raw?.id ?? ''),
    name:        raw?.name ?? '',
    memberCount: Number(raw?.member_count ?? raw?.memberCount ?? 0),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMember(raw: any): CommunityMember {
  return {
    id:          String(raw?.id ?? raw?.user_id ?? ''),
    name:        raw?.name ?? raw?.user_name ?? '',
    designation: raw?.designation ?? raw?.profile_type ?? null,
    avatarUrl:   raw?.avatar_url ?? raw?.avatarUrl ?? null,
    joinedAt:    raw?.joined_at ?? raw?.joinedAt ?? raw?.created_at ?? null,
  }
}

export const communityApi = {
  /** GET /communities — paginated list */
  list: async (): Promise<Community[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any>>(ENDPOINTS.community.list())
    const paginated = data.data
    const items = paginated?.data ?? paginated ?? []
    return (Array.isArray(items) ? items : []).map(normalizeCommunity)
  },

  /** GET /communities/{id} — single community with sub-communities */
  detail: async (communityId: string | number): Promise<Community> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any>>(ENDPOINTS.community.detail(communityId))
    return normalizeCommunity(data.data ?? data)
  },

  /** GET /communities/{id}/members */
  members: async (communityId: string | number): Promise<CommunityMember[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any>>(ENDPOINTS.community.members(communityId))
    const items = data.data ?? data ?? []
    return (Array.isArray(items) ? items : []).map(normalizeMember)
  },

  /** GET /communities/sub/{id}/members */
  subMembers: async (subCommunityId: string | number): Promise<CommunityMember[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any>>(ENDPOINTS.community.subMembers(subCommunityId))
    const items = data.data ?? data ?? []
    return (Array.isArray(items) ? items : []).map(normalizeMember)
  },

  /** POST /communities/{id}/join */
  join: async (communityId: string | number): Promise<Community> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.post<ApiResponse<any>>(ENDPOINTS.community.join(communityId))
    return normalizeCommunity(data.data ?? data)
  },

  /** POST /communities/{id}/leave */
  leave: async (communityId: string | number): Promise<void> => {
    await apiClient.post(ENDPOINTS.community.leave(communityId))
  },
}
