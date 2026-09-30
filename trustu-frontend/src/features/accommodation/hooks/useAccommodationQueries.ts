import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  accommodationApi,
  type CreateAccommodationPayload,
  type UpdateAccommodationPayload,
} from '@/services/accommodation.api'
import { postsApi } from '@/services/posts.api'
import { useSnackbar } from '@/app/SnackbarProvider'

export const ACCOMMODATION_KEYS = {
  list: (params?: Record<string, unknown>) => ['accommodations', params] as const,
  userList: ['accommodations', 'user'] as const,
  detail: (id: string) => ['accommodations', id] as const,
}

export const useAccommodations = (
  params?: Record<string, unknown>,
  options?: { enabled?: boolean; staleTime?: number },
) =>
  useQuery({
    queryKey: ACCOMMODATION_KEYS.list(params),
    queryFn: () => accommodationApi.list(params),
    staleTime: options?.staleTime ?? 30_000,
    enabled: options?.enabled ?? true,
  })

export const useUserAccommodations = () =>
  useQuery({
    queryKey: ACCOMMODATION_KEYS.userList,
    queryFn: accommodationApi.userList,
    staleTime: 30_000,
  })

export const useAccommodationDetail = (id: string) =>
  useQuery({
    queryKey: ACCOMMODATION_KEYS.detail(id),
    queryFn: () => accommodationApi.detail(id),
    enabled: !!id,
  })

// Note: none of these mutations set their own onError — a failure still reaches
// the user via the global QueryCache/MutationCache handler in QueryProvider.tsx,
// which shows the real backend error message rather than a hardcoded string.

export const useCreateAccommodation = () => {
  const { showSuccess } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAccommodationPayload) => accommodationApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] })
      showSuccess('Accommodation listed successfully!')
    },
  })
}

export const useUpdateAccommodation = () => {
  const { showSuccess } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAccommodationPayload) => accommodationApi.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] })
      showSuccess('Accommodation updated successfully!')
    },
  })
}

export const useDeleteAccommodation = () => {
  const { showInfo } = useSnackbar()
  const queryClient = useQueryClient()

  return useMutation({
    // A listing is removed by deleting its feed post (DELETE /posts/:postId),
    // same as deleting the post from the community feed.
    mutationFn: (postId: string) => postsApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accommodations'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      showInfo('Listing removed.')
    },
  })
}
