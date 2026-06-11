import apiClient from './apiClient'
import { ENDPOINTS } from './endpoints'
import type { ApiResponse } from '@/types/api.types'

export interface Amenity {
  id: number
  name: string
  category?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAmenity(raw: any): Amenity {
  return {
    id:       Number(raw.id ?? 0),
    name:     String(raw.name ?? raw.label ?? ''),
    category: raw.category ? String(raw.category) : undefined,
  }
}

export const amenitiesApi = {
  list: async (category?: string): Promise<Amenity[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiResponse<any>>(
      ENDPOINTS.amenities.list(),
      category ? { params: { category } } : undefined,
    )
    const items = data.data ?? data ?? []
    return (Array.isArray(items) ? items : []).map(normalizeAmenity)
  },
}
