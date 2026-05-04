import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { MarketplaceListing, CreateMarketplacePayload } from '@/types/marketplace.types'

export const marketplaceApi = {
  list: async (params?: Record<string, unknown>): Promise<PaginatedResponse<MarketplaceListing>> => {
    const { data } = await apiClient.get<PaginatedResponse<MarketplaceListing>>(
      ENDPOINTS.marketplace.list(),
      { params },
    )
    return data
  },

  userList: async (): Promise<PaginatedResponse<MarketplaceListing>> => {
    const { data } = await apiClient.get<PaginatedResponse<MarketplaceListing>>(
      ENDPOINTS.marketplace.userList(),
    )
    return data
  },

  detail: async (id: string): Promise<MarketplaceListing> => {
    const { data } = await apiClient.get<ApiResponse<MarketplaceListing>>(
      ENDPOINTS.marketplace.detail(id),
    )
    return data.data
  },

  create: async (payload: CreateMarketplacePayload): Promise<MarketplaceListing> => {
    const { data } = await apiClient.post<ApiResponse<MarketplaceListing>>(
      ENDPOINTS.marketplace.create(),
      payload,
    )
    return data.data
  },

  update: async (id: string, payload: CreateMarketplacePayload): Promise<MarketplaceListing> => {
    const { data } = await apiClient.put<ApiResponse<MarketplaceListing>>(
      ENDPOINTS.marketplace.update(id),
      payload,
    )
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.marketplace.delete(id))
  },
}
