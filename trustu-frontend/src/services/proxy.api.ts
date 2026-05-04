import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { ProxyListing, CreateProxyPayload } from '@/types/proxy.types'

export const proxyApi = {
  list: async (params?: Record<string, unknown>): Promise<PaginatedResponse<ProxyListing>> => {
    const { data } = await apiClient.get<PaginatedResponse<ProxyListing>>(
      ENDPOINTS.proxy.list(),
      { params },
    )
    return data
  },

  userList: async (): Promise<PaginatedResponse<ProxyListing>> => {
    const { data } = await apiClient.get<PaginatedResponse<ProxyListing>>(
      ENDPOINTS.proxy.userList(),
    )
    return data
  },

  detail: async (id: string): Promise<ProxyListing> => {
    const { data } = await apiClient.get<ApiResponse<ProxyListing>>(ENDPOINTS.proxy.detail(id))
    return data.data
  },

  create: async (payload: CreateProxyPayload): Promise<ProxyListing> => {
    const { data } = await apiClient.post<ApiResponse<ProxyListing>>(
      ENDPOINTS.proxy.create(),
      payload,
    )
    return data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(ENDPOINTS.proxy.delete(id))
  },
}
