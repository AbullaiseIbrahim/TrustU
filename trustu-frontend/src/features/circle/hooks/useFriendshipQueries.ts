import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { friendshipApi } from '@/services/friendship.api'
import { useSnackbar } from '@/app/SnackbarProvider'

export const FRIENDSHIP_KEYS = {
  friends:  ['friends', 'list']    as const,
  pending:  ['friends', 'pending'] as const,
  fof:      ['friends', 'fof']     as const,
}

// refetchOnMount: 'always' on these three (useFriends, usePendingRequests,
// useFriendsOfFriends below) -- each is read by a tab that mounts/unmounts as
// the user switches tabs (My Friends / Pending Requests / Discover), so this
// makes switching back to one of those tabs issue a fresh request instead of
// silently reusing whatever was cached from staleTime ago. These are also
// read at CommunityPage's top level for the header badge counts, which never
// unmounts -- 'always' only affects new mounts, so that subscription is
// unaffected (no extra refetching there), but it does get the fresher data
// for free whenever a tab-mount refetch completes.
export const useFriends = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: FRIENDSHIP_KEYS.friends,
    queryFn:  friendshipApi.list,
    staleTime: 30_000,
    refetchOnMount: 'always',
    enabled: options?.enabled ?? true,
  })

export const usePendingRequests = () =>
  useQuery({
    queryKey: FRIENDSHIP_KEYS.pending,
    queryFn:  friendshipApi.pending,
    staleTime: 30_000,
    refetchOnMount: 'always',
  })

/**
 * GET /friends/fof — the real, backend-computed "friends of friends" list.
 * A single request (not an N+1 fan-out over the user's own friends).
 * `refetchOnMount: 'always'` -- see the comment above useFriends.
 */
export const useFriendsOfFriends = () =>
  useQuery({
    queryKey: FRIENDSHIP_KEYS.fof,
    queryFn:  friendshipApi.fof,
    staleTime: 30_000,
    refetchOnMount: 'always',
  })

// Note: none of these mutations set their own onError — a failure still reaches
// the user via the global QueryCache/MutationCache handler in QueryProvider.tsx.

export const useSendFriendRequest = () => {
  const { showSuccess } = useSnackbar()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => friendshipApi.sendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.friends })
      queryClient.invalidateQueries({ queryKey: ['community', 'members'] })
      showSuccess('Friend request sent!')
    },
  })
}

/** Cancel a friend request that was previously sent (before it's accepted) */
export const useCancelFriendRequest = () => {
  const { showInfo } = useSnackbar()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => friendshipApi.remove(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.friends })
      queryClient.invalidateQueries({ queryKey: ['community', 'members'] })
      showInfo('Friend request canceled.')
    },
  })
}

export const useAcceptRequest = () => {
  const { showSuccess } = useSnackbar()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) => friendshipApi.accept(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.friends })
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.pending })
      showSuccess('Friend request accepted!')
    },
  })
}

export const useRejectRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) => friendshipApi.reject(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.pending })
    },
  })
}

export const useRemoveFriend = () => {
  const { showInfo } = useSnackbar()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => friendshipApi.remove(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.friends })
      queryClient.invalidateQueries({ queryKey: ['community', 'members'] })
      showInfo('Removed from friends.')
    },
  })
}
