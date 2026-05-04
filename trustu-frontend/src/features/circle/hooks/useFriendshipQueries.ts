import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { friendshipApi } from '@/services/friendship.api'
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

export const useSendFriendRequest = () => {
  const { showSuccess, showError } = useSnackbar()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => friendshipApi.sendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDSHIP_KEYS.friends })
      showSuccess('Friend request sent!')
    },
    onError: () => showError('Could not send friend request.'),
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
      showInfo('Removed from friends.')
    },
    onError: () => showError('Could not remove friend.'),
  })
}
