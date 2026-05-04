import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types/api.types'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Friend {
  id: string          // friendship/request record id
  userId: string      // the other user's id
  name: string
  designation: string | null
  avatarUrl: string | null
  communityName: string | null
  connectedAt: string | null
}

export interface PendingRequest {
  id: string          // friendship request id (used for accept/reject)
  userId: string      // sender's user id
  name: string
  designation: string | null
  avatarUrl: string | null
  communityName: string | null
  sentAt: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeFriend(raw: any): Friend {
  return {
    id:            String(raw?.id            ?? raw?.friendship_id ?? ''),
    userId:        String(raw?.user_id       ?? raw?.userId        ?? raw?.id ?? ''),
    name:          raw?.name                 ?? '',
    designation:   raw?.designation          ?? raw?.profile_type  ?? null,
    avatarUrl:     raw?.avatar_url           ?? raw?.avatarUrl     ?? null,
    communityName: raw?.community_name       ?? raw?.communityName ?? null,
    connectedAt:   raw?.connected_at         ?? raw?.connectedAt   ?? raw?.created_at ?? null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePending(raw: any): PendingRequest {
  return {
    id:            String(raw?.id            ?? ''),
    userId:        String(raw?.sender_id     ?? raw?.user_id ?? raw?.userId ?? ''),
    name:          raw?.name                 ?? raw?.sender_name ?? '',
    designation:   raw?.designation          ?? raw?.profile_type ?? null,
    avatarUrl:     raw?.avatar_url           ?? raw?.avatarUrl ?? null,
    communityName: raw?.community_name       ?? raw?.communityName ?? null,
    sentAt:        raw?.sent_at              ?? raw?.sentAt ?? raw?.created_at ?? null,
  }
}

// ── API ───────────────────────────────────────────────────────────────────────
export const friendshipApi = {
  /** GET /friends — list of accepted friends */
  list: async (): Promise<Friend[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any[]>>(ENDPOINTS.friends.list())
    const items = data.data ?? data ?? []
    return (Array.isArray(items) ? items : []).map(normalizeFriend)
  },

  /** GET /friends/pending — incoming friend requests */
  pending: async (): Promise<PendingRequest[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any[]>>(ENDPOINTS.friends.pending())
    const items = data.data ?? data ?? []
    return (Array.isArray(items) ? items : []).map(normalizePending)
  },

  /** GET /friends/mutual/{userId} */
  mutual: async (userId: string): Promise<Friend[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any[]>>(ENDPOINTS.friends.mutual(userId))
    const items = data.data ?? data ?? []
    return (Array.isArray(items) ? items : []).map(normalizeFriend)
  },

  /** POST /friends/request/{userId} */
  sendRequest: async (userId: string): Promise<void> => {
    await apiClient.post(ENDPOINTS.friends.sendRequest(userId))
  },

  /** POST /friends/accept/{requestId} */
  accept: async (requestId: string): Promise<void> => {
    await apiClient.post(ENDPOINTS.friends.accept(requestId))
  },

  /** POST /friends/reject/{requestId} */
  reject: async (requestId: string): Promise<void> => {
    await apiClient.post(ENDPOINTS.friends.reject(requestId))
  },

  /** DELETE /friends/{userId} */
  remove: async (userId: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.friends.remove(userId))
  },
}
