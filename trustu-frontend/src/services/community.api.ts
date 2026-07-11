import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
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
  const profile = raw?.profile ?? {}
  return {
    id:          String(raw?.id ?? raw?.user_id ?? ''),
    name:        raw?.name ?? raw?.user_name ?? profile.name ?? '',
    designation: profile.designation ?? profile.profile_type ?? raw?.designation ?? raw?.profile_type ?? null,
    avatarUrl:   profile.profile_image ?? raw?.avatar_url ?? raw?.avatarUrl ?? null,
    joinedAt:    raw?.joined_at ?? raw?.joinedAt ?? raw?.created_at ?? null,
    friendshipStatus: raw?.friendship_status ?? raw?.friendshipStatus ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMembersPage(data: any): PaginatedResponse<CommunityMember> {
  const paginated = data.data ?? {}
  const items: unknown[] = Array.isArray(paginated) ? paginated : (paginated.data ?? [])
  const meta = paginated.meta ?? {}
  return {
    data: items.map(normalizeMember),
    meta: {
      currentPage: meta.current_page ?? 1,
      lastPage:    meta.last_page    ?? 1,
      perPage:     meta.per_page     ?? items.length,
      total:       meta.total        ?? items.length,
      from:        meta.from         ?? 0,
      to:          meta.to           ?? 0,
    },
    message: data.message ?? '',
    success: data.success ?? true,
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

  /** GET /communities/{id}/members — paginated */
  members: async (communityId: string | number, page = 1): Promise<PaginatedResponse<CommunityMember>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any>>(ENDPOINTS.community.members(communityId), { params: { page } })
    return normalizeMembersPage(data)
  },

  /** GET /communities/sub/{id}/members — paginated */
  subMembers: async (subCommunityId: string | number, page = 1): Promise<PaginatedResponse<CommunityMember>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any>>(ENDPOINTS.community.subMembers(subCommunityId), { params: { page } })
    return normalizeMembersPage(data)
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
