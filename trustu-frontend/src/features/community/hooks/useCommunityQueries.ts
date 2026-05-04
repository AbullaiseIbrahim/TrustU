import { useQuery } from '@tanstack/react-query'
import { communityApi } from '@/services/community.api'

export const COMMUNITY_QUERY_KEYS = {
  list: ['community', 'list'] as const,
}

/** Fetch all communities created by super admin */
export const useCommunities = () =>
  useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.list,
    queryFn: communityApi.list,
    staleTime: 5 * 60 * 1000,
  })
