import { useQuery } from '@tanstack/react-query'
import { amenitiesApi } from '@/services/amenities.api'

export const AMENITY_QUERY_KEYS = {
  list: (category?: string) => ['amenities', category] as const,
}

/** Fetch all amenities. staleTime 5 min — amenity list rarely changes. */
export const useAmenities = (category?: string) =>
  useQuery({
    queryKey: AMENITY_QUERY_KEYS.list(category),
    queryFn: () => amenitiesApi.list(category),
    staleTime: 5 * 60_000,
  })
