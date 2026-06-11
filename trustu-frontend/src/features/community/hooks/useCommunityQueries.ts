import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { communityApi } from '@/services/community.api'

export const COMMUNITY_QUERY_KEYS = {
  list:       ['community', 'list']                                   as const,
  detail:     (id: string) => ['community', 'detail', id]            as const,
  members:    (id: string) => ['community', 'members', id]           as const,
  subMembers: (id: string) => ['community', 'sub-members', id]       as const,
}

/** All communities (created by super admin) */
export const useCommunities = () =>
  useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.list,
    queryFn:  communityApi.list,
    staleTime: 5 * 60_000,
  })

/** Single community detail (includes sub-communities list) */
export const useCommunity = (communityId: string | null | undefined) =>
  useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.detail(communityId ?? ''),
    queryFn:  () => communityApi.detail(communityId!),
    enabled:  !!communityId,
    staleTime: 5 * 60_000,
  })

/** Members of a community */
export const useCommunityMembers = (communityId: string | null | undefined) =>
  useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.members(communityId ?? ''),
    queryFn:  () => communityApi.members(communityId!),
    enabled:  !!communityId,
    staleTime: 60_000,
  })

/** Members of a sub-community */
export const useSubCommunityMembers = (subCommunityId: string | null | undefined) =>
  useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.subMembers(subCommunityId ?? ''),
    queryFn:  () => communityApi.subMembers(subCommunityId!),
    enabled:  !!subCommunityId,
    staleTime: 60_000,
  })

/** Join a sub-community */
export const useJoinCommunity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => communityApi.join(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.list })
    },
  })
}

/** Leave a sub-community */
export const useLeaveCommunity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => communityApi.leave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.list })
    },
  })
}
