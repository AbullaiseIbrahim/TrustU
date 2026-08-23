import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import { friendshipApi } from '@/services/friendship.api'
import type { Friend } from '@/services/friendship.api'
import { useSnackbar } from '@/app/SnackbarProvider'

export const FRIENDSHIP_KEYS = {
  friends:  ['friends', 'list']    as const,
  pending:  ['friends', 'pending'] as const,
  mutual:   (userId: string) => ['friends', 'mutual', userId] as const,
}

export const useFriends = () =>
  useQuery({
    queryKey: FRIENDSHIP_KEYS.friends,
    queryFn:  friendshipApi.list,
    staleTime: 30_000,
  })

export const usePendingRequests = () =>
  useQuery({
    queryKey: FRIENDSHIP_KEYS.pending,
    queryFn:  friendshipApi.pending,
    staleTime: 30_000,
  })

export const useMutualFriends = (userId: string) =>
  useQuery({
    queryKey: FRIENDSHIP_KEYS.mutual(userId),
    queryFn:  () => friendshipApi.mutual(userId),
    enabled:  !!userId,
    staleTime: 60_000,
  })

/**
 * Real "mutual friends" aggregate — the API only exposes mutual friends relative
 * to one other user (`GET /friends/mutual/{userId}`), not a flat "my mutuals"
 * list. We approximate the flat list by unioning mutual-friend results across
 * the current user's own friends (capped to avoid an unbounded N+1 fan-out).
 */
const MUTUAL_AGGREGATE_CAP = 20

export const useMutualFriendsAggregate = (friendUserIds: string[]) => {
  const capped = friendUserIds.slice(0, MUTUAL_AGGREGATE_CAP)

  const results = useQueries({
    queries: capped.map((userId) => ({
      queryKey: FRIENDSHIP_KEYS.mutual(userId),
      queryFn: () => friendshipApi.mutual(userId),
      enabled: !!userId,
      staleTime: 60_000,
    })),
  })

  const isLoading = capped.length > 0 && results.some((r) => r.isLoading)

  const byId = new Map<string, Friend>()
  results.forEach((r) => {
    (r.data ?? []).forEach((f) => {
      if (!byId.has(f.userId)) byId.set(f.userId, f)
    })
  })

  return { people: Array.from(byId.values()), isLoading }
}

export const useSendFriendRequest = () => {
  const { showSuccess, showError } = useSnackbar()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => friendshipApi.sendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.friends })
      queryClient.invalidateQueries({ queryKey: ['community', 'members'] })
      showSuccess('Friend request sent!')
    },
    onError: () => showError('Could not send friend request.'),
  })
}

/** Cancel a friend request that was previously sent (before it's accepted) */
export const useCancelFriendRequest = () => {
  const { showInfo, showError } = useSnackbar()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => friendshipApi.remove(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.friends })
      queryClient.invalidateQueries({ queryKey: ['community', 'members'] })
      showInfo('Friend request canceled.')
    },
    onError: () => showError('Could not cancel friend request.'),
  })
}

export const useAcceptRequest = () => {
  const { showSuccess, showError } = useSnackbar()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) => friendshipApi.accept(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.friends })
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.pending })
      showSuccess('Friend request accepted!')
    },
    onError: () => showError('Could not accept request.'),
  })
}

export const useRejectRequest = () => {
  const { showError } = useSnackbar()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (requestId: string) => friendshipApi.reject(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.pending })
    },
    onError: () => showError('Could not reject request.'),
  })
}

export const useRemoveFriend = () => {
  const { showInfo, showError } = useSnackbar()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => friendshipApi.remove(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.friends })
      queryClient.invalidateQueries({ queryKey: ['community', 'members'] })
      showInfo('Removed from friends.')
    },
    onError: () => showError('Could not remove friend.'),
  })
}
