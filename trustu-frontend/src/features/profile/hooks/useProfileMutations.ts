import { useQuery } from '@tanstack/react-query'
import { profileApi } from '../../../services/profile.api'

export const PROFILE_QUERY_KEY = ['profile', 'me'] as const

/** Fetch the current user's profile from GET /user/profile */
export function useProfileQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileApi.get,
    staleTime: 1000 * 60 * 5, // 5 min
  })
}
