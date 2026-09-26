import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { communityApi } from '@/services/community.api'

export const COMMUNITY_QUERY_KEYS = {
  list:       ['community', 'list']                                              as const,
  detail:     (id: string) => ['community', 'detail', id]                       as const,
  members:    (id: string, page: number) => ['community', 'members', id, page]  as const,
  subMembers: (id: string, page: number) => ['community', 'sub-members', id, page] as const,
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

/**
 * Members of a community (paginated). `refetchOnMount: 'always'` -- both
 * consumers (MembersTab, and useNewCommunityMembers below for Discover's
 * "New members") mount/unmount as the user switches tabs, so this makes
 * each switch back issue a fresh request instead of reusing a stale cache.
 */
export const useCommunityMembers = (communityId: string | null | undefined, page = 1) =>
  useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.members(communityId ?? '', page),
    queryFn:  () => communityApi.members(communityId!, page),
    enabled:  !!communityId,
    staleTime: 60_000,
    refetchOnMount: 'always',
  })

/** Members of a sub-community (paginated) */
export const useSubCommunityMembers = (subCommunityId: string | null | undefined, page = 1) =>
  useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.subMembers(subCommunityId ?? '', page),
    queryFn:  () => communityApi.subMembers(subCommunityId!, page),
    enabled:  !!subCommunityId,
    staleTime: 60_000,
  })

/**
 * "New members" for the Discover tab/page -- community members (excluding the
 * current user and anyone already a friend), sorted by how recently they
 * joined. Pulled from the same members list MembersTab already uses (page 1),
 * so it needs no new endpoint.
 *
 * The API's `joined_at` field isn't confirmed to be populated on every
 * environment -- if none of the eligible members have it, this falls back to
 * the list's own (server-decided) order rather than showing nothing, and
 * `hasJoinedAt: false` lets a caller flag that the sort is unconfirmed.
 */
export const useNewCommunityMembers = (
  communityId: string | null | undefined,
  currentUserId: string | null | undefined,
) => {
  const { data, isLoading } = useCommunityMembers(communityId, 1)
  const members = data?.data ?? []

  const ACCEPTED_STATUSES = new Set(['accepted', 'friend', 'friends'])
  const eligible = members.filter((m) => {
    if (currentUserId && String(m.userId) === String(currentUserId)) return false
    return !ACCEPTED_STATUSES.has((m.friendshipStatus ?? '').toLowerCase())
  })

  const hasJoinedAt = eligible.some((m) => !!m.joinedAt)
  const sorted = hasJoinedAt
    ? [...eligible].sort((a, b) => {
        if (!a.joinedAt) return 1
        if (!b.joinedAt) return -1
        return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
      })
    : eligible

  return { members: sorted, isLoading, hasJoinedAt }
}

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
