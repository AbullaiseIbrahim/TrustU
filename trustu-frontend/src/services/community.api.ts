import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { Community } from '@/types/community.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCommunity(raw: any): Community {
  return {
    id:          String(raw?.id ?? ''),
    name:        raw?.name ?? '',
    description: raw?.description ?? '',
    memberCount: Number(raw?.member_count ?? raw?.memberCount ?? 0),
  }
}

export const communityApi = {
  /** Fetch all communities (created by super admin) */
  list: async (): Promise<Community[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any>>(ENDPOINTS.community.list())
    // Response shape: { data: { data: [...], links: {}, meta: {} } }
    const paginated = data.data
    const items = paginated?.data ?? paginated ?? []
    return (Array.isArray(items) ? items : []).map(normalizeCommunity)
  },

  /** Join a community by its ID */
  join: async (communityId: string | number): Promise<Community> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.post<ApiResponse<any>>(
      ENDPOINTS.community.join(communityId),
    )
    return normalizeCommunity(data.data ?? data)
  },

  /** Leave a community by its ID */
  leave: async (communityId: string | number): Promise<void> => {
    await apiClient.post(ENDPOINTS.community.leave(communityId))
  },
}
